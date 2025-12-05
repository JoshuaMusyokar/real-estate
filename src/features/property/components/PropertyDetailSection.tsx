import type { Property } from "../../../types";
import { DetailItem } from "./DetailItem";

export const PropertyDetailsSection: React.FC<{ property: Property }> = ({
  property,
}) => (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 lg:p-8">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      Property Details
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <DetailItem label="Property Type" value={property.propertyType.name} />
      <DetailItem label="Sub Type" value={property.subType?.name || "N/A"} />
      <DetailItem label="Purpose" value={property.purpose} />
      <DetailItem label="Currency" value={property.currency} />
      {property.squareMeters && (
        <DetailItem
          label="Square Meters"
          value={property.squareMeters.toString()}
        />
      )}
      {property.zipCode && (
        <DetailItem label="Zip Code" value={property.zipCode} />
      )}
      {property.bedrooms && (
        <DetailItem label="Bedrooms" value={property.bedrooms.toString()} />
      )}
      {property.bathrooms && (
        <DetailItem label="Bathrooms" value={property.bathrooms.toString()} />
      )}
      {property.yearBuilt && (
        <DetailItem label="Year Built" value={property.yearBuilt.toString()} />
      )}
    </div>
  </div>
);
