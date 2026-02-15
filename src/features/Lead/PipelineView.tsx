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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { STAGES } from "../../utils";
import type { Lead, LeadStage, LeadPriority, LeadResponse } from "../../types";
import {
  useGetLeadsQuery,
  useUpdateLeadMutation,
} from "../../services/leadApi";
import { KanbanLeadCard } from "./components/KanbanLeadCard";
import Button from "../../components/ui/button/Button";
import { Card, CardContent } from "../../components/ui/Card";

const PRIORITIES: LeadPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];

export const PipelineView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [draggedLead, setDraggedLead] = useState<LeadResponse | null>(null);
  const [dragOverStage, setDragOverStage] = useState<LeadStage | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<LeadPriority | "">(
    "",
  );
  const [showFilters, setShowFilters] = useState(false);
  const [collapsedStages, setCollapsedStages] = useState<Set<LeadStage>>(
    new Set(),
  );
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

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
    newStage: LeadStage,
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
    0,
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

  // Mobile stage navigation
  const nextStage = () => {
    if (currentStageIndex < STAGES.length - 1) {
      setCurrentStageIndex(currentStageIndex + 1);
    }
  };

  const prevStage = () => {
    if (currentStageIndex > 0) {
      setCurrentStageIndex(currentStageIndex - 1);
    }
  };

  return (
    <>
      <div className="max-w-full mx-auto">
        {/* Header Section */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Drag cards to update stages
            </p>

            <Button
              variant={showFilters || selectedPriority ? "primary" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              startIcon={<Filter className="w-4 h-4" />}
              endIcon={
                selectedPriority ? (
                  <span className="ml-1 px-1 py-0.5 bg-white/20 rounded-full text-[10px]">
                    1
                  </span>
                ) : undefined
              }
              className="h-8 px-3"
            >
              Filters
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
            <Card>
              <CardContent className="p-2.5 sm:p-3 md:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
                      {totalLeads}
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-600 truncate">
                      Total
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-2.5 sm:p-3 md:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
                      {stats.newLeads}
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-600 truncate">
                      New
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-2.5 sm:p-3 md:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-purple-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
                      {stats.inProgress}
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-600 truncate">
                      Active
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-2.5 sm:p-3 md:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-orange-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
                      {stats.closing}
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-600 truncate">
                      Closing
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-2.5 sm:p-3 md:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
                      {stats.won}
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-600 truncate">
                      Won
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {totalValue > 0 && (
              <Card>
                <CardContent className="p-2.5 sm:p-3 md:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-amber-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
                        ${(totalValue / 1000).toFixed(0)}k
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-600 truncate">
                        Pipeline
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Search and Filters */}
          <div className="space-y-3 sm:space-y-4">
            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="relative">
                  <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 sm:pl-12 pr-10 sm:pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>

            {showFilters && (
              <Card>
                <CardContent className="p-3 sm:p-4 md:p-5">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                      Filters
                    </h3>
                    <button
                      onClick={() => {
                        setSelectedPriority("");
                        setShowFilters(false);
                      }}
                      className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Clear All
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                      Priority
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {PRIORITIES.map((priority) => (
                        <button
                          key={priority}
                          onClick={() =>
                            setSelectedPriority(
                              selectedPriority === priority ? "" : priority,
                            )
                          }
                          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all ${
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
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Pipeline Board */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20 sm:py-24 md:py-32">
            <div className="text-center">
              <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 animate-spin text-blue-600 mx-auto mb-3 sm:mb-4" />
              <p className="text-sm sm:text-base text-gray-600 font-medium">
                Loading pipeline...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop View - Horizontal Scroll */}
            <div className="hidden md:block overflow-x-auto pb-6 md:pb-8">
              <div className="flex gap-3 md:gap-4 min-w-max">
                {STAGES.map((stage) => {
                  const stageLeads = getLeadsByStage(stage.value);
                  const isCollapsed = collapsedStages.has(stage.value);
                  const isDragOver = dragOverStage === stage.value;
                  const stageValue = stageLeads.reduce(
                    (sum, lead) => sum + (Number(lead.dealValue) || 0),
                    0,
                  );

                  return (
                    <div
                      key={stage.value}
                      className={`flex-shrink-0 transition-all ${
                        isCollapsed ? "w-16" : "w-72 lg:w-80"
                      }`}
                    >
                      <Card
                        className={`overflow-hidden transition-all h-full ${
                          isDragOver
                            ? "border-blue-500 shadow-lg scale-105"
                            : ""
                        }`}
                      >
                        {/* Stage Header */}
                        <div
                          className={`bg-gradient-to-r ${stage.color} p-3 md:p-4`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            {!isCollapsed ? (
                              <>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-white text-sm md:text-base">
                                      {stage.label}
                                    </h3>
                                    <span className="px-2 py-0.5 bg-white/30 backdrop-blur-sm text-white rounded-full text-xs font-bold">
                                      {stageLeads.length}
                                    </span>
                                  </div>
                                  {stageValue > 0 && (
                                    <div className="text-white/90 text-xs md:text-sm font-medium">
                                      ${stageValue.toLocaleString()}
                                    </div>
                                  )}
                                </div>
                                <button
                                  onClick={() =>
                                    toggleStageCollapse(stage.value)
                                  }
                                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                  <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-white" />
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
                            className={`p-2 sm:p-3 space-y-2 sm:space-y-3 min-h-[400px] md:min-h-[500px] lg:min-h-[600px] max-h-[calc(100vh-400px)] overflow-y-auto transition-colors ${
                              isDragOver ? "bg-blue-50" : "bg-gray-50"
                            }`}
                            style={{
                              scrollbarWidth: "thin",
                              scrollbarColor: "#cbd5e1 transparent",
                            }}
                          >
                            {stageLeads.length === 0 ? (
                              <div className="text-center py-8 sm:py-12">
                                <div className="text-gray-400 mb-2">
                                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full mx-auto mb-2 sm:mb-3 flex items-center justify-center">
                                    <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                                  </div>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-500 font-medium">
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
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile View - Single Stage with Navigation */}
            <div className="md:hidden">
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={prevStage}
                  disabled={currentStageIndex === 0}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <span className="text-sm font-medium text-gray-600">
                  {currentStageIndex + 1} / {STAGES.length}
                </span>

                <button
                  onClick={nextStage}
                  disabled={currentStageIndex === STAGES.length - 1}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {(() => {
                const stage = STAGES[currentStageIndex];
                const stageLeads = getLeadsByStage(stage.value);
                const stageValue = stageLeads.reduce(
                  (sum, lead) => sum + (Number(lead.dealValue) || 0),
                  0,
                );

                return (
                  <Card className="overflow-hidden">
                    {/* Stage Header */}
                    <div className={`bg-gradient-to-r ${stage.color} p-3`}>
                      <div className="flex items-center justify-between">
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
                      </div>
                    </div>

                    {/* Stage Content */}
                    <div className="p-3 space-y-3 bg-gray-50 min-h-[400px]">
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
                        </div>
                      ) : (
                        stageLeads.map((lead) => (
                          <div
                            key={lead.id}
                            onClick={() => handleLeadClick(lead)}
                          >
                            <KanbanLeadCard lead={lead} />
                          </div>
                        ))
                      )}
                    </div>
                  </Card>
                );
              })()}
            </div>
          </>
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
    </>
  );
};
