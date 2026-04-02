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

export const AgentCard: React.FC<Props> = ({ agent, canView }) => {
  const navigate = useNavigate();
  const score = performanceScore(agent);
  const initials = agentInitials(agent);
  const roleName = agent.role?.name;

  return (
    <div className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
      {/* Colour banner */}
      <div className="h-16 sm:h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative">
        <div className="absolute -bottom-7 sm:-bottom-8 left-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white dark:bg-gray-900 border-2 border-white dark:border-gray-800 flex items-center justify-center text-base sm:text-xl font-black text-gray-700 dark:text-gray-200 shadow-lg">
            {initials}
          </div>
        </div>
        <div className="absolute top-2.5 right-2.5 flex gap-1.5">
          <span
            className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold border ${statusColor(agent.status)}`}
          >
            {agent.status === "ACTIVE" ? "Active" : "Inactive"}
          </span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold border ${workloadColor(agent.currentWorkload)}`}
          >
            {agent.currentWorkload}
          </span>
        </div>
      </div>

      <div className="pt-9 sm:pt-10 px-3.5 sm:px-4 pb-4">
        {/* Name + role */}
        <div className="mb-3">
          <h3 className="text-sm sm:text-base font-black text-gray-900 dark:text-white truncate">
            {agent.firstName} {agent.lastName}
          </h3>
          {roleName && (
            <span
              className={`inline-flex px-1.5 py-0.5 rounded border text-[9px] font-bold mt-0.5 ${roleColor(roleName)}`}
            >
              {roleLabel(roleName)}
            </span>
          )}
        </div>

        {/* Contact */}
        <div className="space-y-1 mb-3">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
            <Mail className="w-3 h-3 text-blue-400 flex-shrink-0" />
            <span className="truncate">{agent.email}</span>
          </div>
          {agent.phone && (
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
              <Phone className="w-3 h-3 text-green-400 flex-shrink-0" />
              {agent.phone}
            </div>
          )}
        </div>

        {/* Performance bar */}
        <div className="mb-3 p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">
              Performance
            </span>
            <span className="text-xs font-black text-blue-600 dark:text-blue-400">
              {score}/100
            </span>
          </div>
          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-1.5 mb-3">
          {[
            { label: "Active", value: agent.activeLeadsCount },
            { label: "Closed", value: agent.totalLeadsClosed },
            {
              label: "Conv.",
              value: `${(agent.conversionRate * 100).toFixed(0)}%`,
              color: "text-emerald-600 dark:text-emerald-400",
            },
            { label: "Props", value: agent.ownedPropertiesCount },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl"
            >
              <p className="text-[9px] text-gray-500 dark:text-gray-400 mb-0.5">
                {label}
              </p>
              <p
                className={`text-sm font-black ${color ?? "text-gray-900 dark:text-white"}`}
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Cities */}
        {agent.cities.length > 0 && (
          <div className="mb-3">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5" /> Areas
            </p>
            <div className="flex flex-wrap gap-1">
              {agent.cities.slice(0, 3).map((c) => (
                <span
                  key={c.id}
                  className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded text-[10px] font-medium border border-blue-100 dark:border-blue-800"
                >
                  {c.name}
                </span>
              ))}
              {agent.cities.length > 3 && (
                <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded text-[10px] font-medium">
                  +{agent.cities.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* CTA */}
        {canView ? (
          <button
            onClick={() => navigate(`/crm/agents/${agent.id}`)}
            className="w-full py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" /> View Details
          </button>
        ) : (
          <div className="w-full py-2 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-xl text-xs text-center select-none">
            No access
          </div>
        )}
      </div>
    </div>
  );
};
