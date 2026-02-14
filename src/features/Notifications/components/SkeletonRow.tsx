// ─── SkeletonRow ──────────────────────────────────────────────────────────────

export function SkeletonRow() {
  return (
    <div className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800 animate-pulse">
      <div className="w-11 h-11 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
      <div className="flex-1 space-y-2.5 pt-0.5">
        <div className="flex items-center gap-2">
          <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-40" />
          <div className="h-2 w-2 rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="h-3 bg-gray-100 dark:bg-gray-700/60 rounded w-5/6" />
        <div className="flex items-center gap-2">
          <div className="h-4 bg-gray-100 dark:bg-gray-700/60 rounded w-14" />
          <div className="h-2 w-2 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="h-2.5 bg-gray-100 dark:bg-gray-700/60 rounded w-12" />
        </div>
      </div>
    </div>
  );
}
