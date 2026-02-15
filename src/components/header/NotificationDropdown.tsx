import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  X,
  CheckCheck,
  BellOff,
  Home,
  User,
  DollarSign,
  AlertCircle,
  Info,
} from "lucide-react";
import {
  useGetDropdownNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
} from "../../services/ntfApi";
import { timeAgo } from "../../utils/ntf-helpers";
import type { NotificationType } from "../../types";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

const iconMap: Partial<
  Record<NotificationType, React.ComponentType<{ className?: string }>>
> = {
  NEW_PROPERTY_SUBMISSION: Home,
  LEAD_ASSIGNED: User,
  APPOINTMENT_REMINDER: Info,
  PROPERTY_INQUIRY: DollarSign,
  SYSTEM_ALERT: AlertCircle,
};

const NotificationIcon: React.FC<{ type: NotificationType }> = ({ type }) => {
  const Icon = iconMap[type] || Info; // fallback for unknown types
  return <Icon className="w-4 h-4 sm:w-5 sm:h-5" />;
};
type NotificationVisual = {
  bgClass: string;
  label: string;
  tagBg: string;
  tagText: string;
};
const visuals: Record<NotificationType, NotificationVisual> = {
  NEW_PROPERTY_SUBMISSION: {
    bgClass: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    label: "Property",
    tagBg: "bg-blue-50 dark:bg-blue-900/20",
    tagText: "text-blue-700 dark:text-blue-300",
  },
  LEAD_ASSIGNED: {
    bgClass:
      "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    label: "Lead",
    tagBg: "bg-green-50 dark:bg-green-900/20",
    tagText: "text-green-700 dark:text-green-300",
  },
  APPOINTMENT_REMINDER: {
    bgClass:
      "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    label: "Appointment",
    tagBg: "bg-purple-50 dark:bg-purple-900/20",
    tagText: "text-purple-700 dark:text-purple-300",
  },
  PROPERTY_INQUIRY: {
    bgClass:
      "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
    label: "Payment",
    tagBg: "bg-amber-50 dark:bg-amber-900/20",
    tagText: "text-amber-700 dark:text-amber-300",
  },
  SYSTEM_ALERT: {
    bgClass: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    label: "Alert",
    tagBg: "bg-red-50 dark:bg-red-900/20",
    tagText: "text-red-700 dark:text-red-300",
  },
};

const getNotificationVisual = (type: NotificationType) => {
  return visuals[type];
};

export default function NotificationDropdown() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const { data: unreadData } = useGetUnreadCountQuery(undefined, {
    pollingInterval: 60_000,
  });
  const unreadCount = unreadData?.data?.count ?? 0;

  const { data: dropdownData, isLoading: dropdownLoading } =
    useGetDropdownNotificationsQuery(undefined, {
      skip: !isOpen,
    });
  const notifications = dropdownData?.data?.notifications ?? [];

  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllRead] = useMarkAllNotificationsAsReadMutation();

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

  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={() => setIsOpen((p) => !p)}
        aria-label="Notifications"
      >
        {unreadCount > 0 && (
          <span className="absolute right-0.5 top-0.5 flex h-2 w-2 sm:h-2.5 sm:w-2.5">
            <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping" />
            <span className="relative h-2 w-2 sm:h-2 sm:w-2 rounded-full bg-orange-400" />
          </span>
        )}
        <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-2 sm:mt-3 md:mt-[17px] flex h-[400px] sm:h-[480px] w-[320px] sm:w-[350px] md:w-[361px] flex-col rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-2.5 sm:p-3 shadow-lg dark:border-gray-800 dark:bg-gray-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 sm:pb-3 mb-2.5 sm:mb-3 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <h5 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200">
              Notifications
            </h5>
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center h-4 min-w-4 sm:h-5 sm:min-w-5 px-1 sm:px-1.5 text-[10px] sm:text-xs font-semibold rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                {unreadCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-0.5 sm:gap-1">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                className="flex items-center gap-1 px-1.5 sm:px-2 py-1 text-[10px] sm:text-xs font-medium text-blue-600 rounded-md hover:bg-blue-50 transition-colors dark:text-blue-400 dark:hover:bg-blue-900/30"
              >
                <CheckCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">All read</span>
              </button>
            )}

            <button
              onClick={closeDropdown}
              className="p-1 text-gray-400 rounded-md hover:text-gray-600 hover:bg-gray-100 transition-colors dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-800"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable list */}
        <ul className="flex flex-col flex-1 overflow-y-auto">
          {dropdownLoading && (
            <div className="flex flex-col gap-2.5 sm:gap-3 p-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex gap-2.5 sm:gap-3 items-start animate-pulse"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
                  <div className="flex-1 space-y-1.5 sm:space-y-2 pt-1">
                    <div className="h-2.5 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-2 sm:h-2.5 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!dropdownLoading && notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center flex-1 py-6 sm:py-8 text-center px-4">
              <BellOff className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 dark:text-gray-600 mb-2 sm:mb-3" />
              <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                You're all caught up
              </p>
              <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                No notifications yet
              </p>
            </div>
          )}

          {!dropdownLoading &&
            notifications.map((ntf) => {
              const visual = getNotificationVisual(ntf.type);
              return (
                <li key={ntf.id}>
                  <DropdownItem
                    onItemClick={() => handleItemClick(ntf)}
                    className={`flex gap-2.5 sm:gap-3 rounded-lg border-b border-gray-100 px-3 sm:px-4 py-2.5 sm:py-3 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/5 ${
                      !ntf.isRead ? "bg-blue-50/60 dark:bg-blue-950/40" : ""
                    }`}
                  >
                    <span
                      className={`relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0 ${visual.bgClass}`}
                    >
                      <NotificationIcon type={ntf.type} />
                      {!ntf.isRead && (
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full border-2 border-white bg-blue-500 dark:border-gray-900" />
                      )}
                    </span>

                    <span className="flex flex-col flex-1 min-w-0">
                      <span className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                        {ntf.title}
                      </span>
                      <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                        {ntf.message}
                      </span>
                      <span className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5">
                        <span
                          className={`inline-flex text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide px-1 sm:px-1.5 py-0.5 rounded-md ${visual.tagBg} ${visual.tagText}`}
                        >
                          {visual.label}
                        </span>
                        <span className="w-1 h-1 bg-gray-400 rounded-full dark:bg-gray-600" />
                        <span className="text-[10px] sm:text-[11px] text-gray-400 dark:text-gray-500">
                          {timeAgo(ntf.createdAt)}
                        </span>
                      </span>
                    </span>
                  </DropdownItem>
                </li>
              );
            })}
        </ul>

        {/* Footer */}
        <button
          onClick={() => {
            closeDropdown();
            navigate("/notifications");
          }}
          className="block w-full px-3 sm:px-4 py-2 sm:py-2.5 mt-2.5 sm:mt-3 text-xs sm:text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
        >
          View All Notifications
        </button>
      </Dropdown>
    </div>
  );
}
