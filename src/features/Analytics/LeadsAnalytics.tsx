import { useState } from "react";

import type { AnalyticsQueryParams } from "../../types";
import {
  useGetConversionMetricsQuery,
  useGetLeadOverviewQuery,
  useGetLeadSourcesQuery,
  useGetLeadsOverTimeQuery,
} from "../../services/analyticsApi";
import ExportPanel from "./components/ExportPanel";
import AdvancedFilterPanel from "./components/AdvancedFilterPanel";
import LeadFunnelChart from "./components/LeadFunnelChart";
import LeadSourcesChart from "./components/LeadSourcesChart";
import ConversionMetrics from "./components/ConversionMetrics";
import LeadTrendsChart from "./components/LeadTrendsChart";

export default function LeadsAnalytics() {
  const [filters, setFilters] = useState<AnalyticsQueryParams>({
    period: "30d",
    interval: "daily",
  });

  // Fetch lead analytics
  const { data: overviewData } = useGetLeadOverviewQuery(filters);
  const { data: trendsData } = useGetLeadsOverTimeQuery({
    ...filters,
    interval: filters.interval || "daily",
  });
  const { data: sourcesData } = useGetLeadSourcesQuery(filters);
  const { data: conversionData } = useGetConversionMetricsQuery(filters);

  const handleFilterChange = (newFilters: Partial<AnalyticsQueryParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Lead Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track lead generation, conversion, and pipeline performance
          </p>
        </div>

        <ExportPanel filters={filters} format="excel" type="leads" />
      </div>

      {/* Advanced Filters */}
      <AdvancedFilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        showLeadFilters
      />

      {/* Conversion Metrics */}
      {conversionData?.data && <ConversionMetrics data={conversionData.data} />}

      {/* Charts Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Lead Funnel */}
        <div className="col-span-12 lg:col-span-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 h-full">
            <h3 className="text-lg font-semibold mb-4">Lead Funnel</h3>
            <LeadFunnelChart data={overviewData?.data} />
          </div>
        </div>

        {/* Lead Sources */}
        <div className="col-span-12 lg:col-span-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 h-full">
            <h3 className="text-lg font-semibold mb-4">Lead Sources</h3>
            <LeadSourcesChart data={sourcesData?.data} />
          </div>
        </div>

        {/* Lead Trends */}
        <div className="col-span-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4">
              Lead Trends Over Time
            </h3>
            <LeadTrendsChart
              data={trendsData?.data || []}
              interval={filters.interval || "daily"}
            />
          </div>
        </div>
      </div>

      {/* Detailed Metrics Table */}
      {overviewData?.data && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">
            Lead Performance Details
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500">New Leads</p>
              <p className="text-2xl font-bold">
                {overviewData.data.newLeads.total}
              </p>
              {overviewData.data.newLeads.change && (
                <p
                  className={`text-sm ${
                    overviewData.data.newLeads.change > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {overviewData.data.newLeads.change > 0 ? "+" : ""}
                  {overviewData.data.newLeads.change}%
                </p>
              )}
            </div>

            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500">Contacted</p>
              <p className="text-2xl font-bold">
                {overviewData.data.contacted.total}
              </p>
              {overviewData.data.contacted.change && (
                <p
                  className={`text-sm ${
                    overviewData.data.contacted.change > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {overviewData.data.contacted.change > 0 ? "+" : ""}
                  {overviewData.data.contacted.change}%
                </p>
              )}
            </div>

            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500">Qualified</p>
              <p className="text-2xl font-bold">
                {overviewData.data.qualified?.total || 0}
              </p>
              {overviewData.data.qualified?.change && (
                <p
                  className={`text-sm ${
                    overviewData.data.qualified.change > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {overviewData.data.qualified.change > 0 ? "+" : ""}
                  {overviewData.data.qualified.change}%
                </p>
              )}
            </div>

            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500">Closed</p>
              <p className="text-2xl font-bold">
                {overviewData.data.closed.total}
              </p>
              {overviewData.data.closed.change && (
                <p
                  className={`text-sm ${
                    overviewData.data.closed.change > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {overviewData.data.closed.change > 0 ? "+" : ""}
                  {overviewData.data.closed.change}%
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
