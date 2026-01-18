import React, { useState } from "react";
import type { AnalyticsQueryParams } from "../../types";
import {
  useGetAgentPerformanceQuery,
  useGetConversionMetricsQuery,
} from "../../services/analyticsApi";
import ExportPanel from "./components/ExportPanel";
import AdvancedFilterPanel from "./components/AdvancedFilterPanel";
import AgentPerformanceTable from "./components/AgentPerformanceTable";
import PerformanceMetricsChart from "./components/PerformanceMetricsChart";
import ConversionFunnel from "./components/ConversionFunnel";

export default function PerformanceAnalytics() {
  const [filters, setFilters] = useState<AnalyticsQueryParams>({
    period: "30d",
  });
  const [agentLimit, setAgentLimit] = useState(10);

  // Fetch performance analytics
  const { data: agentData } = useGetAgentPerformanceQuery({
    ...filters,
    limit: agentLimit,
  });
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
            Performance Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track agent performance and team metrics
          </p>
        </div>

        <ExportPanel filters={filters} format="excel" type="performance" />
      </div>

      {/* Advanced Filters */}
      <AdvancedFilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        showPerformanceFilters
      />

      {/* Agent Limit Control */}
      <div className="flex items-center gap-4">
        <label className="text-sm text-gray-600">Show top</label>
        <select
          value={agentLimit}
          onChange={(e) => setAgentLimit(Number(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800"
        >
          <option value={5}>5 Agents</option>
          <option value={10}>10 Agents</option>
          <option value={20}>20 Agents</option>
          <option value={50}>50 Agents</option>
        </select>
        <span className="text-sm text-gray-500">agents by performance</span>
      </div>

      {/* Performance Metrics */}
      {conversionData?.data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500">Lead to Appointment</p>
            <p className="text-2xl font-bold">
              {conversionData.data.conversionRates.leadToAppointment.toFixed(1)}
              %
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500">Appointment to Closed</p>
            <p className="text-2xl font-bold">
              {conversionData.data.conversionRates.appointmentToClosed.toFixed(
                1,
              )}
              %
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500">Lead to Closed</p>
            <p className="text-2xl font-bold">
              {conversionData.data.conversionRates.leadToClosed.toFixed(1)}%
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500">Total Leads</p>
            <p className="text-2xl font-bold">
              {conversionData.data.leads.total.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Agent Performance Table */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4">
              Agent Performance Rankings
            </h3>
            <AgentPerformanceTable
              data={agentData?.data || []}
              sortBy="revenue"
            />
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 h-full">
            <h3 className="text-lg font-semibold mb-4">Conversion Funnel</h3>
            <ConversionFunnel data={conversionData?.data} />
          </div>
        </div>

        {/* Performance Metrics Chart */}
        <div className="col-span-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4">
              Performance Metrics Over Time
            </h3>
            <PerformanceMetricsChart
              agents={agentData?.data || []}
              filters={filters}
            />
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      {agentData?.data && agentData.data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold mb-3">Average Metrics</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Response Time</span>
                <span className="font-medium">
                  {calculateAverage(agentData.data, "averageResponseTime")}{" "}
                  hours
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Sales Cycle</span>
                <span className="font-medium">
                  {calculateAverage(agentData.data, "averageSalesCycle")} days
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">No-Show Rate</span>
                <span className="font-medium">
                  {calculateAverage(agentData.data, "noShowRate")}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold mb-3">Top Performer</h4>
            {agentData.data[0] && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Agent</span>
                  <span className="font-medium">
                    {agentData.data[0].agentName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Revenue</span>
                  <span className="font-medium">
                    ${agentData.data[0].revenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Conversion Rate</span>
                  <span className="font-medium">
                    {agentData.data[0].conversionRate.toFixed(1)}%
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold mb-3">Team Totals</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Revenue</span>
                <span className="font-medium">
                  $
                  {agentData.data
                    .reduce((sum, agent) => sum + agent.revenue, 0)
                    .toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Leads Converted</span>
                <span className="font-medium">
                  {agentData.data
                    .reduce((sum, agent) => sum + agent.leadsConverted, 0)
                    .toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Appointments</span>
                <span className="font-medium">
                  {agentData.data
                    .reduce(
                      (sum, agent) => sum + agent.appointmentsScheduled,
                      0,
                    )
                    .toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function calculateAverage(agents: any[], key: string): number {
  if (!agents.length) return 0;
  const sum = agents.reduce((total, agent) => total + (agent[key] || 0), 0);
  return Math.round((sum / agents.length) * 10) / 10;
}
