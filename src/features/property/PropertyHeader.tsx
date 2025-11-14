/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Calendar,
  Clock,
  Edit,
  Eye,
  Heart,
  MapPin,
  Share2,
  Shield,
  Trash2,
} from "lucide-react";
import { useState, type FC } from "react";
import type { Property } from "../../types";
interface PropertyHeaderProps {
  property: Property;
  userRole?: string;
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
}
export const PropertyHeader: FC<PropertyHeaderProps> = ({
  property,
  userRole,
  isOwner,
  onEdit,
  onDelete,
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const canEdit = isOwner || userRole === "ADMIN" || userRole === "SUPER_ADMIN";

  return (
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-3">
          {property.featured && (
            <span className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-xs font-bold">
              FEATURED
            </span>
          )}
          {property.verified && (
            <span className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              VERIFIED
            </span>
          )}
          <span
            className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
              property.status === "AVAILABLE"
                ? "bg-emerald-50 text-emerald-700"
                : property.status === "SOLD"
                ? "bg-gray-100 text-gray-700"
                : property.status === "RENTED"
                ? "bg-blue-50 text-blue-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {property.status}
          </span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          {property.title}
        </h1>

        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <MapPin className="w-5 h-5 text-gray-400" />
          <span className="text-lg">
            {property.address}, {property.locality}, {property.city}
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-600">
          <span className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            {property.viewCount} views
          </span>
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Listed {new Date(property.createdAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Updated {new Date(property.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {canEdit && (
          <>
            <button
              onClick={onEdit}
              className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-100 transition-colors"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={onDelete}
              className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </>
        )}

        {/* <button
          onClick={() => setIsSaved(!isSaved)}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
            isSaved
              ? "bg-red-50 text-red-600"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Heart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
        </button> */}

        <div className="relative">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="w-12 h-12 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
          {showShareMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowShareMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-20">
                <button className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-sm font-medium">
                  Copy Link
                </button>
                <button className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-sm font-medium">
                  Share via Email
                </button>
                <button className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-sm font-medium">
                  Share on WhatsApp
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
