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
import type { FC } from "react";
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
  // Determine property type
  const isResidential = property.propertyType?.name === "RESIDENTIAL";
  const isCommercial = property.propertyType?.name === "COMMERCIAL";
  const isIndustrial = property.propertyType?.name === "INDUSTRIAL";
  const isLand = property.propertyType?.name === "LAND";

  // Helper function to format area with unit
  const formatArea = (area: number | null, unit: string | null): string => {
    if (!area) return "N/A";
    const unitDisplay = unit || "sq ft";
    return `${area.toLocaleString()} ${unitDisplay}`;
  };

  // Helper function to format boolean as Yes/No
  const formatBoolean = (value: boolean | null | undefined): string => {
    if (value === null || value === undefined) return "N/A";
    return value ? "Yes" : "No";
  };

  // Get the primary area measurement
  const getPrimaryArea = () => {
    if (property.carpetArea) {
      return formatArea(property.carpetArea, property.carpetAreaUnit);
    } else if (property.builtUpArea) {
      return formatArea(property.builtUpArea, property.builtUpAreaUnit);
    } else if (property.superBuiltArea) {
      return formatArea(property.superBuiltArea, property.superBuiltAreaUnit);
    } else if (property.squareFeet) {
      return `${property.squareFeet.toLocaleString()} sq ft`;
    }
    return "N/A";
  };

  // Build stats array based on property type
  let stats: Array<{
    icon: any;
    label: string;
    value: string | number;
    show?: boolean;
  }> = [];

  if (isResidential) {
    stats = [
      {
        icon: Bed,
        label: "Bedrooms",
        value: property.bedrooms || "N/A",
        show: property.bedrooms !== null && property.bedrooms !== undefined,
      },
      {
        icon: Bath,
        label: "Bathrooms",
        value: property.bathrooms || "N/A",
        show: property.bathrooms !== null && property.bathrooms !== undefined,
      },
      {
        icon: Square,
        label: "Area",
        value: getPrimaryArea(),
        show: getPrimaryArea() !== "N/A",
      },
      {
        icon: Building2,
        label: property.floors ? "Floors" : "Floor Number",
        value: property.floors || property.floorNumber || "N/A",
        show:
          (property.floors !== null && property.floors !== undefined) ||
          (property.floorNumber !== null && property.floorNumber !== undefined),
      },
      {
        icon: Home,
        label: "Furnishing",
        value: property.furnishingStatus || "N/A",
        show:
          property.furnishingStatus !== null &&
          property.furnishingStatus !== undefined,
      },
      {
        icon: Calendar,
        label: "Year Built",
        value: property.yearBuilt || "N/A",
        show: property.yearBuilt !== null && property.yearBuilt !== undefined,
      },
      {
        icon: ParkingCircle,
        label: "Parking",
        value:
          (property.coveredParking || 0) + (property.openParking || 0) || "N/A",
        show:
          (property.coveredParking !== null &&
            property.coveredParking !== undefined &&
            property.coveredParking > 0) ||
          (property.openParking !== null &&
            property.openParking !== undefined &&
            property.openParking > 0),
      },
      {
        icon: DoorClosed,
        label: "Balconies",
        value: property.balconies || "N/A",
        show:
          property.balconies !== null &&
          property.balconies !== undefined &&
          property.balconies > 0,
      },
    ];
  } else if (isCommercial) {
    const officeSubType = property.subType?.name === "OFFICE";
    const retailSubType = property.subType?.name === "RETAIL";

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
        value: property.furnishingStatus || "N/A",
        show:
          property.furnishingStatus !== null &&
          property.furnishingStatus !== undefined,
      },
      {
        icon: Building2,
        label: "Floor",
        value: property.floorNumber || "N/A",
        show:
          property.floorNumber !== null && property.floorNumber !== undefined,
      },
      {
        icon: Navigation,
        label: "Facing",
        value: property.facingDirection || "N/A",
        show:
          property.facingDirection !== null &&
          property.facingDirection !== undefined,
      },
      {
        icon: DoorClosed,
        label: "Cabins",
        value: property.cabins || "N/A",
        show:
          officeSubType &&
          property.cabins !== null &&
          property.cabins !== undefined,
      },
      {
        icon: Users,
        label: "Seats",
        value: property.seats || "N/A",
        show:
          officeSubType &&
          property.seats !== null &&
          property.seats !== undefined,
      },
      {
        icon: Briefcase,
        label: "Meeting Rooms",
        value: property.meetingRooms || "N/A",
        show:
          officeSubType &&
          property.meetingRooms !== null &&
          property.meetingRooms !== undefined,
      },
      {
        icon: ParkingCircle,
        label: "Parking",
        value:
          (property.coveredParking || 0) + (property.openParking || 0) || "N/A",
        show:
          (property.coveredParking !== null &&
            property.coveredParking !== undefined &&
            property.coveredParking > 0) ||
          (property.openParking !== null &&
            property.openParking !== undefined &&
            property.openParking > 0),
      },
      {
        icon: CheckCircle2,
        label: "Pre-Rented",
        value: formatBoolean(property.preRented),
        show: property.preRented !== null && property.preRented !== undefined,
      },
      {
        icon: Ruler,
        label: "Frontage Width",
        value: property.frontageWidth ? `${property.frontageWidth} ft` : "N/A",
        show:
          retailSubType &&
          property.frontageWidth !== null &&
          property.frontageWidth !== undefined,
      },
      {
        icon: Building,
        label: "Main Road",
        value: formatBoolean(property.mainRoadFacing),
        show:
          property.mainRoadFacing !== null &&
          property.mainRoadFacing !== undefined,
      },
      {
        icon: Calendar,
        label: "Year Built",
        value: property.yearBuilt || "N/A",
        show: property.yearBuilt !== null && property.yearBuilt !== undefined,
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
        show:
          property.coveredArea !== null && property.coveredArea !== undefined,
      },
      {
        icon: Package,
        label: "Open Area",
        value: property.openArea
          ? `${property.openArea.toLocaleString()} sq ft`
          : "N/A",
        show: property.openArea !== null && property.openArea !== undefined,
      },
      {
        icon: Building2,
        label: "Ceiling Height",
        value: property.ceilingHeight || "N/A",
        show:
          property.ceilingHeight !== null &&
          property.ceilingHeight !== undefined,
      },
      {
        icon: DoorClosed,
        label: "Loading Docks",
        value: property.loadingDocks || "N/A",
        show:
          property.loadingDocks !== null && property.loadingDocks !== undefined,
      },
      {
        icon: Briefcase,
        label: "Power Load",
        value: property.powerLoad || "N/A",
        show: property.powerLoad !== null && property.powerLoad !== undefined,
      },
      {
        icon: Square,
        label: "Flooring",
        value: property.flooringType || "N/A",
        show:
          property.flooringType !== null && property.flooringType !== undefined,
      },
      {
        icon: ParkingCircle,
        label: "Parking",
        value:
          (property.coveredParking || 0) + (property.openParking || 0) || "N/A",
        show:
          (property.coveredParking !== null &&
            property.coveredParking !== undefined &&
            property.coveredParking > 0) ||
          (property.openParking !== null &&
            property.openParking !== undefined &&
            property.openParking > 0),
      },
      {
        icon: Calendar,
        label: "Year Built",
        value: property.yearBuilt || "N/A",
        show: property.yearBuilt !== null && property.yearBuilt !== undefined,
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
        show: property.plotArea !== null && property.plotArea !== undefined,
      },
      {
        icon: Ruler,
        label: "Dimensions",
        value: property.plotDimensions || "N/A",
        show:
          property.plotDimensions !== null &&
          property.plotDimensions !== undefined,
      },
      {
        icon: Navigation,
        label: "Facing",
        value: property.facingDirection || "N/A",
        show:
          property.facingDirection !== null &&
          property.facingDirection !== undefined,
      },
      {
        icon: Building,
        label: "Boundary Wall",
        value: formatBoolean(property.boundaryWall),
        show:
          property.boundaryWall !== null && property.boundaryWall !== undefined,
      },
      {
        icon: CheckCircle2,
        label: "Corner Plot",
        value: formatBoolean(property.cornerPlot),
        show: property.cornerPlot !== null && property.cornerPlot !== undefined,
      },
      {
        icon: Building2,
        label: "Road Width",
        value: property.roadWidth || "N/A",
        show: property.roadWidth !== null && property.roadWidth !== undefined,
      },
      {
        icon: Home,
        label: "Clear Title",
        value: formatBoolean(property.clearTitle),
        show: property.clearTitle !== null && property.clearTitle !== undefined,
      },
      {
        icon: Calendar,
        label: "Zoning",
        value: property.zoningType || "N/A",
        show: property.zoningType !== null && property.zoningType !== undefined,
      },
    ];
  }

  // Filter out stats that should not be shown
  const visibleStats = stats.filter((stat) => stat.show !== false);

  // Show message if no stats available
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
        <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">
          Property Specifications
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 md:p-6 pt-0">
        <div
          className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 ${
            visibleStats.length >= 8
              ? "lg:grid-cols-5 xl:grid-cols-6"
              : visibleStats.length >= 6
                ? "lg:grid-cols-4 xl:grid-cols-5"
                : "lg:grid-cols-3 xl:grid-cols-4"
          } gap-3 sm:gap-4`}
        >
          {visibleStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center hover:shadow-md hover:border-blue-300 hover:from-blue-50 hover:to-white transition-all duration-200"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </div>
                <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-0.5 sm:mb-1 truncate">
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-600 font-medium uppercase tracking-wide line-clamp-1">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
