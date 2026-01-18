import React from "react";
import type { Content } from "../../types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { AlertCircle, FileText, Search, Tag } from "lucide-react";
import Badge from "../../components/ui/badge/Badge";

interface ContentSEOCardProps {
  content: Content;
}

export const ContentSEOCard: React.FC<ContentSEOCardProps> = ({ content }) => {
  const hasMetaTitle = content.metaTitle && content.metaTitle.trim().length > 0;
  const hasMetaDescription =
    content.metaDescription && content.metaDescription.trim().length > 0;
  const hasKeywords = content.keywords && content.keywords.length > 0;

  const seoScore = [hasMetaTitle, hasMetaDescription, hasKeywords].filter(
    Boolean,
  ).length;
  const seoPercentage = (seoScore / 3) * 100;

  const getSEOScoreColor = () => {
    if (seoPercentage >= 80) return "success";
    if (seoPercentage >= 50) return "warning";
    return "error";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="w-5 h-5" />
            SEO Information
          </CardTitle>
          <Badge color={getSEOScoreColor()}>
            {seoPercentage.toFixed(0)}% Complete
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Meta Title */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Meta Title
            </label>
            {hasMetaTitle && (
              <Badge variant="light" color="success">
                {content.metaTitle!.length} chars
              </Badge>
            )}
          </div>
          {hasMetaTitle ? (
            <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded border">
              {content.metaTitle}
            </p>
          ) : (
            <div className="flex items-start gap-2 text-sm text-gray-500 bg-yellow-50 p-3 rounded border border-yellow-200">
              <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">
                  Using default title
                </p>
                <p className="text-yellow-700 mt-1">"{content.title}"</p>
              </div>
            </div>
          )}
        </div>

        {/* Meta Description */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Meta Description
            </label>
            {hasMetaDescription && (
              <Badge variant="light" color="success">
                {content.metaDescription!.length} chars
              </Badge>
            )}
          </div>
          {hasMetaDescription ? (
            <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded border">
              {content.metaDescription}
            </p>
          ) : (
            <div className="flex items-start gap-2 text-sm text-gray-500 bg-yellow-50 p-3 rounded border border-yellow-200">
              <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">
                  Using default description
                </p>
                {content.excerpt ? (
                  <p className="text-yellow-700 mt-1">"{content.excerpt}"</p>
                ) : (
                  <p className="text-yellow-700 mt-1">
                    No meta description or excerpt set
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Keywords */}
        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
            <Tag className="w-4 h-4" />
            Keywords
            {hasKeywords && (
              <Badge variant="light">{content.keywords.length}</Badge>
            )}
          </label>
          {hasKeywords ? (
            <div className="flex flex-wrap gap-2">
              {content.keywords.map((keyword, index) => (
                <Badge key={index} variant="light">
                  {keyword}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="flex items-start gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded border">
              <AlertCircle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <p>No keywords defined</p>
            </div>
          )}
        </div>

        {/* SEO Recommendations */}
        {seoPercentage < 100 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Recommendations:
            </p>
            <ul className="space-y-1 text-sm text-gray-600">
              {!hasMetaTitle && (
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  Add a custom meta title for better SEO
                </li>
              )}
              {!hasMetaDescription && (
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  Add a meta description (150-160 characters recommended)
                </li>
              )}
              {!hasKeywords && (
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  Add relevant keywords to improve search visibility
                </li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
