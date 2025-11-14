import React, { useState } from "react";
import {
  FileText,
  Filter,
  Search,
  Grid,
  List,
  SortAsc,
  File,
  Image,
  Video,
  Archive,
} from "lucide-react";
import type { PropertyDocument } from "../../../types";
import { DocumentPreviewModal } from "./DocumentPreviewModal";
import { DocumentCard } from "./DocumentCard";

interface DocumentsSectionProps {
  documents: PropertyDocument[];
  title?: string;
}

type DocumentCategory = "all" | "pdf" | "image" | "video" | "other";
type SortOption = "name" | "type" | "size" | "date";
type ViewMode = "grid" | "list";

export const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  documents,
  title = "Property Documents",
}) => {
  const [selectedDocument, setSelectedDocument] =
    useState<PropertyDocument | null>(null);
  const [category, setCategory] = useState<DocumentCategory>("all");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");

  if (!documents || documents.length === 0) {
    return null;
  }

  // Filter and sort documents
  const filteredDocuments = documents
    .filter((doc) => {
      const matchesCategory =
        category === "all" ||
        (category === "pdf" && doc.type.includes("pdf")) ||
        (category === "image" && doc.type.includes("image")) ||
        (category === "video" && doc.type.includes("video")) ||
        (category === "other" &&
          !doc.type.includes("pdf") &&
          !doc.type.includes("image") &&
          !doc.type.includes("video"));

      const matchesSearch =
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "type":
          return a.type.localeCompare(b.type);
        case "size":
          return b.size - a.size;
        case "date":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        default:
          return 0;
      }
    });

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return <FileText className="w-5 h-5" />;
    if (type.includes("image")) return <Image className="w-5 h-5" />;
    if (type.includes("video")) return <Video className="w-5 h-5" />;
    if (type.includes("zip") || type.includes("rar"))
      return <Archive className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const getFileTypeColor = (type: string) => {
    if (type.includes("pdf"))
      return "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400";
    if (type.includes("image"))
      return "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400";
    if (type.includes("video"))
      return "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400";
    if (type.includes("zip") || type.includes("rar"))
      return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400";
    return "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDownload = (document: PropertyDocument) => {
    const link = window.document.createElement("a");
    link.href = document.viewableUrl;
    link.download = document.name;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  const handlePreview = (document: PropertyDocument) => {
    if (document.type.includes("pdf") || document.type.includes("image")) {
      setSelectedDocument(document);
    } else {
      window.open(document.viewableUrl, "_blank");
    }
  };

  const getCategoryCount = (cat: DocumentCategory) => {
    if (cat === "all") return documents.length;
    if (cat === "pdf")
      return documents.filter((d) => d.type.includes("pdf")).length;
    if (cat === "image")
      return documents.filter((d) => d.type.includes("image")).length;
    if (cat === "video")
      return documents.filter((d) => d.type.includes("video")).length;
    return documents.filter(
      (d) =>
        !d.type.includes("pdf") &&
        !d.type.includes("image") &&
        !d.type.includes("video")
    ).length;
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {filteredDocuments.length} of {documents.length} documents
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-full sm:w-48"
            />
          </div>

          {/* View Mode */}
          <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Category Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-400" />
          {(
            ["all", "pdf", "image", "video", "other"] as DocumentCategory[]
          ).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
                category === cat
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {cat} ({getCategoryCount(cat)})
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 ml-auto">
          <SortAsc className="w-4 h-4 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="name">Name</option>
            <option value="type">Type</option>
            <option value="size">Size</option>
            <option value="date">Date</option>
          </select>
        </div>
      </div>

      {/* Documents Grid/List */}
      {filteredDocuments.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No documents found matching your criteria
          </p>
        </div>
      ) : (
        <div
          className={`
          ${
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
              : "space-y-3"
          }
        `}
        >
          {filteredDocuments.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              viewMode={viewMode}
              onPreview={handlePreview}
              onDownload={handleDownload}
              getFileIcon={getFileIcon}
              getFileTypeColor={getFileTypeColor}
              formatFileSize={formatFileSize}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}

      {/* Document Preview Modal */}
      {selectedDocument && (
        <DocumentPreviewModal
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
          onDownload={handleDownload}
          getFileIcon={getFileIcon}
          getFileTypeColor={getFileTypeColor}
          formatFileSize={formatFileSize}
        />
      )}
    </div>
  );
};
