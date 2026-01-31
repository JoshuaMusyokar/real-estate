// src/components/dashboard/RevenueMetricsCard.tsx
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { CreditCard, TrendingUpIcon, CheckCircleIcon } from "lucide-react";
import type { RevenueMetrics } from "../../../types";
import { CURRENCY_CODE } from "../../../constants";

interface RevenueMetricsCardProps {
  data?: RevenueMetrics;
}

export default function RevenueMetricsCard({ data }: RevenueMetricsCardProps) {
  if (!data) return null;

  const totalRevenue = data.total.total ?? 0;
  const dealsClosed = data.dealsClosed.total ?? 0;
  const avgDealSize = dealsClosed > 0 ? totalRevenue / dealsClosed : 0;

  const percentage = totalRevenue > 0 ? (avgDealSize / totalRevenue) * 100 : 0;

  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      type: "radialBar",
      height: 200,
      fontFamily: "Outfit, sans-serif",
    },
    plotOptions: {
      radialBar: {
        hollow: { size: "65%" },
        track: { background: "#E4E7EC" },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: "22px",
            fontWeight: 600,
            formatter: () =>
              `${CURRENCY_CODE} ${avgDealSize.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}`,
          },
        },
      },
    },
    stroke: { lineCap: "round" },
  };

  const series = [Number.isFinite(percentage) ? percentage : 0];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Revenue Overview
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Based on closed deals
        </p>
      </div>

      <div className="mb-6">
        <Chart
          options={options}
          series={series}
          type="radialBar"
          height={200}
        />
      </div>

      <div className="space-y-4">
        {/* Total Revenue */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">Total Revenue</span>
          </div>
          <span className="font-semibold text-gray-800">
            {CURRENCY_CODE}
            {totalRevenue.toLocaleString()}
          </span>
        </div>

        {/* Deals Closed */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-600">Deals Closed</span>
          </div>
          <span className="font-semibold text-gray-800">{dealsClosed}</span>
        </div>

        {/* Avg Deal Size */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUpIcon className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Avg Deal Size</span>
          </div>
          <span className="font-semibold text-gray-800">
            {CURRENCY_CODE}
            {avgDealSize.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
