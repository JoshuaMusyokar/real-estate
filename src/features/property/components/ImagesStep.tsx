/* eslint-disable @typescript-eslint/no-unused-vars */
import { AlertCircle, ImageIcon, Upload, X, LayoutGrid } from "lucide-react";
import { useState, useEffect } from "react";
import type { PropertyImageFile } from "../../../types";

interface ImagesStepProps {
  imageFiles: PropertyImageFile[];
  errors: Record<string, string>;
  onImageUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    isFloorPlan?: boolean
  ) => void;
  onRemoveImage: (index: number, isFloorPlan?: boolean) => void;
  onSetCoverImage: (index: number) => void;
  floorPlanAvailable: boolean; // Add this prop
  onCaptionChange?: (
    index: number,
    caption: string,
    isFloorPlan?: boolean
  ) => void; // Optional: for caption editing
}

export const ImagesStep: React.FC<ImagesStepProps> = ({
  imageFiles,
  errors,
  onImageUpload,
  onRemoveImage,
  onSetCoverImage,
  floorPlanAvailable,
  onCaptionChange,
}) => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"property" | "floor-plan">(
    "property"
  );

  // Separate images by type
  const propertyImages = imageFiles.filter((img) => !img.isFloorPlan);
  const floorPlanImages = imageFiles.filter((img) => img.isFloorPlan);

  // Generate previews for newly uploaded files
  useEffect(() => {
    const generatePreviews = async () => {
      const previews = await Promise.all(
        imageFiles.map(async (img) => {
          if (img.preview) return img.preview;
          if (img.url) return img.url;
          if (img.file) {
            return URL.createObjectURL(img.file);
          }
          return "";
        })
      );
      setImagePreviews(previews);
    };

    generatePreviews();

    // Cleanup blob URLs when component unmounts
    return () => {
      imagePreviews.forEach((preview) => {
        if (preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [imageFiles]);

  // Replace your getImageSource function with this:
  const getImageSource = (
    img: PropertyImageFile,
    index: number,
    isFloorPlan: boolean
  ) => {
    // Find the image in the filtered array based on type
    const filteredImages = isFloorPlan ? floorPlanImages : propertyImages;
    const filteredIndex = filteredImages.findIndex((f) => f === img);

    // Use a different approach for previews based on tab
    if (img.preview) return img.preview;
    if (img.url) return img.url;
    if (img.file) {
      // Generate preview only for this specific image
      return URL.createObjectURL(img.file);
    }

    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5YzljOWMiPkltYWdlIFByVldaWVc8L3RleHQ+PC9zdmc+";
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isFloorPlan: boolean = false
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onImageUpload(e, isFloorPlan);
    }
  };

  const handleCaptionChange = (
    index: number,
    value: string,
    isFloorPlan: boolean = false
  ) => {
    if (onCaptionChange) {
      onCaptionChange(index, value, isFloorPlan);
    }
  };

  const renderImageUploadSection = (
    title: string,
    description: string,
    isFloorPlan: boolean
  ) => {
    const images = isFloorPlan ? floorPlanImages : propertyImages;
    const tabKey = isFloorPlan ? "floor-plan" : "property";

    return (
      <div className={`space-y-4 ${activeTab !== tabKey ? "hidden" : ""}`}>
        <label className="block w-full cursor-pointer">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              {isFloorPlan ? "Upload Floor Plans" : "Upload Property Images"}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {description}
            </div>
          </div>
          <input
            type="file"
            multiple
            accept="image/png,image/jpeg,image/jpg"
            onChange={(e) => handleFileChange(e, isFloorPlan)}
            className="hidden"
          />
        </label>

        {images.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img, idx) => {
                const actualIndex = imageFiles.findIndex((f) => f === img);
                return (
                  <div
                    key={actualIndex}
                    className={`relative group rounded-xl overflow-hidden border-4 ${
                      img.isCover && !isFloorPlan
                        ? "border-green-500 dark:border-green-400 shadow-lg"
                        : isFloorPlan
                        ? "border-purple-300 dark:border-purple-700"
                        : "border-gray-200 dark:border-gray-700"
                    } transition-all duration-200`}
                  >
                    <div className="w-full aspect-square relative bg-gray-100 dark:bg-gray-900">
                      <img
                        src={getImageSource(img, actualIndex, isFloorPlan)}
                        alt={img.caption || `Image ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5YzljOWMiPkltYWdlIFByVldaWVc8L3RleHQ+PC9zdmc+";
                        }}
                      />
                      {!img.url && !imagePreviews[actualIndex] && (
                        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse flex items-center justify-center">
                          <div className="w-8 h-8 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 p-2">
                      {!img.isCover && !isFloorPlan && (
                        <button
                          type="button"
                          onClick={() => onSetCoverImage(actualIndex)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Set as Cover
                        </button>
                      )}

                      {/* Caption input for floor plans */}
                      {isFloorPlan && (
                        <div className="w-full p-2">
                          <input
                            type="text"
                            placeholder="Add caption (e.g., Ground Floor, Level 1)"
                            value={img.caption || ""}
                            onChange={(e) =>
                              handleCaptionChange(idx, e.target.value, true)
                            }
                            className="w-full px-3 py-2 text-sm bg-white/90 dark:bg-gray-800/90 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => onRemoveImage(actualIndex, isFloorPlan)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Cover badge */}
                    {img.isCover && !isFloorPlan && (
                      <div className="absolute top-2 left-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        COVER
                      </div>
                    )}

                    {/* Floor plan badge */}
                    {isFloorPlan && (
                      <div className="absolute top-2 left-2 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                        <LayoutGrid className="w-3 h-3" />
                        FLOOR PLAN
                      </div>
                    )}

                    {/* Caption display */}
                    {isFloorPlan && img.caption && (
                      <div className="absolute bottom-2 left-2 right-2 bg-black/75 text-white px-2 py-1 rounded text-xs truncate">
                        {img.caption}
                      </div>
                    )}

                    {/* Order badge */}
                    <div
                      className={`absolute ${
                        isFloorPlan && img.caption
                          ? "top-2 right-2"
                          : "bottom-2 right-2"
                      } bg-black/75 text-white px-2 py-1 rounded text-xs font-medium`}
                    >
                      #{idx + 1}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="text-gray-600 dark:text-gray-400">
                {images.length} {isFloorPlan ? "floor plan" : "image"}
                {images.length !== 1 ? "s" : ""} uploaded
              </div>
              {!isFloorPlan && (
                <div className="text-blue-600 dark:text-blue-400 font-medium">
                  {images.filter((img) => img.isCover).length === 0
                    ? "Select a cover image"
                    : "Cover image selected ✓"}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          Property Images *
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Add high-quality images to showcase your property. Mark one as cover
          image.
          {floorPlanAvailable && " You can also upload floor plans."}
        </p>
      </div>

      {errors.images && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-800 dark:text-red-300">
            {errors.images}
          </p>
        </div>
      )}

      {/* Tab Navigation for Property Images vs Floor Plans */}
      {floorPlanAvailable && (
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              type="button"
              onClick={() => setActiveTab("property")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "property"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:dark:text-gray-300"
              }`}
            >
              Property Images ({propertyImages.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("floor-plan")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "floor-plan"
                  ? "border-purple-500 text-purple-600 dark:text-purple-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:dark:text-gray-300"
              }`}
            >
              Floor Plans ({floorPlanImages.length})
            </button>
          </nav>
        </div>
      )}

      {/* Property Images Section */}
      {renderImageUploadSection(
        "Property Images",
        "PNG, JPG up to 5MB each (min. 3 images)",
        false
      )}

      {/* Floor Plans Section (only show if floorPlanAvailable is true) */}
      {floorPlanAvailable &&
        renderImageUploadSection(
          "Floor Plans",
          "PNG, JPG up to 5MB each. Add captions to identify each floor.",
          true
        )}

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start gap-3">
        <ImageIcon className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800 dark:text-amber-300">
          <strong className="font-semibold">Image Tips:</strong> Use
          high-resolution images (minimum 1200x800px), show different angles and
          rooms, include exterior and interior shots, and ensure good lighting.
          {floorPlanAvailable &&
            " For floor plans, add clear captions like 'Ground Floor', 'First Floor', etc."}
        </div>
      </div>

      {/* Image Upload Progress */}
      {imageFiles.some((img) => img.file && !img.preview) && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
              Processing images...
            </span>
            <span className="text-xs text-blue-600 dark:text-blue-400">
              {imageFiles.filter((img) => img.preview || img.url).length} /{" "}
              {imageFiles.length}
            </span>
          </div>
          <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  (imageFiles.filter((img) => img.preview || img.url).length /
                    imageFiles.length) *
                  100
                }%`,
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};
