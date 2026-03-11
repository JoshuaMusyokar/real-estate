import React, { useEffect, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FilterDropdownProps {
  label: string;
  children: React.ReactNode;
  id: string;
  count?: number;
  activeDropdown: string | null;
  setActiveDropdown: (id: string | null) => void;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  children,
  id,
  count = 0,
  activeDropdown,
  setActiveDropdown,
}) => {
  const isOpen = activeDropdown === id;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, setActiveDropdown]);

  // Position the fixed menu below (or above) the trigger button
  useEffect(() => {
    if (!isOpen || !buttonRef.current || !menuRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const vh = window.innerHeight;
    const maxH = Math.min(360, vh - 100);
    const below = vh - rect.bottom - 8;

    menuRef.current.style.left = `${rect.left}px`;
    menuRef.current.style.minWidth = `${Math.max(rect.width, 220)}px`;

    if (below >= maxH || below >= 200) {
      menuRef.current.style.top = `${rect.bottom + 6}px`;
      menuRef.current.style.bottom = "auto";
    } else {
      menuRef.current.style.bottom = `${vh - rect.top + 6}px`;
      menuRef.current.style.top = "auto";
    }
  }, [isOpen]);

  const isActive = count > 0 || isOpen;

  return (
    <div className="relative flex-shrink-0" ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setActiveDropdown(isOpen ? null : id);
        }}
        className={`
          inline-flex items-center gap-1 sm:gap-1.5
          px-2.5 sm:px-3 py-1.5 sm:py-2
          border rounded-full
          text-[11px] sm:text-sm font-semibold
          whitespace-nowrap transition-all duration-150
          ${
            isActive
              ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
              : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-600"
          }
        `}
      >
        <span>{label}</span>
        {count > 0 && (
          <span className="bg-blue-600 text-white text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded-full min-w-[16px] text-center leading-none">
            {count}
          </span>
        )}
        {isOpen ? (
          <ChevronUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        ) : (
          <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        )}
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="fixed bg-white border border-blue-100 rounded-xl shadow-2xl shadow-blue-100/50 max-h-[360px] overflow-y-auto z-[200]"
          style={{ top: "auto", left: "auto" }}
        >
          {children}
        </div>
      )}
    </div>
  );
};
