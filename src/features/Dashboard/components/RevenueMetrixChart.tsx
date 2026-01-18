// src/components/dashboard/RevenueMetricsCard.tsx
import React from "react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { CreditCard, TrendingUpIcon } from "lucide-react";
import type { RevenueMetrics } from "../../../types";

interface RevenueMetricsCardProps {
  data?: RevenueMetrics;
}

export default function RevenueMetricsCard({ data }: RevenueMetricsCardProps) {
  const target = 100000; // Mock target
  const progress = data?.total.total ? (data.total.total / target) * 100 : 0;

  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 200,
    },
    plotOptions: {
      radialBar: {
        hollow: { size: "65%" },
        track: { background: "#E4E7EC" },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: "24px",
            fontWeight: "600",
            offsetY: -10,
            formatter: () => `${progress.toFixed(1)}%`,
          },
        },
      },
    },
    stroke: { lineCap: "round" },
    labels: ["Progress"],
  };

  const series = [progress];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Revenue Target
        </h3>
        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
          Monthly revenue progress
        </p>
      </div>

      <div className="relative mb-6">
        <Chart
          options={options}
          series={series}
          type="radialBar"
          height={200}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">Current Revenue</span>
          </div>
          <span className="font-semibold text-gray-800">
            {/*  TODO: UPDATE THE DOLLAR SIGN */}$
            {data?.total.total?.toLocaleString() || "0"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUpIcon className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Monthly Target</span>
          </div>
          <span className="font-semibold text-gray-800">
            ${target.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Remaining</span>
          </div>
          <span className="font-semibold text-gray-800">
            ${Math.max(0, target - (data?.total.total || 0)).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
