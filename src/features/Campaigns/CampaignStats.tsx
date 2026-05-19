import {
  Send,
  Mail,
  MousePointerClick,
  AlertCircle,
  Users,
  Clock,
} from "lucide-react";
import type { CampaignStats as Stats } from "../../types/messaging-management";

interface Props {
  stats: Stats;
  loading?: boolean;
  compact?: boolean;
}

const SkeletonStat = () => (
  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-3 sm:p-4 animate-pulse">
    <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
    <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
  </div>
);

export const CampaignStats: React.FC<Props> = ({ stats, loading, compact }) => {
  if (loading) {
    return (
      <div
        className={`grid gap-2 sm:gap-3 ${compact ? "grid-cols-3 sm:grid-cols-6" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"}`}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonStat key={i} />
        ))}
      </div>
    );
  }

  const items = [
    {
      label: "Total",
      value: stats.total,
      sub: null,
      icon: Users,
      color: "text-gray-900 dark:text-white",
      bg: "bg-gray-50 dark:bg-gray-800",
    },
    {
      label: "Sent",
      value: stats.sent,
      sub: null,
      icon: Send,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Opened",
      value: stats.opened,
      sub: `${stats.openRate}%`,
      icon: Mail,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      label: "Clicked",
      value: stats.clicked,
      sub: `${stats.clickRate}%`,
      icon: MousePointerClick,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-900/20",
    },
    {
      label: "Bounced",
      value: stats.bounced,
      sub: `${stats.bounceRate}%`,
      icon: AlertCircle,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-900/20",
    },
    {
      label: "Pending",
      value: stats.pending,
      sub: null,
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/20",
    },
  ];

  return (
    <div
      className={`grid gap-2 sm:gap-3 ${compact ? "grid-cols-3 sm:grid-cols-6" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"}`}
    >
      {items.map(({ label, value, sub, icon: Icon, color, bg }) => (
        <div
          key={label}
          className={`${bg} border border-gray-200 dark:border-gray-800 rounded-2xl p-3 sm:p-4`}
        >
          <div className="flex items-start justify-between gap-1 mb-1">
            <p className={`text-lg sm:text-2xl font-black ${color}`}>
              {value.toLocaleString()}
            </p>
            <Icon
              className={`w-3.5 h-3.5 ${color} opacity-60 flex-shrink-0 mt-1`}
            />
          </div>
          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
            {label}
          </p>
          {sub && (
            <p className={`text-[10px] font-bold ${color} mt-0.5`}>{sub}</p>
          )}
        </div>
      ))}
    </div>
  );
};
