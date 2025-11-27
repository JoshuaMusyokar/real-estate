/* eslint-disable @typescript-eslint/no-unused-vars */
import { Check, ChevronRight, Home, Loader2 } from "lucide-react";
import { PropertyHeader } from "./components/PropertyHeader";
import { PropertyStats } from "./components/PropertyStats";
import { ImageGallery } from "./components/ImageGallery";
import { useGetPropertyAmenitiesQuery } from "../../services/AmenityApi";
import {
  useGetPropertyQuery,
  useGetUserFavoritesQuery,
} from "../../services/propertyApi";
import { useEffect, useState } from "react";
import { PriceSidebar } from "./components/PriceSidebar";
import { InquiryFormModal } from "../../components/form/InquiryForm";
import { ScheduleViewingModal } from "../../components/form/ScheduleViewingForm";
import type { Amenity, Role } from "../../types";
import { useNavigate } from "react-router-dom"; // Add this import

// IMPORTS
import { ContactCard } from "./components/ContactCard";
import { DocumentsSection } from "./components/DocumentSection";
import { SimilarPropertiesSection } from "./components/SimilarPropertiesSection";
import { OwnerPropertiesSlider } from "./components/OwnerPropertySection";
import { useAuth } from "../../hooks/useAuth";
import { LocationSection } from "../property/components/LocationSection";
import { MediaSection } from "../property/components/MediaSection";
import { useGetLocalityByNameQuery } from "../../services/locationApi";
import { LocalityHighlightsSection } from "./components/LocalitiesHighlightSection";
import { RatingsAndReviewsSection } from "./components/ReviewAndLocality";
import { AmenitiesSection } from "./components/AmenitySection";
import { AboutProperty } from "./components/AboutProperty";
import { PropertyDetails } from "./components/PropertyDetail";
import { PropertyShowcase } from "./components/PropertyShowcase";

interface PropertyDetailBuyerProps {
  id: string;
  userRole?: Role;
  userId?: string;
}

export const PropertyDetailBuyer: React.FC<PropertyDetailBuyerProps> = ({
  id,
}) => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetPropertyQuery(id);
  const property = data?.data;
  const propertyId = property?.id;

  const { data: amenitiesData } = useGetPropertyAmenitiesQuery(
    propertyId || "",
    { skip: !propertyId }
  );
  const localityName = property?.locality;
  const cityId = property?.cityId;

  const { data: localityData } = useGetLocalityByNameQuery(
    { name: localityName || "", cityId: cityId || "" },
    { skip: !localityName || !cityId }
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
    if (isAuthenticated && favouriteData && favouriteData.data) {
      setFavPropertiesIds(favouriteData.data);
    }
  }, [favouriteData, isAuthenticated]);

  const handleShare = async (): Promise<void> => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property?.title,
          text: property?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // Navigation handlers for "View All" buttons
  const handleViewAllPropertyReviews = () => {
    navigate(`/properties/${propertyId}/reviews`);
  };

  const handleViewAllLocalityRatings = () => {
    if (localityData?.data?.id) {
      navigate(`/localities/${localityData.data.id}/ratings`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading property...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Home className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Property Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/properties")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span
              onClick={() => navigate("/")}
              className="hover:text-blue-600 cursor-pointer"
            >
              Home
            </span>
            <ChevronRight className="w-4 h-4" />
            <span
              onClick={() => navigate("/properties")}
              className="hover:text-blue-600 cursor-pointer"
            >
              Properties
            </span>
            <ChevronRight className="w-4 h-4" />
            <span
              onClick={() => navigate(`/properties?city=${property.city.name}`)}
              className="hover:text-blue-600 cursor-pointer"
            >
              {property.city.name}
            </span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium truncate">
              {property.title}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full px-6 py-6 relative z-0">
        {/* Image Gallery */}
        <div className="relative mb-10 w-full overflow-hidden rounded-xl">
          <div className="w-full">
            {/* Combined Showcase */}
            <PropertyShowcase
              property={property}
              onShare={handleShare}
              favProperties={favPropertiesIds}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Property */}
            <AboutProperty description={property.description} />

            {/* Property Details */}
            <PropertyDetails
              propertyType={property.propertyType}
              subType={property.subType}
              purpose={property.purpose}
              furnishingStatus={property.furnishingStatus}
              yearBuilt={property.yearBuilt}
              floors={property.floors}
              builderName={property.builderName}
              hasBalcony={property.hasBalcony}
              reraNumber={property.reraNumber}
            />

            {/* Media Section */}
            {(property.images?.length > 0 ||
              property.youtubeVideoUrl ||
              property.virtualTourUrl) && (
              <MediaSection
                youtubeUrl={property.youtubeVideoUrl}
                virtualTourUrl={property.virtualTourUrl}
                images={property.images || []}
              />
            )}

            {/* Amenities */}
            {amenities.length > 0 && <AmenitiesSection amenities={amenities} />}
            {/* Locality Highlights */}
            {localityHighlights.length > 0 && (
              <LocalityHighlightsSection
                localityName={property.locality}
                highlights={localityHighlights}
                cityName={property.city.name}
              />
            )}

            {/* ⭐ NEW: Combined Ratings & Reviews Section */}
            <RatingsAndReviewsSection
              propertyId={property.id}
              propertyTitle={property.title}
              localityId={localityData?.data?.id}
              localityName={property.locality}
              cityName={property.city.name}
              onViewAllPropertyReviews={handleViewAllPropertyReviews}
              onViewAllLocalityRatings={handleViewAllLocalityRatings}
            />

            {/* Documents Section */}
            {property.documents && property.documents.length > 0 && (
              <DocumentsSection
                documents={property.documents}
                propertyTitle={property.title}
              />
            )}

            {/* Location */}
            <LocationSection property={property} />

            {/* Similar Properties Section */}
            <SimilarPropertiesSection
              propertyId={property.id}
              currentPropertyTitle={property.title}
            />

            {/* Owner's Other Properties Section */}
            {property.owner && (
              <OwnerPropertiesSlider
                ownerId={property.ownerId}
                ownerName={
                  property.owner.firstName + " " + property.owner.lastName
                }
                currentPropertyId={property.id}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Price Sidebar */}
            <PriceSidebar
              property={property}
              onInquire={() => setShowInquiry(true)}
              onSchedule={() => setShowSchedule(true)}
            />

            {/* Contact Card */}
            <ContactCard
              property={property}
              onInquire={() => setShowInquiry(true)}
              onSchedule={() => setShowSchedule(true)}
            />

            {/* Quick Stats Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">
                Property Insights
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Views</span>
                  <span className="font-semibold text-gray-900">
                    {property.viewCount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Inquiries</span>
                  <span className="font-semibold text-gray-900">
                    {property.inquiryCount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Listed</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(
                      property.publishedAt || property.createdAt
                    ).toLocaleDateString()}
                  </span>
                </div>
                {property.verified && (
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-green-600">
                      <Check className="w-5 h-5" />
                      <span className="font-semibold text-sm">
                        Verified Property
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Safety Tips Card */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <h3 className="font-bold text-amber-900 mb-3">Safety Tips</h3>
              <ul className="space-y-2 text-sm text-amber-800">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Never make payments before viewing the property</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Meet the agent in person and verify identity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Check property documents carefully</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Report suspicious activity immediately</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <SimilarPropertiesSection
        propertyId={property.id}
        currentPropertyTitle={property.title}
      />
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
