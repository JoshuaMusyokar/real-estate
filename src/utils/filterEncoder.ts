import type { PropertySearchFilters } from "../types";
import pako from "pako";

/**
 * Compress and encode filters to URL-safe string
 */
export function encodeFilters(filters: PropertySearchFilters): string {
  try {
    // Remove default/empty values to reduce size
    const cleanedFilters = cleanFiltersForEncoding(filters);

    // Convert to JSON string
    const jsonString = JSON.stringify(cleanedFilters);

    // Compress using pako
    const compressed = pako.deflate(jsonString);

    // Convert to base64 and make URL-safe
    const base64 = btoa(String.fromCharCode(...compressed));
    const urlSafe = base64
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    return urlSafe;
  } catch (error) {
    console.error("Error encoding filters:", error);
    return "";
  }
}

/**
 * Decode URL-safe string back to filters
 */
export function decodeFilters(encoded: string): PropertySearchFilters | null {
  try {
    // Convert from URL-safe base64
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");

    // Add padding if needed
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );

    // Decode base64
    const binaryString = atob(padded);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Decompress
    const decompressed = pako.inflate(bytes, { to: "string" });

    // Parse JSON
    const filters = JSON.parse(decompressed);

    // Merge with defaults
    return {
      page: 1,
      limit: 20,
      status: "AVAILABLE",
      sortBy: "createdAt",
      sortOrder: "desc",
      ...filters,
    };
  } catch (error) {
    console.error("Error decoding filters:", error);
    return null;
  }
}

/**
 * Clean filters by removing default and empty values
 */
function cleanFiltersForEncoding(
  filters: PropertySearchFilters,
): Partial<PropertySearchFilters> {
  const cleaned: Partial<PropertySearchFilters> = {};

  // Only include non-default values
  Object.entries(filters).forEach(([key, value]) => {
    const k = key as keyof PropertySearchFilters;

    // Skip default values
    if (k === "page" && value === 1) return;
    if (k === "limit" && value === 20) return;
    if (k === "status" && value === "AVAILABLE") return;
    if (k === "sortBy" && value === "createdAt") return;
    if (k === "sortOrder" && value === "desc") return;

    // Skip undefined, null, empty strings, empty arrays
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value) && value.length === 0) return;

    cleaned[k] = value;
  });

  return cleaned;
}

/**
 * Check if filters are in default state
 */
export function isDefaultFilters(filters: PropertySearchFilters): boolean {
  const cleaned = cleanFiltersForEncoding(filters);
  return Object.keys(cleaned).length === 0;
}
