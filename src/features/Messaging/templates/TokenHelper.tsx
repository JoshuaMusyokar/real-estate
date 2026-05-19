import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { TokenBadge } from "./TokenBadge";
import { useGetAvailableTokensQuery } from "../../../services/messagingManagementApi";
import type { AvailableTokens } from "../../../types/messaging-management";

const GROUP_LABEL: Record<keyof AvailableTokens, string> = {
  lead: "Lead",
  property: "Property",
  appointment: "Appointment",
  agent: "Agent",
  company: "Company",
};

export const TokenHelper: React.FC<{ onInsert?: (token: string) => void }> = ({
  onInsert,
}) => {
  const [open, setOpen] = useState(true);
  const { data } = useGetAvailableTokensQuery();
  const tokens = data?.data;
  if (!tokens) return null;
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="text-[11px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
          Available Tokens
        </span>
        {open ? (
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        )}
      </button>
      {open && (
        <div className="p-3 space-y-3 bg-white dark:bg-gray-900">
          {(Object.entries(tokens) as [keyof AvailableTokens, string[]][]).map(
            ([group, vars]) => (
              <div key={group}>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  {GROUP_LABEL[group]}
                </p>
                <div className="flex flex-wrap gap-1">
                  {vars.map((t) => (
                    <TokenBadge
                      key={t}
                      token={t}
                      onClick={
                        onInsert ? () => onInsert(`{{${t}}}`) : undefined
                      }
                    />
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
};
