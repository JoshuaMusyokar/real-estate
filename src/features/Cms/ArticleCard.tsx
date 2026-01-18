import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import type { Content } from "../../types";
import { Card } from "../../components/ui/Card";

interface ArticleCardProps {
  article: Content;
  variant?: "default" | "featured" | "compact";
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = "default",
}) => {
  const formattedDate = article.publishedAt
    ? format(new Date(article.publishedAt), "MMM d, yyyy")
    : format(new Date(article.createdAt), "MMM d, yyyy");

  if (variant === "compact") {
    return (
      <Link to={`/news/${article.slug}`} className="block group">
        <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
          {article.featuredImage && (
            <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
              <img
                src={article.featuredImage.url}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm text-gray-900 group-hover:text-primary transition-colors line-clamp-2 mb-1">
              {article.title}
            </h3>
            <p className="text-xs text-gray-500 flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {formattedDate}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  // Horizontal card layout (default)
  return (
    <Link to={`/news/${article.slug}`} className="block group">
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="flex flex-col md:flex-row">
          {/* Image Section - Takes full width on mobile, left side on desktop */}
          <div className="relative w-full md:w-2/5 lg:w-1/2 h-64 md:h-auto overflow-hidden bg-gray-100">
            {article.featuredImage ? (
              <img
                src={article.featuredImage.url}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10" />
            )}
          </div>

          {/* Content Section - Takes full width on mobile, right side on desktop */}
          <div className="w-full md:w-3/5 lg:w-1/2 p-6 md:p-8 flex flex-col justify-center bg-white">
            {/* Title */}
            <h3 className="font-bold text-2xl md:text-3xl text-gray-900 mb-4 group-hover:text-primary transition-colors">
              {article.title}
            </h3>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-gray-600 text-base mb-6 line-clamp-3">
                {article.excerpt}
              </p>
            )}

            {/* Metadata bar with border-left accent */}
            <div className="flex items-center space-x-4 pl-4 border-l-4 border-primary">
              <span className="text-sm text-gray-500">
                {article.categories.length > 0 && article.categories[0].name}
              </span>
              {article.categories.length > 0 && (
                <span className="text-gray-300">|</span>
              )}
              <span className="text-sm text-gray-500 flex items-center">
                {formattedDate}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};
