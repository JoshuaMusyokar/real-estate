/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { format, isToday, isTomorrow, isThisWeek, parseISO } from "date-fns";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Home,
  Phone,
  Mail,
  Filter,
  Search,
  Plus,
  Video,
  PhoneCall,
  MessageCircle,
} from "lucide-react";
import { useGetBuyerAppointmentsQuery } from "../../../services/appointmentApi";
import type {
  CalendarEvent,
  AppointmentStatus,
  AppointmentType,
} from "../../../types";
import { useNavigate } from "react-router";
import { PublicHeader } from "../../../layout/PublicHeader";
import { useAuth } from "../../../hooks/useAuth";

const AppointmentsPage: React.FC = () => {
  const [selectedView, setSelectedView] = useState<
    "list" | "calendar" | "grid"
  >("list");
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus[]>([]);
  const [typeFilter, setTypeFilter] = useState<AppointmentType[]>([]);
  const [dateRange, setDateRange] = useState<"upcoming" | "past" | "all">(
    "upcoming"
  );
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: appointments = [],
    isLoading,
    error,
  } = useGetBuyerAppointmentsQuery({
    email: user!.email,
    filters: {
      status: statusFilter.length > 0 ? statusFilter : undefined,
      type: typeFilter.length > 0 ? typeFilter : undefined,
    },
  });

  const filteredAppointments = appointments.filter((appointment) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        appointment.title.toLowerCase().includes(query) ||
        appointment.property?.title.toLowerCase().includes(query) ||
        appointment.agent?.firstName.toLowerCase().includes(query) ||
        appointment.agent?.lastName.toLowerCase().includes(query) ||
        appointment.location?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const getStatusColor = (status: AppointmentStatus) => {
    const colors = {
      SCHEDULED: "bg-blue-100 text-blue-800 border-blue-200",
      CONFIRMED: "bg-green-100 text-green-800 border-green-200",
      COMPLETED: "bg-gray-100 text-gray-800 border-gray-200",
      CANCELLED: "bg-red-100 text-red-800 border-red-200",
      NO_SHOW: "bg-orange-100 text-orange-800 border-orange-200",
      RESCHEDULED: "bg-purple-100 text-purple-800 border-purple-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getTypeIcon = (type: AppointmentType) => {
    const icons = {
      PROPERTY_VIEWING: Home,
      CONSULTATION: User,
      NEGOTIATION: MessageCircle,
      DOCUMENTATION: Calendar,
      CLOSING: PhoneCall,
      FOLLOW_UP: Phone,
    };
    return icons[type] || Calendar;
  };

  const formatDate = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isThisWeek(date)) return format(date, "EEEE");
    return format(date, "MMM d, yyyy");
  };
  const handleShowFavorites = () => {
    // Navigate to favorites page or show favorites modal
    navigate("/saved-properties");
  };

  const handleShowAppointments = () => {
    // Navigate to appointments page
    navigate("/appointments");
  };

  const formatTime = (date: Date) => {
    return format(date, "h:mm a");
  };

  if (isLoading) {
    return <AppointmentSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Unable to load appointments
          </h2>
          <p className="text-gray-600 mb-4">
            Please check your connection and try again.
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <PublicHeader
        onShowFavorites={handleShowFavorites}
        onShowAppointments={handleShowAppointments}
      />
      {/* Header */}
      {/* <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                My Appointments
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your property viewings and meetings
              </p>
            </div>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm">
              <Plus size={20} />
              Schedule New
            </button>
          </div>
        </div>
      </div> */}

      {/* Filters and Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search appointments, properties, agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              {[
                { key: "list" as const, label: "List" },
                { key: "grid" as const, label: "Grid" },
                { key: "calendar" as const, label: "Calendar" },
              ].map((view) => (
                <button
                  key={view.key}
                  onClick={() => setSelectedView(view.key)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedView === view.key
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {view.label}
                </button>
              ))}
            </div>

            {/* Filter Button */}
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter size={20} />
              Filters
            </button>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-3 mt-4">
            {[
              { key: "upcoming" as const, label: "Upcoming" },
              { key: "past" as const, label: "Past" },
              { key: "all" as const, label: "All" },
            ].map((range) => (
              <button
                key={range.key}
                onClick={() => setDateRange(range.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  dateRange === range.key
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <EmptyState />
          ) : (
            filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                getStatusColor={getStatusColor}
                getTypeIcon={getTypeIcon}
                formatDate={formatDate}
                formatTime={formatTime}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Appointment Card Component
const AppointmentCard: React.FC<{
  appointment: CalendarEvent;
  getStatusColor: (status: AppointmentStatus) => string;
  getTypeIcon: (type: AppointmentType) => any;
  formatDate: (date: Date) => string;
  formatTime: (date: Date) => string;
}> = ({ appointment, getStatusColor, getTypeIcon, formatDate, formatTime }) => {
  const TypeIcon = getTypeIcon(appointment.type);
  const startDate = new Date(appointment.start);
  const endDate = new Date(appointment.end);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <TypeIcon size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {appointment.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {appointment.description}
                  </p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                  appointment.status
                )}`}
              >
                {appointment.status.replace("_", " ")}
              </span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              {/* Date & Time */}
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(startDate)} • {formatTime(startDate)} -{" "}
                    {formatTime(endDate)}
                  </p>
                </div>
              </div>

              {/* Agent */}
              {appointment.agent && (
                <div className="flex items-center gap-3">
                  <User size={18} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Agent</p>
                    <p className="font-medium text-gray-900">
                      {appointment.agent.firstName} {appointment.agent.lastName}
                    </p>
                  </div>
                </div>
              )}

              {/* Property */}
              {appointment.property && (
                <div className="flex items-center gap-3">
                  <Home size={18} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Property</p>
                    <p className="font-medium text-gray-900">
                      {appointment.property.title}
                    </p>
                  </div>
                </div>
              )}

              {/* Location */}
              {appointment.location && (
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium text-gray-900">
                      {appointment.location}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {/* <div className="flex flex-col gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              View Details
            </button>
            {appointment.status === "SCHEDULED" && (
              <>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  Reschedule
                </button>
                <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium">
                  Cancel
                </button>
              </>
            )}
            {appointment.status === "CONFIRMED" && (
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                  <Video size={16} className="inline mr-1" />
                  Join
                </button>
                <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <Phone size={16} className="inline mr-1" />
                  Call
                </button>
              </div>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};

// Empty State Component
const EmptyState: React.FC = () => (
  <div className="text-center py-12">
    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <Calendar size={32} className="text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      No appointments found
    </h3>
    <p className="text-gray-600 mb-6 max-w-md mx-auto">
      You don't have any appointments scheduled yet. Schedule your first
      property viewing to get started.
    </p>
    {/* <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
      <Plus size={20} />
      Schedule Your First Appointment
    </button> */}
  </div>
);

// Loading Skeleton
const AppointmentSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4 animate-pulse"
        >
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                  <div>
                    <div className="h-5 bg-gray-200 rounded w-48 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gray-200 rounded"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-9 bg-gray-200 rounded w-24"></div>
              <div className="h-9 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AppointmentsPage;
