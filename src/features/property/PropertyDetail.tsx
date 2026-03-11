/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import type { Amenity } from "../../types";
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
import { usePermissions } from "../../hooks/usePermissions";
import {
  FileText,
  BarChart3,
  Eye,
  MessageSquare,
  Share2,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import Button from "../../components/ui/button/Button";

interface PropertyDetailProps {
  slug: string;
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

  const { can } = usePermissions();
  const canEdit = can("property.edit");
  const canDelete = can("property.delete");
  const canViewOwner = can("property.view_owner"); // replaces isOwner || isAdmin check
  const canViewAnalytics = can("property.view_analytics");
  const canGenerateReport = can("property.generate_report");

  const amenities: Amenity[] = amenitiesData?.data || [];

  const handleEdit = () => {
    console.log("Edit property:", property?.id);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await deleteProperty(property!.id).unwrap();
        success(
          "Property deleted",
          "The property has been successfully deleted.",
        );
      } catch {
        showError(
          "Delete failed",
          "Failed to delete the property. Please try again.",
        );
      }
    }
  };

  if (isLoading) return <PropertyDetailSkeleton />;
  if (error || !property) return <PropertyDetailError />;

  const hasAnySidebarAction =
    canEdit || canDelete || canGenerateReport || canViewAnalytics;

  return (
    <>
      <Breadcrumb property={property} />

      <div className="max-w-full mx-auto space-y-4 sm:space-y-6">
        {/* Full-width image gallery */}
        <div className="min-h-48 sm:min-h-64 md:min-h-80 lg:min-h-96 xl:min-h-[600px] overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl">
          <ImageGallery
            images={property.images || []}
            title={property.title}
            propertyId={property.id}
          />
        </div>

        {/* ── Inline action bar — shown only when user has write permissions ── */}
        {hasAnySidebarAction && (
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-auto">
              Actions
            </span>
            {canGenerateReport && (
              <Button
                variant="outline"
                size="sm"
                startIcon={<FileText className="w-4 h-4" />}
              >
                Generate Report
              </Button>
            )}
            {canViewAnalytics && (
              <Button
                variant="outline"
                size="sm"
                startIcon={<BarChart3 className="w-4 h-4" />}
              >
                View Analytics
              </Button>
            )}
            {canEdit && (
              <Button
                variant="outline"
                size="sm"
                startIcon={<Pencil className="w-4 h-4" />}
                onClick={handleEdit}
              >
                Edit
              </Button>
            )}
            {canDelete && (
              <Button
                variant="primary"
                size="sm"
                startIcon={<Trash2 className="w-4 h-4" />}
                onClick={handleDelete}
              >
                Delete
              </Button>
            )}
          </div>
        )}

        {/* ── Main two-column layout ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {/* Left — main content */}
          <div className="lg:col-span-2 xl:col-span-3 space-y-4 sm:space-y-6">
            <PropertyHeader
              property={property}
              isOwner={userId === property.ownerId}
              onEdit={canEdit ? handleEdit : undefined}
              onDelete={canDelete ? handleDelete : undefined}
            />

            <PropertyStats property={property} />

            {(property.images?.length > 0 ||
              property.youtubeVideoUrl ||
              property.virtualTourUrl) && (
              <MediaSection
                youtubeUrl={property.youtubeVideoUrl}
                virtualTourUrl={property.virtualTourUrl}
                images={property.images || []}
              />
            )}

            <DescriptionSection description={property.description} />
            <PropertyDetailsSection property={property} />
            {amenities.length > 0 && <AmenitiesSection amenities={amenities} />}
            {property.documents && property.documents.length > 0 && (
              <DocumentsSection documents={property.documents} />
            )}
            <LocationSection property={property} />

            {/* Owner info — gated on permission, not role name */}
            {canViewOwner && <OwnerInfoSection property={property} />}
          </div>

          {/* Right — sidebar */}
          <div className="lg:col-span-1 xl:col-span-1">
            <div className="sticky top-4 sm:top-6 space-y-4 sm:space-y-6">
              {/* Status */}
              <Card>
                <CardHeader className="p-4 sm:p-5">
                  <CardTitle className="text-base font-semibold">
                    Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-5 pt-0">
                  <div
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
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

              {/* Quick stats — always visible, read-only */}
              <Card>
                <CardHeader className="p-4 sm:p-5">
                  <CardTitle className="text-base font-semibold">
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-5 pt-0 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Eye className="w-4 h-4" /> Views
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {property.viewCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" /> Inquiries
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {property.inquiryCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Share2 className="w-4 h-4" /> Shares
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {property.shareCount}
                    </span>
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
