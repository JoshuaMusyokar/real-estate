import React from "react";
import { Check, Maximize } from "lucide-react";
import type { PropertySearchFilters } from "../../types";
import { getIconForPropertyType, getIconForSubType } from "../../utils";

// ─── shared option row ────────────────────────────────────────────────────────

interface OptionRowProps {
  label: React.ReactNode;
  isActive: boolean;
  onClick: (e: React.MouseEvent) => void;
}

export const OptionRow: React.FC<OptionRowProps> = ({
  label,
  isActive,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center justify-between gap-3
      px-3 py-2 rounded-lg text-left text-xs sm:text-sm
      transition-colors
      ${
        isActive
          ? "bg-blue-50 text-blue-700 font-semibold"
          : "hover:bg-gray-50 text-gray-700"
      }
    `}
  >
    {label}
    {isActive && <Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />}
  </button>
);

const Wrap: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="p-2 space-y-0.5">{children}</div>
);

// ─── Property Type ─────────────────────────────────────────────────────────────

export const PropertyTypeContent: React.FC<{
  propertyTypes: any[];
  filters: PropertySearchFilters;
  onToggle: (key: keyof PropertySearchFilters, value: any) => void;
}> = ({ propertyTypes, filters, onToggle }) => (
  <Wrap>
    {propertyTypes.map((type) => {
      const Icon = getIconForPropertyType(type.name);
      const isActive =
        filters.propertyType === type.id || filters.propertyType === type.name;
      return (
        <OptionRow
          key={type.id}
          isActive={isActive}
          onClick={(e) => {
            e.stopPropagation();
            onToggle("propertyType", type.id);
          }}
          label={
            <span className="flex items-center gap-2.5">
              <Icon className="w-4 h-4 flex-shrink-0" />
              {type.name.charAt(0) +
                type.name.slice(1).toLowerCase().replace("_", " ")}
            </span>
          }
        />
      );
    })}
  </Wrap>
);

// ─── Sub Type ──────────────────────────────────────────────────────────────────

export const SubTypeContent: React.FC<{
  subTypes: any[];
  filters: PropertySearchFilters;
  onToggle: (key: keyof PropertySearchFilters, value: any) => void;
}> = ({ subTypes, filters, onToggle }) => (
  <Wrap>
    {subTypes.length === 0 ? (
      <p className="px-3 py-2 text-xs text-gray-400">No subtypes available</p>
    ) : (
      subTypes.map((st) => {
        const Icon = getIconForSubType(st.name);
        const isActive =
          filters.subType === st.id || filters.subType === st.name;
        return (
          <OptionRow
            key={st.id}
            isActive={isActive}
            onClick={(e) => {
              e.stopPropagation();
              onToggle("subType", st.id);
            }}
            label={
              <span className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 flex-shrink-0" />
                {st.name.charAt(0) +
                  st.name.slice(1).toLowerCase().replace("_", " ")}
              </span>
            }
          />
        );
      })
    )}
  </Wrap>
);

// ─── BHK ──────────────────────────────────────────────────────────────────────

export const BhkContent: React.FC<{
  filters: PropertySearchFilters;
  onMultiSelect: (key: "bedrooms", value: number) => void;
  onClose: () => void;
}> = ({ filters, onMultiSelect, onClose }) => (
  <div className="p-3">
    <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-3">
      {[1, 2, 3, 4, 5, 6].map((bhk) => {
        const isActive = filters.bedrooms?.includes(bhk);
        return (
          <button
            key={bhk}
            onClick={(e) => {
              e.stopPropagation();
              onMultiSelect("bedrooms", bhk);
            }}
            className={`
              text-center px-2 sm:px-4 py-1.5 sm:py-2 border rounded-full text-xs sm:text-sm font-semibold transition-all
              ${
                isActive
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:text-blue-600"
              }
            `}
          >
            {bhk} BHK
          </button>
        );
      })}
    </div>
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
      className="w-full py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-lg transition-colors"
    >
      Done
    </button>
  </div>
);

// ─── Price Range ──────────────────────────────────────────────────────────────

interface PriceRange {
  label: string;
  min: number;
  max?: number;
}

export const PriceRangeContent: React.FC<{
  ranges: PriceRange[];
  filters: PropertySearchFilters;
  onChange: (min: number | undefined, max: number | undefined) => void;
}> = ({ ranges, filters, onChange }) => (
  <Wrap>
    {ranges.map((range, i) => {
      const isActive =
        filters.minPrice === range.min && filters.maxPrice === range.max;
      return (
        <OptionRow
          key={i}
          isActive={isActive}
          onClick={(e) => {
            e.stopPropagation();
            onChange(
              isActive ? undefined : range.min,
              isActive ? undefined : range.max,
            );
          }}
          label={range.label}
        />
      );
    })}
  </Wrap>
);

// ─── Generic toggle list ──────────────────────────────────────────────────────

export const ToggleListContent: React.FC<{
  options: Array<{ value: string; label: React.ReactNode }>;
  activeValue: string | string[] | undefined;
  onToggle: (value: string) => void;
}> = ({ options, activeValue, onToggle }) => (
  <Wrap>
    {options.map((opt) => (
      <OptionRow
        key={String(opt.value)}
        isActive={activeValue === opt.value}
        onClick={(e) => {
          e.stopPropagation();
          onToggle(opt.value);
        }}
        label={opt.label}
      />
    ))}
  </Wrap>
);

// ─── More filters ─────────────────────────────────────────────────────────────

export const MoreFiltersContent: React.FC<{
  filters: PropertySearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<PropertySearchFilters>>;
  onClose: () => void;
}> = ({ filters, setFilters, onClose }) => (
  <div className="p-3 min-w-[200px]">
    <p className="text-xs font-black text-gray-700 uppercase tracking-wide border-b border-blue-50 pb-2 mb-2">
      Property Features
    </p>
    <label className="flex items-center justify-between cursor-pointer py-2">
      <span className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
        <Maximize className="w-4 h-4 text-gray-400" />
        Has Balcony
      </span>
      <input
        type="checkbox"
        checked={filters.hasBalcony || false}
        onChange={(e) => {
          e.stopPropagation();
          setFilters((p) => ({
            ...p,
            hasBalcony: e.target.checked ? true : undefined,
          }));
        }}
        className="w-4 h-4 accent-blue-600 rounded border-gray-300"
      />
    </label>
    <div className="pt-2 mt-2 border-t border-blue-50">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
      >
        Apply
      </button>
    </div>
  </div>
);
