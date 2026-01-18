import React, { useState } from "react";
import { Play, Calendar, Eye, ThumbsUp } from "lucide-react";
import { format } from "date-fns";
import type { Content } from "../../types";
import { Card } from "../../components/ui/Card";
import { cn } from "../../utils";

interface VideoCardProps {
  article: Content;
  variant?: "default" | "compact";
}

export const VideoCard: React.FC<VideoCardProps> = ({
  article,
  variant = "default",
}) => {
  const [isHovering, setIsHovering] = useState(false);

  const formattedDate = format(
    new Date(article.publishedAt || article.createdAt),
    "MMM d, yyyy"
  );

  const videoUrl = article.videoUrl;
  const thumbnail = article.featuredImage?.url;
  const duration = article.metadata?.duration || "—";
  const views = article.metadata?.views || "0";

  if (variant === "compact") {
    return (
      <a
        href={`/videos/${article.slug}`}
        className="group block focus:outline-none"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Card className="relative overflow-hidden rounded-xl p-3 transition-all hover:shadow-lg hover:scale-[1.02] bg-white">
          <div className="flex items-center gap-3">
            {/* Thumbnail */}
            <div className="relative flex-shrink-0">
              <div className="relative h-16 w-28 overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={article.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Play className="h-6 w-6 text-white" />
                  </div>
                )}

                {/* Play Overlay */}
                <div
                  className={cn(
                    "absolute inset-0 flex items-center justify-center",
                    "bg-black/40 transition-opacity",
                    isHovering ? "opacity-100" : "opacity-0"
                  )}
                >
                  <Play className="h-8 w-8 text-white" />
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-1 right-1 bg-black/75 text-white text-xs px-1.5 py-0.5 rounded">
                  {duration}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                {article.title}
              </h3>
              <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {views} views
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </a>
    );
  }

  return (
    <a
      href={`/videos/${article.slug}`}
      className="group block focus:outline-none"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Card className="relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200 bg-white">
        {/* Thumbnail Section */}
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-600">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="flex flex-col items-center">
                <Play className="h-16 w-16 text-white/80 mb-2" />
                <span className="text-white/80 font-medium">
                  Property Video
                </span>
              </div>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Play Button Overlay */}
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-all duration-300",
              isHovering ? "opacity-100" : "opacity-0",
              "bg-black/40 backdrop-blur-sm",
              "text-white"
            )}
          >
            <div className="flex items-center justify-center rounded-full bg-white p-5 shadow-2xl">
              <Play className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          {/* Duration Badge */}
          <div className="absolute bottom-3 right-3 bg-black/80 text-white text-sm px-2 py-1 rounded">
            {duration}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
            {article.title}
          </h3>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {views} views
              </span>
            </div>
            <button
              className="text-gray-400 hover:text-blue-600 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Handle like
              }}
            >
              <ThumbsUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>
    </a>
  );
};
