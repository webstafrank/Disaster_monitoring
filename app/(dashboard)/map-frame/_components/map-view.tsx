"use client";

import { useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import type Feature from "ol/Feature";
import type { FeatureLike } from "ol/Feature";
import { fromLonLat } from "ol/proj";
import { Style, Fill, Stroke } from "ol/style";
import "ol/ol.css";

type Props = {
  // Parsed GeoJSON FeatureCollection of county boundaries (any standard schema).
  geojson: unknown | null;
  selectedId: string | null;
  onSelect?: (id: string) => void;
  // Maps a feature's properties to a catalog county id, or null if it matches none.
  resolveId: (props: Record<string, unknown>) => string | null;
  // Used only when the selected county has no geometry in the file.
  fallbackCenter: [number, number]; // [lat, lon]
  fallbackZoom: number;
};

const SELECTED = new Style({
  fill: new Fill({ color: "rgba(23, 78, 166, 0.28)" }),
  stroke: new Stroke({ color: "#174ea6", width: 3 }),
});
const BASE = new Style({
  fill: new Fill({ color: "rgba(148, 163, 184, 0.10)" }),
  stroke: new Stroke({ color: "#64748b", width: 1.5 }),
});

export default function MapView({
  geojson,
  selectedId,
  onSelect,
  resolveId,
  fallbackCenter,
  fallbackZoom,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);
  const layerRef = useRef<VectorLayer | null>(null);

  // Latest values read inside the (stable) style/click callbacks and effects, so a
  // county switch never rebuilds the map or churns effect dependencies.
  const selectedRef = useRef<string | null>(selectedId);
  const onSelectRef = useRef(onSelect);
  const resolveRef = useRef(resolveId);
  const fallbackRef = useRef({ center: fallbackCenter, zoom: fallbackZoom });
  useEffect(() => void (onSelectRef.current = onSelect), [onSelect]);
  useEffect(() => void (resolveRef.current = resolveId), [resolveId]);
  useEffect(() => void (fallbackRef.current = { center: fallbackCenter, zoom: fallbackZoom }), [fallbackCenter, fallbackZoom]);

  // Build the map once, when the GeoJSON first arrives.
  useEffect(() => {
    if (!mapRef.current || !geojson || mapInstance.current) return;
    const { center: fbCenter, zoom: fbZoom } = fallbackRef.current;

    const features = new GeoJSON().readFeatures(geojson, {
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857",
    }) as Feature[];
    const source = new VectorSource({ features });

    const styleFn = (feature: FeatureLike) => {
      const id = resolveRef.current(feature.getProperties() as Record<string, unknown>);
      return id && id === selectedRef.current ? SELECTED : BASE;
    };
    const layer = new VectorLayer({ source, style: styleFn });
    layerRef.current = layer;

    const map = new Map({
      target: mapRef.current,
      layers: [new TileLayer({ source: new OSM() }), layer],
      view: new View({
        center: fromLonLat([fbCenter[1], fbCenter[0]]),
        zoom: fbZoom,
      }),
    });

    const extent = source.getExtent();
    if (features.length && extent) {
      map.getView().fit(extent, { padding: [30, 30, 30, 30], maxZoom: 8 });
    }

    map.on("click", (evt) => {
      map.forEachFeatureAtPixel(evt.pixel, (f) => {
        const id = resolveRef.current(f.getProperties() as Record<string, unknown>);
        if (id) onSelectRef.current?.(id);
        return true; // stop at the first hit
      });
    });

    // Pointer cursor over selectable counties.
    map.on("pointermove", (evt) => {
      const el = map.getTargetElement();
      if (el) el.style.cursor = map.hasFeatureAtPixel(evt.pixel) ? "pointer" : "";
    });

    mapInstance.current = map;
    return () => {
      map.setTarget(undefined);
      mapInstance.current = null;
      layerRef.current = null;
    };
  }, [geojson]);

  // Re-style and zoom to the selected county when it changes.
  useEffect(() => {
    selectedRef.current = selectedId;
    const map = mapInstance.current;
    const layer = layerRef.current;
    if (!map || !layer) return;
    layer.changed();

    const source = layer.getSource();
    const feat = source
      ?.getFeatures()
      .find((f) => resolveRef.current(f.getProperties() as Record<string, unknown>) === selectedId);

    if (feat) {
      map.getView().fit(feat.getGeometry()!.getExtent(), {
        padding: [40, 40, 40, 40],
        maxZoom: 9,
        duration: 500,
      });
    } else {
      const { center, zoom } = fallbackRef.current;
      map.getView().animate({
        center: fromLonLat([center[1], center[0]]),
        zoom,
        duration: 500,
      });
    }
  }, [selectedId]);

  return (
    <div className="h-full min-h-[460px] w-full overflow-hidden rounded-[1.5rem] border border-[var(--line)] shadow-inner md:min-h-[520px] xl:min-h-[620px]">
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
