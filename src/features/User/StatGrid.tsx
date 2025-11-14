import { RefreshCw, Shield, UserCheck, Users } from "lucide-react";
import { StatCard } from "./StatCard";

export const StatsGrid: React.FC<{ stats: any }> = ({ stats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
    <StatCard
      icon={<Users className="text-blue-600" size={24} />}
      label="Total Users"
      value={stats.total}
      change="+12%"
    />
    <StatCard
      icon={<UserCheck className="text-green-600" size={24} />}
      label="Active Users"
      value={stats.byStatus?.ACTIVE || 0}
      change="+5%"
    />
    <StatCard
      icon={<Shield className="text-purple-600" size={24} />}
      label="Agents"
      value={stats.byRole?.SALES_AGENT || 0}
    />
    <StatCard
      icon={<RefreshCw className="text-orange-600" size={24} />}
      label="Active Today"
      value={stats.activeToday}
    />
  </div>
);
