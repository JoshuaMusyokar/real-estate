/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { Search, X, ChevronRight } from "lucide-react";
import {
  useGetCitiesQuery,
  useGetLocalitiesQuery,
} from "../../services/locationApi";
import { useGetPropertyTypesQuery } from "../../services/propertyApi";
import { useAppDispatch } from "../../hooks";
import { setFilters } from "../../store/slices/filterSlice";
import { encodeFilters } from "../../utils/filterEncoder";
import type {
  City,
  Locality,
  PropertyPurpose,
  PropertySearchFilters,
} from "../../types";

import { CitySelector } from "./CitySelector";
import { SuggestionsDropdown } from "./components/SuggestionDropdown";
import {
  PURPOSE_OPTIONS,
  COMMERCIAL_SUB_PURPOSES,
  POPULAR_SEARCHES,
  getPropertyTypeFromPurpose,
  getPropertyPurposeFromPurpose,
  type SearchComponentProps,
  type SuggestionItem,
} from "../../types/search";
import { MobileLocalityChips } from "./components/MobileLocalityChips";

export const SearchComponent: React.FC<SearchComponentProps> = ({
  variant = "default",
  onSearch,
  initialCity,
  onPurposeChange,
  initialPurpose = "buy",
  onPropertyPurposeChange,
  onPropertyTypeChange,
  onCityChange: onCityChangeProp,
}) => {
  const dispatch = useAppDispatch();

  // ── State ──────────────────────────────────────────────────────────────────
  const [purpose, setPurpose] = useState<string>(initialPurpose);
  const [commercialSub, setCommercialSub] = useState("buy");
  const [selectedCityId, setSelectedCityId] = useState("");
  const [selectedCityName, setSelectedCityName] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedLocalities, setSelectedLocalities] = useState<
    SuggestionItem[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [popularLocalities, setPopularLocalities] = useState<SuggestionItem[]>(
    [],
  );
  const [citiesSearch, setCitiesSearch] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const chipsContainerRef = useRef<HTMLDivElement>(null);

  // ── Data ───────────────────────────────────────────────────────────────────
  const { data: citiesData } = useGetCitiesQuery({
    search: citiesSearch,
    limit: 100000,
  });
  const { data: propertyTypesData } = useGetPropertyTypesQuery({
    isActive: true,
    includeSubTypes: false,
  });
  const cities: City[] = citiesData?.data || [];
  const propertyTypes = propertyTypesData?.data || [];

  const { data: localitiesData } = useGetLocalitiesQuery(
    { cityId: selectedCityId, limit: 200 },
    { skip: !selectedCityId },
  );

  const { data: searchLocalitiesData } = useGetLocalitiesQuery(
    { search: searchInput, cityId: selectedCityId, limit: 100 },
    { skip: !selectedCityId || searchInput.length < 1 },
  );

  // ── Init city ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!cities.length) return;
    if (initialCity) {
      const found = cities.find(
        (c) => c.name.toLowerCase() === initialCity.toLowerCase(),
      );
      if (found) {
        setSelectedCityId(found.id);
        setSelectedCityName(found.name);
        return;
      }
    }
    const delhi = cities.find((c) => c.name.toLowerCase().includes("delhi"));
    const first = delhi || cities[0];
    setSelectedCityId(first.id);
    setSelectedCityName(first.name);
  }, [cities, initialCity]);

  // Propagate initial type/purpose once
  useEffect(() => {
    onPropertyTypeChange?.(getPropertyTypeFromPurpose(initialPurpose));
    onPropertyPurposeChange?.(getPropertyPurposeFromPurpose(initialPurpose));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Popular localities ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedCityId || !localitiesData?.data) return;
    setPopularLocalities(
      localitiesData.data.slice(0, 8).map((loc: Locality) => ({
        id: loc.id,
        type: "locality" as const,
        name: loc.name,
        displayName: `${loc.name}, ${selectedCityName}`,
        cityId: selectedCityId,
        cityName: selectedCityName,
      })),
    );
  }, [selectedCityId, selectedCityName, localitiesData]);

  // ── Build suggestions ──────────────────────────────────────────────────────
  useEffect(() => {
    const items: SuggestionItem[] = [];

    if (searchInput.length >= 2) {
      cities
        .filter(
          (c) =>
            c.name.toLowerCase().includes(searchInput.toLowerCase()) ||
            (c.state ?? "").toLowerCase().includes(searchInput.toLowerCase()),
        )
        .slice(0, 3)
        .forEach((c) =>
          items.push({
            id: c.id,
            type: "city",
            name: c.name,
            displayName: c.state ? `${c.name}, ${c.state}` : c.name,
            cityId: c.id,
            cityName: c.name,
          }),
        );
    }

    if (
      selectedCityId &&
      searchLocalitiesData?.data &&
      searchInput.length >= 1
    ) {
      // Filter out already selected localities from suggestions
      const selectedIds = new Set(selectedLocalities.map((l) => l.id));
      searchLocalitiesData.data
        .filter((loc: Locality) => !selectedIds.has(loc.id))
        .slice(0, 5)
        .forEach((loc: Locality) =>
          items.push({
            id: loc.id,
            type: "locality",
            name: loc.name,
            displayName: `${loc.name}, ${selectedCityName}`,
            cityId: selectedCityId,
            cityName: selectedCityName,
          }),
        );
    }

    if (searchInput.length >= 2) {
      POPULAR_SEARCHES.filter((t) =>
        t.toLowerCase().includes(searchInput.toLowerCase()),
      )
        .slice(0, 3)
        .forEach((t) =>
          items.push({
            id: `popular-${t}`,
            type: "popular",
            name: t,
            displayName: `${t} in ${selectedCityName}`,
            cityId: selectedCityId,
            cityName: selectedCityName,
          }),
        );
    }

    setSuggestions(items);
  }, [
    searchInput,
    selectedCityId,
    selectedCityName,
    cities,
    searchLocalitiesData,
    selectedLocalities, // Add this dependency to filter out selected ones
  ]);

  // ── Click outside ──────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  // useEffect(() => {
  //   const handler = (e: MouseEvent) => {
  //     if (
  //       searchWrapperRef.current &&
  //       !searchWrapperRef.current.contains(e.target as Node)
  //     ) {
  //       setShowSuggestions(false);
  //     }
  //   };

  //   document.addEventListener("click", handler);

  //   return () => document.removeEventListener("click", handler);
  // }, []);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleCityChange = (id: string, name: string) => {
    setSelectedCityId(id);
    setSelectedCityName(name);
    setSelectedLocalities([]); // Clear localities when city changes
    setSearchInput("");
    setShowSuggestions(false);
    // Bubble up so PublicHeader (and any other consumer) stays in sync
    onCityChangeProp?.(id, name);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handlePurposeChange = (next: string) => {
    const prev = purpose;
    setPurpose(next);
    if (next === "commercial") setCommercialSub("buy");

    const nextType = getPropertyTypeFromPurpose(next);
    const prevType = getPropertyTypeFromPurpose(prev);
    const nextPurpose = getPropertyPurposeFromPurpose(
      next,
      next === "commercial" ? "buy" : undefined,
    );
    const prevPurpose = getPropertyPurposeFromPurpose(
      prev,
      prev === "commercial" ? commercialSub : undefined,
    );

    if (onPropertyTypeChange && nextType !== prevType)
      onPropertyTypeChange(nextType);
    if (onPropertyPurposeChange && nextPurpose !== prevPurpose)
      onPropertyPurposeChange(nextPurpose);
  };

  const handleCommercialSubChange = (sub: string) => {
    setCommercialSub(sub);
    if (purpose === "commercial") {
      onPropertyPurposeChange?.(
        getPropertyPurposeFromPurpose("commercial", sub),
      );
    }
  };

  // const handleSuggestionSelect = (item: SuggestionItem) => {
  //   if (item.type === "locality") {
  //     setSelectedLocalities((prev) =>
  //       prev.some((l) => l.id === item.id) ? prev : [...prev, item],
  //     );
  //     setSearchInput("");
  //     // Keep dropdown open to allow selecting more localities
  //     setShowSuggestions(true);
  //     // Focus back on input for continuous selection
  //     setTimeout(() => inputRef.current?.focus(), 50);
  //     return;
  //   }
  //   navigateToSearch({
  //     cityId: item.cityId,
  //     cityName: item.cityName,
  //     searchText: item.name,
  //   });
  //   setShowSuggestions(false);
  // };
  const handleSuggestionSelect = (item: SuggestionItem) => {
    if (item.type === "locality") {
      setSelectedLocalities((prev) =>
        prev.some((l) => l.id === item.id) ? prev : [...prev, item],
      );
      setSearchInput("");
      setSuggestions([]); // ← NEW: wipe stale search results immediately
      setShowSuggestions(false); // ← CHANGED: close dropdown so chip appears confirmed

      // Re-open fresh on next tick — blur+focus ensures onFocus fires correctly
      // even when the input was already focused (React won't re-fire onFocus
      // if the element never lost focus, which caused the stale-list bug).
      setTimeout(() => {
        inputRef.current?.blur();
        inputRef.current?.focus(); // triggers onFocus → setShowSuggestions(true)
      }, 50);
      return;
    }
    navigateToSearch({
      cityId: item.cityId,
      cityName: item.cityName,
      searchText: item.name,
    });
    setShowSuggestions(false);
  };

  const getPropertyTypeIdFromPurpose = (p: string): string | undefined => {
    const name = getPropertyTypeFromPurpose(p);
    return propertyTypes.find(
      (t) =>
        (t.description ?? "").toUpperCase() === name ||
        t.name.toUpperCase() === name,
    )?.id;
  };

  const navigateToSearch = (params: {
    cityId?: string;
    cityName?: string;
    searchText?: string;
    localities?: SuggestionItem[];
  }) => {
    const fp = getPropertyPurposeFromPurpose(purpose, commercialSub);
    const ft = getPropertyTypeFromPurpose(purpose);
    const fid = getPropertyTypeIdFromPurpose(purpose);
    const locs = params.localities ?? selectedLocalities;

    const filters: PropertySearchFilters = {
      page: 1,
      limit: 20,
      status: "AVAILABLE",
      sortBy: "createdAt",
      sortOrder: "desc",
      purpose: fp,
      propertyType: fid ?? ft,
      ...(params.cityId && { cityId: params.cityId }),
      ...(params.cityName && { city: [params.cityName] }),
      ...(locs.length > 0 && {
        locality: locs.map((l) => l.name),
        localityId: locs.map((l) => l.id).join(","),
      }),
      ...(params.searchText?.trim() && { search: params.searchText.trim() }),
    };

    dispatch(setFilters(filters));
    const encoded = encodeFilters(filters);
    window.open(
      encoded ? `/properties/search/${encoded}` : "/properties/search",
      "_blank",
    );

    onSearch?.({
      cityId: params.cityId,
      cityName: params.cityName,
      localityId: locs.length ? locs.map((l) => l.id) : undefined,
      localityName: locs.length ? locs.map((l) => l.name) : undefined,
      searchText: params.searchText,
      propertyType: ft,
      propertyPurpose: fp,
    });
  };

  const handleSearch = () =>
    navigateToSearch({
      cityId: selectedCityId,
      cityName: selectedCityName,
      searchText: searchInput.trim(),
    });

  const initialSuggestions: SuggestionItem[] =
    showSuggestions && searchInput.length === 0
      ? [
          ...popularLocalities.slice(0, 4),
          ...POPULAR_SEARCHES.slice(0, 4).map((t) => ({
            id: `popular-${t}`,
            type: "popular" as const,
            name: t,
            displayName: `${t} in ${selectedCityName}`,
            cityId: selectedCityId,
            cityName: selectedCityName,
          })),
        ]
      : [];

  // ── COMPACT VARIANT ────────────────────────────────────────────────────────
  if (variant === "compact") {
    return (
      <div className="w-full">
        {/* Purpose pills — horizontally scrollable */}
        <div className="flex items-center gap-1.5 mb-3 overflow-x-auto no-scrollbar pb-1">
          {PURPOSE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handlePurposeChange(opt.value)}
              className={`flex-shrink-0 px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${
                purpose === opt.value
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div ref={searchWrapperRef} className="relative">
          <div className="flex items-center bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm overflow-hidden">
            {/* City */}
            <CitySelector
              cities={cities}
              variant="inline"
              selectedCityId={selectedCityId}
              selectedCityName={selectedCityName}
              onCityChange={handleCityChange}
            />

            {/* Search input */}
            <div className="flex-1 relative min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                onClick={() => setShowSuggestions(true)}
                placeholder="Locality, project..."
                className="w-full pl-9 pr-8 py-3 text-sm bg-transparent focus:outline-none text-gray-900 dark:text-white placeholder-gray-400"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <X className="w-3.5 h-3.5 text-gray-400" />
                </button>
              )}
            </div>

            {/* Search btn */}
            <button
              onClick={handleSearch}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          <SuggestionsDropdown
            show={showSuggestions}
            searchInput={searchInput}
            suggestions={suggestions}
            initialSuggestions={initialSuggestions}
            selectedCityName={selectedCityName}
            selectedLocalities={selectedLocalities}
            onSelect={handleSuggestionSelect}
            onRemoveLocality={(id) =>
              setSelectedLocalities((p) => p.filter((l) => l.id !== id))
            }
          />
        </div>
      </div>
    );
  }

  // ── DEFAULT VARIANT (full hero) ────────────────────────────────────────────
  return (
    <div className="w-full">
      {/* ── Mobile layout (Housing.com style) ── */}
      <div className="block sm:hidden">
        {/* City pill */}
        <div className="flex justify-center mb-5">
          <CitySelector
            cities={cities}
            variant="pill"
            selectedCityId={selectedCityId}
            selectedCityName={selectedCityName}
            onCityChange={handleCityChange}
          />
        </div>

        {/* Purpose tabs — scrollable row */}
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar px-1 pb-1">
          {PURPOSE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handlePurposeChange(opt.value)}
              className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-lg border-b-2 transition-all ${
                purpose === opt.value
                  ? "border-white text-white bg-white/20 backdrop-blur-sm"
                  : "border-transparent text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div ref={searchWrapperRef} className="relative px-1">
          <div className="flex items-center bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onClick={() => setShowSuggestions(true)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search city, locality, project..."
                className="w-full pl-10 pr-4 py-3.5 text-sm bg-transparent focus:outline-none text-gray-900 dark:text-white placeholder-gray-400"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-3.5 bg-blue-600 hover:bg-blue-700 text-white transition-colors flex-shrink-0 rounded-r-xl"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          <SuggestionsDropdown
            show={showSuggestions}
            searchInput={searchInput}
            suggestions={suggestions}
            initialSuggestions={initialSuggestions}
            selectedCityName={selectedCityName}
            selectedLocalities={selectedLocalities}
            onSelect={handleSuggestionSelect}
            onRemoveLocality={(id) =>
              setSelectedLocalities((p) => p.filter((l) => l.id !== id))
            }
          />
        </div>

        {/* ── Mobile: selected locality chips — always visible below search bar ── */}
        {selectedLocalities.length > 0 && (
          <MobileLocalityChips
            localities={selectedLocalities}
            onRemove={(id) =>
              setSelectedLocalities((p) => p.filter((l) => l.id !== id))
            }
            onClearAll={() => setSelectedLocalities([])}
          />
        )}

        {/* Commercial sub-purpose */}
        {purpose === "commercial" && (
          <div className="flex gap-2 mt-3 justify-center">
            {COMMERCIAL_SUB_PURPOSES.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleCommercialSubChange(opt.value)}
                className={`px-5 py-1.5 text-sm font-semibold rounded-full transition-all ${
                  commercialSub === opt.value
                    ? "bg-white text-blue-600 shadow"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Desktop layout ── */}
      <div className="hidden sm:block bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 sm:p-8">
        {/* Purpose tabs */}
        <div className="flex items-center gap-2 sm:gap-3 mb-6 overflow-x-auto no-scrollbar">
          {PURPOSE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handlePurposeChange(opt.value)}
              className={`flex-shrink-0 px-4 sm:px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                purpose === opt.value
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div ref={searchWrapperRef} className="relative z-[9999]">
          <div className="flex items-stretch bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-colors overflow-hidden shadow-sm">
            {/* City selector */}
            <CitySelector
              cities={cities}
              variant="inline"
              selectedCityId={selectedCityId}
              selectedCityName={selectedCityName}
              onCityChange={handleCityChange}
            />

            {/* Selected locality chips - Now with better overflow handling */}
            {selectedLocalities.length > 0 && (
              <div
                ref={chipsContainerRef}
                className="flex items-center gap-1 px-2 py-1.5 border-r border-gray-200 dark:border-gray-600 max-w-[280px] lg:max-w-[350px] overflow-x-auto no-scrollbar"
                style={{ scrollbarWidth: "none" }}
              >
                {selectedLocalities.map((loc) => (
                  <span
                    key={loc.id}
                    className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium whitespace-nowrap"
                  >
                    {loc.name}
                    <button
                      onClick={() =>
                        setSelectedLocalities((p) =>
                          p.filter((l) => l.id !== loc.id),
                        )
                      }
                      className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
                {selectedLocalities.length > 5 && (
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    +{selectedLocalities.length - 5} more
                  </span>
                )}
              </div>
            )}

            {/* Text input */}
            <div className="flex-1 relative min-w-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                onClick={() => setShowSuggestions(true)}
                placeholder={
                  selectedLocalities.length > 0
                    ? "Add more localities..."
                    : "Search locality, landmark, project or builder"
                }
                className="w-full pl-11 pr-10 py-4 text-sm sm:text-base bg-transparent focus:outline-none text-gray-900 dark:text-white placeholder-gray-400"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Commercial sub-tabs (desktop only, inline) */}
            {purpose === "commercial" && (
              <div className="flex items-center gap-1 px-3 border-l border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
                {COMMERCIAL_SUB_PURPOSES.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleCommercialSubChange(opt.value)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      commercialSub === opt.value
                        ? "bg-blue-600 text-white shadow"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {/* Search button */}
            <button
              onClick={handleSearch}
              className="px-6 sm:px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base transition-colors flex-shrink-0 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>

          <SuggestionsDropdown
            show={showSuggestions}
            searchInput={searchInput}
            suggestions={suggestions}
            initialSuggestions={initialSuggestions}
            selectedCityName={selectedCityName}
            selectedLocalities={selectedLocalities}
            onSelect={handleSuggestionSelect}
            onRemoveLocality={(id) =>
              setSelectedLocalities((p) => p.filter((l) => l.id !== id))
            }
          />
        </div>

        {/* Popular searches */}
        <div className="mt-5">
          <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">
            Popular
          </p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SEARCHES.slice(0, 6).map((term) => (
              <button
                key={term}
                onClick={() => {
                  setSearchInput(term);
                  setShowSuggestions(true);
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-medium transition-colors"
              >
                {term}
                <ChevronRight className="w-3 h-3 opacity-50" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollbar hide */}
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
    </div>
  );
};
