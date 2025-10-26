/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  DollarSign,
  Eye,
  Filter,
  Grid,
  Home,
  List,
  Plus,
  Search,
  TrendingUp,
} from "lucide-react";
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

export const PropertyManagement: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | "all">(
    "all"
  );
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

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
    // Navigate to edit page: navigate(`/properties/${id}/edit`)
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

  //   const handleView = (id: string) => {
  //     navigate(`/properties/${slug}`);
  //     // Navigate to detail page: navigate(`/properties/${id}`)
  //   };
  const handleView = (slug: string) => {
    navigate(`/properties/${slug}`);
    // Navigate to detail page: navigate(`/properties/${id}`)
  };

  const handleCreateNew = () => {
    navigate("/properties/new");
  };

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || property.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Property Management
              </h1>
              <p className="text-gray-600 text-lg">
                Manage and monitor your property listings
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Add Property
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        {/* Filters and Search */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search properties by title, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as PropertyStatus | "all")
              }
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium transition-all"
            >
              <option value="all">All Status</option>
              <option value="AVAILABLE">Available</option>
              <option value="PENDING">Pending</option>
              <option value="SOLD">Sold</option>
              <option value="RENTED">Rented</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="DRAFT">Draft</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-5 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>

            <div className="flex items-center gap-2 border border-gray-300 rounded-xl p-1.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-5 pt-5 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <select className="px-4 py-3 border border-gray-300 rounded-xl font-medium">
                <option>Property Type</option>
                <option>Residential</option>
                <option>Commercial</option>
                <option>Land</option>
              </select>
              <select className="px-4 py-3 border border-gray-300 rounded-xl font-medium">
                <option>Purpose</option>
                <option>Sale</option>
                <option>Rent</option>
                <option>Lease</option>
              </select>
              <select className="px-4 py-3 border border-gray-300 rounded-xl font-medium">
                <option>Price Range</option>
                <option>Under $500K</option>
                <option>$500K - $1M</option>
                <option>Over $1M</option>
              </select>
            </div>
          )}
        </div>

        {/* Properties Grid/List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse"
              >
                <div className="h-56 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-8 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="space-y-5">
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
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Home className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No properties found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filters
            </p>
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Your First Property
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
