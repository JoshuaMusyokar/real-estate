import {
  Search,
  Home,
  Building2,
  TrendingUp,
  Users,
  Filter,
  X,
  Shield,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useGetUserFavoritesQuery,
  useSearchPropertiesQuery,
} from "../../services/propertyApi";
import { useAuth } from "../../hooks/useAuth";
import type { PropertySearchFilters } from "../../types";
import { PublicHeader } from "../../layout/PublicHeader";
import { Footer } from "../../layout/Footer";
import { FilterPanel } from "./FilterPanel";
import { Template2PropertyCard } from "./Template2PropertyCard";
export const Template2PropertyLanding = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [filters, setFilters] = useState<PropertySearchFilters>({});
  const [searchInput, setSearchInput] = useState("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [favPropertiesIds, setFavPropertiesIds] = useState<string[]>([]);

  const { data: favouriteData, refetch } = useGetUserFavoritesQuery(undefined, {
    skip: !isAuthenticated,
  });

  const { data, isLoading } = useSearchPropertiesQuery({
    ...filters,
    search: searchInput,
    sortBy: sortBy,
    sortOrder: "desc",
    status: "AVAILABLE",
  });

  useEffect(() => {
    if (isAuthenticated) refetch();
  }, [isAuthenticated, refetch]);

  useEffect(() => {
    if (isAuthenticated && favouriteData && favouriteData.data) {
      setFavPropertiesIds(favouriteData.data);
    }
  }, [favouriteData, isAuthenticated]);

  const properties = data?.data || [];
  const activeFilterCount = Object.keys(filters).filter(
    (key) => filters[key as keyof PropertySearchFilters] !== undefined,
  ).length;

  const handleSearch = () => {
    // Search is reactive through useSearchPropertiesQuery
  };

  const handleShowFavorites = () => {
    navigate("/saved-properties");
  };

  const handleShowAppointments = () => {
    navigate("/appointments");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <PublicHeader
        theme="clean"
        onShowFavorites={handleShowFavorites}
        onShowAppointments={handleShowAppointments}
      />

      {/* Hero Section - Clean Zillow Style */}
      <section className="relative pt-24 pb-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Agents. Tours. Loans. Homes.
            </h3>
            <p className="text-xl text-gray-600 mb-8">
              Find it all here. Get started with Property4India.com.
            </p>

            {/* Search Bar - Zillow Style */}
            <div className="bg-white rounded-lg shadow-lg p-2 flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter an address, neighborhood, city, or ZIP code"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-12 pr-4 py-3 text-gray-900 focus:outline-none rounded-md"
                />
              </div>
              <button
                onClick={() => setShowFilterPanel(true)}
                className="relative px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-md transition-all font-semibold text-gray-700 flex items-center justify-center gap-2"
              >
                <Filter className="w-5 h-5" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <button
                onClick={handleSearch}
                className="px-8 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-all"
              >
                Search
              </button>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              {[
                { label: "Buy", icon: Home },
                { label: "Rent", icon: Building2 },
                { label: "Sell", icon: TrendingUp },
                { label: "Home Loans", icon: Shield },
              ].map((item) => (
                <button
                  key={item.label}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full hover:border-blue-600 hover:text-blue-600 transition-all font-medium text-gray-700"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Properties */}
      <section className="py-8" id="properties">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isLoading ? "Loading..." : `${properties.length} Homes`}
              </h2>
              <p className="text-gray-600">Find your perfect property</p>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="featured">Featured</option>
              <option value="price">Price (Low to High)</option>
              <option value="price">Price (High to Low)</option>
              <option value="createdAt">Newest</option>
              <option value="viewCount">Most Viewed</option>
            </select>
          </div>

          {/* Active Filters */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6 p-4 bg-blue-50 rounded-lg">
              <span className="text-sm font-semibold text-gray-700">
                Active Filters:
              </span>
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null;
                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-300 rounded-full text-sm"
                  >
                    {key}:{" "}
                    {Array.isArray(value) ? value.join(", ") : String(value)}
                    <button
                      onClick={() => {
                        const newFilters = { ...filters };
                        delete newFilters[key as keyof PropertySearchFilters];
                        setFilters(newFilters);
                      }}
                      className="hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
              <button
                onClick={() => setFilters({})}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold ml-auto"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Properties Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse"
                >
                  <div className="h-56 bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {properties.map((property) => (
                <Template2PropertyCard
                  key={property.id}
                  property={property}
                  favProperties={favPropertiesIds}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No Properties Found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filters
              </p>
              <button
                onClick={() => {
                  setFilters({});
                  setSearchInput("");
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-all"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-8 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: properties.length || "15K+", label: "Active Listings" },
              { value: "8K+", label: "Happy Clients" },
              { value: "200+", label: "Cities" },
              { value: "$2.5B+", label: "Properties Sold" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Property4India.com
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We make finding your dream home easier than ever
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Verified Listings",
                description: "All properties are verified and quality checked",
              },
              {
                icon: Users,
                title: "Expert Agents",
                description: "Work with experienced real estate professionals",
              },
              {
                icon: Zap,
                title: "Fast & Easy",
                description: "Simple process from search to closing",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-lg border border-gray-200"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join thousands of happy homeowners who found their perfect property
            with us
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-4 bg-white text-blue-600 rounded-md font-bold hover:bg-gray-100 transition-all"
            >
              Get Started Free
            </Link>
            <a
              href="#properties"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-md font-bold hover:bg-white hover:text-blue-600 transition-all"
            >
              Browse Properties
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Filter Panel Modal */}
      {showFilterPanel && (
        <FilterPanel
          filters={filters}
          setFilters={setFilters}
          onClose={() => setShowFilterPanel(false)}
        />
      )}
    </div>
  );
};
