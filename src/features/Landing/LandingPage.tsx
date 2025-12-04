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
  Trophy,
  User,
  Briefcase,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { FilterPanel } from "./FilterPanel";
import { LandingPropertyCard } from "./LandingPropertyCard";
import {
  type PropertySearchFilters,
  type PropertySubType,
  type PropertyType,
} from "../../types";
import {
  useGetCategorizedPropertiesQuery,
  useGetUserFavoritesQuery,
  useSearchPropertiesQuery,
} from "../../services/propertyApi";
import { Link, useNavigate } from "react-router-dom";
import { PublicHeader } from "../../layout/PublicHeader";
import { useAuth } from "../../hooks/useAuth";
import { Footer } from "../../layout/Footer";
import { useDefaultCity } from "../../hooks/useDefaultCity";
import { CategorizedSection } from "./CategorizedSection";
import { SearchComponent } from "./SearchComponent";
import { HorizontalScrollSection } from "./HorizontalSection";
import { AdBanner } from "./AddBanner";
import { BuilderPropertyCard } from "./BuilderPropertyCard";
import { StandardPropertyCard } from "./StandardPropertyCard";
export const PropertyLandingPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<PropertySearchFilters>({});
  const [selectedPurpose, setSelectedPurpose] = useState<string>("");
  const [searchInput, setSearchInput] = useState("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [favPropertiesIds, setFavPropertiesIds] = useState<string[]>([]);
  const { isAuthenticated } = useAuth();
  const { data: favouriteData, refetch } = useGetUserFavoritesQuery(undefined, {
    skip: !isAuthenticated,
  });
  // const [selectedCityId, setSelectedCityId] = useState<string>("");
  const { selectedCityId, selectedCityName, handleCityChange } =
    useDefaultCity();

  const { data, isLoading } = useSearchPropertiesQuery({
    ...filters,
    search: searchInput,
    sortBy: sortBy,
    sortOrder: "desc",
    status: "AVAILABLE",
  });
  const { data: categorizedData, isLoading: isCategorizedLoading } =
    useGetCategorizedPropertiesQuery({
      purpose: selectedPurpose as any,
      cityId: selectedCityId || undefined,
      limit: 8,
    });

  // Categories configuration
  const categories = [
    {
      id: "top",
      title: "Top Properties",
      description:
        "Smart-picked properties based on engagement, quality, and value",
      icon: <Trophy className="w-6 h-6 text-white" />,
      color: "from-amber-500 to-orange-500",
      CardComponent: StandardPropertyCard,
      properties: categorizedData?.data?.top || [],
      adBanner: true,
    },
    {
      id: "featuredBuilders",
      title: "Premium Builder Projects",
      description: "Exclusive projects from verified builders",
      icon: <Building2 className="w-6 h-6 text-white" />,
      color: "from-blue-500 to-indigo-600",
      properties: categorizedData?.data?.featuredBuilders || [],
      CardComponent: BuilderPropertyCard,
    },
    {
      id: "featuredOwners",
      title: "Featured Owner Properties",
      description: "Direct listings from property owners",
      icon: <User className="w-6 h-6 text-white" />,
      color: "from-green-500 to-emerald-600",
      properties: categorizedData?.data?.featuredOwners || [],
      CardComponent: StandardPropertyCard,
    },
    {
      id: "featuredAgents",
      title: "Agent Recommended",
      description: "Curated properties by professional agents",
      icon: <Briefcase className="w-6 h-6 text-white" />,
      color: "from-purple-500 to-pink-500",
      properties: categorizedData?.data?.featuredAgents || [],
      CardComponent: StandardPropertyCard,
    },
    {
      id: "recentlyAdded",
      title: "Recently Added",
      description: "Fresh listings just added to our platform",
      icon: <Clock className="w-6 h-6 text-white" />,
      color: "from-red-500 to-rose-500",
      properties: categorizedData?.data?.recentlyAdded || [],
      CardComponent: StandardPropertyCard,
    },
  ];

  useEffect(() => {
    if (isAuthenticated) refetch();
  }, [isAuthenticated, refetch]);

  useEffect(() => {
    if (selectedCityId) {
      setFilters((prev) => ({ ...prev, cityId: selectedCityId }));
    }
  }, [selectedCityId]);

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
  // Handle purpose change from search component
  const handlePurposeChange = (purpose: string) => {
    setSelectedPurpose(purpose);
    // You might want to refresh data or scroll to properties section
  };
  const handleShowFavorites = () => {
    navigate("/saved-properties");
  };

  const handleShowAppointments = () => {
    navigate("/appointments");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Premium Navigation Bar with Glass Morphism */}
      <PublicHeader
        theme="vibrant"
        onShowFavorites={handleShowFavorites}
        onShowAppointments={handleShowAppointments}
        selectedCityId={selectedCityId}
        onCityChange={handleCityChange}
      />

      {/* Hero Section with Advanced Animations */}
      <section className="relative pt-32 pb-4 overflow-visible">
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
              <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                #1 Trusted Real Estate Platform in 2025
              </span>
            </div>

            {/* Premium Search Bar with Enhanced Styling */}
            <div className="max-w-6xl mx-auto animate-slide-up-delay">
              <SearchComponent
                onPurposeChange={handlePurposeChange}
                initialPurpose={selectedPurpose}
                initialCity={selectedCityName}
              />
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

      {/* Categorized Properties Sections */}
      {/* {!isCategorizedLoading && categorizedData?.data && (
        <div className="space-y-1">
          {categories.map((category, index) => (
            <CategorizedSection
              key={category.id}
              title={category.title}
              description={category.description}
              icon={category.icon}
              properties={category.properties}
              color={category.color}
              index={index}
            />
          ))}
        </div>
      )} */}

      {categories.map((category, index) => (
        <React.Fragment key={category.id}>
          <HorizontalScrollSection {...category} />
          {(index === 1 || index === 3) && <AdBanner />}
        </React.Fragment>
      ))}

      {/* Premium Stats Section with Animated Counters */}
      {/* <section className="relative py-10 overflow-hidden">
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
      </section> */}

      {/* Why Choose Us Section with Card Hover Effects */}
      {/* <section
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
      </section> */}

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
        .animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out both;
}

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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Ensure smooth animations */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in-up {
    animation: none;
  }
      `}</style>
    </div>
  );
};
