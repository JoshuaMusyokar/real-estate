import {
  ArrowLeft,
  ArrowRight,
  Save,
  CheckCircle,
  Clock,
  Eye,
  Bell,
} from "lucide-react";
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
import { Card, CardContent } from "../../components/ui/Card";
import Button from "../../components/ui/button/Button";

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

  // Form State
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
    ownershipType: null,
    approvedBy: null,
    legalDispute: false,
    encumbranceFree: true,
    preferredTenants: null,
    rentEscalation: null,
    brochureAvailable: false,
    floorPlanAvailable: false,
    cornerLocation: false,
    locatedIn: null,
    frontageWidth: null,
    mainRoadFacing: false,
    displayWindows: false,
    idealFor: null,
    fireSafetyApproved: false,
    dockHeight: null,
    openSides: null,
    storageType: null,
    industryType: null,

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
      { skip: !formData.cityId },
    );

  const cities = citiesData?.data || [];
  const localities = localitiesData?.data || [];

  // Custom Hooks
  const { errors, touched, validateStep, handleBlur, setErrors } =
    usePropertyValidation();

  const { setLocationSearch, setShowSuggestions } = useLocationSearch();

  const {
    imageFiles,
    setImageFiles,
    handleImageUpload,
    removeImage,
    setCoverImage,
    updateCaption,
  } = usePropertyImages();

  const { documents, setDocuments, handleDocumentUpload, removeDocument } =
    usePropertyDocuments(showError);

  // Load existing property data for edit mode
  useEffect(() => {
    if (mode === "edit" && propertyData?.data) {
      const property = propertyData.data;

      const updateData: PropertyUpdateRequest = {
        title: property.title,
        description: property.description,
        propertyTypeId: property.propertyTypeId,
        subTypeId: property.subTypeId,
        purpose: property.purpose,
        status: property.status,
        builderName: property.builderName,
        hasBalcony: property.hasBalcony,
        reraNumber: property.reraNumber,
        price: Number(property.price),
        priceNegotiable: property.priceNegotiable,
        currency: property.currency,
        stampDutyExcluded: property.stampDutyExcluded || false,
        maintenanceCharges: property.maintenanceCharges,
        securityDeposit: property.securityDeposit,
        monthlyRent: property.monthlyRent,
        leasePeriod: property.leasePeriod,
        pricePerUnit: property.pricePerUnit,
        address: property.address,
        cityId: property.cityId,
        locality: property.locality,
        complexName: property.complexName,
        state: property.state,
        country: property.country,
        zipCode: property.zipCode,
        latitude: property.latitude,
        longitude: property.longitude,
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
        possessionStatus: property.possessionStatus,
        possessionDate: property.possessionDate
          ? new Date(property.possessionDate)
          : null,
        coveredParking: property.coveredParking,
        openParking: property.openParking,
        publicParking: property.publicParking,
        passengerLifts: property.passengerLifts,
        serviceLifts: property.serviceLifts,
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
        ceilingHeight: property.ceilingHeight,
        loadingDocks: property.loadingDocks,
        powerLoad: property.powerLoad,
        flooringType: property.flooringType,
        coveredArea: property.coveredArea,
        openArea: property.openArea,
        youtubeVideoUrl: property.youtubeVideoUrl,
        virtualTourUrl: property.virtualTourUrl,
        nearbyPlaces: property.nearbyPlaces,
        ownershipType: property.ownershipType,
        approvedBy: property.approvedBy,
        legalDispute: property.legalDispute || false,
        encumbranceFree: property.encumbranceFree ?? true,
        preferredTenants: property.preferredTenants,
        rentEscalation: property.rentEscalation,
        brochureAvailable: property.brochureAvailable ?? false,
        floorPlanAvailable: property.floorPlanAvailable ?? false,
        cornerLocation: property.cornerLocation ?? false,
        locatedIn: property.locatedIn,
        frontageWidth: property.frontageWidth,
        mainRoadFacing: property.mainRoadFacing ?? false,
        displayWindows: property.displayWindows ?? false,
        idealFor: property.idealFor,
        fireSafetyApproved: property.fireSafetyApproved ?? false,
        dockHeight: property.dockHeight,
        openSides: property.openSides,
        storageType: property.storageType,
        industryType: property.industryType,
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
          }),
        );
      }

      if (property.subTypeId && property.subType) {
        dispatch(
          setSubType({
            id: property.subType.id,
            name: property.subType.name,
          }),
        );
      } else {
        dispatch(setSubType(null));
      }

      if (property.images) {
        setImageFiles(
          property.images.map((img, idx) => ({
            file: null,
            url: img.url,
            caption: img.caption || null,
            isFloorPlan: img.isFloorPlan || null,
            key: img.key || null,
            order: img.order || idx,
            isCover: img.isCover,
            preview: img.viewableUrl || img.url,
          })),
        );
      }

      if (property.documents) {
        setDocuments(
          property.documents.map((doc) => ({
            url: doc.url,
            name: doc.name,
            type: doc.type,
            size: doc.size,
          })),
        );
      }
    }
  }, [mode, propertyData, setImageFiles, setDocuments]);

  const handleFormUpdate = (updates: Partial<PropertyCreateRequest>) => {
    setFormData({ ...formData, ...updates });
  };

  const handleNext = () => {
    if (validateStep(currentStep, formData, imageFiles)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const errorMessages = Object.values(errors);
      if (errorMessages.length > 0) {
        const errorText = errorMessages.join("\n");
        showError("Please fix the following issues:", errorText);
      } else {
        showError(
          "Validation Failed",
          "Please complete all required fields in this step.",
        );
      }
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
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

      const imageMetadata = imageFiles.map((img, index) => ({
        caption: img.caption || null,
        isFloorPlan: img.isFloorPlan || false,
        order: index,
        isCover: img.isCover || false,
        url: img.url!,
        key: img.key || null,
      }));

      const propertyDataToSend: PropertyCreateRequest = {
        ...formData,
        status: mode === "create" ? "UNDER_REVIEW" : formData.status!,
        images: imageMetadata,
      };

      if (mode === "edit") {
        const updateData: PropertyUpdateRequest = {
          ...propertyDataToSend,
          roadWidth: propertyDataToSend.roadWidth
            ? propertyDataToSend.roadWidth?.toString()
            : null,
          status: formData.status,
        };
        formDataToSend.append("data", JSON.stringify(updateData));
      } else {
        const createData: PropertyUpdateRequest = {
          ...propertyDataToSend,
          roadWidth: propertyDataToSend.roadWidth
            ? propertyDataToSend.roadWidth?.toString()
            : null,
        };
        formDataToSend.append("data", JSON.stringify(createData));
      }

      imageFiles.forEach((img) => {
        if (img.file) {
          formDataToSend.append("images", img.file);
        }
      });

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
        "Please try again.",
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
            floorPlanAvailable={formData.floorPlanAvailable}
            onImageUpload={handleImageUpload}
            onRemoveImage={removeImage}
            onCaptionChange={updateCaption}
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
    <>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-10">
        <div className="max-w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white truncate">
                {mode === "create" ? "Add New Property" : "Edit Property"}
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1 truncate">
                {mode === "create"
                  ? "Fill in the details to list your property"
                  : "Update your property information"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-full mx-auto">
        <Card className="shadow-lg">
          <CardContent className="p-4 sm:p-6 md:p-8">
            <StepIndicator steps={steps} currentStep={currentStep} />

            <div className="mt-6 sm:mt-8">
              <form onSubmit={(e) => e.preventDefault()}>
                {renderStepContent()}

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    type="button"
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    variant="outline"
                    className="order-2 sm:order-1"
                    startIcon={<ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />}
                  >
                    Back
                  </Button>

                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium text-center order-1 sm:order-2">
                    Step {currentStep + 1} of {steps.length}
                  </div>

                  {currentStep < steps.length - 1 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="order-3"
                      endIcon={<ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isLoading}
                      variant="primary"
                      className="order-3 bg-gradient-to-r from-success-600 to-success-700 hover:from-success-700 hover:to-success-800"
                      startIcon={
                        isLoading ? (
                          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                        )
                      }
                    >
                      {isLoading
                        ? "Saving..."
                        : mode === "create"
                          ? "Submit Property"
                          : "Update Property"}
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        {mode === "create" && (
          <Card className="mt-4 sm:mt-6">
            <CardContent className="p-4 sm:p-5 md:p-6">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                What happens after submission?
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {[
                  {
                    icon: Clock,
                    text: 'Your property will be set to "UNDER_REVIEW" status',
                    color:
                      "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30",
                  },
                  {
                    icon: CheckCircle,
                    text: "Our team will review your listing within 24-48 hours",
                    color:
                      "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30",
                  },
                  {
                    icon: Eye,
                    text: "Once approved, it will be visible to potential buyers/renters",
                    color:
                      "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30",
                  },
                  {
                    icon: Bell,
                    text: "You'll receive notifications about inquiries and views",
                    color:
                      "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30",
                  },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-start gap-2 sm:gap-3">
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color}`}
                      >
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 pt-0.5 sm:pt-1">
                        {item.text}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};
