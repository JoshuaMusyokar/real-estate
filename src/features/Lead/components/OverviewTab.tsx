import {
  Edit,
  Mail,
  MapPin,
  Phone,
  Tag,
  TrendingUp,
  User,
  Calendar,
  Clock,
  Building2,
  Home,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  ExternalLink,
  Target,
} from "lucide-react";
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
import { usePermissions } from "../../../hooks/usePermissions";

interface OverviewTabProps {
  lead: LeadResponse;
  onUpdate: (data: Partial<Lead>) => Promise<void>;
}

const fmt = (d: string | Date | null | undefined) => {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const InfoRow: React.FC<{
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  accent?: string;
}> = ({ icon: Icon, label, value, accent = "text-blue-400" }) => (
  <div className="flex items-start gap-2 py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
    <div className="w-6 h-6 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon className={`w-3.5 h-3.5 ${accent}`} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">
        {label}
      </p>
      <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
        {value}
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
export const OverviewTab: React.FC<OverviewTabProps> = ({ lead, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    stage: lead.stage,
    priority: lead.priority,
    nextFollowUpAt: lead.nextFollowUpAt
      ? new Date(lead.nextFollowUpAt).toISOString().slice(0, 16)
      : "",
    lostReason: lead.lostReason || "",
    dealValue: lead.dealValue ?? "",
    requirements: lead.requirements || "",
  });

  const { can } = usePermissions();
  const canEdit = can("lead.edit");

  const handleSave = async () => {
    await onUpdate({
      stage: editData.stage,
      priority: editData.priority,
      nextFollowUpAt: editData.nextFollowUpAt
        ? new Date(editData.nextFollowUpAt)
        : undefined,
      lostReason: editData.lostReason || undefined,
      dealValue:
        editData.dealValue !== "" ? Number(editData.dealValue) : undefined,
      requirements: editData.requirements || undefined,
    });
    setIsEditing(false);
  };

  const inr = (n?: number | null) =>
    n != null
      ? new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }).format(n)
      : null;

  const isClosed =
    lead.stage === "DEAL_CLOSED_WON" || lead.stage === "DEAL_CLOSED_LOST";

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* ── 2-col grid: status + contact ──────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Lead Status */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-3 sm:p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm sm:text-base font-black text-gray-900 dark:text-white">
              Lead Status
            </h3>
            {canEdit && (
              <button
                onClick={() => setIsEditing((v) => !v)}
                className={`p-1.5 rounded-lg transition-colors ${isEditing ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"}`}
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {canEdit && isEditing ? (
            <div className="space-y-3">
              {/* Stage */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">
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
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:text-white"
                >
                  {LEAD_STAGES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
              {/* Priority */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">
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
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:text-white"
                >
                  {LEAD_PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              {/* Next follow-up */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                  Next Follow-up
                </label>
                <input
                  type="datetime-local"
                  value={editData.nextFollowUpAt}
                  onChange={(e) =>
                    setEditData({ ...editData, nextFollowUpAt: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:text-white"
                />
              </div>
              {/* Deal value — shown for closed stages */}
              {isClosed && (
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                    Deal Value (₹)
                  </label>
                  <input
                    type="number"
                    value={editData.dealValue}
                    onChange={(e) =>
                      setEditData({ ...editData, dealValue: e.target.value })
                    }
                    placeholder="e.g. 5000000"
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:text-white"
                  />
                </div>
              )}
              {/* Lost reason */}
              {lead.stage === "DEAL_CLOSED_LOST" && (
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                    Lost Reason
                  </label>
                  <textarea
                    rows={2}
                    value={editData.lostReason}
                    onChange={(e) =>
                      setEditData({ ...editData, lostReason: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none dark:bg-gray-800 dark:text-white"
                  />
                </div>
              )}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleSave}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2 border border-gray-200 dark:border-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <InfoRow
                icon={Target}
                label="Stage"
                accent="text-indigo-400"
                value={
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-xl text-xs font-bold ${getStageColor(lead.stage)}`}
                  >
                    {lead.stage.replace(/_/g, " ")}
                  </span>
                }
              />
              <InfoRow
                icon={AlertCircle}
                label="Priority"
                accent="text-amber-400"
                value={
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-xl text-xs font-bold ${getPriorityColor(lead.priority)}`}
                  >
                    {lead.priority}
                  </span>
                }
              />
              <InfoRow
                icon={TrendingUp}
                label="Score"
                accent="text-emerald-400"
                value={
                  <span className="text-lg font-black text-emerald-600">
                    {lead.score}
                  </span>
                }
              />
              {lead.nextFollowUpAt && (
                <InfoRow
                  icon={Clock}
                  label="Next Follow-up"
                  accent="text-blue-400"
                  value={fmt(lead.nextFollowUpAt)}
                />
              )}
              {lead.lastContactedAt && (
                <InfoRow
                  icon={Calendar}
                  label="Last Contacted"
                  accent="text-purple-400"
                  value={fmt(lead.lastContactedAt)}
                />
              )}
              {lead.dealValue && (
                <InfoRow
                  icon={DollarSign}
                  label="Deal Value"
                  accent="text-emerald-400"
                  value={inr(lead.dealValue)}
                />
              )}
              {lead.dealClosedAt && (
                <InfoRow
                  icon={CheckCircle2}
                  label="Deal Closed"
                  accent="text-emerald-400"
                  value={fmt(lead.dealClosedAt)}
                />
              )}
              {lead.lostReason && (
                <InfoRow
                  icon={AlertCircle}
                  label="Lost Reason"
                  accent="text-red-400"
                  value={
                    <span className="text-red-600 text-xs">
                      {lead.lostReason}
                    </span>
                  }
                />
              )}
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white mb-2.5">
            Contact
          </h3>
          <InfoRow
            icon={Mail}
            label="Email"
            value={
              <a
                href={`mailto:${lead.email}`}
                className="text-blue-600 hover:underline break-all"
              >
                {lead.email}
              </a>
            }
          />
          <InfoRow
            icon={Phone}
            label="Phone"
            value={
              <a
                href={`tel:${lead.phone}`}
                className="text-blue-600 hover:underline"
              >
                {lead.phone}
              </a>
            }
          />
          {lead.alternatePhone && (
            <InfoRow
              icon={Phone}
              label="Alt Phone"
              value={
                <a
                  href={`tel:${lead.alternatePhone}`}
                  className="text-blue-600 hover:underline"
                >
                  {lead.alternatePhone}
                </a>
              }
            />
          )}
          {lead.city && (
            <InfoRow
              icon={MapPin}
              label="City"
              accent="text-blue-400"
              value={lead.city}
            />
          )}
          {(lead.localities?.length ?? 0) > 0 && (
            <InfoRow
              icon={MapPin}
              label="Localities"
              accent="text-indigo-400"
              value={
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {lead.localities.map((l) => (
                    <span
                      key={l}
                      className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold"
                    >
                      {l}
                    </span>
                  ))}
                </div>
              }
            />
          )}
          {lead.assignedTo && (
            <InfoRow
              icon={User}
              label="Assigned To"
              accent="text-purple-400"
              value={
                <div>
                  <p className="text-sm font-bold">
                    {lead.assignedTo.firstName} {lead.assignedTo.lastName}
                  </p>
                  <p className="text-xs text-gray-400">
                    {lead.assignedTo.email}
                  </p>
                </div>
              }
            />
          )}
        </div>
      </div>

      {/* ── Requirements ──────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-3 sm:p-4">
        <h3 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white mb-2.5">
          Requirements
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {lead.propertyType && (
            <div className="bg-blue-50/60 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-3">
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wide mb-0.5">
                Property Type
              </p>
              <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                {lead.propertyType.name}
              </p>
            </div>
          )}
          {lead.purpose && (
            <div className="bg-blue-50/60 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-3">
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wide mb-0.5">
                Purpose
              </p>
              <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                {lead.purpose}
              </p>
            </div>
          )}
          {lead.bedrooms && (
            <div className="bg-blue-50/60 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-3">
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wide mb-0.5">
                Bedrooms
              </p>
              <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                {lead.bedrooms} BHK
              </p>
            </div>
          )}
          {lead.minPrice != null && (
            <div className="bg-emerald-50/60 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl p-3">
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wide mb-0.5">
                Min Budget
              </p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(lead.minPrice)}
              </p>
            </div>
          )}
          {lead.maxPrice != null && (
            <div className="bg-emerald-50/60 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl p-3">
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wide mb-0.5">
                Max Budget
              </p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(lead.maxPrice)}
              </p>
            </div>
          )}
        </div>

        {canEdit && isEditing ? (
          <div className="mt-4">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">
              Additional Notes
            </label>
            <textarea
              rows={3}
              value={editData.requirements}
              onChange={(e) =>
                setEditData({ ...editData, requirements: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
        ) : lead.requirements ? (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">
              Additional Notes
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {lead.requirements}
            </p>
          </div>
        ) : null}
      </div>

      {/* ── Interested Properties ──────────────────────────────────────────── */}
      {(lead.interestedProperties?.length ?? 0) > 0 && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white mb-2.5 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-400" />
            Interested Properties
            <span className="ml-1 text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
              {lead.interestedProperties.length}
            </span>
          </h3>
          <div className="space-y-2.5">
            {lead.interestedProperties.map((prop) => (
              <div
                key={prop.id}
                className="flex items-center gap-2.5 p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl hover:border-blue-200 transition-colors group"
              >
                <div className="w-7 h-7 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Home className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                    {prop.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5" />
                      {prop.locality},{" "}
                      {typeof prop.city === "object"
                        ? prop.city.name
                        : prop.city}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600">
                      ₹{Number(prop.price).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
                <a
                  href={`/properties/${prop.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors flex-shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Lead meta ─────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-3 sm:p-4">
        <h3 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white mb-2.5">
          Lead Info
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
          <InfoRow
            icon={Tag}
            label="Source"
            value={lead.source.replace(/_/g, " ")}
          />
          <InfoRow
            icon={Calendar}
            label="Created"
            value={fmt(lead.createdAt)}
          />
          <InfoRow
            icon={Calendar}
            label="Updated"
            value={fmt(lead.updatedAt)}
          />
          {lead.sourcePage && (
            <InfoRow
              icon={ExternalLink}
              label="Source Page"
              value={
                <a
                  href={lead.sourcePage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-xs truncate block max-w-[200px]"
                >
                  {lead.sourcePage}
                </a>
              }
            />
          )}
          {lead.utmSource && (
            <InfoRow icon={Tag} label="UTM Source" value={lead.utmSource} />
          )}
          {lead.utmMedium && (
            <InfoRow icon={Tag} label="UTM Medium" value={lead.utmMedium} />
          )}
          {lead.utmCampaign && (
            <InfoRow icon={Tag} label="UTM Campaign" value={lead.utmCampaign} />
          )}
        </div>

        {(lead.tags?.length ?? 0) > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">
              Tags
            </p>
            <div className="flex flex-wrap gap-1.5">
              {lead.tags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-[10px] font-semibold"
                >
                  <Tag className="w-2.5 h-2.5" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
