import {
  Calendar,
  Mail,
  MessageSquare,
  Phone,
  TrendingUp,
  Video,
} from "lucide-react";
import type { Property } from "../../../types";

interface PriceSidebarProps {
  property: Property;
  onInquire: () => void;
  onSchedule: () => void;
}

export const PriceSidebar: React.FC<PriceSidebarProps> = ({
  property,
  onInquire,
  onSchedule,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-6">
      <div className="mb-6">
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {property.currency} {Number(property.price).toLocaleString()}
        </div>
        <div className="text-sm text-gray-600 font-medium">
          {property.purpose === "RENT" || property.purpose === "LEASE"
            ? "per month"
            : property.purpose}
        </div>
        {property.priceNegotiable && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            Negotiable
          </div>
        )}
      </div>

      <div className="space-y-3 mb-6">
        <button
          onClick={onSchedule}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Calendar className="w-5 h-5" />
          Schedule Viewing
        </button>
        <button
          onClick={onInquire}
          className="w-full py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
        >
          <Mail className="w-5 h-5" />
          Request Info
        </button>
      </div>

      <div className="pt-6 border-t border-gray-200 space-y-3">
        <a
          href={`tel:${property.ownerPhone}`}
          className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <Phone className="w-5 h-5" />
          Call Now
        </a>
        <a
          href={`https://wa.me/${property.ownerPhone.replace(
            /\D/g,
            ""
          )}?text=${encodeURIComponent(
            `Hi, I'm interested in ${property.title}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-5 h-5" />
          WhatsApp
        </a>
      </div>

      {property.virtualTourUrl && (
        <a
          href={property.virtualTourUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full mt-3 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <Video className="w-5 h-5" />
          Virtual Tour
        </a>
      )}
    </div>
  );
};
