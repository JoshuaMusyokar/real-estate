import { useState } from "react";
import type { AmenitySearchFilters } from "../types";

const initialFilters: AmenitySearchFilters = {
  page: 1,
  limit: 12,
  search: "",
  category: undefined,
  isActive: undefined,
  sortBy: "order",
  sortOrder: "asc",
};

export const useAmenityFilters = () => {
  const [filters, setFilters] = useState<AmenitySearchFilters>(initialFilters);

  const updateFilters = (updates: Partial<AmenitySearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return {
    filters,
    updateFilters,
    resetFilters,
  };
};
