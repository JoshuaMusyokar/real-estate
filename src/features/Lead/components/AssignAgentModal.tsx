import {
  AlertCircle,
  CheckCircle,
  Loader2,
  User,
  X,
  Search,
  Users,
} from "lucide-react";
import type { AgentForAssignment, LeadResponse } from "../../../types";
import { useAssignLeadMutation } from "../../../services/leadApi";
import { useEffect, useState } from "react";
import { useGetAgentsForAssignmentQuery } from "../../../services/agentApi";
import { useToast } from "../../../hooks/useToast";

interface AssignLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: LeadResponse;
  onSuccess: () => void;
}

const workloadColor = (w: string) =>
  ({
    low: "bg-green-100 text-green-700 border-green-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    high: "bg-red-100 text-red-700 border-red-200",
  })[w] ?? "bg-gray-100 text-gray-600 border-gray-200";

// Role display helpers
const roleLabel = (roleName?: string) =>
  ({
    AGENT: "Agent",
    AGENT_STAFF: "Agent Staff",
    BUILDER: "Builder",
    BUILDER_STAFF: "Builder Staff",
    SALES_MANAGER: "Sales Mgr",
    SALES_AGENT: "Sales Agent",
  })[roleName ?? ""] ??
  roleName ??
  "";

const roleColor = (roleName?: string) =>
  ({
    AGENT: "bg-blue-50 text-blue-700 border-blue-200",
    AGENT_STAFF: "bg-indigo-50 text-indigo-700 border-indigo-200",
    BUILDER: "bg-amber-50 text-amber-700 border-amber-200",
    BUILDER_STAFF: "bg-orange-50 text-orange-700 border-orange-200",
    SALES_MANAGER: "bg-purple-50 text-purple-700 border-purple-200",
    SALES_AGENT: "bg-violet-50 text-violet-700 border-violet-200",
  })[roleName ?? ""] ?? "bg-gray-50 text-gray-600 border-gray-200";

// Group agents by managerId for entity-tree display
function groupByEntity(
  agents: AgentForAssignment[],
): Map<string | undefined, AgentForAssignment[]> {
  const map = new Map<string | undefined, AgentForAssignment[]>();
  for (const a of agents) {
    const key = a.managerId as string | undefined;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(a);
  }
  return map;
}

// ─────────────────────────────────────────────────────────────────────────────
export const AssignLeadModal: React.FC<AssignLeadModalProps> = ({
  isOpen,
  onClose,
  lead,
  onSuccess,
}) => {
  const [assignLead, { isLoading: isAssigning }] = useAssignLeadMutation();
  const [agentsData, setAgentsData] = useState<AgentForAssignment[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const { success, error: showError } = useToast();

  // ── Query — now passes leadCityId for SUPER_ADMIN city scoping ────────────
  const { data, isLoading } = useGetAgentsForAssignmentQuery({
    city: lead.city?.name,
    leadCityId: lead.city?.id,
    propertyTypeId: lead.propertyType?.id,
    search: searchTerm || undefined,
  });

  useEffect(() => {
    if (isOpen) {
      setSelectedId(lead.assignedToId || "");
      setSearchTerm("");
      setError("");
    }
  }, [isOpen, lead]);

  useEffect(() => {
    if (data?.data && Array.isArray(data.data)) setAgentsData(data.data);
  }, [data]);

  const handleAssign = async () => {
    if (!selectedId) {
      setError("Please select an agent");
      return;
    }
    try {
      await assignLead({ id: lead.id, agentId: selectedId }).unwrap();
      onSuccess();
      onClose();
      success("Success", "Lead assigned successfully");
    } catch {
      showError("Failed", "Failed to assign lead. Please try again.");
    }
  };

  // Group agents by entity tree (managerId) — useful for SUPER_ADMIN
  const grouped = groupByEntity(agentsData);
  const isGrouped = grouped.size > 1; // only show grouping when >1 entity present

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl max-h-[92vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 sm:px-5 sm:py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div>
            <h2 className="text-sm sm:text-base font-black text-gray-900 dark:text-white">
              Assign Lead
            </h2>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
              {lead.firstName} {lead.lastName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-5 space-y-3">
          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-red-700 dark:text-red-300">
                {error}
              </span>
            </div>
          )}

          {/* Current assignment */}
          {lead.assignedTo && (
            <div className="p-2.5 sm:p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl">
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wide mb-0.5">
                Currently assigned to
              </p>
              <p className="text-xs sm:text-sm font-semibold text-blue-800 dark:text-blue-300">
                {lead.assignedTo.firstName} {lead.assignedTo.lastName}
                <span className="font-normal text-blue-500 ml-1">
                  · {lead.assignedTo.email}
                </span>
              </p>
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email…"
              className="w-full pl-9 pr-4 py-2 sm:py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white dark:bg-gray-900 dark:text-white"
            />
          </div>

          {/* Agent list */}
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
            </div>
          ) : agentsData.length === 0 ? (
            <div className="text-center py-10">
              <User className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                No agents found
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Try adjusting your search
              </p>
            </div>
          ) : isGrouped ? (
            /* ── Grouped view (SUPER_ADMIN — multiple entities) ──────── */
            <div className="space-y-4">
              {Array.from(grouped.entries()).map(([managerId, group]) => {
                // Find the manager name from the group if any agent has managerId matching another agent
                const managerAgent = agentsData.find((a) => a.id === managerId);
                const groupLabel = managerAgent
                  ? `${managerAgent.firstName} ${managerAgent.lastName}'s Team`
                  : managerId
                    ? "Team"
                    : "Independent Agents";
                return (
                  <div key={managerId ?? "independent"}>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Users className="w-3 h-3 text-gray-400" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                        {groupLabel}
                      </span>
                      <span className="text-[10px] text-gray-300 font-medium">
                        · {group.length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {group.map((agent) => (
                        <AgentCard
                          key={agent.id}
                          agent={agent}
                          active={selectedId === agent.id}
                          onSelect={() => setSelectedId(agent.id)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ── Flat list (single entity / scoped role) ──────────── */
            <div className="space-y-2 sm:space-y-2.5">
              {agentsData.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  active={selectedId === agent.id}
                  onSelect={() => setSelectedId(agent.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2.5 px-4 py-3.5 sm:px-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 sm:py-2.5 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={isAssigning || !selectedId}
            className="flex-1 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            {isAssigning ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Assigning…
              </>
            ) : (
              <>
                <CheckCircle className="w-3.5 h-3.5" /> Assign Agent
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Agent card sub-component ──────────────────────────────────────────────────
const AgentCard: React.FC<{
  agent: AgentForAssignment;
  active: boolean;
  onSelect: () => void;
}> = ({ agent, active, onSelect }) => {
  const initials = `${agent.firstName[0]}${agent.lastName[0]}`.toUpperCase();
  const roleName = (agent as any).role?.name as string | undefined;

  return (
    <div
      onClick={onSelect}
      className={`p-3 sm:p-3.5 border rounded-xl cursor-pointer transition-all
        ${
          active
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700/40"
        }`}
    >
      {/* Top row: avatar + name + role + workload */}
      <div className="flex items-center gap-2.5 mb-2">
        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0
          ${active ? "bg-blue-600" : "bg-gray-400 dark:bg-gray-600"}`}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
              {agent.firstName} {agent.lastName}
            </p>
            {/* Role badge — shows entity context */}
            {roleName && (
              <span
                className={`px-1.5 py-0.5 rounded border text-[9px] font-bold flex-shrink-0 ${roleColor(roleName)}`}
              >
                {roleLabel(roleName)}
              </span>
            )}
          </div>
          <p className="text-[10px] sm:text-xs text-gray-400 truncate">
            {agent.email}
          </p>
          {agent.phone && (
            <p className="text-[10px] text-gray-400">{agent.phone}</p>
          )}
        </div>
        <span
          className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold border ${workloadColor(agent.currentWorkload)}`}
        >
          {agent.currentWorkload}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-1.5 mb-2">
        {[
          { label: "Active", value: agent.activeLeadsCount },
          { label: "Closed", value: agent.totalLeadsClosed },
          {
            label: "Conv.",
            value: `${(agent.conversionRate * 100).toFixed(0)}%`,
          },
          { label: "Props", value: agent.ownedPropertiesCount },
        ].map(({ label, value }) => (
          <div
            key={label}
            className={`text-center py-1.5 rounded-lg ${active ? "bg-blue-100/60 dark:bg-blue-800/30" : "bg-gray-50 dark:bg-gray-700/40"}`}
          >
            <p className="text-[10px] font-black text-gray-900 dark:text-white">
              {value}
            </p>
            <p className="text-[9px] text-gray-400 leading-tight">{label}</p>
          </div>
        ))}
      </div>

      {/* Cities */}
      {agent.cities.length > 0 && (
        <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide mb-1">
            Cities
          </p>
          <div className="flex flex-wrap gap-1">
            {agent.cities.slice(0, 4).map((city) => (
              <span
                key={city.id}
                className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-[10px] font-medium"
              >
                {city.name}
              </span>
            ))}
            {agent.cities.length > 4 && (
              <span className="px-1.5 py-0.5 text-[10px] text-gray-400 font-medium">
                +{agent.cities.length - 4}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
