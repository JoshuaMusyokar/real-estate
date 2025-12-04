import type { ZeroBrokerageProperty } from "../features/PropertyResult/ZeroBrokarageCard";

export const BASE_URL = "https://api.bengalproperty.com/api/v1";
// Inside PropertyList.tsx (or in a separate data file)

export const zeroBrokerageData: ZeroBrokerageProperty[] = [
  {
    id: "zb1",
    priceRange: "₹50 L - ₹55 L",
    title: "Eco Residential Homes",
    propertyDetails: "2, 3 BHK Flats",
    location: "Sector 23 Rohini, New Delhi",
    coverImageUrl: "/images/prop-zb1.jpg", // Placeholder URL
    developerName: "Eco Group",
    developerLogo: "EG",
    distanceKm: "6.17 km",
    link: "#contact-zb1",
  },
  {
    id: "zb2",
    priceRange: "₹3.25 Cr - ₹9.25 Cr",
    title: "Palm Luxury Residences",
    propertyDetails: "3, 4, 5 BHK Apartments",
    location: "Punjabi Bagh, New Delhi",
    coverImageUrl: "/images/prop-zb2.jpg",
    developerName: "Palm Associates",
    developerLogo: "PA",
    distanceKm: "2.63 km",
    link: "#contact-zb2",
  },
  {
    id: "zb3",
    priceRange: "₹13.5 Cr - ₹16.5 Cr",
    title: "TARC Grand Towers",
    propertyDetails: "3, 4 BHK Flats",
    location: "Kirti Nagar, New Delhi",
    coverImageUrl: "/images/prop-zb3.jpg",
    developerName: "TARC Limited",
    developerLogo: "TL",
    distanceKm: "4.58 km",
    link: "#contact-zb3",
  },
  // ... more items
];
