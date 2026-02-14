// ─── NotificationRow ──────────────────────────────────────────────────────────

import type { Notification } from "../../../types";
import { getNotificationVisual, timeAgo } from "../../../utils/ntf-helpers";
import { Icons } from "../../../utils/ntf-icons-utils";
import { NotificationIcon } from "../../../utils/ntf-utils";

export function NotificationRow({
  notification: ntf,
  onRead,
  onClick,
}: {
  notification: Notification;
  onRead: () => void;
  onClick: () => void;
}) {
  const visual = getNotificationVisual(ntf.type);

  return (
    <div
      className={`group relative flex gap-4 p-4 rounded-xl border transition-colors cursor-pointer
        ${
          !ntf.isRead
            ? "bg-blue-50/70 border-blue-100 hover:bg-blue-50 dark:bg-blue-950/50 dark:border-blue-900 dark:hover:bg-blue-950/70"
            : "bg-white border-gray-100 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-750"
        }`}
      onClick={onClick}
    >
      {/* Icon ring */}
      <span
        className={`relative flex items-center justify-center w-11 h-11 rounded-full flex-shrink-0 ${visual.bgClass}`}
      >
        <NotificationIcon type={ntf.type} />
        {!ntf.isRead && (
          <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-white bg-blue-500 dark:border-gray-800" />
        )}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-sm font-semibold truncate ${!ntf.isRead ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-200"}`}
          >
            {ntf.title}
          </span>
          {!ntf.isRead && (
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-blue-500" />
          )}
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
          {ntf.message}
        </p>

        <div className="flex items-center gap-2 mt-2">
          <span
            className={`inline-flex text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${visual.tagBg} ${visual.tagText}`}
          >
            {visual.label}
          </span>
          <span className="w-1 h-1 bg-gray-300 rounded-full dark:bg-gray-600" />
          <span className="text-[11px] text-gray-400 dark:text-gray-500">
            {timeAgo(ntf.createdAt)}
          </span>
          {ntf.link && (
            <>
              <span className="w-1 h-1 bg-gray-300 rounded-full dark:bg-gray-600" />
              <span className="text-[11px] font-medium text-blue-500 dark:text-blue-400">
                Open →
              </span>
            </>
          )}
        </div>
      </div>

      {/* Hover tick — mark as read without navigating */}
      {!ntf.isRead && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRead();
          }}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-500 dark:hover:text-blue-400 dark:hover:bg-blue-900/30"
          title="Mark as read"
        >
          <Icons.DoubleCheck />
        </button>
      )}
    </div>
  );
}
