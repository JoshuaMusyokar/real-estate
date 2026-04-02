import { useState } from "react";
import { Loader2, Users } from "lucide-react";
import {
  useGetAgentsForAssignmentQuery,
  useGetTopAgentsQuery,
} from "../../services/agentApi";
import type { AgentsFilter } from "../../types";
import { AgentsHeader } from "./components/AgentHeader";
import { AgentsFilters } from "./components/AgentFilters";
import { TopPerformersBanner } from "./components/TopPerformersBanner";
import { AgentCard } from "./components/AgentCard";
import { AgentListRow } from "./components/AgentListRow";
import { usePermissions } from "../../hooks/usePermissions";

export const Agents: React.FC = () => {
  const [filters, setFilters] = useState<AgentsFilter>({
    includePerformance: true,
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { can } = usePermissions();
  const canView = can("agent.view");

  const { data: agentsData, isLoading } =
    useGetAgentsForAssignmentQuery(filters);
  const { data: topData } = useGetTopAgentsQuery({ limit: 3 });

  const agents = agentsData?.data || [];
  const topAgents = topData?.data || [];

  const patchFilters = (patch: Partial<AgentsFilter>) =>
    setFilters((f) => ({ ...f, ...patch }));

  return (
    <div className="max-w-full mx-auto">
      <AgentsHeader agents={agents} />
      <TopPerformersBanner agents={topAgents} />
      <AgentsFilters
        filters={filters}
        setFilters={patchFilters}
        viewMode={viewMode}
        onViewMode={setViewMode}
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Loading agents…
          </p>
        </div>
      ) : agents.length === 0 ? (
        <div className="text-center py-14 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl">
          <Users className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
            No agents found
          </h3>
          <p className="text-xs text-gray-500">Try adjusting your filters</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {agents.map((a) => (
            <AgentCard key={a.id} agent={a} canView={canView} />
          ))}
        </div>
      ) : (
        <div className="space-y-2.5 sm:space-y-3">
          {agents.map((a) => (
            <AgentListRow key={a.id} agent={a} canView={canView} />
          ))}
        </div>
      )}
    </div>
  );
};
