import {
  Eye,
  Home,
  MapPin,
  Star,
  MoreVertical,
  Edit2,
  Trash2,
} from "lucide-react";
import { useState, type FC } from "react";
import type { Property } from "../../types";
import { StatusBadge } from "./StatusBadge";
import { QuickReviewActions } from "./QuickReviewAction";
import { useAuth } from "../../hooks/useAuth";
import { getCurrencySymbol } from "../../utils/currency-utils";
import { FeaturedToggle } from "./components/FeaturedToggle";
import { Card } from "../../components/ui/Card";

interface PropertyListItemProps {
  property: Property;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onFeaturedToggle?: (propertyId: string, isFeatured: boolean) => void;
}

export const PropertyListItem: FC<PropertyListItemProps> = ({
  property,
  onEdit,
  onDelete,
  onView,
  onFeaturedToggle,
}) => {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

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
    <Card className="hover:shadow-lg hover:border-gray-300 transition-all duration-300 overflow-hidden">
      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="flex gap-3 p-3">
          {/* Image */}
          <div className="relative w-24 h-24 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
            {coverImage ? (
              <img
                src={coverImage}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Home className="w-8 h-8 text-gray-300" />
              </div>
            )}
            {property.featured && (
              <div className="absolute top-1 left-1">
                <div className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded text-xs font-bold">
                  <Star className="w-2.5 h-2.5 fill-current" />
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3
                onClick={() => onView(property.slug)}
                className="font-bold text-sm text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer flex-1"
              >
                {property.title}
              </h3>
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center"
                >
                  <MoreVertical className="w-4 h-4 text-gray-600" />
                </button>
                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-20">
                      <button
                        onClick={() => {
                          onView(property.slug);
                          setShowMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                      <button
                        onClick={() => {
                          onEdit(property.id);
                          setShowMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50 flex items-center gap-2 text-blue-600"
                      >
                        <Edit2 className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => {
                          onDelete(property.id);
                          setShowMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 flex items-center gap-2 text-red-600"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-gray-600 text-xs mb-2">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="line-clamp-1">
                {property.locality}, {property.city.name}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
              {property.bedrooms && (
                <span className="flex items-center gap-1">
                  <Home className="w-3 h-3 text-gray-400" /> {property.bedrooms}
                </span>
              )}
              {property.bathrooms && <span>{property.bathrooms} bath</span>}
            </div>

            <div className="flex items-center justify-between mt-auto">
              <div>
                <div className="text-lg font-bold text-gray-900">
                  {getCurrencySymbol(property.currency)}
                  {property.price.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 uppercase">
                  {property.purpose}
                </div>
              </div>
              <StatusBadge status={property.status} />
            </div>
          </div>
        </div>

        {/* Mobile footer */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" /> {property.viewCount}
          </span>
          {isAdmin && (
            <FeaturedToggle
              propertyId={property.id}
              isFeatured={property.featured}
              compact
              onToggle={handleFeaturedToggle}
            />
          )}
        </div>

        {isAdmin && (
          <div className="px-3 pb-3">
            <QuickReviewActions property={property} onSuccess={() => {}} />
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="flex gap-4 lg:gap-5 p-4 lg:p-5">
          <div className="relative w-40 lg:w-56 h-28 lg:h-36 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
            {coverImage ? (
              <img
                src={coverImage}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Home className="w-10 lg:w-12 h-10 lg:h-12 text-gray-300" />
              </div>
            )}
            {property.featured && (
              <div className="absolute top-2 left-2">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded text-xs font-bold">
                  <Star className="w-3 h-3 fill-current" />
                  <span>FEATURED</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-1">
                  <h3
                    onClick={() => onView(property.slug)}
                    className="font-bold text-lg lg:text-xl text-gray-900 line-clamp-1 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    {property.title}
                  </h3>
                  {isAdmin && (
                    <FeaturedToggle
                      propertyId={property.id}
                      isFeatured={property.featured}
                      compact
                      onToggle={handleFeaturedToggle}
                    />
                  )}
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="line-clamp-1">
                    {property.locality}, {property.city.name}
                  </span>
                </div>
              </div>
              <StatusBadge status={property.status} />
            </div>

            <div className="flex items-center gap-4 lg:gap-6 text-sm text-gray-600 mb-3 flex-wrap">
              {property.bedrooms && (
                <span className="flex items-center gap-1.5 font-medium">
                  <Home className="w-4 h-4 text-gray-400" /> {property.bedrooms}{" "}
                  bed
                </span>
              )}
              {property.bathrooms && (
                <span className="font-medium">{property.bathrooms} bath</span>
              )}
              {property.squareFeet && (
                <span className="font-medium">
                  {property.squareFeet.toLocaleString()} sqft
                </span>
              )}
              <span className="flex items-center gap-1.5 text-gray-500 ml-auto">
                <Eye className="w-4 h-4" /> {property.viewCount} views
              </span>
            </div>

            <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
              <div className="flex items-baseline gap-2">
                <span className="text-xl lg:text-2xl font-bold text-gray-900">
                  {getCurrencySymbol(property.currency)}
                  {property.price.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 uppercase font-semibold">
                  {property.purpose}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onView(property.slug)}
                  className="px-3 lg:px-4 py-2 text-sm text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                >
                  View
                </button>
                <button
                  onClick={() => onEdit(property.id)}
                  className="px-3 lg:px-4 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(property.id)}
                  className="px-3 lg:px-4 py-2 text-sm text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors"
                >
                  Delete
                </button>
                {isAdmin && (
                  <QuickReviewActions
                    property={property}
                    onSuccess={() => {}}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
