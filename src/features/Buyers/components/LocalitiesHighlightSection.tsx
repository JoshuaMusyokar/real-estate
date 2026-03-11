// LocalitiesHighlightSection.tsx  (NearbyPlacesSection)
import React, { useState, useEffect } from "react";
import {
  MapPin,
  Navigation,
  School,
  Heart,
  Utensils,
  ShoppingCart,
  Trees,
  Bus,
  Church,
  PiggyBank,
  Film,
  ChevronDown,
  ChevronUp,
  User,
  Database,
} from "lucide-react";
import type { LocalityHighlight, NearbyPlace } from "../../../types";

interface NearbyPlacesSectionProps {
  localityName: string;
  cityName: string;
  localityHighlights?: LocalityHighlight[];
  nearbyPlaces?: NearbyPlace[];
}

interface MergedPlace {
  id: string;
  name: string;
  distance: number;
  distanceDisplay: string;
  category: string;
  categoryType: "locality" | "user";
  icon: string | null;
  source: string;
}

const CATEGORY_CONFIG: Record<
  string,
  { icon: React.ElementType; color: string; label: string }
> = {
  school: {
    icon: School,
    color: "text-blue-600 bg-blue-50 border-blue-100",
    label: "Schools",
  },
  hospital: {
    icon: Heart,
    color: "text-red-600 bg-red-50 border-red-100",
    label: "Hospitals",
  },
  restaurant: {
    icon: Utensils,
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    label: "Restaurants",
  },
  cafe: {
    icon: Utensils,
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    label: "Cafes",
  },
  shopping: {
    icon: ShoppingCart,
    color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    label: "Shopping",
  },
  mall: {
    icon: ShoppingCart,
    color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    label: "Malls",
  },
  supermarket: {
    icon: ShoppingCart,
    color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    label: "Supermarkets",
  },
  park: {
    icon: Trees,
    color: "text-green-600 bg-green-50 border-green-100",
    label: "Parks",
  },
  transport: {
    icon: Bus,
    color: "text-amber-600 bg-amber-50 border-amber-100",
    label: "Transport",
  },
  metro: {
    icon: Bus,
    color: "text-amber-600 bg-amber-50 border-amber-100",
    label: "Metro",
  },
  bus: {
    icon: Bus,
    color: "text-amber-600 bg-amber-50 border-amber-100",
    label: "Bus",
  },
  worship: {
    icon: Church,
    color: "text-violet-600 bg-violet-50 border-violet-100",
    label: "Worship",
  },
  bank: {
    icon: PiggyBank,
    color: "text-lime-600 bg-lime-50 border-lime-100",
    label: "Banks",
  },
  entertainment: {
    icon: Film,
    color: "text-pink-600 bg-pink-50 border-pink-100",
    label: "Entertainment",
  },
  cinema: {
    icon: Film,
    color: "text-pink-600 bg-pink-50 border-pink-100",
    label: "Cinemas",
  },
  gym: {
    icon: Film,
    color: "text-pink-600 bg-pink-50 border-pink-100",
    label: "Gyms",
  },
  pharmacy: {
    icon: Heart,
    color: "text-red-600 bg-red-50 border-red-100",
    label: "Pharmacies",
  },
  other: {
    icon: MapPin,
    color: "text-gray-500 bg-gray-50 border-gray-200",
    label: "Other",
  },
};

const getCfg = (cat: string) =>
  CATEGORY_CONFIG[cat.toLowerCase()] || CATEGORY_CONFIG.other;

const parseDistanceToKm = (s: string): number => {
  if (!s) return 0;
  const m = s.toLowerCase().match(/(\d+(?:\.\d+)?)\s*(m|km|mi)/);
  if (!m) return 0;
  const v = parseFloat(m[1]);
  return m[2] === "m" ? v / 1000 : m[2] === "mi" ? v * 1.60934 : v;
};

const distColor = (d: number) =>
  d <= 1 ? "text-emerald-600" : d <= 3 ? "text-amber-600" : "text-gray-500";

export const NearbyPlacesSection: React.FC<NearbyPlacesSectionProps> = ({
  localityName,
  cityName,
  localityHighlights = [],
  nearbyPlaces = [],
}) => {
  const [expanded, setExpanded] = useState(false);
  const [merged, setMerged] = useState<MergedPlace[]>([]);
  const [grouped, setGrouped] = useState<Record<string, MergedPlace[]>>({});
  const [showUser, setShowUser] = useState(true);
  const [showLocality, setShowLocality] = useState(true);

  useEffect(() => {
    const m: MergedPlace[] = [];

    localityHighlights.forEach((h, i) =>
      m.push({
        id: `loc-${i}`,
        name: h.name,
        distance: h.distance_km,
        distanceDisplay:
          h.distance_km < 1
            ? `${(h.distance_km * 1000).toFixed(0)}m`
            : `${h.distance_km.toFixed(1)}km`,
        category: h.type,
        categoryType: "locality",
        source: "DB",
        icon: null,
      }),
    );

    const np: NearbyPlace[] =
      typeof nearbyPlaces === "string"
        ? JSON.parse(nearbyPlaces)
        : nearbyPlaces || [];
    np.forEach((p, i) =>
      m.push({
        id: `usr-${i}`,
        name: p.name,
        distance: parseDistanceToKm(p.distance),
        distanceDisplay: p.distance,
        category: p.category,
        categoryType: "user",
        icon: p.icon,
        source: "Owner",
      }),
    );

    m.sort((a, b) => a.distance - b.distance);
    setMerged(m);

    const g = m.reduce(
      (acc, p) => {
        const k = p.category.toLowerCase();
        acc[k] = acc[k] || [];
        acc[k].push(p);
        return acc;
      },
      {} as Record<string, MergedPlace[]>,
    );
    Object.values(g).forEach((arr) =>
      arr.sort((a, b) => a.distance - b.distance),
    );
    setGrouped(g);
  }, [localityHighlights, nearbyPlaces]);

  const filtered = merged.filter(
    (p) =>
      (showUser || p.categoryType !== "user") &&
      (showLocality || p.categoryType !== "locality"),
  );
  const topPlaces = filtered.slice(0, 5);
  const extras = filtered.slice(5);
  const catKeys = Object.keys(grouped).slice(0, 5);

  if (merged.length === 0) {
    return (
      <div className="bg-white border border-blue-100 rounded-xl p-5 text-center">
        <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2">
          <MapPin className="w-4 h-4 text-blue-300" />
        </div>
        <p className="text-xs font-bold text-gray-900 mb-1">Nearby Places</p>
        <p className="text-[11px] text-gray-400">
          No places found for {localityName}, {cityName}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-blue-100 rounded-xl overflow-hidden">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-blue-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-200 flex-shrink-0">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900">
                Nearby Places
              </h3>
              <p className="text-[11px] text-gray-400">
                {localityName}, {cityName} · {merged.length} places
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
            {merged.length}
          </span>
        </div>

        {/* Source toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowUser((s) => !s)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors
              ${showUser ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-50 text-gray-400 border-gray-200"}`}
          >
            <User className="w-3 h-3" /> Owner ({nearbyPlaces.length})
          </button>
          <button
            onClick={() => setShowLocality((s) => !s)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors
              ${showLocality ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-gray-50 text-gray-400 border-gray-200"}`}
          >
            <Database className="w-3 h-3" /> Database (
            {localityHighlights.length})
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        {/* Category chips */}
        <div className="flex items-center gap-1.5 mb-3.5 overflow-x-auto pb-1 scrollbar-hide">
          {catKeys.map((cat) => {
            const cfg = getCfg(cat);
            const Icon = cfg.icon;
            return (
              <div
                key={cat}
                className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${cfg.color}`}
              >
                <Icon className="w-3 h-3" /> {cfg.label}
                <span className="opacity-50 ml-0.5">{grouped[cat].length}</span>
              </div>
            );
          })}
          {Object.keys(grouped).length > 5 && (
            <span className="flex-shrink-0 text-[11px] font-semibold text-gray-400 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full">
              +{Object.keys(grouped).length - 5} more
            </span>
          )}
        </div>

        {/* Top 5 places */}
        <div className="space-y-1.5 mb-3">
          {topPlaces.map((place) => {
            const cfg = getCfg(place.category);
            const Icon = cfg.icon;
            const isUser = place.categoryType === "user";
            return (
              <div
                key={place.id}
                className="flex items-center gap-3 px-3 py-2.5 bg-gray-50/70 hover:bg-blue-50/40 border border-gray-100 hover:border-blue-100 rounded-xl transition-all"
              >
                <div
                  className={`relative w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 ${cfg.color}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {isUser && (
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border border-white flex items-center justify-center">
                      <User className="w-2 h-2 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs sm:text-sm font-semibold text-gray-900 block truncate">
                    {place.name}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Navigation className="w-2.5 h-2.5 text-gray-400" />
                    <span
                      className={`text-[11px] font-semibold ${distColor(place.distance)}`}
                    >
                      {place.distanceDisplay}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      · {isUser ? "owner" : "db"}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 border
                  ${place.distance <= 1 ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-gray-100 text-gray-500 border-gray-200"}`}
                >
                  {place.distance <= 1 ? "Walk" : "Drive"}
                </span>
              </div>
            );
          })}
        </div>

        {/* Expand toggle */}
        {extras.length > 0 && (
          <button
            onClick={() => setExpanded((s) => !s)}
            className="w-full flex items-center justify-center gap-1.5 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-xl text-[11px] font-semibold text-blue-600 transition-colors mb-3"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" /> Show less
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" /> {extras.length} more
                places
              </>
            )}
          </button>
        )}

        {/* Expanded grouped list */}
        {expanded && (
          <div className="space-y-4 pt-3 border-t border-blue-50 mb-3">
            {Object.entries(grouped).map(([cat, places]) => {
              const cfg = getCfg(cat);
              const Icon = cfg.icon;
              const fp = places.filter((p) => filtered.includes(p));
              if (!fp.length) return null;
              return (
                <div key={cat}>
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold mb-2 ${cfg.color}`}
                  >
                    <Icon className="w-3 h-3" /> {cfg.label} ({fp.length})
                  </div>
                  <div className="space-y-1">
                    {fp.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between py-1 px-2 hover:bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xs text-gray-700 truncate">
                            {p.name}
                          </span>
                          {p.categoryType === "user" && (
                            <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-full flex-shrink-0">
                              owner
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-xs font-semibold ml-2 flex-shrink-0 ${distColor(p.distance)}`}
                        >
                          {p.distanceDisplay}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Summary stats */}
        <div className="grid grid-cols-4 gap-1.5 pt-3 border-t border-blue-50">
          {[
            {
              label: "≤1km",
              value: filtered.filter((p) => p.distance <= 1).length,
              color: "bg-emerald-50 text-emerald-700 border-emerald-100",
            },
            {
              label: "≤3km",
              value: filtered.filter((p) => p.distance <= 3).length,
              color: "bg-amber-50 text-amber-700 border-amber-100",
            },
            {
              label: "Types",
              value: Object.keys(grouped).length,
              color: "bg-blue-50 text-blue-700 border-blue-100",
            },
            {
              label: "Owner",
              value: nearbyPlaces.length,
              color: "bg-indigo-50 text-indigo-700 border-indigo-100",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className={`text-center py-2 rounded-lg border ${color}`}
            >
              <div className="text-sm sm:text-base font-black">{value}</div>
              <div className="text-[10px] font-medium mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
            <span className="text-[10px] text-gray-400">Added by owner</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
            <span className="text-[10px] text-gray-400">Local database</span>
          </div>
        </div>
      </div>
    </div>
  );
};
