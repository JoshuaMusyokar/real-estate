import React from "react";
import { Link } from "react-router-dom";
import { Tag, Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import type { Content } from "../../types";
import { Card } from "../../components/ui/Card";

export const PromotionCard: React.FC<{ article: Content }> = ({ article }) => {
  const expiryDate = article.metadata?.expiryDate
    ? format(new Date(article.metadata.expiryDate), "MMM d")
    : null;

  return (
    <Link to={`/deals/${article.slug}`} className="block group">
      <Card className="overflow-hidden border-2 border-red-200 hover:border-red-300 transition-colors">
        <div className="relative">
          {article.featuredImage && (
            <img
              src={article.featuredImage.url}
              alt={article.title}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            DEAL
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-3">
            <Tag className="w-5 h-5 text-red-500" />
            <span className="text-red-600 font-bold">
              {article.metadata?.discount || "SPECIAL OFFER"}
            </span>
          </div>
          <h3 className="font-bold text-xl mb-3 group-hover:text-red-600 transition-colors">
            {article.title}
          </h3>
          <p className="text-gray-600 mb-4">{article.excerpt}</p>
          <div className="flex items-center justify-between">
            {expiryDate && (
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                Expires {expiryDate}
              </div>
            )}
            <ArrowRight className="w-5 h-5 text-red-500 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </Card>
    </Link>
  );
};
