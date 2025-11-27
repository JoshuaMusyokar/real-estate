/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import type { Amenity, Role } from "../../types";
import { PropertyStats } from "./PropertyStats";
import { PropertyHeader } from "./PropertyHeader";
import { ImageGallery } from "./ImageGallery";
import { useGetPropertyAmenitiesQuery } from "../../services/AmenityApi";
import {
  useDeletePropertyMutation,
  useGetPropertyBySlugQuery,
} from "../../services/propertyApi";
import { useToast } from "../../hooks/useToast";
import { OwnerInfoSection } from "./components/OwnerInfoSection";
import { LocationSection } from "./components/LocationSection";
import { PropertyDetailsSection } from "./components/PropertyDetailSection";
import { DescriptionSection } from "./components/DescriptionSection";
import { Breadcrumb } from "./components/BreadCrump";
import { PropertyDetailError } from "./components/PropertyDetailError";
import { PropertyDetailSkeleton } from "./components/PropertyDetailSkeleton";
import { MediaSection } from "./components/MediaSection";
import { AmenitiesSection } from "./components/AmenitiesSection";
import { DocumentsSection } from "./components/DocumentSection";
import { useAuth } from "../../hooks/useAuth";

interface PropertyDetailProps {
  slug: string;
  userRole?: string;
  userId?: string;
}

export const PropertyDetail: React.FC<PropertyDetailProps> = ({
  slug,
  userId,
}) => {
  const { data, isLoading, error } = useGetPropertyBySlugQuery(slug);
  const [deleteProperty] = useDeletePropertyMutation();
  const { success, error: showError } = useToast();

  const property = data?.data;
  const propertyId = property?.id;

  const { data: amenitiesData } = useGetPropertyAmenitiesQuery(
    propertyId || "",
    {
      skip: !propertyId,
    }
  );
  const { user } = useAuth();
  const amenities: Amenity[] = amenitiesData?.data || [];
  const isOwner = userId === property?.ownerId;
  const userRole = user?.role.name || "BUYER";

  const handleEdit = () => {
    console.log("Edit property:", property?.id);
    // Navigate to edit page
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await deleteProperty(property!.id).unwrap();
        success(
          "Property deleted",
          "The property has been successfully deleted."
        );
        // Navigate to properties list
      } catch (err) {
        showError(
          "Delete failed",
          "Failed to delete the property. Please try again."
        );
      }
    }
  };

  if (isLoading) {
    return <PropertyDetailSkeleton />;
  }

  if (error || !property) {
    return <PropertyDetailError />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumb property={property} />
        </div>
      </div>

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Image Gallery - Full Width */}
        <div className="mb-6">
          <ImageGallery
            images={property.images || []}
            title={property.title}
            propertyId={property.id}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <PropertyHeader
                property={property}
                isOwner={isOwner}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>

            {/* Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <PropertyStats property={property} />
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

            {/* Description */}
            <DescriptionSection description={property.description} />

            {/* Property Details */}
            <PropertyDetailsSection property={property} />

            {/* Amenities */}
            {amenities.length > 0 && <AmenitiesSection amenities={amenities} />}

            {/* Documents */}
            {property.documents && property.documents.length > 0 && (
              <DocumentsSection documents={property.documents} />
            )}

            {/* Location */}
            <LocationSection property={property} />

            {/* Owner Info (Admin/Owner only) */}
            {(isOwner ||
              userRole === "ADMIN" ||
              userRole === "SUPER_ADMIN") && (
              <OwnerInfoSection property={property} />
            )}
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Property Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Property Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 17v-2a4 4 0 014-4h4M9 17V9a4 4 0 014-4h4M9 17H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-4"
                      />
                    </svg>
                    Generate Report
                  </button>
                  <button className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium flex items-center justify-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    View Analytics
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Views
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {property.viewCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Inquiries
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {property.inquiryCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Shares
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {property.shareCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Status
                </h3>
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    property.status === "AVAILABLE"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : property.status === "UNDER_REVIEW"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                      : property.status === "SOLD" ||
                        property.status === "RENTED"
                      ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                  }`}
                >
                  {property.status.replace("_", " ")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
