"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import type { GeoJsonObject } from "geojson";

function ChangeView({ center, zoom }: { center: L.LatLngExpression, zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function MapView({ center, zoom }: { center: [number, number], zoom: number }) {
  const [geoData, setGeoData] = useState<GeoJsonObject | null>(null);

  useEffect(() => {
    // Fix for default marker icons in Leaflet with Next.js
    delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: unknown })._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    fetch("/region.geojson")
      .then((res) => res.json())
      .then((data: GeoJsonObject) => setGeoData(data))
      .catch((err) => console.error("Error loading GeoJSON:", err));
  }, []);

  return (
    <div className="h-full min-h-[460px] w-full overflow-hidden rounded-[1.5rem] border border-[var(--line)] shadow-inner md:min-h-[520px] xl:min-h-[620px]">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoData && (
          <GeoJSON 
            data={geoData} 
            style={{
              color: "#174ea6",
              weight: 2,
              fillColor: "#dbeafe",
              fillOpacity: 0.4
            }}
            onEachFeature={(feature, layer) => {
              if (feature.properties && feature.properties.name) {
                layer.bindPopup(`<strong>${feature.properties.name}</strong><br/>${feature.properties.description || ""}`);
              }
            }}
          />
        )}
        <ChangeView center={center} zoom={zoom} />
      </MapContainer>
    </div>
  );
}
