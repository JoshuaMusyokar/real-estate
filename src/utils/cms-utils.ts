import type { ContentStatus, ContentType } from "../types/cms";

export const getStatusColor = (status: ContentStatus): string => {
  switch (status) {
    case "DRAFT":
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    case "PUBLISHED":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "SCHEDULED":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "ARCHIVED":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  }
};

export const getTypeIcon = (type: ContentType): string => {
  switch (type) {
    case "ARTICLE":
      return "📝";
    case "PAGE":
      return "📄";
    case "TOOL":
      return "🛠️";
    case "PODCAST":
      return "🎧";
    case "WEB_STORY":
      return "📱";
    case "BANNER":
      return "🖼️";
    case "FAQ":
      return "❓";
    case "TESTIMONIAL":
      return "💬";
    case "PROMOTION":
      return "🎯";
    default:
      return "📦";
  }
};

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const truncateText = (text: string, length: number): string => {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
};
