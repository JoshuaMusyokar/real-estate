import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { TrendingUpIcon, TrendingDownIcon, MinusIcon } from "lucide-react";
import type { AnalyticsPeriod, AnalyticsQueryParams } from "../../../types";

interface ComparisonViewProps {
  filters: AnalyticsQueryParams;
  onPeriodChange: (period: AnalyticsQueryParams["period"]) => void;
}

export default function ComparisonView({
  filters,
  onPeriodChange,
}: ComparisonViewProps) {
  const comparisonData = {
    current: {
      revenue: 1250000,
      properties: 342,
      leads: 589,
      conversion: 15.2,
    },
    previous: {
      revenue: 1100000,
      properties: 298,
      leads: 512,
      conversion: 14.8,
    },
  };

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  const metrics = [
    {
      label: "Revenue",
      current: comparisonData.current.revenue,
      previous: comparisonData.previous.revenue,
      format: (value: number) => `$${(value / 1000).toFixed(0)}K`,
    },
    {
      label: "Properties",
      current: comparisonData.current.properties,
      previous: comparisonData.previous.properties,
      format: (value: number) => value.toString(),
    },
    {
      label: "Leads",
      current: comparisonData.current.leads,
      previous: comparisonData.previous.leads,
      format: (value: number) => value.toString(),
    },
    {
      label: "Conversion Rate",
      current: comparisonData.current.conversion,
      previous: comparisonData.previous.conversion,
      format: (value: number) => `${value.toFixed(1)}%`,
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 200,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "40%",
        borderRadius: 4,
      },
    },
    colors: ["#465FFF", "#9CB9FF"],
    dataLabels: { enabled: false },
    xaxis: {
      categories: metrics.map((m) => m.label),
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (value) => value.toString(),
      },
    },
    legend: {
      position: "top",
    },
    grid: {
      borderColor: "#f1f1f1",
    },
  };

  const series = [
    {
      name: "Current Period",
      data: metrics.map((m) => m.current),
    },
    {
      name: "Previous Period",
      data: metrics.map((m) => m.previous),
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Period Comparison
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Compare performance with previous period
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filters.period}
            onChange={(e) => onPeriodChange(e.target.value as AnalyticsPeriod)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <Chart options={options} series={series} type="bar" height={200} />
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="space-y-4">
            {metrics.map((metric, index) => {
              const change = calculateChange(metric.current, metric.previous);
              const isPositive = change > 0;
              const isNeutral = change === 0;

              return (
                <div
                  key={index}
                  className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {metric.label}
                    </span>
                    <div className="flex items-center gap-1">
                      {isPositive ? (
                        <TrendingUpIcon className="w-4 h-4 text-green-600" />
                      ) : isNeutral ? (
                        <MinusIcon className="w-4 h-4 text-gray-400" />
                      ) : (
                        <TrendingDownIcon className="w-4 h-4 text-red-600" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          isPositive
                            ? "text-green-600"
                            : isNeutral
                              ? "text-gray-500"
                              : "text-red-600"
                        }`}
                      >
                        {isPositive ? "+" : ""}
                        {change.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold">
                        {metric.format(metric.current)}
                      </span>
                      <div className="text-xs text-gray-500">
                        vs {metric.format(metric.previous)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
