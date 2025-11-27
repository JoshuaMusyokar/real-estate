import { useState, useCallback, useRef } from "react";
import type { LocationSuggestion } from "../types";

export function useLocationAutocomplete() {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const searchLocations = useCallback(async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&addressdetails=1&limit=5`,
        {
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) throw new Error("Failed to fetch locations");

      const data = await response.json();
      setSuggestions(data);
    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error("Error fetching locations:", error);
        setSuggestions([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  return {
    suggestions,
    isLoading,
    searchLocations,
    clearSuggestions,
  };
}
