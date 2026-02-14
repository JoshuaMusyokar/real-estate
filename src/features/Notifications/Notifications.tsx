import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import type { Notification, NotificationType } from "../../types";
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
} from "../../services/ntfApi";
import { Icons } from "../../utils/ntf-icons-utils";
import { SkeletonRow } from "./components/SkeletonRow";
import { EmptyState } from "./components/EmptyState";
import { NotificationRow } from "./components/NotificationRow";

// ─── Filter tabs ──────────────────────────────────────────────────────────────
// "ALL" and "UNREAD" are meta-filters handled at the query level.
// The rest map 1:1 to NotificationType and are filtered client-side on the
// already-fetched page — avoids extra round-trips for every tab click.

type FilterId = "ALL" | "UNREAD" | NotificationType;

const FILTER_TABS: { id: FilterId; label: string }[] = [
  { id: "ALL", label: "All" },
  { id: "UNREAD", label: "Unread" },
  { id: "LEAD_ASSIGNED", label: "Leads" },
  { id: "PROPERTY_INQUIRY", label: "Inquiries" },
  { id: "NEW_PROPERTY_SUBMISSION", label: "Properties" },
  { id: "APPOINTMENT_REMINDER", label: "Appointments" },
  { id: "SYSTEM_ALERT", label: "System" },
];

const PAGE_SIZE = 20;

// ─────────────────────────────────────────────────────────────────────────────
export default function Notifications() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterId>("ALL");

  // ── pagination state ────────────────────────────────────────────────────
  // We accumulate pages in local state and keep firing the next offset query.
  const [pages, setPages] = useState<number[]>([0]); // offsets fetched so far
  const [allItems, setAllItems] = useState<Notification[]>([]);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // ── badge count (shared with dropdown via the same tag) ─────────────────
  const { data: unreadData } = useGetUnreadCountQuery(undefined, {
    pollingInterval: 60_000,
  });
  const unreadCount = unreadData?.data?.count ?? 0;

  // ── mutations ───────────────────────────────────────────────────────────
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllRead] = useMarkAllNotificationsAsReadMutation();

  // ── current page query ──────────────────────────────────────────────────
  // We always query the *last* offset in `pages`.  When the sentinel triggers
  // we append the next offset and React re-renders with the new query arg.
  const currentOffset = pages[pages.length - 1];

  const {
    data: pageData,
    isLoading, // true only on the very first load
    isFetching, // true whenever *any* query (including refetch) is in flight
  } = useGetNotificationsQuery({
    limit: PAGE_SIZE,
    offset: currentOffset,
    unreadOnly: activeFilter === "UNREAD",
  });

  // ── accumulate pages ────────────────────────────────────────────────────
  // Every time pageData changes (new offset resolved) we merge it in.
  useEffect(() => {
    if (!pageData) return;
    setAllItems((prev) => {
      if (currentOffset === 0) return pageData.data?.notifications ?? [];
      const seen = new Set(prev.map((n) => n.id));
      return [
        ...prev,
        ...(pageData.data?.notifications
          ? pageData.data.notifications.filter((n) => !seen.has(n.id))
          : []),
      ];
    });
  }, [pageData, currentOffset]);

  // Reset accumulated items whenever the filter changes.
  useEffect(() => {
    setPages([0]);
    setAllItems([]);
  }, [activeFilter]);

  // Derived: can we load more?
  const total = pageData?.data?.total ?? 0;
  const hasMore = allItems.length < total;

  // ── IntersectionObserver for infinite scroll ────────────────────────────
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isFetching) {
          setPages((prev) => [...prev, prev.length * PAGE_SIZE]);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isFetching]);

  // ── client-side type filter ─────────────────────────────────────────────
  const displayed =
    activeFilter === "ALL" || activeFilter === "UNREAD"
      ? allItems
      : allItems.filter((n) => n.type === activeFilter);

  // ── handlers ────────────────────────────────────────────────────────────
  const handleItemClick = (ntf: Notification) => {
    if (!ntf.isRead) markAsRead(ntf.id);
    if (ntf.link) navigate(ntf.link);
  };

  const handleMarkAll = () => markAllRead();

  // ── render ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-full mx-auto px-4 sm:px-6 pt-8 pb-0">
          {/* Title + mark-all */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center h-6 min-w-6 px-2 text-xs font-bold rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                  {unreadCount}
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/30"
              >
                <Icons.DoubleCheck />
                Mark all read
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 overflow-x-auto pb-0 scrollbar-hide">
            {FILTER_TABS.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`flex-shrink-0 px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors
                    ${
                      isActive
                        ? "bg-gray-50 text-gray-900 border-t-2 border-blue-600 dark:bg-gray-900 dark:text-white"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                >
                  {tab.label}
                  {tab.id === "UNREAD" && unreadCount > 0 && (
                    <span className="ml-1.5 inline-flex items-center justify-center h-4 min-w-4 px-1 text-[10px] font-bold rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <div className="max-w-full mx-auto px-4 sm:px-6 py-6">
        {/* Initial skeleton — only on the very first load */}
        {isLoading && (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && displayed.length === 0 && (
          <EmptyState filter={activeFilter} />
        )}

        {/* Notification rows */}
        {!isLoading && displayed.length > 0 && (
          <div className="flex flex-col gap-2">
            {displayed.map((ntf) => (
              <NotificationRow
                key={ntf.id}
                notification={ntf}
                onRead={() => markAsRead(ntf.id)}
                onClick={() => handleItemClick(ntf)}
              />
            ))}
          </div>
        )}

        {/* Infinite-scroll sentinel */}
        <div ref={sentinelRef} className="h-4" />

        {/* Spinner while the next page is in flight */}
        {isFetching && !isLoading && (
          <div className="flex justify-center py-4">
            <svg
              className="animate-spin h-5 w-5 text-gray-400 dark:text-gray-600"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          </div>
        )}

        {/* End hint */}
        {!isFetching && !hasMore && displayed.length > 0 && (
          <p className="text-center text-xs text-gray-400 dark:text-gray-600 pt-4">
            You've seen all notifications
          </p>
        )}
      </div>
    </div>
  );
}
