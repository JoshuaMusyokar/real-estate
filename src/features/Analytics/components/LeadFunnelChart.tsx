import type { LeadOverviewResponse } from "../../../types";

interface LeadFunnelChartProps {
  data?: LeadOverviewResponse;
}

export default function LeadFunnelChart({ data }: LeadFunnelChartProps) {
  if (!data) return null;

  const funnelStages = [
    { label: "Total Leads", value: data.total.total, color: "bg-blue-500" },
    { label: "New Leads", value: data.newLeads.total, color: "bg-blue-400" },
    { label: "Contacted", value: data.contacted.total, color: "bg-blue-300" },
    {
      label: "Qualified",
      value: data.qualified?.total || 0,
      color: "bg-blue-200",
    },
    { label: "Closed", value: data.closed.total, color: "bg-blue-100" },
  ];

  const maxValue = Math.max(...funnelStages.map((stage) => stage.value));

  return (
    <div className="space-y-2">
      {funnelStages.map((stage, index) => {
        const widthPercentage = (stage.value / maxValue) * 100;
        const conversionRate =
          index > 0 ? (stage.value / funnelStages[index - 1].value) * 100 : 100;

        return (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {stage.label}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">
                  {stage.value.toLocaleString()}
                </span>
                {index > 0 && (
                  <span className="text-xs text-gray-500">
                    {conversionRate.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>

            <div className="h-6 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden">
              <div
                className={`h-full rounded-lg ${stage.color} transition-all duration-500`}
                style={{ width: `${widthPercentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
