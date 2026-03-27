// RevealContactModal.tsx
// Slim modal: user enters Name + Phone → lead is created → owner phone is revealed.
// OTP slot is stubbed out (commented) so it can be wired in once SMS is live.

import { useState } from "react";
import {
  Loader2,
  Phone,
  User,
  X,
  CheckCircle2,
  Copy,
  MessageCircle,
} from "lucide-react";
import { useCreateLeadMutation } from "../../services/leadApi";
import type { Property } from "../../types";
import { useToast } from "../../hooks/useToast";
import { getCurrencySymbol } from "../../utils/currency-utils";

interface RevealContactModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

type Step = "form" | /* "otp" | */ "revealed";

export const RevealContactModal: React.FC<RevealContactModalProps> = ({
  property,
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  // const [otp,    setOtp]    = useState("");       // ← re-enable when SMS is live
  // const [otpErr, setOtpErr] = useState("");

  const [createLead, { isLoading }] = useCreateLeadMutation();
  const { error: showError } = useToast();

  if (!isOpen) return null;

  // ── Label copy ─────────────────────────────────────────────────────────────
  const posterLabel =
    property.postedBy === "AGENT"
      ? "Agent"
      : property.postedBy === "DEVELOPER"
        ? "Developer"
        : "Owner";

  const ctaLabel = `Contact ${posterLabel}`;

  // ── Revealed phone (primary + extras) ────────────────────────────────────
  // const ownerPhones: string[] =
  //   Array.isArray(property.ownerPhones) && property.ownerPhones.length
  //     ? (property.ownerPhones as string[]).filter(Boolean)
  //     : property.ownerPhone
  //       ? [property.ownerPhone]
  //       : [];
  const ownerPhones: string[] = property.contactPhone
    ? [property.contactPhone]
    : [];

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim()) return;

    try {
      const [firstName, ...rest] = name.trim().split(" ");
      await createLead({
        firstName,
        lastName: rest.join(" ") || undefined,
        email: email
          ? email.trim()
          : `${phone.replace(/\D/g, "")}@noemail.local`, // placeholder
        phone: phone.trim(),
        cityId: property.cityId,
        localities: [property.locality],
        propertyTypeId: property.propertyType.id,
        purpose: property.purpose,
        requirements: `Requested contact details for: ${property.title}`,
        source: "PROPERTY_INQUIRY",
        sourcePage: window.location.href,
        interestedProperties: [property.id],
        tags: [
          `property:${property.id}`,
          property.locality,
          property.city.name,
        ],
      }).unwrap();

      // ── When SMS is live, instead of revealing immediately:
      // await sendOtp(phone);
      // setStep("otp");

      setStep("revealed");
    } catch {
      showError("Error", "Failed to process request. Please try again.");
    }
  };

  // ── Copy to clipboard ─────────────────────────────────────────────────────
  const copyPhone = (num: string) => {
    navigator.clipboard.writeText(num).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm shadow-blue-200">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900">{ctaLabel}</h3>
              <p className="text-[11px] text-gray-400 truncate max-w-[200px]">
                {property.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* ── STEP 1: Form ────────────────────────────────────────────────── */}
        {step === "form" && (
          <>
            <div className="px-5 py-4 space-y-3.5">
              {/* Property preview pill */}
              <div className="flex items-center gap-2.5 p-2.5 bg-blue-50/60 border border-blue-100 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-lg overflow-hidden flex-shrink-0">
                  {property.images?.[0]?.viewableUrl ? (
                    <img
                      src={property.images[0].viewableUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Phone className="w-4 h-4 text-blue-300" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">
                    {property.title}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {property.locality}, {property.city.name}
                  </p>
                  <p className="text-[11px] font-black text-blue-700">
                    {getCurrencySymbol(property.currency)}
                    {property.price.toLocaleString()}
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-gray-500 text-center">
                Enter your details to reveal the {posterLabel.toLowerCase()}'s
                phone number
              </p>

              {/* Name */}
              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-1">
                  Your Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Arjun Singh"
                    autoComplete="name"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-1">
                  Email
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-1">
                  Your Phone Number <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <p className="text-[10px] text-gray-400 text-center">
                Your details will be saved and the {posterLabel.toLowerCase()}{" "}
                may reach out to you.
              </p>
            </div>

            <div className="px-5 pb-5">
              <button
                onClick={handleSubmit}
                disabled={isLoading || !name.trim() || !phone.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-black rounded-xl transition-colors shadow-sm shadow-blue-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing…
                  </>
                ) : (
                  <>
                    <Phone className="w-4 h-4" /> Reveal Phone Number
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* ── STEP 2 (future): OTP ────────────────────────────────────────── */}
        {/* Uncomment and wire up when SMS is implemented
        {step === "otp" && (
          <div className="px-5 py-5 space-y-4">
            <p className="text-sm text-gray-600 text-center">
              Enter the 6-digit OTP sent to <strong>{phone}</strong>
            </p>
            <input type="text" inputMode="numeric" maxLength={6}
              value={otp} onChange={(e) => setOtp(e.target.value)}
              placeholder="• • • • • •"
              className="w-full text-center text-2xl font-black tracking-widest py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
            {otpErr && <p className="text-xs text-red-500 text-center">{otpErr}</p>}
            <button onClick={handleVerifyOtp} disabled={otp.length < 6 || isLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white text-sm font-black rounded-xl transition-colors">
              {isLoading ? "Verifying…" : "Verify & Reveal"}
            </button>
            <button onClick={() => setStep("form")} className="w-full text-xs text-gray-400 hover:text-gray-600 py-1">
              ← Back
            </button>
          </div>
        )}
        */}

        {/* ── STEP 3: Revealed ────────────────────────────────────────────── */}
        {step === "revealed" && (
          <div className="px-5 py-5 space-y-4">
            {/* Success */}
            <div className="flex flex-col items-center gap-2 py-2">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-sm font-bold text-gray-900">
                Contact Details Revealed
              </p>
              <p className="text-[11px] text-gray-400 text-center">
                Your enquiry has been recorded. The {posterLabel.toLowerCase()}{" "}
                may contact you shortly.
              </p>
            </div>

            {/* Phone numbers */}
            <div className="space-y-2">
              {ownerPhones.length === 0 && (
                <p className="text-sm text-gray-400 text-center">
                  No phone number available
                </p>
              )}
              {ownerPhones.map((num, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-blue-50/60 border border-blue-100 rounded-xl"
                >
                  <div className="w-8 h-8 bg-white border border-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    {i === 0 && (
                      <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wide">
                        Primary
                      </p>
                    )}
                    <p className="text-sm font-black text-gray-900 tracking-wide">
                      {num}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {/* Copy */}
                    <button
                      onClick={() => copyPhone(num)}
                      title="Copy"
                      className="w-8 h-8 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg flex items-center justify-center transition-colors"
                    >
                      {copied ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-gray-400" />
                      )}
                    </button>
                    {/* Call */}
                    <a
                      href={`tel:${num}`}
                      className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-white" />
                    </a>
                    {/* WhatsApp */}
                    <a
                      href={`https://wa.me/${num.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi, I'm interested in ${property.title}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-emerald-500 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-white" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
