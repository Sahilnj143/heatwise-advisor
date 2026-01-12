import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { HeatZone, getRiskColor, getRiskOpacity } from "@/lib/heatZones";

interface HeatMapProps {
  zones: HeatZone[];
  mapboxToken: string;
  onZoneSelect: (zone: HeatZone) => void;
  selectedZone: HeatZone | null;
}

export function HeatMap({ zones, mapboxToken, onZoneSelect, selectedZone }: HeatMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    // Center on Manila
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [121.0, 14.6],
      zoom: 11,
      pitch: 30,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      "top-right"
    );

    map.current.on("load", () => {
      // Add heat zone circles
      zones.forEach((zone) => {
        const color = getRiskColor(zone.riskLevel);
        const opacity = getRiskOpacity(zone.riskLevel);

        // Create marker element
        const el = document.createElement("div");
        el.className = "heat-zone-marker";
        el.style.cssText = `
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: radial-gradient(circle, ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%);
          cursor: pointer;
          transition: transform 0.2s ease;
        `;

        el.addEventListener("mouseenter", () => {
          el.style.transform = "scale(1.1)";
        });
        el.addEventListener("mouseleave", () => {
          el.style.transform = "scale(1)";
        });
        el.addEventListener("click", () => {
          onZoneSelect(zone);
        });

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat(zone.coordinates)
          .addTo(map.current!);

        markersRef.current.push(marker);
      });
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.current?.remove();
    };
  }, [mapboxToken, zones, onZoneSelect]);

  // Fly to selected zone
  useEffect(() => {
    if (selectedZone && map.current) {
      map.current.flyTo({
        center: selectedZone.coordinates,
        zoom: 13,
        duration: 1000,
      });
    }
  }, [selectedZone]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 glass-card rounded-lg p-3">
        <p className="text-xs font-medium text-foreground mb-2">Heat Risk Level</p>
        <div className="space-y-1.5">
          {(["LOW", "MODERATE", "HIGH", "EXTREME"] as const).map((level) => (
            <div key={level} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getRiskColor(level) }}
              />
              <span className="text-xs text-muted-foreground capitalize">
                {level.toLowerCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
