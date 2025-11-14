import React, { useState } from "react";
import { FileText, Download, Eye, X, ExternalLink } from "lucide-react";
import type { PropertyDocument } from "../../../types";

interface DocumentPreviewProps {
  document: PropertyDocument;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
}) => {
  const [showPreview, setShowPreview] = useState(false);

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return "📄";
    if (type.includes("image")) return "🖼️";
    if (type.includes("word") || type.includes("document")) return "📝";
    return "📎";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleDownload = () => {
    const link = window.document.createElement("a");
    link.href = document.url;
    link.download = document.name;
    link.click();
  };

  const handlePreview = () => {
    if (document.type.includes("pdf") || document.type.includes("image")) {
      setShowPreview(true);
    } else {
      window.open(document.url, "_blank");
    }
  };

  return (
    <>
      <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all duration-200 group">
        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-2xl">
          {getFileIcon(document.type)}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {document.name}
          </h3>
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
            <span className="capitalize">
              {document.type.split("/")[1] || document.type}
            </span>
            <span>•</span>
            <span>{formatFileSize(document.size)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePreview}
            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="Preview document"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            title="Download document"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Document Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {document.name}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 h-[calc(90vh-80px)]">
              {document.type.includes("pdf") ? (
                <iframe
                  src={document.url}
                  className="w-full h-full border-0 rounded-lg"
                  title={document.name}
                />
              ) : document.type.includes("image") ? (
                <img
                  src={document.url}
                  alt={document.name}
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <div className="flex items-center justify-center h-full flex-col gap-4">
                  <FileText className="w-16 h-16 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Preview not available for this file type
                  </p>
                  <a
                    href={document.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open in New Tab
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
