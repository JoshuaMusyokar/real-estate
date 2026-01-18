import React from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Home,
  DollarSign,
  Shield,
  MapPin,
} from "lucide-react";
import { format } from "date-fns";
import type { Content, ContentCategory } from "../../types";
import { Card } from "../../components/ui/Card";
import Badge from "../../components/ui/badge/Badge";

interface PageCardProps {
  article: Content;
  variant?: "default" | "detailed" | "compact";
}

// Get appropriate icon based on page content
const getPageIcon = (title: string) => {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes("mortgage") || lowerTitle.includes("loan"))
    return DollarSign;
  if (lowerTitle.includes("buy") || lowerTitle.includes("purchase"))
    return Home;
  if (lowerTitle.includes("rent") || lowerTitle.includes("lease")) return Home;
  if (lowerTitle.includes("invest") || lowerTitle.includes("market"))
    return TrendingUp;
  if (lowerTitle.includes("legal") || lowerTitle.includes("contract"))
    return Shield;
  if (lowerTitle.includes("location") || lowerTitle.includes("area"))
    return MapPin;
  if (lowerTitle.includes("checklist") || lowerTitle.includes("guide"))
    return CheckCircle;

  return FileText;
};

// Get page type badge color
const getPageTypeColor = (categories: ContentCategory[]) => {
  const category = categories[0]?.name?.toLowerCase() || "";

  if (category.includes("buy") || category.includes("purchase"))
    return "primary";
  if (category.includes("rent")) return "success";
  if (category.includes("invest")) return "info";
  if (category.includes("legal")) return "error";
  if (category.includes("finance")) return "warning";

  return "light";
};

export const PageCard: React.FC<PageCardProps> = ({
  article,
  variant = "default",
}) => {
  const formattedDate = format(
    new Date(article.publishedAt || article.createdAt),
    "MMM d, yyyy"
  );

  const Icon = getPageIcon(article.title);
  const pageTypeColor = getPageTypeColor(article.categories);
  const readTime = article.metadata?.readTime || "10 min read";
  const difficulty = article.metadata?.difficulty || "Intermediate";

  if (variant === "detailed") {
    return (
      <Link to={`/guides/${article.slug}`} className="block group">
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="md:flex">
            {/* Left side - Content */}
            <div className="p-8 md:w-2/3">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div
                    className={`p-2 rounded-lg ${pageTypeColor.split(" ")[0]}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-sm font-medium px-2 py-1 rounded-full ${pageTypeColor}`}
                  >
                    {article.categories[0]?.name || "Guide"}
                  </span>
                </div>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {difficulty}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors">
                {article.title}
              </h2>

              <p className="text-gray-600 mb-6 line-clamp-3">
                {article.excerpt ||
                  "Comprehensive guide covering all aspects..."}
              </p>

              {/* Key Points */}
              {article.metadata?.keyPoints && (
                <div className="mb-6 space-y-2">
                  {article.metadata.keyPoints
                    .slice(0, 3)
                    .map((point: string, index: number) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{point}</span>
                      </div>
                    ))}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formattedDate}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {readTime}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-primary font-medium">Read Guide</span>
                  <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </div>

            {/* Right side - Image */}
            <div className="md:w-1/3 relative">
              {article.featuredImage ? (
                <img
                  src={article.featuredImage.url}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-primary/30" />
                </div>
              )}
              {/* Stats overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <div className="flex items-center justify-between text-white text-sm">
                  <span className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {article.metadata?.steps || "12"} steps
                  </span>
                  <span>Complete Guide</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link to={`/guides/${article.slug}`} className="block group">
        <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
          <div className="flex-shrink-0">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                pageTypeColor.split(" ")[0]
              }`}
            >
              <Icon className="w-6 h-6" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </h3>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
            </div>
            <p className="text-sm text-gray-600 mb-2 line-clamp-1">
              {article.excerpt}
            </p>
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {readTime}
              </span>
              <span>•</span>
              <span>{difficulty}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link to={`/guides/${article.slug}`} className="block group">
      <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Header with icon */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${pageTypeColor.split(" ")[0]}`}>
              <Icon className="w-6 h-6" />
            </div>
            <Badge color={pageTypeColor}>
              {article.categories[0]?.name || "Guide"}
            </Badge>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>

          <p className="text-gray-600 mb-4 line-clamp-2">
            {article.excerpt ||
              "Step-by-step guide to help you through the process..."}
          </p>
        </div>

        {/* Stats */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {article.metadata?.steps || "12"}
              </div>
              <div className="text-xs text-gray-500">Steps</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {article.metadata?.timeRequired || "2h"}
              </div>
              <div className="text-xs text-gray-500">Time</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-3">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formattedDate}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {readTime}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-primary font-medium">
              <span>View Guide</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};
