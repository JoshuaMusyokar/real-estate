import React, { useState, useMemo } from "react";
import {
  Search,
  Eye,
  Edit2,
  Trash2,
  Copy,
  ExternalLink,
  TrendingUp,
  BarChart3,
  Globe,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  Loader2,
} from "lucide-react";
import {
  useSearchLandingPagesQuery,
  useDeleteLandingPageMutation,
  usePublishLandingPageMutation,
  useUnpublishLandingPageMutation,
  useToggleLandingPageStatusMutation,
} from "../../../services/landingPageApi";

const LandingPagesAdmin = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "published" | "draft"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);

  // API Queries
  const { data, isLoading, isError, refetch } = useSearchLandingPagesQuery({
    isPublished:
      filterStatus === "all" ? undefined : filterStatus === "published",
    search: searchQuery || undefined,
    page: currentPage,
    limit: 10,
  });

  // API Mutations
  const [deleteLandingPage, { isLoading: isDeleting }] =
    useDeleteLandingPageMutation();
  const [publishLandingPage] = usePublishLandingPageMutation();
  const [unpublishLandingPage] = useUnpublishLandingPageMutation();
  const [toggleStatus] = useToggleLandingPageStatusMutation();

  const landingPages = data?.data || [];
  const pagination = data?.pagination;

  // Calculate stats from actual data
  const stats = useMemo(() => {
    const totalPages = landingPages.length;
    const published = landingPages.filter((p) => p.isPublished).length;
    const totalViews = landingPages.reduce((sum, p) => sum + p.viewCount, 0);
    const totalConversions = landingPages.reduce(
      (sum, p) => sum + p.conversionCount,
      0
    );
    return { totalPages, published, totalViews, totalConversions };
  }, [landingPages]);

  const handleDelete = async () => {
    if (!selectedPage) return;

    try {
      await deleteLandingPage(selectedPage).unwrap();
      setShowDeleteModal(false);
      setSelectedPage(null);
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("Failed to delete landing page");
    }
  };

  const handlePublishToggle = async (id: string, isPublished: boolean) => {
    try {
      if (isPublished) {
        await unpublishLandingPage(id).unwrap();
      } else {
        await publishLandingPage(id).unwrap();
      }
    } catch (error) {
      console.error("Failed to toggle publish status:", error);
      alert("Failed to update publish status");
    }
  };

  const handleStatusToggle = async (id: string, isActive: boolean) => {
    try {
      await toggleStatus({ id, isActive: !isActive }).unwrap();
    } catch (error) {
      console.error("Failed to toggle status:", error);
      alert("Failed to update status");
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString("en-US");
  };

  const getConversionRate = (views: number, conversions: number) => {
    if (views === 0) return "0%";
    return ((conversions / views) * 100).toFixed(2) + "%";
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Landing Pages
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Manage your marketing landing pages
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" />
                  Create Landing Page
                </button> */}
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Total Pages
                </span>
                <Globe className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {pagination?.total || 0}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Published
                </span>
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.published}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Total Views
                </span>
                <Eye className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatNumber(stats.totalViews)}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Conversions
                </span>
                <TrendingUp className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatNumber(stats.totalConversions)}
              </p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search landing pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
          </div>

          {/* Landing Pages Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : isError ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Failed to load landing pages
                </h3>
                <button
                  onClick={() => refetch()}
                  className="text-blue-500 hover:text-blue-600"
                >
                  Try again
                </button>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Landing Page
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Template
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Performance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Last Updated
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {landingPages.map((page) => (
                        <tr
                          key={page.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {page.title}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                                <span>/{page.slug}</span>
                                <a
                                  href={`/${page.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:text-blue-600"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() =>
                                  handlePublishToggle(page.id, page.isPublished)
                                }
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium w-fit cursor-pointer hover:opacity-80 transition-opacity ${
                                  page.isPublished
                                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                    : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                                }`}
                              >
                                {page.isPublished ? (
                                  <>
                                    <CheckCircle2 className="w-3 h-3" />{" "}
                                    Published
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="w-3 h-3" /> Draft
                                  </>
                                )}
                              </button>
                              {!page.isActive && (
                                <button
                                  onClick={() =>
                                    handleStatusToggle(page.id, page.isActive)
                                  }
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 w-fit cursor-pointer hover:opacity-80 transition-opacity"
                                >
                                  <XCircle className="w-3 h-3" /> Inactive
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-900 dark:text-white font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              {page.templateId || "Default"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Eye className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-900 dark:text-white font-medium">
                                  {formatNumber(page.viewCount)}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400">
                                  views
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <TrendingUp className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-900 dark:text-white font-medium">
                                  {formatNumber(page.conversionCount)}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400">
                                  (
                                  {getConversionRate(
                                    page.viewCount,
                                    page.conversionCount
                                  )}
                                  )
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {formatDate(page.updatedAt)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                title="Edit"
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                              >
                                <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                              </button>
                              <button
                                title="Duplicate"
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                              >
                                <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                              </button>
                              <button
                                title="View Analytics"
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                              >
                                <BarChart3 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                              </button>
                              <button
                                title="Delete"
                                onClick={() => {
                                  setSelectedPage(page.id);
                                  setShowDeleteModal(true);
                                }}
                                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {landingPages.length === 0 && (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No landing pages found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchQuery
                        ? "Try adjusting your search filters"
                        : "Create your first landing page to get started"}
                    </p>
                  </div>
                )}

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Showing {(currentPage - 1) * pagination.limit + 1} to{" "}
                      {Math.min(
                        currentPage * pagination.limit,
                        pagination.total
                      )}{" "}
                      of {pagination.total} results
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() =>
                          setCurrentPage((p) =>
                            Math.min(pagination.totalPages, p + 1)
                          )
                        }
                        disabled={currentPage === pagination.totalPages}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Delete Landing Page
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete this landing page? This action
                cannot be undone and all analytics data will be lost.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPagesAdmin;
