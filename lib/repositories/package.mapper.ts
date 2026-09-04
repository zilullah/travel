import { TourPackage, PricingTier } from '../domain/package.types';

export interface TourPackageRow {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  destination: string;
  duration: string;
  category: string;
  base_price_idr: number | string;
  image_url: string | null;
  gallery: string[] | null;
  highlights: string[] | null;
  included: string[] | null;
  excluded: string[] | null;
  itinerary: any;
  status: string;
  is_featured: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PricingTierRow {
  id: string;
  package_id: string;
  tier_name: string;
  min_pax: number;
  max_pax: number;
  price_per_pax_idr: number | string;
  discount_percent: number | string | null;
  created_at?: string;
}

export class PackageMapper {
  static toDomain(row: TourPackageRow, tiers: PricingTierRow[] = []): TourPackage {
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      tagline: row.tagline || '',
      destination: row.destination,
      duration: row.duration,
      category: row.category as any,
      basePriceIdr: Number(row.base_price_idr),
      imageUrl: row.image_url || '',
      gallery: row.gallery || [],
      highlights: row.highlights || [],
      included: row.included || [],
      excluded: row.excluded || [],
      itinerary: Array.isArray(row.itinerary) ? row.itinerary : [],
      status: row.status as any,
      isFeatured: Boolean(row.is_featured),
      pricingTiers: tiers.map(this.tierToDomain),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  static toPersistence(domain: Partial<TourPackage>): Partial<TourPackageRow> {
    const row: Partial<TourPackageRow> = {};
    if (domain.slug !== undefined) row.slug = domain.slug;
    if (domain.title !== undefined) row.title = domain.title;
    if (domain.tagline !== undefined) row.tagline = domain.tagline;
    if (domain.destination !== undefined) row.destination = domain.destination;
    if (domain.duration !== undefined) row.duration = domain.duration;
    if (domain.category !== undefined) row.category = domain.category;
    if (domain.basePriceIdr !== undefined) row.base_price_idr = domain.basePriceIdr;
    if (domain.imageUrl !== undefined) row.image_url = domain.imageUrl;
    if (domain.gallery !== undefined) row.gallery = domain.gallery;
    if (domain.highlights !== undefined) row.highlights = domain.highlights;
    if (domain.included !== undefined) row.included = domain.included;
    if (domain.excluded !== undefined) row.excluded = domain.excluded;
    if (domain.itinerary !== undefined) row.itinerary = domain.itinerary;
    if (domain.status !== undefined) row.status = domain.status;
    if (domain.isFeatured !== undefined) row.is_featured = domain.isFeatured;
    return row;
  }

  static tierToDomain(row: PricingTierRow): PricingTier {
    return {
      id: row.id,
      packageId: row.package_id,
      tierName: row.tier_name,
      minPax: Number(row.min_pax),
      maxPax: Number(row.max_pax),
      pricePerPaxIdr: Number(row.price_per_pax_idr),
      discountPercent: row.discount_percent ? Number(row.discount_percent) : 0,
    };
  }

  static tierToPersistence(domain: PricingTier, packageId: string): Partial<PricingTierRow> {
    return {
      id: domain.id,
      package_id: packageId,
      tier_name: domain.tierName,
      min_pax: domain.minPax,
      max_pax: domain.maxPax,
      price_per_pax_idr: domain.pricePerPaxIdr,
      discount_percent: domain.discountPercent || 0,
    };
  }
}
