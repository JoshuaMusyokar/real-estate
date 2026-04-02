import {
  Check,
  Shield,
  Zap,
  Search,
  Building2,
  Clock,
  Trophy,
  User,
  Briefcase,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { FilterPanel } from "./FilterPanel";
import { type PropertyPurpose, type PropertySearchFilters } from "../../types";
import { useGetCategorizedPropertiesQuery } from "../../services/propertyApi";
import { useNavigate } from "react-router-dom";
import { PublicHeader } from "../../layout/PublicHeader";
import { Footer } from "../../layout/Footer";
import { useDefaultCity } from "../../hooks/useDefaultCity";
import { HorizontalScrollSection } from "./HorizontalSection";
import { AdBanner } from "./AddBanner";
import { BuilderPropertyCard } from "./BuilderPropertyCard";
import { StandardPropertyCard } from "./StandardPropertyCard";
import { CategorySkeletonLoader } from "./CategorySkeletonLoader";
import { SearchComponent } from "./SearchComponent";
import bg1 from "../../assets/bg-1.jpg";
import bg2 from "../../assets/bg-2.jpg";
import bg3 from "../../assets/bg-3.jpg";

export const PropertyLandingPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<PropertySearchFilters>({});
  const [selectedPurpose, setSelectedPurpose] = useState<PropertyPurpose>();
  const [propertyType, setPropertyType] = useState<string>("RESIDENTIAL");
  const [propertyPurpose, setPropertyPurpose] =
    useState<PropertyPurpose>("SALE");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);

  const heroBgs = [bg1, bg2, bg3];

  // Rotate hero background every 5 seconds with smooth crossfade
  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((i) => (i + 1) % heroBgs.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // ── Single source of truth for city ────────────────────────────────────────
  // Both PublicHeader (header city pill) and SearchComponent (search bar city)
  // read from here and call the same handleCityChange, so they stay perfectly
  // in sync. Changing city in either place updates both simultaneously.
  const { selectedCityId, selectedCityName, handleCityChange } =
    useDefaultCity();

  const { data: categorizedData, isLoading: isCategorizedLoading } =
    useGetCategorizedPropertiesQuery({
      purpose: propertyPurpose,
      propertyTypeName: propertyType,
      cityId: selectedCityId || undefined,
      limit: 8,
    });

  const categories = [
    {
      id: "top",
      title: "Top Properties",
      description: "Smart-picked based on engagement, quality, and value",
      icon: <Trophy className="w-4 h-4 sm:w-6 sm:h-6 text-white" />,
      color: "from-blue-600 to-indigo-600",
      CardComponent: StandardPropertyCard,
      properties: categorizedData?.data?.top || [],
    },
    {
      id: "featuredBuilders",
      title: "Premium Builder Projects",
      description: "Exclusive projects from verified builders",
      icon: <Building2 className="w-4 h-4 sm:w-6 sm:h-6 text-white" />,
      color: "from-amber-500 to-orange-500",
      properties: categorizedData?.data?.featuredBuilders || [],
      CardComponent: BuilderPropertyCard,
    },
    {
      id: "featuredOwners",
      title: "Featured Owner Properties",
      description: "Direct listings from property owners",
      icon: <User className="w-4 h-4 sm:w-6 sm:h-6 text-white" />,
      color: "from-blue-500 to-cyan-500",
      properties: categorizedData?.data?.featuredOwners || [],
      CardComponent: StandardPropertyCard,
    },
    {
      id: "featuredAgents",
      title: "Agent Recommended",
      description: "Curated properties by professional agents",
      icon: <Briefcase className="w-4 h-4 sm:w-6 sm:h-6 text-white" />,
      color: "from-indigo-600 to-blue-700",
      properties: categorizedData?.data?.featuredAgents || [],
      CardComponent: StandardPropertyCard,
    },
    {
      id: "recentlyAdded",
      title: "Recently Added",
      description: "Fresh listings just added to our platform",
      icon: <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-white" />,
      color: "from-sky-500 to-blue-600",
      properties: categorizedData?.data?.recentlyAdded || [],
      CardComponent: StandardPropertyCard,
    },
  ];

  useEffect(() => {
    if (selectedCityId) setFilters((p) => ({ ...p, cityId: selectedCityId }));
  }, [selectedCityId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header — receives shared city, calls same handleCityChange */}
      <PublicHeader
        theme="vibrant"
        onShowFavorites={() => navigate("/saved-properties")}
        onShowAppointments={() => navigate("/appointments")}
        selectedCityId={selectedCityId}
        onCityChange={handleCityChange}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative pt-16 sm:pt-24 lg:pt-32 pb-4 sm:pb-8 overflow-visible">
        {/* ── Crossfading background images ─────────────────────────────── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {heroBgs.map((bg, i) => (
            <div
              key={i}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[1500ms] ease-in-out"
              style={{
                backgroundImage: `url(${bg})`,
                opacity: i === bgIndex ? 1 : 0,
              }}
            />
          ))}
          {/* Dark overlay so text stays readable over any image */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
          {/* Subtle bottom fade into page bg */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
          {/* Dot indicator — bottom centre */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
            {heroBgs.map((_, i) => (
              <button
                key={i}
                onClick={() => setBgIndex(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === bgIndex
                    ? "w-5 h-1.5 bg-white"
                    : "w-1.5 h-1.5 bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-4 sm:mb-10 lg:mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 sm:px-5 py-1 sm:py-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-xl shadow-blue-500/20 mb-3 sm:mb-6 border border-blue-100 animate-fade-in hover:scale-105 transition-transform duration-300">
              <span className="text-[10px] sm:text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                #1 Trusted Real Estate Platform in 2025
              </span>
            </div>

            <h1 className="text-xl sm:text-4xl lg:text-6xl font-black text-white mb-1 sm:mb-4 tracking-tight leading-tight drop-shadow-lg">
              Find Your
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Dream Home
              </span>
            </h1>

            <p className="text-[11px] sm:text-base lg:text-lg text-white/80 mb-3 sm:mb-8 font-medium drop-shadow">
              7K+ listings added daily · 73K+ total verified
            </p>

            {/* SearchComponent — seeded with shared city, writes back via onCityChange */}
            <div className="relative z-[1000] max-w-6xl mx-auto animate-slide-up-delay">
              <SearchComponent
                onPurposeChange={(p) => setSelectedPurpose(p)}
                initialPurpose={selectedPurpose}
                initialCity={selectedCityName}
                onCityChange={handleCityChange}
                onPropertyTypeChange={setPropertyType}
                onPropertyPurposeChange={setPropertyPurpose}
              />
            </div>

            <div className="flex items-center justify-center gap-3 sm:gap-6 mt-3 sm:mt-6 animate-fade-in-delay-2">
              {[
                { icon: Check, color: "text-emerald-400", label: "Verified" },
                { icon: Shield, color: "text-blue-300", label: "Secure" },
                {
                  icon: Zap,
                  color: "text-amber-300",
                  label: "Instant Booking",
                },
              ].map(({ icon: Icon, color, label }) => (
                <div key={label} className="flex items-center gap-1 sm:gap-2">
                  <Icon
                    className={`w-3 h-3 sm:w-5 sm:h-5 flex-shrink-0 ${color}`}
                  />
                  <span className="text-[10px] sm:text-sm font-semibold text-white/80 whitespace-nowrap drop-shadow">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Property Category Sections ─────────────────────────────────────── */}
      {categories.map((category, index) => {
        if (isCategorizedLoading) {
          return <CategorySkeletonLoader key={category.id} />;
        }

        if (!category.properties || category.properties.length === 0) {
          return (
            <section key={category.id} className="py-5 sm:py-12 bg-white">
              <div className="max-w-full mx-auto px-3 sm:px-6">
                <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-8">
                  <div
                    className={`p-2 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r ${category.color} shadow-md flex-shrink-0`}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-3xl font-black text-gray-900 leading-tight">
                      {category.title}
                    </h2>
                    <p className="text-xs sm:text-base text-gray-500 mt-0.5 font-medium hidden sm:block">
                      {category.description}
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl sm:rounded-3xl border-2 border-dashed border-gray-200 p-5 sm:p-12 text-center">
                  <div className="max-w-sm mx-auto">
                    <div className="w-10 h-10 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-6">
                      <Search className="w-5 h-5 sm:w-12 sm:h-12 text-gray-400" />
                    </div>
                    <h3 className="text-sm sm:text-2xl font-bold text-gray-800 mb-1.5 sm:mb-3">
                      No properties in {selectedCityName}
                    </h3>
                    <p className="text-[11px] sm:text-base text-gray-500 mb-3 sm:mb-8">
                      Try a different city or check back later.
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-3 sm:px-6 py-1.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl transition-colors"
                    >
                      Refresh
                    </button>
                  </div>
                </div>
              </div>
            </section>
          );
        }

        return (
          <React.Fragment key={category.id}>
            <HorizontalScrollSection {...category} />
            {(index === 1 || index === 3) && <AdBanner />}
          </React.Fragment>
        );
      })}

      {showFilterPanel && (
        <FilterPanel
          filters={filters}
          setFilters={setFilters}
          onClose={() => setShowFilterPanel(false)}
        />
      )}

      <Footer />

      <style>{`
        @keyframes blob{0%,100%{transform:translate(0,0) scale(1)}25%{transform:translate(20px,-50px) scale(1.1)}50%{transform:translate(-20px,20px) scale(0.9)}75%{transform:translate(50px,50px) scale(1.05)}}
        .animate-blob{animation:blob 7s infinite}
        .animation-delay-2000{animation-delay:2s}
        .animation-delay-4000{animation-delay:4s}
        @keyframes fade-in{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slide-up{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
        .animate-fade-in{animation:fade-in 0.6s ease-out}
        .animate-fade-in-delay{animation:fade-in 0.6s ease-out 0.2s both}
        .animate-fade-in-delay-2{animation:fade-in 0.6s ease-out 0.4s both}
        .animate-slide-up{animation:slide-up 0.8s ease-out}
        .animate-slide-up-delay{animation:slide-up 0.8s ease-out 0.3s both}
        .bg-grid-pattern{background-image:linear-gradient(to right,rgba(0,0,0,0.05) 1px,transparent 1px),linear-gradient(to bottom,rgba(0,0,0,0.05) 1px,transparent 1px);background-size:40px 40px}
        .line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
        @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:0.01ms!important;animation-iteration-count:1!important;transition-duration:0.01ms!important}}
      `}</style>
    </div>
  );
};
