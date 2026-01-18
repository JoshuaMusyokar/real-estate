/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  Menu,
  X,
  Heart,
  User,
  LogOut,
  ChevronDown,
  ChevronUp,
  Search,
  LayoutDashboard,
  MapPin,
  Plus,
  AlertCircle,
} from "lucide-react";
import { useGetFavoritePropertiesQuery } from "../services/propertyApi";
import { useAuth } from "../hooks/useAuth";
import {
  useGetCitiesQuery,
  useGetLocalitiesQuery,
} from "../services/locationApi";
import { useToast } from "../hooks/useToast";

interface PublicHeaderProps {
  onShowFavorites?: () => void;
  onShowAppointments?: () => void;
  theme?: "vibrant" | "clean" | "dark";
  selectedCityId?: string;
  selectedLocalities?: Array<{ id: string; name: string }>;
  onCityChange?: (cityId: string, cityName?: string) => void; // Add cityName
  onLocalityChange?: (localityId: string, localityName?: string) => void; // Add localityName
  onSearch?: (searchTerm: string) => void;
  onRemoveLocality?: (localityId: string) => void;
  initialSearchTerm?: string;
  displaySearchBar?: boolean;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  onShowFavorites,
  onShowAppointments,
  theme = "vibrant",
  selectedCityId,
  selectedLocalities = [],
  onCityChange,
  onLocalityChange,
  onRemoveLocality,
  onSearch,
  initialSearchTerm = "",
  displaySearchBar = false,
}) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [localitySearchOpen, setLocalitySearchOpen] = useState(false);
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const [localitySearchTerm, setLocalitySearchTerm] = useState("");
  const [showCityChangeModal, setShowCityChangeModal] = useState(false);
  const [pendingLocality, setPendingLocality] = useState<any>(null);
  const { warning } = useToast();

  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const localitySearchRef = useRef<HTMLDivElement>(null);

  // Fetch favorites
  const { data: favoritesData } = useGetFavoritePropertiesQuery(
    { page: 1, limit: 5 },
    { skip: !user }
  );

  useEffect(() => {
    console.log("sllloc", selectedLocalities);
  }, []);

  // Fetch cities
  const { data: citiesData, isLoading: isLoadingCities } = useGetCitiesQuery({
    page: 1,
    limit: 100,
  });

  // Fetch localities (all or filtered by city)
  const { data: localitiesData, isLoading: isLoadingLocalities } =
    useGetLocalitiesQuery({
      page: 1,
      limit: 500,
      // Optionally filter by city
      // cityId: selectedCityId,
    });

  const favoriteProperties = favoritesData?.data || [];
  const cities = citiesData?.data || [];
  const localities = localitiesData?.data || [];

  const selectedCity = cities.find((city) => city.id === selectedCityId);

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(citySearchTerm.toLowerCase())
  );

  const filteredLocalities = localities.filter((locality) =>
    locality.name.toLowerCase().includes(localitySearchTerm.toLowerCase())
  );

  // Check if user has dashboard access
  const hasDashboardAccess = user && user.role.name !== "BUYER";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(event.target as Node)
      ) {
        setCityDropdownOpen(false);
      }
      if (
        localitySearchRef.current &&
        !localitySearchRef.current.contains(event.target as Node)
      ) {
        setLocalitySearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuNavigate = (path: string) => {
    setUserMenuOpen(false);
    setTimeout(() => navigate(path), 150);
  };

  const handlePostPropertyForFree = () => {
    if (!user) {
      warning(
        "Sign In!",
        "Please login or create account preferably as Owner to post property"
      );
    }
    navigate("/properties/new");
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  // Update handleCitySelect function
  const handleCitySelect = (cityId: string) => {
    const city = cities.find((c) => c.id === cityId);
    if (onCityChange) {
      onCityChange(cityId, city?.name); // Pass city name
    }
    setCityDropdownOpen(false);
    setCitySearchTerm("");
  };

  // Update handleLocalitySelect function
  const handleLocalitySelect = (locality: any) => {
    // Check if locality is already selected
    const isAlreadySelected = selectedLocalities?.some(
      (loc) => loc.id === locality.id
    );

    if (isAlreadySelected) {
      setLocalitySearchOpen(false);
      setLocalitySearchTerm("");
      return;
    }

    // Check if locality belongs to current city
    if (locality.cityId !== selectedCityId) {
      setPendingLocality(locality);
      setShowCityChangeModal(true);
    } else {
      if (onLocalityChange) {
        onLocalityChange(locality.id, locality.name);
      }
      setLocalitySearchOpen(false);
      setLocalitySearchTerm("");
    }
  };

  // Update confirmCityChange function
  const confirmCityChange = () => {
    if (pendingLocality) {
      // Change city first
      if (onCityChange) {
        onCityChange(pendingLocality.cityId, pendingLocality.city.name);
      }
      // Then select locality
      if (onLocalityChange) {
        onLocalityChange(pendingLocality.id, pendingLocality.name);
      }
      setShowCityChangeModal(false);
      setPendingLocality(null);
      setLocalitySearchOpen(false);
      setLocalitySearchTerm("");
    }
  };

  const cancelCityChange = () => {
    setShowCityChangeModal(false);
    setPendingLocality(null);
  };
  const handleClearLocality = (localityId?: string) => {
    if (localityId && onRemoveLocality) {
      onRemoveLocality(localityId);
    } else if (onLocalityChange) {
      onLocalityChange("");
    }
  };

  // Theme-based styling
  const getThemeStyles = () => {
    switch (theme) {
      case "clean":
        return {
          bg: "bg-white border-b border-gray-200",
          accent: "blue",
          logoText: "text-gray-900",
          logoSubtext: "text-blue-600",
          navLink: "text-gray-700 hover:text-blue-600 hover:bg-blue-50",
          button: "bg-blue-600 hover:bg-blue-700 text-white",
          buttonSecondary: "text-gray-700 hover:bg-gray-100",
          iconButton: "text-gray-700 hover:text-blue-600 hover:bg-blue-50",
          cityButton:
            "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200",
          dropdown: "bg-white border-gray-200",
          searchBg: "bg-white",
          searchBorder: "border-gray-300",
        };
      case "dark":
        return {
          bg: "bg-slate-900 border-b border-slate-800",
          accent: "red",
          logoText: "text-white",
          logoSubtext: "text-red-400",
          navLink: "text-slate-300 hover:text-red-400 hover:bg-slate-800",
          button:
            "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white",
          buttonSecondary: "text-slate-300 hover:bg-slate-800",
          iconButton: "text-slate-300 hover:text-red-400 hover:bg-slate-800",
          cityButton:
            "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700",
          dropdown: "bg-slate-800 border-slate-700",
          searchBg: "bg-slate-700",
          searchBorder: "border-slate-600",
        };
      default: // 'vibrant' theme
        return {
          bg: "bg-purple-700 shadow-xl",
          logoText: "text-yellow-400 font-extrabold",
          logoSubtext: "text-white",
          accent: "purple",
          navLink: "text-white/80 hover:text-white hover:bg-purple-800/50",
          button: "bg-white hover:bg-gray-100 text-purple-700",
          buttonAccent: "bg-pink-600 hover:bg-pink-700 text-white",
          iconButton: "text-white hover:bg-purple-800 rounded-full",
          searchBarBg: "bg-white",
          cityButton:
            "bg-purple-500 hover:bg-purple-600 text-white border-none",
          dropdown: "bg-white border-gray-200",
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 ${styles.bg}`}>
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[60px] md:h-20">
            {/* 1. Logo & City Selector (Left) */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* Logo */}
              <Link
                to="/"
                className="flex items-center gap-0 group flex-shrink-0"
              >
                <span className={`text-2xl font-black ${styles.logoText}`}>
                  BENGALPROPERTY
                </span>
                <span className={`text-xl font-bold ${styles.logoSubtext}`}>
                  .COM
                </span>
              </Link>

              {/* City Selector */}
              <div className="relative" ref={cityDropdownRef}>
                <button
                  onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold transition-all rounded-lg 
                    ${styles.iconButton} md:bg-transparent md:hover:bg-purple-800`}
                >
                  {/* <span className="hidden md:inline">Buy in </span> */}
                  <span className="text-white font-bold">
                    {selectedCity?.name || "Select City"}
                  </span>
                  {cityDropdownOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {/* City Dropdown Menu */}
                {cityDropdownOpen && (
                  <div
                    className={`absolute top-full left-0 mt-2 w-80 rounded-xl shadow-2xl border z-50 ${styles.dropdown}`}
                  >
                    <div className="p-3 border-b border-gray-100">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search cities..."
                          value={citySearchTerm}
                          onChange={(e) => setCitySearchTerm(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto p-2">
                      {isLoadingCities ? (
                        <div className="p-3 text-center text-gray-500 text-sm">
                          Loading cities...
                        </div>
                      ) : filteredCities.length > 0 ? (
                        filteredCities.map((city) => (
                          <button
                            key={city.id}
                            onClick={() => handleCitySelect(city.id)}
                            className={`w-full px-3 py-2 text-left rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                              city.id === selectedCityId
                                ? "bg-purple-500 text-white"
                                : "hover:bg-gray-100 text-gray-700"
                            }`}
                          >
                            <MapPin className="w-4 h-4" /> {city.name}
                          </button>
                        ))
                      ) : (
                        <div className="p-3 text-center text-gray-500 text-sm">
                          No cities found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Central Search Bar with Locality */}
            {displaySearchBar && (
              <div className="flex-1 max-w-xl hidden md:flex items-center bg-white rounded-lg border border-gray-300 shadow-md">
                <div className="relative flex items-center w-full">
                  <Search className="w-5 h-5 text-gray-500 ml-4" />

                  {/* Selected Locality Badge */}
                  {/* Selected Localities Badges */}
                  {selectedLocalities && selectedLocalities.length > 0 && (
                    <div className="flex items-center gap-2 ml-3 flex-wrap max-w-md">
                      {selectedLocalities.map((locality) => (
                        <div
                          key={locality.id}
                          className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          {locality.name}
                          <button
                            onClick={() => handleClearLocality(locality.id)}
                            className="hover:bg-purple-200 rounded-full p-0.5"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* "New" Button for Locality Search */}
                  <div
                    className="relative ml-auto mr-2"
                    ref={localitySearchRef}
                  >
                    <button
                      type="button"
                      onClick={() => setLocalitySearchOpen(!localitySearchOpen)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-purple-400 text-purple-600 bg-purple-50 text-sm font-medium hover:bg-purple-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> New
                    </button>

                    {/* Locality Search Dropdown */}
                    {localitySearchOpen && (
                      <div className="absolute top-full right-0 mt-2 w-80 rounded-xl shadow-2xl border bg-white border-gray-200 z-50">
                        <div className="p-3 border-b border-gray-100">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Search localities..."
                              value={localitySearchTerm}
                              onChange={(e) =>
                                setLocalitySearchTerm(e.target.value)
                              }
                              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border focus:ring-purple-500 focus:border-purple-500"
                              autoFocus
                            />
                          </div>
                        </div>
                        <div className="max-h-64 overflow-y-auto p-2">
                          {isLoadingLocalities ? (
                            <div className="p-3 text-center text-gray-500 text-sm">
                              Loading localities...
                            </div>
                          ) : filteredLocalities.length > 0 ? (
                            filteredLocalities.map((locality) => (
                              <button
                                key={locality.id}
                                onClick={() => handleLocalitySelect(locality)}
                                className="w-full px-3 py-2 text-left rounded-lg text-sm transition-all hover:bg-gray-100"
                              >
                                <div className="font-medium text-gray-900">
                                  {locality.name}
                                </div>
                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                  <MapPin className="w-3 h-3" />
                                  {locality.city.name}
                                </div>
                              </button>
                            ))
                          ) : (
                            <div className="p-3 text-center text-gray-500 text-sm">
                              No localities found
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 3. Action Buttons & User Menu (Right) */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Download App */}
              <button
                className={`hidden lg:flex items-center gap-1.5 text-sm font-semibold transition-all rounded-lg text-white hover:bg-purple-800 p-2`}
              >
                Download App
              </button>

              {/* List Property */}
              <Link
                to="/properties/new"
                onClick={handlePostPropertyForFree}
                className={`hidden sm:flex items-center gap-1 px-3 py-2 text-sm font-bold rounded-lg transition-all ${styles.button} relative`}
              >
                List Property
                <span
                  className={`absolute -top-1 -right-1 text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${styles.buttonAccent}`}
                >
                  FREE
                </span>
              </Link>

              {/* Saved Properties */}
              <Link
                to="/saved-properties"
                className={`p-2 rounded-lg transition-all ${styles.iconButton} hidden md:inline-flex relative`}
              >
                <Heart className="w-5 h-5" />
                {favoriteProperties.length > 0 && (
                  <span className="absolute top-0 right-0 min-w-[16px] h-[16px] bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {favoriteProperties.length > 9
                      ? "9+"
                      : favoriteProperties.length}
                  </span>
                )}
              </Link>
              {!user && (
                <>
                  <Link
                    to="/signin"
                    className={`block text-center px-3 py-2 text-sm font-bold rounded-lg transition-all bg-gray-100 text-purple-700`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className={`block text-center px-3 py-2 text-sm font-bold rounded-lg transition-all bg-purple-700 text-white`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}

              {/* User Menu */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`flex items-center gap-1 p-2 rounded-xl transition-all ${styles.iconButton} md:bg-purple-500 md:hover:bg-purple-600 md:px-3 md:py-2 md:rounded-lg`}
                  >
                    <Menu className="w-5 h-5 md:hidden" />
                    <div className="hidden md:flex items-center gap-1.5">
                      <User className="w-5 h-5" />
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {userMenuOpen && (
                    <div
                      className={`absolute right-0 top-full mt-2 w-56 rounded-xl shadow-2xl border z-50 ${styles.dropdown}`}
                    >
                      <div className="p-3 border-b border-gray-200">
                        <p className="font-bold text-sm">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <div className="p-2">
                        {hasDashboardAccess && (
                          <button
                            onClick={() => handleMenuNavigate("/dashboard")}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-all w-full text-left text-sm"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleMenuNavigate("/saved-properties")
                          }
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-all w-full text-left text-sm"
                        >
                          <Heart className="w-4 h-4" />
                          Saved Properties
                        </button>
                      </div>
                      <div className="p-2 border-t border-gray-200">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-red-50 text-red-600 transition-all w-full text-sm"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className={`lg:hidden p-2 rounded-xl transition-all ${styles.iconButton}`}
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className={`md:hidden border-t ${styles.dropdown}`}>
              <div className="px-4 py-4 space-y-2">
                {!user && (
                  <>
                    <Link
                      to="/signin"
                      className={`block text-center px-3 py-2 text-sm font-bold rounded-lg transition-all bg-gray-100 text-purple-700`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className={`block text-center px-3 py-2 text-sm font-bold rounded-lg transition-all bg-purple-700 text-white`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </>
                )}
                {user && hasDashboardAccess && (
                  <Link
                    to="/dashboard"
                    className={`flex items-center gap-2 px-3 py-2 font-semibold text-sm rounded-lg transition-all ${styles.navLink}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                )}
                {user && (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-all w-full text-sm font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* City Change Confirmation Modal */}
      {showCityChangeModal && pendingLocality && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Change City?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  The locality{" "}
                  <span className="font-semibold text-purple-700">
                    {pendingLocality.name}
                  </span>{" "}
                  is in{" "}
                  <span className="font-semibold text-purple-700">
                    {pendingLocality.city.name}
                  </span>
                  . Your current city will be changed from{" "}
                  <span className="font-semibold">{selectedCity?.name}</span> to{" "}
                  <span className="font-semibold text-purple-700">
                    {pendingLocality.city.name}
                  </span>
                  .
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={cancelCityChange}
                    className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmCityChange}
                    className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                  >
                    Change City
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
