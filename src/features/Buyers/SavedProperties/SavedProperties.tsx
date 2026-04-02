/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  Search,
  MapPin,
  Bed,
  Bath,
  Square,
  Trash2,
  Share2,
  Eye,
  ArrowLeft,
  SlidersHorizontal,
} from "lucide-react";
import {
  useGetFavoritePropertiesQuery,
  useRemoveFromFavoritesMutation,
} from "../../../services/propertyApi";
import { useAuth } from "../../../hooks/useAuth";
import { Footer } from "../../../layout/Footer";
import { PublicHeader } from "../../../layout/PublicHeader";

export const SavedPropertiesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("savedAt");

  const {
    data: favoritesData,
    isLoading,
    refetch,
  } = useGetFavoritePropertiesQuery({ page: 1, limit: 50 });
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();

  const favoriteProperties = favoritesData?.data || [];

  const filteredFavorites = favoriteProperties
    .filter(
      (fav) =>
        fav.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fav.city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fav.locality.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "price-low")
        return parseFloat(a.price) - parseFloat(b.price);
      if (sortBy === "price-high")
        return parseFloat(b.price) - parseFloat(a.price);
      return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
    });

  const handleRemoveFavorite = async (propertyId: string) => {
    try {
      await removeFromFavorites({ propertyId }).unwrap();
      refetch();
    } catch {
      //
    }
  };

  if (!user) {
    navigate("/signin");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16 sm:pt-20">
      <PublicHeader
        onShowFavorites={() => navigate("/saved-properties")}
        onShowAppointments={() => navigate("/appointments")}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* ── Page header ───────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
            <Link
              to="/"
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-gray-900 dark:text-white truncate">
                Saved Properties
              </h1>
              <p className="text-[11px] sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 hidden sm:block">
                Your personalised collection of favourite properties
              </p>
            </div>
          </div>
          <span className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold">
            {favoriteProperties.length} saved
          </span>
        </div>

        {/* ── Search + sort bar ──────────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex gap-2 sm:gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search saved properties…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 bg-gray-50 dark:bg-gray-800 border-0 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-700 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 sm:px-4 py-2 sm:py-2.5 bg-gray-50 dark:bg-gray-800 border-0 rounded-xl text-[11px] sm:text-sm font-semibold text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer flex-shrink-0"
            >
              <option value="savedAt">Recently Saved</option>
              <option value="price-low">Price ↑</option>
              <option value="price-high">Price ↓</option>
            </select>
          </div>
        </div>

        {/* ── Grid ──────────────────────────────────────────────────────── */}
        {isLoading ? (
          /* Skeleton — 2 cols on mobile, 3 on lg */
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="h-32 sm:h-44 bg-gray-200 dark:bg-gray-800" />
                <div className="p-3 sm:p-4 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/5" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-3/5" />
                  <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-2/5 mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredFavorites.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
            {filteredFavorites.map((fav) => (
              <div
                key={fav.id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-32 sm:h-44 overflow-hidden">
                  <img
                    src={fav.coverImage || "/default-property.jpg"}
                    alt={fav.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Top-right actions */}
                  <div className="absolute top-2 right-2 flex gap-1.5">
                    <button
                      onClick={() => handleRemoveFavorite(fav.id)}
                      className="w-7 h-7 sm:w-8 sm:h-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-all text-gray-600 shadow-sm"
                    >
                      <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                    <button className="w-7 h-7 sm:w-8 sm:h-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all text-gray-600 shadow-sm">
                      <Share2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>

                  {/* Saved date — bottom left */}
                  <div className="absolute bottom-2 left-2">
                    <span className="bg-black/60 text-white text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-lg backdrop-blur-sm">
                      Saved{" "}
                      {new Date(fav.savedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-2.5 sm:p-4">
                  {/* Title */}
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white line-clamp-2 mb-1.5 leading-snug">
                    {fav.title}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mb-2">
                    <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0 text-blue-400" />
                    <span className="text-[10px] sm:text-xs truncate">
                      {fav.locality}, {fav.city.name}
                    </span>
                  </div>

                  {/* Specs chips */}
                  <div className="flex items-center gap-1.5 flex-wrap mb-2.5">
                    {fav.bedrooms && (
                      <span className="flex items-center gap-0.5 text-[10px] text-gray-500 dark:text-gray-400">
                        <Bed className="w-2.5 h-2.5" />
                        {fav.bedrooms}
                      </span>
                    )}
                    {fav.bathrooms && (
                      <span className="flex items-center gap-0.5 text-[10px] text-gray-500 dark:text-gray-400">
                        <Bath className="w-2.5 h-2.5" />
                        {fav.bathrooms}
                      </span>
                    )}
                    {fav.squareFeet && (
                      <span className="flex items-center gap-0.5 text-[10px] text-gray-500 dark:text-gray-400">
                        <Square className="w-2.5 h-2.5" />
                        {fav.squareFeet.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="text-sm sm:text-lg font-black text-blue-600 dark:text-blue-400 leading-none">
                      ₹{Number(fav.price).toLocaleString("en-IN")}
                    </div>
                    <Link
                      to={`/property-detail/${fav.slug}`}
                      className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl text-[10px] sm:text-xs font-bold transition-colors flex-shrink-0"
                    >
                      <Eye className="w-3 h-3" />
                      <span className="hidden sm:inline">View</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-12 sm:py-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm px-4">
            <div className="w-14 h-14 sm:w-20 sm:h-20 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-7 h-7 sm:w-10 sm:h-10 text-red-400" />
            </div>
            <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
              No Saved Properties Yet
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
              Start exploring and tap the heart icon on any property to save it
              here.
            </p>
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 sm:px-8 sm:py-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm shadow-blue-200"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Browse Properties
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};
