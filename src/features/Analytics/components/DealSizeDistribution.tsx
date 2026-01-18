import React from "react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import type { RevenueMetrics } from "../../../types";

interface DealSizeDistributionProps {
  data?: RevenueMetrics;
}

export default function DealSizeDistribution({
  data,
}: DealSizeDistributionProps) {
  // Mock deal size distribution
  const dealSizes = [
    { range: "Under $50K", count: 12, revenue: 450000 },
    { range: "$50K - $100K", count: 28, revenue: 2100000 },
    { range: "$100K - $250K", count: 45, revenue: 6750000 },
    { range: "$250K - $500K", count: 22, revenue: 8250000 },
    { range: "$500K - $1M", count: 8, revenue: 6000000 },
    { range: "Over $1M", count: 3, revenue: 4500000 },
  ];

  const totalDeals = dealSizes.reduce((sum, item) => sum + item.count, 0);
  const totalRevenue = dealSizes.reduce((sum, item) => sum + item.revenue, 0);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 300,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%",
        borderRadius: 6,
      },
    },
    colors: ["#465FFF"],
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val} deals`,
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#1D2939"],
      },
    },
    xaxis: {
      categories: dealSizes.map((item) => item.range),
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      title: {
        text: "Number of Deals",
        style: {
          fontSize: "14px",
          fontWeight: "bold",
        },
      },
    },
    grid: {
      borderColor: "#f1f1f1",
    },
    tooltip: {
      y: {
        formatter: (val, { dataPointIndex }) => {
          const deal = dealSizes[dataPointIndex];
          return `${val} deals • $${deal.revenue.toLocaleString()} revenue`;
        },
      },
    },
  };

  const series = [
    {
      name: "Deals",
      data: dealSizes.map((item) => item.count),
    },
  ];

  // Calculate average deal size
  const avgDealSize = totalRevenue / totalDeals;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
          <div className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
            Total Deals
          </div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {totalDeals.toLocaleString()}
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
          <div className="text-sm font-medium text-green-900 dark:text-green-300 mb-2">
            Avg Deal Size
          </div>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">
            ${avgDealSize.toFixed(0).toLocaleString()}
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
          <div className="text-sm font-medium text-purple-900 dark:text-purple-300 mb-2">
            Most Common
          </div>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            $
            {dealSizes
              .reduce((max, item) => (item.count > max.count ? item : max))
              .range.split("-")[0]
              .trim()}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <Chart options={options} series={series} type="bar" height={300} />
      </div>

      {/* Deal Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            Revenue by Deal Size
          </h4>
          <div className="space-y-3">
            {dealSizes.map((deal, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {deal.range}
                </span>
                <div className="text-right">
                  <div className="font-medium">
                    ${deal.revenue.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {((deal.revenue / totalRevenue) * 100).toFixed(1)}% of total
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            Performance Insights
          </h4>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-green-500" />
              <span>
                <span className="font-medium">{dealSizes[2].count}</span> deals
                in $100K-$250K range generate most revenue
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500" />
              <span>
                Premium deals (over $500K) contribute{" "}
                <span className="font-medium">
                  {(
                    ((dealSizes[4].revenue + dealSizes[5].revenue) /
                      totalRevenue) *
                    100
                  ).toFixed(1)}
                  %
                </span>{" "}
                of revenue
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-yellow-500" />
              <span>
                Focus on converting more mid-range deals for optimal revenue mix
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
