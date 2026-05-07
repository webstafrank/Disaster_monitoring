"use client";

import { useEffect, useState, useRef, useCallback, memo } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import type { GeoJsonObject } from "geojson";
import "leaflet/dist/leaflet.css";

if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: unknown })._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

const ChangeView = memo(function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  const prevCenter = useRef(center);
  const prevZoom = useRef(zoom);

  useEffect(() => {
    const centerChanged = prevCenter.current[0] !== center[0] || prevCenter.current[1] !== center[1];
    const zoomChanged = prevZoom.current !== zoom;

    if (centerChanged || zoomChanged) {
      map.setView(center, zoom, { animate: true, duration: 0.8 });
      prevCenter.current = center;
      prevZoom.current = zoom;
    }
  }, [map, center, zoom]);

  return null;
});

/* ─── GeoJSON layer ─── */
const GeoJSONLayer = memo(function GeoJSONLayer({ data }: { data: GeoJsonObject }) {
  const style = useCallback(() => ({
    color: "#174ea6",
    weight: 2,
    fillColor: "#dbeafe",
    fillOpacity: 0.4,
  }), []);

  const onEachFeature = useCallback((feature: any, layer: L.Layer) => {
    if (feature.properties?.name) {
      layer.bindPopup(
        `<strong>${feature.properties.name}</strong><br/>${feature.properties.description || ""}`
      );
    }
  }, []);

  return <GeoJSON data={data} style={style} onEachFeature={onEachFeature} />;
});

const StableMap = memo(function StableMap({
  center,
  zoom,
  geoData,
}: {
  center: [number, number];
  zoom: number;
  geoData: GeoJsonObject | null;
}) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "100%", width: "100%", background: "#e5e7eb" }}
      scrollWheelZoom={true}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {geoData && <GeoJSONLayer data={geoData} />}
      <ChangeView center={center} zoom={zoom} />
    </MapContainer>
  );
});

export default function MapView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const [geoData, setGeoData] = useState<GeoJsonObject | null>(null);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    fetch("/region.geojson")
      .then((res) => res.json())
      .then((data: GeoJsonObject) => setGeoData(data))
      .catch((err) => console.error("Error loading GeoJSON:", err));
  }, []);

  return (
    <div className="h-full w-full overflow-hidden rounded-2xl border border-[var(--line)] shadow-inner">
      <StableMap center={center} zoom={zoom} geoData={geoData} />
    </div>
  );
}