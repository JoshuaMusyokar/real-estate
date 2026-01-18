import React, { useState } from "react";
import type { AnalyticsPeriod, AnalyticsQueryParams } from "../../types";
import {
  useComparePeriodsQuery,
  useGetRevenueMetricsQuery,
} from "../../services/analyticsApi";
import ExportPanel from "./components/ExportPanel";
import AdvancedFilterPanel from "./components/AdvancedFilterPanel";
import RevenueTrendsChart from "./components/RevenueTrendsChart";
import RevenueTargetChart from "./components/RevenueTargetChart";
import DealSizeDistribution from "./components/DealSizeDistribution";

export default function RevenueAnalytics() {
  const [filters, setFilters] = useState<AnalyticsQueryParams>({
    period: "30d",
    interval: "monthly",
  });

  // Fetch revenue analytics
  const { data: revenueData } = useGetRevenueMetricsQuery(filters);
  const { data: comparisonData } = useComparePeriodsQuery({
    type: "revenue",
    currentPeriod: filters,
    previousPeriod: { ...filters, period: getPreviousPeriod(filters.period) },
  });

  const handleFilterChange = (newFilters: Partial<AnalyticsQueryParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Revenue Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track financial performance and revenue trends
          </p>
        </div>

        <ExportPanel filters={filters} format="excel" />
      </div>

      {/* Advanced Filters */}
      <AdvancedFilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        showFinancialFilters
      />

      {/* Revenue Metrics */}
      {revenueData?.data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 mb-2">Total Revenue</p>
            <p className="text-3xl font-bold">
              ${revenueData.data.total.total?.toLocaleString() || "0"}
            </p>
            {revenueData.data.total.change && (
              <p
                className={`text-sm mt-1 ${revenueData.data.total.change > 0 ? "text-green-600" : "text-red-600"}`}
              >
                {revenueData.data.total.change > 0 ? "↑" : "↓"}
                {Math.abs(revenueData.data.total.change)}% vs previous period
              </p>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 mb-2">Deals Closed</p>
            <p className="text-3xl font-bold">
              {revenueData.data.dealsClosed.total?.toLocaleString() || "0"}
            </p>
            {revenueData.data.dealsClosed.change && (
              <p
                className={`text-sm mt-1 ${revenueData.data.dealsClosed.change > 0 ? "text-green-600" : "text-red-600"}`}
              >
                {revenueData.data.dealsClosed.change > 0 ? "↑" : "↓"}
                {Math.abs(revenueData.data.dealsClosed.change)}% vs previous
                period
              </p>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 mb-2">Avg Deal Size</p>
            <p className="text-3xl font-bold">
              ${revenueData.data.averageDealSize.total?.toLocaleString() || "0"}
            </p>
            {revenueData.data.averageDealSize.change && (
              <p
                className={`text-sm mt-1 ${revenueData.data.averageDealSize.change > 0 ? "text-green-600" : "text-red-600"}`}
              >
                {revenueData.data.averageDealSize.change > 0 ? "↑" : "↓"}
                {Math.abs(revenueData.data.averageDealSize.change)}% vs previous
                period
              </p>
            )}
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Revenue Trends */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 h-full">
            <h3 className="text-lg font-semibold mb-4">Revenue Trends</h3>
            <RevenueTrendsChart
              data={revenueData?.data}
              comparison={comparisonData}
            />
          </div>
        </div>

        {/* Revenue Target */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 h-full">
            <h3 className="text-lg font-semibold mb-4">
              Revenue Target Progress
            </h3>
            <RevenueTargetChart
              current={revenueData?.data?.total.total || 0}
              target={1000000} // Example target
            />
          </div>
        </div>

        {/* Deal Size Distribution */}
        <div className="col-span-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4">
              Deal Size Distribution
            </h3>
            <DealSizeDistribution data={revenueData?.data} />
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      {comparisonData && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Period Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-3 text-left text-sm font-medium text-gray-500">
                    Metric
                  </th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">
                    Current Period
                  </th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">
                    Previous Period
                  </th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">
                    Change
                  </th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 text-sm">Total Revenue</td>
                  <td className="py-3 text-sm font-medium">
                    ${comparisonData.current.data.total.total?.toLocaleString()}
                  </td>
                  <td className="py-3 text-sm">
                    $
                    {comparisonData.previous.data.total.total?.toLocaleString()}
                  </td>
                  <td className="py-3 text-sm">
                    {comparisonData.comparison.change > 0 ? "+" : ""}
                    {comparisonData.comparison.change}%
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                        comparisonData.comparison.trend === "up"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : comparisonData.comparison.trend === "down"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {comparisonData.comparison.trend === "up"
                        ? "↑"
                        : comparisonData.comparison.trend === "down"
                          ? "↓"
                          : "→"}
                      {comparisonData.comparison.trend}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function getPreviousPeriod(period?: AnalyticsPeriod): AnalyticsPeriod {
  switch (period) {
    case "7d":
      return "7d";
    case "30d":
      return "30d";
    case "90d":
      return "90d";
    case "1y":
      return "1y";
    default:
      return "30d";
  }
}
