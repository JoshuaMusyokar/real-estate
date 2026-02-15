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
import { FileText, BarChart3, Eye, MessageSquare, Share2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import Button from "../../components/ui/button/Button";

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
    },
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
          "The property has been successfully deleted.",
        );
        // Navigate to properties list
      } catch (err) {
        showError(
          "Delete failed",
          "Failed to delete the property. Please try again.",
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
    <>
      {/* Breadcrumb */}
      <Breadcrumb property={property} />

      <div className="max-w-full mx-auto">
        {/* Image Gallery - Full Width */}
        <div className="mb-3 sm:mb-4 md:mb-6">
          <ImageGallery
            images={property.images || []}
            title={property.title}
            propertyId={property.id}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 xl:col-span-3 space-y-3 sm:space-y-4 md:space-y-6">
            {/* Header */}
            <PropertyHeader
              property={property}
              isOwner={isOwner}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            {/* Stats */}
            <PropertyStats property={property} />

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
          <div className="lg:col-span-1 xl:col-span-1">
            <div className="sticky top-3 sm:top-4 md:top-6 space-y-3 sm:space-y-4 md:space-y-6">
              {/* Quick Stats - Mobile Compact Version */}
              <Card className="lg:hidden">
                <CardContent className="p-3 sm:p-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                        {property.viewCount}
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                        Views
                      </div>
                    </div>
                    <div className="text-center border-x border-gray-200 dark:border-gray-700">
                      <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                        {property.inquiryCount}
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                        Inquiries
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                        {property.shareCount}
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                        Shares
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Property Actions */}
              <Card>
                <CardHeader className="p-3 sm:p-4 md:p-5 lg:p-6">
                  <CardTitle className="text-base sm:text-lg font-semibold">
                    Property Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 md:p-5 lg:p-6 pt-0">
                  <div className="space-y-2 sm:space-y-3">
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full"
                      startIcon={<FileText className="w-4 h-4" />}
                    >
                      <span className="hidden sm:inline">Generate Report</span>
                      <span className="sm:hidden">Report</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="md"
                      className="w-full"
                      startIcon={<BarChart3 className="w-4 h-4" />}
                    >
                      <span className="hidden sm:inline">View Analytics</span>
                      <span className="sm:hidden">Analytics</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats - Desktop Version */}
              <Card className="hidden lg:block">
                <CardHeader className="p-4 md:p-5 lg:p-6">
                  <CardTitle className="text-base sm:text-lg font-semibold">
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-5 lg:p-6 pt-0">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Views
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {property.viewCount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Inquiries
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {property.inquiryCount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <Share2 className="w-4 h-4" />
                        Shares
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {property.shareCount}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status Badge */}
              <Card>
                <CardHeader className="p-3 sm:p-4 md:p-5 lg:p-6">
                  <CardTitle className="text-base sm:text-lg font-semibold">
                    Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 md:p-5 lg:p-6 pt-0">
                  <div
                    className={`inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium ${
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
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
