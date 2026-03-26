// PriceSidebar.tsx
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
  const purposeLabel =
    property.purpose === "RENT" || property.purpose === "LEASE"
      ? "per month"
      : property.purpose;

  return (
    <div className="bg-white border border-blue-100 rounded-xl p-4 sm:p-5 sticky top-4">
      {/* Price */}
      <div className="mb-4 pb-4 border-b border-blue-50">
        <div className="text-2xl sm:text-3xl font-black text-gray-900 mb-0.5">
          {property.currency} {Number(property.price).toLocaleString()}
        </div>
        <div className="text-xs text-gray-400 font-medium">{purposeLabel}</div>
        {property.priceNegotiable && (
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full text-[11px] font-bold">
            <TrendingUp className="w-3 h-3" /> Price Negotiable
          </div>
        )}
      </div>

      {/* Primary CTAs */}
      <div className="space-y-2 mb-4">
        <button
          onClick={onSchedule}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-sm shadow-blue-200"
        >
          <Calendar className="w-4 h-4" /> Schedule Site Viewing
        </button>
        <button
          onClick={onInquire}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-white hover:bg-blue-50 text-blue-600 text-xs sm:text-sm font-bold rounded-xl border border-blue-200 transition-colors"
        >
          <Mail className="w-4 h-4" /> Quick Inquiry
        </button>
      </div>

      {/* Phone / WhatsApp */}
      <div className="space-y-2 pt-4 border-t border-blue-50">
        <a
          href={`tel:${property.ownerPhone}`}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-sm shadow-emerald-200"
        >
          <Phone className="w-4 h-4" /> Call Now
        </a>
        <a
          href={`https://wa.me/${property.ownerPhone?.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi, I'm interested in ${property.title}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-sm shadow-teal-200"
        >
          <MessageSquare className="w-4 h-4" /> WhatsApp
        </a>
      </div>

      {/* Virtual tour */}
      {property.virtualTourUrl && (
        <a
          href={property.virtualTourUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 bg-white hover:bg-blue-50 text-gray-600 text-xs sm:text-sm font-bold rounded-xl border border-gray-200 hover:border-blue-200 transition-colors"
        >
          <Video className="w-4 h-4" /> Virtual Tour
        </a>
      )}
    </div>
  );
};
