import React, { useState } from "react";
import {
  ChevronLeft,
  Loader2,
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  User,
  Calendar,
  Clock,
  Building2,
  Star,
  Activity,
  CheckSquare,
  FileText,
} from "lucide-react";
import { useGetLeadQuery, useUpdateLeadMutation } from "../../services/leadApi";
import { OverviewTab } from "./components/OverviewTab";
import { ActivitiesTab } from "./components/ActivityTab";
import { AppointmentsTab } from "./components/AppointmentsTab";
import { NotesTab } from "./components/NotesTab";
import { getPriorityColor, getStageColor } from "../../utils";
import type { Lead } from "../../types";

interface LeadDetailProps {
  leadId: string;
}

const TABS = [
  { id: "overview", label: "Overview", icon: FileText },
  { id: "activities", label: "Activities", icon: Activity },
  { id: "appointments", label: "Appointments", icon: Calendar },
  { id: "notes", label: "Notes", icon: CheckSquare },
] as const;
type TabId = (typeof TABS)[number]["id"];

const fmt = (d: string | Date | null | undefined, short = false) => {
  if (!d) return null;
  return new Date(d).toLocaleDateString(
    "en-IN",
    short
      ? { day: "numeric", month: "short", year: "numeric" }
      : {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        },
  );
};

// const currency = (n: number) =>
//   new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//     maximumFractionDigits: 0,
//   }).format(n);

// ── Score ring ────────────────────────────────────────────────────────────────
const ScoreRing: React.FC<{ score: number }> = ({ score }) => {
  const pct = Math.min(100, score);
  const color = pct >= 70 ? "#22c55e" : pct >= 40 ? "#f59e0b" : "#3b82f6";
  const dash = 2 * Math.PI * 20;
  const offset = dash * (1 - pct / 100);
  return (
    <div className="relative w-14 h-14 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="4"
        />
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={dash}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-black text-gray-900">{score}</span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
export const LeadDetail: React.FC<LeadDetailProps> = ({ leadId }) => {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const { data, isLoading, refetch } = useGetLeadQuery(leadId);
  const [updateLead] = useUpdateLeadMutation();

  const lead = data?.data;

  const handleUpdate = async (updateData: Partial<Lead>) => {
    try {
      await updateLead({ id: leadId, data: updateData }).unwrap();
      refetch();
    } catch {
      //
    }
  };

  if (isLoading || !lead)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500 font-medium">Loading lead...</p>
        </div>
      </div>
    );

  const initials =
    `${lead.firstName[0]}${lead.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-full mx-auto">
        {/* Back */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-1 text-[11px] sm:text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white mb-4 font-medium transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Leads
        </button>

        {/* ── Hero header card ─────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-3 sm:p-4 md:p-5 mb-3 shadow-sm">
          {/* Top row: avatar + name + stage badge */}
          <div className="flex items-start gap-2.5 sm:gap-3 mb-3">
            {/* Avatar */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-sm sm:text-base font-black flex-shrink-0 shadow-md shadow-blue-200">
              {initials}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <h1 className="text-base sm:text-lg md:text-xl font-black text-gray-900 dark:text-white truncate">
                    {lead.firstName} {lead.lastName}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${getStageColor(lead.stage)}`}
                    >
                      {lead.stage.replace(/_/g, " ")}
                    </span>
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${getPriorityColor(lead.priority)}`}
                    >
                      {lead.priority}
                    </span>
                    {lead.isActive ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />{" "}
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-400 font-semibold">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>

                {/* Score ring — desktop */}
                <div className="hidden sm:flex flex-col items-center gap-0.5">
                  <ScoreRing score={lead.score} />
                  <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wide">
                    Score
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact row */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <a
              href={`mailto:${lead.email}`}
              className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors bg-gray-50 dark:bg-gray-800 rounded-lg px-2 py-1"
            >
              <Mail className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate max-w-[160px] sm:max-w-none">
                {lead.email}
              </span>
            </a>
            <a
              href={`tel:${lead.phone}`}
              className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors bg-gray-50 dark:bg-gray-800 rounded-lg px-2 py-1"
            >
              <Phone className="w-3.5 h-3.5 flex-shrink-0" />
              {lead.phone}
            </a>
            {lead.alternatePhone && (
              <a
                href={`tel:${lead.alternatePhone}`}
                className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors bg-gray-50 dark:bg-gray-800 rounded-lg px-2 py-1"
              >
                <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                {lead.alternatePhone}
              </a>
            )}
            {/* City / localities */}
            {(lead.city || (lead.localities?.length ?? 0) > 0) && (
              <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg px-2.5 py-1.5">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-blue-400" />
                <span>
                  {[lead.city?.name, ...(lead.localities ?? [])]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </div>
            )}
          </div>

          {/* Stat pills row */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 mb-3">
            {[
              {
                label: "Activities",
                value: lead.activitiesCount,
                icon: Activity,
              },
              {
                label: "Appointments",
                value: lead.appointmentsCount,
                icon: Calendar,
              },
              {
                label: "Properties",
                value: lead.interestedProperties?.length ?? 0,
                icon: Building2,
              },
              {
                label: "Source",
                value: lead.source.replace(/_/g, " "),
                icon: Star,
                text: true,
              },
              {
                label: "Created",
                value: fmt(lead.createdAt, true),
                icon: Clock,
                text: true,
              },
            ].map(({ label, value, icon: Icon, text }) => (
              <div
                key={label}
                className="bg-blue-50/60 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl px-2 py-1.5 text-center"
              >
                <Icon className="w-3 h-3 text-blue-400 mx-auto mb-0.5" />
                <div
                  className={`font-black text-gray-900 dark:text-white ${text ? "text-[9px] sm:text-[10px]" : "text-sm"}`}
                >
                  {value ?? 0}
                </div>
                <div className="text-[9px] text-gray-400 font-medium">
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <a
              href={`tel:${lead.phone}`}
              className="flex items-center gap-1 px-2.5 py-1.5 border border-gray-200 dark:border-gray-700 rounded-xl text-[11px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" /> Call
            </a>
            <a
              href={`mailto:${lead.email}`}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors"
            >
              <Mail className="w-3.5 h-3.5" /> Email
            </a>
            <a
              href={`https://wa.me/${lead.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${lead.firstName}, following up on your property inquiry.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
            </a>
            {lead.assignedTo && (
              <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 ml-auto">
                <User className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden sm:inline">Assigned: </span>
                {lead.assignedTo.firstName} {lead.assignedTo.lastName}
              </div>
            )}
          </div>
        </div>

        {/* ── Tabs ─────────────────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
          {/* Tab bar */}
          <div
            className="border-b border-gray-200 dark:border-gray-800 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            <div className="flex min-w-max">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-1.5 px-3 sm:px-4 py-3 text-[11px] sm:text-xs font-semibold transition-all relative whitespace-nowrap
                    ${
                      activeTab === id
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                    }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                  {activeTab === id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="p-3 sm:p-4 md:p-5">
            {activeTab === "overview" && (
              <OverviewTab lead={lead} onUpdate={handleUpdate} />
            )}
            {activeTab === "activities" && <ActivitiesTab leadId={leadId} />}
            {activeTab === "appointments" && (
              <AppointmentsTab leadId={leadId} />
            )}
            {activeTab === "notes" && <NotesTab leadId={leadId} />}
          </div>
        </div>
      </div>
    </div>
  );
};
