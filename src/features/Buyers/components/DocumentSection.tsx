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
  if (!documents?.length) return null;

  const formatSize = (bytes: number) =>
    bytes < 1024
      ? `${bytes} B`
      : bytes < 1048576
        ? `${(bytes / 1024).toFixed(1)} KB`
        : `${(bytes / 1048576).toFixed(1)} MB`;

  const fileStyle = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("pdf"))
      return {
        color: "bg-red-50 text-red-600 border-red-100",
        icon: <FileText className="w-4 h-4" />,
      };
    if (t.includes("doc"))
      return {
        color: "bg-blue-50 text-blue-600 border-blue-100",
        icon: <FileText className="w-4 h-4" />,
      };
    return {
      color: "bg-gray-50 text-gray-500 border-gray-200",
      icon: <FileCheck className="w-4 h-4" />,
    };
  };

  return (
    <div className="bg-white border border-blue-100 rounded-xl p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm sm:text-base font-bold text-gray-900">
          Property Documents
        </h2>
        <span className="text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
          {documents.length} {documents.length === 1 ? "file" : "files"}
        </span>
      </div>

      {/* Document list */}
      <div className="space-y-2 mb-4">
        {documents.map((doc) => {
          const style = fileStyle(doc.type);
          return (
            <div
              key={doc.id}
              className="flex items-center gap-3 p-2.5 sm:p-3 bg-gray-50/70 hover:bg-blue-50/40 border border-gray-100 hover:border-blue-100 rounded-xl transition-all group"
            >
              {/* Icon */}
              <div
                className={`w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0 ${style.color}`}
              >
                {style.icon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                  {doc.name}
                </p>
                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                  <span className="text-[10px] text-gray-400 font-medium">
                    {doc.type.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {formatSize(doc.size)}
                  </span>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Calendar className="w-2.5 h-2.5" />
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => window.open(doc.url, "_blank")}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Preview"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => window.open(doc.url, "_blank")}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                  title="Download"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Note */}
      <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl">
        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
        <p className="text-[11px] text-blue-700 leading-relaxed">
          <span className="font-bold">Note:</span> These documents are for
          informational purposes. Please verify all details before making
          decisions.
        </p>
      </div>
    </div>
  );
};
