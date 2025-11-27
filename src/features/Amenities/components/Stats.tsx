import { Package, Eye, EyeOff, Tag } from "lucide-react";
import type { Amenity } from "./../../../types";

interface StatsProps {
  amenities: Amenity[];
  categories: string[];
  pagination?: any;
}

export const Stats = ({ amenities, categories, pagination }: StatsProps) => {
  const activeCount = amenities.filter((a) => a.isActive).length;
  const inactiveCount = amenities.filter((a) => !a.isActive).length;
  type StatColor = "blue" | "green" | "gray" | "purple";
  const stats: {
    label: string;
    value: number;
    icon: any;
    color: StatColor;
  }[] = [
    {
      label: "Total Amenities",
      value: pagination?.total || 0,
      icon: Package,
      color: "blue",
    },
    { label: "Active", value: activeCount, icon: Eye, color: "green" },
    { label: "Inactive", value: inactiveCount, icon: EyeOff, color: "gray" },
    {
      label: "Categories",
      value: categories.length,
      icon: Tag,
      color: "purple",
    },
  ];

  const colorClasses = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    green:
      "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    gray: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400",
    purple:
      "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                colorClasses[stat.color]
              }`}
            >
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
