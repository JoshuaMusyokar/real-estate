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
  Play,
  Camera,
  Video,
  Ruler,
  Car,
  TreePine,
  Building,
  LandPlot,
  HomeIcon,
  House,
  Warehouse,
  Store,
  Hotel,
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
import { Template4PropertyCard } from "./Template4PropertyCard";

export const Template4PropertyLanding = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<PropertySearchFilters>({});
  const [searchInput, setSearchInput] = useState("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [favPropertiesIds, setFavPropertiesIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");
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

  // Housing.com style property categories
  const propertyCategories = [
    {
      icon: HomeIcon,
      label: "Apartments",
      count: "12K+",
      description: "Studio, 1, 2, 3 BHK",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: House,
      label: "Villas",
      count: "3K+",
      description: "Luxury & Premium",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Building,
      label: "Builder Floors",
      count: "8K+",
      description: "Independent Floors",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: LandPlot,
      label: "Plots",
      count: "5K+",
      description: "Residential & Commercial",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: Store,
      label: "Shops",
      count: "2K+",
      description: "Retail & Commercial",
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      icon: Warehouse,
      label: "Warehouses",
      count: "1K+",
      description: "Industrial & Storage",
      gradient: "from-gray-600 to-gray-800",
    },
  ];

  const cities = [
    { name: "Kolkata", properties: "15K+", image: "/kolkata-bg.jpg" },
    { name: "Mumbai", properties: "25K+", image: "/mumbai-bg.jpg" },
    { name: "Delhi", properties: "22K+", image: "/delhi-bg.jpg" },
    { name: "Bangalore", properties: "18K+", image: "/bangalore-bg.jpg" },
    { name: "Chennai", properties: "12K+", image: "/chennai-bg.jpg" },
    { name: "Hyderabad", properties: "10K+", image: "/hyderabad-bg.jpg" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Header */}
      <PublicHeader
        onShowFavorites={() => navigate("/saved-properties")}
        onShowAppointments={() => navigate("/appointments")}
      />

      {/* Hero Search Section - Housing.com Style */}
      <section className="relative pt-28 pb-20 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-grid-pattern" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              Find Your Perfect
              <span className="block text-yellow-400">Dream Home</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Discover 50,000+ properties for sale and rent across India
            </p>
          </div>

          {/* Main Search Bar */}
          <div className="bg-white rounded-2xl shadow-2xl p-2 mb-8">
            <div className="flex flex-col lg:flex-row gap-2">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by locality, project, or landmark..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-gray-900 placeholder-gray-500 focus:outline-none rounded-xl font-medium text-lg"
                />
              </div>

              {/* Filters Button */}
              <button
                onClick={() => setShowFilterPanel(true)}
                className="lg:w-48 px-6 py-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all text-gray-700 font-semibold flex items-center justify-center gap-3"
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Search Button */}
              <button
                onClick={() => {}}
                className="lg:w-48 px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-xl font-black hover:shadow-lg transition-all flex items-center justify-center gap-3"
              >
                <Search className="w-5 h-5" />
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "🏠 Buy",
              "🏡 Rent",
              "🏢 Commercial",
              "📈 PG/Hostels",
              "🌳 Plots",
            ].map((item) => (
              <button
                key={item}
                className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all font-semibold"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Property Categories */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
              Explore Property Types
            </h2>
            <p className="text-gray-600 text-lg">
              Find your perfect property from our extensive collection
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {propertyCategories.map((category, index) => (
              <div
                key={category.label}
                className="group bg-white rounded-2xl p-4 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-200"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${category.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-black text-gray-900 mb-2 text-lg">
                  {category.label}
                </h3>
                <div className="text-2xl font-black text-gray-900 mb-1">
                  {category.count}
                </div>
                <p className="text-sm text-gray-500">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-white">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
                Featured Properties
              </h2>
              <p className="text-gray-600 text-lg">
                Handpicked premium properties with great value
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-gray-100 rounded-2xl p-1 mt-4 lg:mt-0">
              {["all", "buy", "rent", "commercial"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-xl font-semibold capitalize transition-all ${
                    activeTab === tab
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-2xl animate-pulse h-96"
                />
              ))}
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {properties.map((property, index) => (
                <Template4PropertyCard
                  key={property.id}
                  property={property}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                  favProperties={favPropertiesIds}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Home className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-black text-gray-900 mb-4">
                No Properties Found
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Try adjusting your search criteria or explore different property
                types
              </p>
              <button
                onClick={() => {
                  setFilters({});
                  setSearchInput("");
                }}
                className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* View All Button */}
          <div className="text-center mt-12">
            <button className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all font-semibold flex items-center gap-2 mx-auto">
              View All Properties
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
              Popular Cities
            </h2>
            <p className="text-gray-600 text-lg">
              Explore properties in top cities across India
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {cities.map((city) => (
              <div
                key={city.name}
                className="group relative h-48 bg-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                {/* City image would go here */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-black mb-1">{city.name}</h3>
                  <p className="text-blue-200 font-semibold">
                    {city.properties} properties
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { number: "50K+", label: "Properties" },
              { number: "200+", label: "Cities" },
              { number: "1M+", label: "Happy Customers" },
              { number: "10K+", label: "Verified Agents" },
            ].map((stat, index) => (
              <div key={index} className="animate-fade-in">
                <div className="text-4xl lg:text-5xl font-black mb-2">
                  {stat.number}
                </div>
                <div className="text-blue-100 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-6">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their perfect
            property with us
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/properties"
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 transition-all font-semibold flex items-center justify-center gap-2"
            >
              Browse Properties
              <Search className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Filter Panel */}
      {showFilterPanel && (
        <FilterPanel
          filters={filters}
          setFilters={setFilters}
          onClose={() => setShowFilterPanel(false)}
        />
      )}

      <Footer />

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out both;
        }

        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};
