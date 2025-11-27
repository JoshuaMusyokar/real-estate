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

interface NearbyPlace {
  name: string;
  type: string;
  distance: number;
  icon: any;
  color: string;
}

export const LocationSection: React.FC<{ property: Property }> = ({
  property,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [showFullMap, setShowFullMap] = useState(false);

  // Mock nearby places - In production, fetch from your API or Google Places
  const nearbyPlaces: NearbyPlace[] = [
    {
      name: "Schools",
      type: "school",
      distance: 0.8,
      icon: School,
      color: "#3b82f6",
    },
    {
      name: "Hospitals",
      type: "hospital",
      distance: 1.2,
      icon: Heart,
      color: "#ef4444",
    },
    {
      name: "Shopping",
      type: "shopping",
      distance: 0.5,
      icon: ShoppingBag,
      color: "#8b5cf6",
    },
    {
      name: "Transit",
      type: "transit",
      distance: 0.3,
      icon: Bus,
      color: "#f59e0b",
    },
    {
      name: "Cafes",
      type: "cafe",
      distance: 0.4,
      icon: Coffee,
      color: "#10b981",
    },
  ];

  useEffect(() => {
    if (!property.latitude || !property.longitude || !showFullMap) return;

    // Load Leaflet CSS
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    linkElement.integrity =
      "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    linkElement.crossOrigin = "";
    document.head.appendChild(linkElement);

    // Load Leaflet JS
    const scriptElement = document.createElement("script");
    scriptElement.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    scriptElement.integrity =
      "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
    scriptElement.crossOrigin = "";
    scriptElement.async = true;

    scriptElement.onload = () => {
      if (mapContainerRef.current && (window as any).L) {
        try {
          const L = (window as any).L;
          const map = L.map(mapContainerRef.current).setView(
            [property.latitude, property.longitude],
            14
          );

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
          }).addTo(map);

          // Custom marker
          const customIcon = L.divIcon({
            className: "custom-marker",
            html: `
              <div style="
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                width: 36px;
                height: 36px;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                border: 3px solid white;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" style="transform: rotate(45deg);">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                </svg>
              </div>
            `,
            iconSize: [36, 36],
            iconAnchor: [18, 36],
            popupAnchor: [0, -36],
          });

          L.marker([property.latitude, property.longitude], {
            icon: customIcon,
          }).addTo(map).bindPopup(`
            <div style="padding: 8px; min-width: 180px;">
              <div style="font-weight: 600; font-size: 13px; margin-bottom: 4px; color: #111827;">
                ${property.title}
              </div>
              <div style="font-size: 11px; color: #6b7280; margin-bottom: 6px;">
                ${property.locality}
              </div>
              <div style="font-size: 13px; font-weight: 700; color: #2563eb;">
                ${property.currency} ${property.price.toLocaleString()}
              </div>
            </div>
          `);

          // Add radius circle
          L.circle([property.latitude, property.longitude], {
            color: "#3b82f6",
            fillColor: "#3b82f6",
            fillOpacity: 0.08,
            radius: 500,
            weight: 2,
          }).addTo(map);

          mapRef.current = map;
          setMapLoaded(true);

          setTimeout(() => map.invalidateSize(), 100);
        } catch (error) {
          console.error("Error initializing map:", error);
          setMapError(true);
        }
      }
    };

    scriptElement.onerror = () => setMapError(true);
    document.head.appendChild(scriptElement);

    return () => {
      if (mapRef.current) mapRef.current.remove();
      if (document.head.contains(linkElement))
        document.head.removeChild(linkElement);
      if (document.head.contains(scriptElement))
        document.head.removeChild(scriptElement);
    };
  }, [property, showFullMap]);

  const openInGoogleMaps = () => {
    if (property.latitude && property.longitude) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}`,
        "_blank"
      );
    }
  };

  const getDirections = () => {
    if (property.latitude && property.longitude) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`,
        "_blank"
      );
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Glass Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white/50 to-teal-50/80 backdrop-blur-xl" />

      {/* Main Content */}
      <div className="relative p-5">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-teal-600 rounded-xl blur-md opacity-50" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <MapPin className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Location</h3>
              <p className="text-xs text-gray-600">{property.locality}</p>
            </div>
          </div>
          <button
            onClick={openInGoogleMaps}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open
          </button>
        </div>

        {/* Address - Compact */}
        <div className="mb-4 p-3 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl">
          <div className="text-sm text-gray-700 leading-relaxed">
            {property.address}, {property.locality}
            <br />
            {property.city.name}, {property.state && `${property.state}, `}
            {property.country}
            {property.zipCode && ` - ${property.zipCode}`}
          </div>
        </div>

        {/* Nearby Places Quick View */}
        {property.latitude && property.longitude && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-gray-900">What's Nearby</h4>
              <button
                onClick={() => setShowFullMap(!showFullMap)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                {showFullMap ? "Hide Map" : "View Map"}
              </button>
            </div>

            {/* Nearby Quick Cards */}
            <div className="grid grid-cols-5 gap-2 mb-3">
              {nearbyPlaces.map((place, idx) => {
                const Icon = place.icon;
                return (
                  <div
                    key={idx}
                    className="text-center p-2 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl hover:bg-white/80 transition-all"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-1 shadow-sm"
                      style={{ backgroundColor: `${place.color}15` }}
                    >
                      <Icon
                        className="w-4 h-4"
                        style={{ color: place.color }}
                      />
                    </div>
                    <div className="text-[10px] font-semibold text-gray-700 leading-tight">
                      {place.name}
                    </div>
                    <div className="text-[9px] text-gray-500 mt-0.5">
                      {place.distance}km
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Expandable Map */}
        {showFullMap && property.latitude && property.longitude && (
          <div className="mb-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="relative rounded-xl overflow-hidden border border-gray-200/50 shadow-lg">
              <div
                ref={mapContainerRef}
                className="h-64 bg-gray-200"
                style={{ zIndex: 1 }}
              >
                {!mapLoaded && !mapError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                    <div className="text-center">
                      <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <span className="text-xs text-gray-600 font-medium">
                        Loading map...
                      </span>
                    </div>
                  </div>
                )}
                {mapError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                    <div className="text-center p-4">
                      <Navigation className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <span className="text-xs text-gray-600 font-medium">
                        Map unavailable
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Map Controls */}
              {mapLoaded && (
                <div className="absolute top-3 right-3 flex gap-2 z-10">
                  <button
                    onClick={() => {
                      if (mapRef.current) {
                        mapRef.current.setView(
                          [property.latitude, property.longitude],
                          14
                        );
                      }
                    }}
                    className="bg-white/90 backdrop-blur-sm border border-gray-200/50 p-2 rounded-lg shadow-md hover:bg-white transition-all"
                  >
                    <Navigation className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons - Compact */}
        {property.latitude && property.longitude && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={getDirections}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
            >
              <Navigation className="w-4 h-4" />
              Directions
            </button>
            <button
              onClick={openInGoogleMaps}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200/50 text-gray-700 rounded-xl text-sm font-semibold hover:bg-white transition-all shadow-md hover:shadow-lg"
            >
              <ExternalLink className="w-4 h-4" />
              Google Maps
            </button>
          </div>
        )}

        {/* Fallback when no coordinates */}
        {(!property.latitude || !property.longitude) && (
          <div className="bg-gray-50/80 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
            <MapPin className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <div className="text-sm text-gray-600 font-medium">
              Exact location not available
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Contact owner for details
            </div>
          </div>
        )}

        {/* Distance Stats - Compact Footer */}
        <div className="mt-4 pt-4 border-t border-gray-200/50 grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-blue-50/80 rounded-lg">
            <div className="text-xs font-semibold text-blue-600">
              {property.city.name}
            </div>
            <div className="text-[10px] text-blue-700 mt-0.5">City</div>
          </div>
          <div className="text-center p-2 bg-teal-50/80 rounded-lg">
            <div className="text-xs font-semibold text-teal-600">
              {property.locality}
            </div>
            <div className="text-[10px] text-teal-700 mt-0.5">Locality</div>
          </div>
          <div className="text-center p-2 bg-purple-50/80 rounded-lg">
            <div className="text-xs font-semibold text-purple-600">
              {property.zipCode || "N/A"}
            </div>
            <div className="text-[10px] text-purple-700 mt-0.5">Pincode</div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-teal-500/10 rounded-full blur-3xl -z-10" />
      </div>
    </div>
  );
};
