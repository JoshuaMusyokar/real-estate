/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Phone,
  Mail,
  MessageSquare,
  User,
  Building,
  Shield,
  BadgeCheck,
} from "lucide-react";
import type { Property } from "../../../types";

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
  const getDisplayInfo = () => {
    const { postedBy, advertiserName, ownerName } = property;
    switch (postedBy) {
      case "OWNER":
        return {
          name: ownerName,
          description: "Property Owner",
          icon: <User className="w-3.5 h-3.5" />,
          badgeClass: "bg-blue-50 text-blue-700 border-blue-100",
          avatarClass: "from-blue-500 to-blue-600",
          label: "Owner Listed",
        };
      case "AGENT":
        return {
          name: advertiserName || ownerName,
          description: advertiserName
            ? "Real Estate Agency"
            : "Real Estate Agent",
          icon: <User className="w-3.5 h-3.5" />,
          badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-100",
          avatarClass: "from-indigo-500 to-indigo-600",
          label: "Agent Listed",
        };
      case "DEVELOPER":
        return {
          name: advertiserName || "Developer",
          description: "Property Developer",
          icon: <Building className="w-3.5 h-3.5" />,
          badgeClass: "bg-amber-50 text-amber-700 border-amber-100",
          avatarClass: "from-amber-500 to-orange-500",
          label: "Developer Listed",
        };
      default:
        return {
          name: ownerName,
          description: "Property Contact",
          icon: <User className="w-3.5 h-3.5" />,
          badgeClass: "bg-blue-50 text-blue-700 border-blue-100",
          avatarClass: "from-blue-500 to-blue-600",
          label: "Owner Listed",
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
      return `+1 (${c.slice(0, 3)}) ${c.slice(3, 6)}-${c.slice(6)}`;
    return phone;
  };

  // In a real app, use auth context. Here all contacts are shown.
  const isMasked = false;

  const contactMethods = [
    {
      href: isMasked ? "#" : `tel:${property.ownerPhone}`,
      label: isMasked ? "Request contact" : "Call",
      value: isMasked
        ? "Click to request contact"
        : property.ownerPhone
          ? formatPhone(property.ownerPhone)
          : "Not available",
      icon: <Phone className="w-3.5 h-3.5" />,
      hoverBg: "hover:text-blue-600 hover:bg-blue-50",
      onClick: isMasked
        ? (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            onInquire();
          }
        : undefined,
    },
    {
      href: isMasked
        ? "#"
        : `mailto:${property.ownerEmail}?subject=Inquiry about ${property.title}`,
      label: isMasked ? "Request email" : "Email",
      value: isMasked
        ? "Click to request email"
        : property.ownerEmail || "Not available",
      icon: <Mail className="w-3.5 h-3.5" />,
      hoverBg: "hover:text-emerald-600 hover:bg-emerald-50",
      onClick: isMasked
        ? (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            onInquire();
          }
        : undefined,
    },
    ...(property.ownerPhone
      ? [
          {
            href: isMasked
              ? "#"
              : `https://wa.me/${property.ownerPhone.replace(/\D/g, "")}?text=Hi, I'm interested in ${property.title}`,
            label: isMasked ? "Request WhatsApp" : "WhatsApp",
            value: isMasked ? "Click to request WhatsApp" : "Chat on WhatsApp",
            icon: <MessageSquare className="w-3.5 h-3.5" />,
            hoverBg: "hover:text-teal-600 hover:bg-teal-50",
            onClick: isMasked
              ? (e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  onInquire();
                }
              : undefined,
          },
        ]
      : []),
  ];

  return (
    <div className="bg-white border border-blue-100 rounded-xl p-4 sm:p-5 sticky top-4">
      <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-4">
        Contact Information
      </h2>

      {/* Avatar + name */}
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
          <p className="text-[11px] text-gray-500 mb-1.5">{info.description}</p>
          {property.advertiserReraNumber && property.postedBy !== "OWNER" && (
            <div className="flex items-center gap-1 text-[10px] text-gray-400">
              <Shield className="w-3 h-3" /> RERA:{" "}
              {property.advertiserReraNumber}
            </div>
          )}
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border mt-1.5 ${info.badgeClass}`}
          >
            {info.icon} {info.label}
          </span>
        </div>
      </div>

      {/* Contact methods */}
      <div className="space-y-1.5 mb-4">
        {contactMethods.map((m, i) => (
          <a
            key={i}
            href={m.href}
            onClick={m.onClick}
            target={m.href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className={`flex items-center gap-2.5 p-2.5 bg-gray-50/80 hover:bg-blue-50/40 border border-gray-100 hover:border-blue-100 rounded-xl transition-all group cursor-pointer`}
          >
            <div
              className={`w-8 h-8 bg-white border border-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 text-gray-400 group-hover:border-blue-100 ${m.hoverBg} transition-colors`}
            >
              {m.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] text-gray-400 font-medium">
                {m.label}
              </div>
              <div className="text-xs font-semibold text-gray-800 truncate">
                {m.value}
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Response time */}
      <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl mb-3">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse flex-shrink-0" />
        <span className="text-[11px] text-emerald-700 font-medium">
          {property.postedBy === "OWNER"
            ? "Owner typically responds within 24 hours"
            : "Typically responds within 1 hour"}
        </span>
      </div>

      {/* Stats */}
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
            <div className="text-sm font-black text-blue-700">{value ?? 0}</div>
            <div className="text-[10px] text-gray-500 font-medium">{label}</div>
          </div>
        ))}
      </div>

      {/* Privacy note */}
      <p className="text-[10px] text-gray-400 pt-2.5 border-t border-blue-50 leading-relaxed">
        {isMasked
          ? "Contact details are protected. Send an inquiry to get contact information."
          : "Contact information is visible to registered users."}
      </p>
    </div>
  );
};
