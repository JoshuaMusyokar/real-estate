export const UserTableSkeleton: React.FC = () => (
  <div className="animate-pulse">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="border-b border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
          </div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        </div>
      </div>
    ))}
  </div>
);
