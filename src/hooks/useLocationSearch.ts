// hooks/useLocationSearch.ts
import { useState, useEffect } from "react";

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

export const useLocationSearch = () => {
  const [locationSearch, setLocationSearch] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<
    LocationSuggestion[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);

  // Geocoding with Nominatim
  const searchLocation = async (query: string) => {
    if (query.length < 3) return;

    setIsSearchingLocation(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5&addressdetails=1`,
        {
          headers: {
            "User-Agent": "PropertyApp/1.0",
          },
        }
      );
      const data: LocationSuggestion[] = await response.json();
      setLocationSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Failed to search location:", error);
    } finally {
      setIsSearchingLocation(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (locationSearch) {
        searchLocation(locationSearch);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [locationSearch]);

  const handleLocationSelect = (location: LocationSuggestion) => {
    return location;
  };

  return {
    locationSearch,
    locationSuggestions,
    showSuggestions,
    isSearchingLocation,
    setLocationSearch,
    setShowSuggestions,
    handleLocationSelect,
  };
};
