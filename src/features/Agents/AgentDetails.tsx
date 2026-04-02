import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  TrendingUp,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  Loader2,
} from "lucide-react";
import { useGetAgentForAssignmentQuery } from "../../services/agentApi";
import {
  workloadColor,
  statusColor,
  roleColor,
  roleLabel,
  performanceScore,
  agentInitials,
} from "../../utils/agent-utils";

export const AgentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetAgentForAssignmentQuery(id!, {
    skip: !id,
  });
  const agent = data?.data;

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );

  if (isError || !agent)
    return (
      <div className="text-center py-16">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-1">
          Agent not found
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="text-xs text-blue-600 hover:underline mt-2"
        >
          Go back
        </button>
      </div>
    );

  const score = performanceScore(agent);
  const initials = agentInitials(agent);
  const roleName = agent.role?.name;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-0">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Agents
      </button>

      {/* Hero card */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden mb-4 sm:mb-5">
        <div className="h-24 sm:h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative">
          <div className="absolute -bottom-8 sm:-bottom-10 left-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white dark:bg-gray-900 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xl sm:text-2xl font-black text-gray-700 dark:text-gray-200 shadow-xl">
              {initials}
            </div>
          </div>
          <div className="absolute top-3 right-3 flex gap-1.5">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColor(agent.status)}`}
            >
              {agent.status}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${workloadColor(agent.currentWorkload)}`}
            >
              {agent.currentWorkload} workload
            </span>
          </div>
        </div>

        <div className="pt-10 sm:pt-13 px-4 sm:px-5 pb-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h1 className="text-base sm:text-xl font-black text-gray-900 dark:text-white">
                {agent.firstName} {agent.lastName}
              </h1>
              {roleName && (
                <span
                  className={`inline-flex px-2 py-0.5 rounded border text-[10px] font-bold mt-1 ${roleColor(roleName)}`}
                >
                  {roleLabel(roleName)}
                </span>
              )}
            </div>
            {/* Performance ring */}
            <div className="flex-shrink-0 text-center">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
                  <circle
                    cx="28"
                    cy="28"
                    r="22"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="4"
                  />
                  <circle
                    cx="28"
                    cy="28"
                    r="22"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="4"
                    strokeDasharray={`${2 * Math.PI * 22}`}
                    strokeDashoffset={`${2 * Math.PI * 22 * (1 - score / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-black text-blue-600">
                    {score}%
                  </span>
                  <span className="text-[8px] text-gray-400">score</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact row */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-4">
            <a
              href={`mailto:${agent.email}`}
              className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Mail className="w-3 h-3 text-blue-400" /> {agent.email}
            </a>
            {agent.phone && (
              <a
                href={`tel:${agent.phone}`}
                className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 hover:text-green-600 transition-colors"
              >
                <Phone className="w-3 h-3 text-green-400" /> {agent.phone}
              </a>
            )}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {[
              {
                icon: Users,
                label: "Active Leads",
                value: agent.activeLeadsCount,
                color: "text-blue-600 dark:text-blue-400",
              },
              {
                icon: CheckCircle2,
                label: "Leads Closed",
                value: agent.totalLeadsClosed,
                color: "text-emerald-600 dark:text-emerald-400",
              },
              {
                icon: TrendingUp,
                label: "Conversion",
                value: `${(agent.conversionRate * 100).toFixed(1)}%`,
                color: "text-purple-600 dark:text-purple-400",
              },
              {
                icon: Building2,
                label: "Properties",
                value: agent.ownedPropertiesCount,
                color: "text-amber-600 dark:text-amber-400",
              },
            ].map(({ icon: Icon, label, value, color }) => (
              <div
                key={label}
                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
              >
                <Icon className={`w-3.5 h-3.5 ${color} mb-1.5`} />
                <p className={`text-lg sm:text-xl font-black ${color}`}>
                  {value}
                </p>
                <p className="text-[10px] text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-4">
        {/* Coverage */}
        {(agent.cities.length > 0 || agent.localities.length > 0) && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 sm:p-5">
            <h3 className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <MapPin className="w-3 h-3" /> Coverage Areas
            </h3>
            {agent.cities.length > 0 && (
              <div className="mb-3">
                <p className="text-[10px] text-gray-400 mb-1.5">Cities</p>
                <div className="flex flex-wrap gap-1.5">
                  {agent.cities.map((c) => (
                    <span
                      key={c.id}
                      className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-[10px] sm:text-xs font-semibold border border-blue-100 dark:border-blue-800"
                    >
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {agent.localities.length > 0 && (
              <div>
                <p className="text-[10px] text-gray-400 mb-1.5">Localities</p>
                <div className="flex flex-wrap gap-1.5">
                  {agent.localities.map((l) => (
                    <span
                      key={l.id}
                      className="px-2 py-1 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg text-[10px] sm:text-xs font-medium border border-gray-200 dark:border-gray-700"
                    >
                      {l.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Workload & availability */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 sm:p-5">
          <h3 className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <Clock className="w-3 h-3" /> Workload & Availability
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Current workload
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${workloadColor(agent.currentWorkload)}`}
              >
                {agent.currentWorkload}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Availability
              </span>
              <span
                className={`flex items-center gap-1 text-xs font-semibold ${agent.isAvailable ? "text-emerald-600" : "text-red-500"}`}
              >
                {agent.isAvailable ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Available
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5" /> Unavailable
                  </>
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Appointments
              </span>
              <span className="text-xs font-bold text-gray-900 dark:text-white">
                {agent.assignedAppointmentsCount} upcoming
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Avg response time
              </span>
              <span className="text-xs font-bold text-gray-900 dark:text-white">
                {agent.averageResponseTime} min
              </span>
            </div>
            {agent.lastActive && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Last active
                </span>
                <span className="text-xs font-bold text-gray-900 dark:text-white">
                  {new Date(agent.lastActive).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance detail */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 sm:p-5">
        <h3 className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
          <TrendingUp className="w-3 h-3" /> Performance Breakdown
        </h3>
        <div className="space-y-3">
          {[
            {
              label: "Conversion rate",
              pct: Math.round(agent.conversionRate * 100),
              color: "from-emerald-500 to-emerald-600",
            },
            {
              label: "Leads closed (cap)",
              pct: Math.round(Math.min(agent.totalLeadsClosed / 100, 1) * 100),
              color: "from-blue-500 to-blue-600",
            },
            {
              label: "Capacity",
              pct:
                agent.currentWorkload === "low"
                  ? 100
                  : agent.currentWorkload === "medium"
                    ? 50
                    : 10,
              color: "from-purple-500 to-purple-600",
            },
            {
              label: "Property portfolio",
              pct: Math.round(
                Math.min(agent.ownedPropertiesCount / 20, 1) * 100,
              ),
              color: "from-amber-500 to-amber-600",
            },
          ].map(({ label, pct, color }) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                  {label}
                </span>
                <span className="text-[10px] font-bold text-gray-900 dark:text-white">
                  {pct}%
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${color} rounded-full transition-all`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
