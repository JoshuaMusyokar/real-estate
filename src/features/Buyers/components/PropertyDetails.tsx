import type { Property } from "../../../types";

interface PropertyDetailsProps {
  property: Property;
}

export const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  property,
}) => (
  <div className="bg-white border border-gray-200 rounded-xl p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-4">Property Details</h2>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <div className="text-xs text-gray-600 mb-1">Property Type</div>
        <div className="font-semibold text-gray-900 text-sm">
          {property.propertyType.name}
        </div>
      </div>
      {property.subType && (
        <div>
          <div className="text-xs text-gray-600 mb-1">Sub Type</div>
          <div className="font-semibold text-gray-900 text-sm">
            {property.subType.name}
          </div>
        </div>
      )}
      <div>
        <div className="text-xs text-gray-600 mb-1">Purpose</div>
        <div className="font-semibold text-gray-900 text-sm">
          {property.purpose}
        </div>
      </div>
      {property.furnishingStatus && (
        <div>
          <div className="text-xs text-gray-600 mb-1">Furnishing</div>
          <div className="font-semibold text-gray-900 text-sm">
            {property.furnishingStatus}
          </div>
        </div>
      )}
      {property.yearBuilt && (
        <div>
          <div className="text-xs text-gray-600 mb-1">Year Built</div>
          <div className="font-semibold text-gray-900 text-sm">
            {property.yearBuilt}
          </div>
        </div>
      )}
      {property.floors && (
        <div>
          <div className="text-xs text-gray-600 mb-1">Floors</div>
          <div className="font-semibold text-gray-900 text-sm">
            {property.floors}
          </div>
        </div>
      )}
    </div>
  </div>
);
