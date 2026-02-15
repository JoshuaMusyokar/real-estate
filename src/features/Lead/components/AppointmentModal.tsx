import React, { useState } from "react";
import { X, Loader2, Plus, Edit, CheckCircle2, XCircle } from "lucide-react";
import type {
  AppointmentCreateRequest,
  AppointmentType,
  CalendarEvent,
} from "../../../types";
import {
  useCancelAppointmentMutation,
  useCompleteAppointmentMutation,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
} from "../../../services/appointmentApi";
import Button from "../../../components/ui/button/Button";

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

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEvent: CalendarEvent | null;
  selectedDate: { start: Date; end: Date } | null;
  onSuccess: () => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
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
        await updateAppointment({
          id: selectedEvent.id,
          data: {
            title: formData.title,
            type: formData.type,
            scheduledAt: new Date(formData.startDate).toISOString(),
            duration: Math.floor(
              (new Date(formData.endDate).getTime() -
                new Date(formData.startDate).getTime()) /
                60000,
            ),
            location: formData.location,
            description: formData.description,
          },
        }).unwrap();
      } else {
        const duration = Math.floor(
          (new Date(formData.endDate).getTime() -
            new Date(formData.startDate).getTime()) /
            60000,
        );

        await createAppointment({
          agentId: null,
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
      className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between rounded-t-xl sm:rounded-t-2xl z-10">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {isEditing ? "Edit Appointment" : "Schedule Appointment"}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">
              {isEditing
                ? "Update appointment details"
                : "Create a new appointment"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Event Details (View Mode) */}
        {isEditing && selectedEvent && (
          <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
              {selectedEvent.lead && (
                <div>
                  <div className="text-gray-600 dark:text-gray-400 mb-1 text-xs sm:text-sm">
                    Lead
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">
                    {selectedEvent.lead.firstName} {selectedEvent.lead.lastName}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-xs">
                    {selectedEvent.lead.email}
                  </div>
                </div>
              )}
              {selectedEvent.agent && (
                <div>
                  <div className="text-gray-600 dark:text-gray-400 mb-1 text-xs sm:text-sm">
                    Agent
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">
                    {selectedEvent.agent.firstName}{" "}
                    {selectedEvent.agent.lastName}
                  </div>
                </div>
              )}
              {selectedEvent.property && (
                <div className="sm:col-span-2">
                  <div className="text-gray-600 dark:text-gray-400 mb-1 text-xs sm:text-sm">
                    Property
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">
                    {selectedEvent.property.title}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-xs">
                    {selectedEvent.property.locality},{" "}
                    {selectedEvent.property.city}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Form */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
              Appointment Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
              placeholder="e.g., Property Viewing with Client"
              required
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
              Appointment Type *
            </label>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {APPOINTMENT_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: type.value })}
                  className={`p-2.5 sm:p-3 border-2 rounded-lg sm:rounded-xl transition-all text-left ${
                    formData.type === type.value
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div
                      className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: type.color }}
                    />
                    <span className="font-medium text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                      {type.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                Start Date & Time *
              </label>
              <input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                required
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                End Date & Time *
              </label>
              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                required
              />
            </div>
          </div>

          {!isEditing && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
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
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.leadLastName}
                    onChange={(e) =>
                      setFormData({ ...formData, leadLastName: e.target.value })
                    }
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.leadEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, leadEmail: e.target.value })
                    }
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.leadPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, leadPhone: e.target.value })
                    }
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
              placeholder="e.g., Office or Property Address"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none text-sm sm:text-base"
              placeholder="Additional notes..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900/50 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 border-t border-gray-200 dark:border-gray-700 rounded-b-xl sm:rounded-b-2xl">
          <div className="flex flex-wrap gap-2">
            {isEditing && canComplete && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleComplete}
                startIcon={<CheckCircle2 className="w-4 h-4" />}
                className="flex-1 sm:flex-initial bg-green-600 hover:bg-green-700"
              >
                Complete
              </Button>
            )}
            {isEditing && canCancel && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                startIcon={<XCircle className="w-4 h-4" />}
                className="flex-1 sm:flex-initial text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
              >
                Cancel
              </Button>
            )}
          </div>
          <div className="flex gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="flex-1 sm:flex-initial"
            >
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              disabled={
                isCreating ||
                isUpdating ||
                !formData.title ||
                !formData.startDate
              }
              startIcon={
                isCreating || isUpdating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isEditing ? (
                  <Edit className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )
              }
              className="flex-1 sm:flex-initial"
            >
              {isCreating || isUpdating
                ? "Saving..."
                : isEditing
                  ? "Update"
                  : "Create"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
