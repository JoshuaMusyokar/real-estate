import React from "react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import type { LeadSourceMetrics } from "../../../types";

interface LeadSourcesChartProps {
  data?: LeadSourceMetrics;
}

export default function LeadSourcesChart({ data }: LeadSourcesChartProps) {
  if (!data) return null;

  const sources = Object.entries(data);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 300,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        columnWidth: "60%",
      },
    },
    colors: ["#465FFF"],
    dataLabels: { enabled: false },
    xaxis: {
      categories: sources.map(([source]) => source),
    },
    yaxis: {
      labels: {
        formatter: (value) => value.toString(),
      },
    },
    tooltip: {
      y: {
        formatter: (value) => `${value} leads`,
      },
    },
  };

  const series = [
    {
      name: "Leads",
      data: sources.map(([, metric]) => metric.total),
    },
  ];

  return <Chart options={options} series={series} type="bar" height={300} />;
}
