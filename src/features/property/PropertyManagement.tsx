/* eslint-disable @typescript-eslint/no-unused-vars */
import { DollarSign, Eye, Home, Plus, TrendingUp } from "lucide-react";
import { PropertyListItem } from "./PropertyListItem";
import { PropertyCard } from "./PropertyCard";
import type { PropertyStatus } from "../../types";
import { StatsCard } from "./statsCard";
import {
  useDeletePropertyMutation,
  useGetPropertyStatsQuery,
  useGetUserPropertiesQuery,
} from "../../services/propertyApi";
import { useState } from "react";
import { useNavigate } from "react-router";
import { PropertyFilters } from "./components/PropertyFilters";

export const PropertyManagement: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | "all">(
    "all",
  );
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("all");
  const [purposeFilter, setPurposeFilter] = useState("all");
  const [priceRangeFilter, setPriceRangeFilter] = useState("all");
  const [page, setPage] = useState(1);

  const { data: propertiesData, isLoading } = useGetUserPropertiesQuery({
    page,
    limit: 20,
  });
  const { data: statsData } = useGetPropertyStatsQuery();
  const [deleteProperty] = useDeletePropertyMutation();

  const properties = propertiesData?.data || [];
  const stats = statsData?.data;

  const handleEdit = (id: string) => {
    navigate(`/properties/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await deleteProperty(id).unwrap();
      } catch (error) {
        console.error("Failed to delete property:", error);
      }
    }
  };

  const handleView = (slug: string) => {
    navigate(`/properties/${slug}`);
  };

  const handleCreateNew = () => {
    navigate("/properties/new");
  };

  // Enhanced filtering logic
  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.locality.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || property.status === statusFilter;

    // Add property type filtering logic if you have this field
    const matchesPropertyType = propertyTypeFilter === "all";
    // || property.propertyType === propertyTypeFilter;

    // Add purpose filtering logic
    const matchesPurpose = purposeFilter === "all";
    // || property.purpose.toLowerCase() === purposeFilter;

    // Add price range filtering logic
    let matchesPriceRange = true;
    if (priceRangeFilter === "under-500k") {
      matchesPriceRange = property.price < 500000;
    } else if (priceRangeFilter === "500k-1m") {
      matchesPriceRange = property.price >= 500000 && property.price <= 1000000;
    } else if (priceRangeFilter === "over-1m") {
      matchesPriceRange = property.price > 1000000;
    }

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPropertyType &&
      matchesPurpose &&
      matchesPriceRange
    );
  });

  return (
    <div>
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 mb-4 sm:mb-6">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base lg:text-lg">
                Manage and monitor your property listings
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 bg-blue-600 dark:bg-blue-500 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition font-medium text-sm sm:text-base whitespace-nowrap"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Add Property
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          <StatsCard
            icon={Home}
            label="Total Properties"
            value={stats?.totalProperties || 0}
            change={12}
            color="blue"
          />
          <StatsCard
            icon={DollarSign}
            label="Available"
            value={stats?.availableProperties || 0}
            change={8}
            color="green"
          />
          <StatsCard
            icon={Eye}
            label="Total Views"
            value={stats?.totalViews || 0}
            change={-3}
            color="amber"
          />
          <StatsCard
            icon={TrendingUp}
            label="Pending Review"
            value={stats?.pendingProperties || 0}
            change={25}
            color="purple"
          />
        </div>

        {/* Filters Component */}
        <PropertyFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
          propertyTypeFilter={propertyTypeFilter}
          setPropertyTypeFilter={setPropertyTypeFilter}
          purposeFilter={purposeFilter}
          setPurposeFilter={setPurposeFilter}
          priceRangeFilter={priceRangeFilter}
          setPriceRangeFilter={setPriceRangeFilter}
        />

        {/* Properties Grid/List */}
        {isLoading ? (
          <div
            className={`grid gap-4 sm:gap-5 md:gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse"
              >
                <div className="h-40 sm:h-48 md:h-56 bg-gray-200" />
                <div className="p-3 sm:p-4 md:p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-8 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-5">
            {filteredProperties.map((property) => (
              <PropertyListItem
                key={property.id}
                property={property}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredProperties.length === 0 && (
          <div className="text-center py-12 sm:py-16 bg-white rounded-xl border border-gray-200">
            <Home className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              No properties found
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              Try adjusting your search or filters
            </p>
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Add Your First Property
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
