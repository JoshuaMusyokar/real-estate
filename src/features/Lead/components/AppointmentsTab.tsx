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
  Video,
  Home,
  FileText,
  User,
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
import { usePermissions } from "../../../hooks/usePermissions";

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

const getStatusColor = (s: AppointmentStatus) =>
  ({
    SCHEDULED: "bg-blue-100 text-blue-700 border-blue-200",
    CONFIRMED: "bg-green-100 text-green-700 border-green-200",
    COMPLETED: "bg-gray-100 text-gray-700 border-gray-200",
    CANCELLED: "bg-red-100 text-red-700 border-red-200",
    NO_SHOW: "bg-orange-100 text-orange-700 border-orange-200",
    RESCHEDULED: "bg-purple-100 text-purple-700 border-purple-200",
  })[s] ?? "bg-gray-100 text-gray-700 border-gray-200";

const getStatusIcon = (s: AppointmentStatus) =>
  ({
    SCHEDULED: Clock,
    CONFIRMED: CheckCircle2,
    COMPLETED: CheckCircle2,
    CANCELLED: XCircle,
    NO_SHOW: AlertCircle,
    RESCHEDULED: Clock,
  })[s] ?? Clock;

// ── CreateAppointmentModal ─────────────────────────────────────────────────────

const CreateAppointmentModal: React.FC<{
  leadId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ leadId, isOpen, onClose, onSuccess }) => {
  const [createAppointment, { isLoading }] = useCreateAppointmentMutation();
  const [form, setForm] = useState({
    type: "PROPERTY_VIEWING" as AppointmentType,
    title: "",
    description: "",
    scheduledDate: "",
    scheduledTime: "",
    duration: 60,
    location: "",
  });

  const reset = () =>
    setForm({
      type: "PROPERTY_VIEWING",
      title: "",
      description: "",
      scheduledDate: "",
      scheduledTime: "",
      duration: 60,
      location: "",
    });

  const handleSubmit = async () => {
    try {
      await createAppointment({
        leadId,
        agentId: null,
        type: form.type,
        title: form.title || `${form.type.replace(/_/g, " ")} Appointment`,
        description: form.description,
        scheduledAt: new Date(`${form.scheduledDate}T${form.scheduledTime}`),
        duration: form.duration,
        location: form.location,
      } as AppointmentCreateRequest).unwrap();
      onSuccess();
      onClose();
      reset();
    } catch {
      //
    }
  };

  if (!isOpen) return null;

  const inp =
    "w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-white";
  const lbl =
    "block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide mb-1";

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[92vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 sm:px-5 sm:py-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <div>
            <h3 className="text-sm sm:text-base font-black text-gray-900 dark:text-white">
              Schedule Appointment
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Create a new appointment for this lead
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-5 space-y-4">
          {/* Type grid */}
          <div>
            <label className={lbl}>Appointment Type *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {APPOINTMENT_TYPES.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm({ ...form, type: value })}
                  className={`p-2.5 sm:p-3 border rounded-xl transition-all flex items-center gap-2 text-left
                    ${
                      form.type === value
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                    }`}
                >
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0
                    ${form.type === value ? "bg-blue-100 text-blue-600" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-semibold text-gray-800 dark:text-gray-200 leading-tight">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className={lbl}>Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder={`${form.type.replace(/_/g, " ")} with lead`}
              className={inp}
            />
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Date *</label>
              <input
                type="date"
                value={form.scheduledDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) =>
                  setForm({ ...form, scheduledDate: e.target.value })
                }
                className={inp}
              />
            </div>
            <div>
              <label className={lbl}>Time *</label>
              <input
                type="time"
                value={form.scheduledTime}
                onChange={(e) =>
                  setForm({ ...form, scheduledTime: e.target.value })
                }
                className={inp}
              />
            </div>
          </div>

          {/* Duration + Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Duration</label>
              <select
                value={form.duration}
                onChange={(e) =>
                  setForm({ ...form, duration: Number(e.target.value) })
                }
                className={inp}
              >
                <option value={30}>30 min</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
              </select>
            </div>
            <div>
              <label className={lbl}>Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Office, address…"
                className={inp}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={lbl}>Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Add notes…"
              className={`${inp} resize-none`}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2.5 px-4 py-3.5 sm:px-5 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-2 sm:py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              isLoading ||
              !form.title ||
              !form.scheduledDate ||
              !form.scheduledTime
            }
            className="flex-1 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Creating…
              </>
            ) : (
              <>
                <Calendar className="w-3.5 h-3.5" /> Create
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── AppointmentCard ────────────────────────────────────────────────────────────

const AppointmentCard: React.FC<{
  appointment: AppointmentResponse;
  canComplete: boolean;
  canCancel: boolean;
  onComplete: (id: string) => void;
  onCancel: (id: string) => void;
}> = ({ appointment, canComplete, canCancel, onComplete, onCancel }) => {
  const apptType = APPOINTMENT_TYPES.find((t) => t.value === appointment.type);
  const Icon = apptType?.icon || Calendar;
  const StatusIcon = getStatusIcon(appointment.status as AppointmentStatus);

  const d = new Date(appointment.scheduledAt);
  const date = d.toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const showComplete =
    canComplete &&
    (appointment.status === "SCHEDULED" || appointment.status === "CONFIRMED");
  const showCancel =
    canCancel &&
    appointment.status !== "COMPLETED" &&
    appointment.status !== "CANCELLED";

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3 sm:p-4 hover:shadow-md transition-all">
      <div className="flex items-start gap-2.5 sm:gap-3">
        {/* Icon */}
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white leading-snug">
              {appointment.title}
            </h4>
            {(showComplete || showCancel) && (
              <div className="flex gap-1 flex-shrink-0">
                {showComplete && (
                  <button
                    onClick={() => onComplete(appointment.id)}
                    title="Mark complete"
                    className="w-7 h-7 flex items-center justify-center text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
                {showCancel && (
                  <button
                    onClick={() => onCancel(appointment.id)}
                    title="Cancel"
                    className="w-7 h-7 flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Status badge */}
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold border ${getStatusColor(appointment.status as AppointmentStatus)}`}
          >
            <StatusIcon className="w-2.5 h-2.5" />
            {appointment.status.replace(/_/g, " ")}
          </span>

          {/* Date / time / location */}
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            <span className="flex items-center gap-1 text-[11px] sm:text-xs text-gray-600 dark:text-gray-400">
              <Calendar className="w-3 h-3 text-gray-400" /> {date}
            </span>
            <span className="flex items-center gap-1 text-[11px] sm:text-xs text-gray-600 dark:text-gray-400">
              <Clock className="w-3 h-3 text-gray-400" /> {time} ·{" "}
              {appointment.duration} min
            </span>
            {appointment.location && (
              <span className="flex items-center gap-1 text-[11px] sm:text-xs text-gray-600 dark:text-gray-400">
                <MapPin className="w-3 h-3 text-gray-400" />{" "}
                {appointment.location}
              </span>
            )}
          </div>

          {/* Description */}
          {appointment.description && (
            <p className="mt-2 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              {appointment.description}
            </p>
          )}

          {/* Property */}
          {appointment.property && (
            <div className="mt-2.5 p-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">
                Property
              </p>
              <p className="text-xs font-bold text-gray-900 dark:text-white">
                {appointment.property.title}
              </p>
              <p className="text-[11px] text-gray-500">
                {appointment.property.locality},{" "}
                {appointment.property.city.name}
              </p>
            </div>
          )}

          {/* Agent */}
          {appointment.agent && (
            <div className="mt-2.5 pt-2.5 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-3 h-3 text-blue-600" />
              </div>
              <div>
                <p className="text-[9px] text-gray-400 uppercase tracking-wide font-semibold">
                  Agent
                </p>
                <p className="text-[11px] font-semibold text-gray-800 dark:text-gray-200">
                  {appointment.agent.firstName} {appointment.agent.lastName}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── AppointmentsTab ────────────────────────────────────────────────────────────

export const AppointmentsTab: React.FC<AppointmentsTabProps> = ({ leadId }) => {
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  const { can } = usePermissions();
  const canAdd = can("appointment.add");
  const canComplete = can("appointment.complete");
  const canCancel = can("appointment.cancel");

  const { data, isLoading, refetch } = useGetAppointmentsQuery({
    leadId,
    limit: 100,
  });
  const [completeAppointment] = useCompleteAppointmentMutation();
  const [cancelAppointment] = useCancelAppointmentMutation();

  const appointments = data?.data || [];

  const filtered = appointments.filter((apt) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "upcoming")
      return (
        new Date(apt.scheduledAt) > new Date() &&
        (apt.status === "SCHEDULED" || apt.status === "CONFIRMED")
      );
    return apt.status === filterStatus.toUpperCase();
  });

  const handleComplete = async (id: string) => {
    try {
      await completeAppointment({ id }).unwrap();
      refetch();
    } catch {
      //
    }
  };
  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this appointment?")) return;
    try {
      await cancelAppointment({ id }).unwrap();
      refetch();
    } catch {
      //
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm sm:text-base font-black text-gray-900 dark:text-white">
            Appointments
          </h3>
          <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
            {appointments.length} appointment
            {appointments.length !== 1 ? "s" : ""}
          </p>
        </div>
        {canAdd && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm shadow-blue-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Schedule</span>
            <span className="sm:hidden">Add</span>
          </button>
        )}
      </div>

      {/* Filter chips — scrollable on mobile */}
      <div
        className="flex items-center gap-1.5 overflow-x-auto pb-0.5"
        style={{ scrollbarWidth: "none" }}
      >
        {["all", "upcoming", "scheduled", "completed", "cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-colors
              ${
                filterStatus === s
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* List / empty */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl">
          <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
            No appointments found
          </h4>
          <p className="text-xs text-gray-500 mb-4">
            {filterStatus === "all"
              ? canAdd
                ? "Schedule your first appointment"
                : "No appointments yet"
              : `No ${filterStatus} appointments`}
          </p>
          {canAdd && filterStatus === "all" && (
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Schedule Appointment
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {filtered.map((apt) => (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              canComplete={canComplete}
              canCancel={canCancel}
              onComplete={handleComplete}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}

      {canAdd && (
        <CreateAppointmentModal
          leadId={leadId}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
};
