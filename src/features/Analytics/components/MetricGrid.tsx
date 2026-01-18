import {
  TrendingUpIcon,
  TrendingDownIcon,
  MinusIcon,
  HomeIcon,
  UsersIcon,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import type { DashboardSummary } from "../../../types";

interface MetricGridProps {
  data?: DashboardSummary;
}

const MetricGrid: React.FC<MetricGridProps> = ({ data }) => {
  if (!data) return null;

  const metrics = [
    {
      title: "Total Properties",
      value: data.properties.total.total,
      change: data.properties.total.change,
      trend: data.properties.total.trend,
      icon: <HomeIcon className="w-5 h-5 text-blue-600" />,
      color: "blue",
    },
    {
      title: "Active Properties",
      value: data.properties.active.total,
      change: data.properties.active.change,
      trend: data.properties.active.trend,
      icon: <HomeIcon className="w-5 h-5 text-green-600" />,
      color: "green",
    },
    {
      title: "Total Leads",
      value: data.leads.total.total,
      change: data.leads.total.change,
      trend: data.leads.total.trend,
      icon: <UsersIcon className="w-5 h-5 text-purple-600" />,
      color: "purple",
    },
    {
      title: "New Leads",
      value: data.leads.newLeads.total,
      change: data.leads.newLeads.change,
      trend: data.leads.newLeads.trend,
      icon: <TrendingUp className="w-5 h-5 text-orange-600" />,
      color: "orange",
    },
    {
      title: "Conversion Rate",
      value: data.leads.conversionRate.rate,
      change: data.leads.conversionRate.change,
      icon: <TrendingUp className="w-5 h-5 text-indigo-600" />,
      color: "indigo",
    },
    {
      title: "Total Revenue",
      value: data.revenue.total.total,
      change: data.revenue.total.change,
      trend: data.revenue.total.trend,
      icon: <CreditCard className="w-5 h-5 text-green-600" />,
      color: "green",
    },
    {
      title: "Deals Closed",
      value: data.revenue.dealsClosed.total,
      change: data.revenue.dealsClosed.change,
      trend: data.revenue.dealsClosed.trend,
      icon: <HomeIcon className="w-5 h-5 text-blue-600" />,
      color: "blue",
    },
    {
      title: "Avg Deal Size",
      value: data.revenue.averageDealSize.total,
      change: data.revenue.averageDealSize.change,
      trend: data.revenue.averageDealSize.trend,
      icon: <CreditCard className="w-5 h-5 text-purple-600" />,
      color: "purple",
    },
  ];

  const getTrendIcon = (trend?: "up" | "down" | "stable", change?: number) => {
    if (change === undefined && trend === undefined) return null;

    const isPositive = trend === "up" || (change !== undefined && change > 0);
    const isNeutral = trend === "stable" || change === 0;

    if (isNeutral) return <MinusIcon className="w-4 h-4 text-gray-400" />;

    return isPositive ? (
      <TrendingUpIcon className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDownIcon className="w-4 h-4 text-red-600" />
    );
  };

  const formatValue = (value: any) => {
    if (typeof value === "number") {
      // Check if it's a percentage
      if (value < 10 && value > -10) {
        return `${value.toFixed(1)}%`;
      }
      // Check if it's revenue
      if (value > 1000) {
        return `$${(value / 1000).toFixed(1)}K`;
      }
      return value.toLocaleString();
    }
    return value;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
              {metric.icon}
            </div>

            {metric.change !== undefined && (
              <div className="flex items-center gap-1">
                {getTrendIcon(metric.trend, metric.change)}
                <span
                  className={`text-sm font-medium ${
                    metric.change > 0 || metric.trend === "up"
                      ? "text-green-600"
                      : metric.change === 0
                        ? "text-gray-500"
                        : "text-red-600"
                  }`}
                >
                  {metric.change > 0 ? "+" : ""}
                  {metric.change}%
                </span>
              </div>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              {metric.title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {typeof metric.value === "number"
                ? formatValue(metric.value)
                : metric.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricGrid;
