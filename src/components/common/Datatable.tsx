import React from "react";
import {
  ChevronsUpDownIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (key: string) => void;
  emptyMessage?: string;
  rowActions?: (item: T) => React.ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  sortBy,
  sortOrder,
  onSort,
  emptyMessage = "No data found",
  rowActions,
}: DataTableProps<T>) {
  const getSortIcon = (key: string) => {
    if (sortBy !== key) return <ChevronsUpDownIcon className="w-4 h-4" />;
    return sortOrder === "asc" ? (
      <ChevronUpIcon className="w-4 h-4" />
    ) : (
      <ChevronDownIcon className="w-4 h-4" />
    );
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-2"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${
                  column.sortable
                    ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    : ""
                } ${column.width || ""}`}
                onClick={() => column.sortable && onSort?.(column.key)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.header}</span>
                  {column.sortable && getSortIcon(column.key)}
                </div>
              </th>
            ))}
            {rowActions && (
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((item, index) => (
            <tr
              key={index}
              className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                >
                  {column.render
                    ? column.render((item as any)[column.key], item)
                    : (item as any)[column.key]}
                </td>
              ))}
              {rowActions && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {rowActions(item)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">{emptyMessage}</div>
        </div>
      )}
    </div>
  );
}
