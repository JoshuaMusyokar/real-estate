import React, { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
  Home,
  Loader2,
  Mail,
  MessageSquare,
  PhoneCall,
  Plus,
  Send,
  User,
  Video,
  X,
  AlertCircle,
} from "lucide-react";
import type { ActivityType, ActivityResponse } from "../../../types";
import {
  useCreateActivityMutation,
  useGetLeadActivitiesQuery,
} from "../../../services/activityApi";
import { usePermissions } from "../../../hooks/usePermissions";

interface ActivitiesTabProps {
  leadId: string;
}

const ACTIVITY_TYPES: ActivityType[] = [
  "CALL",
  "EMAIL",
  "WHATSAPP",
  "SMS",
  "MEETING",
  "PROPERTY_VIEWING",
  "NOTE",
];

const getActivityIcon = (type: ActivityType) => {
  const icons: Record<ActivityType, typeof PhoneCall> = {
    CALL: PhoneCall,
    EMAIL: Mail,
    WHATSAPP: MessageSquare,
    SMS: Send,
    MEETING: Video,
    PROPERTY_VIEWING: Home,
    NOTE: Edit,
    STATUS_CHANGE: CheckCircle2,
    LEAD_ASSIGNED: User,
    LEAD_TRANSFERRED: User,
    APPOINTMENT_SCHEDULED: Calendar,
    APPOINTMENT_COMPLETED: CheckCircle2,
    APPOINTMENT_CANCELLED: X,
  };
  return icons[type] || MessageSquare;
};

const getActivityColor = (type: ActivityType): string => {
  const colors: Record<ActivityType, string> = {
    CALL: "bg-green-100 text-green-600",
    EMAIL: "bg-blue-100 text-blue-600",
    WHATSAPP: "bg-emerald-100 text-emerald-600",
    SMS: "bg-purple-100 text-purple-600",
    MEETING: "bg-orange-100 text-orange-600",
    PROPERTY_VIEWING: "bg-indigo-100 text-indigo-600",
    NOTE: "bg-gray-100 text-gray-600",
    STATUS_CHANGE: "bg-cyan-100 text-cyan-600",
    LEAD_ASSIGNED: "bg-pink-100 text-pink-600",
    LEAD_TRANSFERRED: "bg-amber-100 text-amber-600",
    APPOINTMENT_SCHEDULED: "bg-blue-100 text-blue-600",
    APPOINTMENT_COMPLETED: "bg-green-100 text-green-600",
    APPOINTMENT_CANCELLED: "bg-red-100 text-red-600",
  };
  return colors[type] || "bg-gray-100 text-gray-600";
};

const formatRelativeDate = (date: string | Date): string => {
  const d = new Date(date);
  const now = new Date();
  const mins = Math.floor((now.getTime() - d.getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

// ── ActivityCard ──────────────────────────────────────────────────────────────

const ActivityCard: React.FC<{ activity: ActivityResponse }> = ({
  activity,
}) => {
  const Icon = getActivityIcon(activity.type);
  const colorClass = getActivityColor(activity.type);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3 sm:p-4 hover:shadow-md transition-all">
      <div className="flex items-start gap-2.5 sm:gap-3">
        {/* Icon — smaller on mobile */}
        <div
          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}
        >
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Title + meta row */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white leading-snug">
              {activity.title}
            </h4>
            <span className="text-[10px] text-gray-400 flex items-center gap-1 flex-shrink-0 mt-0.5">
              <Clock className="w-3 h-3" />
              {formatRelativeDate(activity.createdAt)}
            </span>
          </div>

          {/* Type badge */}
          <span
            className={`inline-flex px-2 py-0.5 rounded-lg text-[10px] font-semibold ${colorClass}`}
          >
            {activity.type.replace(/_/g, " ")}
          </span>

          {/* Description */}
          {activity.description && (
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
              {activity.description}
            </p>
          )}

          {/* Duration */}
          {activity.duration && (
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 dark:bg-gray-800 rounded-lg text-[11px] text-gray-600 dark:text-gray-400">
              <Clock className="w-3 h-3 text-gray-400" />
              {activity.duration} min
            </div>
          )}

          {/* Logged by */}
          {activity.user && (
            <div className="mt-2.5 pt-2.5 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-3 h-3 text-blue-600" />
              </div>
              <div>
                <div className="text-[9px] text-gray-400 uppercase tracking-wide font-semibold">
                  Logged by
                </div>
                <div className="text-[11px] font-semibold text-gray-800 dark:text-gray-200">
                  {activity.user.firstName} {activity.user.lastName}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── ActivitiesTab ─────────────────────────────────────────────────────────────

export const ActivitiesTab: React.FC<ActivitiesTabProps> = ({ leadId }) => {
  const {
    data: activities,
    isLoading,
    error,
    refetch,
  } = useGetLeadActivitiesQuery(leadId);
  const [createActivity, { isLoading: isCreating }] =
    useCreateActivityMutation();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: "CALL" as ActivityType,
    title: "",
    description: "",
  });

  const { can } = usePermissions();
  const canAddActivity = can("lead.add_activity");

  const handleSubmit = async () => {
    if (!formData.title.trim()) return;
    try {
      await createActivity({
        leadId,
        type: formData.type,
        title: formData.title,
        description: formData.description || undefined,
      }).unwrap();
      setShowForm(false);
      setFormData({ type: "CALL", title: "", description: "" });
      refetch();
    } catch {
      alert("Failed to create activity. Please try again.");
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Loading activities…
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
            Failed to load
          </h4>
          <button
            onClick={() => refetch()}
            className="mt-3 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm sm:text-base font-black text-gray-900 dark:text-white">
            Activity Timeline
          </h3>
          <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
            {activities?.length ?? 0} interaction
            {(activities?.length ?? 0) !== 1 ? "s" : ""} logged
          </p>
        </div>
        {canAddActivity && (
          <button
            onClick={() => setShowForm((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-sm
              ${
                showForm
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
              }`}
          >
            {showForm ? (
              <X className="w-3.5 h-3.5" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
            {showForm ? "Cancel" : "Log Activity"}
          </button>
        )}
      </div>

      {/* Inline form */}
      {canAddActivity && showForm && (
        <div className="bg-blue-50/60 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-3 sm:p-4">
          <h4 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white mb-3">
            New Activity
          </h4>
          <div className="space-y-2.5">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as ActivityType,
                  })
                }
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:text-white"
              >
                {ACTIVITY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g. Follow-up call with client"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Add details…"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isCreating || !formData.title.trim()}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…
                  </>
                ) : (
                  "Save Activity"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-2 sm:space-y-3">
        {!activities || activities.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl">
            <Clock className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
              No activities yet
            </h4>
            <p className="text-xs text-gray-500 mb-4">
              {canAddActivity
                ? "Start logging interactions with this lead"
                : "No interactions logged yet"}
            </p>
            {canAddActivity && (
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Log First Activity
              </button>
            )}
          </div>
        ) : (
          activities.map((a) => <ActivityCard key={a.id} activity={a} />)
        )}
      </div>
    </div>
  );
};
