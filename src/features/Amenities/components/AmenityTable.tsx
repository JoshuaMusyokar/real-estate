import { Edit2, Trash2, Eye, EyeOff, Check, X, Loader2 } from "lucide-react";
import type { Amenity } from "../../../types";
import { useToggleAmenityStatusMutation } from "../../../services/AmenityApi";
import { usePermissions } from "../../../hooks/usePermissions";

interface AmenityTableProps {
  amenities: Amenity[];
  onEdit: (amenity: Amenity) => void;
  onDelete: (amenity: Amenity) => void;
}

export const AmenityTable = ({
  amenities,
  onEdit,
  onDelete,
}: AmenityTableProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Amenity
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Order
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {amenities.map((amenity) => (
            <TableRow
              key={amenity.id}
              amenity={amenity}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─── Row ──────────────────────────────────────────────────────────────────────

const TableRow = ({
  amenity,
  onEdit,
  onDelete,
}: {
  amenity: Amenity;
  onEdit: (amenity: Amenity) => void;
  onDelete: (amenity: Amenity) => void;
}) => (
  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        {amenity.icon &&
          (amenity.icon.startsWith("/") || amenity.icon.startsWith("http") ? (
            <img
              src={amenity.icon}
              alt={amenity.name}
              className="w-6 h-6 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <span className="text-2xl">{amenity.icon}</span>
          ))}
        <span className="font-medium text-gray-900 dark:text-white">
          {amenity.name}
        </span>
      </div>
    </td>
    <td className="px-6 py-4">
      {amenity.category ? (
        <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
          {amenity.category}
        </span>
      ) : (
        <span className="text-gray-400 dark:text-gray-600 text-sm">—</span>
      )}
    </td>
    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
      {amenity.order}
    </td>
    <td className="px-6 py-4">
      <StatusBadge isActive={amenity.isActive} />
    </td>
    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
      {new Date(amenity.createdAt).toLocaleDateString()}
    </td>
    <td className="px-6 py-4 text-right">
      <TableActions amenity={amenity} onEdit={onEdit} onDelete={onDelete} />
    </td>
  </tr>
);

// ─── Status badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ isActive }: { isActive: boolean }) => (
  <span
    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
      isActive
        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
    }`}
  >
    {isActive ? (
      <>
        <Check className="w-3 h-3" /> Active
      </>
    ) : (
      <>
        <X className="w-3 h-3" /> Inactive
      </>
    )}
  </span>
);

// ─── Row actions ──────────────────────────────────────────────────────────────

const TableActions = ({
  amenity,
  onEdit,
  onDelete,
}: {
  amenity: Amenity;
  onEdit: (amenity: Amenity) => void;
  onDelete: (amenity: Amenity) => void;
}) => {
  const [toggleStatus, { isLoading: isToggling }] =
    useToggleAmenityStatusMutation();
  const { can } = usePermissions();

  const canEdit = can("amenity.edit");
  const canDelete = can("amenity.delete");
  const canToggle = can("amenity.toggle_status");

  // Nothing to show — render nothing rather than a decorative lock icon
  if (!canEdit && !canDelete && !canToggle) return null;

  return (
    <div className="flex items-center justify-end gap-2">
      {canEdit && (
        <button
          onClick={() => onEdit(amenity)}
          title="Edit"
          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      )}

      {canToggle && (
        <button
          onClick={() => toggleStatus(amenity.id)}
          disabled={isToggling}
          title={amenity.isActive ? "Deactivate" : "Activate"}
          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isToggling ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : amenity.isActive ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      )}

      {canDelete && (
        <button
          onClick={() => onDelete(amenity)}
          title="Delete"
          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
