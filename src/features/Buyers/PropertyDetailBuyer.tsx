// PropertyDetailBuyer.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Check, ChevronRight, Home, Loader2 } from "lucide-react";
import { PropertyHeader } from "./components/PropertyHeader";
import { PropertyStats } from "./components/PropertyStats";
import { ImageGallery } from "./components/ImageGallery";
import { useGetPropertyAmenitiesQuery } from "../../services/AmenityApi";
import {
  useGetPropertyBySlugQuery,
  useGetPropertyQuery,
  useGetUserFavoritesQuery,
} from "../../services/propertyApi";
import { useEffect, useState } from "react";
import { PriceSidebar } from "./components/PriceSidebar";
import { InquiryFormModal } from "../../components/form/InquiryForm";
import { ScheduleViewingModal } from "../../components/form/ScheduleViewingForm";
import type { Amenity, Role } from "../../types";
import { useNavigate } from "react-router-dom";
import { ContactCard } from "./components/ContactCard";
import { DocumentsSection } from "./components/DocumentSection";
import { SimilarPropertiesSection } from "./components/SimilarPropertiesSection";
import { OwnerPropertiesSlider } from "./components/OwnerPropertySection";
import { useAuth } from "../../hooks/useAuth";
import { LocationSection } from "../property/components/LocationSection";
import { MediaSection } from "../property/components/MediaSection";
import { useGetLocalityByNameQuery } from "../../services/locationApi";
import { NearbyPlacesSection } from "./components/LocalitiesHighlightSection";
import { RatingsAndReviewsSection } from "./components/ReviewAndLocality";
import { AmenitiesSection } from "./components/AmenitySection";
import { AboutProperty } from "./components/AboutProperty";
import { PropertyDetails } from "./components/PropertyDetail";
import { PropertyShowcase } from "./components/PropertyShowcase";
import { FloorPlanSection } from "./components/FloorPlanSection";

interface PropertyDetailBuyerProps {
  slug: string;
  userRole?: Role;
  userId?: string;
}

export const PropertyDetailBuyer: React.FC<PropertyDetailBuyerProps> = ({
  slug,
}) => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetPropertyBySlugQuery(slug);
  const property = data?.data;
  const propertyId = property?.id;

  const { data: amenitiesData } = useGetPropertyAmenitiesQuery(
    propertyId || "",
    { skip: !propertyId },
  );
  const localityName = property?.locality;
  const cityId = property?.cityId;

  const { data: localityData } = useGetLocalityByNameQuery(
    { name: localityName || "", cityId: cityId || "" },
    { skip: !localityName || !cityId },
  );

  const [favPropertiesIds, setFavPropertiesIds] = useState<string[]>([]);
  const { isAuthenticated } = useAuth();
  const { data: favouriteData, refetch } = useGetUserFavoritesQuery(undefined, {
    skip: !isAuthenticated,
  });

  const localityHighlights = localityData?.data?.highlights
    ? typeof localityData.data.highlights === "string"
      ? JSON.parse(localityData.data.highlights)
      : localityData.data.highlights
    : [];

  const amenities: Amenity[] = amenitiesData?.data || [];
  const [showInquiry, setShowInquiry] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  useEffect(() => {
    if (isAuthenticated) refetch();
  }, [isAuthenticated, refetch]);
  useEffect(() => {
    if (isAuthenticated && favouriteData?.data)
      setFavPropertiesIds(favouriteData.data);
  }, [favouriteData, isAuthenticated]);

  const handleShare = async (): Promise<void> => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property?.title,
          text: property?.description,
          url: window.location.href,
        });
      } catch {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleViewAllPropertyReviews = () =>
    navigate(`/properties/${propertyId}/reviews`);
  const handleViewAllLocalityRatings = () => {
    if (localityData?.data?.id)
      navigate(`/localities/${localityData.data.id}/ratings`);
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
          <p className="text-sm text-blue-600 font-medium">Loading property…</p>
        </div>
      </div>
    );
  }

  // ── Not found ──────────────────────────────────────────────────────────────
  if (error || !property) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="w-8 h-8 text-blue-300" />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">
            Property Not Found
          </h2>
          <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
            This property doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/properties")}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors"
          >
            Browse Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-[114px] sm:pt-[122px] md:pt-[68px]">
      {/* ── Breadcrumb ───────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-blue-50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-500 flex-wrap">
            <span
              onClick={() => navigate("/")}
              className="hover:text-blue-600 cursor-pointer font-medium"
            >
              Home
            </span>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <span
              onClick={() => navigate("/properties")}
              className="hover:text-blue-600 cursor-pointer"
            >
              Properties
            </span>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <span
              onClick={() => navigate(`/properties?city=${property.city.name}`)}
              className="hover:text-blue-600 cursor-pointer"
            >
              {property.city.name}
            </span>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <span className="text-gray-800 font-semibold truncate max-w-[140px] sm:max-w-xs">
              {property.title}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-3 sm:px-5 lg:px-8 py-4 sm:py-6 space-y-3">
        {/* ── Showcase / Gallery ───────────────────────────────────────────── */}
        <div className="mb-4 sm:mb-6 rounded-xl sm:rounded-2xl overflow-hidden">
          <PropertyShowcase
            property={property}
            onShare={handleShare}
            favProperties={favPropertiesIds}
          />
        </div>

        {/* ── Main grid ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left — main content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5">
            <PropertyDetails property={property} />
            {amenities.length > 0 && <AmenitiesSection amenities={amenities} />}
            <NearbyPlacesSection
              localityName={property.locality}
              cityName={property.city.name}
              localityHighlights={localityHighlights || []}
              nearbyPlaces={property.nearbyPlaces || []}
            />
            <LocationSection property={property} />
            <AboutProperty description={property.description} />
            {(property.images?.length > 0 ||
              property.youtubeVideoUrl ||
              property.virtualTourUrl) && (
              <MediaSection
                youtubeUrl={property.youtubeVideoUrl}
                virtualTourUrl={property.virtualTourUrl}
                images={property.images || []}
              />
            )}
            <FloorPlanSection images={property.images} />
            <RatingsAndReviewsSection
              propertyId={property.id}
              propertyTitle={property.title}
              localityId={localityData?.data?.id}
              localityName={property.locality}
              cityName={property.city.name}
              onViewAllPropertyReviews={handleViewAllPropertyReviews}
              onViewAllLocalityRatings={handleViewAllLocalityRatings}
            />
            {property.documents && property.documents.length > 0 && (
              <DocumentsSection
                documents={property.documents}
                propertyTitle={property.title}
              />
            )}
            <SimilarPropertiesSection
              propertyId={property.id}
              currentPropertyTitle={property.title}
            />
            {property.owner && (
              <OwnerPropertiesSlider
                ownerId={property.ownerId}
                ownerName={`${property.owner.firstName} ${property.owner.lastName}`}
                currentPropertyId={property.id}
              />
            )}
          </div>

          {/* Right — sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <PriceSidebar
              property={property}
              onInquire={() => setShowInquiry(true)}
              onSchedule={() => setShowSchedule(true)}
            />
            <ContactCard
              property={property}
              onInquire={() => setShowInquiry(true)}
              onSchedule={() => setShowSchedule(true)}
            />

            {/* Property Insights */}
            <div className="bg-white border border-blue-100 rounded-xl p-4 sm:p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-3">
                Property Insights
              </h3>
              <div className="space-y-2.5">
                {[
                  { label: "Views", value: property.viewCount },
                  { label: "Inquiries", value: property.inquiryCount },
                  {
                    label: "Listed",
                    value: new Date(
                      property.publishedAt || property.createdAt,
                    ).toLocaleDateString(),
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex justify-between items-center"
                  >
                    <span className="text-xs text-gray-500">{label}</span>
                    <span className="text-xs font-bold text-gray-800">
                      {value}
                    </span>
                  </div>
                ))}
                {property.verified && (
                  <div className="pt-2.5 border-t border-blue-50">
                    <div className="flex items-center gap-1.5 text-emerald-600">
                      <Check className="w-4 h-4" />
                      <span className="text-xs font-bold">
                        Verified Property
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Safety tips */}
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 sm:p-5">
              <h3 className="text-sm font-bold text-amber-900 mb-2.5">
                Safety Tips
              </h3>
              <ul className="space-y-1.5">
                {[
                  "Never pay before viewing the property",
                  "Meet the agent in person and verify identity",
                  "Check property documents carefully",
                  "Report suspicious activity immediately",
                ].map((tip) => (
                  <li
                    key={tip}
                    className="flex items-start gap-2 text-[11px] text-amber-800"
                  >
                    <span className="text-amber-500 mt-0.5 flex-shrink-0">
                      •
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <InquiryFormModal
        property={property}
        isOpen={showInquiry}
        onClose={() => setShowInquiry(false)}
      />
      <ScheduleViewingModal
        property={property}
        isOpen={showSchedule}
        onClose={() => setShowSchedule(false)}
      />
    </div>
  );
};
