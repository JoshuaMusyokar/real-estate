import React from "react";

import {
  Clock,
  EyeOff,
  Archive,
  CheckCircle,
  type LucideIcon,
} from "lucide-react";
import type { ContentStatus } from "../../types";
import { cn } from "../../utils";

export interface StatusBadgeProps {
  status: ContentStatus;
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "outline" | "subtle";
  showIcon?: boolean;
  showLabel?: boolean;
  className?: string;
  onClick?: () => void;
}

const STATUS_CONFIG: Record<
  ContentStatus,
  {
    label: string;
    color: {
      solid: string;
      outline: string;
      subtle: string;
    };
    icon: LucideIcon;
    description: string;
  }
> = {
  DRAFT: {
    label: "Draft",
    icon: EyeOff,
    color: {
      solid: "bg-gray-500 text-white",
      outline:
        "border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300",
      subtle: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    },
    description: "Content is in draft mode and not visible to public",
  },
  PUBLISHED: {
    label: "Published",
    icon: CheckCircle,
    color: {
      solid: "bg-green-500 text-white",
      outline:
        "border border-green-300 text-green-700 dark:border-green-600 dark:text-green-300",
      subtle:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200",
    },
    description: "Content is live and visible to public",
  },
  SCHEDULED: {
    label: "Scheduled",
    icon: Clock,
    color: {
      solid: "bg-blue-500 text-white",
      outline:
        "border border-blue-300 text-blue-700 dark:border-blue-600 dark:text-blue-300",
      subtle:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
    },
    description: "Content is scheduled for future publication",
  },
  ARCHIVED: {
    label: "Archived",
    icon: Archive,
    color: {
      solid: "bg-purple-500 text-white",
      outline:
        "border border-purple-300 text-purple-700 dark:border-purple-600 dark:text-purple-300",
      subtle:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200",
    },
    description: "Content is archived and not visible",
  },
};

const SIZE_CONFIG = {
  sm: {
    container: "px-2 py-0.5 text-xs",
    icon: "h-3 w-3",
    spacing: "mr-1",
  },
  md: {
    container: "px-3 py-1 text-sm",
    icon: "h-4 w-4",
    spacing: "mr-1.5",
  },
  lg: {
    container: "px-4 py-1.5 text-base",
    icon: "h-5 w-5",
    spacing: "mr-2",
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "md",
  variant = "solid",
  showIcon = true,
  showLabel = true,
  className,
  onClick,
}) => {
  const config = STATUS_CONFIG[status];
  const sizeConfig = SIZE_CONFIG[size];
  const Icon = config.icon;

  const containerClasses = cn(
    "inline-flex items-center rounded-full font-medium transition-colors",
    config.color[variant],
    sizeConfig.container,
    onClick && "cursor-pointer hover:opacity-90 active:opacity-80",
    className
  );

  return (
    <span
      className={containerClasses}
      onClick={onClick}
      title={config.description}
      role={onClick ? "button" : "status"}
      aria-label={`Status: ${config.label}`}
    >
      {showIcon && (
        <Icon
          className={cn(sizeConfig.icon, showLabel && sizeConfig.spacing)}
          aria-hidden="true"
        />
      )}
      {showLabel && config.label}
    </span>
  );
};

// Advanced StatusBadge with tooltip and actions
interface AdvancedStatusBadgeProps extends StatusBadgeProps {
  showActions?: boolean;
  onStatusChange?: (newStatus: ContentStatus) => void;
  availableStatuses?: ContentStatus[];
}

export const AdvancedStatusBadge: React.FC<AdvancedStatusBadgeProps> = ({
  status,
  size = "md",
  variant = "solid",
  showIcon = true,
  showLabel = true,
  showActions = false,
  onStatusChange,
  availableStatuses = ["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"],
  className,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const config = STATUS_CONFIG[status];
  const sizeConfig = SIZE_CONFIG[size];

  const handleStatusChange = (newStatus: ContentStatus) => {
    onStatusChange?.(newStatus);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <div className="flex items-center">
        <StatusBadge
          status={status}
          size={size}
          variant={variant}
          showIcon={showIcon}
          showLabel={showLabel}
          className={cn(showActions && "rounded-r-none", className)}
          onClick={showActions ? () => setIsOpen(!isOpen) : undefined}
        />

        {showActions && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "inline-flex items-center justify-center rounded-r-full border-l",
              config.color[variant],
              size === "sm" ? "h-5 w-5" : size === "md" ? "h-7 w-7" : "h-9 w-9",
              "hover:opacity-90 transition-opacity"
            )}
            aria-label="Change status"
            aria-expanded={isOpen}
          >
            <svg
              className={cn(
                "transition-transform",
                isOpen ? "rotate-180" : "",
                sizeConfig.icon
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown menu for status changes */}
      {isOpen && showActions && (
        <div className="absolute z-10 mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1" role="menu">
            {availableStatuses.map((availableStatus) => {
              const itemConfig = STATUS_CONFIG[availableStatus];
              const ItemIcon = itemConfig.icon;

              return (
                <button
                  key={availableStatus}
                  onClick={() => handleStatusChange(availableStatus)}
                  className={cn(
                    "w-full text-left px-4 py-2 text-sm flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                    status === availableStatus && "bg-gray-50 dark:bg-gray-700"
                  )}
                  role="menuitem"
                >
                  <ItemIcon className={cn("mr-3", sizeConfig.icon)} />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {itemConfig.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {itemConfig.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Status Indicator (small dot version)
interface StatusIndicatorProps {
  status: ContentStatus;
  size?: "sm" | "md" | "lg";
  withTooltip?: boolean;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = "md",
  withTooltip = false,
  className,
}) => {
  const config = STATUS_CONFIG[status];

  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
  };

  const colorClasses = {
    DRAFT: "bg-gray-400",
    PUBLISHED: "bg-green-500",
    SCHEDULED: "bg-blue-500",
    ARCHIVED: "bg-purple-500",
  };

  return (
    <div className="relative inline-block">
      <div
        className={cn(
          "rounded-full",
          sizeClasses[size],
          colorClasses[status],
          className
        )}
        title={withTooltip ? config.description : undefined}
        aria-label={`Status: ${config.label}`}
        role="status"
      />
    </div>
  );
};

// Status with count (for lists/dashboards)
interface StatusWithCountProps {
  status: ContentStatus;
  count: number;
  onClick?: () => void;
}

export const StatusWithCount: React.FC<StatusWithCountProps> = ({
  status,
  count,
  onClick,
}) => {
  const config = STATUS_CONFIG[status];

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-between px-4 py-2 rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98]",
        "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
        "hover:border-gray-300 dark:hover:border-gray-600",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      )}
      aria-label={`View all ${config.label.toLowerCase()} items (${count})`}
    >
      <div className="flex items-center">
        <StatusIndicator status={status} size="md" />
        <span className="ml-3 font-medium text-gray-900 dark:text-gray-100">
          {config.label}
        </span>
      </div>
      <span
        className={cn(
          "px-2 py-1 rounded-full text-xs font-semibold",
          config.color.solid
        )}
      >
        {count}
      </span>
    </button>
  );
};

// Status filter pills
interface StatusFilterPillProps {
  status: ContentStatus;
  isActive: boolean;
  count?: number;
  onClick: () => void;
}

export const StatusFilterPill: React.FC<StatusFilterPillProps> = ({
  status,
  isActive,
  count,
  onClick,
}) => {
  const config = STATUS_CONFIG[status];

  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center px-3 py-1.5 rounded-full border transition-all",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        isActive
          ? config.color.solid
          : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
      )}
      aria-pressed={isActive}
      aria-label={`Filter by ${config.label} ${count ? `(${count})` : ""}`}
    >
      <config.icon className="h-4 w-4 mr-1.5" />
      <span className="font-medium">{config.label}</span>
      {count !== undefined && (
        <span
          className={cn(
            "ml-2 px-1.5 py-0.5 text-xs rounded-full",
            isActive
              ? "bg-white/20"
              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
};

// Status timeline indicator
interface StatusTimelineProps {
  currentStatus: ContentStatus;
  previousStatus?: ContentStatus;
  className?: string;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({
  currentStatus,
  previousStatus,
  className,
}) => {
  const statuses: ContentStatus[] = [
    "DRAFT",
    "SCHEDULED",
    "PUBLISHED",
    "ARCHIVED",
  ];
  const currentIndex = statuses.indexOf(currentStatus);
  const prevIndex = previousStatus ? statuses.indexOf(previousStatus) : -1;

  return (
    <div className={cn("flex items-center", className)}>
      {statuses.map((status, index) => {
        const config = STATUS_CONFIG[status];
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const wasPrevious = index === prevIndex;

        return (
          <React.Fragment key={status}>
            {/* Status node */}
            <div className="relative">
              <div
                className={cn(
                  "flex items-center justify-center rounded-full border-2",
                  isCompleted
                    ? config.color.solid
                    : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600",
                  isCurrent ? "h-8 w-8" : "h-6 w-6"
                )}
                aria-label={config.label}
              >
                {isCompleted && <config.icon className="h-3 w-3 text-white" />}
              </div>

              {/* Status label */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap">
                <span
                  className={cn(
                    "text-xs font-medium",
                    isCurrent
                      ? "text-gray-900 dark:text-gray-100"
                      : "text-gray-500 dark:text-gray-400"
                  )}
                >
                  {config.label}
                </span>
              </div>

              {/* Previous status indicator */}
              {wasPrevious && (
                <div className="absolute -top-1 -right-1">
                  <div className="h-3 w-3 rounded-full bg-yellow-400 border-2 border-white dark:border-gray-800" />
                </div>
              )}
            </div>

            {/* Connecting line (except last) */}
            {index < statuses.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5",
                  index < currentIndex
                    ? "bg-green-500"
                    : "bg-gray-200 dark:bg-gray-700"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
