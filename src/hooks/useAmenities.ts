import {
  useSearchAmenitiesQuery,
  useGetAmenityCategoriesQuery,
} from "../services/AmenityApi";
import {
  useCreateAmenityMutation,
  useUpdateAmenityMutation,
  useDeleteAmenityMutation,
  useToggleAmenityStatusMutation,
  useBulkCreateAmenitiesMutation,
} from "../services/AmenityApi";
import type { AmenitySearchFilters } from "../types";

export const useAmenities = (filters: AmenitySearchFilters) => {
  const {
    data: amenitiesData,
    isLoading,
    refetch,
  } = useSearchAmenitiesQuery(filters);

  const { data: categoriesData } = useGetAmenityCategoriesQuery();

  const [createAmenity] = useCreateAmenityMutation();
  const [updateAmenity] = useUpdateAmenityMutation();
  const [deleteAmenity] = useDeleteAmenityMutation();
  const [toggleStatus] = useToggleAmenityStatusMutation();
  const [bulkCreate] = useBulkCreateAmenitiesMutation();

  const amenities = amenitiesData?.data || [];
  const pagination = amenitiesData?.pagination;
  const categories = categoriesData?.data || [];

  const operations = {
    createAmenity,
    updateAmenity,
    deleteAmenity,
    toggleStatus,
    bulkCreate,
  };

  return {
    amenities,
    categories,
    pagination,
    isLoading,
    operations,
    refetch,
  };
};
