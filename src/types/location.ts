export interface City {
  id: string;
  name: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  createdAt: Date;
  updatedAt: Date;
  localities?: Locality[];
  _count?: {
    properties: number;
    users: number;
    localities: number;
    leads: number;
  };
}
export interface ResCity {
  id: string;
  name: string;
}

export interface LocalityHighlight {
  name: string;
  type: string;
  distance_km: number;
}
export interface LocalityRatingUser {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
}

export interface LocalityRating {
  id: string;
  localityId: string;
  locality: ResLocality;
  userId: string;
  ratingAs: string;
  user: LocalityRatingUser;

  // New rating categories
  safety: number | null;
  electricity: number | null;
  waterSupply: number | null;
  internet: number | null;
  transportation: number | null;
  cleanliness: number | null;
  noiseLevel: number | null;
  greenery: number | null;

  overallRating: number | null;
  comment: string | null;
  createdAt: Date;
}
export interface LocalityRatingStats {
  overallAverageRating: number;
  totalRatings: number;

  // Category-specific averages
  categoryAverages: {
    safety: number | null;
    electricity: number | null;
    waterSupply: number | null;
    internet: number | null;
    transportation: number | null;
    cleanliness: number | null;
    noiseLevel: number | null;
    greenery: number | null;
  };

  // Distribution based on overall rating
  ratingDistribution: {
    rating: number;
    count: number;
    percentage: number;
  }[];

  // Ratings by user type
  ratingsByType: {
    ratingAs: string;
    averageRating: number;
    count: number;
  }[];
}
export interface Locality {
  id: string;
  name: string;
  cityId: string;
  city: City;
  createdAt: Date;
  updatedAt: Date;
  highlights: LocalityHighlight[] | null;
  _count?: {
    users: number;
    localityRatings: number;
  };
  averageRating?: number;
}
export interface ResLocality {
  id: string;
  name: string;
}
export interface CreateLocalityRatingRequest {
  localityId: string;
  ratingAs: string;

  // New rating categories (all optional, but at least one should be provided)
  safety?: number;
  electricity?: number;
  waterSupply?: number;
  internet?: number;
  transportation?: number;
  cleanliness?: number;
  noiseLevel?: number;
  greenery?: number;

  comment?: string;
}

export interface UpdateLocalityRatingRequest {
  ratingAs?: string;

  // New rating categories
  safety?: number;
  electricity?: number;
  waterSupply?: number;
  internet?: number;
  transportation?: number;
  cleanliness?: number;
  noiseLevel?: number;
  greenery?: number;

  comment?: string;
}
export interface CreateCityRequest {
  name: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}
export interface LocalityRatingCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}
export interface UpdateCityRequest {
  name?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}
export interface CreateLocalityRequest {
  name: string;
  cityId: string;
  highlights?: LocalityHighlight[];
}

export interface UpdateLocalityRequest {
  name?: string;
  cityId?: string;
  highlights?: LocalityHighlight[];
}

export interface CityFilter {
  search?: string;
  state?: string;
  country?: string;
  hasLocality?: boolean;
}

export interface LocalityFilter {
  search?: string;
  cityId?: string;
  cityName?: string;
}

export interface UserCityAssignment {
  userId: string;
  cityIds: string[];
}

export interface UserLocalityAssignment {
  userId: string;
  localityIds: string[];
}

export interface LocationStats {
  totalCities: number;
  totalLocalities: number;
  citiesWithMostProperties: Array<{
    city: City;
    propertyCount: number;
  }>;
  citiesWithMostUsers: Array<{
    city: City;
    userCount: number;
  }>;
}
export interface LocationSuggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    state?: string;
    country?: string;
    country_code?: string;
  };
}
// Property Review Types

export interface PropertyReviewUser {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
}

export interface PropertyReview {
  id: string;
  propertyId: string;
  userId: string;
  user: PropertyReviewUser;
  rating: number; // 1-5
  comment: string | null;
  createdAt: Date;
}

export interface PropertyReviewStats {
  averageRating: number;
  totalReviews: number;

  // Rating distribution
  ratingDistribution: {
    rating: number;
    count: number;
    percentage: number;
  }[];

  // Recent reviews
  recentReviews: PropertyReview[];
}

export interface CreatePropertyReviewRequest {
  propertyId: string;
  rating: number; // 1-5
  comment?: string;
}

export interface UpdatePropertyReviewRequest {
  rating?: number; // 1-5
  comment?: string;
}

// Extended Property type to include review stats
export interface PropertyWithReviews {
  id: string;
  title: string;
  averageRating?: number;
  reviewCount?: number;
  reviews?: PropertyReview[];
}
