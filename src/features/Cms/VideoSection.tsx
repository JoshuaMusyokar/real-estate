import React from "react";
import { Play, Film, TrendingUp } from "lucide-react";
import { VideoCard } from "./VideoCard";
import type { Content } from "../../types";

interface VideoSectionProps {
  videos: Content[];
  title?: string;
  description?: string;
  maxItems?: number;
}

export const VideoSection: React.FC<VideoSectionProps> = ({
  videos,
  title = "Latest Videos",
  description = "Property tours and expert interviews",
  maxItems = 2,
}) => {
  const displayVideos = videos.slice(0, maxItems);

  if (displayVideos.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Film className="w-5 h-5 mr-2 text-red-500" />
            {title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <TrendingUp className="w-5 h-5 text-red-400" />
      </div>

      {/* Videos List */}
      <div className="space-y-4">
        {displayVideos.map((video) => (
          <VideoCard key={video.id} article={video} variant="compact" />
        ))}
      </div>

      {/* View All Button */}
      <a
        href="/videos"
        className="mt-6 flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm py-2 rounded-lg hover:bg-blue-50 transition-colors"
      >
        <Play className="w-4 h-4" />
        View All Videos
      </a>

      {/* Stats */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">
              {videos.length}
            </div>
            <div className="text-xs text-gray-500">Videos</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">
              {videos
                .reduce(
                  (sum, video) => sum + parseInt(video.metadata?.views || "0"),
                  0
                )
                .toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Total Views</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">
              {(() => {
                const durations = videos
                  .map((v) => v.metadata?.duration?.match(/(\d+):(\d+)/))
                  .filter(Boolean)
                  .map(
                    (match) => parseInt(match![1]) * 60 + parseInt(match![2])
                  );
                const totalSeconds = durations.reduce(
                  (sum, sec) => sum + sec,
                  0
                );
                const hours = Math.floor(totalSeconds / 3600);
                return hours > 0
                  ? `${hours}h`
                  : `${Math.floor(totalSeconds / 60)}m`;
              })()}
            </div>
            <div className="text-xs text-gray-500">Content</div>
          </div>
        </div>
      </div>
    </div>
  );
};
