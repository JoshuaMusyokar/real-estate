/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { X, Download, FileText, ChevronDown } from "lucide-react";
import { useExportUsersMutation } from "../../services/userApi";
import type { UserFilter, ExportConfig } from "../../types";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: UserFilter;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  filters,
}) => {
  const [exportFormat, setExportFormat] = useState<"csv" | "excel" | "json">(
    "csv"
  );
  const [includeFields, setIncludeFields] = useState({
    basic: true,
    contact: true,
    role: true,
    status: true,
    dates: true,
    permissions: false,
  });
  const [isExporting, setIsExporting] = useState(false);

  const [exportUsers] = useExportUsersMutation();

  const handleExport = async () => {
    try {
      setIsExporting(true);

      // Create export configuration matching backend types
      const exportConfig: ExportConfig = {
        format: exportFormat,
        fields: includeFields,
      };

      // Trigger export with proper request structure
      const blob = await exportUsers({
        filters,
        config: exportConfig,
      }).unwrap();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `users-export-${new Date().toISOString().split("T")[0]}.${exportFormat}`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      onClose();
    } catch (error) {
      console.error("Export failed:", error);
      // You might want to show a toast notification here
    } finally {
      setIsExporting(false);
    }
  };

  const toggleField = (field: keyof typeof includeFields) => {
    setIncludeFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const toggleAllFields = (value: boolean) => {
    setIncludeFields({
      basic: value,
      contact: value,
      role: value,
      status: value,
      dates: value,
      permissions: value,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Download
                className="text-blue-600 dark:text-blue-400"
                size={24}
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Export Users
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Export user data in your preferred format
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Export Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Export Format
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  value: "csv" as const,
                  label: "CSV",
                  description: "Spreadsheet format",
                },
                {
                  value: "excel" as const,
                  label: "Excel",
                  description: "Microsoft Excel",
                },
                {
                  value: "json" as const,
                  label: "JSON",
                  description: "Structured data",
                },
              ].map((format) => (
                <button
                  key={format.value}
                  onClick={() => setExportFormat(format.value)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    exportFormat === format.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    {format.label}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {format.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Include Fields */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Include Fields
              </label>
              <button
                onClick={() =>
                  toggleAllFields(!Object.values(includeFields).every(Boolean))
                }
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                {Object.values(includeFields).every(Boolean)
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>

            <div className="space-y-3">
              {[
                {
                  key: "basic" as const,
                  label: "Basic Information",
                  fields: "Name, Email, Avatar",
                },
                {
                  key: "contact" as const,
                  label: "Contact Details",
                  fields: "Phone, Address",
                },
                {
                  key: "role" as const,
                  label: "Role & Permissions",
                  fields: "Role, Access Levels, Performance",
                },
                {
                  key: "status" as const,
                  label: "Status Information",
                  fields: "Status, Last Login, 2FA Status",
                },
                {
                  key: "dates" as const,
                  label: "Date Information",
                  fields: "Created, Updated, Last Active",
                },
                {
                  key: "permissions" as const,
                  label: "Advanced Permissions",
                  fields: "Custom Permissions, Cities, Localities",
                },
              ].map((field) => (
                <label
                  key={field.key}
                  className="flex items-start gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={includeFields[field.key]}
                    onChange={() => toggleField(field.key)}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      {field.label}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                      {field.fields}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Applied Filters */}
          {Object.keys(filters).length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Applied Filters
              </h4>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                {filters.role && (
                  <div>
                    Role:{" "}
                    {Array.isArray(filters.role)
                      ? filters.role.join(", ")
                      : filters.role}
                  </div>
                )}
                {filters.status && (
                  <div>
                    Status:{" "}
                    {Array.isArray(filters.status)
                      ? filters.status.join(", ")
                      : filters.status}
                  </div>
                )}
                {filters.search && <div>Search: "{filters.search}"</div>}
                {filters.city && <div>City: {filters.city}</div>}
                {filters.locality && <div>Locality: {filters.locality}</div>}
                {filters.dateFrom && (
                  <div>
                    From: {new Date(filters.dateFrom).toLocaleDateString()}
                  </div>
                )}
                {filters.dateTo && (
                  <div>To: {new Date(filters.dateTo).toLocaleDateString()}</div>
                )}
              </div>
            </div>
          )}

          {/* Export Information */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <FileText
                className="text-blue-600 dark:text-blue-400 mt-0.5"
                size={20}
              />
              <div className="text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Export Information
                </p>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                  <li>
                    • The export will include all users matching your current
                    filters
                  </li>
                  <li>
                    • File will be downloaded immediately after processing
                  </li>
                  <li>• Large datasets may take a few moments to generate</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download size={20} />
                Export Users
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
