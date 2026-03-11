// FilterBar.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef } from "react";
import {
  Home,
  Building2,
  User,
  MapPin,
  Check,
  X,
  ArrowUpDown,
} from "lucide-react";
import type { PropertySearchFilters, PropertyPurpose } from "../../types";
import { useGetPropertyTypesQuery } from "../../services/propertyApi";
import { FilterDropdown } from "./FilterDropdown";
import {
  PropertyTypeContent,
  SubTypeContent,
  BhkContent,
  PriceRangeContent,
  ToggleListContent,
  MoreFiltersContent,
} from "./FilterDropdownContent";

const SORT_OPTIONS = [
  { value: "featured-desc", label: "Relevance" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "createdAt-desc", label: "Newest First" },
  { value: "viewCount-desc", label: "Most Popular" },
];

interface FilterBarProps {
  filters: PropertySearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<PropertySearchFilters>>;
  activeDropdown: string | null;
  setActiveDropdown: (id: string | null) => void;
}

// ── Static data ──────────────────────────────────────────────────────────────

const RESIDENTIAL_PRICES = [
  { label: "Under ₹50 L", min: 1, max: 5_000_000 },
  { label: "₹50 L – ₹1 Cr", min: 5_000_000, max: 10_000_000 },
  { label: "₹1 Cr – ₹2 Cr", min: 10_000_000, max: 20_000_000 },
  { label: "₹2 Cr – ₹5 Cr", min: 20_000_000, max: 50_000_000 },
  { label: "₹5 Cr+", min: 50_000_000, max: undefined },
];

const COMMERCIAL_PRICES = [
  { label: "Under ₹25 L", min: 1, max: 2_500_000 },
  { label: "₹25 L – ₹50 L", min: 2_500_000, max: 5_000_000 },
  { label: "₹50 L – ₹1 Cr", min: 5_000_000, max: 10_000_000 },
  { label: "₹1 Cr – ₹5 Cr", min: 10_000_000, max: 50_000_000 },
  { label: "₹5 Cr – ₹10 Cr", min: 50_000_000, max: 100_000_000 },
  { label: "₹10 Cr+", min: 100_000_000, max: undefined },
];

const SALE_TYPES: Array<{ value: PropertyPurpose; label: string }> = [
  { value: "SALE", label: "For Sale" },
  { value: "RENT", label: "For Rent" },
];

const CONSTRUCTION_STATUSES = [
  { value: "READY_TO_MOVE", label: "Ready to Move" },
  { value: "UNDER_CONSTRUCTION", label: "Under Construction" },
];

const LISTING_SOURCES: Array<{
  value: "AGENT" | "BUILDER" | "OWNER";
  label: React.ReactNode;
}> = [
  {
    value: "AGENT",
    label: (
      <span className="flex items-center gap-2">
        <User className="w-4 h-4" />
        Agent
      </span>
    ),
  },
  {
    value: "BUILDER",
    label: (
      <span className="flex items-center gap-2">
        <Building2 className="w-4 h-4" />
        Builder
      </span>
    ),
  },
  {
    value: "OWNER",
    label: (
      <span className="flex items-center gap-2">
        <Home className="w-4 h-4" />
        Owner
      </span>
    ),
  },
];

const FURNISHING_STATUSES = [
  { value: "FURNISHED", label: "Furnished" },
  { value: "SEMI_FURNISHED", label: "Semi-Furnished" },
  { value: "UNFURNISHED", label: "Unfurnished" },
];

const FACING_DIRECTIONS = [
  {
    value: "NORTH",
    label: (
      <span className="flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        North
      </span>
    ),
  },
  {
    value: "SOUTH",
    label: (
      <span className="flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        South
      </span>
    ),
  },
  {
    value: "EAST",
    label: (
      <span className="flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        East
      </span>
    ),
  },
  {
    value: "WEST",
    label: (
      <span className="flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        West
      </span>
    ),
  },
  {
    value: "NORTH_EAST",
    label: (
      <span className="flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        North-East
      </span>
    ),
  },
  {
    value: "NORTH_WEST",
    label: (
      <span className="flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        North-West
      </span>
    ),
  },
  {
    value: "SOUTH_EAST",
    label: (
      <span className="flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        South-East
      </span>
    ),
  },
  {
    value: "SOUTH_WEST",
    label: (
      <span className="flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        South-West
      </span>
    ),
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  activeDropdown,
  setActiveDropdown,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: propertyTypesData, isLoading } = useGetPropertyTypesQuery({
    isActive: true,
    includeSubTypes: true,
  });
  const propertyTypes = propertyTypesData?.data || [];

  // Resolve UUID if filter contains a name instead
  useEffect(() => {
    if (!propertyTypes.length) return;
    if (filters.propertyType && !filters.propertyType.includes("-")) {
      const matched = propertyTypes.find(
        (pt) => pt.name === filters.propertyType,
      );
      if (matched) setFilters((p) => ({ ...p, propertyType: matched.id }));
    }
  }, [propertyTypes]);

  const currentPropertyType = propertyTypes.find(
    (pt) => pt.id === filters.propertyType || pt.name === filters.propertyType,
  );
  const availableSubTypes =
    currentPropertyType?.subTypes?.filter((st) => st.isActive) || [];
  const isCommercial = currentPropertyType?.name === "COMMERCIAL";
  const isResidential =
    !filters.propertyType || currentPropertyType?.name === "RESIDENTIAL";

  // Keyboard close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeDropdown) setActiveDropdown(null);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [activeDropdown, setActiveDropdown]);

  // Outside-container close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        activeDropdown
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [activeDropdown, setActiveDropdown]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const change = (
    key: keyof PropertySearchFilters,
    value: any,
    close = true,
  ) => {
    setFilters((p) => ({ ...p, [key]: value }));
    if (close) setActiveDropdown(null);
  };

  const toggle = (
    key: keyof PropertySearchFilters,
    value: any,
    close = true,
  ) => {
    setFilters((p) => ({ ...p, [key]: p[key] === value ? undefined : value }));
    if (close) setActiveDropdown(null);
  };

  const multiSelect = (key: "bedrooms", value: number) => {
    setFilters((p) => {
      const cur: number[] = p[key] || [];
      const next = cur.includes(value)
        ? cur.filter((v) => v !== value)
        : [...cur, value];
      return { ...p, [key]: next.length ? next : undefined };
    });
  };

  const setPriceRange = (min: number | undefined, max: number | undefined) => {
    setFilters((p) => ({ ...p, minPrice: min, maxPrice: max }));
    setActiveDropdown(null);
  };

  const resetAll = () => {
    setFilters({
      status: "AVAILABLE",
      sortBy: "createdAt",
      sortOrder: "desc",
      cityId: filters.cityId,
      city: filters.city,
      locality: filters.locality,
      localityId: filters.localityId,
    });
    setActiveDropdown(null);
  };

  // Active filter count
  const activeCount = [
    filters.propertyType,
    filters.minPrice || filters.maxPrice,
    filters.possessionStatus,
    filters.verified,
    filters.purpose,
    filters.listingSource,
    isResidential && filters.bedrooms?.length,
    isResidential && filters.hasBalcony,
    isCommercial && filters.subType,
    isCommercial && filters.furnishingStatus,
    isCommercial && filters.facingDirection,
  ].filter(Boolean).length;

  // ── The header is:
  //   mobile:  56px nav + 58px locality bar = 114px  → top-[114px]
  //   sm:      64px nav + 58px locality bar = 122px  → top-[122px]
  //   md+:     68px nav only (no locality bar)       → top-[68px]
  // We also add a fallback at top-0 in case displaySearchBar=false (no locality row).

  if (isLoading) {
    return (
      <div
        className="
          bg-white border-b border-blue-100 shadow-sm
          sticky top-[114px] sm:top-[122px] md:top-[68px] z-40
        "
      >
        <div className="max-w-full mx-auto px-3 sm:px-5 py-2 sm:py-2.5">
          <div className="flex items-center gap-2">
            {[80, 72, 80, 72, 88].map((w, i) => (
              <div
                key={i}
                className="animate-pulse bg-blue-50 rounded-full h-7 sm:h-8"
                style={{ width: w }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="
        bg-white border-b border-blue-100 shadow-sm
        sticky top-[114px] sm:top-[122px] md:top-[68px] z-40
      "
    >
      <div className="max-w-full mx-auto px-3 sm:px-5 py-2 sm:py-2.5">
        <div
          className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1"
          style={{ scrollbarWidth: "none" }}
        >
          {/* 1 — Property Type */}
          <FilterDropdown
            label="Type"
            id="property-type"
            count={filters.propertyType ? 1 : 0}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
          >
            <PropertyTypeContent
              propertyTypes={propertyTypes}
              filters={filters}
              onToggle={toggle}
            />
          </FilterDropdown>

          {/* RESIDENTIAL */}
          {isResidential && (
            <>
              <FilterDropdown
                label="Sub Type"
                id="res-subtype"
                count={filters.subType ? 1 : 0}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
              >
                <SubTypeContent
                  subTypes={availableSubTypes}
                  filters={filters}
                  onToggle={toggle}
                />
              </FilterDropdown>

              <FilterDropdown
                label="BHK"
                id="bhk-type"
                count={filters.bedrooms?.length || 0}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
              >
                <BhkContent
                  filters={filters}
                  onMultiSelect={multiSelect}
                  onClose={() => setActiveDropdown(null)}
                />
              </FilterDropdown>

              <FilterDropdown
                label="Price"
                id="res-price"
                count={filters.minPrice || filters.maxPrice ? 1 : 0}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
              >
                <PriceRangeContent
                  ranges={RESIDENTIAL_PRICES}
                  filters={filters}
                  onChange={setPriceRange}
                />
              </FilterDropdown>
            </>
          )}

          {/* COMMERCIAL */}
          {isCommercial && (
            <>
              <FilterDropdown
                label="Sub Type"
                id="com-subtype"
                count={filters.subType ? 1 : 0}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
              >
                <SubTypeContent
                  subTypes={availableSubTypes}
                  filters={filters}
                  onToggle={toggle}
                />
              </FilterDropdown>

              <FilterDropdown
                label="Price"
                id="com-price"
                count={filters.minPrice || filters.maxPrice ? 1 : 0}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
              >
                <PriceRangeContent
                  ranges={COMMERCIAL_PRICES}
                  filters={filters}
                  onChange={setPriceRange}
                />
              </FilterDropdown>

              <FilterDropdown
                label="Furnishing"
                id="furnishing"
                count={filters.furnishingStatus ? 1 : 0}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
              >
                <ToggleListContent
                  options={FURNISHING_STATUSES}
                  activeValue={filters.furnishingStatus}
                  onToggle={(v) => toggle("furnishingStatus", v)}
                />
              </FilterDropdown>

              <FilterDropdown
                label="Facing"
                id="facing"
                count={filters.facingDirection ? 1 : 0}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
              >
                <ToggleListContent
                  options={FACING_DIRECTIONS}
                  activeValue={filters.facingDirection}
                  onToggle={(v) => toggle("facingDirection", v)}
                />
              </FilterDropdown>
            </>
          )}

          {/* COMMON */}
          <FilterDropdown
            label="Sale Type"
            id="sale-type"
            count={filters.purpose ? 1 : 0}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
          >
            <ToggleListContent
              options={SALE_TYPES}
              activeValue={filters.purpose}
              onToggle={(v) => toggle("purpose", v as PropertyPurpose)}
            />
          </FilterDropdown>

          <FilterDropdown
            label="Status"
            id="construction"
            count={filters.possessionStatus ? 1 : 0}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
          >
            <ToggleListContent
              options={CONSTRUCTION_STATUSES}
              activeValue={filters.possessionStatus}
              onToggle={(v) => toggle("possessionStatus", v)}
            />
          </FilterDropdown>

          <FilterDropdown
            label="Posted By"
            id="listing-source"
            count={filters.listingSource ? 1 : 0}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
          >
            <ToggleListContent
              options={LISTING_SOURCES}
              activeValue={filters.listingSource}
              onToggle={(v) =>
                toggle("listingSource", v as "AGENT" | "BUILDER" | "OWNER")
              }
            />
          </FilterDropdown>

          <FilterDropdown
            label="Verified"
            id="verified"
            count={filters.verified ? 1 : 0}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
          >
            <div className="p-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggle("verified", !filters.verified ? true : undefined);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors
                  ${filters.verified ? "bg-blue-50 text-blue-700 font-semibold" : "hover:bg-gray-50 text-gray-700"}`}
              >
                <Check className="w-3.5 h-3.5" />
                Verified Properties Only
              </button>
            </div>
          </FilterDropdown>

          {isResidential && (
            <FilterDropdown
              label="More"
              id="more-filters"
              count={filters.hasBalcony ? 1 : 0}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
            >
              <MoreFiltersContent
                filters={filters}
                setFilters={setFilters}
                onClose={() => setActiveDropdown(null)}
              />
            </FilterDropdown>
          )}

          {/* Divider */}
          <div className="w-px h-5 bg-gray-200 flex-shrink-0 mx-0.5" />

          {/* Sort */}
          <div className="inline-flex items-center gap-1 flex-shrink-0">
            <ArrowUpDown className="w-3 h-3 text-blue-400 flex-shrink-0" />
            <select
              value={`${filters.sortBy ?? "createdAt"}-${filters.sortOrder ?? "desc"}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split("-");
                setFilters((p) => ({
                  ...p,
                  sortBy,
                  sortOrder: sortOrder as "asc" | "desc",
                }));
              }}
              className="
                text-[11px] sm:text-xs font-semibold
                border border-blue-200 bg-blue-50 text-blue-700
                rounded-full px-2 sm:px-2.5 py-1 sm:py-1.5
                focus:outline-none focus:ring-2 focus:ring-blue-400
                cursor-pointer whitespace-nowrap
              "
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reset pill */}
          {activeCount > 0 && (
            <button
              onClick={resetAll}
              className="
                inline-flex items-center gap-1 flex-shrink-0
                px-2.5 sm:px-3 py-1.5 sm:py-2
                border border-red-200 bg-red-50 hover:bg-red-100
                text-red-600 text-[11px] sm:text-xs font-semibold
                rounded-full whitespace-nowrap transition-colors
              "
            >
              <X className="w-3 h-3" />
              Reset ({activeCount})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
