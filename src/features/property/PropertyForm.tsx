/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { StepIndicator } from "./StepIndicator";
import { BasicInfoStep } from "./components/BasicInfoStep";
import { LocationStep } from "./components/LocationStep";
import { DetailsStep } from "./components/DetailsStep";
import { AmenitiesStep } from "./components/AmenitiesStep";
import { ImagesStep } from "./components/ImagesStep";
import { DocumentsStep } from "./components/DocumentsStep";
import type { PropertyCreateRequest, PropertyUpdateRequest } from "../../types";
import { useEffect, useState } from "react";
import {
  useGetAmenityCategoriesQuery,
  useSearchAmenitiesQuery,
} from "../../services/AmenityApi";
import {
  useCreatePropertyMutation,
  useGetPropertyQuery,
  useUpdatePropertyMutation,
} from "../../services/propertyApi";
import { useNavigate } from "react-router";
import { useToast } from "../../hooks/useToast";
import {
  useGetCitiesQuery,
  useGetLocalitiesQuery,
} from "../../services/locationApi";
import { usePropertyValidation } from "../../hooks/usePropertyValidation";
import { useLocationSearch } from "../../hooks/useLocationSearch";
import { usePropertyImages } from "../../hooks/usePropertyImage";
import { usePropertyDocuments } from "../../hooks/usePropertyDocument";
import { NearbyPlacesStep } from "./components/NearbyPlacesStep";
import { useAppDispatch } from "../../hooks";
import {
  setPropertyType,
  setSubType,
} from "../../store/slices/propertyFormSlice";

interface PropertyFormPageProps {
  mode: "create" | "edit";
  propertyId?: string;
}

export const PropertyForm: React.FC<PropertyFormPageProps> = ({
  mode,
  propertyId,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Basic Info",
    "Location",
    "Details",
    "Amenities",
    "Nearby Places",
    "Media",
    "Documents",
  ];

  // API Hooks
  const [createProperty, { isLoading: isCreating }] =
    useCreatePropertyMutation();
  const [updateProperty, { isLoading: isUpdating }] =
    useUpdatePropertyMutation();
  const { data: propertyData } = useGetPropertyQuery(propertyId || "", {
    skip: !propertyId,
  });
  const { data: amenitiesData } = useSearchAmenitiesQuery({ isActive: true });
  const { data: categoriesData } = useGetAmenityCategoriesQuery();
  const { success, error: showError } = useToast();

  const amenities = amenitiesData?.data || [];
  const categories = categoriesData?.data || [];

  // Form State - Updated to match PropertyCreateRequest
  const [formData, setFormData] = useState<PropertyCreateRequest>({
    // Basic Information
    title: "",
    description: "",
    propertyTypeId: "",
    subTypeId: null,
    purpose: "SALE",
    status: "UNDER_REVIEW",
    builderName: null,
    hasBalcony: false,
    reraNumber: null,
    pricePerUnit: null,

    // Pricing
    price: 0,
    priceNegotiable: false,
    currency: "USD",
    stampDutyExcluded: false,
    maintenanceCharges: null,
    securityDeposit: null,
    monthlyRent: null,
    leasePeriod: null,

    // Location
    address: "",
    cityId: "",
    locality: "",
    complexName: null,
    state: null,
    country: "",
    zipCode: null,
    latitude: null,
    longitude: null,

    // Area Measurements
    carpetArea: null,
    carpetAreaUnit: null,
    builtUpArea: null,
    builtUpAreaUnit: null,
    superBuiltArea: null,
    superBuiltAreaUnit: null,
    plotArea: null,
    plotAreaUnit: null,
    squareFeet: null,
    squareMeters: null,

    // Residential Details
    bedrooms: null,
    bathrooms: null,
    balconies: null,
    furnishingStatus: null,
    floorNumber: null,
    totalFloors: null,
    floors: null,
    totalFlats: null,
    totalBuildings: null,
    yearBuilt: null,

    // Possession
    possessionStatus: null,
    possessionDate: null,

    // Parking & Lifts
    coveredParking: null,
    openParking: null,
    publicParking: null,
    passengerLifts: null,
    serviceLifts: null,

    // Commercial Office Specific
    projectName: null,
    locatedWithin: null,
    officeType: null,
    officesPerFloor: null,
    officesInProject: null,
    buildingsInProject: null,
    cabins: null,
    seats: null,
    privateWashrooms: null,
    publicWashrooms: null,
    conferenceRooms: false,
    receptionArea: false,
    meetingRooms: null,
    pantryType: null,
    preRented: false,
    nocCertified: false,
    occupancyCertified: false,

    // Land/Plot Specific
    plotDimensions: null,
    boundaryWall: false,
    cornerPlot: false,
    facingDirection: null,
    zoningType: null,
    clearTitle: false,
    developmentStatus: null,
    roadWidth: null,
    electricityAvailable: false,
    waterConnection: false,
    sewageConnection: false,

    // Warehouse/Industrial Specific
    ceilingHeight: null,
    loadingDocks: null,
    powerLoad: null,
    flooringType: null,
    coveredArea: null,
    openArea: null,

    // Features & Media
    youtubeVideoUrl: null,
    virtualTourUrl: null,
    nearbyPlaces: null,

    // Related Data
    amenities: [],
    images: [],
  });

  const { data: citiesData, isLoading: isLoadingCities } = useGetCitiesQuery({
    page: 1,
    limit: 100,
  });

  const { data: localitiesData, isLoading: isLoadingLocalities } =
    useGetLocalitiesQuery(
      { cityId: formData.cityId || "" },
      { skip: !formData.cityId }
    );

  const cities = citiesData?.data || [];
  const localities = localitiesData?.data || [];

  // Custom Hooks
  const { errors, touched, validateStep, handleBlur, setErrors, setTouched } =
    usePropertyValidation();

  const {
    locationSearch,
    locationSuggestions,
    showSuggestions,
    isSearchingLocation,
    setLocationSearch,
    setShowSuggestions,
    handleLocationSelect: handleLocationSelectBase,
  } = useLocationSearch();

  const {
    imageFiles,
    setImageFiles,
    handleImageUpload,
    removeImage,
    setCoverImage,
  } = usePropertyImages();

  const { documents, setDocuments, handleDocumentUpload, removeDocument } =
    usePropertyDocuments(showError);

  // Load existing property data for edit mode
  useEffect(() => {
    if (mode === "edit" && propertyData?.data) {
      const property = propertyData.data;

      // Create a proper update object matching PropertyUpdateRequest
      const updateData: PropertyUpdateRequest = {
        // Basic Information
        title: property.title,
        description: property.description,
        propertyTypeId: property.propertyTypeId,
        subTypeId: property.subTypeId,
        purpose: property.purpose,
        status: property.status,
        builderName: property.builderName,
        hasBalcony: property.hasBalcony,
        reraNumber: property.reraNumber,

        // Pricing
        price: Number(property.price),
        priceNegotiable: property.priceNegotiable,
        currency: property.currency,
        stampDutyExcluded: property.stampDutyExcluded || false,
        maintenanceCharges: property.maintenanceCharges,
        securityDeposit: property.securityDeposit,
        monthlyRent: property.monthlyRent,
        leasePeriod: property.leasePeriod,
        pricePerUnit: property.pricePerUnit,

        // Location
        address: property.address,
        cityId: property.cityId,
        locality: property.locality,
        complexName: property.complexName,
        state: property.state,
        country: property.country,
        zipCode: property.zipCode,
        latitude: property.latitude,
        longitude: property.longitude,

        // Area Measurements
        carpetArea: property.carpetArea,
        carpetAreaUnit: property.carpetAreaUnit,
        builtUpArea: property.builtUpArea,
        builtUpAreaUnit: property.builtUpAreaUnit,
        superBuiltArea: property.superBuiltArea,
        superBuiltAreaUnit: property.superBuiltAreaUnit,
        plotArea: property.plotArea,
        plotAreaUnit: property.plotAreaUnit,
        squareFeet: property.squareFeet,
        squareMeters: property.squareMeters,

        // Residential Details
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        balconies: property.balconies,
        furnishingStatus: property.furnishingStatus,
        floorNumber: property.floorNumber,
        totalFloors: property.totalFloors,
        floors: property.floors,
        totalFlats: property.totalFlats,
        totalBuildings: property.totalBuildings,
        yearBuilt: property.yearBuilt,

        // Possession
        possessionStatus: property.possessionStatus,
        possessionDate: property.possessionDate
          ? new Date(property.possessionDate)
          : null,

        // Parking & Lifts
        coveredParking: property.coveredParking,
        openParking: property.openParking,
        publicParking: property.publicParking,
        passengerLifts: property.passengerLifts,
        serviceLifts: property.serviceLifts,

        // Commercial Office Specific
        projectName: property.projectName,
        locatedWithin: property.locatedWithin,
        officeType: property.officeType,
        officesPerFloor: property.officesPerFloor,
        officesInProject: property.officesInProject,
        buildingsInProject: property.buildingsInProject,
        cabins: property.cabins,
        seats: property.seats,
        privateWashrooms: property.privateWashrooms,
        publicWashrooms: property.publicWashrooms,
        conferenceRooms: property.conferenceRooms,
        receptionArea: property.receptionArea,
        meetingRooms: property.meetingRooms,
        pantryType: property.pantryType,
        preRented: property.preRented,
        nocCertified: property.nocCertified,
        occupancyCertified: property.occupancyCertified,

        // Land/Plot Specific
        plotDimensions: property.plotDimensions,
        boundaryWall: property.boundaryWall,
        cornerPlot: property.cornerPlot,
        facingDirection: property.facingDirection,
        zoningType: property.zoningType,
        clearTitle: property.clearTitle,
        developmentStatus: property.developmentStatus,
        roadWidth: property.roadWidth,
        electricityAvailable: property.electricityAvailable,
        waterConnection: property.waterConnection,
        sewageConnection: property.sewageConnection,

        // Warehouse/Industrial Specific
        ceilingHeight: property.ceilingHeight,
        loadingDocks: property.loadingDocks,
        powerLoad: property.powerLoad,
        flooringType: property.flooringType,
        coveredArea: property.coveredArea,
        openArea: property.openArea,

        // Features & Media
        youtubeVideoUrl: property.youtubeVideoUrl,
        virtualTourUrl: property.virtualTourUrl,
        nearbyPlaces: property.nearbyPlaces,

        // Related Data
        amenities: property.amenities?.map((a) => a.amenityId) || [],
        images: [],
      };

      setFormData((prev) => ({
        ...prev,
        ...updateData,
      }));

      if (property.propertyTypeId) {
        dispatch(
          setPropertyType({
            id: property.propertyType.id,
            name: property.propertyType.name,
          })
        );
      }

      if (property.subTypeId && property.subType) {
        dispatch(
          setSubType({
            id: property.subType.id,
            name: property.subType.name,
          })
        );
      } else {
        dispatch(setSubType(null));
      }

      // Load existing images
      if (property.images) {
        setImageFiles(
          property.images.map((img, idx) => ({
            file: null,
            url: img.url,
            caption: img.caption || null,
            key: img.key || null,
            order: img.order || idx,
            isCover: img.isCover,
            preview: img.viewableUrl || img.url,
          }))
        );
      }

      // Load existing documents
      if (property.documents) {
        setDocuments(
          property.documents.map((doc) => ({
            url: doc.url,
            name: doc.name,
            type: doc.type,
            size: doc.size,
          }))
        );
      }
    }
  }, [mode, propertyData, setImageFiles, setDocuments]);

  const handleLocationSelect = (location: any) => {
    const selectedCity = cities.find(
      (city) =>
        city.name.toLowerCase() ===
        (
          location.address.city ||
          location.address.town ||
          location.address.village
        )?.toLowerCase()
    );

    setFormData({
      ...formData,
      address: location.display_name.split(",")[0] || location.display_name,
      cityId: selectedCity?.id || "",
      locality: selectedCity?.name || "",
      state: selectedCity?.state || location.address.state || null,
      country: selectedCity?.country || location.address.country || "",
      zipCode: location.address.postcode || null,
      latitude: parseFloat(location.lat),
      longitude: parseFloat(location.lon),
    });
    setLocationSearch(location.display_name);
    setShowSuggestions(false);
    setErrors({ ...errors, location: "" });
  };

  const handleFormUpdate = (updates: Partial<PropertyCreateRequest>) => {
    setFormData({ ...formData, ...updates });
  };

  const handleNext = () => {
    console.log("next called", currentStep);

    if (validateStep(currentStep, formData, imageFiles)) {
      console.log("next called 4", currentStep);
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Get all error messages from the errors object
      const errorMessages = Object.values(errors);

      if (errorMessages.length > 0) {
        // Join all error messages with line breaks
        const errorText = errorMessages.join("\n");

        // Show all errors in a toast
        showError("Please fix the following issues:", errorText);
      } else {
        // Fallback if errors object is empty but validation failed
        showError(
          "Validation Failed",
          "Please complete all required fields in this step."
        );
      }
    }
  };
  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    // Validate all steps
    let allValid = true;
    for (let i = 0; i < steps.length; i++) {
      if (!validateStep(i, formData, imageFiles)) {
        allValid = false;
        setCurrentStep(i);
        break;
      }
    }

    if (!allValid) {
      showError("Invalid!", "Please complete all required fields correctly.");
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Prepare property data - updated to match PropertyCreateRequest
      const propertyDataToSend: PropertyCreateRequest = {
        // Basic Information
        title: formData.title,
        description: formData.description,
        propertyTypeId: formData.propertyTypeId,
        subTypeId: formData.subTypeId,
        purpose: formData.purpose,
        status: mode === "create" ? "UNDER_REVIEW" : formData.status!,
        builderName: formData.builderName,
        hasBalcony: formData.hasBalcony,
        reraNumber: formData.reraNumber,
        pricePerUnit: formData.pricePerUnit,

        // Pricing
        price: formData.price,
        priceNegotiable: formData.priceNegotiable,
        currency: formData.currency,
        stampDutyExcluded: formData.stampDutyExcluded,
        maintenanceCharges: formData.maintenanceCharges,
        securityDeposit: formData.securityDeposit,
        monthlyRent: formData.monthlyRent,
        leasePeriod: formData.leasePeriod,

        // Location
        address: formData.address,
        cityId: formData.cityId,
        locality: formData.locality,
        complexName: formData.complexName,
        state: formData.state,
        country: formData.country,
        zipCode: formData.zipCode,
        latitude: formData.latitude,
        longitude: formData.longitude,

        // Area Measurements
        carpetArea: formData.carpetArea,
        carpetAreaUnit: formData.carpetAreaUnit,
        builtUpArea: formData.builtUpArea,
        builtUpAreaUnit: formData.builtUpAreaUnit,
        superBuiltArea: formData.superBuiltArea,
        superBuiltAreaUnit: formData.superBuiltAreaUnit,
        plotArea: formData.plotArea,
        plotAreaUnit: formData.plotAreaUnit,
        squareFeet: formData.squareFeet,
        squareMeters: formData.squareMeters,

        // Residential Details
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        balconies: formData.balconies,
        furnishingStatus: formData.furnishingStatus,
        floorNumber: formData.floorNumber,
        totalFloors: formData.totalFloors,
        floors: formData.floors,
        totalFlats: formData.totalFlats,
        totalBuildings: formData.totalBuildings,
        yearBuilt: formData.yearBuilt,

        // Possession
        possessionStatus: formData.possessionStatus,
        possessionDate: formData.possessionDate,

        // Parking & Lifts
        coveredParking: formData.coveredParking,
        openParking: formData.openParking,
        publicParking: formData.publicParking,
        passengerLifts: formData.passengerLifts,
        serviceLifts: formData.serviceLifts,

        // Commercial Office Specific
        projectName: formData.projectName,
        locatedWithin: formData.locatedWithin,
        officeType: formData.officeType,
        officesPerFloor: formData.officesPerFloor,
        officesInProject: formData.officesInProject,
        buildingsInProject: formData.buildingsInProject,
        cabins: formData.cabins,
        seats: formData.seats,
        privateWashrooms: formData.privateWashrooms,
        publicWashrooms: formData.publicWashrooms,
        conferenceRooms: formData.conferenceRooms,
        receptionArea: formData.receptionArea,
        meetingRooms: formData.meetingRooms,
        pantryType: formData.pantryType,
        preRented: formData.preRented,
        nocCertified: formData.nocCertified,
        occupancyCertified: formData.occupancyCertified,

        // Land/Plot Specific
        plotDimensions: formData.plotDimensions,
        boundaryWall: formData.boundaryWall,
        cornerPlot: formData.cornerPlot,
        facingDirection: formData.facingDirection,
        zoningType: formData.zoningType,
        clearTitle: formData.clearTitle,
        developmentStatus: formData.developmentStatus,
        roadWidth: formData.roadWidth,
        electricityAvailable: formData.electricityAvailable,
        waterConnection: formData.waterConnection,
        sewageConnection: formData.sewageConnection,

        // Warehouse/Industrial Specific
        ceilingHeight: formData.ceilingHeight,
        loadingDocks: formData.loadingDocks,
        powerLoad: formData.powerLoad,
        flooringType: formData.flooringType,
        coveredArea: formData.coveredArea,
        openArea: formData.openArea,

        // Features & Media
        youtubeVideoUrl: formData.youtubeVideoUrl,
        virtualTourUrl: formData.virtualTourUrl,
        nearbyPlaces: formData.nearbyPlaces,

        // Related Data
        amenities: formData.amenities,
        images: imageFiles
          .filter((img) => !img.file)
          .map((img) => ({
            url: img.url!,
            caption: img.caption || null,
            key: img.key || null,
            order: img.order,
            isCover: img.isCover,
          })),
      };

      // For update, we need to send a PropertyUpdateRequest
      if (mode === "edit") {
        // Remove non-updatable fields or keep only changed fields
        const updateData: PropertyUpdateRequest = {
          ...propertyDataToSend,
          // Ensure status is not changed on update unless explicitly intended
          status: formData.status,
        };
        formDataToSend.append("data", JSON.stringify(updateData));
      } else {
        formDataToSend.append("data", JSON.stringify(propertyDataToSend));
      }

      // Add image files
      imageFiles.forEach((img) => {
        if (img.file) {
          formDataToSend.append("images", img.file);
        }
      });

      // Add document files
      documents.forEach((doc) => {
        if (doc.file) {
          formDataToSend.append("documents", doc.file);
        }
      });

      if (mode === "create") {
        const result = await createProperty(formDataToSend).unwrap();
        success("Property created successfully!", "It's now under review.");
        navigate(`/properties/${result.data.slug}`);
      } else if (propertyId) {
        const result = await updateProperty({
          id: propertyId,
          data: formDataToSend,
        }).unwrap();
        success("Property updated successfully!", "check property details.");
        navigate(`/properties/${result.data.slug}`);
      }
    } catch (error: any) {
      console.error("Failed to save property:", error);
      showError(
        error?.data?.message || "Failed to save property",
        "Please try again."
      );
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoStep
            formData={formData}
            errors={errors}
            touched={touched}
            mode={mode}
            onUpdate={handleFormUpdate}
            onBlur={handleBlur}
          />
        );
      case 1:
        return (
          <LocationStep
            formData={formData}
            errors={errors}
            touched={touched}
            cities={cities}
            localities={localities}
            isLoadingCities={isLoadingCities}
            isLoadingLocalities={isLoadingLocalities}
            onUpdate={handleFormUpdate}
            onBlur={handleBlur}
          />
        );
      case 2:
        return (
          <DetailsStep
            formData={formData}
            errors={errors}
            onUpdate={handleFormUpdate}
            onBlur={handleBlur}
          />
        );
      case 3:
        return (
          <AmenitiesStep
            formData={formData}
            amenities={amenities}
            categories={categories}
            errors={errors}
            onUpdate={handleFormUpdate}
          />
        );
      case 4:
        return (
          <NearbyPlacesStep
            formData={formData}
            errors={errors}
            onUpdate={handleFormUpdate}
          />
        );
      case 5:
        return (
          <ImagesStep
            imageFiles={imageFiles}
            errors={errors}
            onImageUpload={handleImageUpload}
            onRemoveImage={removeImage}
            onSetCoverImage={setCoverImage}
          />
        );
      case 6:
        return (
          <DocumentsStep
            documents={documents}
            onDocumentUpload={handleDocumentUpload}
            onRemoveDocument={removeDocument}
          />
        );
      default:
        return null;
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {mode === "create" ? "Add New Property" : "Edit Property"}
              </h1>
              <p className="text-gray-600 mt-1">
                {mode === "create"
                  ? "Fill in the details to list your property"
                  : "Update your property information"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <StepIndicator steps={steps} currentStep={currentStep} />

          <form onSubmit={(e) => e.preventDefault()}>
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  currentStep === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>

              <div className="text-sm text-gray-600 font-medium">
                Step {currentStep + 1} of {steps.length}
              </div>

              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {mode === "create"
                        ? "Submit Property"
                        : "Update Property"}
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Additional Info */}
        {mode === "create" && (
          <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-3">
              What happens after submission?
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">
                  1
                </div>
                <div>
                  Your property will be set to <strong>UNDER_REVIEW</strong>{" "}
                  status
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">
                  2
                </div>
                <div>Our team will review your listing within 24-48 hours</div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">
                  3
                </div>
                <div>
                  Once approved, it will be visible to potential buyers/renters
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">
                  4
                </div>
                <div>
                  You'll receive notifications about inquiries and views
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
