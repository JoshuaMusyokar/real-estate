import React, { useState } from "react";
import { useParams, Link, useNavigate, Navigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  ArrowLeft,
  ChevronRight,
  Eye,
  Bookmark,
  BookmarkCheck,
  Play,
  Volume2,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import {
  useGetContentBySlugQuery,
  useGetFeaturedContentQuery,
} from "../../services/cmsApi";
import { Skeleton } from "../../components/ui/skeleton";
import Button from "../../components/ui/button/Button";
import { SEO } from "./SEO";
import { Card } from "../../components/ui/Card";
import Badge from "../../components/ui/badge/Badge";
import { ArticleCard } from "./ArticleCard";
import { WebStoryCard } from "./WebstoriesCard";
import { LatestArticlesWidget } from "./LatestArticlesWidget";

const CONTENT_CONFIG = {
  ARTICLE: {
    backText: "Back to Articles",
    backLink: "/news",
    relatedTitle: "Related Articles",
    icon: null,
  },
  WEB_STORY: {
    backText: "Back to Stories",
    backLink: "/news",
    relatedTitle: "More Stories",
    icon: Play,
  },
  PODCAST: {
    backText: "Back to Podcasts",
    backLink: "/news",
    relatedTitle: "More Episodes",
    icon: Volume2,
  },
  VIDEO: {
    backText: "Back to Videos",
    backLink: "/news",
    relatedTitle: "Related Videos",
    icon: Play,
  },
  TOOL: {
    backText: "Back to Tools",
    backLink: "/news",
    relatedTitle: "Related Tools",
    icon: Sparkles,
  },
  PAGE: {
    backText: "Back",
    backLink: "/news",
    relatedTitle: "Related Content",
    icon: null,
  },
};

export const PublicContentDetailPage: React.FC = () => {
  const { type, slug } = useParams<{ slug: string; type: string }>();
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const { data: contentData, isLoading } = useGetContentBySlugQuery(
    slug || "",
    { skip: !slug }
  );

  const content = contentData?.data;
  const contentType = content?.type || "ARTICLE";

  const { data: relatedData } = useGetFeaturedContentQuery(
    {
      type: contentType,
      limit: 6,
    },
    { skip: !content }
  );
  const allowedTypes = ["news", "stories", "podcasts", "videos"];

  if (type && !allowedTypes.includes(type)) {
    return <Navigate to="/404" replace />;
  }

  const config =
    CONTENT_CONFIG[contentType as keyof typeof CONTENT_CONFIG] ||
    CONTENT_CONFIG.ARTICLE;
  const relatedContent =
    relatedData?.data?.filter((item) => item.id !== content?.id) || [];

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = content?.title || "";

    if (platform === "native" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (err: unknown) {
        console.log("Share cancelled", err);
      }
    }

    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Implement actual bookmark logic here
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <Skeleton className="h-8 w-32 mb-6" />
              <Skeleton className="h-16 w-full mb-4" />
              <Skeleton className="h-6 w-2/3 mb-8" />
              <Skeleton className="h-[400px] w-full mb-8 rounded-2xl" />
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-4">
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Content not found</h1>
          <p className="text-gray-600 mb-6">
            The content you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate(-1)} className="rounded-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const formattedDate = content.publishedAt
    ? format(new Date(content.publishedAt), "MMMM d, yyyy")
    : format(new Date(content.createdAt), "MMMM d, yyyy");

  const ContentIcon = config.icon;

  return (
    <>
      <SEO
        title={content.metaTitle || content.title}
        description={content.metaDescription || content.excerpt}
        keywords={content.keywords}
        image={content.featuredImage?.url}
        type="article"
        publishedTime={content.publishedAt?.toString()}
        modifiedTime={content.updatedAt.toString()}
        author={content.metadata?.author}
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section with Gradient Background */}
        <div className="relative bg-gradient-to-br from-primary/5 via-purple-50/30 to-pink-50/20 border-b">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              <Link to="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link
                to={config.backLink}
                className="hover:text-primary transition-colors"
              >
                {config.backText.replace("Back to ", "")}
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 truncate max-w-[200px] md:max-w-none">
                {content.title}
              </span>
            </nav>

            {/* Back Button - Mobile Optimized */}
            <Button
              variant="ghost"
              onClick={() => navigate(config.backLink)}
              className="mb-6 -ml-2 hover:bg-white/50 rounded-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {config.backText}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Article Content */}
            <article className="lg:col-span-8">
              <Card className="overflow-hidden shadow-xl rounded-2xl">
                <div className="p-6 md:p-10">
                  {/* Categories & Type Badge */}
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    {ContentIcon && (
                      <Badge color="primary">
                        <ContentIcon className="w-3 h-3 mr-1" />
                        {contentType.replace("_", " ")}
                      </Badge>
                    )}
                    {content.categories.map((category) => (
                      <Badge key={category.id} variant="light">
                        {category.name}
                      </Badge>
                    ))}
                    {content.isFeatured && (
                      <Badge color="warning">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
                    {content.title}
                  </h1>

                  {/* Excerpt */}
                  {content.excerpt && (
                    <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                      {content.excerpt}
                    </p>
                  )}

                  {/* Metadata Bar - Mobile Responsive */}
                  <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-600 mb-8 pb-8 border-b">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      {formattedDate}
                    </span>
                    {content.metadata?.readTime && (
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        {content.metadata.readTime}
                      </span>
                    )}
                    {content.metadata?.views && (
                      <span className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-primary" />
                        {content.metadata.views} views
                      </span>
                    )}
                    {content.metadata?.author && (
                      <span className="flex items-center gap-2 font-medium text-gray-900">
                        By {content.metadata.author}
                      </span>
                    )}
                  </div>

                  {/* Featured Image */}
                  {content.featuredImage && (
                    <div className="mb-10 rounded-2xl overflow-hidden shadow-2xl">
                      <img
                        src={content.featuredImage.url}
                        alt={content.title}
                        className="w-full h-auto"
                      />
                    </div>
                  )}

                  {/* Video Player */}
                  {content.videoUrl && (
                    <div className="mb-10 rounded-2xl overflow-hidden shadow-2xl aspect-video">
                      <iframe
                        src={content.videoUrl}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}

                  {/* Audio Player */}
                  {content.audioUrl && (
                    <div className="mb-10">
                      <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50">
                        <audio controls className="w-full">
                          <source src={content.audioUrl} />
                          Your browser does not support the audio element.
                        </audio>
                      </Card>
                    </div>
                  )}

                  {/* Action Bar - Sticky on Mobile */}
                  <div className="sticky top-4 z-10 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-4 mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600 hidden md:flex items-center gap-2">
                        <Share2 className="w-4 h-4" />
                        Share:
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShare("facebook")}
                          className="rounded-full"
                        >
                          <Facebook className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShare("twitter")}
                          className="rounded-full"
                        >
                          <Twitter className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShare("linkedin")}
                          className="rounded-full"
                        >
                          <Linkedin className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant={isBookmarked ? "primary" : "outline"}
                      size="sm"
                      onClick={toggleBookmark}
                      className="rounded-full"
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 md:mr-2" />
                      ) : (
                        <Bookmark className="w-4 h-4 md:mr-2" />
                      )}
                      <span className="hidden md:inline">
                        {isBookmarked ? "Saved" : "Save"}
                      </span>
                    </Button>
                  </div>

                  {/* Main Content */}
                  <div
                    className="prose prose-lg md:prose-xl max-w-none mb-12 prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-img:shadow-xl"
                    dangerouslySetInnerHTML={{ __html: content.content }}
                  />

                  {/* Gallery - Responsive Grid */}
                  {content.gallery && content.gallery.length > 0 && (
                    <div className="mb-12">
                      <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2">
                        <span className="w-1 h-8 bg-gradient-to-b from-primary to-purple-600 rounded-full" />
                        Gallery
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {content.gallery.map((item) => (
                          <div
                            key={item.id}
                            className="group relative rounded-2xl overflow-hidden aspect-video shadow-lg hover:shadow-2xl transition-all duration-300"
                          >
                            <img
                              src={item.media.url}
                              alt={item.caption || ""}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            {item.caption && (
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-4">
                                <p className="text-sm font-medium">
                                  {item.caption}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {content.keywords && content.keywords.length > 0 && (
                    <div className="pt-8 border-t">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-gray-900 mr-2">
                          Tags:
                        </span>
                        {content.keywords.map((keyword, index) => (
                          <Badge key={index} variant="light">
                            #{keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Related Content - Mobile Responsive */}
              {relatedContent.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-1 h-8 bg-gradient-to-b from-primary to-purple-600 rounded-full" />
                    {config.relatedTitle}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {relatedContent
                      .slice(0, 4)
                      .map((item) =>
                        contentType === "WEB_STORY" ? (
                          <WebStoryCard key={item.id} article={item} />
                        ) : (
                          <ArticleCard
                            key={item.id}
                            article={item}
                            variant="default"
                          />
                        )
                      )}
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar - Hidden on Mobile, Sticky on Desktop */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="sticky top-8 space-y-6">
                <LatestArticlesWidget limit={5} excludeId={content.id} />

                {/* CTA Card */}
                <Card className="p-6 bg-gradient-to-br from-primary to-purple-600 text-white">
                  <h3 className="text-xl font-bold mb-3">Stay Updated</h3>
                  <p className="text-white/90 text-sm mb-4">
                    Get the latest updates delivered directly to your inbox.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full bg-white text-primary hover:bg-gray-50"
                  >
                    Subscribe Now
                  </Button>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};
