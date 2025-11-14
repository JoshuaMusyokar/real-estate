/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type {
  EventInput,
  DateSelectArg,
  EventClickArg,
} from "@fullcalendar/core";
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Home,
  Loader2,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  useGetAdminAppointmentsQuery,
  useGetSuperAdminAppointmentsQuery,
  useGetPropertyOwnerAppointmentsQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useCancelAppointmentMutation,
  useCompleteAppointmentMutation,
} from "../services/appointmentApi";
import type {
  CalendarEvent,
  AppointmentType,
  AppointmentStatus,
  AppointmentCreateRequest,
} from "../types";
import { useAuth } from "../hooks/useAuth"; // Your auth hook

const APPOINTMENT_TYPES: {
  value: AppointmentType;
  label: string;
  color: string;
}[] = [
  { value: "PROPERTY_VIEWING", label: "Property Viewing", color: "#3B82F6" },
  { value: "CONSULTATION", label: "Consultation", color: "#8B5CF6" },
  { value: "NEGOTIATION", label: "Negotiation", color: "#F59E0B" },
  { value: "DOCUMENTATION", label: "Documentation", color: "#10B981" },
  { value: "CLOSING", label: "Closing", color: "#EF4444" },
  { value: "FOLLOW_UP", label: "Follow Up", color: "#6B7280" },
];

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  SCHEDULED: "#3B82F6",
  CONFIRMED: "#10B981",
  COMPLETED: "#6B7280",
  CANCELLED: "#EF4444",
  NO_SHOW: "#F59E0B",
  RESCHEDULED: "#8B5CF6",
};

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEvent: CalendarEvent | null;
  selectedDate: { start: Date; end: Date } | null;
  onSuccess: () => void;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  selectedEvent,
  selectedDate,
  onSuccess,
}) => {
  const [createAppointment, { isLoading: isCreating }] =
    useCreateAppointmentMutation();
  const [updateAppointment, { isLoading: isUpdating }] =
    useUpdateAppointmentMutation();
  const [cancelAppointment] = useCancelAppointmentMutation();
  const [completeAppointment] = useCompleteAppointmentMutation();

  const [formData, setFormData] = useState({
    title: selectedEvent?.title || "",
    type: selectedEvent?.type || ("PROPERTY_VIEWING" as AppointmentType),
    startDate: selectedEvent?.start
      ? new Date(selectedEvent.start).toISOString().slice(0, 16)
      : selectedDate?.start.toISOString().slice(0, 16) || "",
    endDate: selectedEvent?.end
      ? new Date(selectedEvent.end).toISOString().slice(0, 16)
      : selectedDate?.end.toISOString().slice(0, 16) || "",
    location: selectedEvent?.location || "",
    description: selectedEvent?.description || "",
    leadEmail: selectedEvent?.lead?.email || "",
    leadPhone: selectedEvent?.lead?.phone || "",
    leadFirstName: selectedEvent?.lead?.firstName || "",
    leadLastName: selectedEvent?.lead?.lastName || "",
  });

  const handleSubmit = async (): Promise<void> => {
    try {
      if (selectedEvent) {
        // Update existing appointment
        await updateAppointment({
          id: selectedEvent.id,
          data: {
            title: formData.title,
            type: formData.type,
            scheduledAt: new Date(formData.startDate).toISOString(),
            duration: Math.floor(
              (new Date(formData.endDate).getTime() -
                new Date(formData.startDate).getTime()) /
                60000
            ),
            location: formData.location,
            description: formData.description,
          },
        }).unwrap();
      } else {
        // Create new appointment
        const duration = Math.floor(
          (new Date(formData.endDate).getTime() -
            new Date(formData.startDate).getTime()) /
            60000
        );

        await createAppointment({
          agentId: null, // Will be set by backend
          type: formData.type,
          title: formData.title,
          scheduledAt: new Date(formData.startDate),
          duration,
          location: formData.location,
          description: formData.description,
          email: formData.leadEmail,
          phone: formData.leadPhone,
          firstName: formData.leadFirstName,
          lastName: formData.leadLastName,
        } as AppointmentCreateRequest).unwrap();
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save appointment:", error);
      alert("Failed to save appointment. Please try again.");
    }
  };

  const handleComplete = async (): Promise<void> => {
    if (!selectedEvent) return;
    try {
      await completeAppointment({ id: selectedEvent.id }).unwrap();
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to complete appointment:", error);
    }
  };

  const handleCancel = async (): Promise<void> => {
    if (!selectedEvent || !confirm("Cancel this appointment?")) return;
    try {
      await cancelAppointment({ id: selectedEvent.id }).unwrap();
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
    }
  };

  if (!isOpen) return null;

  const isEditing = !!selectedEvent;
  const canComplete =
    selectedEvent?.status === "SCHEDULED" ||
    selectedEvent?.status === "CONFIRMED";
  const canCancel =
    selectedEvent?.status !== "COMPLETED" &&
    selectedEvent?.status !== "CANCELLED";

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {isEditing ? "Edit Appointment" : "Schedule Appointment"}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {isEditing
                ? "Update appointment details"
                : "Create a new appointment"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Event Details (View Mode) */}
        {isEditing && selectedEvent && (
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {selectedEvent.lead && (
                <div>
                  <div className="text-gray-600 mb-1">Lead</div>
                  <div className="font-semibold text-gray-900">
                    {selectedEvent.lead.firstName} {selectedEvent.lead.lastName}
                  </div>
                  <div className="text-gray-600 text-xs">
                    {selectedEvent.lead.email}
                  </div>
                </div>
              )}
              {selectedEvent.agent && (
                <div>
                  <div className="text-gray-600 mb-1">Agent</div>
                  <div className="font-semibold text-gray-900">
                    {selectedEvent.agent.firstName}{" "}
                    {selectedEvent.agent.lastName}
                  </div>
                </div>
              )}
              {selectedEvent.property && (
                <div className="col-span-2">
                  <div className="text-gray-600 mb-1">Property</div>
                  <div className="font-semibold text-gray-900">
                    {selectedEvent.property.title}
                  </div>
                  <div className="text-gray-600 text-xs">
                    {selectedEvent.property.locality},{" "}
                    {selectedEvent.property.city}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Form */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Appointment Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="e.g., Property Viewing with Client"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Appointment Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {APPOINTMENT_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: type.value })}
                  className={`p-3 border-2 rounded-xl transition-all text-left ${
                    formData.type === type.value
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: type.color }}
                    />
                    <span className="font-medium text-sm text-gray-900">
                      {type.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Start Date & Time *
              </label>
              <input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                End Date & Time *
              </label>
              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>
          </div>

          {!isEditing && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.leadFirstName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        leadFirstName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.leadLastName}
                    onChange={(e) =>
                      setFormData({ ...formData, leadLastName: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.leadEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, leadEmail: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.leadPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, leadPhone: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </>
          )}

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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="e.g., Office or Property Address"
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
              placeholder="Additional notes..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex items-center justify-between gap-3 border-t border-gray-200 rounded-b-2xl">
          <div className="flex gap-2">
            {isEditing && canComplete && (
              <button
                onClick={handleComplete}
                className="px-4 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Complete
              </button>
            )}
            {isEditing && canCancel && (
              <button
                onClick={handleCancel}
                className="px-4 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Cancel
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleSubmit}
              disabled={
                isCreating ||
                isUpdating ||
                !formData.title ||
                !formData.startDate
              }
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isCreating || isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  {isEditing ? (
                    <Edit className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {isEditing ? "Update" : "Create"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AppointmentsCalendar: React.FC = () => {
  const { user } = useAuth(); // Get current user from your auth hook
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch appointments based on user role
  const {
    data: adminEvents,
    isLoading: adminLoading,
    refetch: refetchAdmin,
  } = useGetAdminAppointmentsQuery(
    {},
    {
      skip:
        user?.role !== "ADMIN" &&
        user?.role !== "SALES_MANAGER" &&
        user?.role !== "SALES_AGENT",
    }
  );

  const {
    data: superAdminEvents,
    isLoading: superAdminLoading,
    refetch: refetchSuperAdmin,
  } = useGetSuperAdminAppointmentsQuery(
    {},
    {
      skip: user?.role !== "SUPER_ADMIN",
    }
  );

  const {
    data: ownerEvents,
    isLoading: ownerLoading,
    refetch: refetchOwner,
  } = useGetPropertyOwnerAppointmentsQuery(
    { ownerId: user?.id || "" },
    {
      skip: user?.role !== "PROPERTY_OWNER",
    }
  );

  // Determine which events to show based on role
  const events = useMemo(() => {
    if (user?.role === "SUPER_ADMIN") return superAdminEvents || [];
    if (user?.role === "PROPERTY_OWNER") return ownerEvents || [];
    return adminEvents || [];
  }, [user?.role, adminEvents, superAdminEvents, ownerEvents]);

  const isLoading = adminLoading || superAdminLoading || ownerLoading;

  // Convert to FullCalendar format
  const calendarEvents: EventInput[] = useMemo(() => {
    return events.map((event) => ({
      id: event.id,
      title: event.title,
      start: new Date(event.start),
      end: new Date(event.end),
      backgroundColor: STATUS_COLORS[event.status],
      borderColor: STATUS_COLORS[event.status],
      extendedProps: {
        ...event,
      },
    }));
  }, [events]);

  const handleDateSelect = (selectInfo: DateSelectArg): void => {
    setSelectedDate({
      start: selectInfo.start,
      end: selectInfo.end,
    });
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (clickInfo: EventClickArg): void => {
    const event = clickInfo.event.extendedProps as CalendarEvent;
    setSelectedEvent(event);
    setSelectedDate(null);
    setIsModalOpen(true);
  };

  const handleSuccess = (): void => {
    // Refetch based on role
    if (user?.role === "SUPER_ADMIN") {
      refetchSuperAdmin();
    } else if (user?.role === "PROPERTY_OWNER") {
      refetchOwner();
    } else {
      refetchAdmin();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <CalendarIcon className="w-7 h-7 text-blue-600" />
              Appointments Calendar
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage your appointments and schedule new ones
            </p>
          </div>
          <div className="text-sm text-gray-600 bg-white px-4 py-2 rounded-lg border border-gray-200">
            <span className="font-semibold text-gray-900">{events.length}</span>{" "}
            appointments
          </div>
        </div>
      </div>

      <div className="p-6">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={calendarEvents}
          selectable={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          height="auto"
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            meridiem: "short",
          }}
        />
      </div>

      <AppointmentModal
        isOpen={false}
        // isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedEvent={selectedEvent}
        selectedDate={selectedDate}
        onSuccess={handleSuccess}
      />

      <style>{`
        .fc {
          font-family: inherit;
        }
        .fc .fc-button {
          background-color: #3B82F6;
          border-color: #3B82F6;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 600;
          text-transform: capitalize;
        }
        .fc .fc-button:hover {
          background-color: #2563EB;
          border-color: #2563EB;
        }
        .fc .fc-button-active {
          background-color: #1D4ED8 !important;
          border-color: #1D4ED8 !important;
        }
        .fc .fc-daygrid-day-number {
          font-weight: 600;
          color: #374151;
        }
        .fc .fc-col-header-cell {
          background-color: #F9FAFB;
          font-weight: 700;
          color: #374151;
          padding: 12px 0;
        }
        .fc .fc-event {
          border-radius: 6px;
          padding: 2px 6px;
          font-weight: 500;
          cursor: pointer;
        }
        .fc .fc-event:hover {
          opacity: 0.85;
        }
      `}</style>
    </div>
  );
};
