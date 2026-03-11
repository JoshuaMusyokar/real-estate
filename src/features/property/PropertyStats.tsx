import {
  Bath,
  Bed,
  Building2,
  Calendar,
  Home,
  Square,
  Users,
  DoorClosed,
  Building,
  Briefcase,
  ParkingCircle,
  Ruler,
  Package,
  Navigation,
  CheckCircle2,
  Warehouse,
} from "lucide-react";
import type { FC, ComponentType } from "react";
import type { Property } from "../../types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";

interface PropertyStatsProps {
  property: Property;
}

export const PropertyStats: FC<PropertyStatsProps> = ({ property }) => {
  const isResidential = property.propertyType?.name === "RESIDENTIAL";
  const isCommercial = property.propertyType?.name === "COMMERCIAL";
  const isIndustrial = property.propertyType?.name === "INDUSTRIAL";
  const isLand = property.propertyType?.name === "LAND";

  const formatArea = (area: number | null, unit: string | null) =>
    area ? `${area.toLocaleString()} ${unit || "sq ft"}` : "N/A";

  const formatBoolean = (value: boolean | null | undefined) =>
    value === null || value === undefined ? "N/A" : value ? "Yes" : "No";

  const getPrimaryArea = () => {
    if (property.carpetArea)
      return formatArea(property.carpetArea, property.carpetAreaUnit);
    if (property.builtUpArea)
      return formatArea(property.builtUpArea, property.builtUpAreaUnit);
    if (property.superBuiltArea)
      return formatArea(property.superBuiltArea, property.superBuiltAreaUnit);
    if (property.squareFeet)
      return `${property.squareFeet.toLocaleString()} sq ft`;
    return "N/A";
  };

  type Stat = {
    icon: ComponentType<{ className?: string }>;
    label: string;
    value: string | number;
    show?: boolean;
  };

  let stats: Stat[] = [];

  if (isResidential) {
    stats = [
      {
        icon: Bed,
        label: "Bedrooms",
        value: property.bedrooms ?? "N/A",
        show: property.bedrooms != null,
      },
      {
        icon: Bath,
        label: "Bathrooms",
        value: property.bathrooms ?? "N/A",
        show: property.bathrooms != null,
      },
      {
        icon: Square,
        label: "Area",
        value: getPrimaryArea(),
        show: getPrimaryArea() !== "N/A",
      },
      {
        icon: Building2,
        label: property.floors ? "Floors" : "Floor No.",
        value: property.floors || property.floorNumber || "N/A",
        show: property.floors != null || property.floorNumber != null,
      },
      {
        icon: Home,
        label: "Furnishing",
        value: property.furnishingStatus ?? "N/A",
        show: property.furnishingStatus != null,
      },
      {
        icon: Calendar,
        label: "Year Built",
        value: property.yearBuilt ?? "N/A",
        show: property.yearBuilt != null,
      },
      {
        icon: ParkingCircle,
        label: "Parking",
        value:
          (property.coveredParking || 0) + (property.openParking || 0) || "N/A",
        show:
          (property.coveredParking ?? 0) > 0 || (property.openParking ?? 0) > 0,
      },
      {
        icon: DoorClosed,
        label: "Balconies",
        value: property.balconies ?? "N/A",
        show: (property.balconies ?? 0) > 0,
      },
    ];
  } else if (isCommercial) {
    const isOffice = property.subType?.name === "OFFICE";
    const isRetail = property.subType?.name === "RETAIL";
    stats = [
      {
        icon: Square,
        label: "Area",
        value: getPrimaryArea(),
        show: getPrimaryArea() !== "N/A",
      },
      {
        icon: Home,
        label: "Furnishing",
        value: property.furnishingStatus ?? "N/A",
        show: property.furnishingStatus != null,
      },
      {
        icon: Building2,
        label: "Floor",
        value: property.floorNumber ?? "N/A",
        show: property.floorNumber != null,
      },
      {
        icon: Navigation,
        label: "Facing",
        value: property.facingDirection ?? "N/A",
        show: property.facingDirection != null,
      },
      {
        icon: DoorClosed,
        label: "Cabins",
        value: property.cabins ?? "N/A",
        show: isOffice && property.cabins != null,
      },
      {
        icon: Users,
        label: "Seats",
        value: property.seats ?? "N/A",
        show: isOffice && property.seats != null,
      },
      {
        icon: Briefcase,
        label: "Meeting Rooms",
        value: property.meetingRooms ?? "N/A",
        show: isOffice && property.meetingRooms != null,
      },
      {
        icon: ParkingCircle,
        label: "Parking",
        value:
          (property.coveredParking || 0) + (property.openParking || 0) || "N/A",
        show:
          (property.coveredParking ?? 0) > 0 || (property.openParking ?? 0) > 0,
      },
      {
        icon: CheckCircle2,
        label: "Pre-Rented",
        value: formatBoolean(property.preRented),
        show: property.preRented != null,
      },
      {
        icon: Ruler,
        label: "Frontage",
        value: property.frontageWidth ? `${property.frontageWidth} ft` : "N/A",
        show: isRetail && property.frontageWidth != null,
      },
      {
        icon: Building,
        label: "Main Road",
        value: formatBoolean(property.mainRoadFacing),
        show: property.mainRoadFacing != null,
      },
      {
        icon: Calendar,
        label: "Year Built",
        value: property.yearBuilt ?? "N/A",
        show: property.yearBuilt != null,
      },
    ];
  } else if (isIndustrial) {
    stats = [
      {
        icon: Square,
        label: "Total Area",
        value: getPrimaryArea(),
        show: getPrimaryArea() !== "N/A",
      },
      {
        icon: Warehouse,
        label: "Covered Area",
        value: property.coveredArea
          ? `${property.coveredArea.toLocaleString()} sq ft`
          : "N/A",
        show: property.coveredArea != null,
      },
      {
        icon: Package,
        label: "Open Area",
        value: property.openArea
          ? `${property.openArea.toLocaleString()} sq ft`
          : "N/A",
        show: property.openArea != null,
      },
      {
        icon: Building2,
        label: "Ceiling Height",
        value: property.ceilingHeight ?? "N/A",
        show: property.ceilingHeight != null,
      },
      {
        icon: DoorClosed,
        label: "Loading Docks",
        value: property.loadingDocks ?? "N/A",
        show: property.loadingDocks != null,
      },
      {
        icon: Briefcase,
        label: "Power Load",
        value: property.powerLoad ?? "N/A",
        show: property.powerLoad != null,
      },
      {
        icon: Square,
        label: "Flooring",
        value: property.flooringType ?? "N/A",
        show: property.flooringType != null,
      },
      {
        icon: ParkingCircle,
        label: "Parking",
        value:
          (property.coveredParking || 0) + (property.openParking || 0) || "N/A",
        show:
          (property.coveredParking ?? 0) > 0 || (property.openParking ?? 0) > 0,
      },
      {
        icon: Calendar,
        label: "Year Built",
        value: property.yearBuilt ?? "N/A",
        show: property.yearBuilt != null,
      },
    ];
  } else if (isLand) {
    stats = [
      {
        icon: Square,
        label: "Plot Area",
        value: property.plotArea
          ? formatArea(property.plotArea, property.plotAreaUnit)
          : "N/A",
        show: property.plotArea != null,
      },
      {
        icon: Ruler,
        label: "Dimensions",
        value: property.plotDimensions ?? "N/A",
        show: property.plotDimensions != null,
      },
      {
        icon: Navigation,
        label: "Facing",
        value: property.facingDirection ?? "N/A",
        show: property.facingDirection != null,
      },
      {
        icon: Building,
        label: "Boundary Wall",
        value: formatBoolean(property.boundaryWall),
        show: property.boundaryWall != null,
      },
      {
        icon: CheckCircle2,
        label: "Corner Plot",
        value: formatBoolean(property.cornerPlot),
        show: property.cornerPlot != null,
      },
      {
        icon: Building2,
        label: "Road Width",
        value: property.roadWidth ?? "N/A",
        show: property.roadWidth != null,
      },
      {
        icon: Home,
        label: "Clear Title",
        value: formatBoolean(property.clearTitle),
        show: property.clearTitle != null,
      },
      {
        icon: Calendar,
        label: "Zoning",
        value: property.zoningType ?? "N/A",
        show: property.zoningType != null,
      },
    ];
  }

  const visibleStats = stats.filter((s) => s.show !== false);

  if (visibleStats.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 sm:p-8 text-center">
          <Building2 className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm sm:text-base text-gray-600">
            Property specifications not available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="p-4 sm:p-5 md:p-6">
        <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
          Property Specifications
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 md:p-6 pt-0">
        {/*
          Horizontal row layout: icon · label on top · value below.
          Min-width on each cell prevents truncation; the grid auto-fills
          so it adapts to however many stats there are.
        */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {visibleStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200"
              >
                {/* Icon pill */}
                <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                {/* Text */}
                <div className="min-w-0">
                  <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium leading-tight mb-0.5">
                    {stat.label}
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                    {stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
