// src/config/amenitiesConfig.ts

export interface PredefinedAmenity {
  name: string;
  icon: string;
  category: string;
  order: number;
}

export const AMENITY_CATEGORIES = [
  "Essential",
  "Kitchen",
  "Bathroom",
  "Entertainment",
  "Outdoor",
  "Safety",
  "Comfort",
  "Services",
  "Accessibility",
  "Family",
] as const;

export type AmenityCategory = (typeof AMENITY_CATEGORIES)[number];

// Icons mapping - you'll place SVG/PNG files in /public/icons/amenities/
export const PREDEFINED_AMENITIES: PredefinedAmenity[] = [
  // Essential
  {
    name: "WiFi",
    icon: "/icons/amenities/wifi.svg",
    category: "Essential",
    order: 1,
  },
  {
    name: "Air Conditioning",
    icon: "/icons/amenities/ac.svg",
    category: "Essential",
    order: 2,
  },
  {
    name: "Heating",
    icon: "/icons/amenities/heating.svg",
    category: "Essential",
    order: 3,
  },
  {
    name: "Hot Water",
    icon: "/icons/amenities/hot-water.svg",
    category: "Essential",
    order: 4,
  },
  {
    name: "Electricity",
    icon: "/icons/amenities/electricity.svg",
    category: "Essential",
    order: 5,
  },

  // Kitchen
  {
    name: "Kitchen",
    icon: "/icons/amenities/kitchen.svg",
    category: "Kitchen",
    order: 10,
  },
  {
    name: "Refrigerator",
    icon: "/icons/amenities/refrigerator.svg",
    category: "Kitchen",
    order: 11,
  },
  {
    name: "Microwave",
    icon: "/icons/amenities/microwave.svg",
    category: "Kitchen",
    order: 12,
  },
  {
    name: "Oven",
    icon: "/icons/amenities/oven.svg",
    category: "Kitchen",
    order: 13,
  },
  {
    name: "Stove",
    icon: "/icons/amenities/stove.svg",
    category: "Kitchen",
    order: 14,
  },
  {
    name: "Dishwasher",
    icon: "/icons/amenities/dishwasher.svg",
    category: "Kitchen",
    order: 15,
  },
  {
    name: "Coffee Maker",
    icon: "/icons/amenities/coffee-maker.svg",
    category: "Kitchen",
    order: 16,
  },
  {
    name: "Toaster",
    icon: "/icons/amenities/toaster.svg",
    category: "Kitchen",
    order: 17,
  },
  {
    name: "Kettle",
    icon: "/icons/amenities/kettle.svg",
    category: "Kitchen",
    order: 18,
  },
  {
    name: "Dishes & Utensils",
    icon: "/icons/amenities/utensils.svg",
    category: "Kitchen",
    order: 19,
  },

  // Bathroom
  {
    name: "Shower",
    icon: "/icons/amenities/shower.svg",
    category: "Bathroom",
    order: 20,
  },
  {
    name: "Bathtub",
    icon: "/icons/amenities/bathtub.svg",
    category: "Bathroom",
    order: 21,
  },

  {
    name: "Toiletries",
    icon: "/icons/amenities/toiletries.svg",
    category: "Bathroom",
    order: 24,
  },
  {
    name: "Washing Machine",
    icon: "/icons/amenities/washing-machine.svg",
    category: "Bathroom",
    order: 25,
  },
  // Entertainment
  {
    name: "TV",
    icon: "/icons/amenities/tv.svg",
    category: "Entertainment",
    order: 30,
  },
  {
    name: "Cable TV",
    icon: "/icons/amenities/cable-tv.svg",
    category: "Entertainment",
    order: 31,
  },
  {
    name: "Streaming Services",
    icon: "/icons/amenities/streaming.svg",
    category: "Entertainment",
    order: 32,
  },
  {
    name: "Sound System",
    icon: "/icons/amenities/sound-system.svg",
    category: "Entertainment",
    order: 33,
  },
  {
    name: "Game Console",
    icon: "/icons/amenities/game-console.svg",
    category: "Entertainment",
    order: 34,
  },
  {
    name: "Books",
    icon: "/icons/amenities/books.svg",
    category: "Entertainment",
    order: 36,
  },

  // Outdoor
  {
    name: "Balcony",
    icon: "/icons/amenities/balcony.svg",
    category: "Outdoor",
    order: 40,
  },

  {
    name: "Garden",
    icon: "/icons/amenities/garden.svg",
    category: "Outdoor",
    order: 42,
  },
  {
    name: "BBQ Grill",
    icon: "/icons/amenities/bbq.svg",
    category: "Outdoor",
    order: 43,
  },
  {
    name: "Pool",
    icon: "/icons/amenities/pool.svg",
    category: "Outdoor",
    order: 44,
  },
  {
    name: "Beach Access",
    icon: "/icons/amenities/beach.svg",
    category: "Outdoor",
    order: 46,
  },
  {
    name: "Gym",
    icon: "/icons/amenities/gym.svg",
    category: "Outdoor",
    order: 47,
  },
  // Safety
  {
    name: "Smoke Detector",
    icon: "/icons/amenities/smoke-detector.svg",
    category: "Safety",
    order: 50,
  },
  {
    name: "Carbon Monoxide Detector",
    icon: "/icons/amenities/co-detector.svg",
    category: "Safety",
    order: 51,
  },
  {
    name: "Fire Extinguisher",
    icon: "/icons/amenities/fire-extinguisher.svg",
    category: "Safety",
    order: 52,
  },
  {
    name: "First Aid Kit",
    icon: "/icons/amenities/first-aid.svg",
    category: "Safety",
    order: 53,
  },
  {
    name: "Security Cameras",
    icon: "/icons/amenities/security-camera.svg",
    category: "Safety",
    order: 54,
  },
  {
    name: "Safe",
    icon: "/icons/amenities/safe.svg",
    category: "Safety",
    order: 55,
  },

  // Comfort
  {
    name: "Workspace",
    icon: "/icons/amenities/workspace.svg",
    category: "Comfort",
    order: 64,
  },
  {
    name: "Fan",
    icon: "/icons/amenities/fan.svg",
    category: "Comfort",
    order: 65,
  },

  // Services
  {
    name: "Parking",
    icon: "/icons/amenities/parking.svg",
    category: "Services",
    order: 70,
  },
  {
    name: "Free Parking",
    icon: "/icons/amenities/free-parking.svg",
    category: "Services",
    order: 71,
  },
  {
    name: "EV Charger",
    icon: "/icons/amenities/ev-charger.svg",
    category: "Services",
    order: 72,
  },
  {
    name: "Elevator",
    icon: "/icons/amenities/elevator.svg",
    category: "Services",
    order: 73,
  },
  {
    name: "Luggage Storage",
    icon: "/icons/amenities/luggage.svg",
    category: "Services",
    order: 74,
  },
  {
    name: "Self Check-in",
    icon: "/icons/amenities/self-checkin.svg",
    category: "Services",
    order: 75,
  },

  // Accessibility
  {
    name: "Wheelchair Accessible",
    icon: "/icons/amenities/wheelchair.svg",
    category: "Accessibility",
    order: 80,
  },
  {
    name: "Step-Free Access",
    icon: "/icons/amenities/step-free.svg",
    category: "Accessibility",
    order: 81,
  },
  {
    name: "Accessible Bathroom",
    icon: "/icons/amenities/accessible-bathroom.svg",
    category: "Accessibility",
    order: 82,
  },

  // Family
  {
    name: "Crib",
    icon: "/icons/amenities/crib.svg",
    category: "Family",
    order: 90,
  },
  {
    name: "High Chair",
    icon: "/icons/amenities/high-chair.svg",
    category: "Family",
    order: 91,
  },
  {
    name: "Baby Bath",
    icon: "/icons/amenities/baby-bath.svg",
    category: "Family",
    order: 92,
  },
  {
    name: "Children's Books",
    icon: "/icons/amenities/children-books.svg",
    category: "Family",
    order: 93,
  },
  {
    name: "Toys",
    icon: "/icons/amenities/toys.svg",
    category: "Family",
    order: 94,
  },
  {
    name: "Pet Friendly",
    icon: "/icons/amenities/pet-friendly.svg",
    category: "Family",
    order: 95,
  },
];

// Helper function to get amenities by category
export const getAmenitiesByCategory = (
  category: string
): PredefinedAmenity[] => {
  return PREDEFINED_AMENITIES.filter(
    (amenity) => amenity.category === category
  );
};

// Helper function to search amenities
export const searchAmenities = (query: string): PredefinedAmenity[] => {
  const lowerQuery = query.toLowerCase();
  return PREDEFINED_AMENITIES.filter((amenity) =>
    amenity.name.toLowerCase().includes(lowerQuery)
  );
};
