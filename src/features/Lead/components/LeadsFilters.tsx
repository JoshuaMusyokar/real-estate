import {
  Search,
  X,
  ChevronDown,
  UserPlus,
  Trash2,
  SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";
import type {
  LeadFilter,
  LeadPriority,
  LeadSource,
  LeadStage,
} from "../../../types";
import {
  useGetCitiesQuery,
  useGetLocalitiesQuery,
} from "../../../services/locationApi";
import { Card, CardContent } from "../../../components/ui/Card";
import { LEAD_PRIORITIES, LEAD_SOURCES, LEAD_STAGES } from "../../../utils";
import Button from "../../../components/ui/button/Button";

interface LeadsFiltersProps {
  filters: LeadFilter;
  setFilters: React.Dispatch<React.SetStateAction<LeadFilter>>;
  selectedLeads: Set<string>;
  onBulkDelete?: () => void;
  onAssignAgent?: () => void;
}

// ── Small pill-style filter dropdown ─────────────────────────────────────────
function FilterPill<T extends string>({
  label,
  value,
  options,
  onSelect,
  formatLabel,
}: {
  label: string;
  value: T | "";
  options: T[];
  onSelect: (v: T | "") => void;
  formatLabel: (v: T | "") => string;
}) {
  const [open, setOpen] = useState(false);
  const active = !!value;

  return (
    <div className="relative flex-shrink-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0
          ${
            active
              ? "bg-blue-600 border-blue-600 text-white"
              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
      >
        <span className="max-w-[120px] truncate">
          {value ? formatLabel(value) : label}
        </span>
        {active ? (
          <X
            className="w-3 h-3 flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onSelect("");
            }}
          />
        ) : (
          <ChevronDown
            className={`w-3 h-3 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1.5 z-40 bg-white border border-gray-200 rounded-xl shadow-xl min-w-[180px] max-h-64 overflow-y-auto">
            <button
              onClick={() => {
                onSelect("");
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-gray-50 transition-colors
                ${value === "" ? "text-blue-600 bg-blue-50 font-bold" : "text-gray-700"}`}
            >
              All {label}s
            </button>
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onSelect(opt);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-gray-50 transition-colors
                  ${value === opt ? "text-blue-600 bg-blue-50 font-bold" : "text-gray-700"}`}
              >
                {formatLabel(opt)}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── City selector sub-component ──────────────────────────────────────────────
const CitySelect: React.FC<{
  filters: LeadFilter;
  set: (p: Partial<LeadFilter>) => void;
}> = ({ filters, set }) => {
  const { data: citiesData } = useGetCitiesQuery({ limit: 200 });
  const cities = citiesData?.data || [];

  return (
    <div>
      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">
        City
      </label>
      <select
        value={filters.cityId || ""}
        onChange={(e) => {
          const selected = cities.find((c) => c.id === e.target.value);
          set({
            cityId: selected?.id || undefined,
            city: selected?.name || undefined,
            locality: undefined, // clear locality when city changes
          });
        }}
        className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-400 outline-none bg-white"
      >
        <option value="">All Cities</option>
        {cities.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
            {c.state ? `, ${c.state}` : ""}
          </option>
        ))}
      </select>
    </div>
  );
};

// ── Locality selector sub-component ──────────────────────────────────────────
const LocalitySelect: React.FC<{
  filters: LeadFilter;
  set: (p: Partial<LeadFilter>) => void;
}> = ({ filters, set }) => {
  const { data: localitiesData, isLoading } = useGetLocalitiesQuery(
    { cityId: filters.cityId || "", limit: 500 },
    { skip: !filters.cityId },
  );
  const localities = localitiesData?.data || [];

  if (!filters.cityId)
    return (
      <div>
        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">
          Locality
        </label>
        <select
          disabled
          className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-gray-50 text-gray-400 outline-none cursor-not-allowed"
        >
          <option>Select a city first</option>
        </select>
      </div>
    );

  return (
    <div>
      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">
        Locality {isLoading && <span className="text-gray-300">…</span>}
      </label>
      <select
        value={filters.locality || ""}
        onChange={(e) => set({ locality: e.target.value || undefined })}
        className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-400 outline-none bg-white"
      >
        <option value="">All Localities</option>
        {localities.map((l) => (
          <option key={l.id} value={l.name}>
            {l.name}
          </option>
        ))}
      </select>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
export const LeadsFilters: React.FC<LeadsFiltersProps> = ({
  filters,
  setFilters,
  selectedLeads,
  onBulkDelete,
  onAssignAgent,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const set = (patch: Partial<LeadFilter>) =>
    setFilters((prev) => ({ ...prev, ...patch }));

  const reset = () => setFilters({ sortBy: "createdAt", sortOrder: "desc" });

  const showBulkBar =
    selectedLeads.size > 0 && (!!onBulkDelete || !!onAssignAgent);

  const activeFilterCount = [
    filters.stage,
    filters.priority,
    filters.source,
    filters.city,
    filters.locality,
    filters.purpose,
    filters.minPrice ?? filters.maxPrice,
    filters.minScore ?? filters.maxScore,
    filters.dateFrom ?? filters.dateTo,
    filters.isActive !== undefined ? "x" : undefined,
    filters.assignedToId,
  ].filter(Boolean).length;

  return (
    <Card>
      <CardContent className="p-2.5 sm:p-4">
        {/* ── Row 1: Search + quick pills + advanced toggle ──────────────── */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 flex-nowrap sm:flex-wrap sm:flex-nowrap mb-2">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search name, email, phone…"
              value={filters.search || ""}
              onChange={(e) => set({ search: e.target.value || undefined })}
              className="w-full pl-8 pr-7 py-1.5 sm:py-2 border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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

          {/* Advanced toggle */}
          <button
            onClick={() => setShowAdvanced((v) => !v)}
            className={`flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border text-xs font-semibold flex-shrink-0 transition-all
              ${
                showAdvanced || activeFilterCount > 0
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
            {activeFilterCount > 0 && (
              <span
                className={`w-4 h-4 rounded-full text-[10px] font-black flex items-center justify-center
                ${showAdvanced ? "bg-white text-blue-600" : "bg-blue-100 text-blue-700"}`}
              >
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* ── Row 2: Quick pill filters ──────────────────────────────────── */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 flex-nowrap sm:flex-wrap">
          <FilterPill<LeadStage>
            label="Stage"
            value={filters.stage || ""}
            options={LEAD_STAGES}
            onSelect={(v) => set({ stage: v || undefined })}
            formatLabel={(v) => v.replace(/_/g, " ")}
          />

          <FilterPill<LeadPriority>
            label="Priority"
            value={filters.priority || ""}
            options={LEAD_PRIORITIES}
            onSelect={(v) => set({ priority: v || undefined })}
            formatLabel={(v) => v}
          />

          <FilterPill<LeadSource>
            label="Source"
            value={filters.source || ""}
            options={LEAD_SOURCES}
            onSelect={(v) => set({ source: v || undefined })}
            formatLabel={(v) => v.replace(/_/g, " ")}
          />

          {/* Sort */}
          <div className="flex items-center gap-1 ml-auto flex-shrink-0">
            <select
              value={`${filters.sortBy ?? "createdAt"}-${filters.sortOrder ?? "desc"}`}
              onChange={(e) => {
                const [by, ord] = e.target.value.split("-");
                set({
                  sortBy: by as LeadFilter["sortBy"],
                  sortOrder: ord as "asc" | "desc",
                });
              }}
              className="text-[11px] sm:text-xs font-semibold border border-gray-200 bg-gray-50 text-gray-700 rounded-xl px-2 py-1.5 sm:px-2.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer flex-shrink-0"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="score-desc">Highest Score</option>
              <option value="score-asc">Lowest Score</option>
              <option value="updatedAt-desc">Recently Updated</option>
              <option value="nextFollowUpAt-asc">Next Follow-up</option>
            </select>

            {activeFilterCount > 0 && (
              <button
                onClick={reset}
                className="flex items-center gap-1 px-2 py-1.5 sm:px-2.5 sm:py-2 border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-[11px] sm:text-xs font-semibold rounded-xl transition-colors whitespace-nowrap flex-shrink-0"
              >
                <X className="w-3 h-3" /> Reset
              </button>
            )}
          </div>
        </div>

        {/* ── Advanced filters panel ─────────────────────────────────────── */}
        {showAdvanced && (
          <div className="mt-2.5 pt-2.5 border-t border-gray-100 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {/* City — API-driven select */}
            <CitySelect filters={filters} set={set} />

            {/* Locality — depends on selected city */}
            <LocalitySelect filters={filters} set={set} />

            {/* Purpose */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                Purpose
              </label>
              <select
                value={filters.purpose || ""}
                onChange={(e) => set({ purpose: e.target.value || undefined })}
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-400 outline-none bg-white"
              >
                <option value="">Any</option>
                <option value="SALE">Sale</option>
                <option value="RENT">Rent</option>
                <option value="LEASE">Lease</option>
                <option value="PG">PG</option>
              </select>
            </div>

            {/* Active status */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                Status
              </label>
              <select
                value={
                  filters.isActive === undefined ? "" : String(filters.isActive)
                }
                onChange={(e) =>
                  set({
                    isActive:
                      e.target.value === ""
                        ? undefined
                        : e.target.value === "true",
                  })
                }
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-400 outline-none bg-white"
              >
                <option value="">All</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            {/* Min price */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                Min Price
              </label>
              <input
                type="number"
                value={filters.minPrice ?? ""}
                onChange={(e) =>
                  set({
                    minPrice: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                placeholder="0"
                min="0"
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Max price */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                Max Price
              </label>
              <input
                type="number"
                value={filters.maxPrice ?? ""}
                onChange={(e) =>
                  set({
                    maxPrice: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                placeholder="No limit"
                min="0"
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Min score */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                Min Score
              </label>
              <input
                type="number"
                value={filters.minScore ?? ""}
                onChange={(e) =>
                  set({
                    minScore: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                placeholder="0"
                min="0"
                max="100"
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Max score */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                Max Score
              </label>
              <input
                type="number"
                value={filters.maxScore ?? ""}
                onChange={(e) =>
                  set({
                    maxScore: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                placeholder="100"
                min="0"
                max="100"
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Date from */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                Created From
              </label>
              <input
                type="date"
                value={filters.dateFrom || ""}
                onChange={(e) => set({ dateFrom: e.target.value || undefined })}
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Date to */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                Created To
              </label>
              <input
                type="date"
                value={filters.dateTo || ""}
                onChange={(e) => set({ dateTo: e.target.value || undefined })}
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Page size */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                Per Page
              </label>
              <select
                value={filters.limit ?? 20}
                onChange={(e) =>
                  set({ limit: Number(e.target.value), page: 1 })
                }
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-400 outline-none bg-white"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        )}

        {/* ── Bulk action bar ────────────────────────────────────────────── */}
        {showBulkBar && (
          <div className="mt-2.5 p-2.5 sm:p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between gap-2 sm:gap-3 flex-wrap">
            <span className="text-blue-700 font-semibold text-xs sm:text-sm">
              {selectedLeads.size} lead{selectedLeads.size > 1 ? "s" : ""}{" "}
              selected
            </span>
            <div className="flex gap-2">
              {onAssignAgent && selectedLeads.size === 1 && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onAssignAgent}
                  startIcon={<UserPlus className="w-3.5 h-3.5" />}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Assign
                </Button>
              )}
              {onBulkDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBulkDelete}
                  startIcon={<Trash2 className="w-3.5 h-3.5" />}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
