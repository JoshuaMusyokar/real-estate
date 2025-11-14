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

interface ActivityCardProps {
  activity: ActivityResponse;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const Icon = getActivityIcon(activity.type);
  const colorClass = getActivityColor(activity.type);

  const formatDate = (date: string | Date): string => {
    const activityDate = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - activityDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return activityDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year:
        activityDate.getFullYear() !== now.getFullYear()
          ? "numeric"
          : undefined,
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all">
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h4 className="font-bold text-gray-900 text-lg mb-1">
                {activity.title}
              </h4>
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className={`inline-flex px-3 py-1 rounded-lg text-xs font-semibold ${colorClass}`}
                >
                  {activity.type.replace(/_/g, " ")}
                </span>
                <span className="text-sm text-gray-600 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDate(activity.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {activity.description && (
            <p className="text-gray-700 mt-3 leading-relaxed">
              {activity.description}
            </p>
          )}

          {activity.duration && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-sm text-gray-700">
              <Clock className="w-4 h-4 text-gray-400" />
              Duration: {activity.duration} minutes
            </div>
          )}

          {activity.user && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="text-xs text-gray-600">Logged by</div>
                <div className="font-medium text-gray-900">
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

  const handleSubmit = async (): Promise<void> => {
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
    } catch (error) {
      console.error("Failed to create activity:", error);
      alert("Failed to create activity. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading activities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to load activities
          </h4>
          <p className="text-gray-600 mb-6">
            There was an error loading the activities timeline.
          </p>
          <button
            onClick={() => refetch()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Activity Timeline</h3>
          <p className="text-sm text-gray-600 mt-1">
            Track all interactions and communications with this lead
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Log Activity
        </button>
      </div>

      {showForm && (
        <div className="bg-white border-2 border-blue-200 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-5">
            <h4 className="font-bold text-gray-900 text-lg">
              Log New Activity
            </h4>
            <button
              onClick={() => setShowForm(false)}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Activity Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as ActivityType,
                  })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                {ACTIVITY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="e.g., Follow-up call with client"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                placeholder="Add details about this activity..."
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isCreating || !formData.title.trim()}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Activity"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {!activities || activities.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              No activities yet
            </h4>
            <p className="text-gray-600 mb-6">
              Start logging interactions with this lead
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Log First Activity
            </button>
          </div>
        ) : (
          activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))
        )}
      </div>
    </div>
  );
};
