// PropertySearchResults.tsx
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
      const decoded = decodeFilters(filterHash);
      if (decoded) {
        dispatch(setFilters(decoded));
      } else {
        navigate("/properties/search", { replace: true });
      }
      setIsInitialized(true);
    } else if (!filterHash && !isInitialized) {
      setIsInitialized(true);
    }
  }, [filterHash, dispatch, navigate, isInitialized]);

  // Sync URL when filters change
  useEffect(() => {
    if (!isInitialized) return;
    const id = setTimeout(() => {
      if (isDefaultFilters(currentFilters)) {
        if (filterHash) navigate("/properties/search", { replace: true });
        return;
      }
      const encoded = encodeFilters(currentFilters);
      if (encoded && encoded !== filterHash)
        navigate(`/properties/search/${encoded}`, { replace: true });
    }, 500);
    return () => clearTimeout(id);
  }, [currentFilters, filterHash, navigate, isInitialized]);

  const { data, isLoading } = useSearchPropertiesQuery(currentFilters, {
    refetchOnMountOrArgChange: true,
    skip: !isInitialized,
  });
  const { data: favouriteData, refetch: refetchFavorites } =
    useGetUserFavoritesQuery(undefined, { skip: !isAuthenticated });
  const [toggleFavorite] = useAddToFavoritesMutation();

  const properties = data?.data || [];
  const totalCount = data?.pagination?.total || 0;
  const currentPage = data?.pagination?.page || 1;
  const totalPages = data?.pagination?.totalPages || 1;

  useEffect(() => {
    if (isAuthenticated && favouriteData?.data)
      setFavPropertiesIds(favouriteData.data);
  }, [favouriteData, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) refetchFavorites();
  }, [isAuthenticated, refetchFavorites]);

  useEffect(() => {
    if (currentFilters.localityId && currentFilters.locality) {
      const ids = Array.isArray(currentFilters.localityId)
        ? currentFilters.localityId
        : currentFilters.localityId.split(",");
      const names = currentFilters.locality ?? [];
      setSelectedLocalities(
        ids
          .map((id, i) => ({ id, name: names[i] || "" }))
          .filter((l) => l.name),
      );
    } else {
      setSelectedLocalities([]);
    }
  }, [currentFilters.localityId, currentFilters.locality]);

  const handleCityChange = (cityId: string, cityName?: string) => {
    dispatch(resetFilters({ cityId, city: cityName ? [cityName] : undefined }));
  };

  const handleLocalityChange = (localityId: string, localityName?: string) => {
    if (localityId && localityName) {
      const updated = [
        ...selectedLocalities,
        { id: localityId, name: localityName },
      ];
      dispatch(
        setFilters({
          ...currentFilters,
          localityId: updated.map((l) => l.id).join(","),
          locality: updated.map((l) => l.name),
          page: 1,
        }),
      );
      setSelectedLocalities(updated);
    } else {
      const f = { ...currentFilters };
      delete f.localityId;
      delete f.locality;
      dispatch(setFilters({ ...f, page: 1 }));
      setSelectedLocalities([]);
    }
  };

  const handleRemoveLocality = (localityId: string) => {
    const updated = selectedLocalities.filter((l) => l.id !== localityId);
    if (updated.length > 0) {
      dispatch(
        setFilters({
          ...currentFilters,
          localityId: updated.map((l) => l.id).join(","),
          locality: updated.map((l) => l.name),
          page: 1,
        }),
      );
    } else {
      const f = { ...currentFilters };
      delete f.localityId;
      delete f.locality;
      dispatch(setFilters({ ...f, page: 1 }));
    }
    setSelectedLocalities(updated);
  };

  const handleToggleFavorite = async (propertyId: string) => {
    if (!isAuthenticated) {
      navigate("/signin");
      return;
    }
    try {
      await toggleFavorite({ propertyId }).unwrap();
      await refetchFavorites();
    } catch (e) {
      console.error("Failed to toggle favourite:", e);
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(setFilters({ ...currentFilters, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
          <p className="text-sm text-blue-600 font-medium">
            Loading properties…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-[114px] sm:pt-[122px] md:pt-[68px]">
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
          const next =
            typeof updater === "function" ? updater(currentFilters) : updater;
          dispatch(setFilters(next));
        }}
        activeDropdown={activeDropdown}
        setActiveDropdown={setActiveDropdown}
      />

      <PropertyList
        filters={currentFilters}
        setFilters={(updater) => {
          const next =
            typeof updater === "function" ? updater(currentFilters) : updater;
          dispatch(setFilters(next));
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
