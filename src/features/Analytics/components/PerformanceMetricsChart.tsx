/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from "react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import {
  TrendingUpIcon,
  TrendingDownIcon,
  UsersIcon,
  CreditCard,
  ClockIcon,
} from "lucide-react";
import type { AgentPerformance, AnalyticsQueryParams } from "../../../types";

interface PerformanceMetricsChartProps {
  agents: AgentPerformance[];
  filters: AnalyticsQueryParams;
}

type MetricType = "conversion" | "revenue" | "responseTime" | "leads";

export default function PerformanceMetricsChart({
  agents,
  filters,
}: PerformanceMetricsChartProps) {
  const [selectedMetric, setSelectedMetric] =
    useState<MetricType>("conversion");

  const getMetricData = () => {
    switch (selectedMetric) {
      case "conversion":
        return agents.map((agent) => ({
          name: agent.agentName,
          value: agent.conversionRate,
          change: 0, // Would calculate from historical data
        }));
      case "revenue":
        return agents.map((agent) => ({
          name: agent.agentName,
          value: agent.revenue,
          change: 0,
        }));
      case "responseTime":
        return agents.map((agent) => ({
          name: agent.agentName,
          value: agent.averageResponseTime,
          change: 0,
        }));
      case "leads":
        return agents.map((agent) => ({
          name: agent.agentName,
          value: agent.leadsAssigned,
          change: 0,
        }));
    }
  };

  const metricOptions = [
    {
      id: "conversion",
      label: "Conversion Rate",
      icon: TrendingUpIcon,
      unit: "%",
    },
    { id: "revenue", label: "Revenue", icon: CreditCard, unit: "$" },
    { id: "responseTime", label: "Response Time", icon: ClockIcon, unit: "h" },
    { id: "leads", label: "Leads Assigned", icon: UsersIcon, unit: "" },
  ];

  const metricData = getMetricData();
  const sortedData = [...metricData].sort((a, b) => b.value - a.value);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%",
        borderRadius: 6,
        distributed: false,
      },
    },
    colors: ["#465FFF"],
    dataLabels: {
      enabled: true,
      formatter: (val) => {
        const currentMetric = metricOptions.find(
          (m) => m.id === selectedMetric,
        );
        return `${val}${currentMetric?.unit || ""}`;
      },
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#1D2939"],
      },
    },
    xaxis: {
      categories: sortedData.map((item) => item.name.split(" ")[0]), // First name only
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      title: {
        text: metricOptions.find((m) => m.id === selectedMetric)?.label,
        style: {
          fontSize: "14px",
          fontWeight: "bold",
        },
      },
      labels: {
        formatter: (val) => {
          const currentMetric = metricOptions.find(
            (m) => m.id === selectedMetric,
          );
          return `${val}${currentMetric?.unit || ""}`;
        },
      },
    },
    grid: {
      borderColor: "#f1f1f1",
    },
    tooltip: {
      y: {
        formatter: (val) => {
          const currentMetric = metricOptions.find(
            (m) => m.id === selectedMetric,
          );
          return `${val}${currentMetric?.unit || ""}`;
        },
      },
    },
  };

  const series = [
    {
      name: selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1),
      data: sortedData.map((item) => item.value),
    },
  ];

  const getTopPerformer = () => {
    if (sortedData.length === 0) return null;
    return sortedData[0];
  };

  const getAverage = () => {
    if (metricData.length === 0) return 0;
    const sum = metricData.reduce((total, item) => total + item.value, 0);
    return sum / metricData.length;
  };

  const topPerformer = getTopPerformer();
  const averageValue = getAverage();

  return (
    <div className="space-y-6">
      {/* Metric Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {metricOptions.map((metric) => {
          const Icon = metric.icon;
          const isActive = selectedMetric === metric.id;

          return (
            <button
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id as MetricType)}
              className={`p-4 rounded-xl border transition-all ${
                isActive
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    isActive
                      ? "bg-blue-100 dark:bg-blue-800"
                      : "bg-gray-100 dark:bg-gray-700"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  />
                </div>
                <div className="text-left">
                  <div
                    className={`text-sm font-medium ${
                      isActive
                        ? "text-blue-900 dark:text-blue-300"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {metric.label}
                  </div>
                  <div className="text-xs text-gray-500">
                    {agents.length} agents
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-800">
              <TrendingUpIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-blue-900 dark:text-blue-300">
                Top Performer
              </div>
              <div className="text-xs text-blue-700 dark:text-blue-400">
                {topPerformer?.name || "N/A"}
              </div>
            </div>
          </div>
          <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
            {topPerformer
              ? `${topPerformer.value.toFixed(1)}${metricOptions.find((m) => m.id === selectedMetric)?.unit || ""}`
              : "N/A"}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-800">
              <TrendingUpIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-green-900 dark:text-green-300">
                Team Average
              </div>
              <div className="text-xs text-green-700 dark:text-green-400">
                All {agents.length} agents
              </div>
            </div>
          </div>
          <div className="text-3xl font-bold text-green-900 dark:text-green-100">
            {averageValue.toFixed(1)}
            {metricOptions.find((m) => m.id === selectedMetric)?.unit || ""}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-800">
              {selectedMetric === "responseTime" ? (
                <TrendingDownIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              ) : (
                <TrendingUpIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              )}
            </div>
            <div>
              <div className="text-sm font-medium text-purple-900 dark:text-purple-300">
                Performance Gap
              </div>
              <div className="text-xs text-purple-700 dark:text-purple-400">
                Top vs Average
              </div>
            </div>
          </div>
          <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
            {topPerformer
              ? `${((topPerformer.value / averageValue - 1) * 100).toFixed(1)}%`
              : "0%"}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <Chart options={options} series={series} type="bar" height={350} />
      </div>

      {/* Performance Insights */}
      {agents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Performance Insights
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-green-500" />
                <span>
                  <span className="font-medium">
                    {agents.filter((a) => a.conversionRate > 15).length}
                  </span>{" "}
                  agents exceed 15% conversion rate
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500" />
                <span>
                  Average response time:{" "}
                  <span className="font-medium">
                    {agents.reduce((sum, a) => sum + a.averageResponseTime, 0) /
                      agents.length}{" "}
                    hours
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-yellow-500" />
                <span>
                  <span className="font-medium">
                    {agents.filter((a) => a.revenue > 50000).length}
                  </span>{" "}
                  agents generated over $50K revenue
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Recommendations
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-green-500" />
                <span>
                  Coach underperforming agents on conversion techniques
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500" />
                <span>Implement faster response time protocols</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-purple-500" />
                <span>Share best practices from top performers</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
