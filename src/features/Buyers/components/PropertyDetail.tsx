import {
  Home,
  Layers,
  Scan,
  Sofa,
  Building2,
  Hammer,
  ClipboardList,
  CheckCircle2,
  XCircle,
  Square,
  Maximize,
  Calendar,
  LayoutGrid,
} from "lucide-react";
import type { Property } from "../../../types";

interface PropertyDetailsProps {
  property: Property;
}

export const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  property,
}) => {
  // Format possession date if available
  const formatPossessionDate = (date?: string | Date | null) => {
    if (!date) return null;

    let parsedDate: Date;
    if (typeof date === "string") {
      parsedDate = new Date(date);
    } else {
      parsedDate = date;
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  // Format possession status
  const formatPossessionStatus = (status?: string | null) => {
    if (!status) return null;
    return status === "READY_TO_MOVE" ? "Ready to Move" : "Under Construction";
  };

  const specs = [
    { icon: Home, label: "Type", value: property.propertyType },
    { icon: Layers, label: "Subtype", value: property.subType },
    { icon: Scan, label: "Purpose", value: property.purpose },
    { icon: Sofa, label: "Furnishing", value: property.furnishingStatus },
    { icon: Building2, label: "Complex", value: property.complexName },
    { icon: Building2, label: "Balconies", value: property.balconies },
    { icon: Hammer, label: "Built", value: property.yearBuilt },
    {
      icon: ClipboardList,
      label: "Floors",
      value: property.floors || property.totalFloors,
    },
    { icon: LayoutGrid, label: "Total Flats", value: property.totalFlats },
    { icon: Building2, label: "Buildings", value: property.totalBuildings },
    {
      icon: Square,
      label: "Super Built",
      value: property.superBuiltArea
        ? `${property.superBuiltArea} sq ft`
        : null,
    },
    {
      icon: Square,
      label: "Built Up",
      value: property.builtUpArea ? `${property.builtUpArea} sq ft` : null,
    },
    {
      icon: Maximize,
      label: "Carpet Area",
      value: property.carpetArea ? `${property.carpetArea} sq ft` : null,
    },
    {
      icon: Calendar,
      label: "Status",
      value: formatPossessionStatus(property.possessionStatus),
    },
    {
      icon: Calendar,
      label: "Possession",
      value: formatPossessionDate(property.possessionDate),
    },
    { icon: Building2, label: "Builder", value: property.builderName },
  ].filter((s) => s.value);

  const legalCertified = !!property.reraNumber;

  return (
    <div className="w-full rounded-xl bg-white border border-gray-100 p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">
          Property Details
        </h3>

        <div className="flex items-center gap-1.5 text-xs sm:text-sm">
          {legalCertified ? (
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
          )}
          <span
            className={`font-medium ${
              legalCertified ? "text-green-700" : "text-gray-500"
            }`}
          >
            {legalCertified ? `RERA: ${property.reraNumber}` : "Not Certified"}
          </span>
        </div>
      </div>

      {/* SPECS GRID - Responsive 1 or 2 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 divide-y sm:divide-y-0 divide-gray-100">
        {specs.map((item, i) => (
          <div key={i} className={i > 0 ? "sm:border-t-0" : ""}>
            <MiniSpecRow item={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

/*** COMPACT SPEC ROW WITH RESPONSIVE DESIGN ***/
const MiniSpecRow: React.FC<{ item: any }> = ({ item }) => {
  const Icon = item.icon;

  return (
    <div className="flex items-center py-2.5 sm:py-3 gap-3">
      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />

      <span className="text-[10px] sm:text-xs uppercase tracking-wide text-gray-500 w-20 sm:w-24 flex-shrink-0">
        {item.label}
      </span>

      <span className="text-sm sm:text-base font-semibold text-gray-800 truncate">
        {item.value}
      </span>
    </div>
  );
};
