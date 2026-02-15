// components/appointments/AppointmentsCalendar.tsx
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
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import type { AppointmentStatus, CalendarEvent } from "../types";
import { useAuth } from "../hooks/useAuth";
import {
  useGetAdminAppointmentsQuery,
  useGetPropertyOwnerAppointmentsQuery,
  useGetSuperAdminAppointmentsQuery,
} from "../services/appointmentApi";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { AppointmentModal } from "../features/Lead/components/AppointmentModal";

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  SCHEDULED: "#3B82F6",
  CONFIRMED: "#10B981",
  COMPLETED: "#6B7280",
  CANCELLED: "#EF4444",
  NO_SHOW: "#F59E0B",
  RESCHEDULED: "#8B5CF6",
};

export const AppointmentsCalendar: React.FC = () => {
  const { user } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
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
        user?.role.name !== "ADMIN" &&
        user?.role.name !== "SALES_MANAGER" &&
        user?.role.name !== "SALES_AGENT",
    },
  );

  const {
    data: superAdminEvents,
    isLoading: superAdminLoading,
    refetch: refetchSuperAdmin,
  } = useGetSuperAdminAppointmentsQuery(
    {},
    {
      skip: user?.role.name !== "SUPER_ADMIN",
    },
  );

  const {
    data: ownerEvents,
    isLoading: ownerLoading,
    refetch: refetchOwner,
  } = useGetPropertyOwnerAppointmentsQuery(
    { ownerId: user?.id || "" },
    {
      skip: user?.role.name !== "PROPERTY_OWNER",
    },
  );

  // Determine which events to show based on role
  const events = useMemo(() => {
    if (user?.role.name === "SUPER_ADMIN") return superAdminEvents || [];
    if (user?.role.name === "PROPERTY_OWNER") return ownerEvents || [];
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
    if (user?.role.name === "SUPER_ADMIN") {
      refetchSuperAdmin();
    } else if (user?.role.name === "PROPERTY_OWNER") {
      refetchOwner();
    } else {
      refetchAdmin();
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-20 sm:py-24 md:py-32">
          <div className="text-center">
            <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 animate-spin text-blue-600 mx-auto mb-3 sm:mb-4" />
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
              Loading calendar...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="p-3 sm:p-4 md:p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-blue-600 dark:text-blue-400" />
                Appointments Calendar
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">
                Manage your appointments and schedule new ones
              </p>
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-gray-200 dark:border-gray-700">
              <span className="font-semibold text-gray-900 dark:text-white">
                {events.length}
              </span>{" "}
              appointments
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-3 sm:p-4 md:p-6">
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
            buttonText={{
              today: "Today",
              month: "Month",
              week: "Week",
              day: "Day",
            }}
          />
        </CardContent>
      </Card>

      <AppointmentModal
        isOpen={isModalOpen}
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
          padding: 6px 12px;
          border-radius: 8px;
          font-weight: 600;
          text-transform: capitalize;
          font-size: 0.875rem;
        }
        @media (min-width: 640px) {
          .fc .fc-button {
            padding: 8px 16px;
            font-size: 0.9375rem;
          }
        }
        .fc .fc-button:hover {
          background-color: #2563EB;
          border-color: #2563EB;
        }
        .fc .fc-button-active {
          background-color: #1D4ED8 !important;
          border-color: #1D4ED8 !important;
        }
        .fc .fc-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .fc .fc-daygrid-day-number {
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
        }
        @media (prefers-color-scheme: dark) {
          .fc .fc-daygrid-day-number {
            color: #D1D5DB;
          }
        }
        .fc .fc-col-header-cell {
          background-color: #F9FAFB;
          font-weight: 700;
          color: #374151;
          padding: 8px 0;
          font-size: 0.75rem;
        }
        @media (min-width: 640px) {
          .fc .fc-col-header-cell {
            padding: 12px 0;
            font-size: 0.875rem;
          }
        }
        @media (prefers-color-scheme: dark) {
          .fc .fc-col-header-cell {
            background-color: #1F2937;
            color: #D1D5DB;
          }
        }
        .fc .fc-event {
          border-radius: 6px;
          padding: 2px 4px;
          font-weight: 500;
          cursor: pointer;
          font-size: 0.75rem;
        }
        @media (min-width: 640px) {
          .fc .fc-event {
            padding: 2px 6px;
            font-size: 0.8125rem;
          }
        }
        .fc .fc-event:hover {
          opacity: 0.85;
        }
        .fc .fc-toolbar-title {
          font-size: 1.125rem;
          font-weight: 700;
        }
        @media (min-width: 640px) {
          .fc .fc-toolbar-title {
            font-size: 1.25rem;
          }
        }
        @media (min-width: 768px) {
          .fc .fc-toolbar-title {
            font-size: 1.5rem;
          }
        }
        @media (prefers-color-scheme: dark) {
          .fc .fc-toolbar-title {
            color: #F3F4F6;
          }
        }
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .fc {
            --fc-border-color: #374151;
            --fc-neutral-bg-color: #1F2937;
            --fc-page-bg-color: #111827;
          }
          .fc .fc-scrollgrid {
            border-color: #374151;
          }
          .fc td, .fc th {
            border-color: #374151;
          }
          .fc .fc-daygrid-day {
            background-color: #1F2937;
          }
          .fc .fc-daygrid-day.fc-day-today {
            background-color: #1E3A8A;
          }
        }
      `}</style>
    </>
  );
};
