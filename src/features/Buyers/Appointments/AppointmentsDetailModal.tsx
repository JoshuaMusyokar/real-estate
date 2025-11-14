/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  User,
  Home,
  Phone,
  Mail,
  Download,
} from "lucide-react";
import type { CalendarEvent } from "../../../types";
import { format } from "date-fns";

interface AppointmentDetailsModalProps {
  appointment: CalendarEvent;
  isOpen: boolean;
  onClose: () => void;
}

export const AppointmentDetailsModal: React.FC<
  AppointmentDetailsModalProps
> = ({ appointment, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Appointment Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Appointment Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium">
                      {format(appointment.start, "EEEE, MMMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-medium">
                      {format(appointment.start, "h:mm a")} -{" "}
                      {format(appointment.end, "h:mm a")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{appointment.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Agent Info */}
            {appointment.agent && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Agent Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">
                        {appointment.agent.firstName}{" "}
                        {appointment.agent.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{appointment.agent.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{appointment.lead?.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Property Info */}
          {appointment.property && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Property Information
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900">
                  {appointment.property.title}
                </h4>
                <p className="text-gray-600 text-sm mt-1">
                  {appointment.property.locality}, {appointment.property.city}
                </p>
                <p className="text-blue-600 font-semibold mt-2">
                  ${appointment.property.price.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Add to Calendar
            </button>
            <button className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2">
              <Download size={20} />
              Download Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
