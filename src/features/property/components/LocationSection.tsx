import {
  MapPin,
  Navigation,
  ExternalLink,
  School,
  Heart,
  ShoppingBag,
  Bus,
  Coffee,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Property } from "../../../types";

interface QuickPlace {
  name: string;
  icon: any;
  color: string;
  distance: number;
}

export const LocationSection: React.FC<{ property: Property }> = ({
  property,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [showFullMap, setShowFullMap] = useState(false);

  const quickPlaces: QuickPlace[] = [
    { name: "Schools", icon: School, color: "#3b82f6", distance: 0.8 },
    { name: "Hospital", icon: Heart, color: "#ef4444", distance: 1.2 },
    { name: "Shopping", icon: ShoppingBag, color: "#6366f1", distance: 0.5 },
    { name: "Transit", icon: Bus, color: "#f59e0b", distance: 0.3 },
    { name: "Cafes", icon: Coffee, color: "#10b981", distance: 0.4 },
  ];

  useEffect(() => {
    if (!property.latitude || !property.longitude || !showFullMap) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    link.crossOrigin = "";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
    script.crossOrigin = "";
    script.async = true;

    script.onload = () => {
      if (!mapContainerRef.current || !(window as any).L) return;
      try {
        const L = (window as any).L;
        const map = L.map(mapContainerRef.current).setView(
          [property.latitude, property.longitude],
          14,
        );
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        const icon = L.divIcon({
          className: "custom-marker",
          html: `<div style="background:linear-gradient(135deg,#3b82f6,#2563eb);width:34px;height:34px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 4px 10px rgba(37,99,235,.4);display:flex;align-items:center;justify-content:center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" style="transform:rotate(45deg)"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          </div>`,
          iconSize: [34, 34],
          iconAnchor: [17, 34],
          popupAnchor: [0, -34],
        });
        L.marker([property.latitude, property.longitude], { icon })
          .addTo(map)
          .bindPopup(
            `<div style="padding:8px;min-width:160px;"><div style="font-weight:700;font-size:13px;color:#111">${property.title}</div><div style="font-size:11px;color:#6b7280;margin:2px 0">${property.locality}</div><div style="font-size:13px;font-weight:800;color:#2563eb">${property.currency} ${property.price.toLocaleString()}</div></div>`,
          );
        L.circle([property.latitude, property.longitude], {
          color: "#3b82f6",
          fillColor: "#3b82f6",
          fillOpacity: 0.06,
          radius: 500,
          weight: 1.5,
        }).addTo(map);
        mapRef.current = map;
        setMapLoaded(true);
        setTimeout(() => map.invalidateSize(), 100);
      } catch {
        setMapError(true);
      }
    };
    script.onerror = () => setMapError(true);
    document.head.appendChild(script);

    return () => {
      if (mapRef.current) mapRef.current.remove();
      if (document.head.contains(link)) document.head.removeChild(link);
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, [property, showFullMap]);

  const openGoogleMaps = () =>
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}`,
      "_blank",
    );
  const getDirections = () =>
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`,
      "_blank",
    );

  return (
    <div className="bg-white border border-blue-100 rounded-xl overflow-hidden">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-blue-50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-200 flex-shrink-0">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-gray-900">
              Location
            </h3>
            <p className="text-[11px] text-gray-400">
              {property.locality}, {property.city.name}
            </p>
          </div>
        </div>
        <button
          onClick={openGoogleMaps}
          className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-2.5 py-1 rounded-full transition-colors"
        >
          <ExternalLink className="w-3 h-3" /> Open
        </button>
      </div>

      <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
        {/* Address pill */}
        <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl">
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            {property.address}, {property.locality}
            <br />
            {property.city.name}
            {property.state ? `, ${property.state}` : ""}, {property.country}
            {property.zipCode ? ` — ${property.zipCode}` : ""}
          </p>
        </div>

        {/* Quick places grid */}
        {property.latitude && property.longitude && (
          <>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-900">
                  What's Nearby
                </span>
                <button
                  onClick={() => setShowFullMap((s) => !s)}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-full border border-blue-100 transition-colors"
                >
                  {showFullMap ? "Hide map" : "View map"}
                </button>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {quickPlaces.map((p, i) => {
                  const Icon = p.icon;
                  return (
                    <div
                      key={i}
                      className="flex flex-col items-center p-2 bg-gray-50 border border-gray-100 hover:border-blue-100 hover:bg-blue-50/40 rounded-xl transition-colors text-center"
                    >
                      <div
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center mb-1"
                        style={{ backgroundColor: `${p.color}18` }}
                      >
                        <Icon
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                          style={{ color: p.color }}
                        />
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-semibold text-gray-700 leading-tight">
                        {p.name}
                      </span>
                      <span className="text-[8px] sm:text-[9px] text-gray-400 mt-0.5">
                        {p.distance}km
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Expandable map */}
            {showFullMap && (
              <div className="rounded-xl overflow-hidden border border-blue-100 shadow-sm">
                <div
                  ref={mapContainerRef}
                  className="h-44 sm:h-56 md:h-64 bg-blue-50 relative"
                  style={{ zIndex: 1 }}
                >
                  {!mapLoaded && !mapError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                      <div className="text-center">
                        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        <span className="text-[11px] text-gray-500 font-medium">
                          Loading map…
                        </span>
                      </div>
                    </div>
                  )}
                  {mapError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                      <div className="text-center">
                        <Navigation className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <span className="text-[11px] text-gray-500">
                          Map unavailable
                        </span>
                      </div>
                    </div>
                  )}
                  {mapLoaded && (
                    <button
                      onClick={() =>
                        mapRef.current?.setView(
                          [property.latitude, property.longitude],
                          14,
                        )
                      }
                      className="absolute top-2.5 right-2.5 z-10 bg-white border border-blue-100 shadow-sm p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5 text-blue-600" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* CTA buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={getDirections}
                className="flex items-center justify-center gap-1.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-sm shadow-blue-200"
              >
                <Navigation className="w-3.5 h-3.5" /> Directions
              </button>
              <button
                onClick={openGoogleMaps}
                className="flex items-center justify-center gap-1.5 py-2.5 bg-white hover:bg-blue-50 text-blue-600 text-xs sm:text-sm font-bold rounded-xl border border-blue-200 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Google Maps
              </button>
            </div>
          </>
        )}

        {/* No coordinates fallback */}
        {(!property.latitude || !property.longitude) && (
          <div className="border-2 border-dashed border-blue-100 rounded-xl p-5 text-center">
            <MapPin className="w-8 h-8 text-blue-200 mx-auto mb-2" />
            <p className="text-xs font-semibold text-gray-600">
              Exact location not available
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Contact the owner for details
            </p>
          </div>
        )}

        {/* Location stat pills */}
        <div className="grid grid-cols-3 gap-1.5">
          {[
            {
              label: "City",
              value: property.city.name,
              color: "bg-blue-50 text-blue-700 border-blue-100",
            },
            {
              label: "Locality",
              value: property.locality,
              color: "bg-indigo-50 text-indigo-700 border-indigo-100",
            },
            {
              label: "Pincode",
              value: property.zipCode || "N/A",
              color: "bg-gray-50 text-gray-600 border-gray-100",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className={`text-center py-2 px-1 rounded-xl border ${color}`}
            >
              <div className="text-[11px] sm:text-xs font-bold truncate">
                {value}
              </div>
              <div className="text-[9px] sm:text-[10px] font-medium opacity-70 mt-0.5">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
