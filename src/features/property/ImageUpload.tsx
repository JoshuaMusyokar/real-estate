import {
  Check,
  Grip,
  Trash2,
  Upload,
  Link,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { useState } from "react";

interface PropertyImageInput {
  url: string;
  caption?: string | null;
  order?: number;
  isCover?: boolean;
}

interface ImageUploadProps {
  images: PropertyImageInput[];
  onChange: (images: PropertyImageInput[]) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onChange,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [captionInput, setCaptionInput] = useState("");
  const [editingCaption, setEditingCaption] = useState<number | null>(null);
  const [tempCaption, setTempCaption] = useState("");

  const handleAddImageFromUrl = () => {
    if (!urlInput.trim()) return;

    const newImage: PropertyImageInput = {
      url: urlInput.trim(),
      caption: captionInput.trim() || null,
      order: images.length,
      isCover: images.length === 0,
    };

    onChange([...images, newImage]);
    setUrlInput("");
    setCaptionInput("");
    setShowUrlModal(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: PropertyImageInput[] = [];

    Array.from(files).forEach((file, index) => {
      // In a real app, you'd upload to a server/CDN and get back a URL
      // For now, we'll create a placeholder URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage: PropertyImageInput = {
          url: reader.result as string,
          caption: null,
          order: images.length + index,
          isCover: images.length === 0 && index === 0,
        };
        newImages.push(newImage);

        if (newImages.length === files.length) {
          onChange([...images, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    // Reorder remaining images
    const reorderedImages = newImages.map((img, i) => ({
      ...img,
      order: i,
      isCover: i === 0 ? true : img.isCover && index !== 0 ? true : false,
    }));
    onChange(reorderedImages);
  };

  const handleSetCover = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isCover: i === index,
    }));
    onChange(newImages);
  };

  const handleUpdateCaption = (index: number, caption: string) => {
    const newImages = images.map((img, i) =>
      i === index ? { ...img, caption: caption.trim() || null } : img
    );
    onChange(newImages);
  };

  const startEditCaption = (index: number) => {
    setEditingCaption(index);
    setTempCaption(images[index].caption || "");
  };

  const saveCaption = (index: number) => {
    handleUpdateCaption(index, tempCaption);
    setEditingCaption(null);
    setTempCaption("");
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedItem = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedItem);

    onChange(newImages.map((img, i) => ({ ...img, order: i })));
    setDraggedIndex(index);
  };

  return (
    <div className="space-y-4">
      {/* Upload Buttons */}
      <div className="flex gap-3">
        <label className="flex-1 cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all py-4 px-6 flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600">
            <Upload className="w-5 h-5" />
            <span className="font-semibold">Upload from Device</span>
          </div>
        </label>

        <button
          type="button"
          onClick={() => setShowUrlModal(true)}
          className="flex-1 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all py-4 px-6 flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600"
        >
          <Link className="w-5 h-5" />
          <span className="font-semibold">Add Image URL</span>
        </button>
      </div>

      {/* URL Modal */}
      {showUrlModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Add Image from URL
              </h3>
              <button
                onClick={() => setShowUrlModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image URL *
                </label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Caption (Optional)
                </label>
                <input
                  type="text"
                  value={captionInput}
                  onChange={(e) => setCaptionInput(e.target.value)}
                  placeholder="Living room with natural lighting"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <button
                onClick={handleAddImageFromUrl}
                disabled={!urlInput.trim()}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Images Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              className="relative group bg-gray-50 rounded-xl overflow-hidden cursor-move border-2 border-gray-200 hover:border-blue-400 transition-all"
            >
              {/* Image */}
              <div className="aspect-video bg-gray-100">
                <img
                  src={image.url}
                  alt={image.caption || `Property ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect fill="%23f3f4f6" width="400" height="300"/><text x="50%" y="50%" font-family="Arial" font-size="18" fill="%239ca3af" text-anchor="middle" dy=".3em">Image not found</text></svg>';
                  }}
                />
              </div>

              {/* Cover Badge */}
              {image.isCover && (
                <div className="absolute top-3 left-3 px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-lg shadow-lg">
                  COVER IMAGE
                </div>
              )}

              {/* Drag Handle */}
              <div className="absolute top-3 right-3 p-2 bg-white/90 rounded-lg shadow">
                <Grip className="w-4 h-4 text-gray-600" />
              </div>

              {/* Actions (on hover) */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSetCover(index)}
                  className={`p-3 rounded-lg ${
                    image.isCover
                      ? "bg-green-600 text-white"
                      : "bg-white text-gray-900 hover:bg-gray-100"
                  }`}
                  title="Set as cover"
                >
                  <Check className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  title="Remove"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Caption Section */}
              <div className="p-3 bg-white border-t border-gray-200">
                {editingCaption === index ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tempCaption}
                      onChange={(e) => setTempCaption(e.target.value)}
                      placeholder="Add a caption..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveCaption(index);
                        if (e.key === "Escape") setEditingCaption(null);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => saveCaption(index)}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingCaption(null)}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => startEditCaption(index)}
                    className="w-full text-left text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {image.caption ? (
                      <span className="font-medium">{image.caption}</span>
                    ) : (
                      <span className="italic text-gray-400">
                        Click to add caption...
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No images added yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Upload from device or add image URLs
          </p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <strong>Tips:</strong> Drag images to reorder them. The first image or
          one marked as cover will be the main display image. Add captions to
          help describe each photo.
        </p>
      </div>
    </div>
  );
};
