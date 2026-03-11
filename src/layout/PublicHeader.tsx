import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Heart,
  User,
  LogOut,
  ChevronDown,
  Search,
  LayoutDashboard,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { useGetFavoritePropertiesQuery } from "../services/propertyApi";
import { useAuth } from "../hooks/useAuth";
import {
  useGetCitiesQuery,
  useGetLocalitiesQuery,
} from "../services/locationApi";
import { useToast } from "../hooks/useToast";
import appLogo from "../assets/p4i.png";
import { CitySelector } from "../features/Landing/components/CitySelector";

interface PublicHeaderProps {
  onShowFavorites?: () => void;
  onShowAppointments?: () => void;
  theme?: "vibrant" | "clean" | "dark";
  selectedCityId?: string;
  selectedLocalities?: Array<{ id: string; name: string }>;
  onCityChange?: (cityId: string, cityName?: string) => void;
  onLocalityChange?: (localityId: string, localityName?: string) => void;
  onSearch?: (searchTerm: string) => void;
  onRemoveLocality?: (localityId: string) => void;
  initialSearchTerm?: string;
  displaySearchBar?: boolean;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  selectedCityId,
  selectedLocalities = [],
  onCityChange,
  onLocalityChange,
  onRemoveLocality,
  displaySearchBar = false,
}) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [localityOpen, setLocalityOpen] = useState(false);
  const [localityQuery, setLocalityQuery] = useState("");
  const [showCityModal, setShowCityModal] = useState(false);
  const [pendingLocality, setPendingLocality] = useState<any>(null);
  const { warning } = useToast();

  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const localityRef = useRef<HTMLDivElement>(null);

  const { data: favoritesData } = useGetFavoritePropertiesQuery(
    { page: 1, limit: 5 },
    { skip: !user },
  );
  const { data: citiesData } = useGetCitiesQuery({ page: 1, limit: 1000 });
  const { data: localitiesData, isLoading: loadingLocalities } =
    useGetLocalitiesQuery({
      page: 1,
      limit: 500,
      search: localityQuery || undefined,
    });

  const favoriteCount = favoritesData?.data?.length ?? 0;
  const cities = citiesData?.data ?? [];
  const localities = localitiesData?.data ?? [];
  const selectedCity = cities.find((c) => c.id === selectedCityId);
  const hasDashboard = user && user.role.name !== "BUYER";

  // Click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      )
        setUserMenuOpen(false);
      if (
        localityRef.current &&
        !localityRef.current.contains(e.target as Node)
      )
        setLocalityOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleCityChange = (id: string, name?: string) => {
    onCityChange?.(id, name);
  };

  const handleLocalitySelect = (locality: any) => {
    const already = selectedLocalities.some((l) => l.id === locality.id);
    if (already) {
      setLocalityOpen(false);
      return;
    }
    if (locality.cityId !== selectedCityId) {
      setPendingLocality(locality);
      setShowCityModal(true);
    } else {
      onLocalityChange?.(locality.id, locality.name);
      setLocalityOpen(false);
      setLocalityQuery("");
    }
  };

  const confirmCityChange = () => {
    if (!pendingLocality) return;
    onCityChange?.(pendingLocality.cityId, pendingLocality.city?.name);
    onLocalityChange?.(pendingLocality.id, pendingLocality.name);
    setShowCityModal(false);
    setPendingLocality(null);
    setLocalityOpen(false);
    setLocalityQuery("");
  };

  const handlePostProperty = () => {
    if (!user) warning("Sign In!", "Please login to post a property");
    navigate("/properties/new");
  };

  const handleMenuNav = (path: string) => {
    setUserMenuOpen(false);
    setTimeout(() => navigate(path), 150);
  };

  return (
    <>
      {/* ── Nav bar ────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 bg-white border-b border-blue-100 shadow-sm">
        <div className="max-w-full mx-auto px-3 sm:px-5 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-[68px] gap-2">
            {/* ── Left: Logo + City ─────────────────────────────────────────── */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 min-w-0">
              {/* Logo */}
              <Link to="/" className="flex-shrink-0">
                <img
                  src={appLogo}
                  alt="Logo"
                  className="h-7 sm:h-9 lg:h-11 w-auto object-contain"
                />
              </Link>

              {/* Divider */}
              <div className="h-6 w-px bg-blue-100 hidden sm:block flex-shrink-0" />

              {/* City selector — uses the shared CitySelector (portal modal, no z-conflict) */}
              <CitySelector
                cities={cities}
                variant="pill"
                selectedCityId={selectedCityId ?? ""}
                selectedCityName={selectedCity?.name ?? ""}
                onCityChange={handleCityChange}
              />
            </div>

            {/* ── Center: Locality search bar (desktop only when displaySearchBar) ── */}
            {displaySearchBar && (
              <div
                className="hidden md:flex flex-1 max-w-xl mx-4"
                ref={localityRef}
              >
                <div className="relative w-full">
                  {/* Input row */}
                  <div
                    className="flex items-center bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 gap-2 flex-wrap min-h-[42px] cursor-text"
                    onClick={() => setLocalityOpen(true)}
                  >
                    <Search className="w-4 h-4 text-blue-400 flex-shrink-0" />

                    {/* Locality chips */}
                    {selectedLocalities.map((loc) => (
                      <span
                        key={loc.id}
                        className="flex items-center gap-1 px-2 py-0.5 bg-blue-600 text-white rounded-full text-xs font-medium"
                      >
                        {loc.name}
                        <button
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            onRemoveLocality?.(loc.id);
                          }}
                          className="hover:bg-blue-700 rounded-full p-0.5"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}

                    <input
                      type="text"
                      value={localityQuery}
                      onChange={(e) => {
                        setLocalityQuery(e.target.value);
                        setLocalityOpen(true);
                      }}
                      onFocus={() => setLocalityOpen(true)}
                      placeholder={
                        selectedLocalities.length
                          ? "Add locality..."
                          : "Search locality…"
                      }
                      className="flex-1 min-w-[80px] bg-transparent text-sm text-gray-700 placeholder-blue-300 focus:outline-none"
                    />

                    {(localityQuery || selectedLocalities.length > 0) && (
                      <button
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          setLocalityQuery("");
                        }}
                        className="p-0.5 hover:bg-blue-200 rounded-full"
                      >
                        <X className="w-3.5 h-3.5 text-blue-400" />
                      </button>
                    )}
                  </div>

                  {/* Locality dropdown */}
                  {localityOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-2xl border border-blue-100 z-50 overflow-hidden">
                      <div className="max-h-64 overflow-y-auto">
                        {loadingLocalities ? (
                          <div className="p-4 text-center text-sm text-gray-400">
                            Loading…
                          </div>
                        ) : localities.length === 0 ? (
                          <div className="p-4 text-center text-sm text-gray-400">
                            No localities found
                          </div>
                        ) : (
                          localities.map((loc) => {
                            const selected = selectedLocalities.some(
                              (l) => l.id === loc.id,
                            );
                            return (
                              <button
                                key={loc.id}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  handleLocalitySelect(loc);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                                  selected ? "bg-blue-50" : "hover:bg-gray-50"
                                }`}
                              >
                                <MapPin
                                  className={`w-4 h-4 flex-shrink-0 ${selected ? "text-blue-500" : "text-gray-400"}`}
                                />
                                <div>
                                  <div
                                    className={`text-sm font-medium ${selected ? "text-blue-600" : "text-gray-800"}`}
                                  >
                                    {loc.name}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {loc.city?.name}
                                  </div>
                                </div>
                                {selected && (
                                  <span className="ml-auto text-xs text-blue-500 font-semibold">
                                    Added
                                  </span>
                                )}
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Right: Actions ────────────────────────────────────────────── */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {/* Download App — large screens only */}
              <button className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                Download App
              </button>

              {/* List Property */}
              <button
                onClick={handlePostProperty}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors relative"
              >
                List Property
                <span className="absolute -top-1.5 -right-1.5 text-[9px] px-1.5 py-0.5 rounded-full font-extrabold bg-amber-400 text-amber-900 leading-none">
                  FREE
                </span>
              </button>

              {/* Saved / Heart */}
              {user && (
                <Link
                  to="/saved-properties"
                  className="relative p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors hidden sm:inline-flex"
                >
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                  {favoriteCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 min-w-[14px] h-[14px] bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold leading-none">
                      {favoriteCount > 9 ? "9+" : favoriteCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Auth — not logged in */}
              {!user && (
                <div className="flex items-center gap-1.5">
                  <Link
                    to="/signin"
                    className="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg text-blue-600 border border-blue-200 hover:bg-blue-50 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors hidden sm:inline-flex"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* User menu — logged in */}
              {user && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserMenuOpen((o) => !o)}
                    className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                  >
                    {/* Avatar initials */}
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {user.firstName?.[0]?.toUpperCase() ?? (
                        <User className="w-3 h-3" />
                      )}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 hidden sm:block" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-2xl border border-blue-100 z-50 overflow-hidden">
                      {/* User info */}
                      <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
                        <p className="font-bold text-sm text-gray-900 truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-blue-500 truncate">
                          {user.email}
                        </p>
                      </div>

                      <div className="p-1.5">
                        {hasDashboard && (
                          <button
                            onClick={() => handleMenuNav("/dashboard")}
                            className="flex items-center gap-2.5 w-full px-3 py-2 text-sm rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" /> Dashboard
                          </button>
                        )}
                        <button
                          onClick={() => handleMenuNav("/saved-properties")}
                          className="flex items-center gap-2.5 w-full px-3 py-2 text-sm rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                        >
                          <Heart className="w-4 h-4" /> Saved Properties
                        </button>
                        <button
                          onClick={() => handleMenuNav("/profile")}
                          className="flex items-center gap-2.5 w-full px-3 py-2 text-sm rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                        >
                          <User className="w-4 h-4" /> Profile
                        </button>
                      </div>

                      <div className="p-1.5 border-t border-blue-100">
                        <button
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                          }}
                          className="flex items-center gap-2.5 w-full px-3 py-2 text-sm rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile hamburger — only for guests (logged-in users use avatar above) */}
              {!user && (
                <button
                  onClick={() => setMobileMenuOpen((o) => !o)}
                  className="sm:hidden p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
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

          {/* ── Mobile locality bar (below nav, when displaySearchBar) ──────── */}
          {displaySearchBar && (
            <div
              className="md:hidden border-t border-blue-50 py-2"
              ref={localityRef}
            >
              <div
                className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 flex-wrap min-h-[40px] cursor-text"
                onClick={() => setLocalityOpen(true)}
              >
                <Search className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />

                {selectedLocalities.map((loc) => (
                  <span
                    key={loc.id}
                    className="flex items-center gap-1 px-2 py-0.5 bg-blue-600 text-white rounded-full text-[11px] font-medium"
                  >
                    {loc.name}
                    <button
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        onRemoveLocality?.(loc.id);
                      }}
                      className="hover:bg-blue-700 rounded-full p-0.5"
                    >
                      <X className="w-2 h-2" />
                    </button>
                  </span>
                ))}

                <input
                  type="text"
                  value={localityQuery}
                  onChange={(e) => {
                    setLocalityQuery(e.target.value);
                    setLocalityOpen(true);
                  }}
                  onFocus={() => setLocalityOpen(true)}
                  placeholder="Add locality…"
                  className="flex-1 min-w-[80px] bg-transparent text-xs text-gray-700 placeholder-blue-300 focus:outline-none"
                />
              </div>

              {/* Mobile locality dropdown */}
              {localityOpen && (
                <div className="mt-1.5 bg-white rounded-xl shadow-2xl border border-blue-100 overflow-hidden">
                  <div className="max-h-52 overflow-y-auto">
                    {loadingLocalities ? (
                      <div className="p-3 text-center text-xs text-gray-400">
                        Loading…
                      </div>
                    ) : localities.length === 0 ? (
                      <div className="p-3 text-center text-xs text-gray-400">
                        No localities found
                      </div>
                    ) : (
                      localities.map((loc) => {
                        const selected = selectedLocalities.some(
                          (l) => l.id === loc.id,
                        );
                        return (
                          <button
                            key={loc.id}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleLocalitySelect(loc);
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${selected ? "bg-blue-50" : "hover:bg-gray-50"}`}
                          >
                            <MapPin
                              className={`w-3.5 h-3.5 flex-shrink-0 ${selected ? "text-blue-500" : "text-gray-400"}`}
                            />
                            <div className="min-w-0">
                              <div
                                className={`text-xs font-medium truncate ${selected ? "text-blue-600" : "text-gray-800"}`}
                              >
                                {loc.name}
                              </div>
                              <div className="text-[10px] text-gray-400">
                                {loc.city?.name}
                              </div>
                            </div>
                            {selected && (
                              <span className="ml-auto text-[10px] text-blue-500 font-semibold">
                                ✓
                              </span>
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Guest mobile menu ─────────────────────────────────────────────── */}
          {mobileMenuOpen && !user && (
            <div className="md:hidden border-t border-blue-100 py-3 px-1 space-y-1.5">
              <Link
                to="/signin"
                className="block text-center px-4 py-2 text-sm font-bold rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="block text-center px-4 py-2 text-sm font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
              <button
                onClick={handlePostProperty}
                className="w-full text-center px-4 py-2 text-sm font-bold rounded-lg bg-amber-400 text-amber-900 hover:bg-amber-500 transition-colors"
              >
                List Property — FREE
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* ── City-change confirmation modal ──────────────────────────────────── */}
      {showCityModal && pendingLocality && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-[9999] p-4">
          <div className="w-full sm:max-w-md bg-white rounded-2xl shadow-2xl p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-gray-900 mb-1">
                  Change City?
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-4">
                  <span className="font-semibold text-blue-600">
                    {pendingLocality.name}
                  </span>{" "}
                  is in{" "}
                  <span className="font-semibold text-blue-600">
                    {pendingLocality.city?.name}
                  </span>
                  . This will change your city from{" "}
                  <span className="font-semibold">{selectedCity?.name}</span>.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowCityModal(false);
                      setPendingLocality(null);
                    }}
                    className="flex-1 px-4 py-2 text-sm font-semibold rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmCityChange}
                    className="flex-1 px-4 py-2 text-sm font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
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
