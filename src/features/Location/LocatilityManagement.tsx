/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useMemo } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MapPinIcon,
  UsersIcon,
} from "lucide-react";
import { DataTable, type Column } from "../../components/common/Datatable";
import { Pagination } from "./Pagination";
import {
  useGetLocalitiesQuery,
  useDeleteLocalityMutation,
} from "../../services/locationApi";
import type { Locality } from "../../types";
import { LocalityForm } from "./LocalityForm";
import { ConfirmationDialog } from "./ConfirmationDialogue";
import { useToast } from "../../hooks/useToast";
import { LocalityDetailModal } from "./LocalityDetailModal";

export function LocalitiesManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewingLocality, setViewingLocality] = useState<Locality | null>(null);
  const [editingLocality, setEditingLocality] = useState<Locality | null>(null);
  const [localityToDelete, setLocalityToDelete] = useState<Locality | null>(
    null
  );
  const { success, error: showError } = useToast();
  const { data, isLoading, error } = useGetLocalitiesQuery({
    page,
    limit: 10,
    search,
    cityName: cityFilter,
  });

  const [deleteLocality] = useDeleteLocalityMutation();

  const columns: Column<Locality>[] = useMemo(
    () => [
      {
        key: "name",
        header: "Locality Name",
        sortable: true,
        render: (value: string, locality: Locality) => (
          <button
            onClick={() => setViewingLocality(locality)}
            className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left w-full"
          >
            <MapPinIcon className="w-5 h-5 text-gray-400 mr-3" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                {value}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {locality.city.name}, {locality.city.state}
              </div>
            </div>
          </button>
        ),
      },
      {
        key: "city",
        header: "City",
        sortable: true,
        render: (value: any) => value.name,
      },
      {
        key: "_count",
        header: "Users",
        render: (value: any) => (
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <UsersIcon className="w-4 h-4 mr-1" />
            {value?.users || 0}
          </div>
        ),
      },
      {
        key: "createdAt",
        header: "Created",
        sortable: true,
        render: (value: string) => new Date(value).toLocaleDateString(),
      },
    ],
    []
  );

  const handleEdit = (locality: Locality) => {
    setEditingLocality(locality);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!localityToDelete) return;

    try {
      await deleteLocality(localityToDelete.id).unwrap();
      success("Locality deleted successfully");
      setLocalityToDelete(null);
    } catch (error) {
      showError("Failed to delete locality");
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingLocality(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Localities Management
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Manage localities within cities
              </p>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Locality
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Search Localities
              </label>
              <input
                type="text"
                id="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by locality name..."
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Filter by City
              </label>
              <input
                type="text"
                id="city"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                placeholder="Filter by city name..."
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <DataTable
            columns={columns}
            data={data?.data || []}
            loading={isLoading}
            emptyMessage="No localities found. Try adjusting your search filters."
            rowActions={(locality: Locality) => (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(locality)}
                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setLocalityToDelete(locality)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            )}
          />

          {/* Pagination */}
          {data && data.pagination.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={data.pagination.totalPages}
              totalItems={data.pagination.total}
              itemsPerPage={10}
              onPageChange={setPage}
            />
          )}
        </div>

        {/* Locality Form Modal */}
        {isFormOpen && (
          <LocalityForm
            locality={editingLocality}
            onClose={handleFormClose}
            onSuccess={handleFormClose}
          />
        )}

        {/* Delete Confirmation */}
        <ConfirmationDialog
          isOpen={!!localityToDelete}
          onClose={() => setLocalityToDelete(null)}
          onConfirm={handleDelete}
          title="Delete Locality"
          message={`Are you sure you want to delete "${localityToDelete?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          confirmVariant="danger"
        />
      </div>
      {viewingLocality && (
        <LocalityDetailModal
          locality={viewingLocality}
          isOpen={!!viewingLocality}
          onClose={() => setViewingLocality(null)}
        />
      )}
    </div>
  );
}
