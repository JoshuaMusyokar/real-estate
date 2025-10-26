import { ChevronLeft, ChevronRight, ImageIcon, X } from "lucide-react";
import { useState, type FC } from "react";
import type { PropertyImage } from "../../types";

interface ImageGalleryProps {
  images: PropertyImage[];
  title: string;
}

export const ImageGallery: FC<ImageGalleryProps> = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const coverImage = images?.find((img) => img.isCover) || images?.[0];
  const otherImages = images?.filter((img) => !img.isCover) || [];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-[600px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <ImageIcon className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-4 gap-4 h-[600px]">
        {/* Main Image */}
        <div
          className="col-span-4 md:col-span-3 relative rounded-2xl overflow-hidden cursor-pointer group"
          onClick={() => {
            setCurrentIndex(0);
            setShowLightbox(true);
          }}
        >
          <img
            src={coverImage?.url}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <button className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl font-semibold text-gray-900 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
            <ImageIcon className="w-5 h-5" />
            View All Photos ({images.length})
          </button>
        </div>

        {/* Thumbnail Grid */}
        <div className="hidden md:flex flex-col gap-4">
          {otherImages.slice(0, 2).map((img, idx) => (
            <div
              key={img.id}
              className="relative rounded-xl overflow-hidden cursor-pointer group h-full"
              onClick={() => {
                setCurrentIndex(idx + 1);
                setShowLightbox(true);
              }}
            >
              <img
                src={img.url}
                alt={`${title} ${idx + 2}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {idx === 1 && otherImages.length > 2 && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    +{otherImages.length - 2}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-6 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="max-w-6xl max-h-[90vh] mx-auto px-20">
            <img
              src={images[currentIndex]?.url}
              alt={`${title} ${currentIndex + 1}`}
              className="w-full h-full object-contain"
            />
            <div className="text-white text-center mt-4 font-medium">
              {currentIndex + 1} / {images.length}
            </div>
          </div>

          <button
            onClick={nextImage}
            className="absolute right-6 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors text-white"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </>
  );
};
