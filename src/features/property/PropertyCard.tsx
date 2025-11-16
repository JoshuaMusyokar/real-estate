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
} from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { ReviewPropertyModal } from "./ReviewPropertyModal";
import { QuickReviewActions } from "./QuickReviewAction";
import { getCurrencySymbol } from "../../utils/currency-utils";

interface PropertyCardProps {
  property: Property;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

export const PropertyCard: FC<PropertyCardProps> = ({
  property,
  onEdit,
  onDelete,
  onView,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  // const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const coverImage =
    property.images?.find((img) => img.isCover)?.viewableUrl ||
    property.images?.[0]?.viewableUrl;

  return (
    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300">
      <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Home className="w-16 h-16 text-gray-300" />
          </div>
        )}
        {property.featured && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-xs font-bold shadow-lg">
            FEATURED
          </div>
        )}
        <div className="absolute top-3 right-3 relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-9 h-9 bg-white/95 backdrop-blur-sm rounded-lg hover:bg-white transition-colors shadow-lg flex items-center justify-center"
          >
            <MoreVertical className="w-4 h-4 text-gray-700" />
          </button>
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-1 z-20 overflow-hidden">
                <button
                  onClick={() => {
                    onView(property.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-gray-700 font-medium transition-colors"
                >
                  <Eye className="w-4 h-4" /> View Details
                </button>
                <button
                  onClick={() => {
                    onEdit(property.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-blue-50 flex items-center gap-3 text-blue-600 font-medium transition-colors"
                >
                  <Edit2 className="w-4 h-4" /> Edit Property
                </button>
                <div className="border-t border-gray-100 my-1" />
                <button
                  onClick={() => {
                    onDelete(property.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 flex items-center gap-3 text-red-600 font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1 flex-1 pr-2 group-hover:text-blue-600 transition-colors">
            {property.title}
          </h3>
        </div>

        <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="line-clamp-1">
            {property.locality}, {property.city}
          </span>
        </div>

        <div className="flex items-center gap-5 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
          {property.bedrooms && (
            <span className="flex items-center gap-1.5 font-medium">
              <Home className="w-4 h-4 text-gray-400" /> {property.bedrooms}
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
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {getCurrencySymbol(property.currency)}
              {property.price.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 uppercase font-semibold mt-0.5">
              {property.purpose}
            </div>
          </div>
          <StatusBadge status={property.status} />
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 text-xs">
          <span className="flex items-center gap-1.5 text-gray-500">
            <Eye className="w-3.5 h-3.5" /> {property.viewCount} views
          </span>
          <span className="flex items-center gap-1.5 text-gray-500">
            <Calendar className="w-3.5 h-3.5" />{" "}
            {new Date(property.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 text-xs">
          <QuickReviewActions
            property={property}
            /*onSuccess={() => refetch()}*/ onSuccess={() => {}}
          />
        </div>
      </div>
      <ReviewPropertyModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        property={property!}
        // onSuccess={() => refetch()}
        onSuccess={() => {}}
      />
    </div>
  );
};
