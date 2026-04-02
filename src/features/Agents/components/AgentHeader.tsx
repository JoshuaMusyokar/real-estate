import { Users, UserCheck, TrendingUp, Award } from "lucide-react";
import type { AgentForAssignment } from "../../../types";

interface Props {
  agents: AgentForAssignment[];
}

export const AgentsHeader: React.FC<Props> = ({ agents }) => {
  const avgConv = agents.length
    ? Math.round(
        (agents.reduce((s, a) => s + a.conversionRate, 0) / agents.length) *
          100,
      )
    : 0;

  const stats = [
    {
      icon: Users,
      value: agents.length,
      label: "Total",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: UserCheck,
      value: agents.filter((a) => a.currentWorkload === "low").length,
      label: "Available",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      icon: TrendingUp,
      value: `${avgConv}%`,
      label: "Avg Conv.",
      color: "from-amber-500 to-amber-600",
    },
    {
      icon: Award,
      value: agents.reduce((s, a) => s + a.totalLeadsClosed, 0),
      label: "Closed",
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <div className="mb-4 sm:mb-5">
      <div className="mb-3 sm:mb-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
          Agent Network
        </h1>
        <p className="text-[11px] sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Connect with top-performing real estate professionals
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {stats.map(({ icon: Icon, value, label, color }) => (
          <div
            key={label}
            className={`bg-gradient-to-br ${color} rounded-xl p-3 sm:p-4 text-white`}
          >
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 mb-1.5 opacity-80" />
            <p className="text-lg sm:text-2xl font-black leading-none mb-0.5">
              {value}
            </p>
            <p className="text-[10px] sm:text-xs text-white/80">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
