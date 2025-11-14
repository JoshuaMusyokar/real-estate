import { Download, ExternalLink, FileText, X } from "lucide-react";
import type { PropertyDocument } from "../../../types";

interface DocumentPreviewModalProps {
  document: PropertyDocument;
  onClose: () => void;
  onDownload: (doc: PropertyDocument) => void;
  getFileIcon: (type: string) => React.JSX.Element;
  getFileTypeColor: (type: string) => string;
  formatFileSize: (bytes: number) => string;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document,
  onClose,
  onDownload,
  getFileIcon,
  getFileTypeColor,
  formatFileSize,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${getFileTypeColor(document.type)}`}
            >
              {getFileIcon(document.type)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {document.name}
              </h3>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {formatFileSize(document.size)} • {document.type}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDownload(document)}
              className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="p-4 h-[calc(90vh-80px)]">
          {document.type.includes("pdf") ? (
            <iframe
              src={document.viewableUrl}
              className="w-full h-full border-0 rounded-lg"
              title={document.name}
            />
          ) : document.type.includes("image") ? (
            <div className="flex items-center justify-center h-full">
              <img
                src={document.viewableUrl}
                alt={document.name}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full flex-col gap-4">
              <FileText className="w-16 h-16 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Preview not available for this file type.
                <br />
                Please download the file to view its contents.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => onDownload(document)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <a
                  href={document.viewableUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in New Tab
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
