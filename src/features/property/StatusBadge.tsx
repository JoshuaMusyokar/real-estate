import type { PropertyStatus } from "../../types";
interface StatusBadgeProps {
  status: PropertyStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const variants: Record<PropertyStatus, string> = {
    AVAILABLE: "bg-emerald-50 text-emerald-700 border-emerald-200",
    SOLD: "bg-slate-100 text-slate-700 border-slate-200",
    RENTED: "bg-blue-50 text-blue-700 border-blue-200",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    UNDER_REVIEW: "bg-orange-50 text-orange-700 border-orange-200",
    REJECTED: "bg-red-50 text-red-700 border-red-200",
    DRAFT: "bg-gray-50 text-gray-600 border-gray-200",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${variants[status]}`}
    >
      {status.replace("_", " ")}
    </span>
  );
};
