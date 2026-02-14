import { useState } from "react";
import { useNavigate } from "react-router";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import {
  useGetDropdownNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
} from "../../services/ntfApi";
import { Icons } from "../../utils/ntf-icons-utils";
import { getNotificationVisual, timeAgo } from "../../utils/ntf-helpers";
import { NotificationIcon } from "../../utils/ntf-utils";

// ─────────────────────────────────────────────────────────────────────────────
// Behaviour
//   • Badge count driven by useGetUnreadCountQuery — set pollingInterval or
//     wire useNotificationSocket to call refetchUnreadCount() on push events.
//   • Item list uses `skip: !isOpen` so the network call fires only when the
//     panel actually opens — same pattern as lazy queries in your CMS layer.
//   • markAsRead / markAllRead both invalidate the "Notification" tag → every
//     query that provides it re-fetches automatically.
//   • Clicking an item with a `link` navigates via react-router after marking
//     it read.
// ─────────────────────────────────────────────────────────────────────────────

export default function NotificationDropdown() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // ── queries ─────────────────────────────────────────────────────────────
  const { data: unreadData } = useGetUnreadCountQuery(undefined, {
    pollingInterval: 60_000, // drop this if you use the WS hook instead
  });
  const unreadCount = unreadData?.data?.count ?? 0;

  const { data: dropdownData, isLoading: dropdownLoading } =
    useGetDropdownNotificationsQuery(undefined, {
      skip: !isOpen,
    });
  const notifications = dropdownData?.data?.notifications ?? [];
  // ── mutations ───────────────────────────────────────────────────────────
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllRead] = useMarkAllNotificationsAsReadMutation();

  // ── handlers ────────────────────────────────────────────────────────────
  const closeDropdown = () => setIsOpen(false);

  const handleItemClick = async (ntf: {
    id: string;
    isRead: boolean;
    link?: string | null;
  }) => {
    if (!ntf.isRead) markAsRead(ntf.id);
    closeDropdown();
    if (ntf.link) navigate(ntf.link);
  };

  const handleMarkAll = () => markAllRead();

  // ── render ──────────────────────────────────────────────────────────────
  return (
    <div className="relative">
      {/* ── Bell button ───────────────────────────────────────────────── */}
      <button
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={() => setIsOpen((p) => !p)}
      >
        {/* Ping badge */}
        {unreadCount > 0 && (
          <span className="absolute right-0.5 top-0.5 z-10 flex h-2.5 w-2.5 items-center justify-center">
            <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping" />
            <span className="relative z-10 h-2 w-2 rounded-full bg-orange-400" />
          </span>
        )}

        {/* Bell SVG — kept identical to your original */}
        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>

      {/* ── Dropdown panel ──────────────────────────────────────────── */}
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Notifications
            </h5>
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 text-xs font-semibold rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                {unreadCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 rounded-md hover:bg-blue-50 transition-colors dark:text-blue-400 dark:hover:bg-blue-900/30"
              >
                <Icons.DoubleCheck />
                All read
              </button>
            )}

            {/* Close × — same SVG path as your original */}
            <button
              onClick={closeDropdown}
              className="p-1 text-gray-400 rounded-md hover:text-gray-600 hover:bg-gray-100 transition-colors dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-800"
            >
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Scrollable list ─────────────────────────────────────────── */}
        <ul className="flex flex-col flex-1 overflow-y-auto custom-scrollbar">
          {/* Skeleton */}
          {dropdownLoading && (
            <div className="flex flex-col gap-3 p-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 items-start animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!dropdownLoading && notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center flex-1 py-8 text-center px-4">
              <Icons.EmptyBell className="text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                You're all caught up
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                No notifications yet
              </p>
            </div>
          )}

          {/* Items */}
          {!dropdownLoading &&
            notifications.map((ntf) => {
              const visual = getNotificationVisual(ntf.type);
              return (
                <li key={ntf.id}>
                  <DropdownItem
                    onItemClick={() => handleItemClick(ntf)}
                    className={`flex gap-3 rounded-lg border-b border-gray-100 px-4.5 py-3 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/5 ${
                      !ntf.isRead ? "bg-blue-50/60 dark:bg-blue-950/40" : ""
                    }`}
                  >
                    {/* Coloured icon ring */}
                    <span
                      className={`relative flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0 ${visual.bgClass}`}
                    >
                      <NotificationIcon type={ntf.type} />
                      {!ntf.isRead && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-blue-500 dark:border-gray-900" />
                      )}
                    </span>

                    {/* Text block */}
                    <span className="flex flex-col flex-1 min-w-0">
                      <span className="text-theme-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                        {ntf.title}
                      </span>
                      <span className="text-theme-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                        {ntf.message}
                      </span>
                      <span className="flex items-center gap-2 mt-1.5">
                        <span
                          className={`inline-flex text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-md ${visual.tagBg} ${visual.tagText}`}
                        >
                          {visual.label}
                        </span>
                        <span className="w-1 h-1 bg-gray-400 rounded-full dark:bg-gray-600" />
                        <span className="text-[11px] text-gray-400 dark:text-gray-500">
                          {timeAgo(ntf.createdAt)}
                        </span>
                      </span>
                    </span>
                  </DropdownItem>
                </li>
              );
            })}
        </ul>

        {/* Footer — "View All" navigates to the full page */}
        <button
          onClick={() => {
            closeDropdown();
            navigate("/notifications");
          }}
          className="block w-full px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          View All Notifications
        </button>
      </Dropdown>
    </div>
  );
}
