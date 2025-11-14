import type { Lead, LeadStage } from "../../../types";
import { LeadCard } from "./LeadCard";

interface StageColumnProps {
  stage: { value: LeadStage; label: string; color: string };
  leads: Lead[];
  onDrop: (e: React.DragEvent, stage: LeadStage) => void;
  onDragOver: (e: React.DragEvent) => void;
  onLeadClick: (lead: Lead) => void;
  onDragStart: (e: React.DragEvent, lead: Lead) => void;
}

export const StageColumn: React.FC<StageColumnProps> = ({
  stage,
  leads,
  onDrop,
  onDragOver,
  onLeadClick,
  onDragStart,
}) => {
  const totalValue = leads.reduce(
    (sum, lead) => sum + (Number(lead.dealValue) || 0),
    0
  );

  return (
    <div className="flex-shrink-0 w-80">
      <div className="bg-gray-50 rounded-2xl p-4 h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${stage.color}`} />
            <h3 className="font-bold text-gray-900">{stage.label}</h3>
            <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs font-semibold">
              {leads.length}
            </span>
          </div>
        </div>

        {totalValue > 0 && (
          <div className="mb-4 p-3 bg-white rounded-xl">
            <div className="text-xs text-gray-600 mb-1">Total Value</div>
            <div className="text-lg font-bold text-gray-900">
              ${totalValue.toLocaleString()}
            </div>
          </div>
        )}

        <div
          onDrop={(e) => onDrop(e, stage.value)}
          onDragOver={onDragOver}
          className="space-y-3 min-h-[500px]"
        >
          {leads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onDragStart={onDragStart}
              onClick={() => onLeadClick(lead)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
