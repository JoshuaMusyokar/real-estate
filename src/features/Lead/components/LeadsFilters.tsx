import { Search, X, ChevronDown, UserPlus, Trash2 } from "lucide-react";

import { useState } from "react";
import type { LeadPriority, LeadSource, LeadStage } from "../../../types";
import { Card, CardContent } from "../../../components/ui/Card";
import { Dropdown } from "../../../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../../../components/ui/dropdown/DropdownItem";
import { LEAD_PRIORITIES, LEAD_SOURCES, LEAD_STAGES } from "../../../utils";
import Button from "../../../components/ui/button/Button";

interface LeadsFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedSource: LeadSource | "";
  setSelectedSource: (value: LeadSource | "") => void;
  selectedStage: LeadStage | "";
  setSelectedStage: (value: LeadStage | "") => void;
  selectedPriority: LeadPriority | "";
  setSelectedPriority: (value: LeadPriority | "") => void;
  selectedLeads: Set<string>;
  onBulkDelete: () => void;
  onAssignAgent: () => void;
}

export const LeadsFilters: React.FC<LeadsFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedSource,
  setSelectedSource,
  selectedStage,
  setSelectedStage,
  selectedPriority,
  setSelectedPriority,
  selectedLeads,
  onBulkDelete,
  onAssignAgent,
}) => {
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [showStageDropdown, setShowStageDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

  const hasActiveFilters = selectedSource || selectedStage || selectedPriority;

  const clearAllFilters = () => {
    setSelectedSource("");
    setSelectedStage("");
    setSelectedPriority("");
  };

  return (
    <Card>
      <CardContent className="p-3 sm:p-4 md:p-5 lg:p-6">
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns - Desktop */}
          <div className="hidden md:grid md:grid-cols-3 gap-3 sm:gap-4">
            {/* Source Filter */}
            <div className="relative">
              <button
                onClick={() => setShowSourceDropdown(!showSourceDropdown)}
                className="dropdown-toggle w-full flex items-center justify-between gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                <span className="truncate">
                  {selectedSource
                    ? selectedSource.replace(/_/g, " ")
                    : "All Sources"}
                </span>
                <ChevronDown className="w-4 h-4 flex-shrink-0" />
              </button>
              <Dropdown
                isOpen={showSourceDropdown}
                onClose={() => setShowSourceDropdown(false)}
                className="w-full"
              >
                <div className="py-1 max-h-60 overflow-y-auto">
                  <DropdownItem
                    onClick={() => {
                      setSelectedSource("");
                      setShowSourceDropdown(false);
                    }}
                    className={
                      selectedSource === ""
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : ""
                    }
                  >
                    All Sources
                  </DropdownItem>
                  {LEAD_SOURCES.map((source) => (
                    <DropdownItem
                      key={source}
                      onClick={() => {
                        setSelectedSource(source);
                        setShowSourceDropdown(false);
                      }}
                      className={
                        selectedSource === source
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : ""
                      }
                    >
                      {source.replace(/_/g, " ")}
                    </DropdownItem>
                  ))}
                </div>
              </Dropdown>
            </div>

            {/* Stage Filter */}
            <div className="relative">
              <button
                onClick={() => setShowStageDropdown(!showStageDropdown)}
                className="dropdown-toggle w-full flex items-center justify-between gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                <span className="truncate">
                  {selectedStage
                    ? selectedStage.replace(/_/g, " ")
                    : "All Stages"}
                </span>
                <ChevronDown className="w-4 h-4 flex-shrink-0" />
              </button>
              <Dropdown
                isOpen={showStageDropdown}
                onClose={() => setShowStageDropdown(false)}
                className="w-full"
              >
                <div className="py-1 max-h-60 overflow-y-auto">
                  <DropdownItem
                    onClick={() => {
                      setSelectedStage("");
                      setShowStageDropdown(false);
                    }}
                    className={
                      selectedStage === ""
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : ""
                    }
                  >
                    All Stages
                  </DropdownItem>
                  {LEAD_STAGES.map((stage) => (
                    <DropdownItem
                      key={stage}
                      onClick={() => {
                        setSelectedStage(stage);
                        setShowStageDropdown(false);
                      }}
                      className={
                        selectedStage === stage
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : ""
                      }
                    >
                      {stage.replace(/_/g, " ")}
                    </DropdownItem>
                  ))}
                </div>
              </Dropdown>
            </div>

            {/* Priority Filter */}
            <div className="relative">
              <button
                onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                className="dropdown-toggle w-full flex items-center justify-between gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                <span className="truncate">
                  {selectedPriority || "All Priorities"}
                </span>
                <ChevronDown className="w-4 h-4 flex-shrink-0" />
              </button>
              <Dropdown
                isOpen={showPriorityDropdown}
                onClose={() => setShowPriorityDropdown(false)}
                className="w-full"
              >
                <div className="py-1 max-h-60 overflow-y-auto">
                  <DropdownItem
                    onClick={() => {
                      setSelectedPriority("");
                      setShowPriorityDropdown(false);
                    }}
                    className={
                      selectedPriority === ""
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : ""
                    }
                  >
                    All Priorities
                  </DropdownItem>
                  {LEAD_PRIORITIES.map((priority) => (
                    <DropdownItem
                      key={priority}
                      onClick={() => {
                        setSelectedPriority(priority);
                        setShowPriorityDropdown(false);
                      }}
                      className={
                        selectedPriority === priority
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : ""
                      }
                    >
                      {priority}
                    </DropdownItem>
                  ))}
                </div>
              </Dropdown>
            </div>
          </div>

          {/* Mobile Filter Chips */}
          <div className="md:hidden flex flex-wrap gap-2">
            {/* Source Chip */}
            <div className="relative">
              <button
                onClick={() => setShowSourceDropdown(!showSourceDropdown)}
                className="dropdown-toggle flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                <span className="truncate max-w-[100px]">
                  {selectedSource
                    ? selectedSource.replace(/_/g, " ")
                    : "Source"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />
              </button>
              <Dropdown
                isOpen={showSourceDropdown}
                onClose={() => setShowSourceDropdown(false)}
                className="w-48"
              >
                <div className="py-1 max-h-60 overflow-y-auto">
                  <DropdownItem
                    onClick={() => {
                      setSelectedSource("");
                      setShowSourceDropdown(false);
                    }}
                    className={
                      selectedSource === ""
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : ""
                    }
                  >
                    All Sources
                  </DropdownItem>
                  {LEAD_SOURCES.map((source) => (
                    <DropdownItem
                      key={source}
                      onClick={() => {
                        setSelectedSource(source);
                        setShowSourceDropdown(false);
                      }}
                      className={
                        selectedSource === source
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : ""
                      }
                    >
                      {source.replace(/_/g, " ")}
                    </DropdownItem>
                  ))}
                </div>
              </Dropdown>
            </div>

            {/* Stage Chip */}
            <div className="relative">
              <button
                onClick={() => setShowStageDropdown(!showStageDropdown)}
                className="dropdown-toggle flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                <span className="truncate max-w-[100px]">
                  {selectedStage ? selectedStage.replace(/_/g, " ") : "Stage"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />
              </button>
              <Dropdown
                isOpen={showStageDropdown}
                onClose={() => setShowStageDropdown(false)}
                className="w-48"
              >
                <div className="py-1 max-h-60 overflow-y-auto">
                  <DropdownItem
                    onClick={() => {
                      setSelectedStage("");
                      setShowStageDropdown(false);
                    }}
                    className={
                      selectedStage === ""
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : ""
                    }
                  >
                    All Stages
                  </DropdownItem>
                  {LEAD_STAGES.map((stage) => (
                    <DropdownItem
                      key={stage}
                      onClick={() => {
                        setSelectedStage(stage);
                        setShowStageDropdown(false);
                      }}
                      className={
                        selectedStage === stage
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : ""
                      }
                    >
                      {stage.replace(/_/g, " ")}
                    </DropdownItem>
                  ))}
                </div>
              </Dropdown>
            </div>

            {/* Priority Chip */}
            <div className="relative">
              <button
                onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                className="dropdown-toggle flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                <span className="truncate max-w-[100px]">
                  {selectedPriority || "Priority"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />
              </button>
              <Dropdown
                isOpen={showPriorityDropdown}
                onClose={() => setShowPriorityDropdown(false)}
                className="w-48"
              >
                <div className="py-1 max-h-60 overflow-y-auto">
                  <DropdownItem
                    onClick={() => {
                      setSelectedPriority("");
                      setShowPriorityDropdown(false);
                    }}
                    className={
                      selectedPriority === ""
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : ""
                    }
                  >
                    All Priorities
                  </DropdownItem>
                  {LEAD_PRIORITIES.map((priority) => (
                    <DropdownItem
                      key={priority}
                      onClick={() => {
                        setSelectedPriority(priority);
                        setShowPriorityDropdown(false);
                      }}
                      className={
                        selectedPriority === priority
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : ""
                      }
                    >
                      {priority}
                    </DropdownItem>
                  ))}
                </div>
              </Dropdown>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm text-red-600 font-medium hover:bg-red-50 rounded-full transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Selected Leads Actions */}
        {selectedLeads.size > 0 && (
          <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-blue-700 font-semibold text-sm sm:text-base">
                {selectedLeads.size} lead{selectedLeads.size > 1 ? "s" : ""}{" "}
                selected
              </span>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                {selectedLeads.size === 1 && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={onAssignAgent}
                    startIcon={<UserPlus className="w-4 h-4" />}
                    className="flex-1 sm:flex-initial bg-purple-600 hover:bg-purple-700"
                  >
                    <span className="hidden sm:inline">Assign to Agent</span>
                    <span className="sm:hidden">Assign</span>
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBulkDelete}
                  startIcon={<Trash2 className="w-4 h-4" />}
                  className="flex-1 sm:flex-initial text-red-600 border-red-200 hover:bg-red-50"
                >
                  <span className="hidden sm:inline">Delete Selected</span>
                  <span className="sm:hidden">Delete</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
