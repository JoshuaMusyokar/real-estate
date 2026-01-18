import React, { useState } from "react";
import {
  DownloadIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
} from "lucide-react";
import type {
  AnalyticsQueryParams,
  ExportFormat,
  ReportType,
} from "../../../types";
import { useExportAnalyticsReportMutation } from "../../../services/analyticsApi";

interface ExportPanelProps {
  filters: AnalyticsQueryParams;
  format?: ExportFormat;
  type?: ReportType;
  className?: string;
}

export default function ExportPanel({
  filters,
  format: defaultFormat,
  type: defaultType,
  className = "",
}: ExportPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>(
    defaultFormat || "csv",
  );
  const [reportType, setReportType] = useState<ReportType>(
    defaultType || "properties",
  );
  const [exportReport, { isLoading }] = useExportAnalyticsReportMutation();

  const formats: {
    value: ExportFormat;
    label: string;
    icon: React.ReactNode;
  }[] = [
    { value: "csv", label: "CSV", icon: <FileIcon className="w-4 h-4" /> },
    {
      value: "excel",
      label: "Excel",
      icon: <FileSpreadsheetIcon className="w-4 h-4" />,
    },
    { value: "pdf", label: "PDF", icon: <FileTextIcon className="w-4 h-4" /> },
  ];

  const reportTypes: { value: ReportType; label: string }[] = [
    { value: "properties", label: "Properties Report" },
    { value: "leads", label: "Leads Report" },
    { value: "performance", label: "Performance Report" },
  ];

  const handleExport = async () => {
    try {
      const blob = await exportReport({
        format: exportFormat,
        type: reportType,
        filters,
      }).unwrap();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = generateFilename(reportType, exportFormat);
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setIsOpen(false);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    }
  };

  const generateFilename = (type: ReportType, format: ExportFormat): string => {
    const date = new Date().toISOString().split("T")[0];
    return `${type}_report_${date}.${format}`;
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <DownloadIcon className="w-4 h-4" />
        {isLoading ? "Exporting..." : "Export"}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Export Report
              </h3>

              {/* Report Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value as ReportType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800"
                >
                  {reportTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Format Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {formats.map((format) => (
                    <button
                      key={format.value}
                      onClick={() => setExportFormat(format.value)}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                        exportFormat === format.value
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      {format.icon}
                      <span className="mt-1 text-sm">{format.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Export Button */}
              <button
                onClick={handleExport}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <DownloadIcon className="w-4 h-4" />
                {isLoading
                  ? "Exporting..."
                  : `Export as ${exportFormat.toUpperCase()}`}
              </button>

              {/* Info */}
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
                Report will include all data matching your current filters
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
