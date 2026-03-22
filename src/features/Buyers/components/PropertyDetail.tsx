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

const FIELD_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  title: Home,
  propertyType: Home,
  subType: Layers,
  purpose: Scan,
  bedrooms: Home,
  bathrooms: Building2,
  balconies: Building2,
  furnishingStatus: Sofa,
  carpetArea: Maximize,
  builtUpArea: Square,
  superBuiltArea: Square,
  plotArea: Square,
  plotDimensions: Ruler,
  coveredArea: Square,
  openArea: Square,
  squareFeet: Square,
  squareMeters: Square,
  floorNumber: ClipboardList,
  totalFloors: Rows,
  floors: Rows,
  totalFlats: LayoutGrid,
  totalBuildings: Building2,
  complexName: Building2,
  yearBuilt: Hammer,
  coveredParking: Car,
  openParking: Car,
  publicParking: Car,
  passengerLifts: MoveVertical,
  serviceLifts: MoveVertical,
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
  ceilingHeight: Factory,
  loadingDocks: Package,
  powerLoad: Zap,
  flooringType: Warehouse,
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

// Fields that should NEVER appear — they are shown elsewhere or are internal units
const SKIP_FIELDS = new Set([
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
  // Unit-only fields (displayed inline with their area field)
  "carpetAreaUnit",
  "builtUpAreaUnit",
  "superBuiltAreaUnit",
  "plotAreaUnit",
  "squareFeetUnit",
  "squareMetersUnit",
]);

export const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  property,
}) => {
  const getRelevantFields = (): string[] => {
    const propertyType = property.propertyType?.name;
    const subType = property.subType?.name;
    if (!propertyType) return [];
    const typeConfig =
      PROPERTY_FIELD_CONFIG[propertyType as keyof typeof PROPERTY_FIELD_CONFIG];
    if (!typeConfig) return [];
    const common = typeConfig.common || [];
    const subFields =
      subType && typeConfig[subType as keyof typeof typeConfig]
        ? (typeConfig[subType as keyof typeof typeConfig] as string[])
        : [];
    // De-duplicate — purpose appears in both common and subtype sometimes
    return [...new Set([...common, ...subFields])];
  };

  const formatArea = (area: number | null, unit: string | null) =>
    !area ? null : `${area} ${unit || "sqft"}`;
  const formatBool = (v: boolean | null | undefined) =>
    v == null ? null : v ? "Yes" : "No";
  const formatStatus = (s?: string | null) =>
    !s ? null : s === "READY_TO_MOVE" ? "Ready to Move" : s;
  const formatDate = (d?: string | Date | null) => {
    if (!d) return null;
    return (typeof d === "string" ? new Date(d) : d).toLocaleDateString(
      "en-US",
      { month: "short", year: "numeric" },
    );
  };

  const getFieldValue = (field: string): string | number | null => {
    const p = property as any;
    switch (field) {
      case "carpetArea":
        return formatArea(p.carpetArea, p.carpetAreaUnit);
      case "builtUpArea":
        return formatArea(p.builtUpArea, p.builtUpAreaUnit);
      case "superBuiltArea":
        return formatArea(p.superBuiltArea, p.superBuiltAreaUnit);
      case "plotArea":
        return formatArea(p.plotArea, p.plotAreaUnit);
      case "coveredArea":
        return formatArea(p.coveredArea, "sqft");
      case "openArea":
        return formatArea(p.openArea, "sqft");
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
        return formatBool(p[field]);
      case "possessionDate":
        return formatDate(p.possessionDate);
      case "possessionStatus":
        return formatStatus(p.possessionStatus);
      case "propertyTypeId":
        return property.propertyType?.name || null;
      case "subTypeId":
        return property.subType?.name || null;
      case "cityId":
        return property.city?.name || null;
      default:
        return p[field] ?? null;
    }
  };

  const getReraInfo = () => {
    if (property.reraNumber)
      return { label: "RERA Registered Property", number: property.reraNumber };
    if (property.advertiserReraNumber)
      return {
        label:
          property.postedBy === "DEVELOPER"
            ? "RERA Registered Developer"
            : "RERA Registered Agent",
        number: property.advertiserReraNumber,
      };
    return null;
  };

  const rera = getReraInfo();
  const gst = property.advertiserGstNumber || null;

  // Basic identity specs — shown at top, always
  const basicSpecs = [
    { icon: Home, label: "Type", value: property.propertyType?.name },
    { icon: Layers, label: "Subtype", value: property.subType?.name },
    { icon: Scan, label: "Purpose", value: property.purpose },
  ].filter((s) => s.value);

  // Dynamic specs from config — skip duplicates + unit-only fields
  const seenLabels = new Set(basicSpecs.map((s) => s.label.toLowerCase()));
  const dynamicSpecs = getRelevantFields()
    .filter((f) => !SKIP_FIELDS.has(f))
    .map((f) => ({
      icon: FIELD_ICONS[f] || Home,
      label: FIELD_METADATA[f]?.label || f,
      value: getFieldValue(f),
    }))
    .filter((s) => {
      if (s.value === null || s.value === undefined || s.value === "")
        return false;
      // Skip if same label already shown in basicSpecs
      const key = s.label.toLowerCase();
      if (seenLabels.has(key)) return false;
      seenLabels.add(key);
      return true;
    });

  const allSpecs = [...basicSpecs, ...dynamicSpecs];

  return (
    <div className="bg-white border border-blue-100 rounded-xl p-4 sm:p-5">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h3 className="text-sm sm:text-base font-bold text-gray-900">
          Property Details
        </h3>

        {rera || gst ? (
          <div className="inline-flex items-start gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 self-start">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-bold text-emerald-700">
                {rera?.label || "GST Registered"}
              </p>
              {rera && (
                <p className="text-[10px] font-mono text-emerald-600 mt-0.5">
                  RERA: {rera.number}
                </p>
              )}
              {gst && (
                <p className="text-[10px] font-mono text-gray-500 mt-0.5">
                  GST: {gst}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 text-[11px] text-gray-400 self-start">
            <XCircle className="w-3.5 h-3.5 flex-shrink-0" /> Not RERA Certified
          </div>
        )}
      </div>

      {/* ── Specs — 2-column grid, label stacked above value ──────────────── */}
      {allSpecs.length === 0 ? (
        <p className="text-center py-6 text-xs text-gray-400">
          No additional details available
        </p>
      ) : (
        <div className="grid grid-cols-2">
          {allSpecs.map((item, i) => {
            const Icon = item.icon;
            const isRight = i % 2 !== 0;
            return (
              <div
                key={i}
                className={`flex items-start gap-2 py-2 sm:py-2.5 border-b border-blue-50
                  ${isRight ? "pl-3 border-l border-blue-50" : "pr-3"}`}
              >
                {/* Icon */}
                <div className="w-6 h-6 sm:w-7 sm:h-7 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500" />
                </div>
                {/* Label + value stacked */}
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-wide text-gray-400 font-medium truncate leading-none mb-0.5">
                    {item.label}
                  </p>
                  <p className="text-[11px] sm:text-xs font-bold text-gray-800 truncate leading-snug">
                    {item.value}
                  </p>
                </div>
              </div>
            );
          })}
          {/* Ghost cell if odd count — keeps last row's bottom border aligned */}
          {allSpecs.length % 2 !== 0 && (
            <div className="py-2 sm:py-2.5 pl-3 border-b border-l border-blue-50" />
          )}
        </div>
      )}
    </div>
  );
};
