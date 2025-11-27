import { AlertCircle, CheckCircle, Loader2, User, X } from "lucide-react";
import type {
  AgentForAssignment,
  LeadResponse,
  PropertyType,
} from "../../../types";
import { useAssignLeadMutation } from "../../../services/leadApi";
import { useEffect, useState } from "react";
import { useGetAgentsForAssignmentQuery } from "../../../services/agentApi";
import { useToast } from "../../../hooks/useToast";

interface AssignLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: LeadResponse;
  onSuccess: () => void;
}

export const AssignLeadModal: React.FC<AssignLeadModalProps> = ({
  isOpen,
  onClose,
  lead,
  onSuccess,
}) => {
  const [assignLead, { isLoading: isAssigning }] = useAssignLeadMutation();
  const [agentsData, setAgentsData] = useState<AgentForAssignment[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const { success, error: showError } = useToast();
  const { data, isLoading: isLoadingAgents } = useGetAgentsForAssignmentQuery({
    city: lead.city,
    propertyType: lead.propertyType as PropertyType,
    search: searchTerm || undefined,
  });

  useEffect(() => {
    if (isOpen) {
      setSelectedAgentId(lead.assignedToId || "");
      setSearchTerm("");
      setError("");
    }
  }, [isOpen, lead]);

  useEffect(() => {
    if (data && data.data && Array.isArray(data.data)) {
      setAgentsData(data.data);
    }
  }, [data]);

  const handleAssign = async () => {
    if (!selectedAgentId) {
      setError("Please select an agent");
      return;
    }

    try {
      await assignLead({ id: lead.id, agentId: selectedAgentId }).unwrap();
      onSuccess();
      onClose();
      success("Success", "Lead Assigned Successfully");
    } catch (err) {
      console.error("Failed to assign lead:", err);
      showError("Failed", "Failed to assign lead. Please try again.");
      // setError("Failed to assign lead. Please try again.");
    }
  };

  const getWorkloadColor = (workload: string) => {
    switch (workload) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Assign Lead</h2>
            <p className="text-sm text-gray-600 mt-1">
              Assign {lead.firstName} {lead.lastName} to an agent
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {/* Current Assignment */}
          {lead.assignedTo && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-1">
                Currently assigned to:
              </p>
              <p className="text-blue-700">
                {lead.assignedTo.firstName} {lead.assignedTo.lastName} (
                {lead.assignedTo.email})
              </p>
            </div>
          )}

          {/* Search */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Agents
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Agents List */}
          {isLoadingAgents ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : agentsData.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No agents found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search criteria
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {agentsData.map((agent: AgentForAssignment) => (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgentId(agent.id)}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedAgentId === agent.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                          selectedAgentId === agent.id
                            ? "bg-blue-600"
                            : "bg-gray-400"
                        }`}
                      >
                        {agent.firstName[0]}
                        {agent.lastName[0]}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {agent.firstName} {agent.lastName}
                        </h4>
                        <p className="text-sm text-gray-600">{agent.email}</p>
                        {agent.phone && (
                          <p className="text-sm text-gray-600">{agent.phone}</p>
                        )}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getWorkloadColor(
                        agent.currentWorkload
                      )}`}
                    >
                      {agent.currentWorkload} workload
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Active Leads</p>
                      <p className="font-semibold text-gray-900">
                        {agent.activeLeadsCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Closed</p>
                      <p className="font-semibold text-gray-900">
                        {agent.totalLeadsClosed}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Conversion</p>
                      <p className="font-semibold text-gray-900">
                        {(agent.conversionRate * 100).toFixed(0)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Properties</p>
                      <p className="font-semibold text-gray-900">
                        {agent.ownedPropertiesCount}
                      </p>
                    </div>
                  </div>

                  {agent.cities.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">
                        Allowed Cities:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {agent.cities.map((city) => (
                          <span
                            key={city.id}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            {city.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 px-6 py-4 flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={isAssigning || !selectedAgentId}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isAssigning ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Assigning...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Assign Agent
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
