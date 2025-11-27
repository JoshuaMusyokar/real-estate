import { AmenityCard } from "./AmenityCard";
import type { Amenity, User } from "../../../types";

interface AmenityGridProps {
  amenities: Amenity[];
  user: Omit<User, "password" | "twoFactorSecret">;
  onEdit: (amenity: Amenity) => void;
  onDelete: (amenity: Amenity) => void;
  activeDropdown: string | null;
  onDropdownToggle: (id: string | null) => void;
}

export const AmenityGrid = ({
  amenities,
  user,
  onEdit,
  onDelete,
  activeDropdown,
  onDropdownToggle,
}: AmenityGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {amenities.map((amenity) => (
        <AmenityCard
          key={amenity.id}
          amenity={amenity}
          user={user}
          onEdit={onEdit}
          onDelete={onDelete}
          activeDropdown={activeDropdown}
          onDropdownToggle={onDropdownToggle}
        />
      ))}
    </div>
  );
};
