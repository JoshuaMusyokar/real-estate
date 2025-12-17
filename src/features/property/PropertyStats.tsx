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

  // Get the primary area measurement (prioritize carpet > built-up > super built-up > square feet)
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
        show: property.bedrooms !== null,
      },
      {
        icon: Bath,
        label: "Bathrooms",
        value: property.bathrooms || "N/A",
        show: property.bathrooms !== null,
      },
      {
        icon: Square,
        label: "Area",
        value: getPrimaryArea(),
        show: true,
      },
      {
        icon: Building2,
        label: property.floors ? "Floors" : "Floor Number",
        value: property.floors || property.floorNumber || "N/A",
        show: property.floors !== null || property.floorNumber !== null,
      },
      {
        icon: Home,
        label: "Furnishing",
        value: property.furnishingStatus || "N/A",
        show: property.furnishingStatus !== null,
      },
      {
        icon: Calendar,
        label: "Year Built",
        value: property.yearBuilt || "N/A",
        show: property.yearBuilt !== null,
      },
      {
        icon: ParkingCircle,
        label: "Parking",
        value:
          (property.coveredParking || 0) + (property.openParking || 0) || "N/A",
        show:
          (property.coveredParking !== null && property.coveredParking > 0) ||
          (property.openParking !== null && property.openParking > 0),
      },
      {
        icon: DoorClosed,
        label: "Balconies",
        value: property.balconies || "N/A",
        show: property.balconies !== null && property.balconies > 0,
      },
    ];
  } else if (isCommercial) {
    // Commercial property stats
    const officeSubType = property.subType?.name === "OFFICE";
    const retailSubType = property.subType?.name === "RETAIL";

    stats = [
      {
        icon: Square,
        label: "Area",
        value: getPrimaryArea(),
        show: true,
      },
      {
        icon: Home,
        label: "Furnishing",
        value: property.furnishingStatus || "N/A",
        show: property.furnishingStatus !== null,
      },
      {
        icon: Building2,
        label: "Floor",
        value: property.floorNumber || "N/A",
        show: property.floorNumber !== null,
      },
      {
        icon: Navigation,
        label: "Facing",
        value: property.facingDirection || "N/A",
        show: property.facingDirection !== null,
      },
      {
        icon: DoorClosed,
        label: "Cabins",
        value: property.cabins || "N/A",
        show: officeSubType && property.cabins !== null,
      },
      {
        icon: Users,
        label: "Seats",
        value: property.seats || "N/A",
        show: officeSubType && property.seats !== null,
      },
      {
        icon: Briefcase,
        label: "Meeting Rooms",
        value: property.meetingRooms || "N/A",
        show: officeSubType && property.meetingRooms !== null,
      },
      {
        icon: ParkingCircle,
        label: "Parking",
        value:
          (property.coveredParking || 0) + (property.openParking || 0) || "N/A",
        show:
          (property.coveredParking !== null && property.coveredParking > 0) ||
          (property.openParking !== null && property.openParking > 0),
      },
      {
        icon: CheckCircle2,
        label: "Pre-Rented",
        value: formatBoolean(property.preRented),
        show: property.preRented !== null,
      },
      {
        icon: Ruler,
        label: "Frontage Width",
        value: property.frontageWidth ? `${property.frontageWidth} ft` : "N/A",
        show: retailSubType && property.frontageWidth !== null,
      },
      {
        icon: Building,
        label: "Main Road",
        value: formatBoolean(property.mainRoadFacing),
        show: property.mainRoadFacing !== null,
      },
      {
        icon: Calendar,
        label: "Year Built",
        value: property.yearBuilt || "N/A",
        show: property.yearBuilt !== null,
      },
    ];
  } else if (isIndustrial) {
    // Industrial/Warehouse stats
    stats = [
      {
        icon: Square,
        label: "Total Area",
        value: getPrimaryArea(),
        show: true,
      },
      {
        icon: Warehouse,
        label: "Covered Area",
        value: property.coveredArea
          ? `${property.coveredArea.toLocaleString()} sq ft`
          : "N/A",
        show: property.coveredArea !== null,
      },
      {
        icon: Package,
        label: "Open Area",
        value: property.openArea
          ? `${property.openArea.toLocaleString()} sq ft`
          : "N/A",
        show: property.openArea !== null,
      },
      {
        icon: Building2,
        label: "Ceiling Height",
        value: property.ceilingHeight || "N/A",
        show: property.ceilingHeight !== null,
      },
      {
        icon: DoorClosed,
        label: "Loading Docks",
        value: property.loadingDocks || "N/A",
        show: property.loadingDocks !== null,
      },
      {
        icon: Briefcase,
        label: "Power Load",
        value: property.powerLoad || "N/A",
        show: property.powerLoad !== null,
      },
      {
        icon: Square,
        label: "Flooring",
        value: property.flooringType || "N/A",
        show: property.flooringType !== null,
      },
      {
        icon: ParkingCircle,
        label: "Parking",
        value:
          (property.coveredParking || 0) + (property.openParking || 0) || "N/A",
        show:
          (property.coveredParking !== null && property.coveredParking > 0) ||
          (property.openParking !== null && property.openParking > 0),
      },
      {
        icon: Calendar,
        label: "Year Built",
        value: property.yearBuilt || "N/A",
        show: property.yearBuilt !== null,
      },
    ];
  } else if (isLand) {
    // Land/Plot stats
    stats = [
      {
        icon: Square,
        label: "Plot Area",
        value: property.plotArea
          ? formatArea(property.plotArea, property.plotAreaUnit)
          : "N/A",
        show: true,
      },
      {
        icon: Ruler,
        label: "Dimensions",
        value: property.plotDimensions || "N/A",
        show: property.plotDimensions !== null,
      },
      {
        icon: Navigation,
        label: "Facing",
        value: property.facingDirection || "N/A",
        show: property.facingDirection !== null,
      },
      {
        icon: Building,
        label: "Boundary Wall",
        value: formatBoolean(property.boundaryWall),
        show: property.boundaryWall !== null,
      },
      {
        icon: CheckCircle2,
        label: "Corner Plot",
        value: formatBoolean(property.cornerPlot),
        show: property.cornerPlot !== null,
      },
      {
        icon: Building2,
        label: "Road Width",
        value: property.roadWidth || "N/A",
        show: property.roadWidth !== null,
      },
      {
        icon: Home,
        label: "Clear Title",
        value: formatBoolean(property.clearTitle),
        show: property.clearTitle !== null,
      },
      {
        icon: Calendar,
        label: "Zoning",
        value: property.zoningType || "N/A",
        show: property.zoningType !== null,
      },
    ];
  }

  // Filter out stats that should not be shown
  const visibleStats = stats.filter((stat) => stat.show !== false);

  // Show message if no stats available
  if (visibleStats.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
        <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">Property specifications not available</p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-3 ${
        visibleStats.length >= 6
          ? "lg:grid-cols-6"
          : visibleStats.length >= 4
          ? "lg:grid-cols-4"
          : "lg:grid-cols-3"
      } gap-4`}
    >
      {visibleStats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md hover:border-purple-300 transition-all duration-200"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-50 to-indigo-50 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Icon className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <div className="text-xs text-gray-600 font-medium uppercase tracking-wide">
              {stat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};
