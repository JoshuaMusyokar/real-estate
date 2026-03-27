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
import type { LeadFilter, LeadResponse } from "../../types";
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
import { usePermissions } from "../../hooks/usePermissions";

export const AllLeads: React.FC = () => {
  const navigate = useNavigate();

  // ── Single unified filter state (replaces 4 separate useState calls) ───────
  const [filters, setFilters] = useState<LeadFilter>({
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 20,
  });

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadResponse | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // ── Permissions ──────────────────────────────────────────────────────────────
  const { can } = usePermissions();
  const canAdd = can("lead.add");
  const canEdit = can("lead.edit");
  const canDelete = can("lead.delete");
  const canAssign = can("lead.assign");
  const hasAnyAction = canEdit || canDelete || canAssign;

  // ── Data ─────────────────────────────────────────────────────────────────────
  const { data, isLoading, refetch } = useGetLeadsQuery(filters);
  const [deleteLead] = useDeleteLeadMutation();

  const leads = data?.data || [];
  const pagination = data?.pagination;
  const totalPages = pagination?.pages ?? 1;
  const currentPage = filters.page ?? 1;

  // ── Handlers ──────────────────────────────────────────────────────────────────
  const handleSelectAll = () =>
    setSelectedLeads(
      selectedLeads.size === leads.length
        ? new Set()
        : new Set(leads.map((l) => l.id)),
    );

  const handleSelectLead = (id: string) => {
    const next = new Set(selectedLeads);

    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }

    setSelectedLeads(next);
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedLeads.size} leads?`)) return;
    await Promise.all(
      Array.from(selectedLeads).map((id) => deleteLead(id).unwrap()),
    ).catch(console.error);
    setSelectedLeads(new Set());
    refetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    await deleteLead(id).unwrap().catch(console.error);
    refetch();
  };

  const handleAssignAgent = () => {
    const lead = leads.find((l) => selectedLeads.has(l.id));
    if (lead) {
      setSelectedLead(lead);
      setShowAssignModal(true);
    }
  };

  const goToLeadDetails = (id: string) => navigate(`/crm/leads/${id}`);

  const formatDate = (d: string | Date) =>
    new Date(d).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                All Leads
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {pagination
                  ? `${pagination.total} total leads`
                  : "Manage and track your leads"}
              </p>
            </div>
            {canAdd && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Lead</span>
              </button>
            )}
          </div>

          {/* Filters — now receives unified filters state */}
          <LeadsFilters
            filters={filters}
            setFilters={(patch) => {
              // When filters change reset to page 1 (unless patch explicitly sets page)
              setFilters((prev) => {
                const next =
                  typeof patch === "function"
                    ? patch(prev)
                    : { ...prev, ...patch };
                return "page" in (typeof patch === "function" ? {} : patch)
                  ? next
                  : { ...next, page: 1 };
              });
            }}
            selectedLeads={selectedLeads}
            onBulkDelete={canDelete ? handleBulkDelete : undefined}
            onAssignAgent={canAssign ? handleAssignAgent : undefined}
          />
        </div>

        {/* Table */}
        <Card className="overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-16 px-4">
              <AlertCircle className="w-14 h-14 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No leads found
              </h3>
              <p className="text-sm text-gray-500">
                Try adjusting your filters or create a new lead
              </p>
            </div>
          ) : (
            <>
              {/* ── Desktop table ─────────────────────────────────────────── */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50 border-b border-gray-200">
                    <TableRow>
                      {hasAnyAction && (
                        <TableHead className="w-12">
                          <input
                            type="checkbox"
                            checked={
                              selectedLeads.size === leads.length &&
                              leads.length > 0
                            }
                            onChange={handleSelectAll}
                            className="w-4 h-4 rounded border-gray-300"
                          />
                        </TableHead>
                      )}
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
                  <TableBody className="divide-y divide-gray-100">
                    {leads.map((lead) => (
                      <TableRow
                        key={lead.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {hasAnyAction && (
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedLeads.has(lead.id)}
                              onChange={() => handleSelectLead(lead.id)}
                              className="w-4 h-4 rounded border-gray-300"
                            />
                          </TableCell>
                        )}
                        <TableCell>
                          <div className="font-semibold text-gray-900 text-sm">
                            {lead.firstName} {lead.lastName}
                          </div>
                          {lead.city && (
                            <div className="text-xs text-gray-500 mt-0.5">
                              {lead.city}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-xs text-gray-700">
                              <Mail className="w-3.5 h-3.5 text-gray-400" />
                              {lead.email}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-700">
                              <Phone className="w-3.5 h-3.5 text-gray-400" />
                              {lead.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-gray-600">
                            {lead.source.replace(/_/g, " ")}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${getStageColor(lead.stage)}`}
                          >
                            {lead.stage.replace(/_/g, " ")}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${getPriorityColor(lead.priority)}`}
                          >
                            {lead.priority}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                            <span className="font-bold text-gray-900 text-sm">
                              {lead.score}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-gray-500">
                          {formatDate(lead.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => goToLeadDetails(lead.id)}
                              title="View"
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                            {canEdit && (
                              <button
                                onClick={() => {
                                  setSelectedLead(lead);
                                  setShowUpdateModal(true);
                                }}
                                title="Edit"
                                className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4 text-blue-600" />
                              </button>
                            )}
                            {canAssign && (
                              <button
                                onClick={() => {
                                  setSelectedLead(lead);
                                  setShowAssignModal(true);
                                }}
                                title="Assign"
                                className="p-1.5 hover:bg-purple-50 rounded-lg transition-colors"
                              >
                                <UserPlus className="w-4 h-4 text-purple-600" />
                              </button>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => handleDelete(lead.id)}
                                title="Delete"
                                className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* ── Mobile card list ──────────────────────────────────────── */}
              <div className="lg:hidden divide-y divide-gray-100">
                {leads.map((lead) => (
                  <div key={lead.id} className="p-3 sm:p-4 hover:bg-gray-50">
                    <div className="flex items-start gap-3">
                      {hasAnyAction && (
                        <input
                          type="checkbox"
                          checked={selectedLeads.has(lead.id)}
                          onChange={() => handleSelectLead(lead.id)}
                          className="w-4 h-4 rounded border-gray-300 mt-1 flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="min-w-0">
                            <h3
                              onClick={() => goToLeadDetails(lead.id)}
                              className="font-semibold text-sm text-gray-900 truncate cursor-pointer hover:text-blue-600"
                            >
                              {lead.firstName} {lead.lastName}
                            </h3>
                            {lead.city && (
                              <p className="text-xs text-gray-500 truncate">
                                {lead.city}
                              </p>
                            )}
                          </div>
                          {hasAnyAction && (
                            <div className="relative flex-shrink-0">
                              <button
                                onClick={() =>
                                  setOpenMenuId(
                                    openMenuId === lead.id ? null : lead.id,
                                  )
                                }
                                className="p-1.5 hover:bg-gray-100 rounded-lg"
                              >
                                <MoreVertical className="w-4 h-4 text-gray-600" />
                              </button>
                              <Dropdown
                                isOpen={openMenuId === lead.id}
                                onClose={() => setOpenMenuId(null)}
                                className="w-40"
                              >
                                <div className="py-1">
                                  <DropdownItem
                                    onClick={() => {
                                      goToLeadDetails(lead.id);
                                      setOpenMenuId(null);
                                    }}
                                  >
                                    <Eye className="w-3.5 h-3.5 inline mr-2" />
                                    View
                                  </DropdownItem>
                                  {canEdit && (
                                    <DropdownItem
                                      onClick={() => {
                                        setSelectedLead(lead);
                                        setShowUpdateModal(true);
                                        setOpenMenuId(null);
                                      }}
                                      className="text-blue-600 hover:bg-blue-50"
                                    >
                                      <Edit className="w-3.5 h-3.5 inline mr-2" />
                                      Edit
                                    </DropdownItem>
                                  )}
                                  {canAssign && (
                                    <DropdownItem
                                      onClick={() => {
                                        setSelectedLead(lead);
                                        setShowAssignModal(true);
                                        setOpenMenuId(null);
                                      }}
                                      className="text-purple-600 hover:bg-purple-50"
                                    >
                                      <UserPlus className="w-3.5 h-3.5 inline mr-2" />
                                      Assign
                                    </DropdownItem>
                                  )}
                                  {canDelete && (
                                    <DropdownItem
                                      onClick={() => {
                                        handleDelete(lead.id);
                                        setOpenMenuId(null);
                                      }}
                                      className="text-red-600 hover:bg-red-50"
                                    >
                                      <Trash2 className="w-3.5 h-3.5 inline mr-2" />
                                      Delete
                                    </DropdownItem>
                                  )}
                                </div>
                              </Dropdown>
                            </div>
                          )}
                        </div>
                        <div className="space-y-1 mb-2">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span className="truncate">{lead.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Phone className="w-3 h-3 text-gray-400" />
                            {lead.phone}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${getStageColor(lead.stage)}`}
                          >
                            {lead.stage.replace(/_/g, " ")}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${getPriorityColor(lead.priority)}`}
                          >
                            {lead.priority}
                          </span>
                          <div className="flex items-center gap-1 text-xs">
                            <TrendingUp className="w-3 h-3 text-blue-500" />
                            <span className="font-bold text-gray-900">
                              {lead.score}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-400 ml-auto">
                            {formatDate(lead.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {pagination
                    ? `${(currentPage - 1) * (filters.limit ?? 20) + 1}–${Math.min(currentPage * (filters.limit ?? 20), pagination.total)} of ${pagination.total}`
                    : `Page ${currentPage}`}
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() =>
                      setFilters((f) => ({
                        ...f,
                        page: Math.max(1, (f.page ?? 1) - 1),
                      }))
                    }
                    disabled={currentPage === 1}
                    className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-semibold text-gray-600 px-1">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setFilters((f) => ({
                        ...f,
                        page: Math.min(totalPages, (f.page ?? 1) + 1),
                      }))
                    }
                    disabled={currentPage >= totalPages}
                    className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>

      {canAdd && (
        <CreateLeadModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => refetch()}
        />
      )}
      {selectedLead && (
        <>
          {canEdit && (
            <UpdateLeadModal
              isOpen={showUpdateModal}
              onClose={() => {
                setShowUpdateModal(false);
                setSelectedLead(null);
              }}
              lead={selectedLead}
              onSuccess={() => refetch()}
            />
          )}
          {canAssign && (
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
          )}
        </>
      )}
    </>
  );
};
