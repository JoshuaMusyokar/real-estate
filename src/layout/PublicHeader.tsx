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
} from "lucide-react";
import { useGetFavoritePropertiesQuery } from "../services/propertyApi";
import { useAuth } from "../hooks/useAuth";

interface PublicHeaderProps {
  onShowFavorites?: () => void;
  onShowAppointments?: () => void;
  theme?: "vibrant" | "clean" | "dark"; // Template theme
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  onShowFavorites,
  onShowAppointments,
  theme = "vibrant", // Default to Template 1 (vibrant)
}) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [favoritesDropdownOpen, setFavoritesDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: favoritesData } = useGetFavoritePropertiesQuery(
    { page: 1, limit: 5 },
    { skip: !user }
  );

  const favoriteProperties = favoritesData?.data || [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setFavoritesDropdownOpen(false);
        setUserMenuOpen(false);
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

  // Theme-based styling
  const getThemeStyles = () => {
    switch (theme) {
      case "clean": // Template 2 (Zillow-style)
        return {
          bg: "bg-white border-b border-gray-200",
          logo: "bg-blue-600",
          logoText: "text-gray-900",
          logoSubtext: "text-blue-600",
          navLink: "text-gray-700 hover:text-blue-600 hover:bg-blue-50",
          button: "bg-blue-600 hover:bg-blue-700 text-white",
          buttonSecondary: "text-gray-700 hover:bg-gray-100",
          iconButton: "text-gray-700 hover:text-blue-600 hover:bg-blue-50",
          dropdown: "bg-white border-gray-200",
          accent: "blue",
        };
      case "dark": // Template 3 (Redfin-style)
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
          dropdown: "bg-slate-800 border-slate-700",
          accent: "red",
        };
      default: // Template 1 (Vibrant)
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
          dropdown: "bg-white border-gray-200/50",
          accent: "blue",
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <nav className={`fixed top-0 w-full z-50 shadow-lg ${styles.bg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div
              className={`relative w-12 h-12 ${styles.logo} rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
            >
              <Building2 className="w-6 h-6 text-white" />
              {theme === "vibrant" && (
                <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl group-hover:bg-white/30 transition-all" />
              )}
            </div>
            <div>
              <span className={`block text-2xl font-black ${styles.logoText}`}>
                Bengal Property
              </span>
              <span
                className={`block text-[10px] font-semibold ${styles.logoSubtext} -mt-1`}
              >
                {theme === "dark"
                  ? "Data-Driven Real Estate"
                  : "Premium Real Estate"}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {["Properties", "How It Works", "About", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className={`px-4 py-2.5 font-semibold transition-all rounded-xl relative group ${styles.navLink}`}
              >
                {item}
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-${styles.accent}-600 group-hover:w-3/4 transition-all duration-300`}
                />
              </a>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Favorites Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() =>
                      setFavoritesDropdownOpen(!favoritesDropdownOpen)
                    }
                    className={`relative p-2.5 rounded-xl transition-all group ${styles.iconButton}`}
                  >
                    <Heart className="w-6 h-6" />
                    {favoriteProperties.length > 0 && (
                      <span
                        className={`absolute -top-1 -right-1 min-w-[20px] h-5 bg-${
                          styles.accent === "red" ? "red" : styles.accent
                        }-500 text-white text-xs rounded-full flex items-center justify-center font-bold`}
                      >
                        {favoriteProperties.length}
                      </span>
                    )}
                  </button>

                  {favoritesDropdownOpen && (
                    <div
                      className={`absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-2xl border backdrop-blur-xl z-50 ${styles.dropdown}`}
                    >
                      <div
                        className={`p-4 border-b ${
                          theme === "dark"
                            ? "border-slate-700"
                            : "border-gray-100"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h3
                            className={`font-bold ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            Saved Properties
                          </h3>
                          <span
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-slate-400"
                                : "text-gray-500"
                            }`}
                          >
                            {favoriteProperties.length} saved
                          </span>
                        </div>
                      </div>

                      <div className="max-h-96 overflow-y-auto">
                        {favoriteProperties.length > 0 ? (
                          <div className="p-2">
                            {favoriteProperties.map((fav) => (
                              <Link
                                key={fav.id}
                                to={`/properties/${fav.id}`}
                                className={`flex items-center gap-3 p-3 rounded-xl transition-all group ${
                                  theme === "dark"
                                    ? "hover:bg-slate-700"
                                    : "hover:bg-gray-50"
                                }`}
                                onClick={() => setFavoritesDropdownOpen(false)}
                              >
                                <img
                                  src={
                                    fav.coverImage || "/default-property.jpg"
                                  }
                                  alt={fav.title}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                  <p
                                    className={`font-semibold text-sm truncate ${
                                      theme === "dark"
                                        ? "text-white"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    {fav.title}
                                  </p>
                                  <p
                                    className={`text-sm ${
                                      theme === "dark"
                                        ? "text-slate-300"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    ${fav.price.toLocaleString()}
                                  </p>
                                  <p
                                    className={`text-xs ${
                                      theme === "dark"
                                        ? "text-slate-400"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {fav.city}, {fav.locality}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="p-6 text-center">
                            <Heart
                              className={`w-12 h-12 mx-auto mb-3 ${
                                theme === "dark"
                                  ? "text-slate-700"
                                  : "text-gray-300"
                              }`}
                            />
                            <p
                              className={`font-medium ${
                                theme === "dark"
                                  ? "text-slate-400"
                                  : "text-gray-500"
                              }`}
                            >
                              No saved properties
                            </p>
                            <p
                              className={`text-sm mt-1 ${
                                theme === "dark"
                                  ? "text-slate-500"
                                  : "text-gray-400"
                              }`}
                            >
                              Start saving your favorites
                            </p>
                          </div>
                        )}
                      </div>

                      <div
                        className={`p-4 border-t ${
                          theme === "dark"
                            ? "border-slate-700"
                            : "border-gray-100"
                        }`}
                      >
                        <Link
                          to="/saved-properties"
                          className={`w-full py-2.5 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${styles.button}`}
                          onClick={() => setFavoritesDropdownOpen(false)}
                        >
                          <Heart className="w-4 h-4" />
                          View All Saved
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Appointments Button */}
                <button
                  onClick={onShowAppointments}
                  className={`p-2.5 rounded-xl transition-all ${styles.iconButton}`}
                >
                  <Calendar className="w-6 h-6" />
                </button>

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
                      } rounded-full flex items-center justify-center text-white font-bold text-sm`}
                    >
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {userMenuOpen && (
                    <div
                      className={`absolute right-0 top-full mt-2 w-56 rounded-2xl shadow-2xl border backdrop-blur-xl z-50 ${styles.dropdown}`}
                    >
                      <div
                        className={`p-4 border-b ${
                          theme === "dark"
                            ? "border-slate-700"
                            : "border-gray-100"
                        }`}
                      >
                        <p
                          className={`font-bold ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {user.firstName} {user.lastName}
                        </p>
                        <p
                          className={`text-sm ${
                            theme === "dark"
                              ? "text-slate-400"
                              : "text-gray-500"
                          }`}
                        >
                          {user.email}
                        </p>
                      </div>

                      <div className="p-2">
                        <button
                          onClick={() =>
                            handleMenuNavigate("/saved-properties")
                          }
                          className={`flex items-center gap-3 p-3 rounded-xl transition-all w-full text-left ${
                            theme === "dark"
                              ? "hover:bg-slate-700 text-slate-300"
                              : "hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          <Heart className="w-5 h-5" />
                          <span className="font-medium">Saved Properties</span>
                        </button>

                        <button
                          onClick={() => handleMenuNavigate("/my-appointments")}
                          className={`flex items-center gap-3 p-3 rounded-xl transition-all w-full text-left ${
                            theme === "dark"
                              ? "hover:bg-slate-700 text-slate-300"
                              : "hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          <Calendar className="w-5 h-5" />
                          <span className="font-medium">My Appointments</span>
                        </button>
                      </div>

                      <div
                        className={`p-2 border-t ${
                          theme === "dark"
                            ? "border-slate-700"
                            : "border-gray-100"
                        }`}
                      >
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600 transition-all w-full"
                        >
                          <LogOut className="w-5 h-5" />
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/signin"
                  className={`hidden sm:block px-6 py-2.5 font-bold rounded-xl transition-all ${styles.buttonSecondary}`}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className={`px-6 py-3 font-bold rounded-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 ${styles.button}`}
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2.5 rounded-xl transition-all ${styles.iconButton}`}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className={`lg:hidden border-t shadow-xl ${
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
                    className={`block px-4 py-3 font-semibold rounded-xl transition-all ${styles.navLink}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                )
              )}

              {user && (
                <>
                  <div
                    className={`border-t mt-4 pt-4 ${
                      theme === "dark" ? "border-slate-800" : "border-gray-200"
                    }`}
                  >
                    <Link
                      to="/saved-properties"
                      className={`flex items-center gap-3 px-4 py-3 font-semibold rounded-xl transition-all ${styles.navLink}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Heart className="w-5 h-5" />
                      Saved Properties
                    </Link>
                    <Link
                      to="/appointments"
                      className={`flex items-center gap-3 px-4 py-3 font-semibold rounded-xl transition-all ${styles.navLink}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Calendar className="w-5 h-5" />
                      My Appointments
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
