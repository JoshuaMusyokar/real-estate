import {
  Search,
  MapPin,
  Home,
  TrendingUp,
  Users,
  Filter,
  X,
  CheckCircle2,
  Shield,
  Zap,
  ArrowRight,
  Check,
  Sparkles,
  DollarSign,
  Clock,
  BarChart3,
  Lightbulb,
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
import { Template3PropertyCard } from "./Template3PropertyCard";

export const Template3PropertyLanding = () => {
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
    (key) => filters[key as keyof PropertySearchFilters] !== undefined
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
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <PublicHeader
        theme="dark"
        onShowFavorites={handleShowFavorites}
        onShowAppointments={handleShowAppointments}
      />

      {/* Hero Section - Redfin Dark Style */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, rgba(239, 68, 68, 0.15) 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Red Glow Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />

        <div className="relative max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-2 py-1 bg-red-600/20 backdrop-blur-sm border border-red-500/30 rounded-full mb-2">
              <Sparkles className="w-4 h-4 text-red-400" />
              <span className="text-sm font-bold text-red-400 uppercase tracking-wide">
                Data-Driven Real Estate
              </span>
            </div>

            {/* Main Headline */}
            {/* <h3 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
              <span className="text-white">Buy or sell with</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-red-700">
                confidence
              </span>
            </h3> */}

            <p className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Get accurate home valuations, market insights, and expert
              guidance.
              <span className="block mt-2 text-red-400 font-semibold">
                Save thousands with our low commission rates.
              </span>
            </p>

            {/* Search Bar - Dark Theme */}
            <div className="max-w-4xl mx-auto mb-3">
              <div className="bg-slate-800 rounded-2xl shadow-2xl shadow-red-900/20 p-3 border border-slate-700 hover:border-red-500/50 transition-all">
                <div className="flex flex-col lg:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Address, City, ZIP, or Neighborhood"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      className="w-full pl-12 pr-4 py-4 text-white placeholder-slate-500 focus:outline-none rounded-xl bg-slate-700/50 border border-slate-600 focus:border-red-500 transition-all font-medium"
                    />
                  </div>
                  <button
                    onClick={() => setShowFilterPanel(true)}
                    className="relative px-6 py-4 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-xl transition-all text-white font-bold flex items-center justify-center gap-2"
                  >
                    <Filter className="w-5 h-5" />
                    <span className="hidden sm:inline">Filters</span>
                    {activeFilterCount > 0 && (
                      <span className="absolute -top-2 -right-2 min-w-[24px] h-6 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold px-2">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={handleSearch}
                    className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-900/50 flex items-center justify-center gap-2"
                  >
                    <span>Search</span>
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-3 mt-6 justify-center">
                {[
                  {
                    label: "Houses",
                    value: { propertyType: "RESIDENTIAL", subType: "HOUSE" },
                  },
                  {
                    label: "Condos",
                    value: {
                      propertyType: "RESIDENTIAL",
                      subType: "APARTMENT",
                    },
                  },
                  {
                    label: "Townhomes",
                    value: {
                      propertyType: "RESIDENTIAL",
                      subType: "TOWNHOUSE",
                    },
                  },
                  { label: "Land", value: { propertyType: "LAND" } },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() =>
                      setFilters({
                        ...filters,
                        propertyType: item.value.propertyType,
                        subType: item.value.subType,
                      })
                    }
                    className="px-5 py-2.5 bg-slate-800/80 backdrop-blur-sm border border-slate-700 hover:border-red-500 rounded-lg text-sm font-bold hover:bg-slate-700 transition-all text-white"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="font-semibold">Accurate Data</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <span className="font-semibold">Save on Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-500" />
                <span className="font-semibold">Market Insights</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Properties */}
      <section className="py-8 bg-slate-900" id="properties">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                {isLoading ? (
                  <span className="animate-pulse">Loading Properties...</span>
                ) : (
                  <>
                    <span className="text-red-500">{properties.length}</span>
                    <span> Homes Available</span>
                  </>
                )}
              </h2>
              <p className="text-slate-400 font-medium flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Updated in real-time
              </p>
            </div>

            {/* Sort Dropdown - Dark Theme */}
            <div className="flex items-center gap-3 bg-slate-800 px-4 py-3 rounded-xl border border-slate-700">
              <span className="text-sm text-slate-400 font-semibold hidden sm:inline">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white font-semibold cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price">Price (Low to High)</option>
                <option value="price">Price (High to Low)</option>
                <option value="createdAt">Newest First</option>
                <option value="viewCount">Most Viewed</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-3 mb-8 p-4 bg-slate-800/80 rounded-xl border border-slate-700">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-red-500" />
                Active Filters:
              </span>
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null;
                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-700 text-white rounded-lg text-sm font-semibold border border-slate-600 hover:border-red-500 transition-all"
                  >
                    {key}:{" "}
                    {Array.isArray(value) ? value.join(", ") : String(value)}
                    <button
                      onClick={() => {
                        const newFilters = { ...filters };
                        delete newFilters[key as keyof PropertySearchFilters];
                        setFilters(newFilters);
                      }}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                );
              })}
              <button
                onClick={() => setFilters({})}
                className="ml-auto text-sm text-red-500 hover:text-red-400 font-bold transition-colors flex items-center gap-1"
              >
                <X className="w-4 h-4" />
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
                  className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden animate-pulse"
                >
                  <div className="h-64 bg-slate-700" />
                  <div className="p-5 space-y-4">
                    <div className="h-8 bg-slate-700 rounded w-1/2" />
                    <div className="h-6 bg-slate-700 rounded w-3/4" />
                    <div className="h-6 bg-slate-700 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {properties.map((property) => (
                <Template3PropertyCard
                  key={property.id}
                  property={property}
                  favProperties={favPropertiesIds}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-800 rounded-2xl border border-slate-700">
              <Home className="w-20 h-20 text-slate-700 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                No Properties Found
              </h3>
              <p className="text-slate-400 mb-6 text-lg">
                Try adjusting your search criteria
              </p>
              <button
                onClick={() => {
                  setFilters({});
                  setSearchInput("");
                }}
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all shadow-lg"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </section>
      {/* Stats Section - Dark Theme */}
      <section className="py-8 bg-slate-800/50 border-y border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Home,
                value: properties.length || "15K+",
                label: "Properties Listed",
                color: "text-red-500",
              },
              {
                icon: Users,
                value: "8K+",
                label: "Happy Customers",
                color: "text-green-500",
              },
              {
                icon: MapPin,
                value: "200+",
                label: "Cities Covered",
                color: "text-blue-500",
              },
              {
                icon: TrendingUp,
                value: "$2.5B+",
                label: "In Sales",
                color: "text-purple-500",
              },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <stat.icon className={`w-10 h-10 mx-auto mb-3 ${stat.color}`} />
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Dark Theme */}
      <section className="py-16 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Technology-powered service that saves you time and money
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: DollarSign,
                title: "Save Thousands",
                description:
                  "Lower fees mean more money in your pocket. Get full service for less.",
                color: "from-green-500 to-emerald-600",
              },
              {
                icon: BarChart3,
                title: "Data You Can Trust",
                description:
                  "Accurate valuations powered by real-time market data and AI.",
                color: "from-blue-500 to-cyan-600",
              },
              {
                icon: Lightbulb,
                title: "Expert Guidance",
                description:
                  "Top-rated agents who know your market inside and out.",
                color: "from-purple-500 to-pink-600",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-slate-800 p-8 rounded-xl border border-slate-700 hover:border-red-500 transition-all group"
              >
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Dark with Red Accent */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-red-900/20 to-slate-900 border-y border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-500/30 rounded-full mb-6">
            <Clock className="w-4 h-4 text-red-400" />
            <span className="text-sm font-bold text-red-400">
              Limited Time Offer
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Make Your Move?
          </h2>
          <p className="text-xl text-slate-300 mb-10">
            Join <span className="text-red-400 font-bold">10,000+</span>{" "}
            homeowners who saved with us
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-10 py-5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all shadow-2xl shadow-red-900/50 inline-flex items-center justify-center gap-3"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#properties"
              className="px-10 py-5 bg-slate-800 border-2 border-slate-700 text-white rounded-xl font-bold hover:border-red-500 transition-all inline-flex items-center justify-center gap-3"
            >
              <Search className="w-5 h-5" />
              Browse Homes
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-slate-400">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span className="font-semibold">No Hidden Fees</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="font-semibold">Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-500" />
              <span className="font-semibold">Quick & Easy</span>
            </div>
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
