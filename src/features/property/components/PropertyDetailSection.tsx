import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import type { Property } from "../../../types";
import { DetailItem } from "./DetailItem";

export const PropertyDetailsSection: React.FC<{ property: Property }> = ({
  property,
}) => {
  // Determine property type for conditional rendering
  const isResidential = property.propertyType?.name === "RESIDENTIAL";
  const isCommercial = property.propertyType?.name === "COMMERCIAL";
  const isIndustrial = property.propertyType?.name === "INDUSTRIAL";
  const isLand = property.propertyType?.name === "LAND";
  const isOffice = property.subType?.name === "OFFICE";
  const isRetail = property.subType?.name === "RETAIL";

  // Helper to format area with unit
  const formatArea = (area: number | null, unit: string | null) => {
    if (!area) return null;
    return `${area.toLocaleString()} ${unit || "sq ft"}`;
  };

  return (
    <Card>
      <CardHeader className="p-4 sm:p-5 md:p-6">
        <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold">
          Property Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 md:p-6 pt-0">
        {/* Basic Information */}
        <div className="mb-6">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            <DetailItem
              label="Property Type"
              value={property.propertyType.name}
            />
            <DetailItem
              label="Sub Type"
              value={property.subType?.name || "N/A"}
            />
            <DetailItem label="Purpose" value={property.purpose} />
            <DetailItem
              label="Status"
              value={property.status.replace("_", " ")}
            />
            {property.postedBy && (
              <DetailItem label="Posted By" value={property.postedBy} />
            )}
            {property.ownershipType && (
              <DetailItem
                label="Ownership Type"
                value={property.ownershipType}
              />
            )}
          </div>
        </div>

        {/* Pricing Information */}
        <div className="mb-6">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            Pricing
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            <DetailItem label="Currency" value={property.currency} />
            <DetailItem
              label="Price Negotiable"
              value={property.priceNegotiable ? "Yes" : "No"}
            />
            {property.pricePerUnit && (
              <DetailItem
                label="Price Per Unit"
                value={`${property.currency} ${property.pricePerUnit.toLocaleString()}`}
              />
            )}
            {property.maintenanceCharges && (
              <DetailItem
                label="Maintenance Charges"
                value={`${property.currency} ${property.maintenanceCharges.toLocaleString()}`}
              />
            )}
            {property.securityDeposit && (
              <DetailItem
                label="Security Deposit"
                value={`${property.currency} ${property.securityDeposit.toLocaleString()}`}
              />
            )}
            {property.monthlyRent && (
              <DetailItem
                label="Monthly Rent"
                value={`${property.currency} ${property.monthlyRent.toLocaleString()}`}
              />
            )}
            {property.leasePeriod && (
              <DetailItem label="Lease Period" value={property.leasePeriod} />
            )}
            {property.rentEscalation && (
              <DetailItem
                label="Rent Escalation"
                value={`${property.rentEscalation}%`}
              />
            )}
          </div>
        </div>

        {/* Area Measurements */}
        <div className="mb-6">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            Area Measurements
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {property.carpetArea && (
              <DetailItem
                label="Carpet Area"
                value={
                  formatArea(property.carpetArea, property.carpetAreaUnit) ||
                  "N/A"
                }
              />
            )}
            {property.builtUpArea && (
              <DetailItem
                label="Built-Up Area"
                value={
                  formatArea(property.builtUpArea, property.builtUpAreaUnit) ||
                  "N/A"
                }
              />
            )}
            {property.superBuiltArea && (
              <DetailItem
                label="Super Built-Up Area"
                value={
                  formatArea(
                    property.superBuiltArea,
                    property.superBuiltAreaUnit,
                  ) || "N/A"
                }
              />
            )}
            {property.plotArea && (
              <DetailItem
                label="Plot Area"
                value={
                  formatArea(property.plotArea, property.plotAreaUnit) || "N/A"
                }
              />
            )}
            {property.squareFeet && (
              <DetailItem
                label="Square Feet"
                value={property.squareFeet.toLocaleString()}
              />
            )}
            {property.squareMeters && (
              <DetailItem
                label="Square Meters"
                value={property.squareMeters.toLocaleString()}
              />
            )}
            {isIndustrial && property.coveredArea && (
              <DetailItem
                label="Covered Area"
                value={`${property.coveredArea.toLocaleString()} sq ft`}
              />
            )}
            {isIndustrial && property.openArea && (
              <DetailItem
                label="Open Area"
                value={`${property.openArea.toLocaleString()} sq ft`}
              />
            )}
          </div>
        </div>

        {/* Residential Details */}
        {isResidential && (
          <div className="mb-6">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              Residential Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {property.bedrooms && (
                <DetailItem
                  label="Bedrooms"
                  value={property.bedrooms.toString()}
                />
              )}
              {property.bathrooms && (
                <DetailItem
                  label="Bathrooms"
                  value={property.bathrooms.toString()}
                />
              )}
              {property.balconies && (
                <DetailItem
                  label="Balconies"
                  value={property.balconies.toString()}
                />
              )}
              {property.furnishingStatus && (
                <DetailItem
                  label="Furnishing"
                  value={property.furnishingStatus}
                />
              )}
              {property.floorNumber !== null && (
                <DetailItem
                  label="Floor Number"
                  value={property.floorNumber.toString()}
                />
              )}
              {property.totalFloors && (
                <DetailItem
                  label="Total Floors"
                  value={property.totalFloors.toString()}
                />
              )}
              {property.floors && (
                <DetailItem
                  label="Floors in Property"
                  value={property.floors.toString()}
                />
              )}
              {property.totalFlats && (
                <DetailItem
                  label="Total Flats"
                  value={property.totalFlats.toString()}
                />
              )}
              {property.totalBuildings && (
                <DetailItem
                  label="Total Buildings"
                  value={property.totalBuildings.toString()}
                />
              )}
            </div>
          </div>
        )}

        {/* Commercial Office Details */}
        {isCommercial && isOffice && (
          <div className="mb-6">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              Office Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {property.officeType && (
                <DetailItem label="Office Type" value={property.officeType} />
              )}
              {property.cabins && (
                <DetailItem label="Cabins" value={property.cabins.toString()} />
              )}
              {property.seats && (
                <DetailItem label="Seats" value={property.seats.toString()} />
              )}
              {property.meetingRooms && (
                <DetailItem
                  label="Meeting Rooms"
                  value={property.meetingRooms.toString()}
                />
              )}
              {property.privateWashrooms && (
                <DetailItem
                  label="Private Washrooms"
                  value={property.privateWashrooms.toString()}
                />
              )}
              {property.publicWashrooms && (
                <DetailItem
                  label="Public Washrooms"
                  value={property.publicWashrooms.toString()}
                />
              )}
              <DetailItem
                label="Conference Rooms"
                value={property.conferenceRooms ? "Yes" : "No"}
              />
              <DetailItem
                label="Reception Area"
                value={property.receptionArea ? "Yes" : "No"}
              />
              {property.pantryType && (
                <DetailItem label="Pantry Type" value={property.pantryType} />
              )}
              <DetailItem
                label="Pre-Rented"
                value={property.preRented ? "Yes" : "No"}
              />
              <DetailItem
                label="NOC Certified"
                value={property.nocCertified ? "Yes" : "No"}
              />
              <DetailItem
                label="Occupancy Certified"
                value={property.occupancyCertified ? "Yes" : "No"}
              />
            </div>
          </div>
        )}

        {/* Commercial Retail Details */}
        {isCommercial && isRetail && (
          <div className="mb-6">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              Retail Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              <DetailItem
                label="Corner Location"
                value={property.cornerLocation ? "Yes" : "No"}
              />
              {property.frontageWidth && (
                <DetailItem
                  label="Frontage Width"
                  value={`${property.frontageWidth} ft`}
                />
              )}
              <DetailItem
                label="Main Road Facing"
                value={property.mainRoadFacing ? "Yes" : "No"}
              />
              <DetailItem
                label="Display Windows"
                value={property.displayWindows ? "Yes" : "No"}
              />
              {property.idealFor && property.idealFor.length > 0 && (
                <DetailItem
                  label="Ideal For"
                  value={property.idealFor.join(", ")}
                />
              )}
              <DetailItem
                label="Fire Safety Approved"
                value={property.fireSafetyApproved ? "Yes" : "No"}
              />
            </div>
          </div>
        )}

        {/* Industrial/Warehouse Details */}
        {isIndustrial && (
          <div className="mb-6">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              Industrial Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {property.ceilingHeight && (
                <DetailItem
                  label="Ceiling Height"
                  value={property.ceilingHeight}
                />
              )}
              {property.loadingDocks && (
                <DetailItem
                  label="Loading Docks"
                  value={property.loadingDocks.toString()}
                />
              )}
              {property.dockHeight && (
                <DetailItem
                  label="Dock Height"
                  value={`${property.dockHeight} ft`}
                />
              )}
              {property.powerLoad && (
                <DetailItem label="Power Load" value={property.powerLoad} />
              )}
              {property.flooringType && (
                <DetailItem
                  label="Flooring Type"
                  value={property.flooringType}
                />
              )}
              {property.openSides && (
                <DetailItem
                  label="Open Sides"
                  value={property.openSides.toString()}
                />
              )}
              {property.storageType && (
                <DetailItem label="Storage Type" value={property.storageType} />
              )}
              {property.industryType && (
                <DetailItem
                  label="Industry Type"
                  value={property.industryType}
                />
              )}
            </div>
          </div>
        )}

        {/* Land/Plot Details */}
        {isLand && (
          <div className="mb-6">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              Land Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {property.plotDimensions && (
                <DetailItem
                  label="Plot Dimensions"
                  value={property.plotDimensions}
                />
              )}
              <DetailItem
                label="Boundary Wall"
                value={property.boundaryWall ? "Yes" : "No"}
              />
              <DetailItem
                label="Corner Plot"
                value={property.cornerPlot ? "Yes" : "No"}
              />
              {property.facingDirection && (
                <DetailItem
                  label="Facing Direction"
                  value={property.facingDirection}
                />
              )}
              {property.zoningType && (
                <DetailItem label="Zoning Type" value={property.zoningType} />
              )}
              <DetailItem
                label="Clear Title"
                value={property.clearTitle ? "Yes" : "No"}
              />
              {property.developmentStatus && (
                <DetailItem
                  label="Development Status"
                  value={property.developmentStatus}
                />
              )}
              {property.roadWidth && (
                <DetailItem label="Road Width" value={property.roadWidth} />
              )}
              <DetailItem
                label="Electricity Available"
                value={property.electricityAvailable ? "Yes" : "No"}
              />
              <DetailItem
                label="Water Connection"
                value={property.waterConnection ? "Yes" : "No"}
              />
              <DetailItem
                label="Sewage Connection"
                value={property.sewageConnection ? "Yes" : "No"}
              />
            </div>
          </div>
        )}

        {/* Parking & Facilities */}
        <div className="mb-6">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            Parking & Facilities
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {property.coveredParking !== null &&
              property.coveredParking > 0 && (
                <DetailItem
                  label="Covered Parking"
                  value={property.coveredParking.toString()}
                />
              )}
            {property.openParking !== null && property.openParking > 0 && (
              <DetailItem
                label="Open Parking"
                value={property.openParking.toString()}
              />
            )}
            {property.publicParking !== null && property.publicParking > 0 && (
              <DetailItem
                label="Public Parking"
                value={property.publicParking.toString()}
              />
            )}
            {property.passengerLifts !== null &&
              property.passengerLifts > 0 && (
                <DetailItem
                  label="Passenger Lifts"
                  value={property.passengerLifts.toString()}
                />
              )}
            {property.serviceLifts !== null && property.serviceLifts > 0 && (
              <DetailItem
                label="Service Lifts"
                value={property.serviceLifts.toString()}
              />
            )}
          </div>
        </div>

        {/* Building Information */}
        <div className="mb-6">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            Building Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {property.yearBuilt && (
              <DetailItem
                label="Year Built"
                value={property.yearBuilt.toString()}
              />
            )}
            {property.builderName && (
              <DetailItem label="Builder Name" value={property.builderName} />
            )}
            {property.projectName && (
              <DetailItem label="Project Name" value={property.projectName} />
            )}
            {property.complexName && (
              <DetailItem label="Complex Name" value={property.complexName} />
            )}
            {property.reraNumber && (
              <DetailItem label="RERA Number" value={property.reraNumber} />
            )}
            {property.possessionStatus && (
              <DetailItem
                label="Possession Status"
                value={property.possessionStatus}
              />
            )}
            {property.possessionDate && (
              <DetailItem
                label="Possession Date"
                value={new Date(property.possessionDate).toLocaleDateString()}
              />
            )}
          </div>
        </div>

        {/* Legal & Compliance */}
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            Legal & Compliance
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            <DetailItem
              label="Legal Dispute"
              value={property.legalDispute ? "Yes" : "No"}
            />
            <DetailItem
              label="Encumbrance Free"
              value={property.encumbranceFree ? "Yes" : "No"}
            />
            {property.approvedBy && (
              <DetailItem label="Approved By" value={property.approvedBy} />
            )}
            {property.zipCode && (
              <DetailItem label="Zip Code" value={property.zipCode} />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
