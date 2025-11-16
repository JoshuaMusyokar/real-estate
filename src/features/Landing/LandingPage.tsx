/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ArrowRight,
  Filter,
  Home,
  Search,
  X,
  Building2,
  Sparkles,
  TrendingUp,
  Shield,
  Users,
  Award,
  MapPin,
  ChevronRight,
  Bath,
  Bed,
  Check,
  Eye,
  Heart,
  Share2,
  Square,
  Menu,
  Star,
  Clock,
  ChevronDown,
  Zap,
  Phone,
  Mail,
} from "lucide-react";
import { useEffect, useState } from "react";
import { FilterPanel } from "./FilterPanel";
import { LandingPropertyCard } from "./LandingPropertyCard";
import {
  type PropertySearchFilters,
  type PropertySubType,
  type PropertyType,
} from "../../types";
import {
  useGetUserFavoritesQuery,
  useSearchPropertiesQuery,
} from "../../services/propertyApi";
import { Link, useNavigate } from "react-router-dom";
import { PublicHeader } from "../../layout/PublicHeader";
import { useAuth } from "../../hooks/useAuth";
import { Footer } from "../../layout/Footer";

// Import types and hooks from parent context
// These will be available through the React component props
export const PropertyLandingPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<PropertySearchFilters>({});
  const [searchInput, setSearchInput] = useState("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [favPropertiesIds, setFavPropertiesIds] = useState<string[]>([]);
  const { isAuthenticated } = useAuth();
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
    // Navigate to favorites page or show favorites modal
    navigate("/saved-properties");
  };

  const handleShowAppointments = () => {
    // Navigate to appointments page
    navigate("/appointments");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Premium Navigation Bar with Glass Morphism */}
      <PublicHeader
        theme="vibrant"
        onShowFavorites={handleShowFavorites}
        onShowAppointments={handleShowAppointments}
      />

      {/* Hero Section with Advanced Animations */}
      <section className="relative pt-32 pb-4 overflow-hidden">
        {/* Animated Gradient Mesh Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
            <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
            <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400 to-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
          </div>
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            {/* Floating Badge with Pulse Animation */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-2xl shadow-blue-500/20 mb-8 border border-blue-100 animate-fade-in hover:scale-105 transition-transform duration-300">
              <div className="relative">
                <Sparkles className="w-4 h-4 text-yellow-500 animate-spin-slow" />
                <span className="absolute inset-0 animate-ping">
                  <Sparkles className="w-4 h-4 text-yellow-500 opacity-75" />
                </span>
              </div>
              <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                #1 Trusted Real Estate Platform in 2025
              </span>
            </div>

            {/* Main Headline with Gradient Animation */}
            {/* <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-[1.1] animate-slide-up">
              <span className="block bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-2">
                Discover Your Perfect
              </span>
              <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                Dream Home Today
              </span>
            </h1> */}

            <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed animate-fade-in-delay font-medium">
              Explore{" "}
              <span className="text-blue-600 font-bold">
                exclusive properties
              </span>{" "}
              curated by top real estate experts. Find luxury homes, modern
              apartments, and prime investment opportunities.
            </p>

            {/* Premium Search Bar with Enhanced Styling */}
            <div className="max-w-5xl mx-auto mb-4 animate-slide-up-delay">
              <div className="bg-white rounded-3xl shadow-2xl shadow-blue-900/10 p-3 sm:p-4 flex flex-col lg:flex-row gap-3 border-2 border-gray-100 hover:border-blue-200 hover:shadow-3xl transition-all duration-500 group">
                <div className="flex-1 relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="City, neighborhood, or property type..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="w-full pl-14 pr-4 py-4 text-gray-900 placeholder-gray-400 focus:outline-none rounded-2xl font-semibold text-lg bg-gray-50/50 focus:bg-white transition-all"
                  />
                </div>
                <button
                  onClick={() => setShowFilterPanel(true)}
                  className="relative px-6 py-4 bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 rounded-2xl transition-all text-gray-700 font-bold flex items-center justify-center gap-2 hover:scale-105 hover:shadow-lg"
                >
                  <Filter className="w-5 h-5" />
                  <span className="hidden sm:inline">Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-[28px] h-7 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-black px-2 shadow-lg animate-bounce">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={handleSearch}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl font-black hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                >
                  <span>Search Now</span>
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Quick Filter Pills with Enhanced Design */}
              <div className="flex flex-wrap gap-3 mt-2 justify-center">
                {[
                  {
                    label: "🏰 Luxury Villas",
                    value: { propertyType: "RESIDENTIAL", subType: "VILLA" },
                  },
                  {
                    label: "🏢 Modern Apartments",
                    value: {
                      propertyType: "RESIDENTIAL",
                      subType: "APARTMENT",
                    },
                  },
                  {
                    label: "🏪 Commercial",
                    value: { propertyType: "COMMERCIAL" },
                  },
                  { label: "🌳 Land Plots", value: { propertyType: "LAND" } },
                ].map((item) => (
                  <button
                    key={item.label}
                    // onClick={() => setFilters({ ...filters, ...item.value })}
                    onClick={() =>
                      setFilters({
                        ...filters,
                        propertyType: item.value.propertyType as PropertyType,
                        subType: item.value.subType as PropertySubType,
                      })
                    }
                    className="px-6 py-3 bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:border-blue-400 rounded-2xl text-sm font-bold hover:bg-white hover:shadow-xl hover:scale-110 transition-all duration-300 text-gray-700 hover:text-blue-600"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600 animate-fade-in-delay-2">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span className="font-semibold">Verified Listings</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                <span className="font-semibold">Secure Transactions</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold">Instant Booking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Properties Listing */}
      <section
        id="properties"
        className="py-6 bg-gradient-to-br from-gray-50 via-white to-blue-50"
      >
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header with Enhanced Typography */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12 gap-6">
            <div className="space-y-2">
              <h2 className="text-1xl lg:text-2xl font-black text-gray-900">
                {isLoading ? (
                  <span className="animate-pulse bg-gradient-to-r from-gray-300 to-gray-400 bg-clip-text text-transparent">
                    Loading Properties...
                  </span>
                ) : (
                  <>
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {properties.length}
                    </span>
                    <span className="text-gray-900"> Exclusive Properties</span>
                  </>
                )}
              </h2>
            </div>

            {/* Enhanced Sort Dropdown */}
            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-2xl shadow-lg border-2 border-gray-100 hover:border-blue-200 transition-all">
              <span className="text-sm text-gray-600 font-bold hidden sm:inline">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2 py-2 border-0 focus:ring-2 focus:ring-blue-500 bg-transparent font-bold text-gray-900 cursor-pointer appearance-none pr-8 focus:outline-none"
              >
                <option value="featured">⭐ Featured First</option>
                <option value="price">💰 Price: Low to High</option>
                <option value="price">💎 Price: High to Low</option>
                <option value="createdAt">🆕 Newest First</option>
                <option value="viewCount">👁️ Most Viewed</option>
              </select>
              <ChevronDown className="w-5 h-5 text-gray-400 -ml-6 pointer-events-none" />
            </div>
          </div>

          {/* Active Filters Display with Enhanced Design */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-3 mb-10 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 shadow-lg animate-slide-down">
              <span className="text-sm font-black text-blue-900 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Active Filters:
              </span>
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null;
                const label = Array.isArray(value)
                  ? `${key}: ${value.join(", ")}`
                  : `${key}: ${value}`;
                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-700 rounded-xl text-sm font-bold border-2 border-blue-300 hover:border-blue-400 hover:shadow-md transition-all group"
                  >
                    {label}
                    <button
                      onClick={() => {
                        const newFilters = { ...filters };
                        delete newFilters[key as keyof PropertySearchFilters];
                        setFilters(newFilters);
                      }}
                      className="hover:bg-blue-100 rounded-full p-1 transition-all group-hover:rotate-90"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                );
              })}
              <button
                onClick={() => setFilters({})}
                className="ml-auto text-sm text-red-600 hover:text-red-700 font-black hover:underline transition-all flex items-center gap-1 hover:scale-105"
              >
                <X className="w-4 h-4" />
                Clear All
              </button>
            </div>
          )}

          {/* Properties Grid with Enhanced Cards */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl border-2 border-gray-200 overflow-hidden shadow-xl animate-pulse"
                >
                  <div className="h-80 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
                  <div className="p-7 space-y-4">
                    <div className="h-7 bg-gray-200 rounded-xl w-3/4 animate-shimmer" />
                    <div className="h-5 bg-gray-200 rounded-lg w-1/2 animate-shimmer" />
                    <div className="h-12 bg-gray-200 rounded-xl w-2/5 animate-shimmer" />
                  </div>
                </div>
              ))}
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {properties.map((property, index) => (
                <LandingPropertyCard
                  key={property.id}
                  property={property}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                  favProperties={favPropertiesIds}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-28 bg-white rounded-3xl border-2 border-dashed border-gray-300 shadow-2xl animate-fade-in">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Home className="w-16 h-16 text-gray-400" />
              </div>
              <h3 className="text-4xl font-black text-gray-900 mb-4">
                No Properties Found
              </h3>
              <p className="text-gray-600 mb-10 text-xl font-medium max-w-md mx-auto">
                Try adjusting your filters or search criteria to discover more
                properties
              </p>
              <button
                onClick={() => {
                  setFilters({});
                  setSearchInput("");
                }}
                className="px-10 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl hover:shadow-2xl hover:scale-105 transition-all font-black inline-flex items-center gap-3 text-lg"
              >
                Reset All Filters
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Premium Stats Section with Animated Counters */}
      <section className="relative py-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />

        <div className="relative max-w-7xl mx-auto px-2 sm:px-3 lg:px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: TrendingUp,
                value: properties.length || "15K",
                label: "Active Listings",
                suffix: "+",
              },
              { icon: Users, value: "8K", label: "Happy Clients", suffix: "+" },
              {
                icon: MapPin,
                value: "200",
                label: "Cities Covered",
                suffix: "+",
              },
              {
                icon: Award,
                value: "$2.5B",
                label: "Properties Sold",
                suffix: "+",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center group hover:scale-110 transition-transform duration-500 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 group-hover:bg-white/30 transition-all group-hover:rotate-6">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-5xl lg:text-6xl font-black text-white mb-2 tracking-tight">
                  {stat.value}
                  {stat.suffix}
                </div>
                <div className="text-sm lg:text-base text-blue-100 font-bold uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section with Card Hover Effects */}
      <section
        id="how-it-works"
        className="py-24 bg-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block mb-4">
              <span className="px-5 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-black uppercase tracking-wider">
                Why Choose Us
              </span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6">
              The Bengal Property
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Advantage
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
              Experience the future of real estate with cutting-edge technology
              and personalized service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "100% Verified Listings",
                description:
                  "Every property undergoes rigorous verification by our expert team to ensure authenticity, quality, and legal compliance",
                gradient: "from-blue-500 to-cyan-500",
                bg: "from-blue-50 to-cyan-50",
              },
              {
                icon: TrendingUp,
                title: "Exclusive Deals",
                description:
                  "Access pre-market properties and competitive pricing that you won't find anywhere else in the market",
                gradient: "from-purple-500 to-pink-500",
                bg: "from-purple-50 to-pink-50",
              },
              {
                icon: Users,
                title: "24/7 Expert Support",
                description:
                  "Dedicated support from licensed real estate professionals ready to assist you at every step of your journey",
                gradient: "from-green-500 to-emerald-500",
                bg: "from-green-50 to-emerald-50",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`relative group p-8 bg-gradient-to-br ${feature.bg} rounded-3xl border-2 border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-500 overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative">
                  <div
                    className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                  >
                    <feature.icon className="w-10 h-10 text-white" />
                  </div>

                  <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed font-medium">
                    {feature.description}
                  </p>

                  <div
                    className={`absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br ${feature.gradient} rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Parallax Effect */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />

        {/* Animated Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float-delayed" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-8 border border-white/30">
            <Clock className="w-4 h-4 text-white" />
            <span className="text-sm font-bold text-white">
              Limited Time Offer
            </span>
          </div>

          <h2 className="text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Ready to Find Your
            <span className="block">Dream Property?</span>
          </h2>

          <p className="text-xl lg:text-2xl text-blue-100 mb-12 max-w-2xl mx-auto font-semibold">
            Join <span className="text-white font-black">10,000+</span>{" "}
            satisfied clients who found their perfect home with us
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              to="/signup"
              className="group px-10 py-5 bg-white text-blue-600 rounded-2xl font-black hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center justify-center gap-3 text-lg"
            >
              Get Started Free
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link
              to="/properties"
              className="px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-2xl font-black hover:bg-white/20 transition-all inline-flex items-center justify-center gap-3 text-lg"
            >
              <Search className="w-5 h-5" />
              Browse Properties
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span className="font-semibold">No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <span className="font-semibold">Instant Access</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Panel Modal */}
      {showFilterPanel && (
        <FilterPanel
          filters={filters}
          setFilters={setFilters}
          onClose={() => setShowFilterPanel(false)}
        />
      )}

      {/* Footer Section */}
      <Footer />
      {/* Custom CSS for Advanced Animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in 0.6s ease-out 0.2s both;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in 0.6s ease-out 0.4s both;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        
        .animate-slide-up-delay {
          animation: slide-up 0.8s ease-out 0.3s both;
        }

        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out both;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 3s ease-in-out infinite 1.5s;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};
