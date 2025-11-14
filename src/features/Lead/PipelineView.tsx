/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useMemo } from "react";
import {
  Loader2,
  Search,
  Filter,
  TrendingUp,
  Users,
  DollarSign,
  ChevronDown,
  X,
  ArrowRight,
} from "lucide-react";
import { STAGES } from "../../utils";
import type { Lead, LeadStage, LeadPriority, LeadResponse } from "../../types";
import {
  useGetLeadsQuery,
  useUpdateLeadMutation,
} from "../../services/leadApi";
import { KanbanLeadCard } from "./components/KanbanLeadCard";

const PRIORITIES: LeadPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];

export const PipelineView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [draggedLead, setDraggedLead] = useState<LeadResponse | null>(null);
  const [dragOverStage, setDragOverStage] = useState<LeadStage | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<LeadPriority | "">(
    ""
  );
  const [showFilters, setShowFilters] = useState(false);
  const [collapsedStages, setCollapsedStages] = useState<Set<LeadStage>>(
    new Set()
  );

  const { data, isLoading, refetch } = useGetLeadsQuery({
    search: searchTerm || undefined,
    priority: selectedPriority || undefined,
  });

  const [updateLead] = useUpdateLeadMutation();

  const leads = data?.data || [];

  const filteredLeads = useMemo(() => {
    let filtered = leads;

    if (selectedPriority) {
      filtered = filtered.filter((lead) => lead.priority === selectedPriority);
    }

    return filtered;
  }, [leads, selectedPriority]);

  const getLeadsByStage = (stage: LeadStage): LeadResponse[] => {
    return filteredLeads.filter((lead) => lead.stage === stage);
  };

  const handleDragStart = (e: React.DragEvent, lead: LeadResponse): void => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.classList.add("opacity-50");
  };

  const handleDragEnd = (e: React.DragEvent): void => {
    e.currentTarget.classList.remove("opacity-50");
    setDragOverStage(null);
  };

  const handleDragOver = (e: React.DragEvent, stage: LeadStage): void => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverStage(stage);
  };

  const handleDragLeave = (): void => {
    setDragOverStage(null);
  };

  const handleDrop = async (
    e: React.DragEvent,
    newStage: LeadStage
  ): Promise<void> => {
    e.preventDefault();
    setDragOverStage(null);

    if (!draggedLead || draggedLead.stage === newStage) {
      setDraggedLead(null);
      return;
    }

    try {
      await updateLead({
        id: draggedLead.id,
        data: { stage: newStage },
      }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to update lead stage:", error);
    } finally {
      setDraggedLead(null);
    }
  };

  const handleLeadClick = (lead: LeadResponse): void => {
    window.location.href = `/leads/${lead.id}`;
  };

  const toggleStageCollapse = (stage: LeadStage): void => {
    const newCollapsed = new Set(collapsedStages);
    if (newCollapsed.has(stage)) {
      newCollapsed.delete(stage);
    } else {
      newCollapsed.add(stage);
    }
    setCollapsedStages(newCollapsed);
  };

  const totalLeads = filteredLeads.length;
  const totalValue = filteredLeads.reduce(
    (sum, lead) => sum + (Number(lead.dealValue) || 0),
    0
  );

  const stats = {
    newLeads: getLeadsByStage("NEW_LEAD").length,
    inProgress:
      getLeadsByStage("CONTACTED").length + getLeadsByStage("QUALIFIED").length,
    closing:
      getLeadsByStage("NEGOTIATION").length +
      getLeadsByStage("VIEWING_SCHEDULED").length,
    won: getLeadsByStage("DEAL_CLOSED_WON").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-full mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              {/* <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Lead Pipeline
              </h1> */}
              <p className="text-gray-600">
                Drag and drop cards to update lead stages
              </p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                showFilters || selectedPriority
                  ? "bg-blue-600 text-white"
                  : "bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
              <Filter className="w-5 h-5" />
              Filters
              {selectedPriority && (
                <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  1
                </span>
              )}
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {totalLeads}
                  </div>
                  <div className="text-xs text-gray-600">Total Leads</div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.newLeads}
                  </div>
                  <div className="text-xs text-gray-600">New</div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.inProgress}
                  </div>
                  <div className="text-xs text-gray-600">Active</div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.closing}
                  </div>
                  <div className="text-xs text-gray-600">Closing</div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.won}
                  </div>
                  <div className="text-xs text-gray-600">Won</div>
                </div>
              </div>
            </div>

            {totalValue > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      ${(totalValue / 1000).toFixed(0)}k
                    </div>
                    <div className="text-xs text-gray-600">Pipeline</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search leads by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {showFilters && (
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Filters</h3>
                  <button
                    onClick={() => {
                      setSelectedPriority("");
                      setShowFilters(false);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear All
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Priority
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PRIORITIES.map((priority) => (
                      <button
                        key={priority}
                        onClick={() =>
                          setSelectedPriority(
                            selectedPriority === priority ? "" : priority
                          )
                        }
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                          selectedPriority === priority
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {priority}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pipeline Board */}
        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Loading pipeline...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto pb-8">
            <div className="flex gap-4 min-w-max">
              {STAGES.map((stage) => {
                const stageLeads = getLeadsByStage(stage.value);
                const isCollapsed = collapsedStages.has(stage.value);
                const isDragOver = dragOverStage === stage.value;
                const stageValue = stageLeads.reduce(
                  (sum, lead) => sum + (Number(lead.dealValue) || 0),
                  0
                );

                return (
                  <div
                    key={stage.value}
                    className={`flex-shrink-0 transition-all ${
                      isCollapsed ? "w-16" : "w-80"
                    }`}
                  >
                    <div
                      className={`bg-white border-2 rounded-xl overflow-hidden transition-all h-full ${
                        isDragOver
                          ? "border-blue-500 shadow-lg scale-105"
                          : "border-gray-200 shadow-sm"
                      }`}
                    >
                      {/* Stage Header */}
                      <div className={`bg-gradient-to-r ${stage.color} p-4`}>
                        <div className="flex items-center justify-between mb-2">
                          {!isCollapsed ? (
                            <>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-bold text-white text-base">
                                    {stage.label}
                                  </h3>
                                  <span className="px-2 py-0.5 bg-white/30 backdrop-blur-sm text-white rounded-full text-xs font-bold">
                                    {stageLeads.length}
                                  </span>
                                </div>
                                {stageValue > 0 && (
                                  <div className="text-white/90 text-sm font-medium">
                                    ${stageValue.toLocaleString()}
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={() => toggleStageCollapse(stage.value)}
                                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                              >
                                <ChevronDown className="w-5 h-5 text-white" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => toggleStageCollapse(stage.value)}
                              className="w-full"
                            >
                              <div className="transform -rotate-90 whitespace-nowrap origin-center">
                                <span className="text-white font-bold text-sm">
                                  {stage.label} ({stageLeads.length})
                                </span>
                              </div>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Stage Content */}
                      {!isCollapsed && (
                        <div
                          onDrop={(e) => handleDrop(e, stage.value)}
                          onDragOver={(e) => handleDragOver(e, stage.value)}
                          onDragLeave={handleDragLeave}
                          className={`p-3 space-y-3 min-h-[600px] max-h-[calc(100vh-400px)] overflow-y-auto transition-colors ${
                            isDragOver ? "bg-blue-50" : "bg-gray-50"
                          }`}
                          style={{
                            scrollbarWidth: "thin",
                            scrollbarColor: "#cbd5e1 transparent",
                          }}
                        >
                          {stageLeads.length === 0 ? (
                            <div className="text-center py-12">
                              <div className="text-gray-400 mb-2">
                                <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                                  <Users className="w-6 h-6" />
                                </div>
                              </div>
                              <p className="text-sm text-gray-500 font-medium">
                                No leads in this stage
                              </p>
                              {isDragOver && (
                                <p className="text-xs text-blue-600 mt-2 font-medium">
                                  Drop here to move
                                </p>
                              )}
                            </div>
                          ) : (
                            stageLeads.map((lead) => (
                              <div
                                key={lead.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, lead)}
                                onDragEnd={handleDragEnd}
                                onClick={() => handleLeadClick(lead)}
                              >
                                <KanbanLeadCard lead={lead} />
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style>{`
        /* Custom scrollbar for stage columns */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};
