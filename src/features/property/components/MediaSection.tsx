import React, { useState } from "react";
import { Youtube, Video, Grid3X3 } from "lucide-react";
import type { PropertyImage } from "../../../types";

interface MediaSectionProps {
  youtubeUrl?: string | null;
  virtualTourUrl?: string | null;
  images: PropertyImage[];
}

export const MediaSection: React.FC<MediaSectionProps> = ({
  youtubeUrl,
  virtualTourUrl,
  images,
}) => {
  const [activeTab, setActiveTab] = useState<"images" | "tour" | "video">(
    "images"
  );

  const hasVirtualTour = !!virtualTourUrl;
  const hasVideo = !!youtubeUrl;

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    );
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : url;
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab("images")}
            className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition-colors ${
              activeTab === "images"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
            Images ({images.length})
          </button>

          {hasVirtualTour && (
            <button
              onClick={() => setActiveTab("tour")}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition-colors ${
                activeTab === "tour"
                  ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <Video className="w-4 h-4" />
              3D Tour
            </button>
          )}

          {hasVideo && (
            <button
              onClick={() => setActiveTab("video")}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition-colors ${
                activeTab === "video"
                  ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <Youtube className="w-4 h-4" />
              Video
            </button>
          )}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "images" && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="aspect-square rounded-lg overflow-hidden group cursor-pointer bg-gray-100 dark:bg-gray-700"
              >
                <img
                  src={image.viewableUrl}
                  alt={image.caption || `Property image ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === "tour" && hasVirtualTour && (
          <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
            <iframe
              src={virtualTourUrl}
              className="w-full h-full border-0"
              allowFullScreen
              title="Virtual Tour"
            />
          </div>
        )}

        {activeTab === "video" && hasVideo && (
          <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
            <iframe
              src={getYouTubeEmbedUrl(youtubeUrl!)}
              className="w-full h-full border-0"
              allowFullScreen
              title="Property Video"
            />
          </div>
        )}
      </div>
    </div>
  );
};
