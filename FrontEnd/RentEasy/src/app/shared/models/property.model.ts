export interface Property {
  id: number;
  owner_id: number;
  owner_name?: string;
  title: string;
  property_description: string;
  rent_per_day: number;
  location: string;
  amenities: string;
  photo1?: string;
  photo2?: string;
  photo3?: string;
  photo4?: string;
  created_at: string;
}

export interface PropertyCreateRequest {
  title: string;
  property_description: string;
  rent_per_day: number;
  location: string;
  amenities: string;
  photo1?: string;
  photo2?: string;
  photo3?: string;
  photo4?: string;
}

export interface PropertyUpdateRequest {
  title?: string;
  property_description?: string;
  rent_per_day?: number;
  location?: string;
  amenities?: string;
  photo1?: string;
  photo2?: string;
  photo3?: string;
  photo4?: string;
}

export interface PropertyFilters {
  location?: string;
  min_rent?: number;
  max_rent?: number;
  amenities?: string;
}
