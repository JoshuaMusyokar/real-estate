/* eslint-disable @typescript-eslint/no-unused-vars */
import { FileText, Download, Eye, Calendar, FileCheck } from "lucide-react";
import type { PropertyDocument } from "../../../types";

interface DocumentsSectionProps {
  documents: PropertyDocument[];
  propertyTitle: string;
}

export const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  documents,
  propertyTitle,
}) => {
  if (!documents || documents.length === 0) {
    return null;
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getFileIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("pdf")) return <FileText className="w-5 h-5" />;
    if (lowerType.includes("doc")) return <FileText className="w-5 h-5" />;
    return <FileCheck className="w-5 h-5" />;
  };

  const getFileTypeColor = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("pdf")) return "bg-red-100 text-red-600";
    if (lowerType.includes("doc")) return "bg-blue-100 text-blue-600";
    return "bg-gray-100 text-gray-600";
  };

  const handleDownload = async (document: PropertyDocument) => {
    try {
      // Open in new tab for download
      window.open(document.url, "_blank");
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download document");
    }
  };

  const handlePreview = (document: PropertyDocument) => {
    // Open document in new tab for preview
    window.open(document.url, "_blank");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">Property Documents</h2>
        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          {documents.length} {documents.length === 1 ? "file" : "files"}
        </span>
      </div>

      <div className="space-y-3">
        {documents.map((document) => (
          <div
            key={document.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50/30 transition-all group"
          >
            <div className="flex items-start gap-4">
              {/* File Icon */}
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getFileTypeColor(
                  document.type
                )}`}
              >
                {getFileIcon(document.type)}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1 truncate">
                  {document.name}
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    {document.type.toUpperCase()}
                  </span>
                  <span>{formatFileSize(document.size)}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(document.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handlePreview(document)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                  title="Preview"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDownload(document)}
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-100 rounded-lg transition-all"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Message */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">Note:</span> These documents are
          provided for informational purposes. Please verify all details before
          making decisions.
        </p>
      </div>
    </div>
  );
};
