import { Property } from '../domain/property.types';

export interface PropertyRow {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  type: string;
  location: string;
  price_idr: number | string;
  ownership: string;
  lease_years: number | null;
  land_size_m2: number;
  building_size_m2: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  roi: string;
  beach_distance: string;
  airport_distance: string;
  image_url: string;
  gallery: string[] | null;
  features: string[] | null;
  status: string;
  is_featured: boolean;
  created_at?: string;
  updated_at?: string;
}

export class PropertyMapper {
  static toDomain(row: PropertyRow): Property {
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      tagline: row.tagline || '',
      type: row.type as any,
      location: row.location,
      priceIdr: Number(row.price_idr),
      ownership: row.ownership as any,
      leaseYears: row.lease_years ? Number(row.lease_years) : undefined,
      landSizeM2: Number(row.land_size_m2),
      buildingSizeM2: row.building_size_m2 ? Number(row.building_size_m2) : undefined,
      bedrooms: row.bedrooms ? Number(row.bedrooms) : undefined,
      bathrooms: row.bathrooms ? Number(row.bathrooms) : undefined,
      roi: row.roi,
      beachDistance: row.beach_distance,
      airportDistance: row.airport_distance,
      image: row.image_url,
      gallery: row.gallery || [],
      features: row.features || [],
      status: row.status as any,
      isFeatured: Boolean(row.is_featured),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  static toPersistence(domain: Partial<Property>): Partial<PropertyRow> {
    const row: Partial<PropertyRow> = {};
    if (domain.slug !== undefined) row.slug = domain.slug;
    if (domain.title !== undefined) row.title = domain.title;
    if (domain.tagline !== undefined) row.tagline = domain.tagline;
    if (domain.type !== undefined) row.type = domain.type;
    if (domain.location !== undefined) row.location = domain.location;
    if (domain.priceIdr !== undefined) row.price_idr = domain.priceIdr;
    if (domain.ownership !== undefined) row.ownership = domain.ownership;
    if (domain.leaseYears !== undefined) row.lease_years = domain.leaseYears;
    if (domain.landSizeM2 !== undefined) row.land_size_m2 = domain.landSizeM2;
    if (domain.buildingSizeM2 !== undefined) row.building_size_m2 = domain.buildingSizeM2;
    if (domain.bedrooms !== undefined) row.bedrooms = domain.bedrooms;
    if (domain.bathrooms !== undefined) row.bathrooms = domain.bathrooms;
    if (domain.roi !== undefined) row.roi = domain.roi;
    if (domain.beachDistance !== undefined) row.beach_distance = domain.beachDistance;
    if (domain.airportDistance !== undefined) row.airport_distance = domain.airportDistance;
    if (domain.image !== undefined) row.image_url = domain.image;
    if (domain.gallery !== undefined) row.gallery = domain.gallery;
    if (domain.features !== undefined) row.features = domain.features;
    if (domain.status !== undefined) row.status = domain.status;
    if (domain.isFeatured !== undefined) row.is_featured = domain.isFeatured;
    return row;
  }
}
