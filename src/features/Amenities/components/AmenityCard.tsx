import {
  MoreVertical,
  Check,
  X,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  Loader2,
} from "lucide-react";
import type { Amenity } from "../../../types";
import { useToggleAmenityStatusMutation } from "../../../services/AmenityApi";
import { usePermissions } from "../../../hooks/usePermissions";

interface AmenityCardProps {
  amenity: Amenity;
  onEdit: (amenity: Amenity) => void;
  onDelete: (amenity: Amenity) => void;
  activeDropdown: string | null;
  onDropdownToggle: (id: string | null) => void;
}

export const AmenityCard = ({
  amenity,
  onEdit,
  onDelete,
  activeDropdown,
  onDropdownToggle,
}: AmenityCardProps) => {
  const { can } = usePermissions();
  const hasAnyAction =
    can("amenity.edit") ||
    can("amenity.delete") ||
    can("amenity.toggle_status");

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {amenity.icon && (
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              {amenity.icon.startsWith("/") ||
              amenity.icon.startsWith("http") ? (
                <img
                  src={amenity.icon}
                  alt={amenity.name}
                  className="w-6 h-6 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <span className="text-xl">{amenity.icon}</span>
              )}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {amenity.name}
            </h3>
            {amenity.category && (
              <span className="inline-block text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded mt-1">
                {amenity.category}
              </span>
            )}
          </div>
        </div>

        {/* Three-dot menu — only rendered if user has at least one action */}
        {hasAnyAction && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDropdownToggle(
                  activeDropdown === amenity.id ? null : amenity.id,
                );
              }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            {activeDropdown === amenity.id && (
              <DropdownMenu
                amenity={amenity}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          Order: {amenity.order}
        </span>
        <StatusBadge isActive={amenity.isActive} />
      </div>
    </div>
  );
};

// ─── Dropdown ─────────────────────────────────────────────────────────────────
// Only rendered when hasAnyAction is true, but each item is still
// individually gated so a user with only toggle_status only sees Activate/Deactivate.

const DropdownMenu = ({
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
  const canToggle = can("amenity.toggle_status");
  const canDelete = can("amenity.delete");

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 py-1 z-10">
      {canEdit && (
        <button
          onClick={() => onEdit(amenity)}
          className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <Edit2 className="w-4 h-4" />
          Edit
        </button>
      )}

      {canToggle && (
        <button
          disabled={isToggling}
          onClick={() => toggleStatus(amenity.id)}
          className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isToggling ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Working...
            </>
          ) : amenity.isActive ? (
            <>
              <EyeOff className="w-4 h-4" /> Deactivate
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" /> Activate
            </>
          )}
        </button>
      )}

      {canDelete && (
        <button
          onClick={() => onDelete(amenity)}
          className="w-full flex items-center gap-2 px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      )}
    </div>
  );
};

// ─── Status badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ isActive }: { isActive: boolean }) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
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
