import React from "react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { useGetTopCitiesQuery } from "../../../services/analyticsApi";

interface TopCitiesChartProps {
  limit: number;
  period: "today" | "7d" | "30d" | "90d" | "1y" | "custom";
}

export default function TopCitiesChart({ limit, period }: TopCitiesChartProps) {
  const { data, isLoading } = useGetTopCitiesQuery({
    limit,
    period,
  });

  const chartData = data?.data || [];

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 220,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        columnWidth: "60%",
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: chartData.map((item) => item.name),
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { fontSize: "12px" },
      },
    },
    grid: {
      borderColor: "#f1f1f1",
    },
  };

  const series = [
    {
      name: "Properties",
      data: chartData.map((item) => item.value),
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Top Cities
        </h3>
        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
          Properties by city
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="text-gray-500">Loading cities data...</div>
        </div>
      ) : (
        <Chart options={options} series={series} type="bar" height={220} />
      )}
    </div>
  );
}
