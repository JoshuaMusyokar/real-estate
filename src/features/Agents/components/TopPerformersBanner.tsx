import { Award, Star } from "lucide-react";
import type { AgentForAssignment } from "../../../types";

interface Props {
  agents: AgentForAssignment[];
}

export const TopPerformersBanner: React.FC<Props> = ({ agents }) => {
  if (!agents.length) return null;
  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 rounded-2xl p-4 sm:p-5 mb-4 sm:mb-5 shadow-lg">
      <div className="flex items-center gap-2 mb-3">
        <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
        <h2 className="text-sm sm:text-base font-black text-white">
          Top Performers This Month
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {agents.map((agent, idx) => (
          <div
            key={agent.id}
            className="bg-white/20 backdrop-blur-sm rounded-xl p-3 flex items-center gap-2.5"
          >
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/30 flex items-center justify-center text-white font-black text-xs sm:text-sm">
                {agent.firstName[0]}
                {agent.lastName?.[0] ?? ""}
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full flex items-center justify-center text-amber-600 font-black text-[9px] sm:text-[10px]">
                {idx + 1}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-bold text-white truncate">
                {agent.firstName} {agent.lastName}
              </p>
              <p className="text-[10px] sm:text-xs text-amber-100">
                {(agent.conversionRate * 100).toFixed(0)}% conv.
              </p>
            </div>
            <Star className="w-3.5 h-3.5 text-white fill-white flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};
