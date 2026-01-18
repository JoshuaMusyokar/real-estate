import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useDeleteContentMutation,
  useDuplicateContentMutation,
  useGetContentQuery,
  useToggleContentStatusMutation,
  useToggleFeaturedStatusMutation,
} from "../../services/cmsApi";
import { Skeleton } from "../../components/ui/skeleton";
import { AlertCircle, Loader2 } from "lucide-react";
import { ContentHeader } from "./ContentHeader";
import { ContentPreviewCard } from "./ContentPreviewCard";
import { ContentMediaSection } from "./ContentMediaSection";
import { ContentInfoCard } from "./ContentInfoCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { ContentSEOCard } from "./ContentSEOCard";
import { useToast } from "../../hooks/useToast";

export const ContentDetailsPage: React.FC = () => {
  const { contentId } = useParams<{ contentId: string }>();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // API Hooks
  const {
    data: contentData,
    isLoading,
    error,
    refetch,
  } = useGetContentQuery(contentId!, { skip: !contentId });

  const [deleteContent, { isLoading: isDeleting }] = useDeleteContentMutation();
  const [toggleStatus, { isLoading: isTogglingStatus }] =
    useToggleContentStatusMutation();
  const [toggleFeatured, { isLoading: isTogglingFeatured }] =
    useToggleFeaturedStatusMutation();
  const [duplicateContent, { isLoading: isDuplicating }] =
    useDuplicateContentMutation();
  const { success, error: showError } = useToast();

  const content = contentData?.data;
  const isProcessing =
    isDeleting || isTogglingStatus || isTogglingFeatured || isDuplicating;

  // Handlers
  const handleEdit = () => {
    navigate(`/cms/edit/${contentId}`);
  };

  const handleDelete = async () => {
    if (!contentId) return;

    try {
      await deleteContent(contentId).unwrap();
      success("Content deleted successfully");
      navigate("/cms");
    } catch (error: any) {
      showError(error?.data?.message || "Failed to delete content");
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!contentId) return;

    try {
      await toggleStatus(contentId).unwrap();
      success("Content status updated successfully");
      refetch();
    } catch (error: any) {
      showError(error?.data?.message || "Failed to update status");
    }
  };

  const handleToggleFeatured = async () => {
    if (!contentId) return;

    try {
      await toggleFeatured(contentId).unwrap();
      success(
        content?.isFeatured ? "Removed from featured" : "Marked as featured",
      );
      refetch();
    } catch (error: any) {
      showError(error?.data?.message || "Failed to update featured status");
    }
  };

  const handleDuplicate = async () => {
    if (!contentId) return;

    try {
      const result = await duplicateContent(contentId).unwrap();

      success("Content duplicated successfully");
      navigate(`/cms/view/${result.data?.id}`);
    } catch (error: any) {
      showError(error?.data?.message || "Failed to duplicate content");
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-96" />
              <Skeleton className="h-64" />
            </div>
            <div className="lg:col-span-1 space-y-6">
              <Skeleton className="h-96" />
              <Skeleton className="h-64" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Content Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The content you're looking for doesn't exist or has been deleted.
          </p>
          <button
            onClick={() => navigate("/admin/cms/content")}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Back to Content List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ContentHeader
        content={content}
        onEdit={handleEdit}
        onDelete={() => setShowDeleteDialog(true)}
        onDuplicate={handleDuplicate}
        onToggleStatus={handleToggleStatus}
        onToggleFeatured={handleToggleFeatured}
        isLoading={isProcessing}
      />

      {/* Loading Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-4">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <p className="text-gray-900 font-medium">Processing...</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Content Preview */}
            <ContentPreviewCard content={content} />

            {/* Media Section */}
            <ContentMediaSection content={content} />

            {/* SEO Card */}
            <ContentSEOCard content={content} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Content Info */}
            <ContentInfoCard content={content} />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{content.title}". This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
