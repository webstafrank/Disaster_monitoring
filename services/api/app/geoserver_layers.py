"""GeoServer map-layer catalog for the map view.

GeoServer publishes the WMS *map layers* (rasters and boundaries) the frontend
draws on the map. This module discovers what is published by reading the WMS
GetCapabilities document (anonymous, no credentials) and returns a normalized
catalog plus the browser-facing WMS endpoint the map tiles from.

Discovery is dynamic on purpose: layer names live in GeoServer, not in this repo,
so publishing a new layer surfaces it here with no code change. If GeoServer is
unconfigured or unreachable the catalog comes back available=False with an empty
layer list, so the map still renders its basemap and county boundaries.
"""

from __future__ import annotations

import time
import xml.etree.ElementTree as ET
from typing import Callable, Optional

import httpx

from . import config
from .schemas import MapLayer, MapLayerCatalog

# A fetcher takes (capabilities_url, timeout_s) and returns the XML bytes, or None
# when GeoServer cannot be reached. Injectable so gate tests never touch the network.
Fetcher = Callable[[str, float], Optional[bytes]]

_CACHE_TTL_S = 300.0
_cache: dict[str, tuple[float, MapLayerCatalog]] = {}


def _local(tag: str) -> str:
    """Element tag without its XML namespace (WMS 1.3.0 is namespaced, 1.1.1 is not)."""
    return tag.rsplit("}", 1)[-1]


def wms_endpoint(base_url: str, workspace: str) -> str:
    """WMS GetMap/GetCapabilities endpoint, workspace-scoped when a workspace is set."""
    if not base_url:
        return ""
    return f"{base_url}/{workspace}/wms" if workspace else f"{base_url}/wms"


def _capabilities_url(base_url: str, workspace: str) -> str:
    return f"{wms_endpoint(base_url, workspace)}?service=WMS&version=1.3.0&request=GetCapabilities"


def parse_capabilities(xml_bytes: bytes, workspace: str = "") -> list[MapLayer]:
    """Pull the named (leaf) layers out of a WMS GetCapabilities document.

    A published layer is a <Layer> element carrying a <Name>; the root container
    <Layer> has only a <Title> and child layers, so it is skipped.
    """
    try:
        root = ET.fromstring(xml_bytes)
    except ET.ParseError:
        return []

    layers: list[MapLayer] = []
    for el in root.iter():
        if _local(el.tag) != "Layer":
            continue
        name_el = title_el = bbox_el = None
        for child in el:
            lc = _local(child.tag)
            if lc == "Name":
                name_el = child
            elif lc == "Title":
                title_el = child
            elif lc == "EX_GeographicBoundingBox":
                bbox_el = child
        if name_el is None or not (name_el.text or "").strip():
            continue  # container layer, not a published one
        name = name_el.text.strip()
        title = (title_el.text or "").strip() if title_el is not None else ""
        bbox = None
        if bbox_el is not None:
            edge = {_local(c.tag): c.text for c in bbox_el}
            try:
                bbox = [
                    float(edge["westBoundLongitude"]),
                    float(edge["southBoundLatitude"]),
                    float(edge["eastBoundLongitude"]),
                    float(edge["northBoundLatitude"]),
                ]
            except (KeyError, TypeError, ValueError):
                bbox = None
        ws = name.split(":", 1)[0] if ":" in name else (workspace or None)
        layers.append(
            MapLayer(
                name=name,
                title=title or name,
                workspace=ws,
                bbox=bbox,
                queryable=el.get("queryable") == "1",
            )
        )
    return layers


def _http_fetch(url: str, timeout_s: float) -> Optional[bytes]:
    try:
        r = httpx.get(url, timeout=timeout_s)
        r.raise_for_status()
        return r.content
    except httpx.HTTPError:
        return None


def get_catalog(fetcher: Optional[Fetcher] = None, use_cache: bool = True) -> MapLayerCatalog:
    """Discover the published WMS layers. Never raises: an unconfigured or
    unreachable GeoServer yields available=False with an empty layer list."""
    base = config.GEOSERVER_URL
    workspace = config.GEOSERVER_WORKSPACE
    public_wms = wms_endpoint(config.GEOSERVER_PUBLIC_URL, workspace)

    if not base:
        return MapLayerCatalog(
            wms_base_url=public_wms, workspace=workspace or None, available=False, layers=[]
        )

    cache_key = f"{base}|{workspace}"
    caching = use_cache and fetcher is None
    if caching:
        hit = _cache.get(cache_key)
        if hit and (time.monotonic() - hit[0]) < _CACHE_TTL_S:
            return hit[1]

    fetch = fetcher or _http_fetch
    xml = fetch(_capabilities_url(base, workspace), config.GEOSERVER_TIMEOUT_S)
    if xml is None:
        catalog = MapLayerCatalog(
            wms_base_url=public_wms, workspace=workspace or None, available=False, layers=[]
        )
    else:
        catalog = MapLayerCatalog(
            wms_base_url=public_wms,
            workspace=workspace or None,
            available=True,
            layers=parse_capabilities(xml, workspace),
        )

    if caching:
        _cache[cache_key] = (time.monotonic(), catalog)
    return catalog
