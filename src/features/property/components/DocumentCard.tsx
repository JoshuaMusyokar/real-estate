import { Download, Eye } from "lucide-react";
import type { PropertyDocument } from "../../../types";
type ViewMode = "grid" | "list";

// Document Card Component
interface DocumentCardProps {
  document: PropertyDocument;
  viewMode: ViewMode;
  onPreview: (doc: PropertyDocument) => void;
  onDownload: (doc: PropertyDocument) => void;
  getFileIcon: (type: string) => React.JSX.Element;
  getFileTypeColor: (type: string) => string;
  formatFileSize: (bytes: number) => string;
  formatDate: (date: Date | string) => string;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  viewMode,
  onPreview,
  onDownload,
  getFileIcon,
  getFileTypeColor,
  formatFileSize,
  formatDate,
}) => {
  if (viewMode === "list") {
    return (
      <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl hover:shadow-lg transition-all duration-200 group">
        <div className={`p-3 rounded-lg ${getFileTypeColor(document.type)}`}>
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
            <span>•</span>
            <span>{formatDate(document.createdAt)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onPreview(document)}
            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="Preview document"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDownload(document)}
            className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            title="Download document"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-xl transition-all duration-300 group hover:border-blue-200 dark:hover:border-blue-800">
      <div className="flex items-start gap-3 mb-3">
        <div className={`p-3 rounded-lg ${getFileTypeColor(document.type)}`}>
          {getFileIcon(document.type)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {document.name}
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {formatFileSize(document.size)}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
        <span className="capitalize bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
          {document.type.split("/")[1] || document.type}
        </span>
        <span>{formatDate(document.createdAt)}</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onPreview(document)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
        >
          <Eye className="w-4 h-4" />
          Preview
        </button>
        <button
          onClick={() => onDownload(document)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>
    </div>
  );
};
