import React from "react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import type { TimeSeriesData } from "../../../types";

interface PropertyTrendsChartProps {
  data: TimeSeriesData[];
  interval: "daily" | "weekly" | "monthly";
}

export default function PropertyTrendsChart({
  data,
  interval,
}: PropertyTrendsChartProps) {
  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 300,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    colors: ["#465FFF"],
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
      title: { text: "Properties" },
    },
    grid: {
      borderColor: "#f1f1f1",
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy",
      },
    },
    dataLabels: { enabled: false },
  };

  const series = [
    {
      name: "Properties",
      data: data.map((item) => item.value),
    },
  ];

  return <Chart options={options} series={series} type="line" height={300} />;
}

// Add this utility function
declare global {
  interface Date {
    getWeek(): number;
  }
}

Date.prototype.getWeek = function () {
  const date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  const week1 = new Date(date.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7,
    )
  );
};
