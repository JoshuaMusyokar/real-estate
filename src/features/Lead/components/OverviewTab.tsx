import { Edit, Mail, MapPin, Phone, Tag, TrendingUp } from "lucide-react";
import {
  getPriorityColor,
  getStageColor,
  LEAD_PRIORITIES,
  LEAD_STAGES,
} from "../../../utils";
import type {
  Lead,
  LeadPriority,
  LeadResponse,
  LeadStage,
} from "../../../types";
import { useState } from "react";

interface OverviewTabProps {
  lead: LeadResponse;
  onUpdate: (data: Partial<Lead>) => Promise<void>;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ lead, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    stage: lead.stage,
    priority: lead.priority,
  });

  const handleSave = async (): Promise<void> => {
    await onUpdate(editData);
    setIsEditing(false);
  };

  const formatDate = (date: string | Date): string => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Lead Status</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Stage
                </label>
                <select
                  value={editData.stage}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      stage: e.target.value as LeadStage,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {LEAD_STAGES.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={editData.priority}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      priority: e.target.value as LeadPriority,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {LEAD_PRIORITIES.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-2">Stage</div>
                <span
                  className={`inline-flex px-4 py-2 rounded-xl text-sm font-semibold ${getStageColor(
                    lead.stage
                  )}`}
                >
                  {lead.stage.replace(/_/g, " ")}
                </span>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-2">Priority</div>
                <span
                  className={`inline-flex px-4 py-2 rounded-xl text-sm font-semibold ${getPriorityColor(
                    lead.priority
                  )}`}
                >
                  {lead.priority}
                </span>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-2">Lead Score</div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span className="text-2xl font-bold text-gray-900">
                    {lead.score}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Contact Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-600">Email</div>
                <a
                  href={`mailto:${lead.email}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  {lead.email}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-600">Phone</div>
                <a
                  href={`tel:${lead.phone}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  {lead.phone}
                </a>
              </div>
            </div>
            {lead.alternatePhone && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600">Alternate Phone</div>
                  <a
                    href={`tel:${lead.alternatePhone}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {lead.alternatePhone}
                  </a>
                </div>
              </div>
            )}
            {lead.city && (
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600">Location</div>
                  <div className="font-medium text-gray-900">{lead.city}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Requirements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {lead.propertyType && (
            <div>
              <div className="text-sm text-gray-600 mb-1">Property Type</div>
              <div className="font-semibold text-gray-900">
                {lead.propertyType.name}
              </div>
            </div>
          )}
          {lead.purpose && (
            <div>
              <div className="text-sm text-gray-600 mb-1">Purpose</div>
              <div className="font-semibold text-gray-900">{lead.purpose}</div>
            </div>
          )}
          {lead.bedrooms && (
            <div>
              <div className="text-sm text-gray-600 mb-1">Bedrooms</div>
              <div className="font-semibold text-gray-900">{lead.bedrooms}</div>
            </div>
          )}
          {lead.minPrice && (
            <div>
              <div className="text-sm text-gray-600 mb-1">Min Price</div>
              <div className="font-semibold text-gray-900">
                ${Number(lead.minPrice).toLocaleString()}
              </div>
            </div>
          )}
          {lead.maxPrice && (
            <div>
              <div className="text-sm text-gray-600 mb-1">Max Price</div>
              <div className="font-semibold text-gray-900">
                ${Number(lead.maxPrice).toLocaleString()}
              </div>
            </div>
          )}
        </div>
        {lead.requirements && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600 mb-2">Additional Notes</div>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {lead.requirements}
            </p>
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">
          Lead Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-600 mb-1">Source</div>
            <div className="font-semibold text-gray-900">
              {lead.source.replace(/_/g, " ")}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Created At</div>
            <div className="font-semibold text-gray-900">
              {formatDate(lead.createdAt)}
            </div>
          </div>
          {lead.tags && lead.tags.length > 0 && (
            <div className="md:col-span-2">
              <div className="text-sm text-gray-600 mb-2">Tags</div>
              <div className="flex flex-wrap gap-2">
                {lead.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium flex items-center gap-2"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
