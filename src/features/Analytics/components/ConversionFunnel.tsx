import {
  TrendingUpIcon,
  UsersIcon,
  CalendarIcon,
  CheckCircleIcon,
} from "lucide-react";
import type { ConversionMetrics } from "../../../types";

interface ConversionFunnelProps {
  data?: ConversionMetrics;
}

export default function ConversionFunnel({ data }: ConversionFunnelProps) {
  if (!data) return null;

  const funnelStages = [
    {
      stage: "Leads",
      value: data.leads.total,
      icon: <UsersIcon className="w-5 h-5" />,
      color: "bg-blue-500",
      textColor: "text-blue-600",
    },
    {
      stage: "Appointments",
      value: data.appointments.total,
      icon: <CalendarIcon className="w-5 h-5" />,
      color: "bg-green-500",
      textColor: "text-green-600",
    },
    {
      stage: "Closed",
      value: data.closed.total,
      icon: <CheckCircleIcon className="w-5 h-5" />,
      color: "bg-purple-500",
      textColor: "text-purple-600",
    },
  ];

  const conversionRates = [
    {
      from: "Leads",
      to: "Appointments",
      rate: data.conversionRates.leadToAppointment,
    },
    {
      from: "Appointments",
      to: "Closed",
      rate: data.conversionRates.appointmentToClosed,
    },
    {
      from: "Leads",
      to: "Closed",
      rate: data.conversionRates.leadToClosed,
    },
  ];

  const maxValue = Math.max(...funnelStages.map((stage) => stage.value));

  return (
    <div className="space-y-6">
      {/* Funnel Visualization */}
      <div className="relative flex flex-col items-center">
        {funnelStages.map((stage, index) => {
          const widthPercentage = (stage.value / maxValue) * 100;
          const funnelWidth = 100 - index * 25; // Creates funnel shape
          const actualWidth = Math.min(widthPercentage, funnelWidth);

          return (
            <div key={stage.stage} className="relative w-full mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-1 rounded-lg ${stage.textColor} bg-opacity-10`}
                  >
                    {stage.icon}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {stage.stage}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold">
                    {stage.value.toLocaleString()}
                  </span>
                  {index > 0 && (
                    <span className="text-sm text-gray-500">
                      {(
                        (stage.value / funnelStages[index - 1].value) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  )}
                </div>
              </div>

              <div className="h-8 relative">
                {/* Background */}
                <div className="absolute inset-0 rounded-lg bg-gray-100 dark:bg-gray-700" />

                {/* Filled portion */}
                <div
                  className={`absolute inset-y-0 left-0 ${stage.color} rounded-lg transition-all duration-500`}
                  style={{ width: `${actualWidth}%` }}
                />

                {/* Funnel shape overlay */}
                <div
                  className="absolute inset-0 rounded-lg border-2 border-gray-300 dark:border-gray-600"
                  style={{
                    clipPath: `polygon(${100 - funnelWidth}% 0%, ${funnelWidth}% 0%, 100% 100%, 0% 100%)`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Conversion Rates */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 dark:text-white">
          Conversion Rates
        </h4>
        {conversionRates.map((rate, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <TrendingUpIcon className="w-4 h-4 text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {rate.from} → {rate.to}
                </div>
                <div className="text-xs text-gray-500">Conversion rate</div>
              </div>
            </div>
            <div className="text-right">
              <div
                className={`text-lg font-bold ${
                  rate.rate > 20
                    ? "text-green-600"
                    : rate.rate > 10
                      ? "text-yellow-600"
                      : "text-red-600"
                }`}
              >
                {rate.rate.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500">
                Industry avg: {rate.to === "Closed" ? "5-10%" : "15-25%"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Indicators */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div
            className={`text-2xl font-bold ${
              data.conversionRates.leadToClosed > 10
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {data.conversionRates.leadToClosed.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500">Overall Conversion</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold">
            $
            {data.closed.total > 0
              ? (data.closed.total * 10000).toLocaleString() // Mock revenue per deal
              : "0"}
          </div>
          <div className="text-xs text-gray-500">Estimated Value</div>
        </div>
      </div>
    </div>
  );
}
