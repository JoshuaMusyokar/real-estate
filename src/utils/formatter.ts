import type { PropertyType, PropertySubType } from "../types/property";

export const formatPrice = (
  price: number,
  currency: string = "INR",
): string => {
  if (currency === "INR") {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    } else if (price >= 1000) {
      return `₹${(price / 1000).toFixed(2)} K`;
    }
    return `₹${price.toLocaleString()}`;
  }

  // For other currencies
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(price);
};

export const getPropertyTypeLabel = (
  type: PropertyType,
  subType: PropertySubType | null = null,
): string => {
  if (subType) {
    return `${type.name} - ${subType.name}`;
  }
  return type.name;
};

export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};
export const formatToIndianUnits = (value?: number) => {
  if (!value || value <= 0) return "";

  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2).replace(/\.00$/, "")} Cr`;
  }

  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2).replace(/\.00$/, "")} L`;
  }

  return `₹${value.toLocaleString("en-IN")}`;
};
