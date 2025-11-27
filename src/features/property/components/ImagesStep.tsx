import { AlertCircle, ImageIcon, Upload, X } from "lucide-react";

interface PropertyImageFile {
  file?: File;
  url?: string;
  caption?: string;
  key?: string;
  order: number;
  isCover: boolean;
  preview?: string;
}

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
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Property Images *
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Add high-quality images to showcase your property. Mark one as cover
          image.
        </p>
      </div>

      {errors.images && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-800">{errors.images}</p>
        </div>
      )}

      <div>
        <label className="block w-full cursor-pointer">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-all">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <div className="text-sm font-semibold text-gray-900 mb-1">
              Click to upload images
            </div>
            <div className="text-xs text-gray-500">
              PNG, JPG up to 5MB each (min. 3 images)
            </div>
          </div>
          <input
            type="file"
            multiple
            accept="image/png,image/jpeg,image/jpg"
            onChange={onImageUpload}
            className="hidden"
          />
        </label>
      </div>

      {imageFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {imageFiles.map((img, idx) => (
            <div
              key={idx}
              className={`relative group rounded-xl overflow-hidden border-4 ${
                img.isCover ? "border-green-500" : "border-gray-200"
              }`}
            >
              <img
                src={img.preview || img.url}
                alt={`Property ${idx + 1}`}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2">
                {!img.isCover && (
                  <button
                    type="button"
                    onClick={() => onSetCoverImage(idx)}
                    className="opacity-0 group-hover:opacity-100 bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                  >
                    Set as Cover
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onRemoveImage(idx)}
                  className="opacity-0 group-hover:opacity-100 bg-red-600 text-white p-2 rounded-lg transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {img.isCover && (
                <div className="absolute top-2 left-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                  COVER
                </div>
              )}
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                #{idx + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <ImageIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <strong>Image Tips:</strong> Use high-resolution images (minimum
          1200x800px), show different angles and rooms, include exterior and
          interior shots, and ensure good lighting.
        </div>
      </div>
    </div>
  );
};
