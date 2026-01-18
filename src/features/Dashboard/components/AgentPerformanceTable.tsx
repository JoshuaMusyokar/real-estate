import { UserIcon, TrendingUpIcon } from "lucide-react";
import { useGetAgentPerformanceQuery } from "../../../services/analyticsApi";

interface AgentPerformanceTableProps {
  limit: number;
  period: "today" | "7d" | "30d" | "90d" | "1y" | "custom";
}

export default function AgentPerformanceTable({
  limit,
  period,
}: AgentPerformanceTableProps) {
  const { data, isLoading } = useGetAgentPerformanceQuery({
    limit,
    period,
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Top Agents
        </h3>
        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
          Performance metrics
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="text-gray-500">Loading agents data...</div>
        </div>
      ) : (
        <div className="space-y-4">
          {data?.data?.map((agent) => (
            <div
              key={agent.agentId}
              className="flex items-center justify-between p-3 border border-gray-100 rounded-lg dark:border-gray-800"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full dark:bg-gray-800">
                  <UserIcon className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {agent.agentName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {agent.leadsAssigned} leads assigned
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <TrendingUpIcon className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold">
                      {agent.conversionRate.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Conversion</p>
                </div>

                <div className="text-right">
                  <span className="text-sm font-semibold">
                    ${agent.revenue.toLocaleString()}
                  </span>
                  <p className="text-xs text-gray-500">Revenue</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
