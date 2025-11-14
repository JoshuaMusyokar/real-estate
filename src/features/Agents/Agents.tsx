import React, { useState } from "react";
import {
  Search,
  Filter,
  TrendingUp,
  Users,
  Award,
  MapPin,
  Phone,
  Mail,
  Eye,
  UserCheck,
  Star,
  ChevronDown,
  X,
  Loader2,
} from "lucide-react";
import {
  useGetAgentsForAssignmentQuery,
  useGetTopAgentsQuery,
} from "../../services/agentApi";
import type { AgentForAssignment, AgentsFilter } from "../../types";

export const Agents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedLocality, setSelectedLocality] = useState<string>("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filters: AgentsFilter = {
    search: searchTerm || undefined,
    city: selectedCity || undefined,
    locality: selectedLocality || undefined,
    onlyAvailable: onlyAvailable || undefined,
    includePerformance: true,
  };

  const { data: agentsData, isLoading } =
    useGetAgentsForAssignmentQuery(filters);
  const { data: topAgentsData } = useGetTopAgentsQuery({ limit: 3 });

  const agents = agentsData?.data || [];
  const topAgents = topAgentsData?.data || [];

  const getWorkloadColor = (workload: string) => {
    switch (workload) {
      case "low":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "medium":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "high":
        return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "INACTIVE":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const calculatePerformanceScore = (agent: AgentForAssignment) => {
    const conversionWeight = agent.conversionRate * 40;
    const closedWeight = Math.min(agent.totalLeadsClosed / 100, 1) * 30;
    const workloadWeight =
      agent.currentWorkload === "low"
        ? 20
        : agent.currentWorkload === "medium"
        ? 10
        : 0;
    const propertiesWeight = Math.min(agent.ownedPropertiesCount / 20, 1) * 10;
    return Math.round(
      conversionWeight + closedWeight + workloadWeight + propertiesWeight
    );
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Agent Network
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Connect with top-performing real estate professionals
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                <span className="text-gray-700 dark:text-gray-300">
                  {viewMode === "grid" ? "List" : "Grid"} View
                </span>
              </button>
            </div>
          </div>

          {/* Top Performers Banner */}
          {topAgents.length > 0 && (
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 rounded-2xl p-6 mb-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">
                  Top Performers This Month
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {topAgents.map((agent, idx) => (
                  <div
                    key={agent.id}
                    className="bg-white/20 backdrop-blur-sm rounded-xl p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white to-amber-100 flex items-center justify-center text-amber-600 font-bold text-lg shadow-lg">
                          {agent.firstName[0]}
                          {agent.lastName[0]}
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center text-amber-600 font-bold text-xs shadow-lg">
                          {idx + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-white">
                          {agent.firstName} {agent.lastName}
                        </p>
                        <p className="text-amber-100 text-sm">
                          {(agent.conversionRate * 100).toFixed(0)}% conversion
                        </p>
                      </div>
                      <Star className="w-5 h-5 text-white fill-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 backdrop-blur-lg transition-colors duration-300">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search agents by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <Filter className="w-5 h-5" />
                Filters
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="Filter by city..."
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Locality
                  </label>
                  <input
                    type="text"
                    placeholder="Filter by locality..."
                    value={selectedLocality}
                    onChange={(e) => setSelectedLocality(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={onlyAvailable}
                      onChange={(e) => setOnlyAvailable(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Only Available Agents
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Active Filters */}
            {(searchTerm ||
              selectedCity ||
              selectedLocality ||
              onlyAvailable) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {searchTerm && (
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm flex items-center gap-2">
                    Search: {searchTerm}
                    <X
                      className="w-4 h-4 cursor-pointer hover:text-blue-900 dark:hover:text-blue-200"
                      onClick={() => setSearchTerm("")}
                    />
                  </span>
                )}
                {selectedCity && (
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg text-sm flex items-center gap-2">
                    City: {selectedCity}
                    <X
                      className="w-4 h-4 cursor-pointer hover:text-purple-900 dark:hover:text-purple-200"
                      onClick={() => setSelectedCity("")}
                    />
                  </span>
                )}
                {selectedLocality && (
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm flex items-center gap-2">
                    Locality: {selectedLocality}
                    <X
                      className="w-4 h-4 cursor-pointer hover:text-green-900 dark:hover:text-green-200"
                      onClick={() => setSelectedLocality("")}
                    />
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <Users className="w-8 h-8 mb-3 opacity-80" />
            <p className="text-3xl font-bold mb-1">{agents.length}</p>
            <p className="text-blue-100 text-sm">Total Agents</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <UserCheck className="w-8 h-8 mb-3 opacity-80" />
            <p className="text-3xl font-bold mb-1">
              {agents.filter((a) => a.currentWorkload === "low").length}
            </p>
            <p className="text-emerald-100 text-sm">Available Now</p>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <TrendingUp className="w-8 h-8 mb-3 opacity-80" />
            <p className="text-3xl font-bold mb-1">
              {agents.length > 0
                ? Math.round(
                    (agents.reduce((acc, a) => acc + a.conversionRate, 0) /
                      agents.length) *
                      100
                  )
                : 0}
              %
            </p>
            <p className="text-amber-100 text-sm">Avg Conversion</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <Award className="w-8 h-8 mb-3 opacity-80" />
            <p className="text-3xl font-bold mb-1">
              {agents.reduce((acc, a) => acc + a.totalLeadsClosed, 0)}
            </p>
            <p className="text-purple-100 text-sm">Total Closed</p>
          </div>
        </div>

        {/* Agents Grid/List */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Loading agents...
            </p>
          </div>
        ) : agents.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
            <Users className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No agents found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {agents.map((agent) => {
              const performanceScore = calculatePerformanceScore(agent);

              return viewMode === "grid" ? (
                <div
                  key={agent.id}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:scale-105"
                >
                  {/* Header with gradient */}
                  <div className="h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative">
                    <div className="absolute -bottom-10 left-6">
                      <div className="w-20 h-20 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center text-2xl font-bold text-gray-700 dark:text-gray-300 shadow-xl border-4 border-white dark:border-gray-700">
                        {agent.firstName[0]}
                        {agent.lastName[0]}
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          agent.status
                        )}`}
                      >
                        {agent.status}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getWorkloadColor(
                          agent.currentWorkload
                        )}`}
                      >
                        {agent.currentWorkload}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-14 px-6 pb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {agent.firstName} {agent.lastName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {agent.role}
                    </p>

                    {/* Contact Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="w-4 h-4 text-blue-500" />
                        <span className="truncate">{agent.email}</span>
                      </div>
                      {agent.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Phone className="w-4 h-4 text-green-500" />
                          <span>{agent.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Performance Score */}
                    <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Performance Score
                        </span>
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {performanceScore}/100
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                          style={{ width: `${performanceScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Active Leads
                        </p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {agent.activeLeadsCount}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Closed
                        </p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {agent.totalLeadsClosed}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Conversion
                        </p>
                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          {(agent.conversionRate * 100).toFixed(0)}%
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Properties
                        </p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {agent.ownedPropertiesCount}
                        </p>
                      </div>
                    </div>

                    {/* Locations */}
                    {agent.allowedCities.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          Coverage Areas
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {agent.allowedCities.slice(0, 3).map((city) => (
                            <span
                              key={city}
                              className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-xs"
                            >
                              {city}
                            </span>
                          ))}
                          {agent.allowedCities.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-xs">
                              +{agent.allowedCities.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-105">
                      <Eye className="w-4 h-4" />
                      View Profile
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  key={agent.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="flex items-start gap-6">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg flex-shrink-0">
                      {agent.firstName[0]}
                      {agent.lastName[0]}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {agent.firstName} {agent.lastName}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {agent.role}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              agent.status
                            )}`}
                          >
                            {agent.status}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getWorkloadColor(
                              agent.currentWorkload
                            )}`}
                          >
                            {agent.currentWorkload}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Active
                          </p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">
                            {agent.activeLeadsCount}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Closed
                          </p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">
                            {agent.totalLeadsClosed}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Conversion
                          </p>
                          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                            {(agent.conversionRate * 100).toFixed(0)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Properties
                          </p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">
                            {agent.ownedPropertiesCount}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Score
                          </p>
                          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {performanceScore}
                          </p>
                        </div>
                        <div>
                          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                            View
                          </button>
                        </div>
                      </div>

                      {agent.allowedCities.length > 0 && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <div className="flex flex-wrap gap-1">
                            {agent.allowedCities.slice(0, 5).map((city) => (
                              <span
                                key={city}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs"
                              >
                                {city}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
