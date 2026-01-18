import { EyeIcon, MessageCircle, HeartIcon } from "lucide-react";
import type { TopItem } from "../../../types";

interface TopPropertiesTableProps {
  data: TopItem[];
  metric: "views" | "inquiries" | "favorites";
}

export default function TopPropertiesTable({
  data,
  metric,
}: TopPropertiesTableProps) {
  const getMetricIcon = () => {
    switch (metric) {
      case "views":
        return <EyeIcon className="w-4 h-4 text-blue-600" />;
      case "inquiries":
        return <MessageCircle className="w-4 h-4 text-green-600" />;
      case "favorites":
        return <HeartIcon className="w-4 h-4 text-red-600" />;
    }
  };

  const getMetricLabel = () => {
    switch (metric) {
      case "views":
        return "Views";
      case "inquiries":
        return "Inquiries";
      case "favorites":
        return "Favorites";
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="py-3 text-left text-sm font-medium text-gray-500">
              #
            </th>
            <th className="py-3 text-left text-sm font-medium text-gray-500">
              Property
            </th>
            <th className="py-3 text-left text-sm font-medium text-gray-500">
              Location
            </th>
            <th className="py-3 text-left text-sm font-medium text-gray-500">
              <div className="flex items-center gap-1">
                {getMetricIcon()}
                {getMetricLabel()}
              </div>
            </th>
            <th className="py-3 text-left text-sm font-medium text-gray-500">
              Change
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={item.id}
              className="border-b border-gray-100 dark:border-gray-800 last:border-0"
            >
              <td className="py-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700">
                  <span className="text-sm font-medium">{index + 1}</span>
                </div>
              </td>
              <td className="py-3">
                <div className="max-w-xs truncate">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {item.name}
                  </p>
                </div>
              </td>
              <td className="py-3 text-sm text-gray-600 dark:text-gray-400">
                {item.location || "N/A"}
              </td>
              <td className="py-3">
                <div className="flex items-center gap-2">
                  {getMetricIcon()}
                  <span className="font-medium">
                    {item.value.toLocaleString()}
                  </span>
                </div>
              </td>
              <td className="py-3">
                {item.change !== undefined && (
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      item.change > 0
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                    }`}
                  >
                    {item.change > 0 ? "+" : ""}
                    {item.change}%
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
