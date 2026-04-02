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
  Building2,
  User,
  MapPin,
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

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtDate = (d: string | Date) =>
  new Date(d).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const Initials: React.FC<{ name: string; size?: string }> = ({
  name,
  size = "w-8 h-8",
}) => {
  const parts = name.trim().split(" ");
  const init =
    parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : (name[0]?.toUpperCase() ?? "?");
  return (
    <div
      className={`${size} rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-black flex-shrink-0`}
    >
      {init}
    </div>
  );
};

// ── Mobile lead card ──────────────────────────────────────────────────────────
const MobileLeadCard: React.FC<{
  lead: LeadResponse;
  selected: boolean;
  hasAnyAction: boolean;
  canEdit: boolean;
  canAssign: boolean;
  canDelete: boolean;
  menuOpen: boolean;
  onSelect: () => void;
  onView: () => void;
  onEdit: () => void;
  onAssign: () => void;
  onDelete: () => void;
  onMenuToggle: () => void;
  onMenuClose: () => void;
}> = ({
  lead,
  selected,
  hasAnyAction,
  canEdit,
  canAssign,
  canDelete,
  menuOpen,
  onSelect,
  onView,
  onEdit,
  onAssign,
  onDelete,
  onMenuToggle,
  onMenuClose,
}) => {
  const fullName = `${lead.firstName} ${lead.lastName ?? ""}`.trim();
  const firstProp = lead.interestedProperties?.[0];
  const propCount = lead.interestedProperties?.length ?? 0;

  return (
    <div className="p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
      <div className="flex items-start gap-2.5">
        {/* Checkbox */}
        {hasAnyAction && (
          <input
            type="checkbox"
            checked={selected}
            onChange={onSelect}
            className="w-4 h-4 rounded border-gray-300 mt-1 flex-shrink-0"
          />
        )}

        {/* Avatar */}
        <Initials name={fullName} size="w-9 h-9 sm:w-10 sm:h-10" />

        <div className="flex-1 min-w-0">
          {/* Row 1: name + menu */}
          <div className="flex items-start justify-between gap-1.5 mb-1.5">
            <div className="min-w-0">
              <h3
                onClick={onView}
                className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate cursor-pointer hover:text-blue-600 transition-colors"
              >
                {fullName}
              </h3>
              {/* Location */}
              {(lead.city || (lead.localities?.length ?? 0) > 0) && (
                <p className="text-[10px] text-gray-400 flex items-center gap-0.5 truncate">
                  <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                  {[lead.city, ...(lead.localities ?? [])]
                    .filter(Boolean)
                    .slice(0, 2)
                    .join(" · ")}
                </p>
              )}
            </div>

            {hasAnyAction && (
              <div className="relative flex-shrink-0">
                <button
                  onClick={onMenuToggle}
                  className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-3.5 h-3.5 text-gray-500" />
                </button>
                <Dropdown
                  isOpen={menuOpen}
                  onClose={onMenuClose}
                  className="w-40"
                >
                  <div className="py-1">
                    <DropdownItem
                      onClick={() => {
                        onView();
                        onMenuClose();
                      }}
                    >
                      <Eye className="w-3.5 h-3.5 inline mr-2" /> View
                    </DropdownItem>
                    {canEdit && (
                      <DropdownItem
                        onClick={() => {
                          onEdit();
                          onMenuClose();
                        }}
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <Edit className="w-3.5 h-3.5 inline mr-2" /> Edit
                      </DropdownItem>
                    )}
                    {canAssign && (
                      <DropdownItem
                        onClick={() => {
                          onAssign();
                          onMenuClose();
                        }}
                        className="text-purple-600 hover:bg-purple-50"
                      >
                        <UserPlus className="w-3.5 h-3.5 inline mr-2" /> Assign
                      </DropdownItem>
                    )}
                    {canDelete && (
                      <DropdownItem
                        onClick={() => {
                          onDelete();
                          onMenuClose();
                        }}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline mr-2" /> Delete
                      </DropdownItem>
                    )}
                  </div>
                </Dropdown>
              </div>
            )}
          </div>

          {/* Row 2: email + phone */}
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 mb-2">
            <span className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
              <Mail className="w-2.5 h-2.5 flex-shrink-0" />
              <span className="truncate max-w-[140px] sm:max-w-none">
                {lead.email}
              </span>
            </span>
            <span className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
              <Phone className="w-2.5 h-2.5 flex-shrink-0" />
              {lead.phone}
            </span>
          </div>

          {/* Row 3: stage + priority + score + date */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${getStageColor(lead.stage)}`}
            >
              {lead.stage.replace(/_/g, " ")}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${getPriorityColor(lead.priority)}`}
            >
              {lead.priority}
            </span>
            <span className="flex items-center gap-0.5 text-[10px] font-bold text-blue-600">
              <TrendingUp className="w-3 h-3" /> {lead.score}
            </span>
            <span className="text-[10px] text-gray-400 ml-auto">
              {fmtDate(lead.createdAt)}
            </span>
          </div>

          {/* Row 4: interested property (if any) */}
          {firstProp && (
            <div className="flex items-center gap-1.5 p-2 bg-blue-50/60 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
              <Building2 className="w-3 h-3 text-blue-400 flex-shrink-0" />
              <span className="text-[10px] font-semibold text-gray-700 dark:text-gray-300 truncate">
                {firstProp.title}
              </span>
              {propCount > 1 && (
                <span className="text-[10px] text-blue-500 font-bold flex-shrink-0">
                  +{propCount - 1}
                </span>
              )}
            </div>
          )}

          {/* Row 5: assigned agent (if any) */}
          {lead.assignedTo && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <User className="w-3 h-3 text-purple-400 flex-shrink-0" />
              <span className="text-[10px] text-gray-400">
                Assigned:{" "}
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  {lead.assignedTo.firstName} {lead.assignedTo.lastName}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────────
export const AllLeads: React.FC = () => {
  const navigate = useNavigate();

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

  const { can } = usePermissions();
  const canAdd = can("lead.add");
  const canEdit = can("lead.edit");
  const canDelete = can("lead.delete");
  const canAssign = can("lead.assign");
  const hasAnyAction = canEdit || canDelete || canAssign;

  const { data, isLoading, refetch } = useGetLeadsQuery(filters);
  const [deleteLead] = useDeleteLeadMutation();

  const leads = data?.data || [];
  const pagination = data?.pagination;
  const totalPages = pagination?.pages ?? 1;
  const currentPage = filters.page ?? 1;

  const handleSelectAll = () =>
    setSelectedLeads(
      selectedLeads.size === leads.length && leads.length > 0
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

  const goTo = (id: string) => navigate(`/crm/leads/${id}`);

  return (
    <>
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-3 sm:mb-5">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-black text-gray-900 dark:text-gray-100">
                All Leads
              </h1>
              <p className="text-[11px] sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {pagination
                  ? `${pagination.total} total leads`
                  : "Manage and track your leads"}
              </p>
            </div>
            {canAdd && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold transition flex-shrink-0 shadow-sm shadow-blue-200"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">New Lead</span>
              </button>
            )}
          </div>

          <LeadsFilters
            filters={filters}
            setFilters={(patch) => {
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

        {/* Table / Cards */}
        <Card className="overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-14">
              <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-14 px-4">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                No leads found
              </h3>
              <p className="text-xs text-gray-500">
                Try adjusting your filters or create a new lead
              </p>
            </div>
          ) : (
            <>
              {/* ── Desktop table (lg+) ───────────────────────────────────── */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <TableRow>
                      {hasAnyAction && (
                        <TableHead className="w-10">
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
                      <TableHead className="w-48">Lead</TableHead>
                      <TableHead className="w-44">Contact</TableHead>
                      <TableHead className="w-44">Properties</TableHead>
                      <TableHead className="w-32">Stage</TableHead>
                      <TableHead className="w-24">Priority</TableHead>
                      <TableHead className="w-16">Score</TableHead>
                      <TableHead className="w-36">Assigned</TableHead>
                      <TableHead className="w-24">Created</TableHead>
                      <TableHead className="w-28 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {leads.map((lead) => {
                      const fullName =
                        `${lead.firstName} ${lead.lastName ?? ""}`.trim();
                      const firstProp = lead.interestedProperties?.[0];
                      const propCount = lead.interestedProperties?.length ?? 0;
                      return (
                        <TableRow
                          key={lead.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
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

                          {/* Lead name + location */}
                          <TableCell>
                            <div className="flex items-center gap-2.5">
                              <Initials name={fullName} />
                              <div>
                                <div className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[140px]">
                                  {fullName}
                                </div>
                                {(lead.city ||
                                  (lead.localities?.length ?? 0) > 0) && (
                                  <div className="text-[10px] text-gray-400 flex items-center gap-0.5 mt-0.5 truncate max-w-[140px]">
                                    <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                                    {[lead.city, ...(lead.localities ?? [])]
                                      .filter(Boolean)
                                      .slice(0, 1)
                                      .join("")}
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>

                          {/* Contact */}
                          <TableCell>
                            <div className="space-y-0.5 max-w-[160px]">
                              <div className="flex items-center gap-1 text-[11px] text-gray-600 dark:text-gray-400 truncate">
                                <Mail className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                <span className="truncate">{lead.email}</span>
                              </div>
                              <div className="flex items-center gap-1 text-[11px] text-gray-600 dark:text-gray-400">
                                <Phone className="w-3 h-3 text-gray-400 flex-shrink-0" />{" "}
                                {lead.phone}
                              </div>
                            </div>
                          </TableCell>

                          {/* Interested properties */}
                          <TableCell>
                            {firstProp ? (
                              <div className="flex items-start gap-1.5 max-w-[160px]">
                                <Building2 className="w-3 h-3 text-blue-400 flex-shrink-0 mt-0.5" />
                                <div className="min-w-0">
                                  <p className="text-[11px] font-semibold text-gray-800 dark:text-gray-200 truncate leading-tight max-w-[130px]">
                                    {firstProp.title}
                                  </p>
                                  <p className="text-[10px] text-gray-400 truncate max-w-[130px]">
                                    {firstProp.locality},{" "}
                                    {typeof firstProp.city === "object"
                                      ? firstProp.city.name
                                      : firstProp.city}
                                  </p>
                                  {propCount > 1 && (
                                    <span className="text-[10px] text-blue-500 font-bold">
                                      +{propCount - 1}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span className="text-[10px] text-gray-300">
                                —
                              </span>
                            )}
                          </TableCell>

                          {/* Stage */}
                          <TableCell>
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap ${getStageColor(lead.stage)}`}
                            >
                              {lead.stage.replace(/_/g, " ")}
                            </span>
                          </TableCell>

                          {/* Priority */}
                          <TableCell>
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap ${getPriorityColor(lead.priority)}`}
                            >
                              {lead.priority}
                            </span>
                          </TableCell>

                          {/* Score */}
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                              <span className="text-sm font-black text-gray-900 dark:text-white">
                                {lead.score}
                              </span>
                            </div>
                          </TableCell>

                          {/* Assigned agent */}
                          <TableCell>
                            {lead.assignedTo ? (
                              <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-lg max-w-[140px]">
                                <div className="w-4 h-4 rounded bg-purple-200 dark:bg-purple-700 flex items-center justify-center flex-shrink-0">
                                  <span className="text-[9px] font-black text-purple-700 dark:text-purple-200">
                                    {lead.assignedTo.firstName[0]}
                                    {lead.assignedTo.lastName?.[0] ?? ""}
                                  </span>
                                </div>
                                <span className="text-[11px] font-semibold text-purple-800 dark:text-purple-300 truncate">
                                  {lead.assignedTo.firstName}{" "}
                                  {lead.assignedTo.lastName}
                                </span>
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                                <User className="w-3 h-3" /> Unassigned
                              </span>
                            )}
                          </TableCell>

                          {/* Created */}
                          <TableCell className="text-xs text-gray-500">
                            {fmtDate(lead.createdAt)}
                          </TableCell>

                          {/* Actions */}
                          <TableCell>
                            <div className="flex items-center justify-end gap-0.5">
                              <button
                                onClick={() => goTo(lead.id)}
                                title="View"
                                className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5 text-gray-600" />
                              </button>
                              {canEdit && (
                                <button
                                  onClick={() => {
                                    setSelectedLead(lead);
                                    setShowUpdateModal(true);
                                  }}
                                  title="Edit"
                                  className="w-7 h-7 flex items-center justify-center hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                >
                                  <Edit className="w-3.5 h-3.5 text-blue-600" />
                                </button>
                              )}
                              {canAssign && (
                                <button
                                  onClick={() => {
                                    setSelectedLead(lead);
                                    setShowAssignModal(true);
                                  }}
                                  title="Assign"
                                  className="w-7 h-7 flex items-center justify-center hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                                >
                                  <UserPlus className="w-3.5 h-3.5 text-purple-600" />
                                </button>
                              )}
                              {canDelete && (
                                <button
                                  onClick={() => handleDelete(lead.id)}
                                  title="Delete"
                                  className="w-7 h-7 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                </button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* ── Mobile / tablet card list (< lg) ─────────────────────── */}
              <div className="lg:hidden divide-y divide-gray-100 dark:divide-gray-800">
                {leads.map((lead) => (
                  <MobileLeadCard
                    key={lead.id}
                    lead={lead}
                    selected={selectedLeads.has(lead.id)}
                    hasAnyAction={hasAnyAction}
                    canEdit={canEdit}
                    canAssign={canAssign}
                    canDelete={canDelete}
                    menuOpen={openMenuId === lead.id}
                    onSelect={() => handleSelectLead(lead.id)}
                    onView={() => goTo(lead.id)}
                    onEdit={() => {
                      setSelectedLead(lead);
                      setShowUpdateModal(true);
                    }}
                    onAssign={() => {
                      setSelectedLead(lead);
                      setShowAssignModal(true);
                    }}
                    onDelete={() => handleDelete(lead.id)}
                    onMenuToggle={() =>
                      setOpenMenuId(openMenuId === lead.id ? null : lead.id)
                    }
                    onMenuClose={() => setOpenMenuId(null)}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="px-3 sm:px-4 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="text-[11px] sm:text-xs text-gray-500">
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
                    className="p-1.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 px-1">
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
                    className="p-1.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
