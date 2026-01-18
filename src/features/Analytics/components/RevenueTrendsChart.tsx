import React from "react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import type { RevenueMetrics } from "../../../types";

interface RevenueTrendsChartProps {
  data?: RevenueMetrics;
  comparison?: any;
}

export default function RevenueTrendsChart({ data }: RevenueTrendsChartProps) {
  // Mock monthly revenue data
  const monthlyRevenue = [
    { month: "Jan", revenue: 85000, deals: 8 },
    { month: "Feb", revenue: 92000, deals: 9 },
    { month: "Mar", revenue: 78000, deals: 7 },
    { month: "Apr", revenue: 105000, deals: 10 },
    { month: "May", revenue: 125000, deals: 12 },
    { month: "Jun", revenue: 98000, deals: 9 },
    { month: "Jul", revenue: 115000, deals: 11 },
    { month: "Aug", revenue: 132000, deals: 13 },
    { month: "Sep", revenue: 142000, deals: 14 },
    { month: "Oct", revenue: 128000, deals: 12 },
    { month: "Nov", revenue: 155000, deals: 15 },
    { month: "Dec", revenue: 0, deals: 0 }, // Future month
  ];

  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 350,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    stroke: {
      curve: "smooth",
      width: [3, 2],
    },
    colors: ["#465FFF", "#00E396"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: monthlyRevenue.map((item) => item.month),
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: [
      {
        title: {
          text: "Revenue ($)",
          style: {
            fontSize: "14px",
            fontWeight: "bold",
          },
        },
        labels: {
          formatter: (val) => `$${(val / 1000).toFixed(0)}K`,
        },
      },
      {
        opposite: true,
        title: {
          text: "Deals",
          style: {
            fontSize: "14px",
            fontWeight: "bold",
          },
        },
      },
    ],
    grid: {
      borderColor: "#f1f1f1",
    },
    legend: {
      position: "top",
    },
    tooltip: {
      x: {
        format: "MMM",
      },
      y: [
        {
          formatter: (val) => `$${val.toLocaleString()}`,
        },
        {
          formatter: (val) => `${val} deals`,
        },
      ],
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
      name: "Revenue",
      type: "area",
      data: monthlyRevenue.map((item) => item.revenue),
    },
    {
      name: "Deals",
      type: "line",
      data: monthlyRevenue.map((item) => item.deals * 10000), // Scale for visualization
    },
  ];

  // Calculate stats
  const totalRevenue = monthlyRevenue.reduce(
    (sum, item) => sum + item.revenue,
    0,
  );
  const avgDealSize =
    totalRevenue / monthlyRevenue.reduce((sum, item) => sum + item.deals, 1);
  const yoyGrowth = 18.5; // Mock YOY growth

  return (
    <div className="space-y-6">
      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4">
          <div className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
            Total Revenue
          </div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            ${totalRevenue.toLocaleString()}
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-400 mt-1">
            Current period
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4">
          <div className="text-sm font-medium text-green-900 dark:text-green-300 mb-2">
            Avg Deal Size
          </div>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">
            ${avgDealSize.toFixed(0).toLocaleString()}
          </div>
          <div className="text-xs text-green-700 dark:text-green-400 mt-1">
            Per closed deal
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4">
          <div className="text-sm font-medium text-purple-900 dark:text-purple-300 mb-2">
            YoY Growth
          </div>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            +{yoyGrowth}%
          </div>
          <div className="text-xs text-purple-700 dark:text-purple-400 mt-1">
            Year over year
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-4">
          <div className="text-sm font-medium text-orange-900 dark:text-orange-300 mb-2">
            Projected
          </div>
          <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
            ${(totalRevenue * 1.15).toLocaleString()}
          </div>
          <div className="text-xs text-orange-700 dark:text-orange-400 mt-1">
            Next period (+15%)
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <Chart options={options} series={series} type="line" height={350} />
      </div>

      {/* Revenue Breakdown */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Revenue Sources
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Property Sales
                </span>
                <span className="font-medium">
                  ${(totalRevenue * 0.65).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Rental Commissions
                </span>
                <span className="font-medium">
                  ${(totalRevenue * 0.25).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Consulting
                </span>
                <span className="font-medium">
                  ${(totalRevenue * 0.1).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Performance vs Target
            </h4>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Revenue Target
                  </span>
                  <span className="text-sm font-medium">$1,200,000</span>
                </div>
                <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{ width: `${(totalRevenue / 1200000) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {((totalRevenue / 1200000) * 100).toFixed(1)}% achieved
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Deal Target
                  </span>
                  <span className="text-sm font-medium">120 deals</span>
                </div>
                <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{
                      width: `${(monthlyRevenue.reduce((sum, item) => sum + item.deals, 0) / 120) * 100}%`,
                    }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {(
                    (monthlyRevenue.reduce((sum, item) => sum + item.deals, 0) /
                      120) *
                    100
                  ).toFixed(1)}
                  % achieved
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Seasonal Trends
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Peak Month
                </span>
                <span className="font-medium">November</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Lowest Month
                </span>
                <span className="font-medium">March</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Q4 Performance
                </span>
                <span className="font-medium text-green-600">+32%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Best Quarter
                </span>
                <span className="font-medium">Q4 2023</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
