import { Calendar, Mail, Phone, TrendingUp } from "lucide-react";
import type { Lead } from "../../../types";

interface LeadCardProps {
  lead: Lead;
  onDragStart: (e: React.DragEvent, lead: Lead) => void;
  onClick: () => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  onDragStart,
  onClick,
}) => {
  const getPriorityColor = (priority: string): string => {
    const colors: Record<string, string> = {
      LOW: "bg-gray-100 text-gray-700",
      MEDIUM: "bg-blue-100 text-blue-700",
      HIGH: "bg-orange-100 text-orange-700",
      URGENT: "bg-red-100 text-red-700",
    };
    return colors[priority] || "bg-gray-100 text-gray-700";
  };

  const formatDate = (date: string | Date): string => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, lead)}
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl p-4 mb-3 cursor-move hover:shadow-lg transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">
            {lead.firstName} {lead.lastName}
          </h4>
          {lead.city && <p className="text-xs text-gray-600">{lead.city}</p>}
        </div>
        <span
          className={`px-2 py-1 rounded-lg text-xs font-semibold ${getPriorityColor(
            lead.priority
          )}`}
        >
          {lead.priority}
        </span>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="truncate">{lead.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span>{lead.phone}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <span className="font-semibold">{lead.score}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(lead.createdAt)}
        </div>
      </div>

      {lead.requirements && (
        <p className="text-xs text-gray-600 mt-3 line-clamp-2">
          {lead.requirements}
        </p>
      )}
    </div>
  );
};
