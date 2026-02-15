import type { FC } from "react";
import { cn } from "../../utils";
import { Card, CardContent } from "../../components/ui/Card";

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
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardContent className="p-3 sm:p-4 md:p-5 lg:p-6">
        <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
          <div
            className={cn(
              "rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0",
              "w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12",
              colorVariants[color],
            )}
          >
            <Icon className="w-5 h-5 sm:w-5 sm:h-5 md:w-5.5 md:h-5.5 lg:w-6 lg:h-6" />
          </div>

          {change !== undefined && (
            <span
              className={cn(
                "font-bold rounded-full flex-shrink-0 whitespace-nowrap",
                "text-xs px-1.5 py-0.5 sm:text-sm sm:px-2 sm:py-1",
                change >= 0
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700",
              )}
            >
              {change >= 0 ? "+" : ""}
              {change}%
            </span>
          )}
        </div>

        <div className="text-xl font-bold text-gray-900 mb-0.5 sm:text-2xl md:text-2xl lg:text-3xl">
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
        <div className="text-xs text-gray-600 font-medium sm:text-sm md:text-sm line-clamp-1">
          {label}
        </div>
      </CardContent>
    </Card>
  );
};
