/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  Search,
  Filter,
  MapPin,
  Bed,
  Bath,
  Square,
  Trash2,
  Share2,
  Eye,
  ArrowLeft,
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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("savedAt");

  const {
    data: favoritesData,
    isLoading,
    refetch,
  } = useGetFavoritePropertiesQuery({ page: 1, limit: 50 });
  const navigate = useNavigate();
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();

  const favoriteProperties = favoritesData?.data || [];

  // Filter and sort favorites
  const filteredFavorites = favoriteProperties
    .filter(
      (fav) =>
        fav.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fav.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fav.locality.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return parseFloat(a.price) - parseFloat(b.price);
        case "price-high":
          return parseFloat(b.price) - parseFloat(a.price);
        case "savedAt":
        default:
          return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
      }
    });

  const handleRemoveFavorite = async (propertyId: string) => {
    try {
      await removeFromFavorites({ propertyId }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to remove from favorites:", error);
    }
  };

  if (!user) {
    navigate("/signin");
    return null;
  }
  const handleShowFavorites = () => {
    // Navigate to favorites page or show favorites modal
    navigate("/saved-properties");
  };

  const handleShowAppointments = () => {
    // Navigate to appointments page
    navigate("/appointments");
  };
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <PublicHeader
        onShowFavorites={handleShowFavorites}
        onShowAppointments={handleShowAppointments}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="p-2 hover:bg-gray-200 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-4xl font-black text-gray-900">
                Saved Properties
              </h1>
              <p className="text-gray-600 mt-2">
                Your personalized collection of favorite properties
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-bold">
              {favoriteProperties.length} Properties
            </span>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search saved properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            {/* Sort */}
            <div className="flex gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold"
              >
                <option value="savedAt">Recently Saved</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg p-6 animate-pulse"
              >
                <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : filteredFavorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFavorites.map((fav) => (
              <div
                key={fav.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                {/* Property Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={fav.coverImage || "/default-property.jpg"}
                    alt={fav.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => handleRemoveFavorite(fav.id)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-blue-500 hover:text-white transition-all">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-bold">
                    Saved {new Date(fav.savedAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {fav.title}
                  </h3>

                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">
                      {fav.locality}, {fav.city}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    {fav.bedrooms && (
                      <div className="flex items-center gap-1">
                        <Bed className="w-4 h-4" />
                        <span>{fav.bedrooms} beds</span>
                      </div>
                    )}
                    {fav.bathrooms && (
                      <div className="flex items-center gap-1">
                        <Bath className="w-4 h-4" />
                        <span>{fav.bathrooms} baths</span>
                      </div>
                    )}
                    {fav.squareFeet && (
                      <div className="flex items-center gap-1">
                        <Square className="w-4 h-4" />
                        <span>{fav.squareFeet.toLocaleString()} sq ft</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-black text-blue-600">
                      ${fav.price.toLocaleString()}
                    </div>
                    <Link
                      to={`/properties/${fav.id}`}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors font-bold"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              No Saved Properties Yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start exploring properties and save your favorites to easily
              access them later.
            </p>
            <Link
              to="/properties"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all inline-flex items-center gap-3"
            >
              <Search className="w-5 h-5" />
              Browse Properties
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};
