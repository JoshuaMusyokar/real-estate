import { EyeIcon, MessageCircle, HeartIcon } from "lucide-react";
import { useGetTopPropertiesQuery } from "../../../services/analyticsApi";
import Badge from "../../../components/ui/badge/Badge";

interface TopPropertiesTableProps {
  limit: number;
  period: "today" | "7d" | "30d" | "90d" | "1y" | "custom";
  by: "views" | "inquiries" | "favorites";
}

export default function TopPropertiesTable({
  limit,
  period,
  by,
}: TopPropertiesTableProps) {
  const { data, isLoading } = useGetTopPropertiesQuery({
    limit,
    period,
    by,
  });

  const getIcon = () => {
    switch (by) {
      case "views":
        return <EyeIcon className="w-4 h-4" />;
      case "inquiries":
        return <MessageCircle className="w-4 h-4" />;
      case "favorites":
        return <HeartIcon className="w-4 h-4" />;
    }
  };

  const getColumnTitle = () => {
    switch (by) {
      case "views":
        return "Views";
      case "inquiries":
        return "Inquiries";
      case "favorites":
        return "Favorites";
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Top Properties
        </h3>
        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
          By {by}
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="text-gray-500">Loading properties...</div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="py-3 text-left text-xs font-medium text-gray-500">
                  Property
                </th>
                <th className="py-3 text-left text-xs font-medium text-gray-500">
                  Type
                </th>
                <th className="py-3 text-left text-xs font-medium text-gray-500">
                  Location
                </th>
                <th className="py-3 text-left text-xs font-medium text-gray-500">
                  {getColumnTitle()}
                </th>
                <th className="py-3 text-left text-xs font-medium text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((property, index) => (
                <tr
                  key={property.id}
                  className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                >
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          Property #{index + 1}
                        </p>
                        <p className="text-xs text-gray-500">{property.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-gray-600">
                    {property.location?.split(",")[0] || "Residential"}
                  </td>
                  <td className="py-4 text-sm text-gray-600">
                    {property.location || "N/A"}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      {getIcon()}
                      <span className="text-sm font-medium">
                        {property.value.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="py-4">
                    <Badge
                      size="sm"
                      color={
                        property.change && property.change > 0
                          ? "success"
                          : "error"
                      }
                    >
                      {property.change && property.change > 0 ? "+" : ""}
                      {property.change || 0}%
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
