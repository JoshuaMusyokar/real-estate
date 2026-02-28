// ImagesStep.tsx - Mobile Responsive with Form Components
import {
  AlertCircle,
  ImageIcon,
  Upload,
  X,
  LayoutGrid,
  Check,
  Star,
  Info,
} from "lucide-react";
import { useState, useEffect } from "react";
import type { PropertyImageFile } from "../../../types";
import { Card, CardContent } from "../../../components/ui/Card";

interface ImagesStepProps {
  imageFiles: PropertyImageFile[];
  errors: Record<string, string>;
  onImageUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    isFloorPlan?: boolean,
  ) => void;
  onRemoveImage: (index: number, isFloorPlan?: boolean) => void;
  onSetCoverImage: (index: number) => void;
  floorPlanAvailable: boolean;
  onCaptionChange?: (
    index: number,
    caption: string,
    isFloorPlan?: boolean,
  ) => void;
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
    "property",
  );

  const propertyImages = imageFiles.filter((img) => !img.isFloorPlan);
  const floorPlanImages = imageFiles.filter((img) => img.isFloorPlan);

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
        }),
      );
      setImagePreviews(previews);
    };

    generatePreviews();

    return () => {
      imagePreviews.forEach((preview) => {
        if (preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [imageFiles]);

  const getImageSource = (
    img: PropertyImageFile,
    index: number,
    isFloorPlan: boolean,
  ) => {
    const filteredImages = isFloorPlan ? floorPlanImages : propertyImages;
    const filteredIndex = filteredImages.findIndex((f) => f === img);

    if (img.preview) return img.preview;
    if (img.url) return img.url;
    if (img.file) {
      return URL.createObjectURL(img.file);
    }

    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5YzljOWMiPkltYWdlIFByZXZpZXc8L3RleHQ+PC9zdmc+";
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isFloorPlan: boolean = false,
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onImageUpload(e, isFloorPlan);
    }
  };

  const handleCaptionChange = (
    index: number,
    value: string,
    isFloorPlan: boolean = false,
  ) => {
    if (onCaptionChange) {
      onCaptionChange(index, value, isFloorPlan);
    }
  };

  const renderImageUploadSection = (
    title: string,
    description: string,
    isFloorPlan: boolean,
  ) => {
    const images = isFloorPlan ? floorPlanImages : propertyImages;
    const tabKey = isFloorPlan ? "floor-plan" : "property";

    return (
      <div className={`space-y-4 ${activeTab !== tabKey ? "hidden" : ""}`}>
        {/* Upload Area */}
        <label className="block w-full cursor-pointer">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg sm:rounded-xl p-6 sm:p-8 text-center hover:border-brand-500 dark:hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all">
            <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Upload className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" />
            </div>
            <div className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1">
              {isFloorPlan ? "Upload Floor Plans" : "Upload Property Images"}
            </div>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {description}
            </div>
            <div className="mt-3 sm:mt-4">
              <span className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Choose Files
              </span>
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

        {/* Images Grid */}
        {images.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              {images.map((img, idx) => {
                const actualIndex = imageFiles.findIndex((f) => f === img);
                return (
                  <div
                    key={actualIndex}
                    className={`relative group rounded-lg sm:rounded-xl overflow-hidden border-2 sm:border-4 ${
                      img.isCover && !isFloorPlan
                        ? "border-success-500 dark:border-success-400 shadow-lg"
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
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5YzljOWMiPkVycm9yPC90ZXh0Pjwvc3ZnPg==";
                        }}
                      />
                      {!img.url && !imagePreviews[actualIndex] && (
                        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse flex items-center justify-center">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-gray-300 dark:border-gray-600 border-t-brand-500 dark:border-t-brand-400 rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>

                    {/* Hover overlay - Desktop */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-200 hidden sm:flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 p-2">
                      {!img.isCover && !isFloorPlan && (
                        <button
                          type="button"
                          onClick={() => onSetCoverImage(actualIndex)}
                          className="bg-success-600 hover:bg-success-700 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                          Set as Cover
                        </button>
                      )}

                      {isFloorPlan && (
                        <div className="w-full px-2">
                          <input
                            type="text"
                            placeholder="Add caption..."
                            value={img.caption || ""}
                            onChange={(e) =>
                              handleCaptionChange(idx, e.target.value, true)
                            }
                            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-white/95 dark:bg-gray-800/95 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => onRemoveImage(actualIndex, isFloorPlan)}
                        className="bg-red-600 hover:bg-red-700 text-white p-1.5 sm:p-2 rounded-lg transition-colors"
                      >
                        <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>

                    {/* Mobile Actions */}
                    <div className="absolute top-1 right-1 sm:hidden flex gap-1">
                      {!img.isCover && !isFloorPlan && (
                        <button
                          type="button"
                          onClick={() => onSetCoverImage(actualIndex)}
                          className="bg-success-600 text-white p-1.5 rounded-md shadow-lg"
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onRemoveImage(actualIndex, isFloorPlan)}
                        className="bg-red-600 text-white p-1.5 rounded-md shadow-lg"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Cover badge */}
                    {img.isCover && !isFloorPlan && (
                      <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 bg-success-600 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1 shadow-lg">
                        <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
                        COVER
                      </div>
                    )}

                    {/* Floor plan badge */}
                    {isFloorPlan && (
                      <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 bg-purple-600 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1 shadow-lg">
                        <LayoutGrid className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        PLAN
                      </div>
                    )}

                    {/* Caption display */}
                    {isFloorPlan && img.caption && (
                      <div className="absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2 right-1.5 sm:right-2 bg-black/75 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs truncate">
                        {img.caption}
                      </div>
                    )}

                    {/* Order badge */}
                    <div
                      className={`absolute ${
                        isFloorPlan && img.caption
                          ? "top-1.5 sm:top-2 right-1.5 sm:right-2"
                          : "bottom-1.5 sm:bottom-2 right-1.5 sm:right-2"
                      } bg-black/75 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium`}
                    >
                      #{idx + 1}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm pt-2">
              <div className="text-gray-600 dark:text-gray-400">
                {images.length} {isFloorPlan ? "floor plan" : "image"}
                {images.length !== 1 ? "s" : ""} uploaded
              </div>
              {!isFloorPlan && (
                <div
                  className={`flex items-center gap-1.5 font-medium ${
                    images.filter((img) => img.isCover).length === 0
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-success-600 dark:text-success-400"
                  }`}
                >
                  {images.filter((img) => img.isCover).length === 0 ? (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      Select a cover image
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Cover image selected
                    </>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Property Images & Floor Plans
        </h3>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Add high-quality images to showcase your property. Mark one as cover
          image.
          {floorPlanAvailable && " You can also upload floor plans."}
        </p>
      </div>

      {/* Error Alert */}
      {errors.images && (
        <div className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg sm:rounded-xl p-3 sm:p-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-error-600 dark:text-error-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-error-800 dark:text-error-300">
              {errors.images}
            </p>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      {floorPlanAvailable && (
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("property")}
              className={`py-2 sm:py-3 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
                activeTab === "property"
                  ? "border-brand-500 text-brand-600 dark:text-brand-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <span className="flex items-center gap-1.5 sm:gap-2">
                <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Property Images ({propertyImages.length})
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("floor-plan")}
              className={`py-2 sm:py-3 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
                activeTab === "floor-plan"
                  ? "border-purple-500 text-purple-600 dark:text-purple-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <span className="flex items-center gap-1.5 sm:gap-2">
                <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Floor Plans ({floorPlanImages.length})
              </span>
            </button>
          </nav>
        </div>
      )}

      {/* Content Cards */}
      <Card>
        <CardContent className="p-4 sm:p-5 md:p-6">
          {/* Property Images Section */}
          {renderImageUploadSection(
            "Property Images",
            "PNG, JPG up to 5MB each (min. 3 images)",
            false,
          )}

          {/* Floor Plans Section */}
          {floorPlanAvailable &&
            renderImageUploadSection(
              "Floor Plans",
              "PNG, JPG up to 5MB each. Add captions to identify each floor.",
              true,
            )}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
        <CardContent className="p-4 sm:p-5 md:p-6">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <Info className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm sm:text-base font-bold text-amber-900 dark:text-amber-100 mb-2">
                Image Tips:
              </h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-amber-800 dark:text-amber-300">
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-amber-600 dark:bg-amber-400 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <span>Use high-resolution images (minimum 1200x800px)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-amber-600 dark:bg-amber-400 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <span>Show different angles and rooms</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-amber-600 dark:bg-amber-400 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <span>Include exterior and interior shots</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-amber-600 dark:bg-amber-400 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <span>Ensure good lighting and clear focus</span>
                </li>
                {floorPlanAvailable && (
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-amber-600 dark:bg-amber-400 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                    <span>
                      For floor plans, add clear captions like 'Ground Floor',
                      'First Floor', etc.
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {imageFiles.some((img) => img.file && !img.preview) && (
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4 sm:p-5 md:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-xs sm:text-sm font-medium text-blue-800 dark:text-blue-300">
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
          </CardContent>
        </Card>
      )}
    </div>
  );
};
