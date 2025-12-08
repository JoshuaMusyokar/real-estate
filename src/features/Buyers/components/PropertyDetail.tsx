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
  Rows,
  Car,
  MoveVertical,
  Building,
  Briefcase,
  Users,
  DoorOpen,
  Coffee,
  MapPin,
  Compass,
  Ruler,
  Zap,
  Droplet,
  Factory,
  Package,
  Warehouse,
} from "lucide-react";
import type { Property } from "../../../types";
import { PROPERTY_FIELD_CONFIG, FIELD_METADATA } from "../../../config";

interface PropertyDetailsProps {
  property: Property;
}

// Icon mapping for fields
const FIELD_ICONS: Record<string, any> = {
  // Basic
  title: Home,
  propertyType: Home,
  subType: Layers,
  purpose: Scan,

  // Residential
  bedrooms: Home,
  bathrooms: Building2,
  balconies: Building2,
  furnishingStatus: Sofa,

  // Area
  carpetArea: Maximize,
  builtUpArea: Square,
  superBuiltArea: Square,
  plotArea: Square,
  plotDimensions: Ruler,
  coveredArea: Square,
  openArea: Square,
  squareFeet: Square,
  squareMeters: Square,

  // Building
  floorNumber: ClipboardList,
  totalFloors: Rows,
  floors: Rows,
  totalFlats: LayoutGrid,
  totalBuildings: Building2,
  complexName: Building2,
  yearBuilt: Hammer,

  // Parking & Lifts
  coveredParking: Car,
  openParking: Car,
  publicParking: Car,
  passengerLifts: MoveVertical,
  serviceLifts: MoveVertical,

  // Commercial
  projectName: Building,
  locatedWithin: MapPin,
  officeType: Briefcase,
  officesPerFloor: Building,
  officesInProject: Building,
  buildingsInProject: Building2,
  cabins: DoorOpen,
  seats: Users,
  privateWashrooms: Building,
  publicWashrooms: Building,
  conferenceRooms: Users,
  receptionArea: Building,
  meetingRooms: Users,
  pantryType: Coffee,
  preRented: CheckCircle2,
  nocCertified: CheckCircle2,
  occupancyCertified: CheckCircle2,

  // Land/Plot
  boundaryWall: CheckCircle2,
  cornerPlot: CheckCircle2,
  facingDirection: Compass,
  zoningType: MapPin,
  clearTitle: CheckCircle2,
  developmentStatus: Building,
  roadWidth: Ruler,
  electricityAvailable: Zap,
  waterConnection: Droplet,
  sewageConnection: Building,

  // Industrial/Warehouse
  ceilingHeight: Factory,
  loadingDocks: Package,
  powerLoad: Zap,
  flooringType: Warehouse,

  // Possession & Pricing
  possessionStatus: Calendar,
  possessionDate: Calendar,
  builderName: Building2,
  reraNumber: CheckCircle2,
  maintenanceCharges: Home,
  securityDeposit: Home,
  monthlyRent: Home,
  leasePeriod: Calendar,
  hasBalcony: Building2,
};

export const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  property,
}) => {
  // Get the fields that should be displayed for this property type/subtype
  const getRelevantFields = (): string[] => {
    const propertyType = property.propertyType?.name;
    const subType = property.subType?.name;

    if (!propertyType) return [];

    const typeConfig =
      PROPERTY_FIELD_CONFIG[propertyType as keyof typeof PROPERTY_FIELD_CONFIG];

    if (!typeConfig) return [];

    const commonFields = typeConfig.common || [];
    const subTypeFields =
      subType && typeConfig[subType as keyof typeof typeConfig]
        ? (typeConfig[subType as keyof typeof typeConfig] as string[])
        : [];

    return [...commonFields, ...subTypeFields];
  };

  // Format possession date
  const formatPossessionDate = (date?: string | Date | null) => {
    if (!date) return null;
    const parsedDate = typeof date === "string" ? new Date(date) : date;
    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  // Format area with unit
  const formatArea = (area: number | null, unit: string | null) => {
    if (!area) return null;
    return `${area} ${unit || "sqft"}`;
  };

  // Format boolean as Yes/No
  const formatBoolean = (value: boolean | null | undefined) => {
    if (value === null || value === undefined) return null;
    return value ? "Yes" : "No";
  };

  // Format possession status
  const formatPossessionStatus = (status?: string | null) => {
    if (!status) return null;
    return status === "READY_TO_MOVE" ? "Ready to Move" : status;
  };

  // Get formatted value for a field
  const getFieldValue = (fieldName: string): string | number | null => {
    const prop = property as any;

    switch (fieldName) {
      // Area fields with units
      case "carpetArea":
        return formatArea(prop.carpetArea, prop.carpetAreaUnit);
      case "builtUpArea":
        return formatArea(prop.builtUpArea, prop.builtUpAreaUnit);
      case "superBuiltArea":
        return formatArea(prop.superBuiltArea, prop.superBuiltAreaUnit);
      case "plotArea":
        return formatArea(prop.plotArea, prop.plotAreaUnit);
      case "coveredArea":
        return formatArea(prop.coveredArea, "sqft");
      case "openArea":
        return formatArea(prop.openArea, "sqft");

      // Boolean fields
      case "hasBalcony":
      case "boundaryWall":
      case "cornerPlot":
      case "clearTitle":
      case "electricityAvailable":
      case "waterConnection":
      case "sewageConnection":
      case "conferenceRooms":
      case "receptionArea":
      case "preRented":
      case "nocCertified":
      case "occupancyCertified":
      case "priceNegotiable":
      case "stampDutyExcluded":
        return formatBoolean(prop[fieldName]);

      // Date fields
      case "possessionDate":
        return formatPossessionDate(prop.possessionDate);

      // Special formatting
      case "possessionStatus":
        return formatPossessionStatus(prop.possessionStatus);

      // Nested fields
      case "propertyTypeId":
        return property.propertyType?.name || null;
      case "subTypeId":
        return property.subType?.name || null;
      case "cityId":
        return property.city?.name || null;

      // Direct fields
      default:
        return prop[fieldName] ?? null;
    }
  };

  // Get RERA info
  const getReraInfo = () => {
    if (property.reraNumber) {
      return {
        label: "RERA Registered Property",
        number: property.reraNumber,
        type: "property",
      };
    }
    if (property.advertiserReraNumber) {
      return {
        label:
          property.postedBy === "DEVELOPER"
            ? "RERA Registered Developer"
            : "RERA Registered Agent",
        number: property.advertiserReraNumber,
        type: "advertiser",
      };
    }
    return null;
  };

  // Get GST info
  const getGstInfo = () => {
    return property.advertiserGstNumber || null;
  };

  // Build specs array dynamically based on property configuration
  const relevantFields = getRelevantFields();

  // Filter and format specs
  const specs = relevantFields
    .filter((field) => {
      // Skip fields that are shown elsewhere or not relevant for display
      const skipFields = [
        "title",
        "description",
        "images",
        "documents",
        "amenities",
        "nearbyPlaces",
        "youtubeVideoUrl",
        "virtualTourUrl",
        "address",
        "locality",
        "state",
        "country",
        "zipCode",
        "latitude",
        "longitude",
        "cityId",
        "price",
        "currency",
        "status",
      ];
      return !skipFields.includes(field);
    })
    .map((field) => {
      const value = getFieldValue(field);
      const metadata = FIELD_METADATA[field];
      const Icon = FIELD_ICONS[field] || Home;

      return {
        icon: Icon,
        label: metadata?.label || field,
        value: value,
        field: field,
      };
    })
    .filter(
      (spec) =>
        spec.value !== null && spec.value !== undefined && spec.value !== ""
    );

  // Always show these basic specs at the top
  const basicSpecs = [
    {
      icon: Home,
      label: "Type",
      value: property.propertyType?.name,
    },
    {
      icon: Layers,
      label: "Subtype",
      value: property.subType?.name,
    },
    {
      icon: Scan,
      label: "Purpose",
      value: property.purpose,
    },
  ].filter((s) => s.value);

  // Combine all specs
  const allSpecs = [...basicSpecs, ...specs];

  return (
    <div className="w-full rounded-xl bg-white border border-gray-100 p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">
          Property Details
        </h3>

        {/* RERA + GST BADGE */}
        {(() => {
          const rera = getReraInfo();
          const gst = getGstInfo();

          if (!rera && !gst) {
            return (
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500">
                <XCircle className="w-4 h-4 text-gray-400" />
                <span>Not RERA Certified</span>
              </div>
            );
          }

          return (
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 bg-green-50 border border-green-200 py-2 px-3 rounded-md">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-xs sm:text-sm font-semibold text-green-700">
                  {rera?.label || "GST Registered"}
                </span>
              </div>

              <div className="flex flex-col text-xs sm:text-sm text-green-700 sm:ml-3">
                {rera && <span className="font-mono">RERA: {rera.number}</span>}
                {gst && (
                  <span className="font-mono text-gray-700 mt-0.5">
                    GST: {gst}
                  </span>
                )}
              </div>
            </div>
          );
        })()}
      </div>

      {/* SPECS GRID - Responsive 1 or 2 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 divide-y sm:divide-y-0 divide-gray-100">
        {allSpecs.map((item, i) => (
          <div key={i} className={i > 0 ? "sm:border-t-0" : ""}>
            <MiniSpecRow item={item} />
          </div>
        ))}
      </div>

      {/* Show message if no specs */}
      {allSpecs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">No additional details available</p>
        </div>
      )}
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
