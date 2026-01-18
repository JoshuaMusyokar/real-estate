import React, { useState } from "react";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Copy,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Home,
} from "lucide-react";
import { format } from "date-fns";
import type { Content } from "../../types";
import { Card } from "../../components/ui/Card";
import Button from "../../components/ui/button/Button";

interface FAQCardProps {
  article: Content;
  variant?: "default" | "expanded" | "simple";
}

// Get FAQ type icon and color
const getFAQType = (categories: any[]) => {
  const category = categories[0]?.name?.toLowerCase() || "";
  const title = categories[0]?.name || "";

  if (category.includes("mortgage") || category.includes("finance"))
    return { icon: DollarSign, color: "text-green-600", bg: "bg-green-100" };
  if (category.includes("legal") || category.includes("contract"))
    return { icon: Shield, color: "text-red-600", bg: "bg-red-100" };
  if (category.includes("buy") || category.includes("purchase"))
    return { icon: Home, color: "text-blue-600", bg: "bg-blue-100" };
  if (category.includes("rent") || category.includes("tenant"))
    return { icon: Key, color: "text-purple-600", bg: "bg-purple-100" };
  if (category.includes("tax") || category.includes("stamp"))
    return { icon: Calculator, color: "text-yellow-600", bg: "bg-yellow-100" };

  return { icon: HelpCircle, color: "text-gray-600", bg: "bg-gray-100" };
};

// Re-import icons needed
const DollarSign = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const Key = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
    />
  </svg>
);

const Shield = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

const Calculator = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
    />
  </svg>
);

export const FAQCard: React.FC<FAQCardProps> = ({
  article,
  variant = "default",
}) => {
  const [isExpanded, setIsExpanded] = useState(variant === "expanded");
  const [hasHelpful, setHasHelpful] = useState<boolean | null>(null);

  const formattedDate = format(
    new Date(article.publishedAt || article.createdAt),
    "MMM d, yyyy",
  );

  const faqType = getFAQType(article.categories);
  const Icon = faqType.icon;
  const isImportant = article.metadata?.important || false;
  const isComplex = article.metadata?.complexity === "complex";
  const relatedLinks = article.metadata?.relatedLinks || [];
  const source = article.metadata?.source || "Property Expert";

  const handleCopy = () => {
    const text = `${article.title}\n\n${
      article.excerpt || article.content?.substring(0, 200)
    }...`;
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      });
    }
  };

  if (variant === "simple") {
    return (
      <div className="border-b py-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left focus:outline-none group"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${faqType.bg}`}>
                <Icon className={`w-5 h-5 ${faqType.color}`} />
              </div>
              <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                {article.title}
              </h3>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
            )}
          </div>

          {isExpanded && (
            <div className="mt-4 ml-12">
              <div className="prose prose-sm text-gray-600">
                {article.excerpt || article.content?.substring(0, 300)}
              </div>
              {article.metadata?.source && (
                <div className="mt-3 text-sm text-gray-500">
                  Source: {article.metadata.source}
                </div>
              )}
            </div>
          )}
        </button>
      </div>
    );
  }

  if (variant === "expanded") {
    return (
      <Card className="overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-xl ${faqType.bg}`}>
                <Icon className={`w-6 h-6 ${faqType.color}`} />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold text-gray-900">
                    {article.title}
                  </h2>
                  {isImportant && (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  )}
                </div>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-sm text-gray-500">
                    {article.categories[0]?.name || "General"}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-sm text-gray-500">
                    Updated {formattedDate}
                  </span>
                  {isComplex && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-red-600 font-medium">
                        Complex Topic
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopy}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Copy"
              >
                <Copy className="w-4 h-4 text-gray-500" />
              </button>
              <button
                onClick={handleShare}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Share"
              >
                <Share2 className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="prose max-w-none mb-6">
            {article.content ? (
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            ) : (
              <p className="text-gray-700">{article.excerpt}</p>
            )}
          </div>

          {/* Source and Verification */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800 font-medium">
                  Verified Information
                </p>
                <p className="text-sm text-blue-700">
                  Source: {source} • Last verified: {formattedDate}
                </p>
              </div>
            </div>
          </div>

          {/* Related Links */}
          {relatedLinks.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">
                Related Resources
              </h4>
              <div className="space-y-2">
                {relatedLinks.slice(0, 3).map((link: any, index: number) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700 group-hover:text-primary">
                        {link.title}
                      </span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Feedback */}
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-3">
              Was this helpful?
            </h4>
            <div className="flex items-center space-x-4">
              <Button
                variant={hasHelpful === true ? "primary" : "outline"}
                size="sm"
                onClick={() => setHasHelpful(true)}
                className="flex items-center"
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                Yes
              </Button>
              <Button
                variant={hasHelpful === false ? "primary" : "outline"}
                size="sm"
                onClick={() => setHasHelpful(false)}
                className="flex items-center"
              >
                <ThumbsDown className="w-4 h-4 mr-2" />
                No
              </Button>
              <span className="text-sm text-gray-500 ml-4">
                {article.metadata?.helpfulCount || 124} people found this
                helpful
              </span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        {/* Question Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left focus:outline-none group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${faqType.bg}`}>
                <Icon className={`w-5 h-5 ${faqType.color}`} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-xs text-gray-500">
                    {article.categories[0]?.name || "FAQ"}
                  </span>
                  {isImportant && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-red-600 font-medium">
                        Important
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
            )}
          </div>
        </button>

        {/* Answer (Collapsible) */}
        {isExpanded && (
          <div className="mt-4">
            <div className="prose prose-sm text-gray-700 mb-4">
              {article.excerpt || article.content?.substring(0, 250)}
              {article.content &&
                article.content.length > 250 &&
                !article.excerpt &&
                "..."}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopy}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Copy answer"
                >
                  <Copy className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={() =>
                    setHasHelpful(hasHelpful === true ? null : true)
                  }
                  className={`p-2 rounded-lg transition-colors ${
                    hasHelpful === true
                      ? "bg-green-100 text-green-600"
                      : "hover:bg-gray-100 text-gray-500"
                  }`}
                  title="Helpful"
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>
              </div>

              <div className="text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{article.metadata?.views || "1.2k"} views</span>
                </div>
              </div>
            </div>

            {/* Source */}
            {article.metadata?.source && (
              <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                Source: {article.metadata.source}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
