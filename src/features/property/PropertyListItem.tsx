import { Eye, Home, MapPin } from "lucide-react";
import type { FC } from "react";
import type { Property } from "../../types";
import { StatusBadge } from "./StatusBadge";
interface PropertyListItemProps {
  property: Property;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

export const PropertyListItem: FC<PropertyListItemProps> = ({
  property,
  onEdit,
  onDelete,
  onView,
}) => {
  const coverImage =
    property.images?.find((img) => img.isCover)?.url ||
    property.images?.[0]?.url;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-gray-300 transition-all duration-300">
      <div className="flex gap-5">
        <div className="relative w-56 h-36 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
          {coverImage ? (
            <img
              src={coverImage}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Home className="w-12 h-12 text-gray-300" />
            </div>
          )}
          {property.featured && (
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded text-xs font-bold">
              FEATURED
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0 pr-4">
              <h3 className="font-bold text-xl text-gray-900 mb-1 line-clamp-1 hover:text-blue-600 transition-colors cursor-pointer">
                {property.title}
              </h3>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="line-clamp-1">
                  {property.locality}, {property.city}
                </span>
              </div>
            </div>
            <StatusBadge status={property.status} />
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600 mb-3 flex-wrap">
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
              <span className="text-2xl font-bold text-gray-900">
                ${property.price.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 uppercase font-semibold">
                {property.purpose}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onView(property.id)}
                className="px-4 py-2 text-sm text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                View
              </button>
              <button
                onClick={() => onEdit(property.id)}
                className="px-4 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(property.id)}
                className="px-4 py-2 text-sm text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
