import { User, Phone, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import type { Property } from "../../../types";
import { DetailItem } from "./DetailItem";

export const OwnerInfoSection: React.FC<{ property: Property }> = ({
  property,
}) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // Build canonical phones array — prefer ownerPhones[], fall back to ownerPhone scalar
  const phones: string[] =
    Array.isArray(property.ownerPhones) &&
    (property.ownerPhones as string[]).filter(Boolean).length
      ? (property.ownerPhones as string[]).filter(Boolean)
      : property.ownerPhone
        ? [property.ownerPhone]
        : [];

  const copyPhone = (num: string, idx: number) => {
    navigator.clipboard.writeText(num).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    });
  };

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <User className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Owner Information
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <DetailItem label="Name" value={property.ownerName} />

        {/* Email */}
        <DetailItem label="Email" value={property.ownerEmail} />

        {/* Owner ID */}
        <DetailItem label="Owner ID" value={property.ownerId} />

        {/* ── Phone Numbers ───────────────────────────────────────────── */}
        <div className="md:col-span-2">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5" />
            Phone Number{phones.length > 1 ? "s" : ""}
            <span className="ml-1 px-1.5 py-0.5 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 text-[10px] font-bold rounded-full">
              {phones.length || "—"}
            </span>
          </p>

          {phones.length === 0 ? (
            <p className="text-sm text-gray-400 italic">
              No phone number available
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {phones.map((num, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-700 rounded-xl px-3 py-2 shadow-sm"
                >
                  {/* Primary badge */}
                  {idx === 0 && (
                    <span className="text-[10px] font-black uppercase tracking-wide bg-amber-500 text-white px-1.5 py-0.5 rounded-full flex-shrink-0">
                      Primary
                    </span>
                  )}

                  {/* Number */}
                  <a
                    href={`tel:${num}`}
                    className="text-sm font-bold text-gray-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors tracking-wide"
                  >
                    {num}
                  </a>

                  {/* Copy button */}
                  <button
                    type="button"
                    title="Copy"
                    onClick={() => copyPhone(num, idx)}
                    className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors flex-shrink-0"
                  >
                    {copiedIdx === idx ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-gray-400" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
