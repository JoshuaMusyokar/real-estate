import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { MoreHorizontal } from "lucide-react";
import { useGetPropertiesOverTimeQuery } from "../../../services/analyticsApi";

interface PropertyTrendsChartProps {
  period: "today" | "7d" | "30d" | "90d" | "1y" | "custom";
}

export default function PropertyTrendsChart({
  period,
}: PropertyTrendsChartProps) {
  const { data, isLoading } = useGetPropertiesOverTimeQuery({
    period,
    interval: "daily",
  });

  const chartData = data?.data || [];

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "line",
      height: 280,
      toolbar: { show: false },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    xaxis: {
      categories: chartData.map((item) => item.date),
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      title: { text: "Properties" },
    },
    grid: {
      borderColor: "#f1f1f1",
    },
    tooltip: {
      x: { format: "dd MMM" },
      y: {
        formatter: (val: number) => `${val} properties`,
      },
    },
  };

  const series = [
    {
      name: "Properties",
      data: chartData.map((item) => item.value),
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Property Trends
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            New properties listed over time
          </p>
        </div>
        <button className="text-gray-400 hover:text-gray-700">
          <MoreHorizontal className="size-6" />
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-72">
          <div className="text-gray-500">Loading chart...</div>
        </div>
      ) : (
        <Chart options={options} series={series} type="line" height={280} />
      )}
    </div>
  );
}
