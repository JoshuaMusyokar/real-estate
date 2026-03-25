import {
  Calendar,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  Check,
} from "lucide-react";
import type { Property } from "../../types";
import { useState, useMemo } from "react";
import { useCreateAppointmentMutation } from "../../services/appointmentApi";
import { useToast } from "../../hooks/useToast";

interface ScheduleViewingModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

// ── Time slots ────────────────────────────────────────────────────────────────
const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const fmt12 = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
};

// ── Mini calendar ─────────────────────────────────────────────────────────────
const MiniCalendar: React.FC<{
  selected: Date | null;
  onChange: (d: Date) => void;
}> = ({ selected, onChange }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [view, setView] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const days = useMemo(() => {
    const first = new Date(view.year, view.month, 1);
    const lastDay = new Date(view.year, view.month + 1, 0).getDate();
    const offset = first.getDay(); // 0=Sun
    const cells: (Date | null)[] = Array(offset).fill(null);
    for (let d = 1; d <= lastDay; d++) {
      cells.push(new Date(view.year, view.month, d));
    }
    // pad to full rows
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [view]);

  const prev = () =>
    setView((v) => {
      const m = v.month - 1;
      return m < 0 ? { year: v.year - 1, month: 11 } : { ...v, month: m };
    });
  const next = () =>
    setView((v) => {
      const m = v.month + 1;
      return m > 11 ? { year: v.year + 1, month: 0 } : { ...v, month: m };
    });

  return (
    <div className="select-none">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prev}
          className="w-7 h-7 rounded-lg hover:bg-blue-50 flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-bold text-gray-900">
          {MONTHS[view.month]} {view.year}
        </span>
        <button
          onClick={next}
          className="w-7 h-7 rounded-lg hover:bg-blue-50 flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-bold text-gray-400 py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {days.map((date, i) => {
          if (!date) return <div key={i} />;
          const isPast = date < today;
          const isSelected =
            selected &&
            date.getFullYear() === selected.getFullYear() &&
            date.getMonth() === selected.getMonth() &&
            date.getDate() === selected.getDate();
          const isToday = date.getTime() === today.getTime();

          return (
            <button
              key={i}
              disabled={isPast}
              onClick={() => onChange(date)}
              className={`
                h-8 w-full rounded-lg text-xs font-semibold transition-all
                ${
                  isPast
                    ? "text-gray-200 cursor-not-allowed"
                    : isSelected
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : isToday
                        ? "border-2 border-blue-300 text-blue-600 hover:bg-blue-50"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ── Main modal ────────────────────────────────────────────────────────────────
export const ScheduleViewingModal: React.FC<ScheduleViewingModalProps> = ({
  property,
  isOpen,
  onClose,
}) => {
  const [createAppointment, { isLoading }] = useCreateAppointmentMutation();
  const { success, error: showError } = useToast();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) return;
    const [h, m] = selectedTime.split(":").map(Number);
    const scheduledAt = new Date(selectedDate);
    scheduledAt.setHours(h, m, 0, 0);

    try {
      await createAppointment({
        firstName: formData.firstName,
        lastName: formData.lastName,
        agentId: property.ownerId,
        propertyId: property.id,
        type: "PROPERTY_VIEWING",
        email: formData.email,
        phone: formData.phone,
        description: formData.message,
        scheduledAt,
      }).unwrap();

      onClose();
      success("Viewing Scheduled!", "We'll confirm your appointment shortly.");
    } catch {
      showError("Failed", "Failed to schedule viewing. Please try again.");
    }
  };

  const isValid =
    formData.firstName &&
    formData.email &&
    formData.phone &&
    selectedDate &&
    selectedTime;

  const displayDate = selectedDate
    ? selectedDate.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-200">
              <Calendar className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900">
                Schedule a Viewing
              </h3>
              <p className="text-[11px] text-gray-400 truncate max-w-[260px]">
                {property.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* ── Left: calendar + time slots ─────────────────────────── */}
            <div className="space-y-4">
              {/* Calendar */}
              <div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-2.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Select Date
                </p>
                <div className="bg-blue-50/40 border border-blue-100 rounded-2xl p-3.5">
                  <MiniCalendar
                    selected={selectedDate}
                    onChange={setSelectedDate}
                  />
                </div>
                {selectedDate && (
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-blue-600">
                    <Check className="w-3 h-3" /> {displayDate}
                  </div>
                )}
              </div>

              {/* Time slots */}
              {selectedDate && (
                <div>
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-2.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Select Time
                  </p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
                        className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition-all
                          ${
                            selectedTime === slot
                              ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-200"
                              : "bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                          }`}
                      >
                        {fmt12(slot)}
                      </button>
                    ))}
                  </div>
                  {selectedTime && (
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-blue-600">
                      <Check className="w-3 h-3" /> {fmt12(selectedTime)}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Right: contact form ──────────────────────────────────── */}
            <div className="space-y-3">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-0.5">
                Your Details
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    First Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    placeholder="Arjun"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    placeholder="Singh"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="arjun@example.com"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  Phone <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  Message{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={4}
                  placeholder="Any special requirements or questions…"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                />
              </div>

              {/* Booking summary */}
              {(selectedDate || selectedTime) && (
                <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3 space-y-1.5">
                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wide">
                    Booking Summary
                  </p>
                  {selectedDate && (
                    <div className="flex items-center gap-2 text-xs text-gray-700">
                      <Calendar className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      <span className="font-semibold">{displayDate}</span>
                    </div>
                  )}
                  {selectedTime && (
                    <div className="flex items-center gap-2 text-xs text-gray-700">
                      <Clock className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      <span className="font-semibold">
                        {fmt12(selectedTime)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0 bg-gray-50/60">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || isLoading}
            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-black rounded-xl transition-colors shadow-sm shadow-blue-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Scheduling…
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4" /> Confirm Viewing
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
