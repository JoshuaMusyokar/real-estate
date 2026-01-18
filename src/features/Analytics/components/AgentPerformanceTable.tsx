import { UserIcon, TrendingUpIcon } from "lucide-react";
import type { AgentPerformance } from "../../../types";

interface AgentPerformanceTableProps {
  data: AgentPerformance[];
  sortBy: keyof AgentPerformance;
}

export default function AgentPerformanceTable({
  data,
  sortBy,
}: AgentPerformanceTableProps) {
  const sortedData = [...data].sort((a, b) => {
    return (b[sortBy] as number) - (a[sortBy] as number);
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="py-3 text-left text-sm font-medium text-gray-500">
              Rank
            </th>
            <th className="py-3 text-left text-sm font-medium text-gray-500">
              Agent
            </th>
            <th className="py-3 text-left text-sm font-medium text-gray-500">
              Leads
            </th>
            <th className="py-3 text-left text-sm font-medium text-gray-500">
              Converted
            </th>
            <th className="py-3 text-left text-sm font-medium text-gray-500">
              Conversion
            </th>
            <th className="py-3 text-left text-sm font-medium text-gray-500">
              Revenue
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((agent, index) => (
            <tr
              key={agent.agentId}
              className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <td className="py-3">
                <div
                  className={`flex items-center justify-center w-6 h-6 rounded-full ${
                    index === 0
                      ? "bg-yellow-100 text-yellow-800"
                      : index === 1
                        ? "bg-gray-100 text-gray-800"
                        : index === 2
                          ? "bg-orange-100 text-orange-800"
                          : "bg-gray-50 text-gray-600"
                  }`}
                >
                  <span className="text-sm font-medium">#{index + 1}</span>
                </div>
              </td>
              <td className="py-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700">
                    <UserIcon className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {agent.agentName}
                    </p>
                  </div>
                </div>
              </td>
              <td className="py-3">
                <span className="font-medium">
                  {agent.leadsAssigned.toLocaleString()}
                </span>
              </td>
              <td className="py-3">
                <span className="font-medium">
                  {agent.leadsConverted.toLocaleString()}
                </span>
              </td>
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <TrendingUpIcon className="w-4 h-4 text-green-600" />
                  <span className="font-medium">
                    {agent.conversionRate.toFixed(1)}%
                  </span>
                </div>
              </td>
              <td className="py-3">
                <span className="font-medium">
                  ${agent.revenue.toLocaleString()}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
