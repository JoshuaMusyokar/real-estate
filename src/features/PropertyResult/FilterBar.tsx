/* eslint-disable @typescript-eslint/no-unused-vars */
// components/FilterBar.tsx
import React, { useEffect, useRef } from "react";
import {
  Home,
  Building2,
  Warehouse,
  Check,
  ChevronDown,
  ChevronUp,
  Maximize,
  Package,
  User,
  Store,
  Factory,
  Building,
  MapPin,
} from "lucide-react";
import type {
  PropertySearchFilters,
  PropertyType,
  PropertyPurpose,
} from "../../types";
import { useGetPropertyTypesQuery } from "../../services/propertyApi";
import { getIconForPropertyType, getIconForSubType } from "../../utils";

interface FilterBarProps {
  filters: PropertySearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<PropertySearchFilters>>;
  activeDropdown: string | null;
  setActiveDropdown: (id: string | null) => void;
}

// --- Inline Dropdown Component (Fixed positioning) ---
const Dropdown = ({
  label,
  children,
  id,
  count = 0,
  activeDropdown,
  setActiveDropdown,
}: {
  label: string;
  children: React.ReactNode;
  id: string;
  count?: number;
  activeDropdown: string | null;
  setActiveDropdown: (id: string | null) => void;
}) => {
  const isOpen = activeDropdown === id;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setActiveDropdown]);

  useEffect(() => {
    if (isOpen && buttonRef.current && menuRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = Math.min(400, viewportHeight - 100);

      menuRef.current.style.top = `${buttonRect.bottom + 8}px`;
      menuRef.current.style.left = `${buttonRect.left}px`;
      menuRef.current.style.width = `${buttonRect.width}px`;
      menuRef.current.style.minWidth = "240px";

      const spaceBelow = viewportHeight - buttonRect.bottom - 8;
      if (spaceBelow < dropdownHeight) {
        menuRef.current.style.top = `${buttonRect.top - dropdownHeight - 8}px`;
      }
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setActiveDropdown(isOpen ? null : id);
        }}
        className={`flex items-center gap-1 px-3 py-2 border rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap 
          ${
            count > 0 || isOpen
              ? "border-purple-600 bg-purple-50 text-purple-700 shadow-sm"
              : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
          }`}
      >
        <span>{label}</span>
        {count > 0 && (
          <span className="bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
            {count}
          </span>
        )}
        {isOpen ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="fixed bg-white border border-gray-200 rounded-lg shadow-2xl max-h-[400px] overflow-y-auto z-[100]"
          style={{
            top: "auto",
            left: "auto",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  activeDropdown,
  setActiveDropdown,
}) => {
  const { data: propertyTypesData, isLoading: loading } =
    useGetPropertyTypesQuery({
      isActive: true,
      includeSubTypes: true,
    });

  const propertyTypes = propertyTypesData?.data || [];
  //TODO: REMOVE Property Types
  // const propertyTypes: Array<{
  //   value: string;
  //   label: string;
  //   icon: React.ComponentType<{ className?: string }>;
  // }> = [
  //   { value: "RESIDENTIAL", label: "Residential", icon: Home },
  //   { value: "COMMERCIAL", label: "Commercial", icon: Building2 },
  //   { value: "INDUSTRIAL", label: "Industrial", icon: Warehouse },
  // ];

  const currentPropertyType = propertyTypes.find(
    (pt) => pt.id === filters.propertyType || pt.name === filters.propertyType,
  );

  // Get subtypes for current property type
  const availableSubTypes =
    currentPropertyType?.subTypes?.filter((st) => st.isActive) || [];

  // Determine if commercial/residential
  const isCommercial = currentPropertyType?.name === "COMMERCIAL";
  const isResidential =
    !filters.propertyType || currentPropertyType?.name === "RESIDENTIAL";

  // Residential specific
  const bhkOptions = [1, 2, 3, 4, 5, 6];

  const commercialPriceRanges = [
    { label: "₹0 - ₹25 L", min: 1, max: 2500000 },
    { label: "₹25 L - ₹50 L", min: 2500000, max: 5000000 },
    { label: "₹50 L - ₹1 Cr", min: 5000000, max: 10000000 },
    { label: "₹1 Cr - ₹5 Cr", min: 10000000, max: 50000000 },
    { label: "₹5 Cr - ₹10 Cr", min: 50000000, max: 100000000 },
    { label: "₹10 Cr+", min: 100000000, max: undefined },
  ];

  const listingSources: Array<{
    value: "AGENT" | "BUILDER" | "OWNER";
    label: string;
  }> = [
    { value: "AGENT", label: "Agent" },
    { value: "BUILDER", label: "Builder" },
    { value: "OWNER", label: "Owner" },
  ];

  const residentialPriceRanges = [
    { label: "₹0 - ₹50 L", min: 1, max: 5000000 },
    { label: "₹50 L - ₹1 Cr", min: 5000000, max: 10000000 },
    { label: "₹1 Cr - ₹2 Cr", min: 10000000, max: 20000000 },
    { label: "₹2 Cr - ₹5 Cr", min: 20000000, max: 50000000 },
    { label: "₹5 Cr+", min: 50000000, max: undefined },
  ];

  const constructionStatuses = ["READY_TO_MOVE", "UNDER_CONSTRUCTION"];

  const saleTypes: Array<{ value: PropertyPurpose; label: string }> = [
    { value: "SALE", label: "For Sale" },
    { value: "RENT", label: "For Rent" },
  ];

  const furnishingStatuses = [
    { value: "FURNISHED", label: "Furnished" },
    { value: "SEMI_FURNISHED", label: "Semi-Furnished" },
    { value: "UNFURNISHED", label: "Unfurnished" },
  ];

  const facingDirections = [
    { value: "NORTH", label: "North" },
    { value: "SOUTH", label: "South" },
    { value: "EAST", label: "East" },
    { value: "WEST", label: "West" },
    { value: "NORTH_EAST", label: "North-East" },
    { value: "NORTH_WEST", label: "North-West" },
    { value: "SOUTH_EAST", label: "South-East" },
    { value: "SOUTH_WEST", label: "South-West" },
  ];

  // Helper to count active filters
  const getActiveFilterCount = () => {
    let count = 0;

    if (filters.propertyType) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.possessionStatus) count++;
    if (filters.verified) count++;
    if (filters.purpose) count++;
    if (filters.listingSource) count++;

    // Residential specific
    if (isResidential) {
      if (filters.bedrooms && filters.bedrooms.length > 0) count++;
      if (filters.hasBalcony) count++;
    }

    // Commercial specific
    if (isCommercial) {
      if (filters.subType) count++;
      if (filters.furnishingStatus) count++;
      if (filters.facingDirection) count++;
    }

    return count;
  };

  const totalActiveFilters = getActiveFilterCount();

  // Handle filter changes
  const handleFilterChange = (
    key: keyof PropertySearchFilters,
    value: any,
    closeDropdown = true,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    if (closeDropdown) setActiveDropdown(null);
  };

  const handleFilterToggle = (
    key: keyof PropertySearchFilters,
    value: any,
    closeDropdown = true,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]:
        prev[key as keyof PropertySearchFilters] === value ? undefined : value,
    }));
    if (closeDropdown) setActiveDropdown(null);
  };

  const handleMultiSelectChange = (key: "bedrooms", value: number) => {
    setFilters((prev) => {
      const current: number[] = prev[key] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return {
        ...prev,
        [key]: updated.length ? updated : undefined,
      };
    });
  };

  // Reset filters when property type changes
  // useEffect(() => {
  //   if (filters.propertyType) {
  //     setFilters((prev) => {
  //       const baseFilters = {
  //         propertyType: prev.propertyType,
  //         status: prev.status,
  //         sortBy: prev.sortBy,
  //         sortOrder: prev.sortOrder,
  //         cityId: prev.cityId,
  //         city: prev.city,
  //         locality: prev.locality,
  //         localityId: prev.localityId,
  //       };
  //       return baseFilters as PropertySearchFilters;
  //     });
  //   }
  // }, [filters.propertyType]);

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeDropdown) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [activeDropdown, setActiveDropdown]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleContainerClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        activeDropdown
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("click", handleContainerClick);
    return () => {
      document.removeEventListener("click", handleContainerClick);
    };
  }, [activeDropdown, setActiveDropdown]);
  if (loading) {
    return (
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm pt-20">
        <div className="max-w-full mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="animate-pulse bg-gray-200 h-10 w-32 rounded-full"></div>
            <div className="animate-pulse bg-gray-200 h-10 w-24 rounded-full"></div>
            <div className="animate-pulse bg-gray-200 h-10 w-28 rounded-full"></div>
            <div className="animate-pulse bg-gray-200 h-10 w-28 rounded-full"></div>
            <div className="animate-pulse bg-gray-200 h-10 w-28 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm pt-20"
    >
      <div className="max-w-full mx-auto px-4 py-3">
        <div
          className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {/* 1. Property Type Filter */}
          <Dropdown
            label="Property Type"
            id="property-type"
            count={filters.propertyType ? 1 : 0}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
          >
            <div className="p-3 space-y-1">
              {propertyTypes.map((type) => {
                const IconComponent = getIconForPropertyType(type.name);
                const isActive =
                  filters.propertyType === type.id ||
                  filters.propertyType === type.name;

                return (
                  <button
                    key={type.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFilterToggle("propertyType", type.id);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm text-left ${
                      isActive
                        ? "bg-purple-50 text-purple-600 font-semibold"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>
                      {type.name.charAt(0) +
                        type.name.slice(1).toLowerCase().replace("_", " ")}
                    </span>
                    {isActive && (
                      <Check className="w-4 h-4 ml-auto text-purple-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </Dropdown>

          {/* RESIDENTIAL FILTERS */}
          {isResidential && (
            <>
              {/* residential Sub Type */}
              <Dropdown
                label="Property Sub Type"
                id="commercial-subtype"
                count={filters.subType ? 1 : 0}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
              >
                <div className="p-3 space-y-1">
                  {availableSubTypes.length > 0 ? (
                    availableSubTypes.map((subType) => {
                      const IconComponent = getIconForSubType(subType.name);
                      const isActive =
                        filters.subType === subType.id ||
                        filters.subType === subType.name;

                      return (
                        <button
                          key={subType.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFilterToggle("subType", subType.id);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm text-left ${
                            isActive
                              ? "bg-purple-50 text-purple-600 font-semibold"
                              : "hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                          <span>
                            {subType.name.charAt(0) +
                              subType.name
                                .slice(1)
                                .toLowerCase()
                                .replace("_", " ")}
                          </span>
                          {isActive && (
                            <Check className="w-4 h-4 ml-auto text-purple-600" />
                          )}
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      No subtypes available
                    </div>
                  )}
                </div>
              </Dropdown>
              {/* BHK Type Filter */}
              <Dropdown
                label="BHK Type"
                id="bhk-type"
                count={filters.bedrooms?.length || 0}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
              >
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-2">
                    {bhkOptions.map((bhk) => {
                      const isActive = filters.bedrooms?.includes(bhk);
                      return (
                        <button
                          key={bhk}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMultiSelectChange("bedrooms", bhk);
                          }}
                          className={`text-center px-4 py-2 border rounded-full font-medium transition-all ${
                            isActive
                              ? "bg-purple-600 text-white border-purple-600"
                              : "bg-white text-gray-700 border-gray-300 hover:border-purple-400"
                          }`}
                        >
                          {bhk} BHK
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdown(null);
                    }}
                    className="w-full mt-4 text-center py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors text-sm font-semibold"
                  >
                    Done
                  </button>
                </div>
              </Dropdown>

              {/* Price Range for Residential */}
              <Dropdown
                label="Price Range"
                id="price"
                count={filters.minPrice || filters.maxPrice ? 1 : 0}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
              >
                <div className="p-3 space-y-1">
                  {residentialPriceRanges.map((range, idx) => {
                    const isActive =
                      filters.minPrice === range.min &&
                      filters.maxPrice === range.max;
                    return (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFilterChange(
                            "minPrice",
                            isActive ? undefined : range.min,
                            false,
                          );
                          handleFilterChange(
                            "maxPrice",
                            isActive ? undefined : range.max,
                            false,
                          );
                          setActiveDropdown(null);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors text-sm text-left ${
                          isActive
                            ? "bg-purple-50 text-purple-600 font-semibold"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        {range.label}
                        {isActive && (
                          <Check className="w-4 h-4 text-purple-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </Dropdown>
            </>
          )}

          {/* COMMERCIAL FILTERS */}
          {isCommercial && (
            <>
              {/* Commercial Sub Type */}
              <Dropdown
                label="Property Sub Type"
                id="commercial-subtype"
                count={filters.subType ? 1 : 0}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
              >
                <div className="p-3 space-y-1">
                  {availableSubTypes.length > 0 ? (
                    availableSubTypes.map((subType) => {
                      const IconComponent = getIconForSubType(subType.name);
                      const isActive =
                        filters.subType === subType.id ||
                        filters.subType === subType.name;

                      return (
                        <button
                          key={subType.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFilterToggle("subType", subType.id);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm text-left ${
                            isActive
                              ? "bg-purple-50 text-purple-600 font-semibold"
                              : "hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                          <span>
                            {subType.name.charAt(0) +
                              subType.name
                                .slice(1)
                                .toLowerCase()
                                .replace("_", " ")}
                          </span>
                          {isActive && (
                            <Check className="w-4 h-4 ml-auto text-purple-600" />
                          )}
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      No subtypes available
                    </div>
                  )}
                </div>
              </Dropdown>

              {/* Price Range for Commercial */}
              <Dropdown
                label="Price Range"
                id="price"
                count={filters.minPrice || filters.maxPrice ? 1 : 0}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
              >
                <div className="p-3 space-y-1">
                  {commercialPriceRanges.map((range, idx) => {
                    const isActive =
                      filters.minPrice === range.min &&
                      filters.maxPrice === range.max;
                    return (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFilterChange(
                            "minPrice",
                            isActive ? undefined : range.min,
                            false,
                          );
                          handleFilterChange(
                            "maxPrice",
                            isActive ? undefined : range.max,
                            false,
                          );
                          setActiveDropdown(null);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors text-sm text-left ${
                          isActive
                            ? "bg-purple-50 text-purple-600 font-semibold"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        {range.label}
                        {isActive && (
                          <Check className="w-4 h-4 text-purple-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </Dropdown>

              {/* Furnishing Status */}
              <Dropdown
                label="Furnishing"
                id="furnishing"
                count={filters.furnishingStatus ? 1 : 0}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
              >
                <div className="p-3 space-y-1">
                  {furnishingStatuses.map((status) => {
                    const isActive = filters.furnishingStatus === status.value;
                    return (
                      <button
                        key={status.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFilterToggle("furnishingStatus", status.value);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors text-sm text-left ${
                          isActive
                            ? "bg-purple-50 text-purple-600 font-semibold"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        {status.label}
                        {isActive && (
                          <Check className="w-4 h-4 text-purple-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </Dropdown>

              {/* Facing Direction */}
              <Dropdown
                label="Facing"
                id="facing"
                count={filters.facingDirection ? 1 : 0}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
              >
                <div className="p-3 space-y-1">
                  {facingDirections.map((direction) => {
                    const isActive =
                      filters.facingDirection === direction.value;
                    return (
                      <button
                        key={direction.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFilterToggle(
                            "facingDirection",
                            direction.value,
                          );
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors text-sm text-left ${
                          isActive
                            ? "bg-purple-50 text-purple-600 font-semibold"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {direction.label}
                        </span>
                        {isActive && (
                          <Check className="w-4 h-4 text-purple-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </Dropdown>
            </>
          )}

          {/* COMMON FILTERS */}
          {/* Sale Type Filter */}
          <Dropdown
            label="Sale Type"
            id="sale-type"
            count={filters.purpose ? 1 : 0}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
          >
            <div className="p-3 space-y-1">
              {saleTypes.map((type) => {
                const isActive = filters.purpose === type.value;
                return (
                  <button
                    key={type.value}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFilterToggle("purpose", type.value);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors text-sm text-left ${
                      isActive
                        ? "bg-purple-50 text-purple-600 font-semibold"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {type.label}
                    {isActive && <Check className="w-4 h-4 text-purple-600" />}
                  </button>
                );
              })}
            </div>
          </Dropdown>

          {/* Construction Status Filter */}
          <Dropdown
            label="Construction Status"
            id="construction"
            count={filters.possessionStatus ? 1 : 0}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
          >
            <div className="p-3 space-y-1">
              {constructionStatuses.map((status) => {
                const isActive = filters.possessionStatus === status;
                return (
                  <button
                    key={status}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFilterToggle("possessionStatus", status);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors text-sm text-left ${
                      isActive
                        ? "bg-purple-50 text-purple-600 font-semibold"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {status === "READY_TO_MOVE"
                      ? "Ready to Move"
                      : "Under Construction"}
                    {isActive && <Check className="w-4 h-4 text-purple-600" />}
                  </button>
                );
              })}
            </div>
          </Dropdown>

          {/* Listing Source */}
          <Dropdown
            label="Posted By"
            id="listing-source"
            count={filters.listingSource ? 1 : 0}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
          >
            <div className="p-3 space-y-1">
              {listingSources.map((source) => {
                const isActive = filters.listingSource === source.value;
                return (
                  <button
                    key={source.value}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFilterToggle("listingSource", source.value);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors text-sm text-left ${
                      isActive
                        ? "bg-purple-50 text-purple-600 font-semibold"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {source.value === "AGENT" && <User className="w-4 h-4" />}
                      {source.value === "BUILDER" && (
                        <Building2 className="w-4 h-4" />
                      )}
                      {source.value === "OWNER" && <Home className="w-4 h-4" />}
                      {source.label}
                    </span>
                    {isActive && <Check className="w-4 h-4 text-purple-600" />}
                  </button>
                );
              })}
            </div>
          </Dropdown>

          {/* Verified Filter */}
          <Dropdown
            label="Verified"
            id="verified"
            count={filters.verified ? 1 : 0}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
          >
            <div className="p-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFilterToggle(
                    "verified",
                    !filters.verified ? true : undefined,
                  );
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm ${
                  filters.verified
                    ? "bg-purple-50 text-purple-600 font-semibold"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <Check className="w-4 h-4" />
                <span>Verified Properties Only</span>
              </button>
            </div>
          </Dropdown>

          {/* More Filters - Only for Residential */}
          {isResidential && (
            <Dropdown
              label="More Filters"
              id="more-filters"
              count={filters.hasBalcony ? 1 : 0}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
            >
              <div className="p-3 space-y-3">
                <p className="text-gray-900 font-semibold border-b pb-2 mb-2">
                  Property Features
                </p>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2 text-sm text-gray-700">
                    <Maximize className="w-4 h-4 text-gray-500" />
                    Has Balcony
                  </span>
                  <input
                    type="checkbox"
                    checked={filters.hasBalcony || false}
                    onChange={(e) => {
                      e.stopPropagation();
                      setFilters((prev) => ({
                        ...prev,
                        hasBalcony: e.target.checked ? true : undefined,
                      }));
                    }}
                    className="form-checkbox h-5 w-5 text-purple-600 rounded border-gray-300"
                  />
                </label>

                <div className="pt-2 mt-3 border-t">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdown(null);
                    }}
                    className="w-full text-center py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </Dropdown>
          )}

          {/* Reset Filters Button */}
          {totalActiveFilters > 0 && (
            <button
              onClick={() => {
                setFilters({
                  status: "AVAILABLE",
                  sortBy: "createdAt",
                  sortOrder: "desc",
                  cityId: filters.cityId,
                  city: filters.city,
                  locality: filters.locality,
                  localityId: filters.localityId,
                });
                setActiveDropdown(null);
              }}
              className="text-sm text-red-600 hover:text-red-700 font-medium whitespace-nowrap px-3 transition-colors"
            >
              Reset filters ({totalActiveFilters})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
