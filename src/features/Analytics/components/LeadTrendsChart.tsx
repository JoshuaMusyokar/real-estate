import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import type { TimeSeriesData } from "../../../types";
import { UsersIcon, TrendingUpIcon } from "lucide-react";

interface LeadTrendsChartProps {
  data: TimeSeriesData[];
  interval: "daily" | "weekly" | "monthly";
}

export default function LeadTrendsChart({
  data,
  interval,
}: LeadTrendsChartProps) {
  // Calculate moving average for smoother trend line
  const calculateMovingAverage = (
    data: number[],
    windowSize: number = 3,
  ): number[] => {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - windowSize + 1);
      const end = i + 1;
      const slice = data.slice(start, end);
      const average = slice.reduce((sum, val) => sum + val, 0) / slice.length;
      result.push(parseFloat(average.toFixed(1)));
    }
    return result;
  };

  const leadValues = data.map((item) => item.value);
  const movingAverage = calculateMovingAverage(leadValues);

  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 300,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    stroke: {
      curve: "smooth",
      width: [3, 2],
    },
    colors: ["#465FFF", "#00E396"],
    xaxis: {
      categories: data.map((item) => item.date),
      labels: {
        formatter: (value) => {
          const date = new Date(value);
          if (interval === "daily") {
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          } else if (interval === "weekly") {
            return `Week ${date.getWeek()}`;
          } else {
            return date.toLocaleDateString("en-US", { month: "short" });
          }
        },
      },
    },
    yaxis: {
      title: { text: "Leads" },
    },
    grid: {
      borderColor: "#f1f1f1",
    },
    legend: {
      position: "top",
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy",
      },
      y: {
        formatter: (value) => `${value} leads`,
      },
    },
    dataLabels: { enabled: false },
    markers: {
      size: 4,
      hover: {
        size: 6,
      },
    },
  };

  const series = [
    {
      name: "New Leads",
      data: leadValues,
    },
    {
      name: "Trend",
      data: movingAverage,
    },
  ];

  // Calculate stats
  const hasData = leadValues.length > 0;

  const totalLeads = hasData
    ? leadValues.reduce((sum, val) => sum + val, 0)
    : 0;

  const avgLeadsPerDay = hasData
    ? (totalLeads / leadValues.length).toFixed(1)
    : "0.0";

  const peakLeads = hasData ? Math.max(...leadValues) : 0;

  const peakIndex = hasData ? leadValues.indexOf(peakLeads) : -1;
  const peakDate = peakIndex >= 0 ? data[peakIndex]?.date : null;

  const growth =
    leadValues.length > 1 && leadValues[0] > 0
      ? (
          ((leadValues[leadValues.length - 1] - leadValues[0]) /
            leadValues[0]) *
          100
        ).toFixed(1)
      : "0.0";

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <UsersIcon className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
              Total Leads
            </span>
          </div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {totalLeads.toLocaleString()}
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUpIcon className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-900 dark:text-green-300">
              Avg Per Day
            </span>
          </div>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">
            {avgLeadsPerDay}
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUpIcon className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-900 dark:text-purple-300">
              Peak Day
            </span>
          </div>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            {peakLeads.toLocaleString()}
          </div>
          <div className="text-xs text-purple-700 dark:text-purple-300 mt-1">
            {peakDate ? (
              new Date(peakDate).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })
            ) : (
              <span className="text-xs text-gray-400">No data</span>
            )}
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUpIcon className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-900 dark:text-orange-300">
              Growth
            </span>
          </div>
          <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
            {growth}%
          </div>
          <div className="text-xs text-orange-700 dark:text-orange-300 mt-1">
            vs start of period
          </div>
        </div>
      </div>

      <Chart options={options} series={series} type="line" height={300} />
    </div>
  );
}
