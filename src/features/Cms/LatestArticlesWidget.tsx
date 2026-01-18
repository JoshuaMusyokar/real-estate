// components/cms/LatestArticlesWidget.tsx
import React from "react";

import { ArticleCard } from "./ArticleCard";
import { useGetPublishedContentsQuery } from "../../services/cmsApi";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Skeleton } from "../../components/ui/skeleton";

interface LatestArticlesWidgetProps {
  limit?: number;
  excludeId?: string;
}

export const LatestArticlesWidget: React.FC<LatestArticlesWidgetProps> = ({
  limit = 5,
  excludeId,
}) => {
  const { data, isLoading } = useGetPublishedContentsQuery({
    type: "ARTICLE",
  });

  const articles = (data?.data || [])
    .filter((article) => article.id !== excludeId)
    .slice(0, limit);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Articles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="w-20 h-20 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </>
        ) : articles.length > 0 ? (
          articles.map((article) => (
            <ArticleCard key={article.id} article={article} variant="compact" />
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            No articles available
          </p>
        )}
      </CardContent>
    </Card>
  );
};
