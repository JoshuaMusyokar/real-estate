/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  Menu,
  X,
  Heart,
  Calendar,
  User,
  LogOut,
  ChevronDown,
  Home,
  Search,
  LayoutDashboard,
  MapPin,
} from "lucide-react";
import { useGetFavoritePropertiesQuery } from "../services/propertyApi";
import { useAuth } from "../hooks/useAuth";
import { useGetCitiesQuery } from "../services/locationApi";

interface PublicHeaderProps {
  onShowFavorites?: () => void;
  onShowAppointments?: () => void;
  theme?: "vibrant" | "clean" | "dark";
  selectedCityId?: string;
  onCityChange?: (cityId: string) => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  onShowFavorites,
  onShowAppointments,
  theme = "vibrant",
  selectedCityId,
  onCityChange,
}) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [favoritesDropdownOpen, setFavoritesDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const cityDropdownRef = useRef<HTMLDivElement>(null);

  const { data: favoritesData } = useGetFavoritePropertiesQuery(
    { page: 1, limit: 5 },
    { skip: !user }
  );

  const { data: citiesData, isLoading: isLoadingCities } = useGetCitiesQuery({
    page: 1,
    limit: 100,
  });

  const favoriteProperties = favoritesData?.data || [];
  const cities = citiesData?.data || [];
  const selectedCity = cities.find((city) => city.id === selectedCityId);
  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(citySearchTerm.toLowerCase())
  );

  // Check if user has dashboard access
  const hasDashboardAccess = user && user.role.name !== "BUYER";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setFavoritesDropdownOpen(false);
        setUserMenuOpen(false);
      }
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(event.target as Node)
      ) {
        setCityDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuNavigate = (path: string) => {
    setUserMenuOpen(false);
    setTimeout(() => navigate(path), 150);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  const handleCitySelect = (cityId: string) => {
    if (onCityChange) {
      onCityChange(cityId);
    }
    setCityDropdownOpen(false);
    setCitySearchTerm("");
  };

  // Theme-based styling
  const getThemeStyles = () => {
    switch (theme) {
      case "clean":
        return {
          bg: "bg-white border-b border-gray-200",
          logo: "bg-blue-600",
          logoText: "text-gray-900",
          logoSubtext: "text-blue-600",
          navLink: "text-gray-700 hover:text-blue-600 hover:bg-blue-50",
          button: "bg-blue-600 hover:bg-blue-700 text-white",
          buttonSecondary: "text-gray-700 hover:bg-gray-100",
          iconButton: "text-gray-700 hover:text-blue-600 hover:bg-blue-50",
          cityButton:
            "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200",
          dropdown: "bg-white border-gray-200",
          accent: "blue",
        };
      case "dark":
        return {
          bg: "bg-slate-900 border-b border-slate-800",
          logo: "bg-gradient-to-br from-red-600 to-red-700",
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
          accent: "red",
        };
      default:
        return {
          bg: "bg-white/80 backdrop-blur-xl border-b border-gray-200/50",
          logo: "bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600",
          logoText: "text-gray-900",
          logoSubtext: "text-blue-600",
          navLink: "text-gray-700 hover:text-blue-600 hover:bg-blue-50/50",
          button:
            "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:shadow-2xl hover:shadow-blue-500/30 text-white",
          buttonSecondary: "text-gray-700 hover:bg-gray-100",
          iconButton: "text-gray-700 hover:text-blue-600 hover:bg-blue-50/50",
          cityButton:
            "bg-blue-50/50 hover:bg-blue-100/50 text-gray-700 border-blue-200/50",
          dropdown: "bg-white border-gray-200/50",
          accent: "blue",
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <nav className={`fixed top-0 w-full z-50 shadow-lg ${styles.bg}`}>
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <div
              className={`relative w-12 h-12 ${styles.logo} rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
            >
              <Building2 className="w-6 h-6 text-white" />
              {theme === "vibrant" && (
                <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl group-hover:bg-white/30 transition-all" />
              )}
            </div>
            <div className="hidden sm:block">
              <span
                className={`block text-xl font-black ${styles.logoText} leading-tight`}
              >
                Bengal Property
              </span>
              <span
                className={`block text-[9px] font-semibold ${styles.logoSubtext} -mt-0.5`}
              >
                {theme === "dark"
                  ? "Data-Driven Real Estate"
                  : "Premium Real Estate"}
              </span>
            </div>
          </Link>

          {/* City Selector - Integrated Design */}
          <div className="relative flex-shrink-0" ref={cityDropdownRef}>
            <button
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${styles.cityButton}`}
            >
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-semibold hidden sm:inline">
                {selectedCity?.name || "Select City"}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  cityDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {cityDropdownOpen && (
              <div
                className={`absolute top-full left-0 mt-2 w-80 rounded-xl shadow-2xl border backdrop-blur-xl z-50 ${styles.dropdown}`}
              >
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search cities..."
                      value={citySearchTerm}
                      onChange={(e) => setCitySearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto p-2">
                  {filteredCities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => handleCitySelect(city.id)}
                      className={`w-full px-3 py-2 text-left rounded-lg text-sm font-medium transition-all ${
                        city.id === selectedCityId
                          ? "bg-blue-500 text-white"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {["Properties", "How It Works", "About", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className={`px-4 py-2 font-semibold text-sm transition-all rounded-xl ${styles.navLink}`}
              >
                {item}
              </a>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {user ? (
              <>
                {/* Dashboard Button */}
                {hasDashboardAccess && (
                  <Link
                    to="/dashboard"
                    className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${styles.iconButton}`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="hidden lg:inline">Dashboard</span>
                  </Link>
                )}

                {/* Favorites Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() =>
                      setFavoritesDropdownOpen(!favoritesDropdownOpen)
                    }
                    className={`relative p-2 rounded-xl transition-all ${styles.iconButton}`}
                  >
                    <Heart className="w-5 h-5" />
                    {favoriteProperties.length > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                        {favoriteProperties.length}
                      </span>
                    )}
                  </button>

                  {favoritesDropdownOpen && (
                    <div
                      className={`absolute right-0 top-full mt-2 w-80 rounded-xl shadow-2xl border backdrop-blur-xl z-50 ${styles.dropdown}`}
                    >
                      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-sm">
                            Saved Properties
                          </h3>
                          <span className="text-xs text-gray-500">
                            {favoriteProperties.length} saved
                          </span>
                        </div>
                      </div>
                      <div className="max-h-80 overflow-y-auto p-2">
                        {favoriteProperties.length > 0 ? (
                          favoriteProperties.map((fav) => (
                            <Link
                              key={fav.id}
                              to={`/properties/${fav.id}`}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                              onClick={() => setFavoritesDropdownOpen(false)}
                            >
                              <img
                                src={fav.coverImage || "/default-property.jpg"}
                                alt={fav.title}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate">
                                  {fav.title}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  ${fav.price.toLocaleString()}
                                </p>
                              </div>
                            </Link>
                          ))
                        ) : (
                          <div className="p-6 text-center">
                            <Heart className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm text-gray-500">
                              No saved properties
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                        <Link
                          to="/saved-properties"
                          className={`w-full py-2 px-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${styles.button}`}
                          onClick={() => setFavoritesDropdownOpen(false)}
                        >
                          View All
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`flex items-center gap-2 p-2 rounded-xl transition-all ${styles.iconButton}`}
                  >
                    <div
                      className={`w-8 h-8 ${
                        theme === "dark"
                          ? "bg-gradient-to-br from-red-500 to-red-600"
                          : "bg-gradient-to-br from-blue-500 to-purple-500"
                      } rounded-full flex items-center justify-center text-white font-bold text-xs`}
                    >
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 hidden sm:block" />
                  </button>

                  {userMenuOpen && (
                    <div
                      className={`absolute right-0 top-full mt-2 w-56 rounded-xl shadow-2xl border backdrop-blur-xl z-50 ${styles.dropdown}`}
                    >
                      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="font-bold text-sm">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <div className="p-2">
                        {hasDashboardAccess && (
                          <button
                            onClick={() => handleMenuNavigate("/dashboard")}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all w-full text-left text-sm"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleMenuNavigate("/saved-properties")
                          }
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all w-full text-left text-sm"
                        >
                          <Heart className="w-4 h-4" />
                          Saved Properties
                        </button>
                      </div>
                      <div className="p-2 border-t border-gray-200 dark:border-gray-700">
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
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/signin"
                  className={`hidden sm:block px-4 py-2 text-sm font-bold rounded-xl transition-all ${styles.buttonSecondary}`}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${styles.button}`}
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
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
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className={`lg:hidden border-t ${
              theme === "dark"
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="px-4 py-4 space-y-2">
              {["Properties", "How It Works", "About", "Contact"].map(
                (item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className={`block px-3 py-2 font-semibold text-sm rounded-lg transition-all ${styles.navLink}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                )
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
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
