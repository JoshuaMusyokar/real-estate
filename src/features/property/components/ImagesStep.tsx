import { AlertCircle, ImageIcon, Upload, X } from "lucide-react";
import { useState, useEffect } from "react";
import type { PropertyImageFile } from "../../../types";

interface ImagesStepProps {
  imageFiles: PropertyImageFile[];
  errors: Record<string, string>;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onSetCoverImage: (index: number) => void;
}

export const ImagesStep: React.FC<ImagesStepProps> = ({
  imageFiles,
  errors,
  onImageUpload,
  onRemoveImage,
  onSetCoverImage,
}) => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Generate previews for newly uploaded files
  useEffect(() => {
    const generatePreviews = async () => {
      const previews = await Promise.all(
        imageFiles.map(async (img) => {
          if (img.preview) return img.preview;
          if (img.url) return img.url;
          if (img.file) {
            // Generate blob URL for file
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

  const getImageSource = (img: PropertyImageFile, index: number) => {
    // First try preview (generated from file)
    if (imagePreviews[index]) return imagePreviews[index];
    // Then try URL (from existing images)
    if (img.url) return img.url;
    // Fallback placeholder
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5YzljOWMiPkltYWdlIFByZXZpZXc8L3RleHQ+PC9zdmc+";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onImageUpload(e);
    }
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

      <div>
        <label className="block w-full cursor-pointer">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              Click to upload images
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG up to 5MB each (min. 3 images)
            </div>
          </div>
          <input
            type="file"
            multiple
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      {imageFiles.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {imageFiles.map((img, idx) => (
              <div
                key={idx}
                className={`relative group rounded-xl overflow-hidden border-4 ${
                  img.isCover
                    ? "border-green-500 dark:border-green-400 shadow-lg"
                    : "border-gray-200 dark:border-gray-700"
                } transition-all duration-200`}
              >
                <div className="w-full aspect-square relative bg-gray-100 dark:bg-gray-900">
                  <img
                    src={getImageSource(img, idx)}
                    alt={`Property ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to placeholder on error
                      e.currentTarget.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5YzljOWMiPkltYWdlIFByZXZpZXc8L3RleHQ+PC9zdmc+";
                    }}
                  />
                  {/* Loading overlay */}
                  {!img.url && !imagePreviews[idx] && (
                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  {!img.isCover && (
                    <button
                      type="button"
                      onClick={() => onSetCoverImage(idx)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors transform translate-y-2 group-hover:translate-y-0"
                    >
                      Set as Cover
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onRemoveImage(idx)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors transform translate-y-2 group-hover:translate-y-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Cover badge */}
                {img.isCover && (
                  <div className="absolute top-2 left-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    COVER
                  </div>
                )}

                {/* Order badge */}
                <div className="absolute bottom-2 right-2 bg-black/75 text-white px-2 py-1 rounded text-xs font-medium">
                  #{idx + 1}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-600 dark:text-gray-400">
              {imageFiles.length} image{imageFiles.length !== 1 ? "s" : ""}{" "}
              uploaded
            </div>
            <div className="text-blue-600 dark:text-blue-400 font-medium">
              {imageFiles.filter((img) => img.isCover).length === 0
                ? "Select a cover image"
                : "Cover image selected ✓"}
            </div>
          </div>
        </>
      )}

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start gap-3">
        <ImageIcon className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800 dark:text-amber-300">
          <strong className="font-semibold">Image Tips:</strong> Use
          high-resolution images (minimum 1200x800px), show different angles and
          rooms, include exterior and interior shots, and ensure good lighting.
        </div>
      </div>

      {/* Image Upload Progress (Optional) */}
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
