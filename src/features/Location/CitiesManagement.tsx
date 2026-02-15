/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useMemo } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MapPinIcon,
  UsersIcon,
  HomeIcon,
} from "lucide-react";
import { DataTable, type Column } from "../../components/common/Datatable";
import { Pagination } from "./Pagination";
import { LocationFilter } from "./LocationFilter";
import {
  useGetCitiesQuery,
  useDeleteCityMutation,
} from "../../services/locationApi";
import type { City, CityFilter } from "../../types";
import { CityForm } from "./CityForm";
import { ConfirmationDialog } from "./ConfirmationDialogue";
import { useToast } from "../../hooks/useToast";
import Button from "../../components/ui/button/Button";

export function CitiesManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<CityFilter>({});
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [cityToDelete, setCityToDelete] = useState<City | null>(null);
  const { success, error: showError } = useToast();
  const { data, isLoading, error } = useGetCitiesQuery({
    page,
    limit: 10,
    search,
    ...filters,
  });

  const [deleteCity] = useDeleteCityMutation();

  const columns: Column<City>[] = useMemo(
    () => [
      {
        key: "name",
        header: "City Name",
        sortable: true,
        render: (value: string, city: City) => (
          <div className="flex items-center">
            <MapPinIcon className="w-5 h-5 text-gray-400 mr-3" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {value}
              </div>
              {city.state && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {city.state}, {city.country}
                </div>
              )}
            </div>
          </div>
        ),
      },
      {
        key: "state",
        header: "State",
        sortable: true,
      },
      {
        key: "country",
        header: "Country",
        sortable: true,
      },
      {
        key: "_count",
        header: "Statistics",
        render: (value: any) => (
          <div className="flex space-x-4 text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <HomeIcon className="w-4 h-4 mr-1" />
              {value?.properties || 0}
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <UsersIcon className="w-4 h-4 mr-1" />
              {value?.users || 0}
            </div>
          </div>
        ),
      },
      {
        key: "localities",
        header: "Localities",
        render: (value: any[], city: City) => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {city._count?.localities || 0} localities
          </span>
        ),
      },
      {
        key: "createdAt",
        header: "Created",
        sortable: true,
        render: (value: string) => new Date(value).toLocaleDateString(),
      },
    ],
    [],
  );

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const handleEdit = (city: City) => {
    setEditingCity(city);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!cityToDelete) return;

    try {
      await deleteCity(cityToDelete.id).unwrap();
      success("City deleted successfully");
      setCityToDelete(null);
    } catch (error) {
      showError("Failed to delete city");
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingCity(null);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-full mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <TrashIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                  Error loading cities
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  Failed to load cities data. Please try again.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between gap-3">
            {/* Title */}
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                Cities
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Manage cities and their localities
              </p>
            </div>

            {/* Button */}
            <Button
              onClick={() => setIsFormOpen(true)}
              className="
        flex items-center gap-1.5
        px-3 py-1.5 sm:px-4 sm:py-2
        bg-blue-600 dark:bg-blue-500
        text-white
        text-xs sm:text-sm font-medium
        rounded-md
        hover:bg-blue-700 dark:hover:bg-blue-600
        transition
      "
            >
              <PlusIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Add</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <MapPinIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Cities
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {data.pagination.total}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <HomeIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Properties
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {data.data.reduce(
                      (acc, city) => acc + (city._count?.properties || 0),
                      0,
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <LocationFilter
          search={search}
          onSearchChange={setSearch}
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <DataTable
            columns={columns}
            data={data?.data || []}
            loading={isLoading}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            emptyMessage="No cities found. Try adjusting your search filters."
            rowActions={(city: City) => (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(city)}
                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCityToDelete(city)}
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

        {/* City Form Modal */}
        {isFormOpen && (
          <CityForm
            city={editingCity}
            onClose={handleFormClose}
            onSuccess={handleFormClose}
          />
        )}

        {/* Delete Confirmation */}
        <ConfirmationDialog
          isOpen={!!cityToDelete}
          onClose={() => setCityToDelete(null)}
          onConfirm={handleDelete}
          title="Delete City"
          message={`Are you sure you want to delete "${cityToDelete?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          confirmVariant="danger"
        />
      </div>
    </>
  );
}
