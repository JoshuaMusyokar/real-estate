/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import {
  User,
  Building,
  Shield,
  BadgeCheck,
  Phone,
  Mail,
  MessageCircle,
  Eye,
} from "lucide-react";
import type { Property } from "../../../types";
import { RevealContactModal } from "../../../components/form/RevealContactModal";

interface ContactCardProps {
  property: Property;
  onInquire: () => void;
  onSchedule: () => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  property,
  onInquire,
  onSchedule,
}) => {
  const [showReveal, setShowReveal] = useState(false);

  const getDisplayInfo = () => {
    const { postedBy, advertiserName } = property;
    const listingName = property.contactName || advertiserName || "";

    switch (postedBy) {
      case "OWNER":
        return {
          name: listingName,
          description: "Property Owner",
          icon: <User className="w-3.5 h-3.5" />,
          badgeClass: "bg-blue-50 text-blue-700 border-blue-100",
          avatarClass: "from-blue-500 to-blue-600",
          label: "Owner Listed",
          ctaLabel: "Contact Owner",
        };
      case "AGENT":
        return {
          name: advertiserName || listingName,
          description: advertiserName
            ? "Real Estate Agency"
            : "Real Estate Agent",
          icon: <User className="w-3.5 h-3.5" />,
          badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-100",
          avatarClass: "from-indigo-500 to-indigo-600",
          label: "Agent Listed",
          ctaLabel: "Contact Agent / Broker",
        };
      case "DEVELOPER":
        return {
          name: advertiserName || listingName,
          description: "Property Developer",
          icon: <Building className="w-3.5 h-3.5" />,
          badgeClass: "bg-amber-50 text-amber-700 border-amber-100",
          avatarClass: "from-amber-500 to-orange-500",
          label: "Developer Listed",
          ctaLabel: "Contact Developer",
        };
      default:
        return {
          name: listingName,
          description: "Property Contact",
          icon: <User className="w-3.5 h-3.5" />,
          badgeClass: "bg-blue-50 text-blue-700 border-blue-100",
          avatarClass: "from-blue-500 to-blue-600",
          label: "Owner Listed",
          ctaLabel: "Contact Owner",
        };
    }
  };

  const info = getDisplayInfo();

  const getInitials = (name: string) => {
    if (!name) return "?";
    const parts = name.split(" ");
    return parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : name[0].toUpperCase();
  };

  const formatPhone = (phone: string) => {
    const c = phone.replace(/\D/g, "");
    if (c.length === 10)
      return `(${c.slice(0, 3)}) ${c.slice(3, 6)}-${c.slice(6)}`;
    return phone;
  };

  // ownerPhone is the actual property owner's number — masked, reveal via modal
  const hasOwnerContact = !!(
    property.ownerPhone ||
    property.ownerEmail ||
    property.ownerName
  );

  return (
    <>
      <div className="bg-white border border-blue-100 rounded-xl p-4 sm:p-5 sticky top-4">
        <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-4">
          Contact Information
        </h2>

        {/* ── Avatar + listing user name ─────────────────────────────────── */}
        <div className="flex items-start gap-3 mb-4">
          <div
            className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${info.avatarClass} rounded-xl flex items-center justify-center text-white text-lg font-black flex-shrink-0 shadow-md`}
          >
            {info.name ? getInitials(info.name) : "?"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              <span className="text-sm font-bold text-gray-900 truncate">
                {info.name || "Contact not available"}
              </span>
              {property.verified && (
                <span className="flex items-center gap-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                  <BadgeCheck className="w-2.5 h-2.5" /> Verified
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500 mb-1.5">
              {info.description}
            </p>
            {property.advertiserReraNumber && property.postedBy !== "OWNER" && (
              <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-1.5">
                <Shield className="w-3 h-3" /> RERA:{" "}
                {property.advertiserReraNumber}
              </div>
            )}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${info.badgeClass}`}
            >
              {info.icon} {info.label}
            </span>
          </div>
        </div>
        {/* ── Response time ──────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl mb-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse flex-shrink-0" />
          <span className="text-[11px] text-emerald-700 font-medium">
            {property.postedBy === "OWNER"
              ? "Owner typically responds within 24 hours"
              : "Typically responds within 1 hour"}
          </span>
        </div>

        {/* ── Stats ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          {[
            { label: "Views", value: property.viewCount },
            { label: "Inquiries", value: property.inquiryCount },
            { label: "Shares", value: property.shareCount },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="text-center py-2 bg-blue-50/60 border border-blue-100 rounded-xl"
            >
              <div className="text-sm font-black text-blue-700">
                {value ?? 0}
              </div>
              <div className="text-[10px] text-gray-500 font-medium">
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Privacy note ──────────────────────────────────────────────── */}
        <p className="text-[10px] text-gray-400 pt-2.5 border-t border-blue-50 leading-relaxed">
          Poster details are shown directly. Property owner contact is protected
          — submit your details to reveal it.
        </p>
      </div>

      {/* Reveal modal — for property owner contact (ownerPhone/ownerEmail) */}
      <RevealContactModal
        property={property}
        isOpen={showReveal}
        onClose={() => setShowReveal(false)}
      />
    </>
  );
};
