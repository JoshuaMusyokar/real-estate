import React, { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Loader2,
  MessageSquare,
  MapPin,
  Home,
  DollarSign,
  User,
  Mail,
  Phone,
  X,
  FileText,
  Shield,
} from "lucide-react";
import { useReviewPropertyMutation } from "../../services/propertyApi";
import type { Property, PropertyStatus } from "../../types";

interface ReviewPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  onSuccess: () => void;
}

export const ReviewPropertyModal: React.FC<ReviewPropertyModalProps> = ({
  isOpen,
  onClose,
  property,
  onSuccess,
}) => {
  const [reviewProperty, { isLoading }] = useReviewPropertyMutation();
  const [selectedStatus, setSelectedStatus] =
    useState<PropertyStatus>("AVAILABLE");
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState("");

  const handleReview = async () => {
    if (selectedStatus === "REJECTED" && !rejectionReason.trim()) {
      setError("Please provide a reason for rejection");
      return;
    }

    try {
      await reviewProperty({
        id: property.id,
        status: selectedStatus,
        rejectionReason:
          selectedStatus === "REJECTED" ? rejectionReason : undefined,
      }).unwrap();

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to review property:", err);
      setError("Failed to review property. Please try again.");
    }
  };

  if (!isOpen) return null;

  const coverImage =
    property.images?.find((img) => img.isCover)?.url ||
    property.images?.[0]?.url;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">Review Property</h2>
              <p className="text-blue-100 text-sm">
                Approve or reject this listing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* Left Column - Property Details */}
            <div className="space-y-6">
              {/* Property Image */}
              <div className="relative h-64 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden">
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Home className="w-20 h-20 text-gray-400" />
                  </div>
                )}
                {property.featured && (
                  <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-xs font-bold shadow-lg">
                    FEATURED
                  </div>
                )}
              </div>

              {/* Property Info */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-3">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {property.title}
                </h3>

                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {property.locality}, {property.city}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Home className="w-4 h-4" />
                  <span>
                    {property.propertyType} • {property.purpose}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${property.price.toLocaleString()}
                  </span>
                </div>

                {(property.bedrooms ||
                  property.bathrooms ||
                  property.squareFeet) && (
                  <div className="flex gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                    {property.bedrooms && (
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {property.bedrooms} Beds
                      </span>
                    )}
                    {property.bathrooms && (
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {property.bathrooms} Baths
                      </span>
                    )}
                    {property.squareFeet && (
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {property.squareFeet.toLocaleString()} sqft
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Description
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Owner Details */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Owner Information
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <User className="w-4 h-4" />
                    <span>{property.ownerName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span>{property.ownerEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span>{property.ownerPhone}</span>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Submitted
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {new Date(property.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Views</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {property.viewCount}
                    </p>
                  </div>
                  {property.images && (
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Images</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {property.images.length} photos
                      </p>
                    </div>
                  )}
                  {property.amenities && (
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Amenities
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {property.amenities.length} items
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Review Actions */}
            <div className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-red-700 dark:text-red-400">
                    {error}
                  </span>
                </div>
              )}

              {/* Current Status */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Current Status
                </h4>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg text-sm font-semibold">
                    {property.status}
                  </span>
                </div>
              </div>

              {/* Review Decision */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Review Decision
                </h4>

                <div className="space-y-3">
                  {/* Approve Option */}
                  <button
                    onClick={() => {
                      setSelectedStatus("AVAILABLE");
                      setRejectionReason("");
                      setError("");
                    }}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                      selectedStatus === "AVAILABLE"
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-green-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle
                        className={`w-6 h-6 flex-shrink-0 ${
                          selectedStatus === "AVAILABLE"
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      />
                      <div>
                        <p
                          className={`font-semibold ${
                            selectedStatus === "AVAILABLE"
                              ? "text-green-700 dark:text-green-400"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          Approve Property
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Property will be visible to all users and marked as
                          available
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Reject Option */}
                  <button
                    onClick={() => {
                      setSelectedStatus("REJECTED");
                      setError("");
                    }}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                      selectedStatus === "REJECTED"
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-red-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <XCircle
                        className={`w-6 h-6 flex-shrink-0 ${
                          selectedStatus === "REJECTED"
                            ? "text-red-600"
                            : "text-gray-400"
                        }`}
                      />
                      <div>
                        <p
                          className={`font-semibold ${
                            selectedStatus === "REJECTED"
                              ? "text-red-700 dark:text-red-400"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          Reject Property
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Property will be rejected and owner will be notified
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Rejection Reason */}
              {selectedStatus === "REJECTED" && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
                  <label className="block font-semibold text-red-900 dark:text-red-300 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Rejection Reason *
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please provide a detailed reason for rejection..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-red-300 dark:border-red-700 dark:bg-red-900/30 dark:text-white rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  />
                  <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                    This message will be sent to the property owner
                  </p>
                </div>
              )}

              {/* Review Guidelines */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Review Guidelines
                </h4>
                <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">
                      •
                    </span>
                    <span>
                      Verify all property details are accurate and complete
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">
                      •
                    </span>
                    <span>Check images are clear and appropriate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">
                      •
                    </span>
                    <span>Ensure pricing is reasonable for the market</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">
                      •
                    </span>
                    <span>Validate owner contact information</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex gap-4 bg-gray-50 dark:bg-gray-900">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleReview}
            disabled={
              isLoading ||
              (selectedStatus === "REJECTED" && !rejectionReason.trim())
            }
            className={`flex-1 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
              selectedStatus === "AVAILABLE"
                ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                : "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {selectedStatus === "AVAILABLE" ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Approve Property
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5" />
                    Reject Property
                  </>
                )}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
