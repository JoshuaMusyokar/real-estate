import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useAmenities } from "../../hooks/useAmenities";
import { useAmenityFilters } from "../../hooks/useAmenityFilters";
import { Header } from "./components/Header";
import { Filters } from "./components/Filters";
import { Stats } from "./components/Stats";
import { AmenityGrid } from "./components/AmenityGrid";
import { AmenityTable } from "./components/AmenityTable";
import { Pagination } from "./components/Pagination";
import { CreateModal } from "./components/CreateModal";
import { EditModal } from "./components/EditModal";
import { DeleteModal } from "./components/DeleteModal";
import { BulkImportModal } from "./components/BulkImport";
import type { Amenity, ViewMode } from "../../types";
import { Package, Plus } from "lucide-react";

export const AmenitiesManagement = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const { filters, updateFilters, resetFilters } = useAmenityFilters();

  const { amenities, categories, pagination, isLoading, refetch } =
    useAmenities(filters);

  const [modalState, setModalState] = useState({
    create: false,
    edit: false,
    delete: false,
    bulk: false,
  });

  const openModal = (modal: keyof typeof modalState) =>
    setModalState((prev) => ({ ...prev, [modal]: true }));
  const closeModal = (modal: keyof typeof modalState) =>
    setModalState((prev) => ({ ...prev, [modal]: false }));

  const handleEdit = (amenity: Amenity) => {
    setSelectedAmenity(amenity);
    openModal("edit");
  };

  const handleDelete = (amenity: Amenity) => {
    setSelectedAmenity(amenity);
    openModal("delete");
  };

  const handleCreateSuccess = () => {
    closeModal("create");
    refetch();
  };

  const handleEditSuccess = () => {
    closeModal("edit");
    setSelectedAmenity(null);
    refetch();
  };

  const handleDeleteSuccess = () => {
    closeModal("delete");
    setSelectedAmenity(null);
    refetch();
  };

  const handleBulkSuccess = () => {
    closeModal("bulk");
    refetch();
  };

  return (
    <>
      <Header
        user={user!}
        onAddAmenity={() => openModal("create")}
        onBulkImport={() => openModal("bulk")}
      />

      <div className="max-w-full mx-auto">
        <Filters
          filters={filters}
          categories={categories}
          viewMode={viewMode}
          onFiltersChange={updateFilters}
          onViewModeChange={setViewMode}
          onResetFilters={resetFilters}
        />

        <Stats
          amenities={amenities}
          categories={categories}
          pagination={pagination}
        />

        {isLoading ? (
          <LoadingState />
        ) : amenities.length === 0 ? (
          <EmptyState onAddAmenity={() => openModal("create")} />
        ) : viewMode === "grid" ? (
          <AmenityGrid
            amenities={amenities}
            user={user!}
            onEdit={handleEdit}
            onDelete={handleDelete}
            activeDropdown={activeDropdown}
            onDropdownToggle={setActiveDropdown}
          />
        ) : (
          <AmenityTable
            amenities={amenities}
            user={user!}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {pagination && pagination.totalPages > 1 && (
          <Pagination
            pagination={pagination}
            onPageChange={(page) => updateFilters({ page })}
          />
        )}
      </div>

      {/* Modals */}
      <CreateModal
        isOpen={modalState.create}
        onClose={() => closeModal("create")}
        categories={categories}
        onSuccess={handleCreateSuccess}
      />

      <EditModal
        isOpen={modalState.edit}
        onClose={() => closeModal("edit")}
        amenity={selectedAmenity}
        categories={categories}
        onSuccess={handleEditSuccess}
      />

      <DeleteModal
        isOpen={modalState.delete}
        onClose={() => closeModal("delete")}
        amenity={selectedAmenity}
        onSuccess={handleDeleteSuccess}
      />

      <BulkImportModal
        isOpen={modalState.bulk}
        onClose={() => closeModal("bulk")}
        onSuccess={handleBulkSuccess}
      />
    </>
  );
};

const LoadingState = () => (
  <div className="flex items-center justify-center py-20">
    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const EmptyState = ({ onAddAmenity }: { onAddAmenity: () => void }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center mt-6">
    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
      No amenities found
    </h3>
    <p className="text-gray-600 dark:text-gray-400 mb-6">
      Get started by creating your first amenity
    </p>
    <button
      onClick={onAddAmenity}
      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      <Plus className="w-5 h-5" />
      Add Amenity
    </button>
  </div>
);
