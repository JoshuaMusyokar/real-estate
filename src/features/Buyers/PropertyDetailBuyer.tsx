/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Check,
  ChevronRight,
  Home,
  Loader2,
  MapPin,
  Navigation,
} from "lucide-react";
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

// NEW IMPORTS
import { ContactCard } from "./components/ContactCard";
import { DocumentsSection } from "./components/DocumentSection";
import { SimilarPropertiesSection } from "./components/SimilarPropertiesSection";
import { OwnerPropertiesSection } from "./components/OwnerPropertySection";
import { useAuth } from "../../hooks/useAuth";
import { LocationSection } from "../property/components/LocationSection";
import { MediaSection } from "../property/components/MediaSection";

interface PropertyDetailBuyerProps {
  id: string;
  userRole?: Role;
  userId?: string;
}

export const PropertyDetailBuyer: React.FC<PropertyDetailBuyerProps> = ({
  id,
}) => {
  const { data, isLoading, error } = useGetPropertyQuery(id);
  const property = data?.data;
  const propertyId = property?.id;

  const { data: amenitiesData } = useGetPropertyAmenitiesQuery(
    propertyId || "",
    { skip: !propertyId }
  );
  const [favPropertiesIds, setFavPropertiesIds] = useState<string[]>([]);
  const { isAuthenticated } = useAuth();
  const { data: favouriteData, refetch } = useGetUserFavoritesQuery(undefined, {
    skip: !isAuthenticated,
  });

  const amenities: Amenity[] = amenitiesData?.data || [];
  const [isSaved, setIsSaved] = useState(false);
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
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
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
            <span className="hover:text-blue-600 cursor-pointer">Home</span>
            <ChevronRight className="w-4 h-4" />
            <span className="hover:text-blue-600 cursor-pointer">
              Properties
            </span>
            <ChevronRight className="w-4 h-4" />
            <span className="hover:text-blue-600 cursor-pointer">
              {property.city}
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
            <ImageGallery
              images={property.images || []}
              propertyTitle={property.title}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <PropertyHeader
                property={property}
                onShare={handleShare}
                favProperties={favPropertiesIds}
              />
            </div>

            {/* Stats */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <PropertyStats property={property} />
            </div>

            {/* Description */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                About This Property
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Property Details */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-5">
                Property Details
              </h2>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    Property Type
                  </div>
                  <div className="font-semibold text-gray-900">
                    {property.propertyType}
                  </div>
                </div>
                {property.subType && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Sub Type</div>
                    <div className="font-semibold text-gray-900">
                      {property.subType}
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-gray-600 mb-1">Purpose</div>
                  <div className="font-semibold text-gray-900">
                    {property.purpose}
                  </div>
                </div>
                {property.furnishingStatus && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Furnishing</div>
                    <div className="font-semibold text-gray-900">
                      {property.furnishingStatus}
                    </div>
                  </div>
                )}
                {property.yearBuilt && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Year Built</div>
                    <div className="font-semibold text-gray-900">
                      {property.yearBuilt}
                    </div>
                  </div>
                )}
                {property.floors && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Floors</div>
                    <div className="font-semibold text-gray-900">
                      {property.floors}
                    </div>
                  </div>
                )}
              </div>
            </div>
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
            {amenities.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-5">
                  Amenities
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {amenities.map((item: Amenity) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-gray-900 text-sm">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NEW: Documents Section */}
            {property.documents && property.documents.length > 0 && (
              <DocumentsSection
                documents={property.documents}
                propertyTitle={property.title}
              />
            )}

            {/* Location */}
            <LocationSection property={property} />

            {/* NEW: Similar Properties Section */}
            <SimilarPropertiesSection
              propertyId={property.id}
              currentPropertyTitle={property.title}
            />

            {/* NEW: Owner's Other Properties Section */}
            {property.owner && (
              <OwnerPropertiesSection
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

            {/* NEW: Contact Card (Masked Contact) */}
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
