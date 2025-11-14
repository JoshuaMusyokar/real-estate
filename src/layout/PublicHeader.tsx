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
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  onShowFavorites,
  onShowAppointments,
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

  // Close dropdown when clicking outside
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
    // small delay to allow the dropdown to close before routing
    setTimeout(() => navigate(path), 150);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-xl z-50 border-b border-gray-200/50 shadow-lg shadow-gray-900/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
              <Building2 className="w-6 h-6 text-white" />
              <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl group-hover:bg-white/30 transition-all" />
            </div>
            <div>
              <span className="block text-2xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Bengal Property
              </span>
              <span className="block text-[10px] font-semibold text-blue-600 -mt-1">
                Premium Real Estate
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {["Properties", "How It Works", "About", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="px-4 py-2.5 text-gray-700 hover:text-blue-600 font-semibold transition-all hover:bg-blue-50/50 rounded-xl relative group"
              >
                {item}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-3/4 transition-all duration-300" />
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
                    className="relative p-2.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all group"
                  >
                    <Heart className="w-6 h-6" />
                    {favoriteProperties.length > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {favoriteProperties.length}
                      </span>
                    )}
                  </button>

                  {favoritesDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200/50 backdrop-blur-xl z-50">
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-gray-900">
                            Saved Properties
                          </h3>
                          <span className="text-sm text-gray-500">
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
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all group"
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
                                  <p className="font-semibold text-gray-900 text-sm truncate">
                                    {fav.title}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    ${fav.price.toLocaleString()}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {fav.city}, {fav.locality}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="p-6 text-center">
                            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">
                              No saved properties
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                              Start saving your favorite properties
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="p-4 border-t border-gray-100">
                        <Link
                          to="/saved-properties"
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 px-4 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                          onClick={() => setFavoritesDropdownOpen(false)}
                        >
                          <Heart className="w-4 h-4" />
                          View All Saved Properties
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Appointments Button */}
                <button
                  onClick={onShowAppointments}
                  className="p-2.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all"
                >
                  <Calendar className="w-6 h-6" />
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-200/50 backdrop-blur-xl z-50">
                      <div className="p-4 border-b border-gray-100">
                        <p className="font-bold text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>

                      <div className="p-2">
                        <button
                          onClick={() =>
                            handleMenuNavigate("/saved-properties")
                          }
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all w-full text-left"
                        >
                          <Heart className="w-5 h-5 text-gray-600" />
                          <span className="font-medium">Saved Properties</span>
                        </button>

                        <button
                          onClick={() => handleMenuNavigate("/my-appointments")}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all w-full text-left"
                        >
                          <Calendar className="w-5 h-5 text-gray-600" />
                          <span className="font-medium">My Appointments</span>
                        </button>

                        {/* <Link
                          to="/profile"
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all"
                          onClick={() => handleMenuNavigate("/saved-properties")}
                        >
                          <User className="w-5 h-5 text-gray-600" />
                          <span className="font-medium">Profile Settings</span>
                        </Link> */}
                      </div>

                      <div className="p-2 border-t border-gray-100">
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
              /* Auth Buttons for non-logged in users */
              <div className="flex items-center gap-3">
                <Link
                  to="/signin"
                  className="hidden sm:block px-6 py-2.5 text-gray-700 font-bold hover:bg-gray-100 rounded-xl transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 hover:bg-gray-100 rounded-xl transition-all"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-xl">
            <div className="px-4 py-4 space-y-2">
              {["Properties", "How It Works", "About", "Contact"].map(
                (item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-semibold rounded-xl transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                )
              )}

              {user && (
                <>
                  <div className="border-t border-gray-200 mt-4 pt-4">
                    <Link
                      to="/saved-properties"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-semibold rounded-xl transition-all"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Heart className="w-5 h-5" />
                      Saved Properties
                    </Link>
                    <Link
                      to="/appointments"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-semibold rounded-xl transition-all"
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
