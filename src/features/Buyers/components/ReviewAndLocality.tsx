// ReviewAndLocality.tsx  (RatingsAndReviewsSection)
import { useState } from "react";
import { MapPin, Home } from "lucide-react";
import { LocalityRatingSection } from "./LocalityRatingSection";
import { PropertyReviewSection } from "./PropertyReviewSection";

interface RatingsAndReviewsSectionProps {
  localityId?: string;
  localityName?: string;
  cityName?: string;
  propertyId: string;
  propertyTitle: string;
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
  const showTabs = localityId && localityName && cityName;

  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: "property", label: "Property Reviews", icon: Home },
    { id: "locality", label: "Locality Ratings", icon: MapPin },
  ];

  return (
    <div className="bg-white border border-blue-100 rounded-xl overflow-hidden">
      {/* Tab bar */}
      {showTabs && (
        <div className="flex border-b border-blue-50">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 relative flex items-center justify-center gap-1.5 px-4 py-3 text-xs sm:text-sm font-semibold transition-colors
                ${activeTab === id ? "text-blue-600 bg-blue-50/50" : "text-gray-400 hover:text-gray-700 hover:bg-gray-50/50"}`}
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {label}
              {activeTab === id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {showTabs ? (
        activeTab === "property" ? (
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
        )
      ) : (
        <PropertyReviewSection
          propertyId={propertyId}
          propertyTitle={propertyTitle}
          onViewAllClick={onViewAllPropertyReviews}
        />
      )}
    </div>
  );
};
