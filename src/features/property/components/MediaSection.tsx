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
  type Tab = "images" | "tour" | "video";
  const [activeTab, setActiveTab] = useState<Tab>("images");

  const hasVirtualTour = !!virtualTourUrl;
  const hasVideo = !!youtubeUrl;

  const getEmbedUrl = (url: string) => {
    const id = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/,
    );
    return id ? `https://www.youtube.com/embed/${id[1]}` : url;
  };

  const tabs: {
    id: Tab;
    label: string;
    icon: React.ElementType;
    show: boolean;
  }[] = [
    {
      id: "images" as Tab,
      label: `Images (${images.length})`,
      icon: Grid3X3,
      show: true,
    },
    { id: "tour" as Tab, label: "3D Tour", icon: Video, show: hasVirtualTour },
    { id: "video" as Tab, label: "Video", icon: Youtube, show: hasVideo },
  ].filter((t) => t.show);

  return (
    <div className="bg-white border border-blue-100 rounded-xl overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-blue-50 overflow-x-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-4 py-3 border-b-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors
              ${
                activeTab === id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-400 hover:text-gray-700 hover:bg-blue-50/40"
              }`}
          >
            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        {activeTab === "images" && (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-1.5 sm:gap-2">
            {images.map((img, i) => (
              <div
                key={img.id}
                className="aspect-square rounded-lg overflow-hidden group cursor-pointer bg-blue-50"
              >
                <img
                  src={img.viewableUrl}
                  alt={img.caption || `Property image ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === "tour" && hasVirtualTour && (
          <div className="aspect-video bg-blue-50 rounded-xl overflow-hidden border border-blue-100">
            <iframe
              src={virtualTourUrl!}
              className="w-full h-full border-0"
              allowFullScreen
              title="Virtual Tour"
            />
          </div>
        )}

        {activeTab === "video" && hasVideo && (
          <div className="aspect-video bg-blue-50 rounded-xl overflow-hidden border border-blue-100">
            <iframe
              src={getEmbedUrl(youtubeUrl!)}
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
