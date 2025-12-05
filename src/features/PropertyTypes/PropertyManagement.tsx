import React, { useState } from "react";
import {
  useGetPropertyTypesQuery,
  useDeletePropertyTypeMutation,
  useGetPropertySubTypesQuery,
  useDeletePropertySubTypeMutation,
} from "../../services/propertyApi";
import type { PropertyType, PropertySubType } from "../../types";

import {
  Edit,
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
} from "lucide-react";

import PropertyTypeModal from "./components/PropertyTypeModal";
import PropertySubTypeModal from "./components/PropertySubTypeModal";
import ConfirmDialog from "../../components/ui/ConfirmDialogue";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { useToast } from "../../hooks/useToast";

const PropertyTypesManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"types" | "subtypes">("types");
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showSubTypeModal, setShowSubTypeModal] = useState(false);
  const [editingType, setEditingType] = useState<PropertyType | null>(null);
  const [editingSubType, setEditingSubType] = useState<PropertySubType | null>(
    null
  );
  const [typeToDelete, setTypeToDelete] = useState<string | null>(null);
  const [subTypeToDelete, setSubTypeToDelete] = useState<string | null>(null);
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set());
  const { success, error: showError } = useToast();

  // Fetch data
  const {
    data: propertyTypesData,
    isLoading: loadingTypes,
    refetch: refetchTypes,
  } = useGetPropertyTypesQuery({ includeSubTypes: true });

  const {
    data: propertySubTypesData,
    isLoading: loadingSubTypes,
    refetch: refetchSubTypes,
  } = useGetPropertySubTypesQuery({});

  const [deletePropertyType] = useDeletePropertyTypeMutation();
  const [deletePropertySubType] = useDeletePropertySubTypeMutation();

  const propertyTypes = propertyTypesData?.data || [];
  const propertySubTypes = propertySubTypesData?.data || [];

  // Filter types based on search
  const filteredTypes = propertyTypes.filter(
    (type) =>
      type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter subtypes based on search
  const filteredSubTypes = propertySubTypes.filter(
    (subType) =>
      subType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subType.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      propertyTypes
        .find((t) => t.id === subType.propertyTypeId)
        ?.name.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleEditType = (type: PropertyType) => {
    setEditingType(type);
    setShowTypeModal(true);
  };

  const handleEditSubType = (subType: PropertySubType) => {
    setEditingSubType(subType);
    setShowSubTypeModal(true);
  };

  const handleDeleteType = async () => {
    if (!typeToDelete) return;

    try {
      await deletePropertyType(typeToDelete).unwrap();
      success("Property type deleted successfully");
      refetchTypes();
      setTypeToDelete(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        showError(error.message || "Failed to delete property type");
      } else {
        showError("Failed to create property type");
      }
    }
  };

  const handleDeleteSubType = async () => {
    if (!subTypeToDelete) return;

    try {
      await deletePropertySubType(subTypeToDelete).unwrap();
      success("Property subtype deleted successfully");
      refetchSubTypes();
      setSubTypeToDelete(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        showError(error.message || "Failed to delete property subtype");
      } else {
        showError("Failed to create property subtype");
      }
    }
  };

  const toggleTypeExpansion = (typeId: string) => {
    const newExpanded = new Set(expandedTypes);
    if (newExpanded.has(typeId)) {
      newExpanded.delete(typeId);
    } else {
      newExpanded.add(typeId);
    }
    setExpandedTypes(newExpanded);
  };

  if (loadingTypes && activeTab === "types") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (loadingSubTypes && activeTab === "subtypes") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-full mx-auto px-2 sm:px-2 lg:px-3">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Property Types & Subtypes
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Manage property categories and their subtypes
          </p>
        </div>

        {/* Tabs and Actions */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("types")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "types"
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              Property Types
            </button>
            <button
              onClick={() => setActiveTab("subtypes")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "subtypes"
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              Property Subtypes
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search ${activeTab}...`}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Create Button */}
            <button
              onClick={() => {
                if (activeTab === "types") {
                  setEditingType(null);
                  setShowTypeModal(true);
                } else {
                  setEditingSubType(null);
                  setShowSubTypeModal(true);
                }
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create {activeTab === "types" ? "Type" : "SubType"}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          {activeTab === "types" ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Type Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredTypes.map((type) => (
                    <React.Fragment key={type.id}>
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <button
                              onClick={() => toggleTypeExpansion(type.id)}
                              className="mr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              {expandedTypes.has(type.id) ? (
                                <ChevronUp className="h-5 w-5" />
                              ) : (
                                <ChevronDown className="h-5 w-5" />
                              )}
                            </button>
                            <div>
                              <div className="flex items-center space-x-3">
                                {type.icon && (
                                  <span className="text-xl">{type.icon}</span>
                                )}
                                <div>
                                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                    {type.name}
                                  </h3>
                                  {type.description && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      {type.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="mt-1">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                  {type.subTypes?.length || 0} subtypes
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            {type.order}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              type.isActive
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}
                          >
                            {type.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(type.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleEditType(type)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                              title="Edit"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => setTypeToDelete(type.id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedTypes.has(type.id) &&
                        type.subTypes &&
                        type.subTypes.length > 0 && (
                          <tr className="bg-gray-50 dark:bg-gray-900">
                            <td colSpan={5} className="px-6 py-4">
                              <div className="pl-12">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Subtypes
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                  {type.subTypes.map((subType) => (
                                    <div
                                      key={subType.id}
                                      className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
                                    >
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <h5 className="font-medium text-gray-900 dark:text-white">
                                            {subType.name}
                                          </h5>
                                          {subType.description && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                              {subType.description}
                                            </p>
                                          )}
                                        </div>
                                        <span
                                          className={`text-xs px-2 py-1 rounded-full ${
                                            subType.isActive
                                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                          }`}
                                        >
                                          {subType.isActive
                                            ? "Active"
                                            : "Inactive"}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
              {filteredTypes.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 dark:text-gray-500">
                    <Filter className="h-12 w-12 mx-auto mb-4" />
                    <p className="text-lg font-medium">
                      No property types found
                    </p>
                    <p className="text-sm mt-1">
                      {searchTerm
                        ? "Try adjusting your search"
                        : "Create your first property type"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      SubType Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Property Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredSubTypes.map((subType) => (
                    <tr
                      key={subType.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {subType.icon && (
                            <span className="text-xl">{subType.icon}</span>
                          )}
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                              {subType.name}
                            </h3>
                            {subType.description && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {subType.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {propertyTypes.find(
                          (t) => t.id === subType.propertyTypeId
                        ) ? (
                          <div className="flex items-center space-x-2">
                            {propertyTypes.find(
                              (t) => t.id === subType.propertyTypeId
                            )?.icon && (
                              <span className="text-lg">
                                {
                                  propertyTypes.find(
                                    (t) => t.id === subType.propertyTypeId
                                  )?.icon
                                }
                              </span>
                            )}
                            <span className="text-sm text-gray-900 dark:text-white">
                              {
                                propertyTypes.find(
                                  (t) => t.id === subType.propertyTypeId
                                )?.name
                              }
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                            Unknown Type
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            subType.isActive
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                        >
                          {subType.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(subType.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleEditSubType(subType)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setSubTypeToDelete(subType.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredSubTypes.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 dark:text-gray-500">
                    <Filter className="h-12 w-12 mx-auto mb-4" />
                    <p className="text-lg font-medium">
                      No property subtypes found
                    </p>
                    <p className="text-sm mt-1">
                      {searchTerm
                        ? "Try adjusting your search"
                        : "Create your first property subtype"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Plus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Total Property Types
                </h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {propertyTypes.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <Plus className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Total SubTypes
                </h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {propertySubTypes.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Active Types
                </h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {propertyTypes.filter((t) => t.isActive).length}
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    / {propertyTypes.length}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <PropertyTypeModal
          isOpen={showTypeModal}
          onClose={() => {
            setShowTypeModal(false);
            setEditingType(null);
          }}
          propertyType={editingType}
          onSuccess={() => {
            refetchTypes();
            setShowTypeModal(false);
            setEditingType(null);
          }}
        />

        <PropertySubTypeModal
          isOpen={showSubTypeModal}
          onClose={() => {
            setShowSubTypeModal(false);
            setEditingSubType(null);
          }}
          propertySubType={editingSubType}
          onSuccess={() => {
            refetchTypes();
            refetchSubTypes();
            setShowSubTypeModal(false);
            setEditingSubType(null);
          }}
        />

        {/* Confirm Dialogs */}
        <ConfirmDialog
          isOpen={!!typeToDelete}
          onClose={() => setTypeToDelete(null)}
          onConfirm={handleDeleteType}
          title="Delete Property Type"
          message="Are you sure you want to delete this property type? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
        />

        <ConfirmDialog
          isOpen={!!subTypeToDelete}
          onClose={() => setSubTypeToDelete(null)}
          onConfirm={handleDeleteSubType}
          title="Delete Property SubType"
          message="Are you sure you want to delete this property subtype? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </div>
  );
};

export default PropertyTypesManagement;
