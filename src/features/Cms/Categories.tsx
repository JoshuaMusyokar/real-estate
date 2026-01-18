import React, { useState } from "react";

import { Plus, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import type { ContentCategory } from "../../types";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllCategoriesQuery,
  useToggleCategoryStatusMutation,
  useUpdateCategoryMutation,
} from "../../services/cmsApi";
import Button from "../../components/ui/button/Button";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import Input from "../../components/form/input/InputField";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Modal } from "../../components/ui/modal";

export const Categories: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<ContentCategory | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  // API hooks
  const {
    data: categoriesResponse,
    isLoading,
    refetch,
  } = useGetAllCategoriesQuery({ activeOnly: false });
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();
  const [toggleCategoryStatus, { isLoading: isToggling }] =
    useToggleCategoryStatusMutation();

  const categories = categoriesResponse?.data || [];

  const handleCreateCategory = async () => {
    try {
      await createCategory(newCategory).unwrap();
      setIsCreateModalOpen(false);
      setNewCategory({ name: "", description: "", isActive: true });
      refetch();
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  const handleUpdateCategory = async () => {
    if (!selectedCategory) return;

    try {
      await updateCategory({
        id: selectedCategory.id,
        data: {
          name: selectedCategory.name,
          description: selectedCategory.description,
          isActive: selectedCategory.isActive,
        },
      }).unwrap();
      setIsEditModalOpen(false);
      setSelectedCategory(null);
      refetch();
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      await deleteCategory(id).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const handleToggleStatus = async (category: ContentCategory) => {
    try {
      await toggleCategoryStatus(category.id).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to toggle category status:", error);
    }
  };

  const formatDate = (dateString: Date): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Content Categories
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Organize your content into categories
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="primary"
              onClick={() => setIsCreateModalOpen(true)}
              endIcon={<Plus className="h-4 w-4" />}
              disabled={isCreating}
            >
              New Category
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1 max-w-md">
                <Input
                  type="search"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  //   icon={<Search className="h-4 w-4" />}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No categories found
                </p>
                {categories.length === 0 ? (
                  <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="mt-4"
                    disabled={isCreating}
                  >
                    Create Your First Category
                  </Button>
                ) : (
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                    Try a different search term
                  </p>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Contents</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {category.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                          {category.description || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {category.isActive ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            <XCircle className="h-3 w-3 mr-1" />
                            Inactive
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {0}
                          {/* {category.contents?.length || 0} */}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-500 dark:text-gray-400">
                        {formatDate(category.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleStatus(category)}
                            aria-label={
                              category.isActive
                                ? "Deactivate category"
                                : "Activate category"
                            }
                            disabled={isToggling}
                          >
                            {category.isActive ? (
                              <XCircle className="h-4 w-4 text-gray-400" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => {
                              setSelectedCategory(category);
                              setIsEditModalOpen(true);
                            }}
                            aria-label="Edit category"
                          >
                            <Edit className="h-4 w-4 text-gray-400" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteCategory(category.id)}
                            aria-label="Delete category"
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Create Category Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          showCloseButton={true}
          //   title="Create New Category"
          //   size="md"
          className="max-w-[700px] m-4"
        >
          <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category Name *
              </label>
              <Input
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                placeholder="Enter category name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    description: e.target.value,
                  })
                }
                placeholder="Enter category description"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={newCategory.isActive}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, isActive: e.target.checked })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
                id="category-active"
              />
              <label
                htmlFor="category-active"
                className="ml-2 text-sm text-gray-700 dark:text-gray-300"
              >
                Active
              </label>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateCategory}
                disabled={!newCategory.name.trim() || isCreating}
                // lo={isCreating}
              >
                Create Category
              </Button>
            </div>
          </div>
        </Modal>

        {/* Edit Category Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedCategory(null);
          }}
          //   title="Edit Category"
          //   size="md"
          className="max-w-[700px] m-4"
        >
          {selectedCategory && (
            <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category Name *
                </label>
                <Input
                  value={selectedCategory.name}
                  onChange={(e) =>
                    setSelectedCategory({
                      ...selectedCategory,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={selectedCategory.description || ""}
                  onChange={(e) =>
                    setSelectedCategory({
                      ...selectedCategory,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter category description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedCategory.isActive}
                  onChange={(e) =>
                    setSelectedCategory({
                      ...selectedCategory,
                      isActive: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
                  id="edit-category-active"
                />
                <label
                  htmlFor="edit-category-active"
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  Active
                </label>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedCategory(null);
                  }}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateCategory}
                  disabled={!selectedCategory.name.trim() || isUpdating}
                  //   loading={isUpdating}
                >
                  Update Category
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
};
