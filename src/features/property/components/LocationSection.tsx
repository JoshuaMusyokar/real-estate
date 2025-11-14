import { MapPin, Navigation, ExternalLink, Maximize2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Property } from "../../../types";

export const LocationSection: React.FC<{ property: Property }> = ({
  property,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    if (!property.latitude || !property.longitude) return;

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
          // Initialize map
          const L = (window as any).L;
          const map = L.map(mapContainerRef.current).setView(
            [property.latitude, property.longitude],
            15
          );

          // Add OpenStreetMap tiles
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
          }).addTo(map);

          // Custom marker icon
          const customIcon = L.divIcon({
            className: "custom-marker",
            html: `
              <div style="
                background: #2563eb;
                width: 40px;
                height: 40px;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                border: 3px solid white;
                box-shadow: 0 4px 6px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(45deg);">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40],
          });

          // Add marker with popup
          const marker = L.marker([property.latitude, property.longitude], {
            icon: customIcon,
          }).addTo(map);

          marker.bindPopup(
            `
            <div style="padding: 8px; min-width: 200px;">
              <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px; color: #111827;">
                ${property.title}
              </div>
              <div style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">
                ${property.address}, ${property.locality}
              </div>
              <div style="font-size: 13px; font-weight: 600; color: #2563eb;">
                ${property.currency} ${property.price.toLocaleString()}
              </div>
            </div>
          `,
            {
              maxWidth: 300,
            }
          );

          // Add circle to show approximate area
          L.circle([property.latitude, property.longitude], {
            color: "#2563eb",
            fillColor: "#3b82f6",
            fillOpacity: 0.1,
            radius: 200,
          }).addTo(map);

          mapRef.current = map;
          setMapLoaded(true);

          // Fix map display issues
          setTimeout(() => {
            map.invalidateSize();
          }, 100);
        } catch (error) {
          console.error("Error initializing map:", error);
          setMapError(true);
        }
      }
    };

    scriptElement.onerror = () => {
      setMapError(true);
    };

    document.head.appendChild(scriptElement);

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
      document.head.removeChild(linkElement);
      document.head.removeChild(scriptElement);
    };
  }, [property]);

  const openInGoogleMaps = () => {
    if (property.latitude && property.longitude) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}`,
        "_blank"
      );
    }
  };

  const openInAppleMaps = () => {
    if (property.latitude && property.longitude) {
      window.open(
        `http://maps.apple.com/?ll=${property.latitude},${
          property.longitude
        }&q=${encodeURIComponent(property.title)}`,
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
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 lg:p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Location
      </h2>
      <div className="space-y-6">
        {/* Address Information */}
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <div className="font-semibold text-gray-900 dark:text-white mb-1">
              Address
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              {property.address}
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              {property.locality}, {property.city}
            </div>
            {property.state && (
              <div className="text-gray-700 dark:text-gray-300">
                {property.state}, {property.country}
              </div>
            )}
            {property.zipCode && (
              <div className="text-gray-700 dark:text-gray-300">
                {property.zipCode}
              </div>
            )}
          </div>
        </div>

        {/* Interactive Map */}
        {property.latitude && property.longitude && (
          <>
            <div className="relative">
              <div
                ref={mapContainerRef}
                className="h-80 lg:h-96 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden"
                style={{ zIndex: 1 }}
              >
                {!mapLoaded && !mapError && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                      <span className="text-gray-600 dark:text-gray-400 font-medium">
                        Loading map...
                      </span>
                    </div>
                  </div>
                )}
                {mapError && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-6">
                      <Navigation className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <span className="text-gray-600 dark:text-gray-400 font-medium block mb-2">
                        Map unavailable
                      </span>
                      <button
                        onClick={openInGoogleMaps}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium underline"
                      >
                        View on Google Maps
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Map Controls Overlay */}
              {mapLoaded && (
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                  <button
                    onClick={() => {
                      if (mapRef.current) {
                        mapRef.current.setView(
                          [property.latitude, property.longitude],
                          15
                        );
                      }
                    }}
                    className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    title="Reset view"
                  >
                    <Navigation className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </button>
                  <button
                    onClick={openInGoogleMaps}
                    className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    title="Open in new window"
                  >
                    <Maximize2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </button>
                </div>
              )}
            </div>

            {/* Map Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={getDirections}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                <Navigation className="w-5 h-5" />
                Get Directions
              </button>
              <button
                onClick={openInGoogleMaps}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
                Google Maps
              </button>
              <button
                onClick={openInAppleMaps}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
                Apple Maps
              </button>
            </div>

            {/* Coordinates Display */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Coordinates:</span>{" "}
                {property.latitude.toFixed(6)}, {property.longitude.toFixed(6)}
              </div>
            </div>
          </>
        )}

        {/* Fallback when no coordinates */}
        {(!property.latitude || !property.longitude) && (
          <div className="bg-gray-50 dark:bg-gray-700/50 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <div className="text-gray-600 dark:text-gray-400 font-medium">
              Exact location coordinates not available
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Contact the property owner for precise location details
            </div>
          </div>
        )}

        {/* Nearby Information */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            About this location
          </h3>
          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
            <div>
              <span className="font-medium">City:</span> {property.city}
            </div>
            <div>
              <span className="font-medium">Neighborhood:</span>{" "}
              {property.locality}
            </div>
            {property.state && (
              <div>
                <span className="font-medium">State/Province:</span>{" "}
                {property.state}
              </div>
            )}
            <div>
              <span className="font-medium">Country:</span> {property.country}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
