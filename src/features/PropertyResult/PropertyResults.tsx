import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useSearchPropertiesQuery,
  useGetUserFavoritesQuery,
  useAddToFavoritesMutation,
} from "../../services/propertyApi";
import { useAuth } from "../../hooks/useAuth";
import { FilterBar } from "./FilterBar";
import { PropertyList } from "./PropertyList";
import { PublicHeader } from "../../layout/PublicHeader";
import { Footer } from "../../layout/Footer";
import { setFilters, resetFilters } from "../../store/slices/filterSlice";
import {
  encodeFilters,
  decodeFilters,
  isDefaultFilters,
} from "../../utils/filterEncoder";
import type { RootState } from "../../store/store";

export const PropertySearchResults = () => {
  const navigate = useNavigate();
  const { filterHash } = useParams<{ filterHash?: string }>();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();

  // Get filters from Redux
  const currentFilters = useSelector(
    (state: RootState) => state.filters.currentFilters,
  );

  const [selectedLocalities, setSelectedLocalities] = useState<
    Array<{ id: string; name: string }>
  >([]);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [favPropertiesIds, setFavPropertiesIds] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load filters from hash on mount
  useEffect(() => {
    if (filterHash && !isInitialized) {
      const decodedFilters = decodeFilters(filterHash);
      if (decodedFilters) {
        dispatch(setFilters(decodedFilters));
      } else {
        // Invalid hash, redirect to clean URL
        navigate("/properties/search", { replace: true });
      }
      setIsInitialized(true);
    } else if (!filterHash && !isInitialized) {
      setIsInitialized(true);
    }
  }, [filterHash, dispatch, navigate, isInitialized]);

  // Update URL when filters change (debounced)
  useEffect(() => {
    if (!isInitialized) return;

    const timeoutId = setTimeout(() => {
      // If filters are default, use clean URL
      if (isDefaultFilters(currentFilters)) {
        if (filterHash) {
          navigate("/properties/search", { replace: true });
        }
        return;
      }

      // Encode filters and update URL
      const encoded = encodeFilters(currentFilters);
      if (encoded && encoded !== filterHash) {
        navigate(`/properties/search/${encoded}`, { replace: true });
      }
    }, 500); // Debounce 500ms

    return () => clearTimeout(timeoutId);
  }, [currentFilters, filterHash, navigate, isInitialized]);

  // API Queries
  const { data, isLoading } = useSearchPropertiesQuery(currentFilters, {
    refetchOnMountOrArgChange: true,
    skip: !isInitialized,
  });

  const { data: favouriteData, refetch: refetchFavorites } =
    useGetUserFavoritesQuery(undefined, {
      skip: !isAuthenticated,
    });
  const [toggleFavorite] = useAddToFavoritesMutation();

  const properties = data?.data || [];
  const totalCount = data?.pagination?.total || 0;
  const currentPage = data?.pagination?.page || 1;
  const totalPages = data?.pagination?.totalPages || 1;

  // Sync favorites from API
  useEffect(() => {
    if (isAuthenticated && favouriteData?.data) {
      setFavPropertiesIds(favouriteData.data);
    }
  }, [favouriteData, isAuthenticated]);

  // Refetch favorites when authentication status changes
  useEffect(() => {
    if (isAuthenticated) {
      refetchFavorites();
    }
  }, [isAuthenticated, refetchFavorites]);

  // Update localities display
  useEffect(() => {
    if (currentFilters.localityId && currentFilters.locality) {
      const ids = Array.isArray(currentFilters.localityId)
        ? currentFilters.localityId
        : currentFilters.localityId.split(",");
      // const names = Array.isArray(currentFilters.locality)
      //   ? currentFilters.locality
      //   : currentFilters.locality.split(',');
      const names = currentFilters.locality ?? [];

      const localities = ids
        .map((id, index) => ({
          id,
          name: names[index] || "",
        }))
        .filter((loc) => loc.name);

      setSelectedLocalities(localities);
    } else {
      setSelectedLocalities([]);
    }
  }, [currentFilters.localityId, currentFilters.locality]);

  // Handle city change from header
  const handleCityChange = (cityId: string, cityName?: string) => {
    dispatch(
      resetFilters({
        cityId,
        city: cityName ? [cityName] : undefined,
      }),
    );
  };

  const handleLocalityChange = (localityId: string, localityName?: string) => {
    if (localityId && localityName) {
      const newLocality = { id: localityId, name: localityName };
      const updatedLocalities = [...selectedLocalities, newLocality];

      const localityIds = updatedLocalities.map((loc) => loc.id).join(",");
      const localityNames = updatedLocalities.map((loc) => loc.name);

      dispatch(
        setFilters({
          ...currentFilters,
          localityId: localityIds,
          locality: localityNames,
          page: 1,
        }),
      );

      setSelectedLocalities(updatedLocalities);
    } else {
      const newFilters = { ...currentFilters };
      delete newFilters.localityId;
      delete newFilters.locality;

      dispatch(setFilters({ ...newFilters, page: 1 }));
      setSelectedLocalities([]);
    }
  };

  const handleRemoveLocality = (localityId: string) => {
    const updatedLocalities = selectedLocalities.filter(
      (loc) => loc.id !== localityId,
    );

    if (updatedLocalities.length > 0) {
      const localityIds = updatedLocalities.map((loc) => loc.id).join(",");
      const localityNames = updatedLocalities.map((loc) => loc.name);

      dispatch(
        setFilters({
          ...currentFilters,
          localityId: localityIds,
          locality: localityNames,
          page: 1,
        }),
      );
    } else {
      const newFilters = { ...currentFilters };
      delete newFilters.localityId;
      delete newFilters.locality;

      dispatch(setFilters({ ...newFilters, page: 1 }));
    }

    setSelectedLocalities(updatedLocalities);
  };

  const handleToggleFavorite = async (propertyId: string) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      await toggleFavorite({ propertyId }).unwrap();
      await refetchFavorites();
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(setFilters({ ...currentFilters, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader
        selectedCityId={currentFilters.cityId}
        selectedLocalities={selectedLocalities}
        onCityChange={handleCityChange}
        onLocalityChange={handleLocalityChange}
        onRemoveLocality={handleRemoveLocality}
        displaySearchBar={true}
      />

      <FilterBar
        filters={currentFilters}
        setFilters={(updater) => {
          const newFilters =
            typeof updater === "function" ? updater(currentFilters) : updater;
          dispatch(setFilters(newFilters));
        }}
        activeDropdown={activeDropdown}
        setActiveDropdown={setActiveDropdown}
      />

      <PropertyList
        filters={currentFilters}
        setFilters={(updater) => {
          const newFilters =
            typeof updater === "function" ? updater(currentFilters) : updater;
          dispatch(setFilters(newFilters));
        }}
        properties={properties}
        isLoading={isLoading}
        totalCount={totalCount}
        currentPage={currentPage}
        totalPages={totalPages}
        searchInput={""}
        favPropertiesIds={favPropertiesIds}
        onToggleFavorite={handleToggleFavorite}
        onPageChange={handlePageChange}
      />
      <Footer />
    </div>
  );
};
