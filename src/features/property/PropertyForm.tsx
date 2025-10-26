import {
  ArrowLeft,
  ArrowRight,
  Bath,
  Bed,
  Building2,
  Calendar,
  Check,
  DollarSign,
  ImageIcon,
  Save,
  Square,
} from "lucide-react";
import { StepIndicator } from "./StepIndicator";
import { ImageUpload } from "./ImageUpload";
import type {
  PropertyCreateRequest,
  PropertyPurpose,
  PropertyStatus,
  PropertySubType,
  PropertyType,
  PropertyUpdateRequest,
} from "../../types";
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

interface PropertyFormPageProps {
  mode: "create" | "edit";
  propertyId?: string;
}

export const PropertyForm: React.FC<PropertyFormPageProps> = ({
  mode,
  propertyId,
}) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = ["Basic Info", "Location", "Details", "Amenities", "Images"];

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

  const amenities = amenitiesData?.data || [];
  const categories = categoriesData?.data || [];

  // Form State
  const [formData, setFormData] = useState<PropertyCreateRequest>({
    title: "",
    description: "",
    propertyType: "RESIDENTIAL",
    subType: null,
    purpose: "SALE",
    status: "DRAFT",
    price: 0,
    priceNegotiable: false,
    currency: "USD",
    address: "",
    city: "",
    locality: "",
    state: null,
    country: "",
    zipCode: null,
    latitude: null,
    longitude: null,
    bedrooms: null,
    bathrooms: null,
    squareFeet: null,
    squareMeters: undefined,
    floors: null,
    yearBuilt: null,
    furnishingStatus: null,
    youtubeVideoUrl: null,
    virtualTourUrl: null,
    amenities: [],
    images: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load existing property data for edit mode
  useEffect(() => {
    if (mode === "edit" && propertyData?.data) {
      const property = propertyData.data;
      setFormData({
        title: property.title,
        description: property.description,
        propertyType: property.propertyType,
        subType: property.subType,
        purpose: property.purpose,
        status: property.status,
        price: Number(property.price),
        priceNegotiable: property.priceNegotiable,
        currency: property.currency,
        address: property.address,
        city: property.city,
        locality: property.locality,
        state: property.state,
        country: property.country!,
        zipCode: property.zipCode,
        latitude: property.latitude,
        longitude: property.longitude,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        squareFeet: property.squareFeet,
        squareMeters: property.squareMeters || undefined,
        floors: property.floors,
        yearBuilt: property.yearBuilt,
        furnishingStatus: property.furnishingStatus,
        youtubeVideoUrl: property.youtubeVideoUrl,
        virtualTourUrl: property.virtualTourUrl,
        amenities: property.amenities?.map((a) => a.amenityId) || [],
        images:
          property.images?.map((img) => ({
            url: img.url,
            order: img.order,
            isCover: img.isCover,
          })) || [],
      });
    }
  }, [mode, propertyData]);

  const propertyTypes: PropertyType[] = [
    "RESIDENTIAL",
    "COMMERCIAL",
    "LAND",
    "INDUSTRIAL",
    "MIXED_USE",
  ];
  const subTypes: PropertySubType[] = [
    "APARTMENT",
    "VILLA",
    "HOUSE",
    "FLAT",
    "STUDIO",
    "PENTHOUSE",
    "DUPLEX",
    "TOWNHOUSE",
    "OFFICE",
    "SHOP",
    "WAREHOUSE",
    "SHOWROOM",
    "PLOT",
    "AGRICULTURAL",
    "INDUSTRIAL_LAND",
  ];
  const purposes: PropertyPurpose[] = ["SALE", "RENT", "LEASE"];
  const statuses: PropertyStatus[] = ["DRAFT", "UNDER_REVIEW", "AVAILABLE"];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Basic Info
        if (!formData.title.trim()) newErrors.title = "Title is required";
        if (!formData.description.trim())
          newErrors.description = "Description is required";
        if (formData.price <= 0)
          newErrors.price = "Price must be greater than 0";
        break;
      case 1: // Location
        if (!formData.address.trim()) newErrors.address = "Address is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.locality.trim())
          newErrors.locality = "Locality is required";
        if (!formData.country.trim()) newErrors.country = "Country is required";
        break;
      case 2: // Details - optional fields
        break;
      case 3: // Amenities - optional
        break;
      case 4: // Images - optional but recommended
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    try {
      if (mode === "create") {
        const result = await createProperty(formData).unwrap();
        navigate(`/properties/${result.data.slug}`);
      } else if (propertyId) {
        const result = await updateProperty({
          id: propertyId,
          data: formData as PropertyUpdateRequest,
        }).unwrap();
        navigate(`/properties/${result.data.slug}`);
      }
    } catch (error) {
      console.error("Failed to save property:", error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Property Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.title ? "border-red-500" : "border-gray-200"
                }`}
                placeholder="e.g., Luxury 3 Bedroom Apartment in Downtown"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={6}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all resize-none ${
                  errors.description ? "border-red-500" : "border-gray-200"
                }`}
                placeholder="Describe your property in detail..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Property Type *
                </label>
                <select
                  value={formData.propertyType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      propertyType: e.target.value as PropertyType,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Sub Type
                </label>
                <select
                  value={formData.subType || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subType: (e.target.value as PropertySubType) || null,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="">Select Sub Type</option>
                  {subTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Purpose *
                </label>
                <div className="flex gap-3">
                  {purposes.map((purpose) => (
                    <button
                      key={purpose}
                      type="button"
                      onClick={() => setFormData({ ...formData, purpose })}
                      className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                        formData.purpose === purpose
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {purpose}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as PropertyStatus,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Price * ({formData.currency})
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.price || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.price ? "border-red-500" : "border-gray-200"
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData({ ...formData, currency: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="KES">KES</option>
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.priceNegotiable}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priceNegotiable: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-semibold text-gray-900">
                  Price is negotiable
                </span>
              </label>
            </div>
          </div>
        );

      case 1: // Location
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Address *
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.address ? "border-red-500" : "border-gray-200"
                }`}
                placeholder="Street address"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.city ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="City"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Locality/Neighborhood *
                </label>
                <input
                  type="text"
                  value={formData.locality}
                  onChange={(e) =>
                    setFormData({ ...formData, locality: e.target.value })
                  }
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.locality ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="Locality"
                />
                {errors.locality && (
                  <p className="mt-1 text-sm text-red-600">{errors.locality}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  State/Province
                </label>
                <input
                  type="text"
                  value={formData.state || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value || null })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="State"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.country ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="Country"
                />
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Zip/Postal Code
                </label>
                <input
                  type="text"
                  value={formData.zipCode || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      zipCode: e.target.value || null,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Zip code"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      latitude: parseFloat(e.target.value) || null,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="0.000000"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      longitude: parseFloat(e.target.value) || null,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="0.000000"
                />
              </div>
            </div>
          </div>
        );

      case 2: // Details
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  <Bed className="w-4 h-4 inline mr-1" />
                  Bedrooms
                </label>
                <input
                  type="number"
                  value={formData.bedrooms || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bedrooms: parseInt(e.target.value) || null,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  <Bath className="w-4 h-4 inline mr-1" />
                  Bathrooms
                </label>
                <input
                  type="number"
                  value={formData.bathrooms || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bathrooms: parseInt(e.target.value) || null,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  <Building2 className="w-4 h-4 inline mr-1" />
                  Floors
                </label>
                <input
                  type="number"
                  value={formData.floors || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      floors: parseInt(e.target.value) || null,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Year Built
                </label>
                <input
                  type="number"
                  value={formData.yearBuilt || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      yearBuilt: parseInt(e.target.value) || null,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="2024"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  <Square className="w-4 h-4 inline mr-1" />
                  Square Feet
                </label>
                <input
                  type="number"
                  value={formData.squareFeet || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      squareFeet: parseInt(e.target.value) || null,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Square Meters
                </label>
                <input
                  type="number"
                  value={formData.squareMeters || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      squareMeters: parseInt(e.target.value) || undefined,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Furnishing Status
              </label>
              <select
                value={formData.furnishingStatus || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    furnishingStatus: e.target.value || null,
                  })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="">Select Furnishing Status</option>
                <option value="Furnished">Furnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                YouTube Video URL
              </label>
              <input
                type="url"
                value={formData.youtubeVideoUrl || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    youtubeVideoUrl: e.target.value || null,
                  })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Virtual Tour URL
              </label>
              <input
                type="url"
                value={formData.virtualTourUrl || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    virtualTourUrl: e.target.value || null,
                  })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="https://virtualtour.com/..."
              />
            </div>
          </div>
        );

      case 3: // Amenities
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Select Amenities
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Choose all amenities available in your property
              </p>
            </div>

            {categories.length > 0 ? (
              categories.map((category) => {
                const categoryAmenities = amenities.filter(
                  (a) => a.category === category
                );
                if (categoryAmenities.length === 0) return null;

                return (
                  <div key={category} className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">
                      {category}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {categoryAmenities.map((amenity) => {
                        const isSelected = formData.amenities?.includes(
                          amenity.id
                        );
                        return (
                          <button
                            key={amenity.id}
                            type="button"
                            onClick={() => {
                              const current = formData.amenities || [];
                              const updated = isSelected
                                ? current.filter((id) => id !== amenity.id)
                                : [...current, amenity.id];
                              setFormData({ ...formData, amenities: updated });
                            }}
                            className={`p-3 rounded-xl text-sm font-medium transition-all text-left ${
                              isSelected
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                            }`}
                          >
                            <Check
                              className={`w-4 h-4 inline mr-2 ${
                                isSelected ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            {amenity.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {amenities.map((amenity) => {
                  const isSelected = formData.amenities?.includes(amenity.id);
                  return (
                    <button
                      key={amenity.id}
                      type="button"
                      onClick={() => {
                        const current = formData.amenities || [];
                        const updated = isSelected
                          ? current.filter((id) => id !== amenity.id)
                          : [...current, amenity.id];
                        setFormData({ ...formData, amenities: updated });
                      }}
                      className={`p-3 rounded-xl text-sm font-medium transition-all ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      <Check
                        className={`w-4 h-4 inline mr-2 ${
                          isSelected ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      {amenity.name}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-blue-900 mb-1">
                  {formData.amenities?.length || 0} Amenities Selected
                </div>
                <div className="text-sm text-blue-700">
                  More amenities increase property appeal and search visibility
                </div>
              </div>
            </div>
          </div>
        );

      case 4: // Images
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Property Images
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Add high-quality images to showcase your property. The first
                image or marked cover will be the main display.
              </p>
            </div>

            <ImageUpload
              images={formData.images || []}
              onChange={(images) => setFormData({ ...formData, images })}
            />

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <ImageIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <strong>Image Tips:</strong> Use high-resolution images (minimum
                1200x800px), show different angles and rooms, include exterior
                and interior shots, and ensure good lighting.
              </div>
            </div>
          </div>
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                        ? "Create Property"
                        : "Update Property"}
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Save Draft Button (for create mode) */}
        {mode === "create" && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setFormData({ ...formData, status: "DRAFT" });
                handleSubmit();
              }}
              className="text-gray-600 hover:text-gray-900 font-medium underline"
            >
              Save as Draft
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
