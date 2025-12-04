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

export const PropertySearchResults = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Function to update URL parameters
  const updateUrlParams = (newFilters: PropertySearchFilters) => {
    const params = new URLSearchParams();

    // Add all filters to URL params
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            if (key === "listingSource" && Array.isArray(value)) {
              params.set(key, value.join(","));
            } else {
              params.set(key, value.join(","));
            }
          }
        } else if (typeof value === "boolean") {
          params.set(key, value.toString());
        } else if (key === "page" && value === 1) {
          // Don't include page=1 to keep URLs clean
          // params.set(key, String(value));
        } else {
          params.set(key, String(value));
        }
      }
    });

    // Remove empty params
    Array.from(params.keys()).forEach((key) => {
      if (!params.get(key)) {
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
    if (params.get("localityId"))
      filters.localityId = params.get("localityId")!;

    // Parse locality from search query or specific locality parameter
    if (params.get("locality")) {
      filters.locality = params.get("locality")!.split(",");
    } else if (params.get("search")?.toLowerCase().includes("locality")) {
      const searchText = params.get("search")!;
      filters.locality = [searchText.replace(/\blocality\b/gi, "").trim()];
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
        // Multiple values (comma-separated)
        filters.listingSource = listingSourceParam.split(",") as Array<
          "AGENT" | "BUILDER" | "OWNER"
        >;
      } else {
        // Single value
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
    if (localityId) {
      const newParams = new URLSearchParams(searchParams);

      // Set locality parameters
      newParams.set("localityId", localityId);

      if (localityName) {
        newParams.set("search", localityName);
        newParams.set("locality", localityName);
      }
      newParams.delete("page");

      // Update filters
      setFilters((prev) => ({
        ...prev,
        localityId,
        search: localityName,
        page: 1,
      }));

      // Update URL immediately
      navigate(`?${newParams.toString()}`, { replace: true });
    } else {
      // Clear locality
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("localityId");
      newParams.delete("locality");
      newParams.delete("page");

      // Update filters
      setFilters((prev) => {
        const newFilters = { ...prev };
        delete newFilters.localityId;
        delete newFilters.locality;
        return { ...newFilters, page: 1 };
      });

      // Update URL immediately
      navigate(`?${newParams.toString()}`, { replace: true });
    }
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
        selectedLocalityId={filters.localityId}
        onCityChange={handleCityChange}
        onLocalityChange={handleLocalityChange}
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
    </div>
  );
};
