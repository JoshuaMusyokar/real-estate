import React from "react";
import { FileText, Type } from "lucide-react";
import type { Content } from "../../types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";

interface ContentPreviewCardProps {
  content: Content;
}

export const ContentPreviewCard: React.FC<ContentPreviewCardProps> = ({
  content,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="w-5 h-5" />
          Content Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Excerpt */}
        {content.excerpt && (
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
              <Type className="w-4 h-4" />
              Excerpt
            </label>
            <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded border italic">
              "{content.excerpt}"
            </p>
          </div>
        )}

        {/* Content Body */}
        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4" />
            Content Body
          </label>
          <div
            className="prose prose-sm max-w-none bg-gray-50 p-4 rounded border max-h-96 overflow-y-auto"
            dangerouslySetInnerHTML={{ __html: content.content }}
          />
        </div>

        {/* Word Count */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
          <span>
            Excerpt: {content.excerpt ? content.excerpt.length : 0} characters
          </span>
          <span>
            Content: ~
            {content.content.replace(/<[^>]*>/g, "").split(/\s+/).length} words
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
