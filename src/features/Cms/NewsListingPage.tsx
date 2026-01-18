import React, { useState, useMemo } from "react";
import {
  Search,
  TrendingUp,
  X,
  Home,
  Calendar,
  Play,
  Calculator,
  Headphones,
  ChevronLeft,
  ChevronRight,
  Phone,
  Clock,
  ExternalLink,
} from "lucide-react";
import {
  useGetCategoriesQuery,
  useGetFeaturedContentQuery,
  useGetPublishedContentsQuery,
} from "../../services/cmsApi";
import type { Content, ContentType } from "../../types";
import Button from "../../components/ui/button/Button";
import { Skeleton } from "../../components/ui/skeleton";

// Import specialized card components
import { ArticleCard } from "./ArticleCard";
import { PageCard } from "./PageCard";
import { ToolCard } from "./ToolCard";
import { WebStoryCard } from "./WebstoriesCard";
import { PodcastCard } from "./PodcastCard";
import { FAQCard } from "./FAQsCard";
import { TestimonialCard } from "./TestimonialCard";
import { PromotionCard } from "./PromotionCard";
import { VideoSection } from "./VideoSection";
import { VideoCard } from "./VideoCard";

// Content types with specialized layouts
const CONTENT_TYPES = [
  {
    value: "ARTICLE",
    label: "Property News",
    icon: "📰",
    description: "Market updates and analysis",
  },
  {
    value: "PAGE",
    label: "Guides",
    icon: "📄",
    description: "In-depth property guides",
  },
  {
    value: "TOOL",
    label: "Calculators",
    icon: "🧮",
    description: "Interactive property tools",
  },
  {
    value: "WEB_STORY",
    label: "Web Stories",
    icon: "📱",
    description: "Visual property tours",
  },
  {
    value: "PODCAST",
    label: "Podcasts",
    icon: "🎙️",
    description: "Expert property talks",
  },
  {
    value: "PROMOTION",
    label: "Deals",
    icon: "🏷️",
    description: "Special offers",
  },
  {
    value: "FAQ",
    label: "Q&A",
    icon: "❓",
    description: "Common property questions",
  },
  {
    value: "TESTIMONIAL",
    label: "Success Stories",
    icon: "⭐",
    description: "Client experiences",
  },
  {
    value: "VIDEO",
    label: "Videos",
    icon: "🎬",
    description: "Property tours and interviews",
  },
] as const;

// Mock banners for demonstration
const mockBanners = [
  {
    id: "1",
    title: "Luxury Apartments in Prime Location",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=400&fit=crop",
    link: "/properties/luxury-apartments",
  },
  {
    id: "2",
    title: "Commercial Properties with High ROI",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=400&fit=crop",
    link: "/properties/commercial",
  },
  {
    id: "3",
    title: "Affordable Housing Schemes 2026",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=400&fit=crop",
    link: "/properties/affordable",
  },
];

const quickLinks = [
  { label: "Buy Property", icon: Home, link: "/buy" },
  { label: "Rent Property", icon: Home, link: "/rent" },
  { label: "Sell Property", icon: Home, link: "/sell" },
  { label: "Property Valuation", icon: Calculator, link: "/valuation" },
  { label: "Market Reports", icon: TrendingUp, link: "/reports" },
  { label: "Legal Services", icon: ExternalLink, link: "/legal" },
];

export const NewsListingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<ContentType>("ARTICLE");
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentBanner, setCurrentBanner] = useState(0);

  const currentTypeConfig =
    CONTENT_TYPES.find((t) => t.value === selectedType) || CONTENT_TYPES[0];
  const limit = 6;

  // Fetch data using your existing API
  const { data: featuredData, isLoading: featuredLoading } =
    useGetFeaturedContentQuery({
      type: selectedType,
      limit: 3,
    });

  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: contentData, isLoading: contentLoading } =
    useGetPublishedContentsQuery({
      type: selectedType,
    });
  const { data: videoData, isLoading: videoContentLoading } =
    useGetPublishedContentsQuery({
      type: "VIDEO",
    });

  const categories = categoriesData?.data || [];
  const featuredContent = featuredData?.data || [];
  const allContent = contentData?.data || [];
  const videoContent = videoData?.data || [];

  // Banner auto-slide
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % mockBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Filter content
  const filteredContent = useMemo(() => {
    let filtered = allContent.filter(
      (item) => !featuredContent.some((f) => f.id === item.id)
    );

    if (selectedCategory) {
      filtered = filtered.filter((item) =>
        item.categories.some((cat) => cat.id === selectedCategory)
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.excerpt?.toLowerCase().includes(query) ||
          item.keywords?.some((kw) => kw.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [allContent, featuredContent, selectedCategory, searchQuery]);

  // Get popular content (most recent or featured)
  const popularContent = useMemo(() => {
    return allContent.slice(0, 3);
  }, [allContent]);

  // const videoContent = useMemo(() => {
  //   return allContent.filter((item) => item.type === "VIDEO").slice(0, 3);
  // }, [allContent]);

  // Get podcast content
  const podcastContent = useMemo(() => {
    return allContent.filter((item) => item.type === "PODCAST").slice(0, 2);
  }, [allContent]);

  // Pagination
  const totalPages = Math.ceil(filteredContent.length / limit);
  const paginatedContent = filteredContent.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  // Handlers
  const handleTypeChange = (type: ContentType) => {
    setSelectedType(type);
    setSelectedCategory(undefined);
    setCurrentPage(1);
  };

  const handleCategoryChange = (categoryId?: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(undefined);
  };

  // Render appropriate card component
  const renderCard = (item: Content) => {
    const props = { key: item.id, article: item };

    switch (item.type || selectedType) {
      case "ARTICLE":
        return <ArticleCard {...props} />;
      case "PAGE":
        return <PageCard {...props} />;
      case "TOOL":
        return <ToolCard {...props} />;
      case "WEB_STORY":
        return <WebStoryCard {...props} />;
      case "PODCAST":
        return <PodcastCard {...props} />;
      case "VIDEO":
        return <VideoCard {...props} />;
      case "FAQ":
        return <FAQCard {...props} />;
      case "TESTIMONIAL":
        return <TestimonialCard {...props} />;
      case "PROMOTION":
        return <PromotionCard {...props} />;
      default:
        return <ArticleCard {...props} />;
    }
  };

  // Active filters count
  const activeFiltersCount =
    (selectedCategory ? 1 : 0) + (searchQuery.trim() ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center gap-0 group flex-shrink-0">
              <span className="text-2xl font-black text-yellow-400">
                BENGALPROPERTY
              </span>
              <span className="text-xl font-bold text-gray-800">.COM</span>
            </a>

            {/* Content Type Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {CONTENT_TYPES.slice(0, 6).map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleTypeChange(type.value as ContentType)}
                  className={`text-sm font-medium uppercase tracking-wide transition-colors ${
                    selectedType === type.value
                      ? "text-yellow-500 border-b-2 border-yellow-500"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </nav>

            {/* Search */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent w-48 lg:w-64"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN - Main Content */}
          <div className="lg:col-span-8">
            {/* Banner Slider */}
            <div className="relative mb-8 rounded-2xl overflow-hidden shadow-lg group">
              <div className="relative h-[400px]">
                {mockBanners.map((banner, index) => (
                  <div
                    key={banner.id}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      index === currentBanner ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <h2 className="text-3xl font-bold mb-2">
                        {banner.title}
                      </h2>
                      <a
                        href={banner.link}
                        className="inline-flex items-center text-yellow-400 hover:text-yellow-300 font-semibold"
                      >
                        Learn More <ChevronRight className="w-5 h-5 ml-1" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Banner Controls */}
              <button
                onClick={() =>
                  setCurrentBanner(
                    (prev) =>
                      (prev - 1 + mockBanners.length) % mockBanners.length
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={() =>
                  setCurrentBanner((prev) => (prev + 1) % mockBanners.length)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {mockBanners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBanner(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentBanner
                        ? "bg-yellow-400 w-8"
                        : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Page Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {currentTypeConfig.label}
                  </h1>
                  <p className="text-gray-600 mt-2">
                    {currentTypeConfig.description}
                  </p>
                </div>

                {/* Quick Type Selector for Mobile */}
                <div className="lg:hidden">
                  <select
                    value={selectedType}
                    onChange={(e) =>
                      handleTypeChange(e.target.value as ContentType)
                    }
                    className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent sm:text-sm"
                  >
                    {CONTENT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-gray-50 rounded-xl p-4 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">
                    Filter by:
                  </span>

                  {/* Category Filters */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleCategoryChange(undefined)}
                      className={`px-3 py-1.5 rounded-full text-sm ${
                        !selectedCategory
                          ? "bg-yellow-400 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.slice(0, 5).map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryChange(category.id)}
                        className={`px-3 py-1.5 rounded-full text-sm ${
                          selectedCategory === category.id
                            ? "bg-yellow-400 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear filters
                  </button>
                )}
              </div>
            </div>

            {/* Main Content */}
            {contentLoading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-48 w-full rounded-xl" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            ) : filteredContent.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No {currentTypeConfig.label.toLowerCase()} found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={clearFilters}>Clear all filters</Button>
              </div>
            ) : (
              <>
                {/* Results Count */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm text-gray-600">
                    Showing {filteredContent.length}{" "}
                    {currentTypeConfig.label.toLowerCase()}
                  </span>
                </div>

                {/* Content Cards in Column */}
                <div className="space-y-6">
                  {paginatedContent.map((item) => (
                    <div key={item.id}>{renderCard(item)}</div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <div className="flex items-center space-x-1">
                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                          const pageNum = i + 1;
                          return (
                            <button
                              key={i}
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-10 h-10 rounded-full ${
                                currentPage === pageNum
                                  ? "bg-yellow-400 text-white"
                                  : "hover:bg-gray-100"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* RIGHT COLUMN - Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Popular Blogs */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-yellow-500" />
                Explore
              </h3>
              {popularContent.length > 0 ? (
                <div className="space-y-4">
                  {popularContent.map((blog) => (
                    <div key={blog.id} className="group cursor-pointer">
                      <div className="flex space-x-3">
                        {blog.featuredImage && (
                          <img
                            src={blog.featuredImage.url || ""}
                            alt={blog.title}
                            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-gray-900 group-hover:text-yellow-600 line-clamp-2 mb-1">
                            {blog.title}
                          </h4>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(
                                blog.publishedAt || blog.createdAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No popular content available
                </p>
              )}
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <div className="grid grid-cols-2 gap-3">
                {quickLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.link}
                    className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 transition-all group"
                  >
                    <link.icon className="w-6 h-6 text-gray-600 group-hover:text-yellow-600 mb-2" />
                    <span className="text-xs text-center font-medium text-gray-700 group-hover:text-yellow-700">
                      {link.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Call to Action - Post Property */}
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">List Your Property</h3>
              <p className="mb-4 text-yellow-50">
                Reach thousands of potential buyers and renters today!
              </p>
              <button className="w-full bg-white text-gray-900 font-bold py-3 rounded-lg hover:bg-gray-100 transition-colors">
                Post Property Free
              </button>
              <div className="mt-4 pt-4 border-t border-yellow-300/30">
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="w-4 h-4" />
                  <span>Call: +254 700 000 000</span>
                </div>
              </div>
            </div>
            {/* Videos Section */}
            {videoContent.length > 0 && (
              <VideoSection
                videos={videoContent}
                title="Property Videos"
                description="Virtual tours and expert insights"
                maxItems={2}
              />
            )}

            {/* Podcasts Section */}
            {podcastContent.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Headphones className="w-5 h-5 mr-2 text-purple-500" />
                  Latest Podcasts
                </h3>
                <div className="space-y-4">
                  {podcastContent.map((podcast) => (
                    <PodcastCard
                      key={podcast.id}
                      article={podcast}
                      variant="compact"
                    />
                  ))}
                </div>
                <button className="w-full mt-4 text-center text-purple-600 hover:text-purple-700 font-semibold text-sm">
                  View All Episodes →
                </button>
              </div>
            )}

            {/* Newsletter Signup */}
            <div className="bg-gray-900 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
              <p className="text-gray-300 text-sm mb-4">
                Get the latest property news and insights delivered to your
                inbox.
              </p>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg text-gray-900 mb-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button className="w-full bg-yellow-400 text-gray-900 font-bold py-2 rounded-lg hover:bg-yellow-500 transition-colors">
                Subscribe
              </button>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">
                {currentTypeConfig.label} Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total</span>
                  <span className="font-semibold">{allContent.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Featured</span>
                  <span className="font-semibold">
                    {featuredContent.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Categories</span>
                  <span className="font-semibold">
                    {
                      [
                        ...new Set(
                          allContent.flatMap((c) =>
                            c.categories.map((cat) => cat.id)
                          )
                        ),
                      ].length
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
