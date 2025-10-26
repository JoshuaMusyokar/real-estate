import type { FC } from "react";

interface StatsCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  change?: number;
  color?: "blue" | "green" | "amber" | "purple";
}
export const StatsCard: FC<StatsCardProps> = ({
  icon: Icon,
  label,
  value,
  change,
  color = "blue",
}) => {
  const colorVariants = {
    blue: "bg-blue-500 text-white",
    green: "bg-emerald-500 text-white",
    amber: "bg-amber-500 text-white",
    purple: "bg-purple-500 text-white",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl ${colorVariants[color]} flex items-center justify-center shadow-lg`}
        >
          <Icon className="w-6 h-6" />
        </div>
        {change !== undefined && (
          <span
            className={`text-sm font-bold px-2 py-1 rounded-full ${
              change >= 0
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {change >= 0 ? "+" : ""}
            {change}%
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600 font-medium">{label}</div>
    </div>
  );
};
