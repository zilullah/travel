import { TourPackage, PricingTier, PackageCategory, PackageStatus } from '../domain/package.types';

export interface TourPackageFilter {
  category?: PackageCategory;
  status?: PackageStatus;
  destination?: string;
  isFeatured?: boolean;
  searchQuery?: string;
}

export interface IPackageRepository {
  findAll(filter?: TourPackageFilter): Promise<TourPackage[]>;
  findById(id: string): Promise<TourPackage | null>;
  findBySlug(slug: string): Promise<TourPackage | null>;
  create(pkg: Omit<TourPackage, 'id' | 'createdAt' | 'updatedAt'>): Promise<TourPackage>;
  update(id: string, pkg: Partial<TourPackage>): Promise<TourPackage>;
  delete(id: string): Promise<boolean>;

  // Pricing Tiers
  getPricingTiers(packageId: string): Promise<PricingTier[]>;
  savePricingTiers(packageId: string, tiers: PricingTier[]): Promise<PricingTier[]>;
}
