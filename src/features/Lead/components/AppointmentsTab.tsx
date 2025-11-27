/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Loader2,
  X,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  Video,
  Home,
  FileText,
  User,
  Phone,
  Mail,
} from "lucide-react";
import {
  useGetAppointmentsQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useCancelAppointmentMutation,
  useCompleteAppointmentMutation,
} from "../../../services/appointmentApi";
import type {
  AppointmentResponse,
  AppointmentCreateRequest,
  AppointmentType,
  AppointmentStatus,
} from "../../../types";

interface AppointmentsTabProps {
  leadId: string;
}

const APPOINTMENT_TYPES: {
  value: AppointmentType;
  label: string;
  icon: typeof Home;
}[] = [
  { value: "PROPERTY_VIEWING", label: "Property Viewing", icon: Home },
  { value: "CONSULTATION", label: "Consultation", icon: User },
  { value: "NEGOTIATION", label: "Negotiation", icon: FileText },
  { value: "DOCUMENTATION", label: "Documentation", icon: FileText },
  { value: "CLOSING", label: "Closing", icon: CheckCircle2 },
  { value: "FOLLOW_UP", label: "Follow Up", icon: Clock },
];

const getStatusColor = (status: AppointmentStatus): string => {
  const colors: Record<AppointmentStatus, string> = {
    SCHEDULED: "bg-blue-100 text-blue-700 border-blue-200",
    CONFIRMED: "bg-green-100 text-green-700 border-green-200",
    COMPLETED: "bg-gray-100 text-gray-700 border-gray-200",
    CANCELLED: "bg-red-100 text-red-700 border-red-200",
    NO_SHOW: "bg-orange-100 text-orange-700 border-orange-200",
    RESCHEDULED: "bg-purple-100 text-purple-700 border-purple-200",
  };
  return colors[status] || "bg-gray-100 text-gray-700 border-gray-200";
};

const getStatusIcon = (status: AppointmentStatus) => {
  const icons: Record<AppointmentStatus, typeof CheckCircle2> = {
    SCHEDULED: Clock,
    CONFIRMED: CheckCircle2,
    COMPLETED: CheckCircle2,
    CANCELLED: XCircle,
    NO_SHOW: AlertCircle,
    RESCHEDULED: Clock,
  };
  return icons[status] || Clock;
};

interface CreateAppointmentModalProps {
  leadId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateAppointmentModal: React.FC<CreateAppointmentModalProps> = ({
  leadId,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [createAppointment, { isLoading }] = useCreateAppointmentMutation();
  const [formData, setFormData] = useState<{
    type: AppointmentType;
    title: string;
    description: string;
    scheduledDate: string;
    scheduledTime: string;
    duration: number;
    location: string;
  }>({
    type: "PROPERTY_VIEWING",
    title: "",
    description: "",
    scheduledDate: "",
    scheduledTime: "",
    duration: 60,
    location: "",
  });

  const handleSubmit = async (): Promise<void> => {
    try {
      const scheduledAt = new Date(
        `${formData.scheduledDate}T${formData.scheduledTime}`
      );

      await createAppointment({
        leadId,
        agentId: null, // Will be set by backend based on current user
        type: formData.type,
        title:
          formData.title || `${formData.type.replace(/_/g, " ")} Appointment`,
        description: formData.description,
        scheduledAt,
        duration: formData.duration,
        location: formData.location,
      } as AppointmentCreateRequest).unwrap();

      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error("Failed to create appointment:", error);
    }
  };

  const resetForm = (): void => {
    setFormData({
      type: "PROPERTY_VIEWING",
      title: "",
      description: "",
      scheduledDate: "",
      scheduledTime: "",
      duration: 60,
      location: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Schedule Appointment
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Create a new appointment for this lead
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Appointment Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {APPOINTMENT_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, type: type.value })
                    }
                    className={`p-4 border-2 rounded-xl transition-all flex items-center gap-3 ${
                      formData.type === type.value
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        formData.type === type.value
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-gray-900 text-sm">
                      {type.label}
                    </span>
                  </button>
                );
              })}
            </div>
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
              placeholder={`${formData.type.replace(/_/g, " ")} with lead`}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                value={formData.scheduledDate}
                onChange={(e) =>
                  setFormData({ ...formData, scheduledDate: e.target.value })
                }
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Time *
              </label>
              <input
                type="time"
                value={formData.scheduledTime}
                onChange={(e) =>
                  setFormData({ ...formData, scheduledTime: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <select
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: Number(e.target.value) })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Office, Property address..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
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
              placeholder="Add notes about this appointment..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex gap-3 border-t border-gray-200 rounded-b-2xl">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              isLoading ||
              !formData.title ||
              !formData.scheduledDate ||
              !formData.scheduledTime
            }
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Calendar className="w-5 h-5" />
                Create Appointment
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

interface AppointmentCardProps {
  appointment: AppointmentResponse;
  onComplete: (id: string) => void;
  onCancel: (id: string) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onComplete,
  onCancel,
}) => {
  const appointmentType = APPOINTMENT_TYPES.find(
    (t) => t.value === appointment.type
  );
  const Icon = appointmentType?.icon || Calendar;
  const StatusIcon = getStatusIcon(appointment.status as AppointmentStatus);

  const formatDateTime = (
    dateString: string
  ): { date: string; time: string } => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const { date, time } = formatDateTime(appointment.scheduledAt);
  const isUpcoming = new Date(appointment.scheduledAt) > new Date();
  const canComplete =
    appointment.status === "SCHEDULED" || appointment.status === "CONFIRMED";
  const canCancel =
    appointment.status !== "COMPLETED" && appointment.status !== "CANCELLED";

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h4 className="font-bold text-gray-900 text-lg mb-1">
                {appointment.title}
              </h4>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(
                  appointment.status as AppointmentStatus
                )}`}
              >
                <StatusIcon className="w-3.5 h-3.5" />
                {appointment.status.replace(/_/g, " ")}
              </span>
            </div>
            {canComplete || canCancel ? (
              <div className="flex gap-2">
                {canComplete && (
                  <button
                    onClick={() => onComplete(appointment.id)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Mark as completed"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                )}
                {canCancel && (
                  <button
                    onClick={() => onCancel(appointment.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Cancel appointment"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="font-medium">{date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="font-medium">
                {time} ({appointment.duration} min)
              </span>
            </div>
            {appointment.location && (
              <div className="flex items-center gap-2 text-sm text-gray-700 md:col-span-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{appointment.location}</span>
              </div>
            )}
          </div>

          {appointment.description && (
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {appointment.description}
            </p>
          )}

          {appointment.property && (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="text-xs text-gray-600 mb-1">Property</div>
              <div className="font-semibold text-gray-900">
                {appointment.property.title}
              </div>
              <div className="text-sm text-gray-600">
                {appointment.property.locality},{" "}
                {appointment.property.city.name}
              </div>
            </div>
          )}

          {appointment.agent && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="text-xs text-gray-600">Agent</div>
                <div className="font-medium text-gray-900">
                  {appointment.agent.firstName} {appointment.agent.lastName}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const AppointmentsTab: React.FC<AppointmentsTabProps> = ({ leadId }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { data, isLoading, refetch } = useGetAppointmentsQuery({
    leadId,
    limit: 100,
  });

  const [completeAppointment] = useCompleteAppointmentMutation();
  const [cancelAppointment] = useCancelAppointmentMutation();

  const appointments = data?.data || [];

  const filteredAppointments = appointments.filter((apt) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "upcoming") {
      return (
        new Date(apt.scheduledAt) > new Date() &&
        (apt.status === "SCHEDULED" || apt.status === "CONFIRMED")
      );
    }
    return apt.status === filterStatus.toUpperCase();
  });

  const handleComplete = async (id: string): Promise<void> => {
    try {
      await completeAppointment({ id }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to complete appointment:", error);
    }
  };

  const handleCancel = async (id: string): Promise<void> => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      await cancelAppointment({ id }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Appointments</h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage all scheduled appointments for this lead
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Schedule Appointment
        </button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {["all", "upcoming", "scheduled", "completed", "cancelled"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                filterStatus === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          )
        )}
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            No appointments found
          </h4>
          <p className="text-gray-600 mb-6">
            {filterStatus === "all"
              ? "Schedule your first appointment with this lead"
              : `No ${filterStatus} appointments`}
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Schedule Appointment
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onComplete={handleComplete}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}

      <CreateAppointmentModal
        leadId={leadId}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
};
