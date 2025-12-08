// ContactCard.tsx
import {
  Phone,
  Mail,
  MessageSquare,
  Calendar,
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
  // Determine what name to display based on postedBy type
  const getDisplayName = () => {
    const { postedBy, advertiserName, ownerName } = property;

    switch (postedBy) {
      case "OWNER":
        // Display individual owner name
        return {
          name: ownerName,
          type: "owner",
          description: "Property Owner",
          icon: <User className="w-5 h-5" />,
          color: "from-blue-500 to-blue-600",
          bgColor: "bg-blue-100",
          textColor: "text-blue-600",
        };

      case "AGENT":
        if (advertiserName) {
          // Agent with company name - show company name
          return {
            name: advertiserName,
            type: "agent-company",
            description: "Real Estate Agency",
            icon: <Building className="w-5 h-5" />,
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-100",
            textColor: "text-purple-600",
          };
        } else {
          // Agent as individual - show ownerName (agent's personal name)
          return {
            name: ownerName,
            type: "agent-individual",
            description: "Real Estate Agent",
            icon: <User className="w-5 h-5" />,
            color: "from-green-500 to-green-600",
            bgColor: "bg-green-100",
            textColor: "text-green-600",
          };
        }

      case "DEVELOPER":
        // Developer - show company name
        return {
          name: advertiserName || "Property Developer",
          type: "developer",
          description: "Property Developer",
          icon: <Building className="w-5 h-5" />,
          color: "from-orange-500 to-orange-600",
          bgColor: "bg-orange-100",
          textColor: "text-orange-600",
        };

      default:
        return {
          name: ownerName,
          type: "owner",
          description: "Property Contact",
          icon: <User className="w-5 h-5" />,
          color: "from-blue-500 to-blue-600",
          bgColor: "bg-blue-100",
          textColor: "text-blue-600",
        };
    }
  };

  // Get contact details based on type
  const getContactDetails = () => {
    const { postedBy, ownerPhone, ownerEmail, advertiserReraNumber } = property;

    // Format phone number for display
    const formatPhoneNumber = (phone: string) => {
      // Remove all non-numeric characters
      const cleaned = phone.replace(/\D/g, "");

      // Format based on length
      if (cleaned.length === 10) {
        return `+1 (${cleaned.substring(0, 3)}) ${cleaned.substring(
          3,
          6
        )}-${cleaned.substring(6)}`;
      } else if (cleaned.length === 11) {
        return `+${cleaned.substring(0, 1)} (${cleaned.substring(
          1,
          4
        )}) ${cleaned.substring(4, 7)}-${cleaned.substring(7)}`;
      } else if (cleaned.length === 12) {
        return `+${cleaned.substring(0, 2)} (${cleaned.substring(
          2,
          5
        )}) ${cleaned.substring(5, 8)}-${cleaned.substring(8)}`;
      }

      // Return as-is if formatting doesn't apply
      return phone;
    };

    return {
      phone: ownerPhone ? formatPhoneNumber(ownerPhone) : "Not available",
      email: ownerEmail || "Not available",
      whatsapp: ownerPhone || "Not available",
      reraNumber: advertiserReraNumber || null,
    };
  };

  const displayInfo = getDisplayName();
  const contactDetails = getContactDetails();

  // Generate initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "?";

    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(
        0
      )}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  // Mask contact information based on user type
  const shouldMaskContactInfo = (type: string) => {
    // For demonstration - in real app, this would check user permissions
    // Here we're showing unmasked for owner/agent, masked for others
    const userIsInterestedParty = false; // This would come from auth context

    if (userIsInterestedParty) {
      return false; // Show actual contact info
    }

    // In production, implement proper contact masking logic
    return true; // Mask contact info for public
  };

  const isMasked = shouldMaskContactInfo(displayInfo.type);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm p-6 sticky top-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Contact Information
      </h2>

      {/* Contact Person/Company Info */}
      <div className="mb-6">
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`w-16 h-16 bg-gradient-to-br ${displayInfo.color} rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0`}
          >
            {displayInfo.name ? getInitials(displayInfo.name) : "?"}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-900 text-lg truncate">
                {displayInfo.name || "Contact not available"}
              </h3>

              {/* Verification Badge */}
              {property.verified && (
                <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs">
                  <BadgeCheck className="w-3 h-3" />
                  Verified
                </div>
              )}
            </div>

            <p className="text-sm text-gray-600 mb-2">
              {displayInfo.description}
            </p>

            {/* RERA Number if available */}
            {contactDetails.reraNumber && displayInfo.type !== "owner" && (
              <div className="flex items-center gap-2 mt-2">
                <Shield className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500 font-medium">
                  RERA: {contactDetails.reraNumber}
                </span>
              </div>
            )}

            {/* Posting Type Indicator */}
            <div className="mt-2">
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${displayInfo.bgColor} ${displayInfo.textColor}`}
              >
                {displayInfo.icon}
                {displayInfo.type === "owner" && "Owner Listed"}
                {displayInfo.type === "agent-individual" && "Agent Listed"}
                {displayInfo.type === "agent-company" && "Agency Listed"}
                {displayInfo.type === "developer" && "Developer Listed"}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="space-y-3">
          {/* Phone */}
          <a
            href={isMasked ? "#" : `tel:${property.ownerPhone}`}
            onClick={
              isMasked
                ? (e) => {
                    e.preventDefault();
                    onInquire();
                  }
                : undefined
            }
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group cursor-pointer"
          >
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors flex-shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-600 mb-0.5">
                {isMasked ? "Request contact number" : "Call"}
              </div>
              <div className="font-semibold text-gray-900 truncate">
                {isMasked ? "Click to request contact" : contactDetails.phone}
              </div>
            </div>
          </a>

          {/* Email */}
          <a
            href={
              isMasked
                ? "#"
                : `mailto:${property.ownerEmail}?subject=Inquiry about ${property.title}`
            }
            onClick={
              isMasked
                ? (e) => {
                    e.preventDefault();
                    onInquire();
                  }
                : undefined
            }
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group cursor-pointer"
          >
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors flex-shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-600 mb-0.5">
                {isMasked ? "Request email address" : "Email"}
              </div>
              <div className="font-semibold text-gray-900 truncate">
                {isMasked ? "Click to request email" : contactDetails.email}
              </div>
            </div>
          </a>

          {/* WhatsApp - Only show if phone is available */}
          {property.ownerPhone && (
            <a
              href={
                isMasked
                  ? "#"
                  : `https://wa.me/${property.ownerPhone.replace(
                      /\D/g,
                      ""
                    )}?text=Hi, I'm interested in ${property.title}`
              }
              target={isMasked ? "_self" : "_blank"}
              rel="noopener noreferrer"
              onClick={
                isMasked
                  ? (e) => {
                      e.preventDefault();
                      onInquire();
                    }
                  : undefined
              }
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group cursor-pointer"
            >
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors flex-shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-600 mb-0.5">
                  {isMasked ? "Request WhatsApp contact" : "WhatsApp"}
                </div>
                <div className="font-semibold text-gray-900 truncate">
                  {isMasked ? "Click to request WhatsApp" : "Chat on WhatsApp"}
                </div>
              </div>
            </a>
          )}
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-6 space-y-3">
        {/* Response Time */}
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-800 font-medium">
              {displayInfo.type === "owner"
                ? "Owner typically responds within 24 hours"
                : "Typically responds within 1 hour"}
            </span>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              {property.viewCount}
            </div>
            <div className="text-xs text-gray-600">Views</div>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              {property.inquiryCount}
            </div>
            <div className="text-xs text-gray-600">Inquiries</div>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              {property.shareCount}
            </div>
            <div className="text-xs text-gray-600">Shares</div>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="text-xs text-gray-500 pt-3 border-t border-gray-200">
          <p>
            {isMasked
              ? "Contact details are protected. Send an inquiry to get contact information."
              : "This contact information is visible because you are logged in."}
          </p>
        </div>
      </div>
    </div>
  );
};
