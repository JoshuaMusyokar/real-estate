/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import {
  useSearchPropertiesQuery,
  useGetUserFavoritesQuery,
  useAddToFavoritesMutation,
} from "../../services/propertyApi";
import { useAuth } from "../../hooks/useAuth";
import type { PropertySearchFilters } from "../../types";
import { FilterBar } from "./FilterBar";
import { PropertyList } from "./PropertyList";
import { PublicHeader } from "../../layout/PublicHeader";
import { Footer } from "../../layout/Footer";

export const PropertySearchResults = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [selectedLocalities, setSelectedLocalities] = useState<
    Array<{ id: string; name: string }>
  >([]);

  // Function to update URL parameters
  const updateUrlParams = (newFilters: PropertySearchFilters) => {
    const params = new URLSearchParams();

    // Add all filters to URL params
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            // Special handling for locality and localityId to preserve multiple values
            if (key === "locality" || key === "localityId") {
              // Don't join with comma - add each value separately using append
              value.forEach((v) => {
                params.append(key, String(v));
              });
            } else {
              // For other arrays, join with comma
              params.set(key, value.join(","));
            }
          }
        } else if (typeof value === "boolean") {
          params.set(key, value.toString());
        } else if (key === "page" && value === 1) {
          // Don't include page=1 to keep URLs clean
        } else {
          params.set(key, String(value));
        }
      }
    });

    // Remove empty params
    Array.from(params.keys()).forEach((key) => {
      const values = params.getAll(key);
      if (values.length === 0 || (values.length === 1 && !values[0])) {
        params.delete(key);
      }
    });

    // Update URL without page reload
    navigate(`?${params.toString()}`, { replace: true });
  };

  // Function to parse query parameters
  const parseQueryParams = (params: URLSearchParams): PropertySearchFilters => {
    const filters: PropertySearchFilters = {
      page: Number(params.get("page")) || 1,
      limit: Number(params.get("limit")) || 20,
      status: "AVAILABLE",
      sortBy: params.get("sortBy") || "createdAt",
      sortOrder: (params.get("sortOrder") as "asc" | "desc") || "desc",
    };

    // Parse search parameters
    if (params.get("search")) filters.search = params.get("search")!;
    if (params.get("city")) filters.city = [params.get("city")!];
    if (params.get("cityId")) filters.cityId = params.get("cityId")!;

    // Parse multiple localityIds using getAll()
    const localityIds = params.getAll("localityId");
    if (localityIds.length > 0) {
      filters.localityId =
        localityIds.length === 1 ? localityIds[0] : localityIds.join(",");
    }

    // Parse multiple localities using getAll()
    const localities = params.getAll("locality");
    if (localities.length > 0) {
      filters.locality = localities;
    }

    // Parse other filter parameters
    if (params.get("propertyType")) {
      filters.propertyType = params.get("propertyType") as any;
    }
    if (params.get("subType")) {
      filters.subType = params.get("subType") as any;
    }
    if (params.get("possessionStatus")) {
      filters.possessionStatus = params.get("possessionStatus")!;
    }
    if (params.get("minPrice")) {
      filters.minPrice = Number(params.get("minPrice"));
    }
    if (params.get("maxPrice")) {
      filters.maxPrice = Number(params.get("maxPrice"));
    }
    if (params.get("bedrooms")) {
      filters.bedrooms = params.get("bedrooms")!.split(",").map(Number);
    }
    if (params.get("bathrooms")) {
      filters.bathrooms = params.get("bathrooms")!.split(",").map(Number);
    }
    if (params.get("minSquareFeet")) {
      filters.minSquareFeet = Number(params.get("minSquareFeet"));
    }
    if (params.get("maxSquareFeet")) {
      filters.maxSquareFeet = Number(params.get("maxSquareFeet"));
    }
    if (params.get("amenities")) {
      filters.amenities = params.get("amenities")!.split(",");
    }
    if (params.get("featured")) {
      filters.featured = params.get("featured") === "true";
    }
    if (params.get("hasBalcony")) {
      filters.hasBalcony = params.get("hasBalcony") === "true";
    }
    if (params.get("verified")) {
      filters.verified = params.get("verified") === "true";
    }
    if (params.get("listingSource")) {
      const listingSourceParam = params.get("listingSource")!;
      if (listingSourceParam.includes(",")) {
        filters.listingSource = listingSourceParam.split(",") as Array<
          "AGENT" | "BUILDER" | "OWNER"
        >;
      } else {
        filters.listingSource = [
          listingSourceParam as "AGENT" | "BUILDER" | "OWNER",
        ];
      }
    }

    return filters;
  };

  // Initialize filters from URL params
  const [filters, setFilters] = useState<PropertySearchFilters>(() => {
    return parseQueryParams(searchParams);
  });

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  );
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [favPropertiesIds, setFavPropertiesIds] = useState<string[]>([]);

  // API Queries
  const { data, isLoading, refetch } = useSearchPropertiesQuery(filters, {
    refetchOnMountOrArgChange: true,
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
  useEffect(() => {
    console.log("recieved search params", searchParams.toString());
  }, []);

  useEffect(() => {
    const localityIds = searchParams.get("localityId")?.split(",") || [];
    const localityNames = searchParams.get("locality")?.split(",") || [];
    // const localityNames = searchParams.get("locality")?.split(",") || [];

    console.log("locs ids", localityIds);
    console.log("locs name", localityNames);
    if (localityIds.length > 0 && localityNames.length > 0) {
      const localities = localityIds
        .map((id, index) => ({
          id,
          name: localityNames[index] || "",
        }))
        .filter((loc) => loc.name); // Filter out empty names
      console.log("locss", localities);

      setSelectedLocalities(localities);
    } else {
      setSelectedLocalities([]);
    }
  }, [searchParams]);

  // Update URL when filters change
  useEffect(() => {
    updateUrlParams(filters);
  }, [filters]);

  // Refetch properties when filters change
  useEffect(() => {
    refetch();
  }, [filters, refetch]);

  // Handle city change from header
  const handleCityChange = (cityId: string, cityName?: string) => {
    const newParams = new URLSearchParams(searchParams);

    // Update URL query params
    newParams.set("cityId", cityId);
    if (cityName) newParams.set("city", cityName);
    newParams.delete("localityId");
    newParams.delete("locality");
    newParams.delete("page");

    // Update local filter state
    setFilters((prev) => ({
      ...prev,
      cityId,
      city: cityName ? [cityName] : undefined,
      localityId: undefined,
      locality: undefined,
      page: 1,
    }));

    navigate(`?${newParams.toString()}`, { replace: true });
  };

  const handleLocalityChange = (localityId: string, localityName?: string) => {
    if (localityId && localityName) {
      // Add locality to selection
      const newLocality = { id: localityId, name: localityName };
      const updatedLocalities = [...selectedLocalities, newLocality];

      const newParams = new URLSearchParams(searchParams);

      // Set multiple localities
      const localityIds = updatedLocalities.map((loc) => loc.id).join(",");
      const localityNames = updatedLocalities.map((loc) => loc.name).join(",");

      newParams.set("localityId", localityIds);
      newParams.set("locality", localityNames);
      newParams.delete("page");

      // Update filters with array
      setFilters((prev) => ({
        ...prev,
        localityId: localityIds,
        locality: updatedLocalities.map((loc) => loc.name),
        page: 1,
      }));

      setSelectedLocalities(updatedLocalities);
      navigate(`?${newParams.toString()}`, { replace: true });
    } else {
      // Clear all localities
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("localityId");
      newParams.delete("locality");
      newParams.delete("page");

      setFilters((prev) => {
        const newFilters = { ...prev };
        delete newFilters.localityId;
        delete newFilters.locality;
        return { ...newFilters, page: 1 };
      });

      setSelectedLocalities([]);
      navigate(`?${newParams.toString()}`, { replace: true });
    }
  };

  const handleRemoveLocality = (localityId: string) => {
    const updatedLocalities = selectedLocalities.filter(
      (loc) => loc.id !== localityId
    );

    const newParams = new URLSearchParams(searchParams);

    if (updatedLocalities.length > 0) {
      const localityIds = updatedLocalities.map((loc) => loc.id).join(",");
      const localityNames = updatedLocalities.map((loc) => loc.name).join(",");

      newParams.set("localityId", localityIds);
      newParams.set("locality", localityNames);

      setFilters((prev) => ({
        ...prev,
        localityId: localityIds,
        locality: updatedLocalities.map((loc) => loc.name),
        page: 1,
      }));
    } else {
      newParams.delete("localityId");
      newParams.delete("locality");

      setFilters((prev) => {
        const newFilters = { ...prev };
        delete newFilters.localityId;
        delete newFilters.locality;
        return { ...newFilters, page: 1 };
      });
    }

    newParams.delete("page");
    setSelectedLocalities(updatedLocalities);
    navigate(`?${newParams.toString()}`, { replace: true });
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
    const newParams = new URLSearchParams(searchParams);
    if (page === 1) {
      newParams.delete("page");
    } else {
      newParams.set("page", page.toString());
    }

    setFilters((prev) => ({ ...prev, page }));
    navigate(`?${newParams.toString()}`, { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle URL changes (back/forward navigation)
  useEffect(() => {
    // Parse new filters when URL changes
    const newFilters = parseQueryParams(searchParams);
    setFilters(newFilters);
  }, [location.search]); // Listen to URL changes

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader
        selectedCityId={filters.cityId}
        selectedLocalities={selectedLocalities}
        onCityChange={handleCityChange}
        onLocalityChange={handleLocalityChange}
        onRemoveLocality={handleRemoveLocality}
        displaySearchBar={true}
      />

      <FilterBar
        filters={filters}
        setFilters={setFilters}
        activeDropdown={activeDropdown}
        setActiveDropdown={setActiveDropdown}
      />

      <PropertyList
        filters={filters}
        setFilters={setFilters}
        properties={properties}
        isLoading={isLoading}
        totalCount={totalCount}
        currentPage={currentPage}
        totalPages={totalPages}
        searchInput={searchInput}
        favPropertiesIds={favPropertiesIds}
        onToggleFavorite={handleToggleFavorite}
        onPageChange={handlePageChange}
      />
      <Footer />
    </div>
  );
};
