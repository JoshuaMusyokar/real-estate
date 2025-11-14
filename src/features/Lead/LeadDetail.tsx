import React, { useState } from "react";
import { ChevronLeft, Loader2, Mail, Phone, MessageSquare } from "lucide-react";
import { useGetLeadQuery, useUpdateLeadMutation } from "../../services/leadApi";
import { OverviewTab } from "./components/OverviewTab";
import { ActivitiesTab } from "./components/ActivityTab";
import { AppointmentsTab } from "./components/AppointmentsTab";
import { NotesTab } from "./components/NotesTab";
import type { Lead } from "../../types";

interface LeadDetailProps {
  leadId: string;
}

const TABS = [
  { id: "overview", label: "Overview", count: null },
  { id: "activities", label: "Activities", count: null },
  { id: "appointments", label: "Appointments", count: null },
  { id: "notes", label: "Notes", count: null },
] as const;

type TabId = (typeof TABS)[number]["id"];

export const LeadDetail: React.FC<LeadDetailProps> = ({ leadId }) => {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const { data, isLoading, refetch } = useGetLeadQuery(leadId);
  const [updateLead] = useUpdateLeadMutation();

  const lead = data?.data;

  const handleUpdate = async (updateData: Partial<Lead>): Promise<void> => {
    try {
      await updateLead({
        id: leadId,
        data: updateData,
      }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to update lead:", error);
    }
  };

  if (isLoading || !lead) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading lead details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Leads
        </button>

        {/* Header Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {lead.firstName} {lead.lastName}
              </h1>
              <div className="flex items-center gap-4 flex-wrap text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{lead.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{lead.phone}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href={`tel:${lead.phone}`}
                className="px-4 py-2.5 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Call
              </a>
              <a
                href={`mailto:${lead.email}`}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Email
              </a>
              <a
                href={`https://wa.me/${lead.phone.replace(
                  /\D/g,
                  ""
                )}?text=${encodeURIComponent(
                  `Hi ${lead.firstName}, following up on your property inquiry.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Tabs Container */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Tab Headers */}
          <div className="border-b border-gray-200 overflow-x-auto">
            <div className="flex min-w-max">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-semibold transition-all relative whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
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
