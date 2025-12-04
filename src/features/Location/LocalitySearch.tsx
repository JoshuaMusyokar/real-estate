// components/LocalitySearch.tsx
import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, X, AlertTriangle, ChevronRight } from "lucide-react";
import { useGetCitiesQuery } from "../../services/locationApi";

interface LocalitySearchProps {
  currentCityId: string;
  currentCityName: string;
  onLocalitySelect: (
    locality: string,
    cityId: string,
    cityName: string
  ) => void;
  onSearchChange?: (searchTerm: string) => void;
  placeholder?: string;
  showAddButton?: boolean;
  initialLocality?: string;
}

export const LocalitySearch: React.FC<LocalitySearchProps> = ({
  currentCityId,
  currentCityName,
  onLocalitySelect,
  onSearchChange,
  placeholder = "Search for locality, project, or builder",
  showAddButton = true,
  initialLocality = "",
}) => {
  const [searchTerm, setSearchTerm] = useState(initialLocality);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedLocality, setSelectedLocality] = useState<{
    name: string;
    cityId: string;
    cityName: string;
  } | null>(null);
  const [localities, setLocalities] = useState<string[]>([]);
  const [matchedCities, setMatchedCities] = useState<
    Array<{
      cityId: string;
      cityName: string;
      localities: string[];
    }>
  >([]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: citiesData } = useGetCitiesQuery({
    page: 1,
    limit: 100,
  });

  // Fetch localities when search term changes
  useEffect(() => {
    if (searchTerm.trim().length >= 2) {
      searchLocalities(searchTerm);
      setShowDropdown(true);
    } else {
      setLocalities([]);
      setMatchedCities([]);
      setShowDropdown(false);
    }

    if (onSearchChange) {
      onSearchChange(searchTerm);
    }
  }, [searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchLocalities = async (term: string) => {
    // In a real app, this would be an API call
    // For now, simulate with mock data
    const allLocalities = [
      { name: "Gulshan-e-Iqbal", cityId: "city1", cityName: "Karachi" },
      { name: "Clifton", cityId: "city1", cityName: "Karachi" },
      { name: "DHA", cityId: "city1", cityName: "Karachi" },
      { name: "Saddar", cityId: "city1", cityName: "Karachi" },
      { name: "Gulberg", cityId: "city2", cityName: "Lahore" },
      { name: "Model Town", cityId: "city2", cityName: "Lahore" },
      { name: "Bahria Town", cityId: "city2", cityName: "Lahore" },
      { name: "F-7", cityId: "city3", cityName: "Islamabad" },
      { name: "G-11", cityId: "city3", cityName: "Islamabad" },
      { name: "DHA Phase 2", cityId: "city1", cityName: "Karachi" },
    ];

    const filtered = allLocalities.filter((locality) =>
      locality.name.toLowerCase().includes(term.toLowerCase())
    );

    // Group by city
    const groupedByCity: Record<string, Array<(typeof filtered)[0]>> = {};
    filtered.forEach((locality) => {
      if (!groupedByCity[locality.cityId]) {
        groupedByCity[locality.cityId] = [];
      }
      groupedByCity[locality.cityId].push(locality);
    });

    const cities = Object.entries(groupedByCity).map(
      ([cityId, localities]) => ({
        cityId,
        cityName: localities[0].cityName,
        localities: localities.map((l) => l.name),
      })
    );

    setMatchedCities(cities);
  };

  const handleLocalitySelect = (
    localityName: string,
    cityId: string,
    cityName: string
  ) => {
    if (cityId !== currentCityId) {
      // Show confirmation modal if city changes
      setSelectedLocality({ name: localityName, cityId, cityName });
      setShowConfirmation(true);
      setShowDropdown(false);
    } else {
      // Same city, select immediately
      onLocalitySelect(localityName, cityId, cityName);
      setSearchTerm(localityName);
      setShowDropdown(false);
    }
  };

  const confirmCityChange = () => {
    if (selectedLocality) {
      onLocalitySelect(
        selectedLocality.name,
        selectedLocality.cityId,
        selectedLocality.cityName
      );
      setSearchTerm(selectedLocality.name);
      setSelectedLocality(null);
      setShowConfirmation(false);
    }
  };

  const cancelCityChange = () => {
    setSelectedLocality(null);
    setShowConfirmation(false);
    setSearchTerm("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleAddNew = () => {
    setSearchTerm("");
    setShowDropdown(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setShowDropdown(false);
    if (onSearchChange) {
      onSearchChange("");
    }
  };

  return (
    <>
      <div className="relative w-full max-w-xl" ref={dropdownRef}>
        <div className="flex items-center bg-white rounded-lg border border-gray-300 shadow-sm hover:border-blue-400 transition-colors">
          <Search className="w-5 h-5 text-gray-400 ml-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-3 py-3 text-sm focus:outline-none"
            onFocus={() => {
              if (searchTerm.trim().length >= 2) {
                setShowDropdown(true);
              }
            }}
          />

          {searchTerm && (
            <button
              onClick={clearSearch}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {showAddButton && (
            <button
              type="button"
              onClick={handleAddNew}
              className="flex items-center gap-1 px-3 py-1.5 mr-2 rounded-full border border-blue-400 text-blue-600 bg-blue-50 text-sm font-medium hover:bg-blue-100 transition-colors"
            >
              <span>New</span>
            </button>
          )}
        </div>

        {/* Dropdown Results */}
        {showDropdown &&
          (matchedCities.length > 0 || searchTerm.trim().length >= 2) && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg max-h-96 overflow-y-auto z-50">
              {matchedCities.length > 0 ? (
                matchedCities.map((cityGroup) => (
                  <div
                    key={cityGroup.cityId}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    <div className="px-3 py-2 bg-gray-50">
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                        <MapPin className="w-3 h-3" />
                        <span>{cityGroup.cityName}</span>
                        {cityGroup.cityId !== currentCityId && (
                          <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded">
                            Different City
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-1">
                      {cityGroup.localities.map((locality) => (
                        <button
                          key={`${cityGroup.cityId}-${locality}`}
                          onClick={() =>
                            handleLocalitySelect(
                              locality,
                              cityGroup.cityId,
                              cityGroup.cityName
                            )
                          }
                          className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50 rounded flex items-center justify-between group"
                        >
                          <span className="text-gray-700 group-hover:text-blue-600">
                            {locality}
                          </span>
                          {cityGroup.cityId !== currentCityId && (
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-center text-gray-500 text-sm">
                  No localities found. Try a different search term.
                </div>
              )}
            </div>
          )}
      </div>

      {/* City Change Confirmation Modal */}
      {showConfirmation && selectedLocality && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Change City?</h3>
            </div>

            <p className="text-gray-600 mb-6">
              You're currently searching in{" "}
              <span className="font-semibold">{currentCityName}</span>.
              <span className="font-semibold text-gray-900">
                {" "}
                {selectedLocality.name}
              </span>{" "}
              is in{" "}
              <span className="font-semibold">{selectedLocality.cityName}</span>
              .
            </p>

            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                Changing cities will update all your search results. You'll need
                to start a new search if you want to go back to{" "}
                {currentCityName}.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={cancelCityChange}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmCityChange}
                className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Yes, Change to {selectedLocality.cityName}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
