import React from "react";
import {
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  MapPin,
  DollarSign,
  Clock,
  AlertCircle,
} from "lucide-react";
import type { LeadResponse } from "../../../types";

interface KanbanLeadCardProps {
  lead: LeadResponse;
}

const getPriorityStyle = (priority: string): string => {
  const styles: Record<string, string> = {
    LOW: "bg-gray-100 text-gray-700 border-gray-200",
    MEDIUM: "bg-blue-100 text-blue-700 border-blue-200",
    HIGH: "bg-orange-100 text-orange-700 border-orange-200",
    URGENT: "bg-red-100 text-red-700 border-red-200",
  };
  return styles[priority] || styles.MEDIUM;
};

const getPriorityIcon = (priority: string) => {
  if (priority === "URGENT") return AlertCircle;
  if (priority === "HIGH") return TrendingUp;
  return Clock;
};

export const KanbanLeadCard: React.FC<KanbanLeadCardProps> = ({ lead }) => {
  const PriorityIcon = getPriorityIcon(lead.priority);

  const formatDate = (date: string | Date): string => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;

    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 cursor-move hover:shadow-lg hover:border-blue-300 transition-all group active:cursor-grabbing active:scale-95">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-900 mb-1 truncate group-hover:text-blue-600 transition-colors">
            {lead.firstName} {lead.lastName}
          </h4>
          {lead.city && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
              <span className="truncate">{lead.city}</span>
            </div>
          )}
        </div>
        <div
          className={`px-2 py-1 rounded-lg text-xs font-bold border flex items-center gap-1 flex-shrink-0 ${getPriorityStyle(
            lead.priority
          )}`}
        >
          <PriorityIcon className="w-3 h-3" />
          {lead.priority}
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-xs text-gray-700">
          <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="truncate">{lead.email}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-700">
          <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span>{lead.phone}</span>
        </div>
      </div>

      {/* Deal Value */}
      {lead.dealValue && Number(lead.dealValue) > 0 && (
        <div className="mb-3 p-2.5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-3.5 h-3.5 text-green-600" />
              </div>
              <span className="text-xs text-gray-600 font-medium">
                Deal Value
              </span>
            </div>
            <span className="text-sm font-bold text-green-700">
              ${Number(lead.dealValue).toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Requirements Preview */}
      {lead.requirements && (
        <div className="mb-3 p-2.5 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {lead.requirements}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-semibold text-gray-900">{lead.score}</span>
          </div>
          {lead.tags && lead.tags.length > 0 && (
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
              <span className="text-xs text-gray-500 font-medium">
                {lead.tags.length} tag{lead.tags.length > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(lead.createdAt)}</span>
        </div>
      </div>

      {/* Property Type Badge */}
      {lead.propertyType && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
            {lead.propertyType}
            {lead.purpose && (
              <>
                <span className="mx-1.5 text-blue-400">•</span>
                {lead.purpose}
              </>
            )}
          </span>
        </div>
      )}

      {/* Hover Indicator */}
      <div className="absolute inset-0 border-2 border-blue-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
    </div>
  );
};
