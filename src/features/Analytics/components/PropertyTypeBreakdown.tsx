import React from "react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import type { PropertyTypeDistribution } from "../../../types";

interface PropertyTypeBreakdownProps {
  data: PropertyTypeDistribution[];
}

export default function PropertyTypeBreakdown({
  data,
}: PropertyTypeBreakdownProps) {
  const options: ApexOptions = {
    chart: {
      type: "donut",
      height: 250,
    },
    colors: ["#465FFF", "#00E396", "#FEB019", "#FF4560", "#775DD0"],
    labels: data.map((item) => item.type),
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
              label: "Total",
              formatter: () =>
                data.reduce((sum, item) => sum + item.count, 0).toString(),
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
  };

  const series = data.map((item) => item.count);

  return <Chart options={options} series={series} type="donut" height={250} />;
}
