import { type FC } from "react";
import { Star, Loader2 } from "lucide-react";
import { useToggleFeaturedMutation } from "../../../services/propertyApi";
import { useAuth } from "../../../hooks/useAuth";

interface FeaturedToggleProps {
  propertyId: string;
  isFeatured: boolean;
  compact?: boolean;
  onToggle?: (newStatus: boolean) => void;
}

export const FeaturedToggle: FC<FeaturedToggleProps> = ({
  propertyId,
  isFeatured,
  compact = false,
  onToggle,
}) => {
  const { user } = useAuth();
  const [toggleFeatured, { isLoading }] = useToggleFeaturedMutation();

  const handleToggle = async () => {
    if (
      !user ||
      (user.role.name !== "ADMIN" && user.role.name !== "SUPER_ADMIN")
    ) {
      return;
    }

    try {
      await toggleFeatured({ propertyId }).unwrap();
      if (onToggle) {
        onToggle(!isFeatured);
      }
    } catch (error) {
      console.error("Failed to toggle featured status:", error);
    }
  };

  // Only show for admins
  if (
    !user ||
    (user.role.name !== "ADMIN" && user.role.name !== "SUPER_ADMIN")
  ) {
    return null;
  }

  if (compact) {
    return (
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`p-1.5 rounded-lg transition-colors ${
          isFeatured
            ? "bg-amber-100 text-amber-600 hover:bg-amber-200"
            : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-500"
        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        title={isFeatured ? "Remove from featured" : "Add to featured"}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Star className={`w-4 h-4 ${isFeatured ? "fill-current" : ""}`} />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
        isFeatured
          ? "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-200 hover:from-amber-100 hover:to-orange-100"
          : "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 border border-gray-200 hover:from-gray-100 hover:to-gray-200"
      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Star className={`w-4 h-4 ${isFeatured ? "fill-current" : ""}`} />
      )}
      {isFeatured ? "Featured" : "Mark as Featured"}
    </button>
  );
};
