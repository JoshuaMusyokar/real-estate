import { useState } from "react";
import { MapPin, Home } from "lucide-react";
import { LocalityRatingSection } from "./LocalityRatingSection";
import { PropertyReviewSection } from "./PropertyReviewSection";

interface RatingsAndReviewsSectionProps {
  // Locality data
  localityId?: string;
  localityName?: string;
  cityName?: string;

  // Property data
  propertyId: string;
  propertyTitle: string;

  // Navigation callbacks
  onViewAllLocalityRatings?: () => void;
  onViewAllPropertyReviews?: () => void;
}

type TabType = "property" | "locality";

export const RatingsAndReviewsSection: React.FC<
  RatingsAndReviewsSectionProps
> = ({
  localityId,
  localityName,
  cityName,
  propertyId,
  propertyTitle,
  onViewAllLocalityRatings,
  onViewAllPropertyReviews,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("property");

  // Show tabs only if locality data is available
  const showTabs = localityId && localityName && cityName;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Tabs Header */}
      {showTabs && (
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab("property")}
              className={`flex-1 px-6 py-4 font-semibold transition-colors relative ${
                activeTab === "property"
                  ? "text-purple-600 bg-purple-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Home className="w-5 h-5" />
                <span>Property Reviews</span>
              </div>
              {activeTab === "property" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("locality")}
              className={`flex-1 px-6 py-4 font-semibold transition-colors relative ${
                activeTab === "locality"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>Locality Ratings</span>
              </div>
              {activeTab === "locality" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Tab Content */}
      {showTabs ? (
        <div>
          {activeTab === "property" ? (
            <PropertyReviewSection
              propertyId={propertyId}
              propertyTitle={propertyTitle}
              onViewAllClick={onViewAllPropertyReviews}
            />
          ) : (
            <LocalityRatingSection
              localityId={localityId!}
              localityName={localityName!}
              cityName={cityName!}
              onViewAllClick={onViewAllLocalityRatings}
            />
          )}
        </div>
      ) : (
        // If no locality data, show only property reviews without tabs
        <PropertyReviewSection
          propertyId={propertyId}
          propertyTitle={propertyTitle}
          onViewAllClick={onViewAllPropertyReviews}
        />
      )}
    </div>
  );
};
