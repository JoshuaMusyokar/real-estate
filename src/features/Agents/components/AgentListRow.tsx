import { MapPin, Mail, Phone, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { AgentForAssignment } from "../../../types";
import {
  workloadColor,
  statusColor,
  roleColor,
  roleLabel,
  performanceScore,
  agentInitials,
} from "../../../utils/agent-utils";

interface Props {
  agent: AgentForAssignment;
  canView: boolean;
}

export const AgentListRow: React.FC<Props> = ({ agent, canView }) => {
  const navigate = useNavigate();
  const score = performanceScore(agent);
  const initials = agentInitials(agent);
  const roleName = agent.role?.name;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-3 sm:p-4 hover:shadow-md transition-all">
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          {/* Name + badges */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white truncate">
                {agent.firstName} {agent.lastName}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                {roleName && (
                  <span
                    className={`px-1.5 py-0.5 rounded border text-[9px] font-bold ${roleColor(roleName)}`}
                  >
                    {roleLabel(roleName)}
                  </span>
                )}
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold border ${workloadColor(agent.currentWorkload)}`}
                >
                  {agent.currentWorkload}
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${statusColor(agent.status)}`}
                >
                  {agent.status === "ACTIVE" ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            {canView && (
              <button
                onClick={() => navigate(`/crm/agents/${agent.id}`)}
                className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] sm:text-xs font-bold transition-colors"
              >
                <Eye className="w-3 h-3" />
                <span className="hidden sm:inline">View Details</span>
              </button>
            )}
          </div>

          {/* Contact */}
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 mb-2">
            <span className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
              <Mail className="w-2.5 h-2.5 text-blue-400" />
              <span className="truncate max-w-[160px]">{agent.email}</span>
            </span>
            {agent.phone && (
              <span className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                <Phone className="w-2.5 h-2.5 text-green-400" /> {agent.phone}
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {[
              { label: "Active", value: agent.activeLeadsCount },
              { label: "Closed", value: agent.totalLeadsClosed },
              {
                label: "Conv.",
                value: `${(agent.conversionRate * 100).toFixed(0)}%`,
                color: "text-emerald-600",
              },
              { label: "Props", value: agent.ownedPropertiesCount },
              { label: "Score", value: score, color: "text-blue-600" },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="flex items-center gap-1 px-2 py-1 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <span className="text-[9px] text-gray-400">{label}</span>
                <span
                  className={`text-[10px] font-black ${color ?? "text-gray-900 dark:text-white"}`}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Cities */}
          {agent.cities.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <MapPin className="w-2.5 h-2.5 text-gray-400 flex-shrink-0" />
              {agent.cities.slice(0, 4).map((c) => (
                <span
                  key={c.id}
                  className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded text-[10px] font-medium border border-blue-100 dark:border-blue-800"
                >
                  {c.name}
                </span>
              ))}
              {agent.cities.length > 4 && (
                <span className="text-[10px] text-gray-400">
                  +{agent.cities.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
