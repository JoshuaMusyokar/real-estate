import {
  Check,
  ChevronRight,
  Home,
  MapPin,
  Navigation,
  User,
} from "lucide-react";
import { ContactForm } from "./ContactForm";
import type { Amenity, Role } from "../../types";
import { PropertyStats } from "./PropertyStats";
import { PropertyHeader } from "./PropertyHeader";
import { ImageGallery } from "./ImageGallery";
import { useGetPropertyAmenitiesQuery } from "../../services/AmenityApi";
import {
  useDeletePropertyMutation,
  useGetPropertyBySlugQuery,
} from "../../services/propertyApi";

interface PropertyDetailProps {
  slug: string;
  userRole?: Role;
  userId?: string;
}
export const PropertyDetail: React.FC<PropertyDetailProps> = ({
  slug,
  userRole = "BUYER",
  userId,
}) => {
  const { data, isLoading, error } = useGetPropertyBySlugQuery(slug);
  const [deleteProperty] = useDeletePropertyMutation();

  const property = data?.data;
  const propertyId = property?.id;

  const { data: amenitiesData } = useGetPropertyAmenitiesQuery(
    propertyId || "",
    {
      skip: !propertyId,
    }
  );

  const amenities: Amenity[] = amenitiesData?.data || [];

  const isOwner = userId === property?.ownerId;

  const handleEdit = () => {
    console.log("Edit property:", property?.id);
    // Navigate to edit page
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await deleteProperty(property!.id).unwrap();
        // Navigate to properties list
      } catch (error) {
        console.error("Failed to delete property:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">
            Loading property details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Home className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Property Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="hover:text-blue-600 cursor-pointer">Home</span>
            <ChevronRight className="w-4 h-4" />
            <span className="hover:text-blue-600 cursor-pointer">
              Properties
            </span>
            <ChevronRight className="w-4 h-4" />
            <span className="hover:text-blue-600 cursor-pointer">
              {property.city}
            </span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium truncate">
              {property.title}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Gallery */}
        <div className="mb-8">
          <ImageGallery images={property.images || []} title={property.title} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <PropertyHeader
              property={property}
              userRole={userRole}
              isOwner={isOwner}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            {/* Stats */}
            <PropertyStats property={property} />

            {/* Description */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About This Property
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Property Details */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Property Details
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    Property Type
                  </div>
                  <div className="font-semibold text-gray-900">
                    {property.propertyType}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Sub Type</div>
                  <div className="font-semibold text-gray-900">
                    {property.subType || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Purpose</div>
                  <div className="font-semibold text-gray-900">
                    {property.purpose}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Currency</div>
                  <div className="font-semibold text-gray-900">
                    {property.currency}
                  </div>
                </div>
                {property.squareMeters && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      Square Meters
                    </div>
                    <div className="font-semibold text-gray-900">
                      {property.squareMeters}
                    </div>
                  </div>
                )}
                {property.zipCode && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Zip Code</div>
                    <div className="font-semibold text-gray-900">
                      {property.zipCode}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Amenities
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {amenities.map((item: Amenity) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Check className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-gray-900">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Location
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">
                      Address
                    </div>
                    <div className="text-gray-700">{property.address}</div>
                    <div className="text-gray-700">
                      {property.locality}, {property.city}
                    </div>
                    {property.state && (
                      <div className="text-gray-700">
                        {property.state}, {property.country}
                      </div>
                    )}
                  </div>
                </div>
                {property.latitude && property.longitude && (
                  <div className="h-64 bg-gray-200 rounded-xl flex items-center justify-center">
                    <Navigation className="w-12 h-12 text-gray-400" />
                    <span className="ml-3 text-gray-600 font-medium">
                      Map placeholder
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Owner Info (Admin/Owner only) */}
            {(isOwner ||
              userRole === "ADMIN" ||
              userRole === "SUPER_ADMIN") && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-6 h-6 text-amber-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Owner Information
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Name</div>
                    <div className="font-semibold text-gray-900">
                      {property.ownerName}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Email</div>
                    <div className="font-semibold text-gray-900">
                      {property.ownerEmail}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Phone</div>
                    <div className="font-semibold text-gray-900">
                      {property.ownerPhone}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Owner ID</div>
                    <div className="font-semibold text-gray-900 text-xs">
                      {property.ownerId}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ContactForm property={property} />
          </div>
        </div>
      </div>
    </div>
  );
};
