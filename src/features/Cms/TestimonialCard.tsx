import React from "react";
import { Star, Quote } from "lucide-react";
import type { Content } from "../../types";
import { Card } from "../../components/ui/Card";

export const TestimonialCard: React.FC<{ article: Content }> = ({
  article,
}) => {
  const rating = article.metadata?.rating || 5;

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <Quote className="w-8 h-8 text-yellow-400 mb-4" />
      <p className="text-gray-700 italic mb-6 line-clamp-4">
        {article.excerpt || article.content}
      </p>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <h4 className="font-semibold text-gray-900">{article.title}</h4>
        </div>
        {article.featuredImage && (
          <img
            src={article.featuredImage.url}
            alt={article.title}
            className="w-12 h-12 rounded-full object-cover"
          />
        )}
      </div>
    </Card>
  );
};
