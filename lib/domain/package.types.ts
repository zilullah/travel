export type PackageCategory = 'adventure' | 'island_hopping' | 'cultural' | 'custom' | 'honeymoon';
export type PackageStatus = 'published' | 'draft' | 'archived';
export type UserRole = 'admin' | 'staff' | 'user';

export interface ItineraryItem {
  day: number;
  title: string;
  description: string;
}

export interface PricingTier {
  id?: string;
  packageId?: string;
  tierName: string;
  minPax: number;
  maxPax: number;
  pricePerPaxIdr: number;
  discountPercent?: number;
}

export interface TourPackage {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  destination: string;
  duration: string;
  category: PackageCategory;
  basePriceIdr: number;
  imageUrl: string;
  gallery: string[];
  highlights: string[];
  included: string[];
  excluded: string[];
  itinerary: ItineraryItem[];
  status: PackageStatus;
  isFeatured: boolean;
  pricingTiers?: PricingTier[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  role: UserRole;
  createdAt?: string;
}
