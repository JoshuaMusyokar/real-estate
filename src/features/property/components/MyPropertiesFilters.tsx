import React, { useEffect, useRef, useState } from "react";
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  MapPin,
  Search,
  X,
  Building2,
  LayoutGrid,
  List,
} from "lucide-react";
import type { PropertyPurpose, PropertyStatus } from "../../../types";
import { useGetPropertyTypesQuery } from "../../../services/propertyApi";
import {
  useGetCitiesQuery,
  useGetLocalitiesQuery,
} from "../../../services/locationApi";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MyPropertyFiltersState {
  search?: string;
  status?: PropertyStatus | PropertyStatus[];
  purpose?: PropertyPurpose | PropertyPurpose[];
  possessionStatus?: string;
  propertyTypeId?: string;
  subTypeId?: string;
  cityId?: string;
  city?: string[];
  locality?: string[];
  localityId?: string[];
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number[];
  featured?: boolean;
  verified?: boolean;
  hasBalcony?: boolean;
  furnishingStatus?: string;
  facingDirection?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface Props {
  filters: MyPropertyFiltersState;
  setFilters: React.Dispatch<React.SetStateAction<MyPropertyFiltersState>>;
  viewMode: "grid" | "list";
  setViewMode: (v: "grid" | "list") => void;
  totalCount?: number;
}

// ── Static data ───────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { value: "createdAt-desc", label: "Newest First" },
  { value: "createdAt-asc", label: "Oldest First" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "viewCount-desc", label: "Most Viewed" },
  { value: "updatedAt-desc", label: "Recently Updated" },
];

const STATUS_OPTIONS: Array<{
  value: PropertyStatus | "";
  label: string;
  dot: string;
}> = [
  { value: "", label: "All Status", dot: "bg-gray-300" },
  { value: "AVAILABLE", label: "Available", dot: "bg-emerald-500" },
  { value: "DRAFT", label: "Draft", dot: "bg-gray-400" },
  { value: "UNDER_REVIEW", label: "Under Review", dot: "bg-amber-500" },
  { value: "PENDING", label: "Pending", dot: "bg-blue-400" },
  { value: "SOLD", label: "Sold", dot: "bg-indigo-500" },
  { value: "RENTED", label: "Rented", dot: "bg-cyan-500" },
  { value: "REJECTED", label: "Rejected", dot: "bg-red-500" },
];

const PURPOSE_OPTIONS: Array<{ value: PropertyPurpose | ""; label: string }> = [
  { value: "", label: "Any Purpose" },
  { value: "SALE", label: "For Sale" },
  { value: "RENT", label: "For Rent" },
  { value: "LEASE", label: "For Lease" },
  { value: "PG", label: "PG" },
];

const POSSESSION_OPTIONS = [
  { value: "", label: "Any" },
  { value: "READY_TO_MOVE", label: "Ready to Move" },
  { value: "UNDER_CONSTRUCTION", label: "Under Construction" },
];

const FURNISHING_OPTIONS = [
  { value: "", label: "Any" },
  { value: "FURNISHED", label: "Furnished" },
  { value: "SEMI_FURNISHED", label: "Semi-Furnished" },
  { value: "UNFURNISHED", label: "Unfurnished" },
];

const FACING_OPTIONS = [
  { value: "", label: "Any Direction" },
  { value: "NORTH", label: "North" },
  { value: "SOUTH", label: "South" },
  { value: "EAST", label: "East" },
  { value: "WEST", label: "West" },
  { value: "NORTH_EAST", label: "North-East" },
  { value: "NORTH_WEST", label: "North-West" },
  { value: "SOUTH_EAST", label: "South-East" },
  { value: "SOUTH_WEST", label: "South-West" },
];

const BHK_OPTIONS = [1, 2, 3, 4, 5, 6];

const PRICE_RANGES = [
  { label: "Under ₹50 L", min: 1, max: 5_000_000 },
  { label: "₹50 L – ₹1 Cr", min: 5_000_000, max: 10_000_000 },
  { label: "₹1 Cr – ₹2 Cr", min: 10_000_000, max: 20_000_000 },
  { label: "₹2 Cr – ₹5 Cr", min: 20_000_000, max: 50_000_000 },
  { label: "₹5 Cr+", min: 50_000_000, max: undefined },
];

// ── Primitives ────────────────────────────────────────────────────────────────

/** Standard filter pill with dropdown */
const Pill: React.FC<{
  label: string;
  count?: number;
  open: boolean;
  onClick: () => void;
  children: React.ReactNode;
  alignRight?: boolean;
}> = ({ label, count, open, onClick, children, alignRight }) => (
  <div className="relative flex-shrink-0">
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full border text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all
        ${
          open || (count && count > 0)
            ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-200"
            : "bg-white border-blue-200 text-blue-700 hover:bg-blue-50"
        }`}
    >
      {label}
      {count && count > 0 ? (
        <span
          className={`w-4 h-4 rounded-full text-[10px] font-black flex items-center justify-center
          ${open ? "bg-white text-blue-600" : "bg-blue-100 text-blue-700"}`}
        >
          {count}
        </span>
      ) : (
        <ChevronDown
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
        />
      )}
    </button>
    {open && (
      <div
        onClick={(e) => e.stopPropagation()}
        className={`absolute top-full mt-1.5 z-50 bg-white border border-blue-100 rounded-xl shadow-xl overflow-hidden
          ${alignRight ? "right-0" : "left-0"} min-w-[160px]`}
      >
        {children}
      </div>
    )}
  </div>
);

/** Standard option row inside a dropdown */
const Opt: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-xs transition-colors text-left
      ${active ? "bg-blue-50 text-blue-700 font-bold" : "text-gray-700 hover:bg-gray-50 font-medium"}`}
  >
    <span>{children}</span>
    {active && <Check className="w-3 h-3 text-blue-600 flex-shrink-0" />}
  </button>
);

// ── City + Locality compound selector ─────────────────────────────────────────
// Shown inline below the search bar as a distinct row on mobile,
// and merged into the search bar row on sm+.

interface CityLocalityProps {
  selectedCities: string[];
  selectedLocalities: string[];
  onCitiesChange: (cities: string[]) => void;
  onLocalitiesChange: (localities: string[]) => void;
  open: string | null;
  toggle: (id: string) => void;
}

// ── One fetcher per city — avoids calling hooks in a loop ────────────────────
const CityLocalitiesFetcher: React.FC<{
  cityId: string;
  onLoaded: (cityId: string, names: string[]) => void;
}> = ({ cityId, onLoaded }) => {
  const { data, isSuccess } = useGetLocalitiesQuery({ cityId, limit: 500 });
  useEffect(() => {
    if (isSuccess)
      onLoaded(
        cityId,
        (data?.data || []).map((l) => l.name),
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, data]);
  return null;
};

const CityLocalitySelector: React.FC<CityLocalityProps> = ({
  selectedCities,
  selectedLocalities,
  onCitiesChange,
  onLocalitiesChange,
  open,
  toggle,
}) => {
  const [cityQ, setCityQ] = useState("");
  const [localQ, setLocalQ] = useState("");
  // Map of cityId → locality names loaded so far
  const [localityMap, setLocalityMap] = useState<Record<string, string[]>>({});

  const { data: citiesData } = useGetCitiesQuery({ limit: 200 });
  const allCities = citiesData?.data || [];
  const displayedCities = cityQ
    ? allCities.filter((c) =>
        c.name.toLowerCase().includes(cityQ.toLowerCase()),
      )
    : allCities;

  // Resolve selected city names → city objects (for IDs + fetching)
  const selectedCityObjs = allCities.filter((c) =>
    selectedCities.includes(c.name),
  );

  // Merge all loaded localities across every selected city, deduplicated
  const allLocalities: string[] = Array.from(
    new Set(selectedCityObjs.flatMap((c) => localityMap[c.id] ?? [])),
  );
  // Still loading if ANY selected city hasn't had its localities resolved yet
  const isLoadingLocalities =
    selectedCityObjs.length > 0 &&
    selectedCityObjs.some((c) => localityMap[c.id] === undefined);

  const displayedLocalities = localQ
    ? allLocalities.filter((n) =>
        n.toLowerCase().includes(localQ.toLowerCase()),
      )
    : allLocalities;

  const handleCityLoaded = (cityId: string, names: string[]) =>
    setLocalityMap((prev) => ({ ...prev, [cityId]: names }));

  const toggleCity = (name: string) => {
    const next = selectedCities.includes(name)
      ? selectedCities.filter((c) => c !== name)
      : [...selectedCities, name];
    onCitiesChange(next);
    // Clear localities when cities change
    onLocalitiesChange([]);
  };

  const toggleLocality = (name: string) => {
    const next = selectedLocalities.includes(name)
      ? selectedLocalities.filter((l) => l !== name)
      : [...selectedLocalities, name];
    onLocalitiesChange(next);
  };

  const cityLabel =
    selectedCities.length === 0
      ? "City"
      : selectedCities.length === 1
        ? selectedCities[0]
        : `${selectedCities.length} Cities`;

  const localLabel =
    selectedLocalities.length === 0
      ? "Locality"
      : selectedLocalities.length === 1
        ? selectedLocalities[0]
        : `${selectedLocalities.length} Areas`;

  const hasCityFilter = selectedCities.length > 0;
  const hasLocalFilter = selectedLocalities.length > 0;

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
      {/* ── City pill ─────────────────────────────────────────────────────── */}
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggle("city");
          }}
          className={`inline-flex items-center gap-1.5 pl-2.5 pr-2.5 py-1.5 rounded-xl border text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all
            ${
              open === "city" || hasCityFilter
                ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-200"
                : "bg-blue-50/60 border-blue-200 text-blue-700 hover:bg-blue-100"
            }`}
        >
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="max-w-[80px] sm:max-w-[120px] truncate">
            {cityLabel}
          </span>
          {hasCityFilter ? (
            <span
              className={`w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center flex-shrink-0
                ${open === "city" ? "bg-white text-blue-600" : "bg-blue-500 text-white"}`}
            >
              {selectedCities.length}
            </span>
          ) : (
            <ChevronDown
              className={`w-3 h-3 flex-shrink-0 transition-transform ${open === "city" ? "rotate-180" : ""}`}
            />
          )}
        </button>

        {open === "city" && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-full left-0 mt-1.5 z-50 bg-white border border-blue-100 rounded-xl shadow-xl w-64 overflow-hidden"
          >
            {/* Search */}
            <div className="p-2 border-b border-blue-50">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  autoFocus
                  value={cityQ}
                  onChange={(e) => setCityQ(e.target.value)}
                  placeholder="Search cities…"
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-blue-100 rounded-lg bg-blue-50/40 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            {/* Selected chips */}
            {selectedCities.length > 0 && (
              <div className="flex flex-wrap gap-1 px-2 pt-2">
                {selectedCities.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold"
                  >
                    {c}
                    <button
                      onClick={() => toggleCity(c)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* List */}
            <div className="max-h-52 overflow-y-auto py-1">
              {displayedCities.length === 0 && (
                <p className="text-[11px] text-gray-400 px-3 py-3 text-center">
                  No cities found
                </p>
              )}
              {displayedCities.map((c) => {
                const active = selectedCities.includes(c.name);
                return (
                  <button
                    key={c.id}
                    onClick={() => toggleCity(c.name)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors
                      ${active ? "bg-blue-50 text-blue-700 font-bold" : "text-gray-700 hover:bg-gray-50 font-medium"}`}
                  >
                    <MapPin
                      className={`w-3 h-3 flex-shrink-0 ${active ? "text-blue-500" : "text-gray-400"}`}
                    />
                    <span className="flex-1 text-left">{c.name}</span>
                    {c.state && (
                      <span className="text-[10px] text-gray-400">
                        {c.state}
                      </span>
                    )}
                    {active && (
                      <Check className="w-3 h-3 text-blue-600 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            {selectedCities.length > 0 && (
              <div className="p-2 border-t border-blue-50 flex items-center justify-between">
                <span className="text-[11px] text-gray-400">
                  {selectedCities.length} selected
                </span>
                <button
                  onClick={() => onCitiesChange([])}
                  className="text-[11px] text-red-500 hover:text-red-600 font-semibold transition-colors"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Locality pill — only visible when cities selected ─────────────── */}
      {hasCityFilter && (
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggle("locality");
            }}
            className={`inline-flex items-center gap-1.5 pl-2.5 pr-2.5 py-1.5 rounded-xl border text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all
              ${
                open === "locality" || hasLocalFilter
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-200"
                  : "bg-indigo-50/60 border-indigo-200 text-indigo-700 hover:bg-indigo-100"
              }`}
          >
            <Building2 className="w-3 h-3 flex-shrink-0" />
            <span className="max-w-[80px] sm:max-w-[120px] truncate">
              {localLabel}
            </span>
            {hasLocalFilter ? (
              <span
                className={`w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center flex-shrink-0
                  ${open === "locality" ? "bg-white text-indigo-600" : "bg-indigo-500 text-white"}`}
              >
                {selectedLocalities.length}
              </span>
            ) : (
              <ChevronDown
                className={`w-3 h-3 flex-shrink-0 transition-transform ${open === "locality" ? "rotate-180" : ""}`}
              />
            )}
          </button>

          {open === "locality" && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute top-full left-0 mt-1.5 z-50 bg-white border border-indigo-100 rounded-xl shadow-xl w-64 overflow-hidden"
            >
              {/* City context header */}
              <div className="px-3 py-2 bg-indigo-50/60 border-b border-indigo-100">
                <p className="text-[10px] text-indigo-500 font-semibold uppercase tracking-wide">
                  Areas in {selectedCities.join(", ")}
                </p>
              </div>

              {/* Search */}
              <div className="p-2 border-b border-indigo-50">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    autoFocus
                    value={localQ}
                    onChange={(e) => setLocalQ(e.target.value)}
                    placeholder="Search localities…"
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-indigo-100 rounded-lg bg-indigo-50/40 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>

              {/* Selected chips */}
              {selectedLocalities.length > 0 && (
                <div className="flex flex-wrap gap-1 px-2 pt-2">
                  {selectedLocalities.map((l) => (
                    <span
                      key={l}
                      className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-[10px] font-bold"
                    >
                      {l}
                      <button
                        onClick={() => toggleLocality(l)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* List */}
              <div className="max-h-52 overflow-y-auto py-1">
                {isLoadingLocalities && (
                  <div className="flex flex-col items-center py-4 gap-1">
                    <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-[11px] text-gray-400">
                      Loading localities…
                    </p>
                  </div>
                )}
                {!isLoadingLocalities && allLocalities.length === 0 && (
                  <p className="text-[11px] text-gray-400 px-3 py-3 text-center">
                    No localities found for {selectedCities.join(", ")}
                  </p>
                )}
                {!isLoadingLocalities &&
                  allLocalities.length > 0 &&
                  displayedLocalities.length === 0 && (
                    <p className="text-[11px] text-gray-400 px-3 py-3 text-center">
                      No matches
                    </p>
                  )}
                {!isLoadingLocalities &&
                  displayedLocalities.map((name) => {
                    const active = selectedLocalities.includes(name);
                    return (
                      <button
                        key={name}
                        onClick={() => toggleLocality(name)}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors
                        ${active ? "bg-indigo-50 text-indigo-700 font-bold" : "text-gray-700 hover:bg-gray-50 font-medium"}`}
                      >
                        <span className="flex-1 text-left">{name}</span>
                        {active && (
                          <Check className="w-3 h-3 text-indigo-600 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
              </div>

              {/* Footer */}
              {selectedLocalities.length > 0 && (
                <div className="p-2 border-t border-indigo-50 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">
                    {selectedLocalities.length} selected
                  </span>
                  <button
                    onClick={() => onLocalitiesChange([])}
                    className="text-[11px] text-red-500 hover:text-red-600 font-semibold transition-colors"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Invisible fetchers — one per selected city, keeps hook count stable */}
      {selectedCityObjs.map((c) => (
        <CityLocalitiesFetcher
          key={c.id}
          cityId={c.id}
          onLoaded={handleCityLoaded}
        />
      ))}
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

export const MyPropertyFilters: React.FC<Props> = ({
  filters,
  setFilters,
  viewMode,
  setViewMode,
  totalCount,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<string | null>(null);

  // Property types
  const { data: typesData } = useGetPropertyTypesQuery({
    isActive: true,
    includeSubTypes: true,
  });
  const propertyTypes = typesData?.data || [];
  const currentType = propertyTypes.find(
    (pt) => pt.id === filters.propertyTypeId,
  );
  const subTypes = currentType?.subTypes?.filter((s) => s.isActive) || [];
  const isResidential =
    !filters.propertyTypeId || currentType?.name === "RESIDENTIAL";
  const isCommercial = currentType?.name === "COMMERCIAL";

  // Close on outside click / Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    const onClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      )
        setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);

  // Helpers
  const toggle = (id: string) => setOpen((p) => (p === id ? null : id));
  const set = (patch: Partial<MyPropertyFiltersState>) =>
    setFilters((p) => ({ ...p, ...patch }));

  const toggleArr = <T,>(key: keyof MyPropertyFiltersState, val: T) =>
    setFilters((p) => {
      const cur = (p[key] as T[] | undefined) || [];
      const next = cur.includes(val)
        ? cur.filter((v) => v !== val)
        : [...cur, val];
      return { ...p, [key]: next.length ? next : undefined };
    });

  const reset = () => setFilters({ sortBy: "createdAt", sortOrder: "desc" });

  // Active count (excludes sort)
  const activeCount = [
    filters.search,
    filters.status,
    filters.purpose,
    filters.possessionStatus,
    filters.propertyTypeId,
    filters.subTypeId,
    filters.city?.length,
    filters.locality?.length,
    filters.minPrice || filters.maxPrice,
    filters.bedrooms?.length,
    filters.verified,
    filters.hasBalcony,
    filters.furnishingStatus,
    filters.facingDirection,
  ].filter(Boolean).length;

  const sortValue = `${filters.sortBy ?? "createdAt"}-${filters.sortOrder ?? "desc"}`;

  // Status label
  const statusLabel = (() => {
    const arr = Array.isArray(filters.status)
      ? filters.status
      : filters.status
        ? [filters.status]
        : [];
    if (!arr.length) return "Status";
    if (arr.length === 1) return arr[0];
    return `${arr.length} Status`;
  })();

  return (
    <div
      ref={containerRef}
      className="bg-white border border-blue-100 rounded-xl mb-4 sm:mb-5 overflow-visible"
    >
      {/* ── Row 1: search + location selector + view toggle ──────────────── */}
      <div className="flex items-center gap-2 px-3 sm:px-4 py-3 border-b border-blue-50 flex-wrap sm:flex-nowrap">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={filters.search || ""}
            onChange={(e) => set({ search: e.target.value || undefined })}
            placeholder="Search title, locality, address…"
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm border border-blue-100 rounded-xl bg-blue-50/40 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {filters.search && (
            <button
              onClick={() => set({ search: undefined })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* City + Locality — sits right of search on sm+, wraps below on mobile */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto order-3 sm:order-2">
          <CityLocalitySelector
            selectedCities={filters.city || []}
            selectedLocalities={filters.locality || []}
            onCitiesChange={(c) =>
              set({ city: c.length ? c : undefined, locality: undefined })
            }
            onLocalitiesChange={(l) =>
              set({ locality: l.length ? l : undefined })
            }
            open={open}
            toggle={toggle}
          />
        </div>

        {/* Right side: result count + view toggle */}
        <div className="flex items-center gap-2 flex-shrink-0 order-2 sm:order-3 ml-auto sm:ml-0">
          {totalCount !== undefined && (
            <span className="text-[11px] text-gray-400 font-medium hidden md:block whitespace-nowrap">
              {totalCount} listing{totalCount !== 1 ? "s" : ""}
            </span>
          )}
          <div className="flex items-center border border-blue-100 rounded-xl p-0.5">
            {(["grid", "list"] as const).map((m) => {
              const Icon = m === "grid" ? LayoutGrid : List;
              return (
                <button
                  key={m}
                  onClick={() => setViewMode(m)}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === m ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Row 2: filter pills ───────────────────────────────────────────── */}
      <div
        className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {/* Status — multi */}
        <Pill
          label={statusLabel}
          count={
            Array.isArray(filters.status)
              ? filters.status.length
              : filters.status
                ? 1
                : 0
          }
          open={open === "status"}
          onClick={() => toggle("status")}
        >
          <div className="py-1 min-w-[160px]">
            {STATUS_OPTIONS.map((o) => {
              const arr = Array.isArray(filters.status)
                ? filters.status
                : filters.status
                  ? [filters.status]
                  : [];
              const active =
                o.value === ""
                  ? arr.length === 0
                  : arr.includes(o.value as PropertyStatus);
              return (
                <button
                  key={o.value}
                  onClick={() => {
                    if (!o.value) {
                      set({ status: undefined });
                      return;
                    }
                    toggleArr("status", o.value as PropertyStatus);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors
                    ${active ? "bg-blue-50 text-blue-700 font-bold" : "text-gray-700 hover:bg-gray-50 font-medium"}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${o.dot}`}
                  />
                  {o.label}
                  {active && o.value && (
                    <Check className="w-3 h-3 text-blue-600 ml-auto flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </Pill>

        {/* Purpose */}
        <Pill
          label={filters.purpose ? String(filters.purpose) : "Purpose"}
          count={filters.purpose ? 1 : 0}
          open={open === "purpose"}
          onClick={() => toggle("purpose")}
        >
          <div className="py-1">
            {PURPOSE_OPTIONS.map((o) => (
              <Opt
                key={o.value}
                active={filters.purpose === o.value}
                onClick={() => {
                  set({ purpose: (o.value as PropertyPurpose) || undefined });
                  setOpen(null);
                }}
              >
                {o.label}
              </Opt>
            ))}
          </div>
        </Pill>

        {/* Property Type */}
        <Pill
          label={currentType?.name || "Type"}
          count={filters.propertyTypeId ? 1 : 0}
          open={open === "type"}
          onClick={() => toggle("type")}
        >
          <div className="py-1">
            <Opt
              active={!filters.propertyTypeId}
              onClick={() => {
                set({ propertyTypeId: undefined, subTypeId: undefined });
                setOpen(null);
              }}
            >
              All Types
            </Opt>
            {propertyTypes.map((pt) => (
              <Opt
                key={pt.id}
                active={filters.propertyTypeId === pt.id}
                onClick={() => {
                  set({ propertyTypeId: pt.id, subTypeId: undefined });
                  setOpen(null);
                }}
              >
                {pt.name}
              </Opt>
            ))}
          </div>
        </Pill>

        {/* Sub Type */}
        {subTypes.length > 0 && (
          <Pill
            label={
              subTypes.find((s) => s.id === filters.subTypeId)?.name ||
              "Sub Type"
            }
            count={filters.subTypeId ? 1 : 0}
            open={open === "subtype"}
            onClick={() => toggle("subtype")}
          >
            <div className="py-1">
              <Opt
                active={!filters.subTypeId}
                onClick={() => {
                  set({ subTypeId: undefined });
                  setOpen(null);
                }}
              >
                All Sub Types
              </Opt>
              {subTypes.map((st) => (
                <Opt
                  key={st.id}
                  active={filters.subTypeId === st.id}
                  onClick={() => {
                    set({ subTypeId: st.id });
                    setOpen(null);
                  }}
                >
                  {st.name}
                </Opt>
              ))}
            </div>
          </Pill>
        )}

        {/* Price */}
        <Pill
          label={filters.minPrice || filters.maxPrice ? "Price ✓" : "Price"}
          count={filters.minPrice || filters.maxPrice ? 1 : 0}
          open={open === "price"}
          onClick={() => toggle("price")}
        >
          <div className="py-1">
            <Opt
              active={!filters.minPrice && !filters.maxPrice}
              onClick={() => {
                set({ minPrice: undefined, maxPrice: undefined });
                setOpen(null);
              }}
            >
              Any Price
            </Opt>
            {PRICE_RANGES.map((r) => (
              <Opt
                key={r.label}
                active={
                  filters.minPrice === r.min && filters.maxPrice === r.max
                }
                onClick={() => {
                  set({ minPrice: r.min, maxPrice: r.max });
                  setOpen(null);
                }}
              >
                {r.label}
              </Opt>
            ))}
          </div>
        </Pill>

        {/* BHK (residential) */}
        {isResidential && (
          <Pill
            label="BHK"
            count={filters.bedrooms?.length || 0}
            open={open === "bhk"}
            onClick={() => toggle("bhk")}
          >
            <div className="p-3 min-w-[180px]">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-2">
                Bedrooms
              </p>
              <div className="flex flex-wrap gap-1.5">
                {BHK_OPTIONS.map((n) => (
                  <button
                    key={n}
                    onClick={() => toggleArr("bedrooms", n)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold border transition-colors
                      ${
                        (filters.bedrooms || []).includes(n)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-blue-200 hover:bg-blue-50"
                      }`}
                  >
                    {n === 6 ? "6+" : n}
                  </button>
                ))}
              </div>
            </div>
          </Pill>
        )}

        {/* Possession */}
        <Pill
          label={
            filters.possessionStatus
              ? filters.possessionStatus === "READY_TO_MOVE"
                ? "Ready"
                : "Under Const."
              : "Possession"
          }
          count={filters.possessionStatus ? 1 : 0}
          open={open === "possession"}
          onClick={() => toggle("possession")}
        >
          <div className="py-1">
            {POSSESSION_OPTIONS.map((o) => (
              <Opt
                key={o.value}
                active={filters.possessionStatus === o.value}
                onClick={() => {
                  set({ possessionStatus: o.value || undefined });
                  setOpen(null);
                }}
              >
                {o.label}
              </Opt>
            ))}
          </div>
        </Pill>

        {/* Furnishing (commercial) */}
        {isCommercial && (
          <Pill
            label={filters.furnishingStatus || "Furnishing"}
            count={filters.furnishingStatus ? 1 : 0}
            open={open === "furnishing"}
            onClick={() => toggle("furnishing")}
          >
            <div className="py-1">
              {FURNISHING_OPTIONS.map((o) => (
                <Opt
                  key={o.value}
                  active={filters.furnishingStatus === o.value}
                  onClick={() => {
                    set({ furnishingStatus: o.value || undefined });
                    setOpen(null);
                  }}
                >
                  {o.label}
                </Opt>
              ))}
            </div>
          </Pill>
        )}

        {/* Facing (commercial) */}
        {isCommercial && (
          <Pill
            label={filters.facingDirection || "Facing"}
            count={filters.facingDirection ? 1 : 0}
            open={open === "facing"}
            onClick={() => toggle("facing")}
          >
            <div className="py-1">
              {FACING_OPTIONS.map((o) => (
                <Opt
                  key={o.value}
                  active={filters.facingDirection === o.value}
                  onClick={() => {
                    set({ facingDirection: o.value || undefined });
                    setOpen(null);
                  }}
                >
                  {o.label}
                </Opt>
              ))}
            </div>
          </Pill>
        )}

        {/* Verified */}
        <button
          onClick={() => set({ verified: filters.verified ? undefined : true })}
          className={`inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full border text-[11px] sm:text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all
            ${
              filters.verified
                ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-200"
                : "bg-white border-blue-200 text-blue-700 hover:bg-blue-50"
            }`}
        >
          <Check className="w-3 h-3" /> Verified
        </button>

        {/* Balcony (residential) */}
        {isResidential && (
          <button
            onClick={() =>
              set({ hasBalcony: filters.hasBalcony ? undefined : true })
            }
            className={`inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full border text-[11px] sm:text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all
              ${
                filters.hasBalcony
                  ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-200"
                  : "bg-white border-blue-200 text-blue-700 hover:bg-blue-50"
              }`}
          >
            Balcony
          </button>
        )}

        {/* Divider */}
        <div className="w-px h-5 bg-gray-200 flex-shrink-0 mx-0.5" />

        {/* Sort */}
        <div className="inline-flex items-center gap-1 flex-shrink-0">
          <ArrowUpDown className="w-3 h-3 text-blue-400 flex-shrink-0" />
          <select
            value={sortValue}
            onChange={(e) => {
              const [by, ord] = e.target.value.split("-");
              set({ sortBy: by, sortOrder: ord as "asc" | "desc" });
            }}
            className="text-[11px] sm:text-xs font-semibold border border-blue-200 bg-blue-50 text-blue-700 rounded-full px-2 sm:px-2.5 py-1 sm:py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer whitespace-nowrap"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reset */}
        {activeCount > 0 && (
          <button
            onClick={reset}
            className="inline-flex items-center gap-1 flex-shrink-0 px-2.5 sm:px-3 py-1.5 border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-[11px] sm:text-xs font-semibold rounded-full whitespace-nowrap transition-colors"
          >
            <X className="w-3 h-3" /> Reset ({activeCount})
          </button>
        )}
      </div>
    </div>
  );
};
