// components/leads/AllLeads.tsx
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
  Trash2,
  TrendingUp,
  UserPlus,
  MoreVertical,
} from "lucide-react";
import { CreateLeadModal } from "./components/CreateLeadModal";
import { AssignLeadModal } from "./components/AssignAgentModal";
import { UpdateLeadModal } from "./components/LeadUpdateModal";

import { getPriorityColor, getStageColor } from "../../utils";
import type {
  LeadPriority,
  LeadResponse,
  LeadSource,
  LeadStage,
} from "../../types";
import {
  useDeleteLeadMutation,
  useGetLeadsQuery,
} from "../../services/leadApi";
import { useState } from "react";
import { useNavigate } from "react-router";
import { LeadsFilters } from "./components/LeadsFilters";
import { Card } from "../../components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Dropdown } from "../../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../../components/ui/dropdown/DropdownItem";

export const AllLeads: React.FC = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSource, setSelectedSource] = useState<LeadSource | "">("");
  const [selectedStage, setSelectedStage] = useState<LeadStage | "">("");
  const [selectedPriority, setSelectedPriority] = useState<LeadPriority | "">(
    "",
  );
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadResponse | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const { data, isLoading, refetch } = useGetLeadsQuery({
    search: searchTerm || undefined,
    source: selectedSource || undefined,
    stage: selectedStage || undefined,
    priority: selectedPriority || undefined,
  });

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
        Array.from(selectedLeads).map((id) => deleteLead(id).unwrap()),
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

  const handleAssignAgent = () => {
    const leadId = Array.from(selectedLeads)[0];
    const lead = leads.find((l) => l.id === leadId);
    if (lead) {
      setSelectedLead(lead);
      setShowAssignModal(true);
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
    <>
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                All Leads
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                Manage and track your leads
              </p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-blue-600 dark:bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Lead</span>
            </button>
          </div>

          {/* Filters */}
          <LeadsFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedSource={selectedSource}
            setSelectedSource={setSelectedSource}
            selectedStage={selectedStage}
            setSelectedStage={setSelectedStage}
            selectedPriority={selectedPriority}
            setSelectedPriority={setSelectedPriority}
            selectedLeads={selectedLeads}
            onBulkDelete={handleBulkDelete}
            onAssignAgent={handleAssignAgent}
          />
        </div>

        {/* Table */}
        <Card className="overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 sm:py-16 md:py-20">
              <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-blue-600" />
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-12 sm:py-16 md:py-20 px-4">
              <AlertCircle className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                No leads found
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Try adjusting your filters or create a new lead
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50 border-b border-gray-200">
                    <TableRow>
                      <TableHead className="w-12">
                        <input
                          type="checkbox"
                          checked={selectedLeads.size === leads.length}
                          onChange={handleSelectAll}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-200">
                    {leads.map((lead) => (
                      <TableRow
                        key={lead.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedLeads.has(lead.id)}
                            onChange={() => handleSelectLead(lead.id)}
                            className="w-4 h-4 rounded border-gray-300"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-gray-900">
                            {lead.firstName} {lead.lastName}
                          </div>
                          {lead.city && (
                            <div className="text-sm text-gray-600">
                              {lead.city}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-700">
                            {lead.source.replace(/_/g, " ")}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex px-3 py-1 rounded-lg text-xs font-semibold ${getStageColor(
                              lead.stage,
                            )}`}
                          >
                            {lead.stage.replace(/_/g, " ")}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex px-3 py-1 rounded-lg text-xs font-semibold ${getPriorityColor(
                              lead.priority,
                            )}`}
                          >
                            {lead.priority}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold text-gray-900">
                              {lead.score}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {formatDate(lead.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card List */}
              <div className="lg:hidden divide-y divide-gray-200">
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-3 sm:p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedLeads.has(lead.id)}
                        onChange={() => handleSelectLead(lead.id)}
                        className="w-4 h-4 rounded border-gray-300 mt-1 flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <h3
                              onClick={() => goToLeadDetails(lead.id)}
                              className="font-semibold text-gray-900 text-sm sm:text-base truncate cursor-pointer hover:text-blue-600"
                            >
                              {lead.firstName} {lead.lastName}
                            </h3>
                            {lead.city && (
                              <p className="text-xs text-gray-600 truncate">
                                {lead.city}
                              </p>
                            )}
                          </div>

                          <div className="relative flex-shrink-0">
                            <button
                              onClick={() =>
                                setOpenMenuId(
                                  openMenuId === lead.id ? null : lead.id,
                                )
                              }
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <MoreVertical className="w-4 h-4 text-gray-600" />
                            </button>
                            <Dropdown
                              isOpen={openMenuId === lead.id}
                              onClose={() => setOpenMenuId(null)}
                              className="w-44"
                            >
                              <div className="py-1">
                                <DropdownItem
                                  onClick={() => {
                                    goToLeadDetails(lead.id);
                                    setOpenMenuId(null);
                                  }}
                                >
                                  <Eye className="w-4 h-4 inline mr-2" />
                                  View
                                </DropdownItem>
                                <DropdownItem
                                  onClick={() => {
                                    setSelectedLead(lead);
                                    setShowUpdateModal(true);
                                    setOpenMenuId(null);
                                  }}
                                  className="text-blue-600 hover:bg-blue-50"
                                >
                                  <Edit className="w-4 h-4 inline mr-2" />
                                  Edit
                                </DropdownItem>
                                <DropdownItem
                                  onClick={() => {
                                    setSelectedLead(lead);
                                    setShowAssignModal(true);
                                    setOpenMenuId(null);
                                  }}
                                  className="text-purple-600 hover:bg-purple-50"
                                >
                                  <UserPlus className="w-4 h-4 inline mr-2" />
                                  Assign
                                </DropdownItem>
                                <DropdownItem
                                  onClick={() => {
                                    handleDelete(lead.id);
                                    setOpenMenuId(null);
                                  }}
                                  className="text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4 inline mr-2" />
                                  Delete
                                </DropdownItem>
                              </div>
                            </Dropdown>
                          </div>
                        </div>

                        <div className="space-y-1.5 mb-2">
                          <div className="flex items-center gap-2 text-xs text-gray-700">
                            <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{lead.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-700">
                            <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span>{lead.phone}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold ${getStageColor(
                              lead.stage,
                            )}`}
                          >
                            {lead.stage.replace(/_/g, " ")}
                          </span>
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold ${getPriorityColor(
                              lead.priority,
                            )}`}
                          >
                            {lead.priority}
                          </span>
                          <div className="flex items-center gap-1 text-xs">
                            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                            <span className="font-semibold text-gray-900">
                              {lead.score}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 ml-auto">
                            {formatDate(lead.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-xs sm:text-sm text-gray-600">
                  Page {page} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="p-1.5 sm:p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    className="p-1.5 sm:p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </Card>
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
    </>
  );
};
