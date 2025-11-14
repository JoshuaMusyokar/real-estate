/* eslint-disable @typescript-eslint/no-unused-vars */
import { Phone, Mail, MessageSquare, Calendar } from "lucide-react";
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
  // Company contact details (masked - not owner's)
  const companyContact = {
    name: "ABC Realty",
    phone: "+x (xxx) xxx-xxxx",
    email: "xxx@xxxx.com",
    whatsapp: "+x (xxx) xxx-xxxx",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Contact Property Agent
      </h2>

      {/* Agent/Company Info */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {companyContact.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">
              {companyContact.name}
            </h3>
            <p className="text-sm text-gray-600">Licensed Real Estate Agent</p>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="space-y-3">
          {/* Phone */}

          <a
            href={`tel:${companyContact.phone}`}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
          >
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-0.5">Call us</div>
              <div className="font-semibold text-gray-900">
                {companyContact.phone}
              </div>
            </div>
          </a>

          {/* Email */}

          <a
            href={`mailto:${companyContact.email}?subject=Inquiry about ${property.title}`}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
          >
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-0.5">Email us</div>
              <div className="font-semibold text-gray-900">
                {companyContact.email}
              </div>
            </div>
          </a>

          {/* WhatsApp */}

          <a
            href={`https://wa.me/${companyContact.whatsapp.replace(
              /\D/g,
              ""
            )}?text=Hi, I'm interested in ${property.title}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
          >
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-0.5">WhatsApp</div>
              <div className="font-semibold text-gray-900">Chat with us</div>
            </div>
          </a>
        </div>
      </div>

      {/* Response Time Badge */}
      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-800 font-medium">
            Typically responds within 1 hour
          </span>
        </div>
      </div>
    </div>
  );
};
