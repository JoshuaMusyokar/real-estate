import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import {
  useGetLeadSourcesQuery,
  useGetLeadsOverTimeQuery,
} from "../../../services/analyticsApi";

interface LeadAnalyticsChartProps {
  period: "today" | "7d" | "30d" | "90d" | "1y" | "custom";
}

export default function LeadAnalyticsChart({
  period,
}: LeadAnalyticsChartProps) {
  const { data: leadsOverTime, isLoading: isLeadsLoading } =
    useGetLeadsOverTimeQuery({
      period,
      interval: "daily",
    });

  const { data: leadSources, isLoading: isSourcesLoading } =
    useGetLeadSourcesQuery({
      period,
    });

  const isLoading = isLeadsLoading || isSourcesLoading;

  // Line chart for leads over time
  const lineOptions: ApexOptions = {
    colors: ["#465fff", "#00E396"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "line",
      height: 180,
      toolbar: { show: false },
    },
    stroke: {
      curve: "smooth",
      width: [3, 2],
    },
    xaxis: {
      categories: leadsOverTime?.data?.map((item) => item.date) || [],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      title: { text: "Leads" },
    },
    legend: {
      position: "top",
    },
  };

  const lineSeries = [
    {
      name: "New Leads",
      data: leadsOverTime?.data?.map((item) => item.value) || [],
    },
    {
      name: "Converted",
      data:
        leadsOverTime?.data?.map((item) => Math.floor(item.value * 0.3)) || [], // Mock conversion data
    },
  ];

  // Donut chart for lead sources
  const donutOptions: ApexOptions = {
    colors: ["#465fff", "#00E396", "#FEB019", "#FF4560", "#775DD0"],
    chart: {
      type: "donut",
      height: 200,
    },
    labels: leadSources?.data ? Object.keys(leadSources.data) : [],
    legend: {
      position: "bottom",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Leads",
            },
          },
        },
      },
    },
  };

  const donutSeries = leadSources?.data
    ? Object.values(leadSources.data).map((source) => source.total)
    : [];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Lead Analytics
        </h3>
        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
          Lead trends and sources
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-72">
          <div className="text-gray-500">Loading lead data...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="mb-4 text-sm font-medium text-gray-700">
              Leads Over Time
            </h4>
            <Chart
              options={lineOptions}
              series={lineSeries}
              type="line"
              height={180}
            />
          </div>

          <div>
            <h4 className="mb-4 text-sm font-medium text-gray-700">
              Lead Sources
            </h4>
            <Chart
              options={donutOptions}
              series={donutSeries}
              type="donut"
              height={200}
            />
          </div>
        </div>
      )}
    </div>
  );
}
