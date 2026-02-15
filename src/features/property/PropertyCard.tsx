import { useState, type FC } from "react";
import type { Property } from "../../types";
import {
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  MapPin,
  Home,
  Calendar,
  Star,
} from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { QuickReviewActions } from "./QuickReviewAction";
import { getCurrencySymbol } from "../../utils/currency-utils";
import { useAuth } from "../../hooks/useAuth";
import { FeaturedToggle } from "./components/FeaturedToggle";
import { FeaturedBadge } from "./components/FeaturedBadge";
import { Card, CardContent, CardFooter } from "../../components/ui/Card";

interface PropertyCardProps {
  property: Property;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onFeaturedToggle?: (propertyId: string, isFeatured: boolean) => void;
}

export const PropertyCard: FC<PropertyCardProps> = ({
  property,
  onEdit,
  onDelete,
  onView,
  onFeaturedToggle,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const { user } = useAuth();

  const coverImage =
    property.images?.find((img) => img.isCover)?.viewableUrl ||
    property.images?.[0]?.viewableUrl;

  const isAdmin =
    user?.role.name === "ADMIN" || user?.role.name === "SUPER_ADMIN";

  const handleFeaturedToggle = () => {
    if (onFeaturedToggle) {
      onFeaturedToggle(property.id, !property.featured);
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300">
      {/* Image Section */}
      <div className="relative h-32 sm:h-40 md:h-48 lg:h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Home className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 text-gray-300" />
          </div>
        )}

        {/* Featured badge */}
        {property.featured && (
          <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 md:top-3 md:left-3 z-10">
            <FeaturedBadge compact />
          </div>
        )}

        {/* Menu button */}
        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 md:top-3 md:right-3 relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-white/95 backdrop-blur-sm rounded-lg hover:bg-white transition-colors shadow-lg flex items-center justify-center"
          >
            <MoreVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" />
          </button>
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-44 sm:w-48 md:w-56 bg-white rounded-lg sm:rounded-xl shadow-2xl border border-gray-100 py-1 z-20 overflow-hidden">
                {/* Admin actions section */}
                {isAdmin && (
                  <>
                    <div className="px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                      Admin Actions
                    </div>
                    <button
                      onClick={() => {
                        setShowReviewModal(true);
                        setShowMenu(false);
                      }}
                      className="w-full px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 text-left text-xs sm:text-sm hover:bg-blue-50 flex items-center gap-2 text-blue-600 font-medium transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Review
                      Property
                    </button>
                    <button
                      onClick={() => {
                        handleFeaturedToggle();
                        setShowMenu(false);
                      }}
                      className="w-full px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 text-left text-xs sm:text-sm hover:bg-amber-50 flex items-center gap-2 text-amber-600 font-medium transition-colors"
                    >
                      <Star
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                          property.featured ? "fill-current" : ""
                        }`}
                      />
                      <span className="hidden sm:inline">
                        {property.featured
                          ? "Remove from Featured"
                          : "Add to Featured"}
                      </span>
                      <span className="sm:hidden">
                        {property.featured ? "Unfeature" : "Feature"}
                      </span>
                    </button>
                    <div className="border-t border-gray-100 my-1" />
                  </>
                )}

                {/* Regular actions */}
                <button
                  onClick={() => {
                    onView(property.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 text-left text-xs sm:text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700 font-medium transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> View Details
                </button>
                <button
                  onClick={() => {
                    onEdit(property.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 text-left text-xs sm:text-sm hover:bg-blue-50 flex items-center gap-2 text-blue-600 font-medium transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Edit Property
                </button>
                <div className="border-t border-gray-100 my-1" />
                <button
                  onClick={() => {
                    onDelete(property.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 text-left text-xs sm:text-sm hover:bg-red-50 flex items-center gap-2 text-red-600 font-medium transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="p-2.5 sm:p-3 md:p-4 lg:p-5">
        <div className="flex items-start justify-between gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 md:mb-3">
          <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-900 line-clamp-1 flex-1 group-hover:text-blue-600 transition-colors">
            {property.title}
          </h3>
          {/* Inline featured toggle for admins */}
          {isAdmin && (
            <FeaturedToggle
              propertyId={property.id}
              isFeatured={property.featured}
              compact
              onToggle={handleFeaturedToggle}
            />
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 text-gray-600 text-[11px] sm:text-xs md:text-sm mb-2 sm:mb-3 md:mb-4">
          <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 flex-shrink-0" />
          <span className="line-clamp-1">
            {property.locality}, {property.city.name}
          </span>
        </div>

        {/* Property details */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-5 text-[11px] sm:text-xs md:text-sm text-gray-600 mb-2 sm:mb-3 md:mb-4 pb-2 sm:pb-3 md:pb-4 border-b border-gray-100">
          {property.bedrooms && (
            <span className="flex items-center gap-0.5 sm:gap-1 md:gap-1.5 font-medium">
              <Home className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-gray-400" />{" "}
              {property.bedrooms}
            </span>
          )}
          {property.bathrooms && (
            <span className="font-medium">{property.bathrooms} bath</span>
          )}
          {property.squareFeet && (
            <span className="font-medium hidden sm:inline">
              {property.squareFeet.toLocaleString()} sqft
            </span>
          )}
        </div>

        {/* Price and status */}
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 truncate">
              {getCurrencySymbol(property.currency)}
              {property.price.toLocaleString()}
            </div>
            <div className="text-[10px] sm:text-xs text-gray-500 uppercase font-semibold mt-0.5">
              {property.purpose}
            </div>
          </div>
          <StatusBadge status={property.status} />
        </div>
      </CardContent>

      {/* Footer Section */}
      <CardFooter className="p-2.5 sm:p-3 md:p-4 lg:px-5 lg:py-4">
        {/* View details button - visible on mobile */}
        <button
          onClick={() => onView(property.id)}
          className="w-full sm:hidden mb-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
        >
          <Eye className="w-3.5 h-3.5" /> View Details
        </button>

        {/* Stats */}
        <div className="flex items-center justify-between text-[10px] sm:text-xs">
          <span className="flex items-center gap-0.5 sm:gap-1 md:gap-1.5 text-gray-500">
            <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {property.viewCount}
          </span>
          <span className="flex items-center gap-0.5 sm:gap-1 md:gap-1.5 text-gray-500">
            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />{" "}
            <span className="hidden sm:inline">
              {new Date(property.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="sm:hidden">
              {new Date(property.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </span>
          </span>
        </div>

        {/* Admin quick actions */}
        {isAdmin && (
          <div className="mt-2 sm:mt-3 md:mt-4 pt-2 sm:pt-3 md:pt-4 border-t border-gray-100">
            <QuickReviewActions property={property} onSuccess={() => {}} />
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
