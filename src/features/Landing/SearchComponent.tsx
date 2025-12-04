import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, Building2, Home, X, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useGetCitiesQuery,
  useGetLocalitiesQuery,
} from "../../services/locationApi";
import type { City, Locality } from "../../types";
import { Dropdown } from "../../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../../components/ui/dropdown/DropdownItem";

interface SearchComponentProps {
  variant?: "default" | "compact";
  onSearch?: (params: SearchParams) => void;
  initialCity?: string;
  onPurposeChange?: (purpose: string) => void;
  initialPurpose?: string;
}

interface SearchParams {
  cityId?: string;
  cityName?: string;
  localityId?: string;
  localityName?: string;
  searchText?: string;
}

interface SuggestionItem {
  id: string;
  type: "city" | "locality" | "project" | "builder" | "landmark" | "popular";
  name: string;
  displayName: string;
  cityId?: string;
  cityName?: string;
}

const PURPOSE_OPTIONS = [
  { value: "buy", label: "BUY", icon: Home },
  { value: "rent", label: "RENT", icon: Home },
  { value: "commercial", label: "COMMERCIAL", icon: Building2 },
  { value: "pg", label: "PG/CO-LIVING", icon: Home },
  { value: "plots", label: "PLOTS", icon: MapPin },
];

const POPULAR_SEARCHES = [
  "Apartments",
  "Villas",
  "Builder Floors",
  "Studio Apartments",
  "Premium Apartments",
  "Ready to Move",
  "New Launch",
  "Under Construction",
];

export const SearchComponent: React.FC<SearchComponentProps> = ({
  variant = "default",
  onSearch,
  initialCity,
  onPurposeChange,
  initialPurpose = "buy",
}) => {
  const navigate = useNavigate();
  const [purpose, setPurpose] = useState<string>(initialPurpose);
  const [selectedCityId, setSelectedCityId] = useState<string>("");
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const cityModalRef = useRef<HTMLDivElement>(null);
  const [selectedCityName, setSelectedCityName] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [showCityDropdown, setShowCityDropdown] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [popularLocalities, setPopularLocalities] = useState<SuggestionItem[]>(
    []
  );
  const [searchCityInput, setSearchCityInput] = useState<string>("");

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch cities
  const { data: citiesData } = useGetCitiesQuery({
    search: searchCityInput,
    limit: 100,
  });

  const cities: City[] = citiesData?.data || [];

  // Fetch localities for the selected city
  const { data: localitiesData } = useGetLocalitiesQuery(
    {
      cityId: selectedCityId,
      limit: 20,
    },
    {
      skip: !selectedCityId,
    }
  );

  // Fetch localities for search suggestions
  const { data: searchLocalitiesData } = useGetLocalitiesQuery(
    {
      search: searchInput,
      cityId: selectedCityId,
      limit: 10,
    },
    {
      skip: !selectedCityId || searchInput.length < 1,
    }
  );

  // Initialize city
  useEffect(() => {
    if (initialCity && cities.length > 0) {
      const city = cities.find(
        (c) => c.name.toLowerCase() === initialCity.toLowerCase()
      );
      if (city) {
        setSelectedCityId(city.id);
        setSelectedCityName(city.name);
      }
    } else if (cities.length > 0) {
      // Default to Delhi if available
      const delhi = cities.find((c) => c.name.toLowerCase().includes("delhi"));
      if (delhi) {
        setSelectedCityId(delhi.id);
        setSelectedCityName(delhi.name);
      } else {
        setSelectedCityId(cities[0].id);
        setSelectedCityName(cities[0].name);
      }
    }
  }, [cities, initialCity]);
  // useEffect hook for click outside detection
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close suggestions dropdown if clicked outside
      if (
        showSuggestions &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }

      // Close city dropdown if clicked outside
      if (
        showCityDropdown &&
        cityModalRef.current &&
        !cityModalRef.current.contains(event.target as Node) &&
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCityDropdown(false);
        setSearchCityInput("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSuggestions, showCityDropdown]);
  // Generate popular localities when city changes
  useEffect(() => {
    if (selectedCityId && localitiesData?.data) {
      const popularLocalitiesList = localitiesData.data
        .slice(0, 8)
        .map((locality: Locality) => ({
          id: locality.id,
          type: "locality" as const,
          name: locality.name,
          displayName: `${locality.name}, ${selectedCityName}`,
          cityId: selectedCityId,
          cityName: selectedCityName,
        }));
      setPopularLocalities(popularLocalitiesList);
    }
  }, [selectedCityId, selectedCityName, localitiesData]);

  // Generate suggestions
  useEffect(() => {
    const newSuggestions: SuggestionItem[] = [];

    // Add city suggestions if searching for cities
    if (searchInput.length >= 2) {
      const cityMatches = cities
        .filter(
          (city) =>
            city.name.toLowerCase().includes(searchInput.toLowerCase()) ||
            city.state?.toLowerCase().includes(searchInput.toLowerCase())
        )
        .slice(0, 3)
        .map((city) => ({
          id: city.id,
          type: "city" as const,
          name: city.name,
          displayName: `${city.name}${city.state ? `, ${city.state}` : ""}`,
          cityId: city.id,
          cityName: city.name,
        }));

      newSuggestions.push(...cityMatches);
    }

    // Add locality suggestions from search
    if (
      selectedCityId &&
      searchLocalitiesData?.data &&
      searchInput.length >= 1
    ) {
      const localityMatches = searchLocalitiesData.data
        .slice(0, 5)
        .map((locality: Locality) => ({
          id: locality.id,
          type: "locality" as const,
          name: locality.name,
          displayName: `${locality.name}, ${selectedCityName}`,
          cityId: selectedCityId,
          cityName: selectedCityName,
        }));

      newSuggestions.push(...localityMatches);
    }

    // Add generic suggestions for projects/builders/landmarks
    if (searchInput.length >= 3) {
      newSuggestions.push(
        {
          id: `project-${searchInput}`,
          type: "project",
          name: `${searchInput} Project`,
          displayName: `${searchInput} Project`,
          cityId: selectedCityId,
          cityName: selectedCityName,
        },
        {
          id: `builder-${searchInput}`,
          type: "builder",
          name: `${searchInput} Builder`,
          displayName: `${searchInput} Builder Projects`,
          cityId: selectedCityId,
          cityName: selectedCityName,
        },
        {
          id: `landmark-${searchInput}`,
          type: "landmark",
          name: `${searchInput}`,
          displayName: `${searchInput} (Landmark)`,
          cityId: selectedCityId,
          cityName: selectedCityName,
        }
      );
    }

    // Add popular searches matching input
    if (searchInput.length >= 2) {
      const popularMatches = POPULAR_SEARCHES.filter((term) =>
        term.toLowerCase().includes(searchInput.toLowerCase())
      )
        .slice(0, 3)
        .map((term) => ({
          id: `popular-${term}`,
          type: "popular" as const,
          name: term,
          displayName: `${term} in ${selectedCityName}`,
          cityId: selectedCityId,
          cityName: selectedCityName,
        }));

      newSuggestions.push(...popularMatches);
    }

    setSuggestions(newSuggestions);
  }, [
    searchInput,
    selectedCityId,
    selectedCityName,
    cities,
    searchLocalitiesData,
  ]);

  const handleCityChange = (cityId: string) => {
    const city = cities.find((c) => c.id === cityId);
    if (city) {
      setSelectedCityId(cityId);
      setSelectedCityName(city.name);
      setSearchInput("");
      setShowCityDropdown(false);
      setShowSuggestions(false);
      setSearchCityInput("");
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleSuggestionSelect = (suggestion: SuggestionItem) => {
    // Build query parameters based on suggestion type
    const queryParams = new URLSearchParams();

    // Add purpose parameter
    queryParams.set("purpose", purpose);

    // Add city information
    if (suggestion.cityId) {
      queryParams.set("cityId", suggestion.cityId);
    }
    if (suggestion.cityName) {
      queryParams.set("city", suggestion.cityName);
    }

    // Add search text //TODO .SEARCHTEXT AND .NAME
    if (suggestion.name || suggestion.name) {
      queryParams.set("search", suggestion.name || suggestion.name);
    }

    // Add specific filters based on suggestion type
    switch (suggestion.type) {
      case "locality":
        queryParams.set("locality", suggestion.name);
        queryParams.set("localityId", suggestion.id);
        break;
      case "project":
        queryParams.set("search", suggestion.name);
        break;
      case "builder":
        queryParams.set("search", suggestion.name);
        break;
      case "landmark":
        queryParams.set("search", suggestion.name);
        break;
      case "popular":
        // For popular searches, add them as general search
        queryParams.set("search", suggestion.name);
        break;
      default:
        break;
    }

    // Navigate to search results page with query parameters
    navigate(`/listings/buy/?${queryParams.toString()}`);

    // Call onSearch callback if provided
    if (onSearch) {
      const params: SearchParams = {
        cityId: suggestion.cityId,
        cityName: suggestion.cityName,
        searchText: suggestion.name,
      };
      if (suggestion.type === "locality") {
        params.localityId = suggestion.id;
        params.localityName = suggestion.name;
      }
      onSearch(params);
    }

    setShowSuggestions(false);
    setSearchInput(suggestion.displayName);
  };

  const handleSearch = () => {
    if (!searchInput.trim()) return;

    // Build query parameters
    const queryParams = new URLSearchParams();

    // Add purpose parameter
    queryParams.set("purpose", purpose);

    // Add city information
    if (selectedCityId) {
      queryParams.set("cityId", selectedCityId);
    }
    if (selectedCityName) {
      queryParams.set("city", selectedCityName);
    }

    // Add search text
    queryParams.set("search", searchInput.trim());

    // Navigate to search results page with query parameters
    navigate(`/listings/buy?${queryParams.toString()}`);

    if (onSearch) {
      const params: SearchParams = {
        cityId: selectedCityId,
        cityName: selectedCityName,
        searchText: searchInput.trim(),
      };
      onSearch(params);
    }
  };
  const handlePurposeChange = (newPurpose: string) => {
    setPurpose(newPurpose);

    // Propagate to parent
    if (onPurposeChange) {
      onPurposeChange(newPurpose);
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  // Get popular localities for display when input is empty
  const getInitialSuggestions = () => {
    if (!showSuggestions || searchInput.length > 0) {
      return [];
    }

    const initialSuggestions: SuggestionItem[] = [
      // Popular localities in current city
      ...popularLocalities.slice(0, 4).map((locality) => ({
        ...locality,
        type: "locality" as const,
      })),
      // Popular searches
      ...POPULAR_SEARCHES.slice(0, 4).map((term) => ({
        id: `popular-${term}`,
        type: "popular" as const,
        name: term,
        displayName: `${term} in ${selectedCityName}`,
        cityId: selectedCityId,
        cityName: selectedCityName,
      })),
    ];

    return initialSuggestions;
  };

  // Filter cities based on search input
  const filteredCities = cities
    .filter(
      (city) =>
        searchCityInput === "" ||
        city.name.toLowerCase().includes(searchCityInput.toLowerCase()) ||
        city.state?.toLowerCase().includes(searchCityInput.toLowerCase())
    )
    .slice(0, 20);

  if (variant === "compact") {
    return (
      <div className="w-full">
        {/* Purpose Tabs */}
        <div className="flex items-center gap-2 mb-3">
          {PURPOSE_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => handlePurposeChange(option.value)}
                className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                  purpose === option.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {option.label}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative" ref={searchContainerRef}>
          <div className="flex items-center gap-2 bg-white rounded-xl shadow-sm border border-gray-300 hover:border-blue-500 transition-colors">
            {/* City Selector with Dropdown */}
            <div className="relative" ref={cityDropdownRef}>
              <button
                onClick={() => setShowCityDropdown(!showCityDropdown)}
                className="dropdown-toggle flex items-center gap-2 pl-10 pr-8 py-3 bg-gray-50 rounded-l-xl border-r border-gray-300 hover:bg-gray-100 transition-colors min-w-[140px] relative"
              >
                <MapPin className="absolute left-3 w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-700 truncate">
                  {selectedCityName}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    showCityDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* City Dropdown */}
              <Dropdown
                isOpen={true}
                onClose={() => {
                  setShowCityDropdown(false);
                  setSearchCityInput("");
                }}
                className="left-0 mt-1 min-w-[200px] max-h-64"
              >
                <div ref={cityModalRef} className="p-2">
                  {/* City Search */}
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchCityInput}
                      onChange={(e) => setSearchCityInput(e.target.value)}
                      placeholder="Search city..."
                      className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                    />
                  </div>

                  {/* City List */}
                  <div className="max-h-48 overflow-y-auto z-1000">
                    {filteredCities.map((city) => (
                      <DropdownItem
                        key={city.id}
                        onItemClick={() => handleCityChange(city.id)}
                        className={`flex items-center gap-2 ${
                          selectedCityId === city.id
                            ? "bg-blue-50 text-blue-600"
                            : ""
                        }`}
                      >
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div className="flex-1">
                          <span className="font-medium">{city.name}</span>
                          {city.state && (
                            <span className="text-xs text-gray-500 block">
                              {city.state}
                            </span>
                          )}
                        </div>
                      </DropdownItem>
                    ))}
                    {filteredCities.length === 0 && (
                      <div className="px-3 py-2 text-center text-gray-500 text-sm">
                        No cities found
                      </div>
                    )}
                  </div>
                </div>
              </Dropdown>
            </div>

            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={handleInputFocus}
                onKeyPress={handleKeyPress}
                placeholder="Search for locality, landmark, project, or builder"
                className="w-full pl-10 pr-10 py-3 focus:outline-none placeholder-gray-500"
              />
              {searchInput && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-blue-600 text-white rounded-r-xl hover:bg-blue-700 transition-colors font-medium"
            >
              Search
            </button>
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && (
            <div
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto"
            >
              {/* Empty state suggestions */}
              {(!searchInput || searchInput.length === 0) &&
                getInitialSuggestions().length > 0 && (
                  <>
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Popular in {selectedCityName}
                      </div>
                    </div>
                    {getInitialSuggestions().map((suggestion) => (
                      <button
                        key={`${suggestion.type}-${suggestion.id}`}
                        onClick={() => handleSuggestionSelect(suggestion)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                      >
                        <div
                          className={`p-2 rounded-lg ${
                            suggestion.type === "locality"
                              ? "bg-green-100"
                              : "bg-blue-100"
                          }`}
                        >
                          {suggestion.type === "locality" ? (
                            <Home className="w-4 h-4 text-green-600" />
                          ) : (
                            <Search className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {suggestion.displayName}
                          </div>
                          <div className="text-xs text-gray-500 capitalize">
                            {suggestion.type}
                          </div>
                        </div>
                      </button>
                    ))}
                  </>
                )}

              {/* Search suggestions */}
              {searchInput && suggestions.length > 0 && (
                <>
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Suggestions
                    </div>
                  </div>
                  {suggestions.map((suggestion) => (
                    <button
                      key={`${suggestion.type}-${suggestion.id}`}
                      onClick={() => handleSuggestionSelect(suggestion)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          suggestion.type === "city"
                            ? "bg-blue-100"
                            : suggestion.type === "locality"
                            ? "bg-green-100"
                            : suggestion.type === "project"
                            ? "bg-purple-100"
                            : suggestion.type === "builder"
                            ? "bg-amber-100"
                            : suggestion.type === "popular"
                            ? "bg-indigo-100"
                            : "bg-gray-100"
                        }`}
                      >
                        {suggestion.type === "city" && (
                          <MapPin className="w-4 h-4 text-blue-600" />
                        )}
                        {suggestion.type === "locality" && (
                          <Home className="w-4 h-4 text-green-600" />
                        )}
                        {suggestion.type === "project" && (
                          <Building2 className="w-4 h-4 text-purple-600" />
                        )}
                        {suggestion.type === "builder" && (
                          <Building2 className="w-4 h-4 text-amber-600" />
                        )}
                        {suggestion.type === "popular" && (
                          <Search className="w-4 h-4 text-indigo-600" />
                        )}
                        {suggestion.type === "landmark" && (
                          <MapPin className="w-4 h-4 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {suggestion.displayName}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {suggestion.type}
                        </div>
                      </div>
                    </button>
                  ))}
                </>
              )}

              {/* No suggestions found */}
              {searchInput && suggestions.length === 0 && (
                <div className="px-4 py-3 text-center text-gray-500">
                  No suggestions found for "{searchInput}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="w-full bg-white rounded-2xl shadow-xl p-8 overflow-visible">
      {/* Purpose Tabs */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {PURPOSE_OPTIONS.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.value}
              onClick={() => handlePurposeChange(option.value)}
              className={`flex flex-col items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                purpose === option.value
                  ? "bg-blue-600 text-white shadow-lg transform scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="font-semibold text-sm">{option.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="relative" ref={searchContainerRef}>
        <div className="flex items-center bg-white rounded-xl shadow-lg border-2 border-gray-300 hover:border-blue-500 transition-colors overflow-visible">
          {/* City Selector with Dropdown */}
          <div className="" ref={cityDropdownRef}>
            <button
              onClick={() => setShowCityDropdown(!showCityDropdown)}
              className="dropdown-toggle flex items-center gap-2 pl-6 pr-6 py-4 bg-gray-50 border-r border-gray-300 hover:bg-gray-100 transition-colors relative group min-w-[180px]"
            >
              <MapPin className="w-5 h-5 text-gray-500" />
              <span className="font-semibold text-gray-700 truncate">
                {selectedCityName}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 ml-2 transition-transform ${
                  showCityDropdown ? "rotate-180" : ""
                }`}
              />

              {/* Hover effect */}
              <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-5 transition-opacity" />
            </button>

            {/* City Dropdown */}
            <Dropdown
              isOpen={showCityDropdown}
              onClose={() => {
                setShowCityDropdown(false);
                setSearchCityInput("");
              }}
              className="left-0 mt-1 min-w-[280px] max-h-96 z-[9999]"
            >
              <div className="p-4">
                {/* City Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchCityInput}
                    onChange={(e) => setSearchCityInput(e.target.value)}
                    placeholder="Search city..."
                    className="w-full pl-12 pr-4 py-3 text-base border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                  />
                </div>

                {/* City List */}
                <div className="max-h-72 z-80">
                  <div className="grid grid-cols-1 gap-1">
                    {filteredCities.map((city) => (
                      <DropdownItem
                        key={city.id}
                        onItemClick={() => handleCityChange(city.id)}
                        className={`flex items-center gap-3 ${
                          selectedCityId === city.id
                            ? "bg-blue-50 text-blue-600 border-2 border-blue-200"
                            : ""
                        }`}
                      >
                        <MapPin
                          className={`w-5 h-5 ${
                            selectedCityId === city.id
                              ? "text-blue-500"
                              : "text-gray-400"
                          }`}
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-lg">
                            {city.name}
                          </div>
                          {city.state && (
                            <div className="text-sm text-gray-500">
                              {city.state}
                            </div>
                          )}
                        </div>
                        {selectedCityId === city.id && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </DropdownItem>
                    ))}
                    {filteredCities.length === 0 && (
                      <div className="px-4 py-6 text-center">
                        <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <div className="text-gray-600 font-medium">
                          No cities found
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Try a different search term
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Dropdown>
          </div>

          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={handleInputFocus}
              onKeyPress={handleKeyPress}
              placeholder="Search for locality, landmark, project, or builder"
              className="w-full pl-12 pr-12 py-4 text-lg focus:outline-none placeholder-gray-500"
            />
            {searchInput && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>

          <button
            onClick={handleSearch}
            className="px-8 py-4 bg-blue-600 text-white hover:bg-blue-700 transition-colors font-semibold text-lg"
          >
            Search
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <div
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-y-auto"
          >
            {/* Empty state suggestions */}
            {(!searchInput || searchInput.length === 0) &&
              getInitialSuggestions().length > 0 && (
                <>
                  <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                    <div className="text-sm font-semibold text-gray-700">
                      Popular in {selectedCityName}
                    </div>
                  </div>
                  <div className="p-2">
                    {getInitialSuggestions().map((suggestion) => (
                      <button
                        key={`${suggestion.type}-${suggestion.id}`}
                        onClick={() => handleSuggestionSelect(suggestion)}
                        className="w-full px-4 py-3 text-left hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-4 mb-1"
                      >
                        <div
                          className={`p-3 rounded-lg ${
                            suggestion.type === "locality"
                              ? "bg-green-100"
                              : "bg-blue-100"
                          }`}
                        >
                          {suggestion.type === "locality" ? (
                            <Home className="w-6 h-6 text-green-600" />
                          ) : (
                            <Search className="w-6 h-6 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 text-lg">
                            {suggestion.displayName}
                          </div>
                          <div className="text-sm text-gray-500 capitalize">
                            {suggestion.type}
                          </div>
                        </div>
                        <div className="text-blue-600 font-medium">Select</div>
                      </button>
                    ))}
                  </div>
                </>
              )}

            {/* Search suggestions */}
            {searchInput && suggestions.length > 0 && (
              <>
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                  <div className="text-sm font-semibold text-gray-700">
                    Suggestions for "{searchInput}"
                  </div>
                </div>
                <div className="p-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={`${suggestion.type}-${suggestion.id}`}
                      onClick={() => handleSuggestionSelect(suggestion)}
                      className="w-full px-4 py-3 text-left hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-4 mb-1"
                    >
                      <div
                        className={`p-3 rounded-lg ${
                          suggestion.type === "city"
                            ? "bg-blue-100"
                            : suggestion.type === "locality"
                            ? "bg-green-100"
                            : suggestion.type === "project"
                            ? "bg-purple-100"
                            : suggestion.type === "builder"
                            ? "bg-amber-100"
                            : suggestion.type === "popular"
                            ? "bg-indigo-100"
                            : "bg-gray-100"
                        }`}
                      >
                        {suggestion.type === "city" && (
                          <MapPin className="w-6 h-6 text-blue-600" />
                        )}
                        {suggestion.type === "locality" && (
                          <Home className="w-6 h-6 text-green-600" />
                        )}
                        {suggestion.type === "project" && (
                          <Building2 className="w-6 h-6 text-purple-600" />
                        )}
                        {suggestion.type === "builder" && (
                          <Building2 className="w-6 h-6 text-amber-600" />
                        )}
                        {suggestion.type === "popular" && (
                          <Search className="w-6 h-6 text-indigo-600" />
                        )}
                        {suggestion.type === "landmark" && (
                          <MapPin className="w-6 h-6 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-lg">
                          {suggestion.displayName}
                        </div>
                        <div className="text-sm text-gray-500 capitalize">
                          {suggestion.type}
                        </div>
                      </div>
                      <div className="text-blue-600 font-medium">Select</div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* No suggestions found */}
            {searchInput && suggestions.length === 0 && (
              <div className="p-8 text-center">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <div className="text-gray-600 font-medium mb-2">
                  No suggestions found for "{searchInput}"
                </div>
                <div className="text-sm text-gray-500">
                  Try searching for localities, projects, or builders in{" "}
                  {selectedCityName}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Popular Searches */}
      <div className="mt-6">
        <div className="text-sm text-gray-600 mb-2">Popular Searches:</div>
        <div className="flex flex-wrap gap-2">
          {POPULAR_SEARCHES.slice(0, 6).map((term) => (
            <button
              key={term}
              onClick={() => setSearchInput(`${term} in ${selectedCityName}`)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
