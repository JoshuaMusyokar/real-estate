/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Loader2,
  Mail,
  Phone,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import { CreateLeadModal } from "./components/CreateLeadModal";
import { AssignLeadModal } from "./components/AssignAgentModal";
import { UpdateLeadModal } from "./components/LeadUpdateModal";
import {
  getPriorityColor,
  getStageColor,
  LEAD_PRIORITIES,
  LEAD_SOURCES,
  LEAD_STAGES,
} from "../../utils";
import type {
  LeadPriority,
  LeadResponse,
  LeadSource,
  LeadStage,
} from "../../types";
import {
  useDeleteLeadMutation,
  useGetLeadsQuery,
  useUpdateLeadMutation,
} from "../../services/leadApi";
import { useState } from "react";
import { useNavigate } from "react-router";

export const AllLeads: React.FC = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSource, setSelectedSource] = useState<LeadSource | "">("");
  const [selectedStage, setSelectedStage] = useState<LeadStage | "">("");
  const [selectedPriority, setSelectedPriority] = useState<LeadPriority | "">(
    ""
  );
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadResponse | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());

  const { data, isLoading, refetch } = useGetLeadsQuery({
    search: searchTerm || undefined,
    source: selectedSource || undefined,
    stage: selectedStage || undefined,
    priority: selectedPriority || undefined,
  });

  const [updateLead] = useUpdateLeadMutation();
  const [deleteLead] = useDeleteLeadMutation();

  const leads = data?.data || [];
  const totalPages = data?.pagination?.total || 1;

  const handleSelectAll = (): void => {
    if (selectedLeads.size === leads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(leads.map((lead) => lead.id)));
    }
  };

  const handleSelectLead = (leadId: string): void => {
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(leadId)) {
      newSelected.delete(leadId);
    } else {
      newSelected.add(leadId);
    }
    setSelectedLeads(newSelected);
  };

  const handleBulkDelete = async (): Promise<void> => {
    if (!confirm(`Delete ${selectedLeads.size} leads?`)) return;

    try {
      await Promise.all(
        Array.from(selectedLeads).map((id) => deleteLead(id).unwrap())
      );
      setSelectedLeads(new Set());
      refetch();
    } catch (error) {
      console.error("Failed to delete leads:", error);
    }
  };

  const handleDelete = async (leadId: string): Promise<void> => {
    if (!confirm("Delete this lead?")) return;

    try {
      await deleteLead(leadId).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to delete lead:", error);
    }
  };

  const formatDate = (date: string | Date): string => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const goToLeadDetails = (leadId: string) => {
    navigate(`/crm/leads/${leadId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto px-1 sm:px-2 lg:px-4 py-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Leads</h1>
              <p className="text-gray-600 mt-1">
                Manage and track all your leads in one place
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              New Lead
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <select
                value={selectedSource}
                onChange={(e) =>
                  setSelectedSource(e.target.value as LeadSource | "")
                }
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Sources</option>
                {LEAD_SOURCES.map((source) => (
                  <option key={source} value={source}>
                    {source.replace(/_/g, " ")}
                  </option>
                ))}
              </select>

              <select
                value={selectedStage}
                onChange={(e) =>
                  setSelectedStage(e.target.value as LeadStage | "")
                }
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Stages</option>
                {LEAD_STAGES.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage.replace(/_/g, " ")}
                  </option>
                ))}
              </select>

              <select
                value={selectedPriority}
                onChange={(e) =>
                  setSelectedPriority(e.target.value as LeadPriority | "")
                }
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Priorities</option>
                {LEAD_PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>

            {selectedLeads.size > 0 && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                <span className="text-blue-700 font-semibold">
                  {selectedLeads.size} lead(s) selected
                </span>
                <div className="flex gap-2">
                  {selectedLeads.size === 1 && (
                    <button
                      onClick={() => {
                        const leadId = Array.from(selectedLeads)[0];
                        const lead = leads.find((l) => l.id === leadId);
                        if (lead) {
                          setSelectedLead(lead);
                          setShowAssignModal(true);
                        }
                      }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      Assign to Agent
                    </button>
                  )}
                  <button
                    onClick={handleBulkDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Selected
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-20">
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No leads found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters or create a new lead
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left">
                        <input
                          type="checkbox"
                          checked={selectedLeads.size === leads.length}
                          onChange={handleSelectAll}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Source
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Stage
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {leads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedLeads.has(lead.id)}
                            onChange={() => handleSelectLead(lead.id)}
                            className="w-4 h-4 rounded border-gray-300"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">
                            {lead.firstName} {lead.lastName}
                          </div>
                          {lead.city && (
                            <div className="text-sm text-gray-600">
                              {lead.city}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Mail className="w-4 h-4 text-gray-400" />
                              {lead.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Phone className="w-4 h-4 text-gray-400" />
                              {lead.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700">
                            {lead.source.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 rounded-lg text-xs font-semibold ${getStageColor(
                              lead.stage
                            )}`}
                          >
                            {lead.stage.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 rounded-lg text-xs font-semibold ${getPriorityColor(
                              lead.priority
                            )}`}
                          >
                            {lead.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold text-gray-900">
                              {lead.score}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(lead.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => goToLeadDetails(lead.id)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title="View details"
                            >
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedLead(lead);
                                setShowUpdateModal(true);
                              }}
                              className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit lead"
                            >
                              <Edit className="w-4 h-4 text-blue-600" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedLead(lead);
                                setShowAssignModal(true);
                              }}
                              className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Assign to agent"
                            >
                              <UserPlus className="w-4 h-4 text-purple-600" />
                            </button>
                            <button
                              onClick={() => handleDelete(lead.id)}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete lead"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="p-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    className="p-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <CreateLeadModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => refetch()}
      />

      {selectedLead && (
        <>
          <UpdateLeadModal
            isOpen={showUpdateModal}
            onClose={() => {
              setShowUpdateModal(false);
              setSelectedLead(null);
            }}
            lead={selectedLead}
            onSuccess={() => refetch()}
          />
          <AssignLeadModal
            isOpen={showAssignModal}
            onClose={() => {
              setShowAssignModal(false);
              setSelectedLead(null);
            }}
            lead={selectedLead}
            onSuccess={() => {
              refetch();
              setSelectedLeads(new Set());
            }}
          />
        </>
      )}
    </div>
  );
};
