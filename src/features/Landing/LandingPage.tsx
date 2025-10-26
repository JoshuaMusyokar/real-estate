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
} from "lucide-react";
import { FilterPanel } from "./FilterPanel";
import { LandingPropertyCard } from "./LandingPropertyCard";
import {
  type PropertySearchFilters,
  type PropertySubType,
  type PropertyType,
} from "../../types";
import { useSearchPropertiesQuery } from "../../services/propertyApi";
import { useState } from "react";
import { Link } from "react-router";

export const PropertyLandingPage: React.FC = () => {
  const [filters, setFilters] = useState<PropertySearchFilters>({});
  const [searchInput, setSearchInput] = useState("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [sortBy, setSortBy] = useState("featured");

  const { data, isLoading } = useSearchPropertiesQuery({
    ...filters,
    search: searchInput,
    sortBy: sortBy,
    sortOrder: "desc",
    status: "AVAILABLE",
  });

  const properties = data?.data || [];
  const activeFilterCount = Object.keys(filters).filter(
    (key) => filters[key as keyof PropertySearchFilters] !== undefined
  ).length;

  const handleSearch = () => {
    // Search is reactive through useSearchPropertiesQuery
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Premium Navigation Bar */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Bengal Property
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#properties"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Properties
              </a>
              <a
                href="#how-it-works"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                How It Works
              </a>
              <a
                href="#about"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                About
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Contact
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link
                to="/signin"
                className="px-5 py-2.5 text-gray-700 font-semibold hover:bg-gray-100 rounded-xl transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Animated Background */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
            <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
            <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg mb-8 border border-gray-100 animate-fade-in">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-semibold text-gray-700">
                #1 Premium Real Estate Platform
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-slide-up">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Discover Your Perfect
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Dream Home
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-delay">
              Explore exclusive properties curated by top real estate experts.
              Find luxury homes, modern apartments, and investment opportunities
              in prime locations.
            </p>

            {/* Premium Search Bar */}
            <div className="max-w-4xl mx-auto mb-8 animate-slide-up-delay">
              <div className="bg-white rounded-2xl shadow-2xl p-3 flex flex-col sm:flex-row gap-3 border border-gray-100 hover:shadow-3xl transition-shadow">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter location, property type, or keyword..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="w-full pl-12 pr-4 py-4 text-gray-900 placeholder-gray-400 focus:outline-none rounded-xl font-medium"
                  />
                </div>
                <button
                  onClick={() => setShowFilterPanel(true)}
                  className="relative px-6 py-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all text-gray-700 font-semibold flex items-center gap-2"
                >
                  <Filter className="w-5 h-5" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={handleSearch}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                >
                  Search
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-3 mt-6 justify-center">
                {[
                  {
                    label: "Luxury Villas",
                    value: { propertyType: "RESIDENTIAL", subType: "VILLA" },
                  },
                  {
                    label: "Modern Apartments",
                    value: {
                      propertyType: "RESIDENTIAL",
                      subType: "APARTMENT",
                    },
                  },
                  {
                    label: "Commercial",
                    value: { propertyType: "COMMERCIAL" },
                  },
                  { label: "Land Plots", value: { propertyType: "LAND" } },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() =>
                      setFilters({
                        ...filters,
                        propertyType: item.value.propertyType as PropertyType,
                        subType: item.value.subType as PropertySubType,
                      })
                    }
                    className="px-5 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-sm font-semibold hover:bg-white hover:shadow-md hover:scale-105 transition-all text-gray-700"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Stats Section */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-3 opacity-90" />
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {properties.length || "15K"}+
              </div>
              <div className="text-sm text-blue-100 font-medium">
                Active Listings
              </div>
            </div>
            <div className="text-center">
              <Users className="w-8 h-8 mx-auto mb-3 opacity-90" />
              <div className="text-4xl md:text-5xl font-bold mb-2">8K+</div>
              <div className="text-sm text-blue-100 font-medium">
                Happy Clients
              </div>
            </div>
            <div className="text-center">
              <MapPin className="w-8 h-8 mx-auto mb-3 opacity-90" />
              <div className="text-4xl md:text-5xl font-bold mb-2">200+</div>
              <div className="text-sm text-blue-100 font-medium">
                Cities Covered
              </div>
            </div>
            <div className="text-center">
              <Award className="w-8 h-8 mx-auto mb-3 opacity-90" />
              <div className="text-4xl md:text-5xl font-bold mb-2">$2.5B+</div>
              <div className="text-sm text-blue-100 font-medium">
                Properties Sold
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Properties Listing */}
      <section
        id="properties"
        className="py-20 bg-gradient-to-br from-gray-50 to-blue-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                {isLoading ? (
                  <span className="animate-pulse">Loading Properties...</span>
                ) : (
                  `${properties.length} Exclusive Properties`
                )}
              </h2>
              <p className="text-gray-600 font-medium">
                Handpicked selections just for you
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 font-medium">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium transition-all shadow-sm hover:shadow-md"
              >
                <option value="featured">Featured First</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="-createdAt">Newest First</option>
                <option value="viewCount">Most Viewed</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-3 mb-8 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
              <span className="text-sm font-semibold text-gray-700">
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
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-xl text-sm font-semibold border border-blue-200 hover:border-blue-300 transition-all"
                  >
                    {label}
                    <button
                      onClick={() => {
                        const newFilters = { ...filters };
                        delete newFilters[key as keyof PropertySearchFilters];
                        setFilters(newFilters);
                      }}
                      className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                );
              })}
              <button
                onClick={() => setFilters({})}
                className="text-sm text-red-600 hover:text-red-700 font-semibold underline hover:no-underline transition-all"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Properties Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg animate-pulse"
                >
                  <div className="h-72 bg-gradient-to-br from-gray-200 to-gray-300" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-200 rounded-lg w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-10 bg-gray-200 rounded-lg w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <LandingPropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-300 shadow-lg">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Home className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                No Properties Found
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                Try adjusting your filters or search criteria
              </p>
              <button
                onClick={() => {
                  setFilters({});
                  setSearchInput("");
                }}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all font-semibold inline-flex items-center gap-2"
              >
                Reset All Filters
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Bengal Property?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of real estate with our premium platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Verified Listings
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Every property is thoroughly verified by our expert team to
                ensure authenticity and quality
              </p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Best Deals
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Access exclusive properties and competitive pricing unavailable
                elsewhere
              </p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Expert Support
              </h3>
              <p className="text-gray-600 leading-relaxed">
                24/7 dedicated support from experienced real estate
                professionals
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join thousands of satisfied clients who found their perfect home
            with us
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/properties"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-xl font-bold hover:bg-white/20 transition-all inline-flex items-center justify-center gap-2"
            >
              Browse Properties
            </Link>
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

      {/* Custom CSS for animations */}
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
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in 0.6s ease-out 0.2s both;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        
        .animate-slide-up-delay {
          animation: slide-up 0.8s ease-out 0.3s both;
        }
      `}</style>
    </div>
  );
};
