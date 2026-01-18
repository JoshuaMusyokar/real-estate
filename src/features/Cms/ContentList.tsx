import React, { useState } from "react";
import {
  useSearchContentsQuery,
  useDeleteContentMutation,
  useToggleContentStatusMutation,
  useToggleFeaturedStatusMutation,
} from "../../services/cmsApi";
import type { ContentStatus, ContentType } from "../../types/cms";

import {
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Calendar,
  Filter,
  Plus,
} from "lucide-react";
import { format } from "date-fns";
// import { Link } from "react-router-dom";
import ConfirmDialog from "../../components/ui/ConfirmDialogue";
import { cn } from "../../utils";
import Button from "../../components/ui/button/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../../components/ui/Card";
import Select from "../../components/form/Select";
import Input from "../../components/form/input/InputField";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { StatusBadge } from "../../components/common/StatusBadge";
import { useNavigate } from "react-router";

const CONTENT_TYPES: Array<{ value: ContentType; label: string }> = [
  { value: "ARTICLE", label: "Articles" },
  { value: "PAGE", label: "Pages" },
  { value: "TOOL", label: "Tools" },
  { value: "PODCAST", label: "Podcasts" },
  { value: "WEB_STORY", label: "Web Stories" },
];

const STATUS_OPTIONS: Array<{ value: ContentStatus | "ALL"; label: string }> = [
  { value: "ALL", label: "All Status" },
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "ARCHIVED", label: "Archived" },
];

export const ContentList: React.FC = () => {
  const [filters, setFilters] = useState({
    type: "ARTICLE" as ContentType,
    status: "ALL" as ContentStatus | "ALL",
    search: "",
    limit: 20,
    offset: 0,
  });

  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);

  const { data, isLoading, refetch } = useSearchContentsQuery({
    ...filters,
    status: filters.status === "ALL" ? undefined : filters.status,
  });
  const [deleteContent] = useDeleteContentMutation();
  const [toggleStatus] = useToggleContentStatusMutation();
  const [toggleFeatured] = useToggleFeaturedStatusMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteContent(id).unwrap();
      setDeleteDialogOpen(null);
      refetch();
    } catch (error) {
      console.error("Failed to delete content:", error);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleStatus(id).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to toggle status:", error);
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      await toggleFeatured(id).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to toggle featured:", error);
    }
  };

  const contents = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Content Management
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Create and manage your website content
          </p>
        </div>
        <Button startIcon={<Plus className="h-4 w-4" />}>New Content</Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Content Type
              </label>
              <Select
                defaultValue={filters.type}
                onChange={(value) =>
                  setFilters({
                    ...filters,
                    type: value as ContentType,
                  })
                }
                options={CONTENT_TYPES}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <Select
                defaultValue={filters.status}
                onChange={(value) =>
                  setFilters({
                    ...filters,
                    status: value as ContentStatus | "ALL",
                  })
                }
                options={STATUS_OPTIONS}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search
              </label>
              <div className="flex gap-2">
                <Input
                  type="search"
                  placeholder="Search by title or content..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  //   icon={<Search className="h-4 w-4" />}
                />
                <Button
                  variant="outline"
                  startIcon={<Filter className="h-4 w-4" />}
                >
                  Filters
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {CONTENT_TYPES.find((t) => t.value === filters.type)?.label}
            </h3>
            {pagination && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {pagination.total} items
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contents.map((content) => (
                  <TableRow key={content.id}>
                    <TableCell>
                      <div className="flex items-center">
                        {content.featuredImage && (
                          <img
                            src={content.featuredImage.url}
                            alt={content.title}
                            className="h-10 w-10 rounded-md object-cover mr-3"
                          />
                        )}
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {content.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            /{content.slug}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={content.status} />
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {content.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      {content.publishedAt ? (
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="h-4 w-4 mr-1" />
                          {format(new Date(content.publishedAt), "MMM d, yyyy")}
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">
                          Not published
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-900 dark:text-gray-100">
                        {(content.metadata as any)?.viewCount || 0}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleToggleFeatured(content.id)}
                          title={
                            content.isFeatured
                              ? "Remove from featured"
                              : "Mark as featured"
                          }
                        >
                          <Star
                            className={cn(
                              "h-4 w-4",
                              content.isFeatured
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-400"
                            )}
                          />
                        </Button>
                        {/* <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleToggleStatus(content.id)}
                          title={
                            content.status === "PUBLISHED"
                              ? "Unpublish"
                              : "Publish"
                          }
                        >
                            <Eye className="h-4 w-4 text-gray-400" />
                        </Button> */}
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => navigate(`/cms/view/${content.id}`)}
                          title={
                            content.status === "PUBLISHED"
                              ? "Unpublish"
                              : "Publish"
                          }
                        >
                          <Eye className="h-4 w-4 text-gray-400" />
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => navigate(`/cms/edit/${content.id}`)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4 text-gray-400" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDeleteDialogOpen(content.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        {pagination && pagination.total > 0 && (
          <CardFooter>
            <div className="flex items-center justify-between w-full">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {filters.offset + 1} to{" "}
                {Math.min(filters.offset + filters.limit, pagination.total)} of{" "}
                {pagination.total}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={filters.offset === 0}
                  onClick={() =>
                    setFilters({
                      ...filters,
                      offset: filters.offset - filters.limit,
                    })
                  }
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  //   disabled={!pagination.hasMore}
                  onClick={() =>
                    setFilters({
                      ...filters,
                      offset: filters.offset + filters.limit,
                    })
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>

      <ConfirmDialog
        isOpen={!!deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(null)}
        onConfirm={() => deleteDialogOpen && handleDelete(deleteDialogOpen)}
        title="Delete Content"
        message="Are you sure you want to delete this content? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};
