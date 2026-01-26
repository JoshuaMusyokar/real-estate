import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PropertySearchFilters } from "../../types";

interface FilterState {
  currentFilters: PropertySearchFilters;
  filterHash: string | null;
}

const initialState: FilterState = {
  currentFilters: {
    page: 1,
    limit: 20,
    status: "AVAILABLE",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  filterHash: null,
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<PropertySearchFilters>) => {
      state.currentFilters = action.payload;
    },
    updateFilter: (
      state,
      action: PayloadAction<{ key: keyof PropertySearchFilters; value: any }>,
    ) => {
      const { key, value } = action.payload;
      state.currentFilters = {
        ...state.currentFilters,
        [key]: value,
      };
    },
    resetFilters: (
      state,
      action: PayloadAction<{
        cityId?: string;
        city?: string[];
        locality?: string[];
        localityId?: string;
      }>,
    ) => {
      state.currentFilters = {
        page: 1,
        limit: 20,
        status: "AVAILABLE",
        sortBy: "createdAt",
        sortOrder: "desc",
        ...action.payload,
      };
    },
    setFilterHash: (state, action: PayloadAction<string | null>) => {
      state.filterHash = action.payload;
    },
  },
});

export const { setFilters, updateFilter, resetFilters, setFilterHash } =
  filterSlice.actions;
export default filterSlice.reducer;
