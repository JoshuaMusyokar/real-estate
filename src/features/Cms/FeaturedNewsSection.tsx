import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useGetFeaturedContentQuery } from "../../services/cmsApi";
import Button from "../../components/ui/button/Button";
import { Skeleton } from "../../components/ui/skeleton";
import { ArticleCard } from "./ArticleCard";

export const FeaturedNewsSection: React.FC = () => {
  const { data, isLoading } = useGetFeaturedContentQuery({
    type: "ARTICLE",
    limit: 4,
  });

  const featuredArticles = data?.data || [];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Latest Property News
            </h2>
            <p className="text-gray-600">
              Stay updated with the latest trends and insights
            </p>
          </div>
          <Link to="/news">
            <Button variant="outline">
              View All News
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Articles Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : featuredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No featured articles available.</p>
          </div>
        )}
      </div>
    </section>
  );
};
