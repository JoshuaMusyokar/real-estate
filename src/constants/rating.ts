import type { LocalityRatingCategory } from "../types";

export const RATING_CATEGORIES: LocalityRatingCategory[] = [
  {
    id: "safety",
    name: "Safety & Security",
    description: "How safe do you feel in this area?",
    icon: "🛡️",
  },
  {
    id: "electricity",
    name: "Electricity Supply",
    description: "Reliability of power supply",
    icon: "⚡",
  },
  {
    id: "waterSupply",
    name: "Water Supply",
    description: "Availability and quality of water",
    icon: "💧",
  },
  {
    id: "internet",
    name: "Internet Connectivity",
    description: "Speed and reliability of internet",
    icon: "🌐",
  },
  {
    id: "transportation",
    name: "Public Transportation",
    description: "Access to buses, trains, etc.",
    icon: "🚌",
  },
  {
    id: "cleanliness",
    name: "Cleanliness",
    description: "Overall cleanliness of the area",
    icon: "🧹",
  },
  {
    id: "noiseLevel",
    name: "Noise Level",
    description: "Peacefulness of the neighborhood",
    icon: "🔇",
  },
  {
    id: "greenery",
    name: "Greenery & Parks",
    description: "Availability of green spaces",
    icon: "🌳",
  },
];

export const RATING_AS_OPTIONS = [
  { value: "resident", label: "Resident", description: "I live here" },
  { value: "visitor", label: "Visitor", description: "I frequently visit" },
  { value: "agent", label: "Real Estate Agent", description: "I work here" },
  {
    value: "business_owner",
    label: "Business Owner",
    description: "I run a business here",
  },
];
