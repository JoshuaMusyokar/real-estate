import { useMemo } from "react";
import { getRequiredFields, FIELD_METADATA } from "../config";

interface UseFieldVisibilityProps {
  propertyTypeName: string;
  subTypeName: string;
  step: number; // 0: Basic, 1: Location, 2: Details, 3: Amenities, 4: Media, 5: Documents
}

// Map fields to steps
const FIELD_STEP_MAPPING: Record<string, number> = {
  // Step 0: Basic Info
  title: 0,
  description: 0,
  propertyTypeId: 0,
  subTypeId: 0,
  purpose: 0,
  status: 0,
  builderName: 0,
  hasBalcony: 0,
  reraNumber: 0,
  price: 0,
  priceNegotiable: 0,
  currency: 0,
  stampDutyExcluded: 0,

  // Step 1: Location
  address: 1,
  cityId: 1,
  locality: 1,
  complexName: 1,
  state: 1,
  country: 1,
  zipCode: 1,
  latitude: 1,
  longitude: 1,

  // Step 2: Details
  bedrooms: 2,
  bathrooms: 2,
  balconies: 2,
  furnishingStatus: 2,
  floorNumber: 2,
  totalFloors: 2,
  floors: 2,
  totalFlats: 2,
  totalBuildings: 2,
  yearBuilt: 2,
  carpetArea: 2,
  carpetAreaUnit: 2,
  builtUpArea: 2,
  builtUpAreaUnit: 2,
  superBuiltArea: 2,
  superBuiltAreaUnit: 2,
  plotArea: 2,
  plotAreaUnit: 2,
  squareFeet: 2,
  squareMeters: 2,
  possessionStatus: 2,
  possessionDate: 2,
  coveredParking: 2,
  openParking: 2,
  publicParking: 2,
  passengerLifts: 2,
  serviceLifts: 2,
  maintenanceCharges: 2,
  securityDeposit: 2,
  monthlyRent: 2,
  leasePeriod: 2,
  projectName: 2,
  locatedWithin: 2,
  officeType: 2,
  officesPerFloor: 2,
  officesInProject: 2,
  buildingsInProject: 2,
  cabins: 2,
  seats: 2,
  privateWashrooms: 2,
  publicWashrooms: 2,
  conferenceRooms: 2,
  receptionArea: 2,
  meetingRooms: 2,
  pantryType: 2,
  preRented: 2,
  nocCertified: 2,
  occupancyCertified: 2,
  plotDimensions: 2,
  boundaryWall: 2,
  cornerPlot: 2,
  facingDirection: 2,
  zoningType: 2,
  clearTitle: 2,
  developmentStatus: 2,
  roadWidth: 2,
  electricityAvailable: 2,
  waterConnection: 2,
  sewageConnection: 2,
  ceilingHeight: 2,
  loadingDocks: 2,
  powerLoad: 2,
  flooringType: 2,
  coveredArea: 2,
  openArea: 2,
  youtubeVideoUrl: 2,
  virtualTourUrl: 2,

  // Step 3: Amenities
  amenities: 3,
  nearbyPlaces: 3,

  // Step 4: Media
  images: 4,

  // Step 5: Documents
  documents: 5,
};

export const useFieldVisibility = ({
  propertyTypeName,
  subTypeName,
  step,
}: UseFieldVisibilityProps) => {
  const visibleFields = useMemo(() => {
    if (!propertyTypeName) return [];

    const allFields = getRequiredFields(propertyTypeName, subTypeName);

    // Filter fields for current step
    return allFields.filter((field) => FIELD_STEP_MAPPING[field] === step);
  }, [propertyTypeName, subTypeName, step]);

  const getFieldConfig = (fieldName: string) => {
    return FIELD_METADATA[fieldName as keyof typeof FIELD_METADATA];
  };

  const isFieldVisible = (fieldName: string) => {
    return visibleFields.includes(fieldName);
  };

  return {
    visibleFields,
    getFieldConfig,
    isFieldVisible,
  };
};
