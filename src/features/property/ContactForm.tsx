import { MessageSquare, Phone, TrendingUp, Video } from "lucide-react";
import { useState, type FC } from "react";
import type { Property } from "../../types";

interface ContactFormProps {
  property: Property;
}

export const ContactForm: FC<ContactFormProps> = ({ property }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `I'm interested in ${property.title}`,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-6">
      <div className="mb-6">
        <div className="text-3xl font-bold text-gray-900 mb-1">
          ${property.price.toLocaleString()}
        </div>
        <div className="text-sm text-gray-600 font-medium uppercase">
          {property.purpose === "RENT" || property.purpose === "LEASE"
            ? "per month"
            : property.purpose}
        </div>
        {property.priceNegotiable && (
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            Price Negotiable
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            required
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            required
          />
        </div>
        <div>
          <input
            type="tel"
            placeholder="Your Phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            required
          />
        </div>
        <div>
          <textarea
            placeholder="Your Message"
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
        >
          Request Information
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
        <button className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
          <Phone className="w-5 h-5" />
          Call Now
        </button>
        <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
          <MessageSquare className="w-5 h-5" />
          WhatsApp
        </button>
      </div>

      {property.virtualTourUrl && (
        <button className="w-full mt-3 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
          <Video className="w-5 h-5" />
          Virtual Tour
        </button>
      )}
    </div>
  );
};
