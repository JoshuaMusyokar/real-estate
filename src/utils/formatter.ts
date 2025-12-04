import type { PropertyType, PropertySubType } from "../types/property";

export const formatPrice = (
  price: number,
  currency: string = "INR"
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
  subType: PropertySubType | null = null
): string => {
  if (subType) {
    return `${type} - ${subType}`;
  }
  return type;
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
