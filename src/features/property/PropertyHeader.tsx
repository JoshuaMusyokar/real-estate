import {
  Calendar,
  Clock,
  Edit,
  Eye,
  MapPin,
  Share2,
  Shield,
  Trash2,
  MoreVertical,
  Star,
} from "lucide-react";
import { useState, type FC } from "react";
import type { Property } from "../../types";
import { useAuth } from "../../hooks/useAuth";
import { QuickReviewActions } from "./QuickReviewAction";
import { Card, CardContent } from "../../components/ui/Card";
import { Dropdown } from "../../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../../components/ui/dropdown/DropdownItem";

interface PropertyHeaderProps {
  property: Property;
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onFeaturedToggle?: (propertyId: string, isFeatured: boolean) => void;
}

export const PropertyHeader: FC<PropertyHeaderProps> = ({
  property,
  isOwner,
  onEdit,
  onDelete,
  onFeaturedToggle,
}) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const { user } = useAuth();
  const userRole = user?.role.name || "BUYER";

  const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";
  const canEdit = isOwner || isAdmin;

  const handleShare = (type: "link" | "email" | "whatsapp") => {
    const url = window.location.href;

    switch (type) {
      case "link":
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
        break;
      case "email":
        window.location.href = `mailto:?subject=${encodeURIComponent(property.title)}&body=${encodeURIComponent(url)}`;
        break;
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`Check out this property: ${property.title} - ${url}`)}`,
          "_blank",
        );
        break;
    }
    setShowShareMenu(false);
  };

  const handleFeaturedToggle = () => {
    if (onFeaturedToggle) {
      onFeaturedToggle(property.id, !property.featured);
    }
  };

  return (
    <Card className="mb-4 sm:mb-6 md:mb-8">
      <CardContent className="p-4 sm:p-5 md:p-6">
        <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
          {/* Top Section: Badges and Actions */}
          <div className="flex items-start justify-between gap-3">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {property.featured && (
                <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold">
                  <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                  FEATURED
                </span>
              )}
              {property.verified && (
                <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-600 text-white rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold">
                  <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  VERIFIED
                </span>
              )}
              <span
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold ${
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

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Desktop Actions */}
              {canEdit && (
                <>
                  <button
                    onClick={onEdit}
                    className="hidden sm:flex w-10 h-10 md:w-12 md:h-12 bg-blue-50 text-blue-600 rounded-lg md:rounded-xl items-center justify-center hover:bg-blue-100 transition-colors"
                    title="Edit property"
                  >
                    <Edit className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <button
                    onClick={onDelete}
                    className="hidden sm:flex w-10 h-10 md:w-12 md:h-12 bg-red-50 text-red-600 rounded-lg md:rounded-xl items-center justify-center hover:bg-red-100 transition-colors"
                    title="Delete property"
                  >
                    <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </>
              )}

              {/* Share Button */}
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-100 text-gray-600 rounded-lg md:rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
                  title="Share property"
                >
                  <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <Dropdown
                  isOpen={showShareMenu}
                  onClose={() => setShowShareMenu(false)}
                  className="w-48"
                >
                  <div className="py-1">
                    <DropdownItem onClick={() => handleShare("link")}>
                      Copy Link
                    </DropdownItem>
                    <DropdownItem onClick={() => handleShare("email")}>
                      Share via Email
                    </DropdownItem>
                    <DropdownItem onClick={() => handleShare("whatsapp")}>
                      Share on WhatsApp
                    </DropdownItem>
                  </div>
                </Dropdown>
              </div>

              {/* Mobile Actions Menu */}
              {canEdit && (
                <div className="relative sm:hidden">
                  <button
                    onClick={() => setShowActionsMenu(!showActionsMenu)}
                    className="dropdown-toggle w-9 h-9 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                    title="More actions"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  <Dropdown
                    isOpen={showActionsMenu}
                    onClose={() => setShowActionsMenu(false)}
                    className="w-44"
                  >
                    <div className="py-1">
                      {isAdmin && (
                        <>
                          <div className="px-3 py-1.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                            Admin Actions
                          </div>
                          <DropdownItem
                            onClick={() => {
                              handleFeaturedToggle();
                              setShowActionsMenu(false);
                            }}
                            className="text-amber-600 hover:bg-amber-50"
                          >
                            <Star
                              className={`w-4 h-4 inline mr-2 ${
                                property.featured ? "fill-current" : ""
                              }`}
                            />
                            {property.featured ? "Unfeature" : "Feature"}
                          </DropdownItem>
                          <div className="border-t border-gray-100 my-1" />
                        </>
                      )}
                      <DropdownItem
                        onClick={() => {
                          onEdit();
                          setShowActionsMenu(false);
                        }}
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4 inline mr-2" />
                        Edit
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => {
                          onDelete();
                          setShowActionsMenu(false);
                        }}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 inline mr-2" />
                        Delete
                      </DropdownItem>
                    </div>
                  </Dropdown>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
              {property.title}
            </h1>

            {/* Location */}
            <div className="flex items-start gap-1.5 sm:gap-2 text-gray-600">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base md:text-lg">
                {property.address}, {property.locality}, {property.city.name}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-gray-600 pb-4 border-b border-gray-200">
            <span className="flex items-center gap-1.5 sm:gap-2">
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
              <span className="hidden sm:inline">
                {property.viewCount} views
              </span>
              <span className="sm:hidden">{property.viewCount}</span>
            </span>
            <span className="flex items-center gap-1.5 sm:gap-2">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
              <span className="hidden md:inline">
                Listed {new Date(property.createdAt).toLocaleDateString()}
              </span>
              <span className="md:hidden">
                {new Date(property.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </span>
            <span className="flex items-center gap-1.5 sm:gap-2">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
              <span className="hidden md:inline">
                Updated {new Date(property.updatedAt).toLocaleDateString()}
              </span>
              <span className="md:hidden">
                Updated{" "}
                {new Date(property.updatedAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </span>
          </div>

          {/* Admin Quick Review Actions */}
          {isAdmin && (
            <div className="pt-2">
              <QuickReviewActions property={property} onSuccess={() => {}} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
