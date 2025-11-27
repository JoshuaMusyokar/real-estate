import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
}

export const Pagination = ({ pagination, onPageChange }: PaginationProps) => {
  const { page, limit, total, totalPages } = pagination;

  const getVisiblePages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
        pages.push(i);
      }
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-between mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing{" "}
        <span className="font-medium text-gray-900 dark:text-white">
          {(page - 1) * limit + 1}
        </span>{" "}
        to{" "}
        <span className="font-medium text-gray-900 dark:text-white">
          {Math.min(page * limit, total)}
        </span>{" "}
        of{" "}
        <span className="font-medium text-gray-900 dark:text-white">
          {total}
        </span>{" "}
        results
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {visiblePages.map((pageNum, idx, arr) => (
          <div key={pageNum} className="flex items-center">
            {idx > 0 && arr[idx - 1] !== pageNum - 1 && (
              <span className="px-3 py-2 text-gray-500 dark:text-gray-400">
                ...
              </span>
            )}
            <button
              onClick={() => onPageChange(pageNum)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                pageNum === page
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {pageNum}
            </button>
          </div>
        ))}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
