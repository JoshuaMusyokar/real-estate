/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  useCreateContentMutation,
  useUpdateContentMutation,
  useGetContentQuery,
  useGetCategoriesQuery,
  useUploadMediaMutation,
} from "../../services/cmsApi";
import type {
  CreateContentRequest,
  UpdateContentRequest,
  ContentType,
  ContentStatus,
  ContentCategory,
} from "../../types/cms";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "../../components/ui/Card";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import {
  Save,
  Upload,
  X,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Star,
  Grid,
  Clock,
  Archive,
  Loader2,
} from "lucide-react";
import { StatusBadge } from "../../components/common/StatusBadge";
import { SlugGenerator } from "../../components/common/SlugGenerator";
import TextArea from "../../components/form/input/TextArea";
import RichTextEditor from "../../components/common/RichTextEditor";
import Button from "../../components/ui/button/Button";
import { useToast } from "../../hooks/useToast";

// Content type options
const CONTENT_TYPES: Array<{ value: ContentType; label: string }> = [
  { value: "ARTICLE", label: "Article" },
  { value: "PAGE", label: "Page" },
  { value: "TOOL", label: "Tool" },
  { value: "PODCAST", label: "Podcast" },
  { value: "VIDEO", label: "Video contentt" },
  { value: "WEB_STORY", label: "Web Story" },
  { value: "MENU_ITEM", label: "Menu Item" },
  { value: "BANNER", label: "Banner" },
  { value: "FAQ", label: "FAQ" },
  { value: "TESTIMONIAL", label: "Testimonial" },
  { value: "PROMOTION", label: "Promotion" },
];

// Status options
const STATUS_OPTIONS: Array<{
  value: ContentStatus;
  label: string;
}> = [
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "ARCHIVED", label: "Archived" },
];

// Initial form state
const INITIAL_FORM_STATE = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  type: "ARTICLE" as ContentType,
  status: "DRAFT" as ContentStatus,
  metaTitle: "",
  videoUrl: "",
  audioUrl: "",
  metaDescription: "",
  keywords: [] as string[],
  order: 0,
  isFeatured: false,
  showInMenu: false,
  categoryIds: [] as string[],
  publishedAt: undefined as Date | undefined,
};

interface ContentFormProps {
  contentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface UploadedMedia {
  id: string;
  url: string;
  filename: string;
}

export const ContentForm: React.FC<ContentFormProps> = ({
  contentId,
  onSuccess,
  onCancel,
}) => {
  const isEditMode = !!contentId;

  // Form state
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [featuredImageId, setFeaturedImageId] = useState<string | null>(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<
    string | null
  >(null);
  const [galleryMediaIds, setGalleryMediaIds] = useState<string[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<UploadedMedia[]>([]);

  // UI state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [isUploadingFeatured, setIsUploadingFeatured] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // API hooks
  const { data: contentData, isLoading: isLoadingContent } = useGetContentQuery(
    contentId!,
    { skip: !contentId }
  );
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useGetCategoriesQuery();
  const [createContent, { isLoading: isCreating }] = useCreateContentMutation();
  const [updateContent, { isLoading: isUpdating }] = useUpdateContentMutation();
  const [uploadMedia] = useUploadMediaMutation();
  const { success, error: showError } = useToast();

  const isLoading = isCreating || isUpdating || isLoadingContent;
  const isUploadingAny = isUploadingFeatured || isUploadingGallery;

  const isVideo = formData.type === "VIDEO";
  const isPodcast = formData.type === "PODCAST";

  const usesRichText =
    formData.type === "ARTICLE" ||
    formData.type === "PAGE" ||
    formData.type === "WEB_STORY";

  const showGallery =
    formData.type === "ARTICLE" ||
    formData.type === "PAGE" ||
    formData.type === "WEB_STORY";
  // Load content data for editing
  useEffect(() => {
    if (contentData?.data) {
      const content = contentData.data;
      setFormData({
        title: content.title || "",
        slug: content.slug || "",
        excerpt: content.excerpt || "",
        content: content.content || "",
        type: content.type || "ARTICLE",
        status: content.status || "DRAFT",
        metaTitle: content.metaTitle || "",
        metaDescription: content.metaDescription || "",
        keywords: content.keywords || [],
        videoUrl: content.videoUrl || "",
        audioUrl: content.audioUrl || "",
        order: content.order || 0,
        isFeatured: content.isFeatured || false,
        showInMenu: content.showInMenu || false,
        categoryIds: content.categories?.map((c) => c.id) || [],
        publishedAt: content.publishedAt
          ? new Date(content.publishedAt)
          : undefined,
      });

      // Load featured image
      if (content.featuredImage) {
        setFeaturedImageId(content.featuredImage.id);
        setFeaturedImagePreview(content.featuredImage.url);
      }

      // Load gallery
      if (content.gallery && content.gallery.length > 0) {
        const galleryMedia: UploadedMedia[] = content.gallery.map((item) => ({
          id: item.media.id,
          url: item.media.url,
          filename: item.media.originalName,
        }));
        setGalleryPreviews(galleryMedia);
        setGalleryMediaIds(galleryMedia.map((m) => m.id));
      }

      setIsDirty(false);
    }
  }, [contentData]);

  // Handle form field changes
  const handleInputChange = useCallback(
    (field: keyof typeof formData, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setIsDirty(true);
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const handleCheckboxChange = useCallback(
    (field: "isFeatured" | "showInMenu", checked: boolean) => {
      setFormData((prev) => ({ ...prev, [field]: checked }));
      setIsDirty(true);
    },
    []
  );

  // Validation
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 200) {
      newErrors.title = "Title must be less than 200 characters";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug)) {
      newErrors.slug =
        "Slug can only contain lowercase letters, numbers, and hyphens";
    }

    if (isVideo && !formData.videoUrl.trim()) {
      newErrors.videoUrl = "Video URL is required for video content";
    }

    if (isPodcast && !formData.audioUrl.trim()) {
      newErrors.audioUrl = "Audio URL is required for podcast content";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }

    if (formData.excerpt && formData.excerpt.length > 500) {
      newErrors.excerpt = "Excerpt must be less than 500 characters";
    }

    if (formData.status === "SCHEDULED" && !formData.publishedAt) {
      newErrors.publishedAt = "Publish date is required for scheduled content";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showError("Please fix the errors in the form");
      return;
    }

    try {
      const requestData: CreateContentRequest = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt || undefined,
        content: formData.content,
        type: formData.type,
        status: formData.status,
        featuredImageId: featuredImageId || undefined,
        mediaIds: galleryMediaIds.length > 0 ? galleryMediaIds : undefined,
        metaTitle: formData.metaTitle || undefined,
        metaDescription: formData.metaDescription || undefined,
        keywords: formData.keywords.length > 0 ? formData.keywords : undefined,
        audioUrl: formData.audioUrl || undefined,
        videoUrl: formData.videoUrl || undefined,
        metadata: {},
        order: formData.order,
        isFeatured: formData.isFeatured,
        showInMenu: formData.showInMenu,
        categoryIds:
          formData.categoryIds.length > 0 ? formData.categoryIds : undefined,
        publishedAt: formData.publishedAt,
      };

      if (isEditMode && contentId) {
        await updateContent({
          id: contentId,
          data: requestData as UpdateContentRequest,
        }).unwrap();
        success("Content updated successfully!");
      } else {
        await createContent(requestData).unwrap();
        success("Content created successfully!");
      }

      setIsDirty(false);
      onSuccess?.();
    } catch (error: any) {
      console.error("Failed to save content:", error);
      showError(
        error?.data?.message || "Failed to save content. Please try again."
      );

      if (error.data?.errors) {
        setErrors(error.data.errors);
      }
    }
  };

  // Handle featured image upload
  const handleFeaturedImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      showError("Please select an image file");
      return;
    }

    // Create local preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setFeaturedImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server
    setIsUploadingFeatured(true);
    try {
      const result = await uploadMedia({
        file,
        folder: "content/featured",
        altText: formData.title || "Featured image",
      }).unwrap();

      if (result.data) {
        setFeaturedImageId(result.data.id);
        setFeaturedImagePreview(result.data.url);
        setIsDirty(true);
        success("Featured image uploaded successfully");
      }
    } catch (error: unknown) {
      console.error("Upload failed:", error);
      showError("Failed to upload image. Please try again.");
      setFeaturedImagePreview(null);
    } finally {
      setIsUploadingFeatured(false);
    }
  };

  // Handle gallery image upload
  const handleGalleryUpload = async (files: FileList) => {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length === 0) {
      showError("Please select image files");
      return;
    }

    setIsUploadingGallery(true);

    try {
      const uploadPromises = imageFiles.map(async (file) => {
        const result = await uploadMedia({
          file,
          folder: "content/gallery",
          altText: formData.title || "Gallery image",
        }).unwrap();

        if (result.data) {
          return {
            id: result.data.id,
            url: result.data.url,
            filename: result.data.originalName,
          };
        }
        return null;
      });

      const uploadedMedia = (await Promise.all(uploadPromises)).filter(
        (media): media is UploadedMedia => media !== null
      );

      if (uploadedMedia.length > 0) {
        setGalleryPreviews((prev) => [...prev, ...uploadedMedia]);
        setGalleryMediaIds((prev) => [
          ...prev,
          ...uploadedMedia.map((m) => m.id),
        ]);
        setIsDirty(true);
        success(`${uploadedMedia.length} image(s) uploaded successfully`);
      }
    } catch (error: unknown) {
      console.error("Gallery upload failed:", error);

      showError("Failed to upload gallery images");
    } finally {
      setIsUploadingGallery(false);
    }
  };

  // Generate slug from title
  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    handleInputChange("slug", slug);
  };

  // Remove gallery image
  const removeGalleryImage = (id: string) => {
    setGalleryPreviews((prev) => prev.filter((media) => media.id !== id));
    setGalleryMediaIds((prev) => prev.filter((mediaId) => mediaId !== id));
    setIsDirty(true);
  };

  // Remove featured image
  const removeFeaturedImage = () => {
    setFeaturedImagePreview(null);
    setFeaturedImageId(null);
    setIsDirty(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {isEditMode ? "Edit Content" : "Create New Content"}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Fill in all the details below
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {isEditMode && (
                <StatusBadge
                  status={formData.status || "DRAFT"}
                  size="lg"
                  showIcon
                />
              )}
              <div className="flex items-center space-x-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      handleCheckboxChange("isFeatured", e.target.checked)
                    }
                    className="sr-only peer"
                    disabled={isLoading}
                  />
                  <div className="relative w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    Featured
                  </span>
                </label>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Error Alert */}
          {errors.form && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-700 dark:text-red-300">
                    {errors.form}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Basic Information Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Title & Slug */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter content title"
                  error={!!errors.title}
                  hint={errors.title}
                  className="w-full"
                  disabled={isLoading}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Slug *
                  </label>
                  <SlugGenerator
                    text={formData.title}
                    onGenerate={generateSlug}
                  />
                </div>
                <Input
                  value={formData.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  placeholder="content-slug"
                  error={!!errors.slug}
                  hint={errors.slug}
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Content Type & Status */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content Type
                </label>
                <Select
                  defaultValue={formData.type}
                  onChange={(value) =>
                    handleInputChange("type", value as ContentType)
                  }
                  options={CONTENT_TYPES}
                  className="w-full"
                  // disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <Select
                  defaultValue={formData.status}
                  onChange={(value) =>
                    handleInputChange("status", value as ContentStatus)
                  }
                  options={STATUS_OPTIONS}
                  className="w-full"
                  // disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Excerpt
            </label>
            <TextArea
              value={formData.excerpt}
              onChange={(value) => handleInputChange("excerpt", value)}
              placeholder="Brief description of your content"
              rows={3}
              error={!!errors.excerpt}
              hint={errors.excerpt}
              className="w-full"
              disabled={isLoading}
            />
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {(formData.excerpt || "").length}/500 characters
            </div>
          </div>

          {isVideo && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Video URL *
              </label>
              <Input
                value={formData.videoUrl}
                onChange={(e) => handleInputChange("videoUrl", e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                error={!!errors.videoUrl}
                hint={errors.videoUrl}
              />
            </div>
          )}

          {isPodcast && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Audio URL *
              </label>
              <Input
                value={formData.audioUrl}
                onChange={(e) => handleInputChange("audioUrl", e.target.value)}
                placeholder="https://yourcdn.com/podcast.mp3"
                error={!!errors.audioUrl}
                hint={errors.audioUrl}
              />
            </div>
          )}

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content *
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(value) => handleInputChange("content", value)}
              error={errors.content}
            />
          </div>

          {/* Media Upload Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Media
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isVideo || isPodcast
                    ? "Thumbnail Image (Optional)"
                    : "Featured Image"}
                </label>
                <div className="space-y-4">
                  {featuredImagePreview ? (
                    <div className="relative group">
                      <img
                        src={featuredImagePreview}
                        alt="Featured"
                        className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                      />
                      {!isUploadingFeatured && (
                        <button
                          type="button"
                          onClick={removeFeaturedImage}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          aria-label="Remove featured image"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                      {isUploadingFeatured && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                          <Loader2 className="h-8 w-8 text-white animate-spin" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      onClick={() =>
                        !isUploadingFeatured && fileInputRef.current?.click()
                      }
                      className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors bg-gray-50 dark:bg-gray-800"
                    >
                      {isUploadingFeatured ? (
                        <Loader2 className="h-12 w-12 mx-auto text-blue-500 animate-spin mb-3" />
                      ) : (
                        <Upload className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                      )}
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {isUploadingFeatured
                          ? "Uploading..."
                          : "Upload featured image"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Recommended: 1200x630px
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files?.[0] &&
                      handleFeaturedImageUpload(e.target.files[0])
                    }
                    disabled={isUploadingFeatured || isLoading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingFeatured || isLoading}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {featuredImagePreview ? "Change Image" : "Upload Image"}
                  </Button>
                </div>
              </div>

              {/* Gallery Images */}
              {showGallery && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gallery Images
                  </label>
                  <div className="space-y-4">
                    {galleryPreviews.length > 0 ? (
                      <div className="grid grid-cols-4 gap-2">
                        {galleryPreviews.map((media) => (
                          <div key={media.id} className="relative group">
                            <img
                              src={media.url}
                              alt={media.filename}
                              className="w-full h-24 object-cover rounded border border-gray-200 dark:border-gray-700"
                            />
                            {!isUploadingGallery && (
                              <button
                                type="button"
                                onClick={() => removeGalleryImage(media.id)}
                                className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                aria-label="Remove image"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        ))}
                        {!isUploadingGallery && (
                          <div
                            onClick={() => galleryInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded h-24 flex items-center justify-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                          >
                            <Upload className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                          </div>
                        )}
                        {isUploadingGallery && (
                          <div className="border-2 border-gray-300 dark:border-gray-600 rounded h-24 flex items-center justify-center">
                            <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        onClick={() =>
                          !isUploadingGallery &&
                          galleryInputRef.current?.click()
                        }
                        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors bg-gray-50 dark:bg-gray-800"
                      >
                        {isUploadingGallery ? (
                          <Loader2 className="h-12 w-12 mx-auto text-blue-500 animate-spin mb-3" />
                        ) : (
                          <Grid className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                        )}
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {isUploadingGallery
                            ? "Uploading..."
                            : "Upload gallery images"}
                        </p>
                      </div>
                    )}
                    <input
                      ref={galleryInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) =>
                        e.target.files && handleGalleryUpload(e.target.files)
                      }
                      disabled={isUploadingGallery || isLoading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => galleryInputRef.current?.click()}
                      disabled={isUploadingGallery || isLoading}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {galleryPreviews.length > 0
                        ? "Add More Images"
                        : "Upload Gallery"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SEO & Categories Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              SEO & Categories
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* SEO Settings */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Meta Title
                  </label>
                  <Input
                    value={formData.metaTitle}
                    onChange={(e) =>
                      handleInputChange("metaTitle", e.target.value)
                    }
                    placeholder="Leave empty to use title"
                    className="w-full"
                    disabled={isLoading}
                  />
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {(formData.metaTitle || "").length}/200 characters
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Meta Description
                  </label>
                  <TextArea
                    value={formData.metaDescription}
                    onChange={(value) =>
                      handleInputChange("metaDescription", value)
                    }
                    placeholder="Leave empty to use excerpt"
                    rows={3}
                    className="w-full"
                    disabled={isLoading}
                  />
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {(formData.metaDescription || "").length}/500 characters
                  </div>
                </div>

                {/* Keywords */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Keywords (Press Enter to add)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      placeholder="Type keyword and press Enter"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const value = e.currentTarget.value.trim();
                          if (value && !formData.keywords.includes(value)) {
                            handleInputChange("keywords", [
                              ...formData.keywords,
                              value,
                            ]);
                            e.currentTarget.value = "";
                          }
                        }
                      }}
                      disabled={isLoading}
                    />
                    {formData.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          >
                            {keyword}
                            <button
                              type="button"
                              onClick={() => {
                                handleInputChange(
                                  "keywords",
                                  formData.keywords.filter(
                                    (_, i) => i !== index
                                  )
                                );
                              }}
                              className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
                              disabled={isLoading}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Categories & Settings */}
              <div className="space-y-4">
                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Categories
                  </label>
                  {isLoadingCategories ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                    </div>
                  ) : categoriesData?.data && categoriesData.data.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 border border-gray-200 dark:border-gray-700 rounded-md p-3">
                      {categoriesData.data.map((category: ContentCategory) => (
                        <label
                          key={category.id}
                          className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.categoryIds.includes(category.id)}
                            onChange={(e) => {
                              const newCategoryIds = e.target.checked
                                ? [...formData.categoryIds, category.id]
                                : formData.categoryIds.filter(
                                    (id) => id !== category.id
                                  );
                              handleInputChange("categoryIds", newCategoryIds);
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            disabled={isLoading}
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            {category.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4 border border-gray-200 dark:border-gray-700 rounded-md">
                      No categories available. Create categories first.
                    </p>
                  )}
                </div>

                {/* Additional Settings */}
                <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.showInMenu}
                      onChange={(e) =>
                        handleCheckboxChange("showInMenu", e.target.checked)
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Show in Navigation Menu
                    </span>
                  </label>

                  {/* Scheduled Publish Date */}
                  {formData.status === "SCHEDULED" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Publish Date & Time *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="date"
                          value={
                            formData.publishedAt
                              ? new Date(formData.publishedAt)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          onChange={(e) => {
                            const date = e.target.value;
                            if (date) {
                              const newDate = new Date(date);
                              const currentTime =
                                formData.publishedAt || new Date();
                              newDate.setHours(
                                currentTime.getHours(),
                                currentTime.getMinutes()
                              );
                              handleInputChange("publishedAt", newDate);
                            }
                          }}
                          error={!!errors.publishedAt}
                          hint={errors.publishedAt}
                          disabled={isLoading}
                        />
                        <Input
                          type="time"
                          value={
                            formData.publishedAt
                              ? new Date(formData.publishedAt)
                                  .toTimeString()
                                  .substring(0, 5)
                              : ""
                          }
                          onChange={(e) => {
                            const time = e.target.value;
                            if (time) {
                              const currentDate =
                                formData.publishedAt || new Date();
                              const [hours, minutes] = time
                                .split(":")
                                .map(Number);
                              currentDate.setHours(hours, minutes);
                              handleInputChange("publishedAt", currentDate);
                            }
                          }}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isDirty && !isLoading && (
              <span className="inline-flex items-center text-sm text-yellow-600 dark:text-yellow-400">
                <AlertCircle className="h-4 w-4 mr-1" />
                Unsaved changes
              </span>
            )}
            {!isDirty && isEditMode && !isLoading && (
              <span className="inline-flex items-center text-sm text-green-600 dark:text-green-400">
                <CheckCircle className="h-4 w-4 mr-1" />
                All changes saved
              </span>
            )}
            {isUploadingAny && (
              <span className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400">
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Uploading media...
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading || isUploadingAny}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              startIcon={
                isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )
              }
              disabled={isLoading || isUploadingAny}
            >
              {isLoading
                ? "Saving..."
                : isEditMode
                ? "Update Content"
                : "Create Content"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
};
