import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Play,
  Pause,
  Clock,
  Calendar,
  Headphones,
  MoreVertical,
  Volume2,
  ExternalLink,
  Heart,
} from "lucide-react";
import { format } from "date-fns";
import type { Content } from "../../types";
import { Card } from "../../components/ui/Card";
import { cn } from "../../utils";
import Button from "../../components/ui/button/Button";

interface PodcastCardProps {
  article: Content;
  variant?: "default" | "compact" | "featured";
}

export const PodcastCard: React.FC<PodcastCardProps> = ({
  article,
  variant = "default",
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const formattedDate = format(
    new Date(article.publishedAt || article.createdAt),
    "MMM d, yyyy"
  );

  const audioUrl = article.audioUrl;
  const thumbnail = article.featuredImage?.url;
  const episodeNumber = article.metadata?.episodeNumber;
  const host = article.metadata?.host || "Host";

  const handlePlayPause = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }

    setIsPlaying((prev) => !prev);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const { currentTime, duration } = audioRef.current;
    setCurrentTime(currentTime);
    setProgress((currentTime / duration) * 100 || 0);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle click on card (excluding interactive elements)
  const handleCardClick = (e: React.MouseEvent) => {
    // Only navigate if clicking on non-interactive parts of the card
    const target = e.target as HTMLElement;
    const isInteractive =
      target.closest("button") ||
      target.closest("audio") ||
      target.closest("[data-no-navigate]");

    if (isInteractive) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  if (variant === "compact") {
    return (
      <Link
        to={`/podcasts/${article.slug}`}
        className="group block focus:outline-none"
        onClick={handleCardClick}
      >
        <Card className="relative overflow-hidden rounded-xl p-3 transition-all hover:shadow-lg hover:scale-[1.02] bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            {/* Compact Thumbnail with Play Button */}
            <div className="relative">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={article.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Headphones className="h-5 w-5 text-white" />
                  </div>
                )}

                {/* Play Button Overlay */}
                {audioUrl && (
                  <button
                    onClick={handlePlayPause}
                    data-no-navigate
                    className={cn(
                      "absolute inset-0 flex items-center justify-center",
                      "bg-black/60 backdrop-blur-sm transition-all",
                      isPlaying
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100",
                      "text-white"
                    )}
                    aria-label={isPlaying ? "Pause podcast" : "Play podcast"}
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1">
                    {article.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                    {host} • {formattedDate}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsLiked(!isLiked);
                  }}
                  data-no-navigate
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={isLiked ? "Unlike podcast" : "Like podcast"}
                >
                  <Heart
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isLiked
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400 hover:text-red-500"
                    )}
                  />
                </button>
              </div>

              {/* Mini Progress Bar */}
              {isPlaying && (
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Hidden Audio */}
          {audioUrl && (
            <audio
              ref={audioRef}
              src={audioUrl}
              preload="none"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => {
                setIsPlaying(false);
                setProgress(0);
                setCurrentTime(0);
              }}
              data-no-navigate
            />
          )}
        </Card>
      </Link>
    );
  }

  return (
    <div className="group block focus:outline-none">
      <Card
        className="relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-gray-100 bg-white cursor-pointer"
        onClick={() => (window.location.href = `/podcasts/${article.slug}`)}
      >
        {/* Thumbnail Section */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Headphones className="h-16 w-16 text-white/80" />
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Episode Badge */}
          {episodeNumber && (
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white">
                <Headphones className="mr-1.5 h-3 w-3" />
                Episode {episodeNumber}
              </span>
            </div>
          )}

          {/* Play Button Overlay */}
          {audioUrl && (
            <button
              onClick={handlePlayPause}
              data-no-navigate
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-all duration-300",
                "bg-black/40 backdrop-blur-sm",
                isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                "text-white"
              )}
              aria-label={isPlaying ? "Pause podcast" : "Play podcast"}
            >
              <div
                className={cn(
                  "flex items-center justify-center rounded-full transition-transform",
                  isPlaying ? "scale-100" : "scale-90 group-hover:scale-100"
                )}
                data-no-navigate
              >
                {isPlaying ? (
                  <div
                    className="flex items-center justify-center rounded-full bg-white/20 p-6 backdrop-blur-sm"
                    data-no-navigate
                  >
                    <Pause className="h-10 w-10" />
                  </div>
                ) : (
                  <div
                    className="flex items-center justify-center rounded-full bg-white p-6 shadow-2xl"
                    data-no-navigate
                  >
                    <Play className="h-10 w-10 text-purple-600" />
                  </div>
                )}
              </div>
            </button>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Metadata */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                {article.metadata?.duration || "—"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsLiked(!isLiked);
                }}
                data-no-navigate
                className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                aria-label={isLiked ? "Unlike podcast" : "Like podcast"}
              >
                <Heart
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isLiked
                      ? "fill-red-500 text-red-500"
                      : "text-gray-400 hover:text-red-500"
                  )}
                />
              </button>
              <button
                className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                data-no-navigate
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Handle more options
                }}
              >
                <MoreVertical className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Title & Description */}
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors mb-3 line-clamp-2">
            {article.title}
          </h3>

          <p className="text-gray-600 mb-4 line-clamp-2">
            {article.excerpt ||
              `Listen to this insightful podcast about ${article.title.toLowerCase()}`}
          </p>

          {/* Host Info */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-sm font-semibold text-white">
                {host.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{host}</p>
              <p className="text-xs text-gray-500">Host</p>
            </div>
          </div>

          {/* Progress & Controls */}
          {audioUrl && (
            <div
              className="space-y-3"
              onClick={(e) => e.stopPropagation()}
              data-no-navigate
            >
              {/* Progress Bar */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{formatTime(currentTime)}</span>
                <span>
                  {formatTime(duration) || article.metadata?.duration || "—"}
                </span>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePlayPause}
                    data-no-navigate
                    className={cn(
                      "flex items-center justify-center rounded-full p-3 transition-all",
                      "bg-purple-600 text-white hover:bg-purple-700",
                      "shadow-lg hover:shadow-xl"
                    )}
                    aria-label={isPlaying ? "Pause podcast" : "Play podcast"}
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </button>

                  <button
                    className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                    data-no-navigate
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Handle volume control
                    }}
                  >
                    <Volume2 className="h-5 w-5" />
                  </button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  data-no-navigate
                  onClick={() => {
                    window.open(`/podcasts/${article.slug}`, "_blank");
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Episode
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Hidden Audio */}
        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            preload="none"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => {
              setIsPlaying(false);
              setProgress(0);
              setCurrentTime(0);
            }}
            data-no-navigate
          />
        )}
      </Card>
    </div>
  );
};
