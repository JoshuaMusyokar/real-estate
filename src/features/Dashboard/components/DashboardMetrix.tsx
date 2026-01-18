import React from "react";
import { HomeIcon, UsersIcon, TrendingUpIcon, CreditCard } from "lucide-react";
import type { DashboardSummary } from "../../../types";
import Badge from "../../../components/ui/badge/Badge";

interface DashboardMetricsProps {
  data?: DashboardSummary;
}

interface MetricCardProps {
  title: string;
  value: number | string;
  change?: number;
  icon: React.ReactNode;
  color: "success" | "error" | "warning" | "info";
  prefix?: string;
  suffix?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  color,
  prefix = "",
  suffix = "",
}) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
      {icon}
    </div>

    <div className="flex items-end justify-between mt-5">
      <div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {title}
        </span>
        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
          {prefix}
          {value}
          {suffix}
        </h4>
      </div>
      {change !== undefined && (
        <Badge color={color}>
          {change > 0 ? "+" : ""}
          {change.toFixed(1)}%
        </Badge>
      )}
    </div>
  </div>
);

export default function DashboardMetrics({ data }: DashboardMetricsProps) {
  if (!data) return null;

  const { properties, leads, revenue } = data;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      <MetricCard
        title="Total Properties"
        value={properties.total.total}
        change={properties.total.change}
        icon={<HomeIcon className="text-gray-800 size-6 dark:text-white/90" />}
        color={
          properties.total.trend === "up"
            ? "success"
            : properties.total.trend === "down"
              ? "error"
              : "info"
        }
      />

      <MetricCard
        title="Active Properties"
        value={properties.active.total}
        change={properties.active.change}
        icon={<HomeIcon className="text-blue-600 size-6" />}
        color={
          properties.active.trend === "up"
            ? "success"
            : properties.active.trend === "down"
              ? "error"
              : "info"
        }
      />

      <MetricCard
        title="Total Leads"
        value={leads.total.total}
        change={leads.total.change}
        icon={<UsersIcon className="text-gray-800 size-6 dark:text-white/90" />}
        color={
          leads.total.trend === "up"
            ? "success"
            : leads.total.trend === "down"
              ? "error"
              : "info"
        }
      />

      <MetricCard
        title="New Leads"
        value={leads.newLeads.total}
        change={leads.newLeads.change}
        icon={<TrendingUpIcon className="text-green-600 size-6" />}
        color={
          leads.newLeads.trend === "up"
            ? "success"
            : leads.newLeads.trend === "down"
              ? "error"
              : "info"
        }
      />

      <MetricCard
        title="Conversion Rate"
        value={leads.conversionRate.rate}
        suffix="%"
        change={leads.conversionRate.change}
        icon={<TrendingUpIcon className="text-purple-600 size-6" />}
        color={
          leads.conversionRate.change && leads.conversionRate.change > 0
            ? "success"
            : "error"
        }
      />

      <MetricCard
        title="Revenue"
        value={revenue.total.total}
        change={revenue.total.change}
        icon={
          <CreditCard className="text-gray-800 size-6 dark:text-white/90" />
        }
        color={
          revenue.total.trend === "up"
            ? "success"
            : revenue.total.trend === "down"
              ? "error"
              : "info"
        }
        prefix="₹"
      />

      <MetricCard
        title="Deals Closed"
        value={revenue.dealsClosed.total}
        change={revenue.dealsClosed.change}
        icon={<HomeIcon className="text-green-600 size-6" />}
        color={
          revenue.dealsClosed.trend === "up"
            ? "success"
            : revenue.dealsClosed.trend === "down"
              ? "error"
              : "info"
        }
      />

      <MetricCard
        title="Avg Deal Size"
        value={revenue.averageDealSize.total}
        change={revenue.averageDealSize.change}
        icon={<CreditCard className="text-blue-600 size-6" />}
        color={
          revenue.averageDealSize.trend === "up"
            ? "success"
            : revenue.averageDealSize.trend === "down"
              ? "error"
              : "info"
        }
        prefix="₹"
      />
    </div>
  );
}
