import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  useGetCitiesQuery,
  useGetLocalitiesQuery,
} from "../../../services/locationApi";
import type { AgentsFilter } from "../../../types";

interface Props {
  filters: AgentsFilter;
  setFilters: (p: Partial<AgentsFilter>) => void;
  viewMode: "grid" | "list";
  onViewMode: (m: "grid" | "list") => void;
}

const lbl =
  "block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1";
const inp =
  "w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all";

export const AgentsFilters: React.FC<Props> = ({
  filters,
  setFilters,
  viewMode,
  onViewMode,
}) => {
  const [showAdv, setShowAdv] = useState(false);

  const { data: citiesData } = useGetCitiesQuery({ limit: 200 });
  const { data: localitiesData } = useGetLocalitiesQuery(
    { cityId: filters.leadCityId || "", limit: 500 },
    { skip: !filters.leadCityId },
  );

  const cities = citiesData?.data || [];
  const localities = localitiesData?.data || [];

  const activeCount = [
    filters.city,
    filters.locality,
    filters.onlyAvailable ? "x" : undefined,
  ].filter(Boolean).length;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-3 sm:p-4 mb-4 sm:mb-5">
      {/* Row 1: search + view toggle + filter button */}
      <div className="flex items-center gap-2 mb-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search agents…"
            value={filters.search || ""}
            onChange={(e) =>
              setFilters({ search: e.target.value || undefined })
            }
            className={`${inp} pl-9`}
          />
        </div>

        {/* Grid/List toggle */}
        <div className="flex border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden flex-shrink-0">
          {(["grid", "list"] as const).map((m) => (
            <button
              key={m}
              onClick={() => onViewMode(m)}
              className={`px-2.5 py-2 text-[11px] font-bold transition-colors
                ${
                  viewMode === m
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-900 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
            >
              {m === "grid" ? "⊞" : "☰"}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAdv((v) => !v)}
          className={`flex items-center gap-1 px-2.5 py-2 rounded-xl border text-[11px] sm:text-xs font-bold flex-shrink-0 transition-all
            ${
              showAdv || activeCount > 0
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50"
            }`}
        >
          <SlidersHorizontal className="w-3 h-3" />
          <span className="hidden sm:inline">Filters</span>
          {activeCount > 0 && (
            <span
              className={`w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center
              ${showAdv ? "bg-white text-blue-600" : "bg-blue-100 text-blue-700"}`}
            >
              {activeCount}
            </span>
          )}
          <ChevronDown
            className={`w-3 h-3 transition-transform ${showAdv ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Advanced panel */}
      {showAdv && (
        <div className="pt-2.5 border-t border-gray-100 dark:border-gray-800 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* City — API driven */}
          <div>
            <label className={lbl}>City</label>
            <select
              value={filters.leadCityId || ""}
              onChange={(e) => {
                const c = cities.find((x) => x.id === e.target.value);
                setFilters({
                  leadCityId: c?.id,
                  city: c?.name,
                  locality: undefined,
                });
              }}
              className={`${inp} appearance-none`}
            >
              <option value="">All cities</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                  {c.state ? `, ${c.state}` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Locality — depends on city */}
          <div>
            <label className={lbl}>Locality</label>
            <select
              value={filters.locality || ""}
              onChange={(e) =>
                setFilters({ locality: e.target.value || undefined })
              }
              disabled={!filters.leadCityId}
              className={`${inp} appearance-none ${!filters.leadCityId ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <option value="">All localities</option>
              {localities.map((l) => (
                <option key={l.id} value={l.name}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* Available only */}
          <div className="flex items-end pb-0.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="relative flex-shrink-0">
                <input
                  type="checkbox"
                  checked={!!filters.onlyAvailable}
                  onChange={(e) =>
                    setFilters({ onlyAvailable: e.target.checked || undefined })
                  }
                  className="sr-only peer"
                />
                <div
                  className="w-9 h-5 bg-gray-200 dark:bg-gray-700 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full
                  peer peer-checked:after:translate-x-full peer-checked:after:border-white
                  after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                  after:bg-white after:border-gray-300 after:border after:rounded-full
                  after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"
                />
              </div>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Available only
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Active filter chips */}
      {(filters.search ||
        filters.city ||
        filters.locality ||
        filters.onlyAvailable) && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {filters.search && (
            <Chip
              label={`"${filters.search}"`}
              color="blue"
              onRemove={() => setFilters({ search: undefined })}
            />
          )}
          {filters.city && (
            <Chip
              label={filters.city}
              color="purple"
              onRemove={() =>
                setFilters({
                  leadCityId: undefined,
                  city: undefined,
                  locality: undefined,
                })
              }
            />
          )}
          {filters.locality && (
            <Chip
              label={filters.locality}
              color="green"
              onRemove={() => setFilters({ locality: undefined })}
            />
          )}
          {filters.onlyAvailable && (
            <Chip
              label="Available"
              color="emerald"
              onRemove={() => setFilters({ onlyAvailable: undefined })}
            />
          )}
        </div>
      )}
    </div>
  );
};

const chipColors: Record<string, string> = {
  blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  purple:
    "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
  green: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  emerald:
    "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
};

const Chip: React.FC<{
  label: string;
  color: string;
  onRemove: () => void;
}> = ({ label, color, onRemove }) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold ${chipColors[color]}`}
  >
    {label}
    <X
      className="w-2.5 h-2.5 cursor-pointer hover:opacity-70"
      onClick={onRemove}
    />
  </span>
);
