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
} from "lucide-react";

interface PropertyDetailsProps {
  propertyType: string;
  subType?: string | null;
  purpose: string;
  furnishingStatus?: string | null;
  yearBuilt?: number | null;
  floors?: number | null;
  builderName?: string | null;
  hasBalcony?: boolean;
  reraNumber?: string | null;
}

export const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  propertyType,
  subType,
  purpose,
  furnishingStatus,
  yearBuilt,
  floors,
  builderName,
  hasBalcony,
  reraNumber,
}) => {
  const specs = [
    { icon: Home, label: "Type", value: propertyType },
    { icon: Layers, label: "Subtype", value: subType },
    { icon: Scan, label: "Purpose", value: purpose },
    { icon: Sofa, label: "Furnishing", value: furnishingStatus },
    {
      icon: Building2,
      label: "Balcony",
      value: hasBalcony ? "Yes" : "No",
    },
    { icon: Hammer, label: "Built", value: yearBuilt },
    { icon: ClipboardList, label: "Floors", value: floors },
    { icon: Building2, label: "Builder", value: builderName },
  ].filter((s) => s.value);

  const legalCertified = !!reraNumber;

  return (
    <div className="w-full rounded-xl bg-white border border-gray-100 p-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-gray-800">Specs</h3>

        <div className="flex items-center gap-1 text-xs">
          {legalCertified ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
          ) : (
            <XCircle className="w-3.5 h-3.5 text-gray-400" />
          )}
          <span
            className={`font-medium ${
              legalCertified ? "text-green-700" : "text-gray-500"
            }`}
          >
            {legalCertified ? `RERA: ${reraNumber}` : "Not Certified"}
          </span>
        </div>
      </div>

      {/* MICRO ROWS */}
      <div className="flex flex-col divide-y divide-gray-100">
        {specs.map((item, i) => (
          <MiniSpecRow key={i} item={item} />
        ))}
      </div>
    </div>
  );
};

/*** SUPER COMPACT SPEC ROW ***/
const MiniSpecRow: React.FC<{ item: any }> = ({ item }) => {
  const Icon = item.icon;

  return (
    <div className="flex items-center py-1.5 gap-3">
      <Icon className="w-4 h-4 text-gray-600" />

      <span className="text-[11px] uppercase tracking-wide text-gray-500 w-20">
        {item.label}
      </span>

      <span className="text-sm font-semibold text-gray-800 truncate">
        {item.value}
      </span>
    </div>
  );
};
