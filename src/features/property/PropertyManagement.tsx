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
import { usePermissions } from "../../hooks/usePermissions";
import {
  MyPropertyFilters,
  type MyPropertyFiltersState,
} from "./components/MyPropertiesFilters";

export const PropertyManagement: React.FC = () => {
  const navigate = useNavigate();

  // ── View mode ─────────────────────────────────────────────────────────────
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);

  // ── Filters (single state object — passed to API + filter bar) ───────────
  const [filters, setFilters] = useState<MyPropertyFiltersState>({
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // ── Permissions ─────────────────────────────────────────────────────────────
  const { can } = usePermissions();
  const canAdd = can("property.add");
  const canEdit = can("property.edit");
  const canDelete = can("property.delete");

  // ── API ──────────────────────────────────────────────────────────────────────
  const {
    data: propertiesData,
    isLoading,
    refetch,
  } = useGetUserPropertiesQuery({
    page,
    limit: 20,
    // Pass every filter field — the endpoint ignores undefined values
    search: filters.search,
    status: filters.status,
    purpose: filters.purpose,
    possessionStatus: filters.possessionStatus,
    propertyTypeId: filters.propertyTypeId,
    subTypeId: filters.subTypeId,
    city: filters.city,
    locality: filters.locality,
    localityId: filters.localityId,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    bedrooms: filters.bedrooms,
    verified: filters.verified,
    hasBalcony: filters.hasBalcony,
    furnishingStatus: filters.furnishingStatus,
    facingDirection: filters.facingDirection,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  });
  const { data: statsData } = useGetPropertyStatsQuery();
  const [deleteProperty] = useDeletePropertyMutation();

  const properties = propertiesData?.data || [];
  const pagination = propertiesData?.pagination;
  const stats = statsData?.data;

  // ── Reset page when filters change ───────────────────────────────────────
  const setFiltersAndReset = (
    v: React.SetStateAction<MyPropertyFiltersState>,
  ) => {
    setFilters(v);
    setPage(1);
  };

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleEdit = (id: string) => navigate(`/properties/${id}/edit`);
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this property?")) return;
    try {
      await deleteProperty(id).unwrap();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };
  const handleView = (id: string) => navigate(`/properties/${id}`);
  const handleCreateNew = () => navigate("/properties/new");

  return (
    <div>
      {/* ── Page header ───────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 mb-4 sm:mb-6">
        <div className="max-w-full mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-gray-500 text-sm">
              Manage and monitor your property listings
            </p>
            {canAdd && (
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors shadow-sm shadow-blue-200 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" /> Add Property
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto">
        {/* ── Stats ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
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

        {/* ── Filter bar ────────────────────────────────────────────────── */}
        <MyPropertyFilters
          filters={filters}
          setFilters={setFiltersAndReset}
          viewMode={viewMode}
          setViewMode={setViewMode}
          totalCount={pagination?.total}
        />

        {/* ── Property grid / list ──────────────────────────────────────── */}
        {isLoading ? (
          <div
            className={`grid gap-4 sm:gap-5 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse"
              >
                <div className="h-40 sm:h-48 bg-blue-50" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-blue-50 rounded w-3/4" />
                  <div className="h-3 bg-blue-50 rounded w-1/2" />
                  <div className="h-7 bg-blue-50 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onView={handleView}
                onEdit={canEdit ? handleEdit : undefined}
                onDelete={canDelete ? handleDelete : undefined}
                refetch={() => refetch()}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {properties.map((property) => (
              <PropertyListItem
                key={property.id}
                property={property}
                onView={handleView}
                onEdit={canEdit ? handleEdit : undefined}
                onDelete={canDelete ? handleDelete : undefined}
              />
            ))}
          </div>
        )}

        {/* ── Empty state ───────────────────────────────────────────────── */}
        {!isLoading && properties.length === 0 && (
          <div className="text-center py-12 sm:py-16 bg-white rounded-xl border border-blue-100">
            <Home className="w-14 h-14 text-blue-200 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              No properties found
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              {canAdd
                ? "Try adjusting your filters, or add a new listing"
                : "No properties match your current filters"}
            </p>
            {canAdd && (
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm shadow-blue-200"
              >
                <Plus className="w-4 h-4" /> Add Your First Property
              </button>
            )}
          </div>
        )}

        {/* ── Pagination ────────────────────────────────────────────────── */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-2 text-xs font-semibold border border-blue-200 rounded-xl text-blue-600 hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            {Array.from(
              { length: Math.min(pagination.totalPages, 7) },
              (_, i) => {
                // Show pages around current
                const mid = Math.min(
                  Math.max(page, 4),
                  pagination.totalPages - 3,
                );
                const start = Math.max(1, mid - 3);
                const p = start + i;
                if (p > pagination.totalPages) return null;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 text-xs font-bold rounded-xl border transition-colors
                    ${p === page ? "bg-blue-600 text-white border-blue-600" : "border-blue-200 text-blue-600 hover:bg-blue-50"}`}
                  >
                    {p}
                  </button>
                );
              },
            )}
            <button
              onClick={() =>
                setPage((p) => Math.min(pagination.totalPages, p + 1))
              }
              disabled={page === pagination.totalPages}
              className="px-3 py-2 text-xs font-semibold border border-blue-200 rounded-xl text-blue-600 hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
