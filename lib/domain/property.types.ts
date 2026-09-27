export type PropertyType = 'villa' | 'land' | 'commercial';
export type PropertyOwnership = 'Freehold (SHM)' | 'Leasehold (HGB)' | 'PMA Foreign Investment';
export const PROPERTY_STATUSES = ['For Sale', 'For Rent', 'Exclusive', 'Under Offer', 'Sold'] as const;
export type PropertyStatus = (typeof PROPERTY_STATUSES)[number];

export interface Property {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  type: PropertyType;
  location: string;
  priceIdr: number;
  ownership: PropertyOwnership;
  leaseYears?: number;
  landSizeM2: number;
  buildingSizeM2?: number;
  bedrooms?: number;
  bathrooms?: number;
  roi: string;
  beachDistance: string;
  airportDistance: string;
  image: string;
  gallery?: string[];
  features: string[];
  status: PropertyStatus;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
