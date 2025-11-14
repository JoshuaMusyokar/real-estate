/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ArrowLeft,
  ArrowRight,
  Bath,
  Bed,
  Building2,
  Calendar,
  Check,
  DollarSign,
  FileText,
  ImageIcon,
  MapPin,
  Save,
  Search,
  Square,
  Upload,
  X,
  AlertCircle,
} from "lucide-react";
import { StepIndicator } from "./StepIndicator";
import { ImageUpload } from "./ImageUpload";
import type {
  PropertyCreateRequest,
  PropertyPurpose,
  PropertyStatus,
  PropertySubType,
  PropertyType,
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

interface PropertyDocument {
  file?: File;
  url?: string;
  name: string;
  type: string;
  size?: number;
}

interface PropertyImageFile {
  file?: File;
  url?: string;
  caption?: string;
  order: number;
  isCover: boolean;
  preview?: string;
}

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

export const PropertyForm: React.FC<PropertyFormPageProps> = ({
  mode,
  propertyId,
}) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Basic Info",
    "Location",
    "Details",
    "Amenities",
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

  const amenities = amenitiesData?.data || [];
  const categories = categoriesData?.data || [];

  // Form State
  const [formData, setFormData] = useState<PropertyCreateRequest>({
    title: "",
    description: "",
    propertyType: "RESIDENTIAL",
    subType: null,
    purpose: "SALE",
    status: "UNDER_REVIEW",
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

  const [imageFiles, setImageFiles] = useState<PropertyImageFile[]>([]);
  const [documents, setDocuments] = useState<PropertyDocument[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Location search state
  const [locationSearch, setLocationSearch] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<
    LocationSuggestion[]
  >([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

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
        images: [],
      });

      // Load existing images
      if (property.images) {
        setImageFiles(
          property.images.map((img, idx) => ({
            url: img.url,
            caption: img.caption || undefined,
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
  }, [mode, propertyData]);

  // Geocoding with Nominatim
  const searchLocation = async (query: string) => {
    if (query.length < 3) return;

    setIsSearchingLocation(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5&addressdetails=1`,
        {
          headers: {
            "User-Agent": "PropertyApp/1.0",
          },
        }
      );
      const data: LocationSuggestion[] = await response.json();
      setLocationSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Failed to search location:", error);
    } finally {
      setIsSearchingLocation(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (locationSearch) {
        searchLocation(locationSearch);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [locationSearch]);

  const handleLocationSelect = (location: LocationSuggestion) => {
    setFormData({
      ...formData,
      address: location.display_name.split(",")[0] || location.display_name,
      city:
        location.address.city ||
        location.address.town ||
        location.address.village ||
        "",
      state: location.address.state || null,
      country: location.address.country || "",
      zipCode: location.address.postcode || null,
      latitude: parseFloat(location.lat),
      longitude: parseFloat(location.lon),
    });
    setLocationSearch(location.display_name);
    setShowSuggestions(false);
    setErrors({ ...errors, location: "" });
  };

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
  const statuses: PropertyStatus[] =
    mode === "edit"
      ? ["DRAFT", "UNDER_REVIEW", "AVAILABLE", "SOLD", "RENTED"]
      : ["DRAFT", "UNDER_REVIEW"];

  // Validation
  const validateField = (fieldName: string, value: any): string => {
    switch (fieldName) {
      case "title":
        if (!value || !value.trim()) return "Title is required";
        if (value.trim().length < 10)
          return "Title must be at least 10 characters";
        if (value.trim().length > 200)
          return "Title must not exceed 200 characters";
        break;

      case "description":
        if (!value || !value.trim()) return "Description is required";
        if (value.trim().length < 50)
          return "Description must be at least 50 characters";
        if (value.trim().length > 5000)
          return "Description must not exceed 5000 characters";
        break;

      case "price":
        if (!value || value <= 0) return "Price must be greater than 0";
        if (value > 1000000000) return "Price seems unrealistic";
        break;

      case "address":
        if (!value || !value.trim()) return "Address is required";
        if (value.trim().length < 5)
          return "Address must be at least 5 characters";
        break;

      case "city":
        if (!value || !value.trim()) return "City is required";
        break;

      case "locality":
        if (!value || !value.trim()) return "Locality is required";
        break;

      case "country":
        if (!value || !value.trim()) return "Country is required";
        break;

      case "bedrooms":
        if (value !== null && value !== undefined && value < 0)
          return "Bedrooms cannot be negative";
        if (value > 50) return "Number of bedrooms seems unrealistic";
        break;

      case "bathrooms":
        if (value !== null && value !== undefined && value < 0)
          return "Bathrooms cannot be negative";
        if (value > 50) return "Number of bathrooms seems unrealistic";
        break;

      case "squareFeet":
        if (value !== null && value !== undefined) {
          if (value < 50) return "Square feet seems too small";
          if (value > 1000000) return "Square feet seems too large";
        }
        break;

      case "yearBuilt":
        const currentYear = new Date().getFullYear();
        if (value !== null && value !== undefined) {
          if (value < 1800) return "Year built seems too old";
          if (value > currentYear + 5)
            return "Year built cannot be more than 5 years in future";
        }
        break;

      case "youtubeVideoUrl":
        if (value && value.trim()) {
          const youtubeRegex =
            /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
          if (!youtubeRegex.test(value)) return "Invalid YouTube URL";
        }
        break;

      case "virtualTourUrl":
        if (value && value.trim()) {
          try {
            new URL(value);
          } catch {
            return "Invalid URL format";
          }
        }
        break;
    }
    return "";
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Basic Info
        ["title", "description", "price"].forEach((field) => {
          const error = validateField(
            field,
            formData[field as keyof typeof formData]
          );
          if (error) newErrors[field] = error;
        });
        break;

      case 1: // Location
        ["address", "city", "locality", "country"].forEach((field) => {
          const error = validateField(
            field,
            formData[field as keyof typeof formData]
          );
          if (error) newErrors[field] = error;
        });
        if (!formData.latitude || !formData.longitude) {
          newErrors.location =
            "Please select a location from search to get coordinates";
        }
        break;

      case 2: // Details
        ["bedrooms", "bathrooms", "squareFeet", "yearBuilt"].forEach(
          (field) => {
            const error = validateField(
              field,
              formData[field as keyof typeof formData]
            );
            if (error) newErrors[field] = error;
          }
        );
        ["youtubeVideoUrl", "virtualTourUrl"].forEach((field) => {
          const error = validateField(
            field,
            formData[field as keyof typeof formData]
          );
          if (error) newErrors[field] = error;
        });
        break;

      case 3: // Amenities
        if (!formData.amenities || formData.amenities.length === 0) {
          newErrors.amenities = "Please select at least one amenity";
        }
        break;

      case 4: // Images
        if (imageFiles.length === 0) {
          newErrors.images = "Please upload at least one image";
        } else if (imageFiles.length < 3) {
          newErrors.images =
            "Please upload at least 3 images for better visibility";
        }
        const hasCover = imageFiles.some((img) => img.isCover);
        if (!hasCover && imageFiles.length > 0) {
          newErrors.images = "Please mark one image as cover";
        }
        break;

      case 5: // Documents (optional)
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (fieldName: string) => {
    setTouched({ ...touched, [fieldName]: true });
    const error = validateField(
      fieldName,
      formData[fieldName as keyof typeof formData]
    );
    if (error) {
      setErrors({ ...errors, [fieldName]: error });
    } else {
      const newErrors = { ...errors };
      delete newErrors[fieldName];
      setErrors(newErrors);
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: PropertyImageFile[] = Array.from(files).map(
      (file, idx) => ({
        file,
        order: imageFiles.length + idx,
        isCover: imageFiles.length === 0 && idx === 0,
        preview: URL.createObjectURL(file),
      })
    );

    setImageFiles([...imageFiles, ...newImages]);
  };

  const removeImage = (index: number) => {
    const removed = imageFiles[index];
    if (removed.preview && removed.file) {
      URL.revokeObjectURL(removed.preview);
    }
    const updated = imageFiles.filter((_, i) => i !== index);
    // Ensure at least one cover image
    if (removed.isCover && updated.length > 0) {
      updated[0].isCover = true;
    }
    setImageFiles(updated);
  };

  const setCoverImage = (index: number) => {
    setImageFiles(
      imageFiles.map((img, i) => ({
        ...img,
        isCover: i === index,
      }))
    );
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];

    const newDocs: PropertyDocument[] = Array.from(files)
      .filter((file) => {
        if (!allowedTypes.includes(file.type)) {
          alert(`File ${file.name} is not a supported format`);
          return false;
        }
        if (file.size > 10 * 1024 * 1024) {
          alert(`File ${file.name} exceeds 10MB limit`);
          return false;
        }
        return true;
      })
      .map((file) => ({
        file,
        name: file.name,
        type: file.type,
        size: file.size,
      }));

    setDocuments([...documents, ...newDocs]);
  };

  const removeDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Validate all steps
    let allValid = true;
    for (let i = 0; i < steps.length; i++) {
      if (!validateStep(i)) {
        allValid = false;
        setCurrentStep(i);
        break;
      }
    }

    if (!allValid) {
      alert("Please complete all required fields correctly");
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Prepare property data as JSON
      const propertyData = {
        title: formData.title,
        description: formData.description,
        propertyType: formData.propertyType,
        subType: formData.subType,
        purpose: formData.purpose,
        status: mode === "create" ? "UNDER_REVIEW" : formData.status,
        price: formData.price,
        priceNegotiable: formData.priceNegotiable,
        currency: formData.currency,
        address: formData.address,
        city: formData.city,
        locality: formData.locality,
        state: formData.state,
        country: formData.country,
        zipCode: formData.zipCode,
        latitude: formData.latitude,
        longitude: formData.longitude,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        squareFeet: formData.squareFeet,
        squareMeters: formData.squareMeters,
        floors: formData.floors,
        yearBuilt: formData.yearBuilt,
        furnishingStatus: formData.furnishingStatus,
        youtubeVideoUrl: formData.youtubeVideoUrl,
        virtualTourUrl: formData.virtualTourUrl,
        amenities: formData.amenities,
        images: imageFiles
          .filter((img) => !img.file)
          .map((img) => ({
            url: img.url!,
            caption: img.caption || null,
            order: img.order,
            isCover: img.isCover,
          })),
      };

      // Add data as JSON string
      formDataToSend.append("data", JSON.stringify(propertyData));

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
        alert("Property created successfully! It's now under review.");
        navigate(`/properties/${result.data.slug}`);
      } else if (propertyId) {
        const result = await updateProperty({
          id: propertyId,
          data: formDataToSend as any,
        }).unwrap();
        alert("Property updated successfully!");
        navigate(`/properties/${result.data.slug}`);
      }
    } catch (error: any) {
      console.error("Failed to save property:", error);
      alert(
        error?.data?.message || "Failed to save property. Please try again."
      );
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
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
                onBlur={() => handleBlur("title")}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                  touched.title && errors.title
                    ? "border-red-500"
                    : "border-gray-200"
                }`}
                placeholder="e.g., Luxury 3 Bedroom Apartment in Downtown"
              />
              {touched.title && errors.title && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.title}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.title.length}/200 characters (min: 10)
              </p>
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
                onBlur={() => handleBlur("description")}
                rows={6}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all resize-none ${
                  touched.description && errors.description
                    ? "border-red-500"
                    : "border-gray-200"
                }`}
                placeholder="Describe your property in detail... (minimum 50 characters)"
              />
              {touched.description && errors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.description}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.description.length}/5000 characters (min: 50)
              </p>
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
                      {type.replace("_", " ")}
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
                      {type.replace("_", " ")}
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
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {purpose}
                    </button>
                  ))}
                </div>
              </div>

              {mode === "edit" && (
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Status
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
                        {status.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {mode === "create" && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> All new properties are automatically
                  set to <strong>UNDER_REVIEW</strong> status and will be
                  reviewed by administrators before becoming public.
                </p>
              </div>
            )}

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
                    onBlur={() => handleBlur("price")}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                      touched.price && errors.price
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {touched.price && errors.price && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.price}
                  </p>
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
                  <option value="INR">INR</option>
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
                Search Location *
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  onFocus={() =>
                    locationSuggestions.length > 0 && setShowSuggestions(true)
                  }
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Search for address, city, or area..."
                />
                {isSearchingLocation && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {showSuggestions && locationSuggestions.length > 0 && (
                <div className="mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {locationSuggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleLocationSelect(suggestion)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-start gap-3"
                    >
                      <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {suggestion.display_name}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {errors.location && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.location}
                </p>
              )}
            </div>

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
                onBlur={() => handleBlur("address")}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                  touched.address && errors.address
                    ? "border-red-500"
                    : "border-gray-200"
                }`}
                placeholder="Street address"
              />
              {touched.address && errors.address && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.address}
                </p>
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
                  onBlur={() => handleBlur("city")}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                    touched.city && errors.city
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                  placeholder="City"
                />
                {touched.city && errors.city && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.city}
                  </p>
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
                  onBlur={() => handleBlur("locality")}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                    touched.locality && errors.locality
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                  placeholder="Locality"
                />
                {touched.locality && errors.locality && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.locality}
                  </p>
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
                  onBlur={() => handleBlur("country")}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                    touched.country && errors.country
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                  placeholder="Country"
                />
                {touched.country && errors.country && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.country}
                  </p>
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50"
                  placeholder="Auto-filled from location search"
                  readOnly
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50"
                  placeholder="Auto-filled from location search"
                  readOnly
                />
              </div>
            </div>

            {formData.latitude && formData.longitude && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div className="text-sm text-green-800">
                  <strong>Location coordinates set!</strong> Your property will
                  appear correctly on the map.
                </div>
              </div>
            )}
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
                  onBlur={() => handleBlur("bedrooms")}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.bedrooms ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="0"
                  min="0"
                />
                {errors.bedrooms && (
                  <p className="mt-1 text-xs text-red-600">{errors.bedrooms}</p>
                )}
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
                  onBlur={() => handleBlur("bathrooms")}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.bathrooms ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="0"
                  min="0"
                />
                {errors.bathrooms && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.bathrooms}
                  </p>
                )}
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
                  min="0"
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
                  onBlur={() => handleBlur("yearBuilt")}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.yearBuilt ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="2024"
                  min="1800"
                />
                {errors.yearBuilt && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.yearBuilt}
                  </p>
                )}
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
                  onBlur={() => handleBlur("squareFeet")}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.squareFeet ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="0"
                  min="0"
                />
                {errors.squareFeet && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.squareFeet}
                  </p>
                )}
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
                  min="0"
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
                onBlur={() => handleBlur("youtubeVideoUrl")}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.youtubeVideoUrl ? "border-red-500" : "border-gray-200"
                }`}
                placeholder="https://youtube.com/watch?v=..."
              />
              {errors.youtubeVideoUrl && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.youtubeVideoUrl}
                </p>
              )}
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
                onBlur={() => handleBlur("virtualTourUrl")}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.virtualTourUrl ? "border-red-500" : "border-gray-200"
                }`}
                placeholder="https://virtualtour.com/..."
              />
              {errors.virtualTourUrl && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.virtualTourUrl}
                </p>
              )}
            </div>
          </div>
        );

      case 3: // Amenities
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Select Amenities *
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Choose all amenities available in your property
              </p>
            </div>

            {errors.amenities && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-800">{errors.amenities}</p>
              </div>
            )}

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
                              if (updated.length > 0 && errors.amenities) {
                                const newErrors = { ...errors };
                                delete newErrors.amenities;
                                setErrors(newErrors);
                              }
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

            <div
              className={`border rounded-xl p-4 flex items-start gap-3 ${
                formData.amenities && formData.amenities.length > 0
                  ? "bg-blue-50 border-blue-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  formData.amenities && formData.amenities.length > 0
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                <Check className="w-5 h-5" />
              </div>
              <div>
                <div
                  className={`font-semibold mb-1 ${
                    formData.amenities && formData.amenities.length > 0
                      ? "text-blue-900"
                      : "text-gray-700"
                  }`}
                >
                  {formData.amenities?.length || 0} Amenities Selected
                </div>
                <div
                  className={`text-sm ${
                    formData.amenities && formData.amenities.length > 0
                      ? "text-blue-700"
                      : "text-gray-600"
                  }`}
                >
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
                Property Images *
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Add high-quality images to showcase your property. Mark one as
                cover image.
              </p>
            </div>

            {errors.images && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-800">{errors.images}</p>
              </div>
            )}

            <div>
              <label className="block w-full cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-all">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="text-sm font-semibold text-gray-900 mb-1">
                    Click to upload images
                  </div>
                  <div className="text-xs text-gray-500">
                    PNG, JPG up to 5MB each (min. 3 images)
                  </div>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {imageFiles.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {imageFiles.map((img, idx) => (
                  <div
                    key={idx}
                    className={`relative group rounded-xl overflow-hidden border-4 ${
                      img.isCover ? "border-green-500" : "border-gray-200"
                    }`}
                  >
                    <img
                      src={img.preview || img.url}
                      alt={`Property ${idx + 1}`}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2">
                      {!img.isCover && (
                        <button
                          type="button"
                          onClick={() => setCoverImage(idx)}
                          className="opacity-0 group-hover:opacity-100 bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                        >
                          Set as Cover
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="opacity-0 group-hover:opacity-100 bg-red-600 text-white p-2 rounded-lg transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {img.isCover && (
                      <div className="absolute top-2 left-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        COVER
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                      #{idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}

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

      case 5: // Documents
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Property Documents
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Upload relevant documents like title deeds, floor plans, or
                certificates (optional but recommended)
              </p>
            </div>

            <div>
              <label className="block w-full cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-all">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="text-sm font-semibold text-gray-900 mb-1">
                    Click to upload documents
                  </div>
                  <div className="text-xs text-gray-500">
                    PDF, DOC, DOCX, JPG, PNG up to 10MB each
                  </div>
                </div>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,image/jpeg,image/png"
                  onChange={handleDocumentUpload}
                  className="hidden"
                />
              </label>
            </div>

            {documents.length > 0 && (
              <div className="space-y-3">
                {documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between group hover:border-blue-300 transition-all"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {doc.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {doc.size ? formatFileSize(doc.size) : "Unknown size"}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDocument(idx)}
                      className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <strong>Document Tips:</strong> Include title deeds, floor
                plans, NOC (No Objection Certificate), or any relevant property
                certificates. These increase buyer confidence and trust.
              </div>
            </div>

            {documents.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div className="text-sm text-green-800">
                  <strong>{documents.length} document(s) uploaded.</strong> This
                  adds credibility to your listing!
                </div>
              </div>
            )}
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
