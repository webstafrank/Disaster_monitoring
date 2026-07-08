"use client";

import { useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { fromLonLat } from "ol/proj";
import { Style, Fill, Stroke } from "ol/style";
import "ol/ol.css";

export default function MapView({ center, zoom }: { center: [number, number], zoom: number }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstanceRef.current) return;

    const centerLonLat = [center[1], center[0]];

    const vectorSource = new VectorSource({
      url: "/region.geojson",
      format: new GeoJSON(),
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        fill: new Fill({
          color: "rgba(219, 234, 254, 0.4)",
        }),
        stroke: new Stroke({
          color: "#174ea6",
          width: 2,
        }),
      }),
    });

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat(centerLonLat),
        zoom: zoom,
      }),
    });

    mapInstanceRef.current = map;

    return () => {
      map.setTarget(undefined);
      mapInstanceRef.current = null;
    };
  }, []); // Initialize once

  useEffect(() => {
    if (mapInstanceRef.current) {
      const centerLonLat = [center[1], center[0]];
      mapInstanceRef.current.getView().animate({
        center: fromLonLat(centerLonLat),
        zoom: zoom,
        duration: 500,
      });
    }
  }, [center, zoom]);

  return (
    <div className="h-full min-h-[460px] w-full overflow-hidden rounded-[1.5rem] border border-[var(--line)] shadow-inner md:min-h-[520px] xl:min-h-[620px]">
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
