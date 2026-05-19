import { useState } from "react";
import { UserPlus, Loader2, ChevronDown, Filter } from "lucide-react";
import type { RecipientFilter } from "../../types/messaging-management";

interface Props {
  campaignId: string;
  isLoading: boolean;
  onAdd: (filter: RecipientFilter) => void;
}

const STAGES = [
  "NEW_LEAD",
  "CONTACTED",
  "QUALIFIED",
  "VIEWING_SCHEDULED",
  "NEGOTIATION",
  "DEAL_CLOSED_WON",
  "DEAL_CLOSED_LOST",
];

const SOURCES = [
  "WEBSITE_INQUIRY",
  "PHONE_CALL",
  "WALK_IN",
  "REFERRAL",
  "IMPORT",
  "SOCIAL_MEDIA",
  "MANUAL_ENTRY",
];

const sel =
  "w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 outline-none appearance-none";
const inp = sel.replace("appearance-none", "");

export const RecipientFiltersPanel: React.FC<Props> = ({
  isLoading,
  onAdd,
}) => {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState("");
  const [source, setSource] = useState("");
  const [minScore, setMinScore] = useState("");
  const [tags, setTags] = useState("");

  const handleAdd = () => {
    const filter: RecipientFilter = {
      stage: stage || undefined,
      source: source || undefined,
      minScore: minScore ? parseInt(minScore) : undefined,
      tags: tags
        ? tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : undefined,
    };
    onAdd(filter);
    // Reset
    setStage("");
    setSource("");
    setMinScore("");
    setTags("");
    setOpen(false);
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
      {/* Header toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
            Add Recipients by Filter
          </span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="p-4 bg-white dark:bg-gray-900 space-y-3">
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Filter leads from the CRM to add as recipients. Leave fields empty
            to include all active leads.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Stage */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                Lead Stage
              </label>
              <div className="relative">
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className={sel}
                >
                  <option value="">All stages</option>
                  {STAGES.map((s) => (
                    <option key={s} value={s}>
                      {s
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Source */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                Lead Source
              </label>
              <div className="relative">
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className={sel}
                >
                  <option value="">All sources</option>
                  {SOURCES.map((s) => (
                    <option key={s} value={s}>
                      {s
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Min score */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                Min Lead Score
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={minScore}
                onChange={(e) => setMinScore(e.target.value)}
                placeholder="e.g. 50"
                className={inp}
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. hot-lead, vip"
                className={inp}
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={handleAdd}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Adding…
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" /> Add Matching Leads
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
