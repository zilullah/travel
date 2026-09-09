import { SupabaseClient } from '@supabase/supabase-js';
import { IPackageRepository, TourPackageFilter } from './package.repository.interface';
import { TourPackage, PricingTier } from '../domain/package.types';
import { PackageMapper, TourPackageRow, PricingTierRow } from './package.mapper';

export class SupabasePackageRepository implements IPackageRepository {
  constructor(private supabase: SupabaseClient) {}

  async findAll(filter?: TourPackageFilter): Promise<TourPackage[]> {
    let query = this.supabase
      .from('tour_packages')
      .select('*, package_pricing_tiers(*)')
      .order('created_at', { ascending: false });

    if (filter?.category) {
      query = query.eq('category', filter.category);
    }
    if (filter?.status) {
      query = query.eq('status', filter.status);
    }
    if (filter?.isFeatured !== undefined) {
      query = query.eq('is_featured', filter.isFeatured);
    }
    if (filter?.destination) {
      query = query.ilike('destination', `%${filter.destination}%`);
    }
    if (filter?.searchQuery) {
      query = query.or(`title.ilike.%${filter.searchQuery}%,tagline.ilike.%${filter.searchQuery}%,destination.ilike.%${filter.searchQuery}%`);
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(`Failed to fetch tour packages: ${error.message}`);
    }

    return (data || []).map((row: TourPackageRow & { package_pricing_tiers?: PricingTierRow[] }) => {
      const tiers = row.package_pricing_tiers || [];
      return PackageMapper.toDomain(row, tiers);
    });
  }

  async findById(id: string): Promise<TourPackage | null> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let query = this.supabase.from('tour_packages').select('*');

    if (isUuid) {
      query = query.eq('id', id);
    } else {
      query = query.eq('slug', id);
    }

    const { data: pkgRow, error: pkgError } = await query.maybeSingle();

    if (pkgError || !pkgRow) {
      return null;
    }

    const { data: tierRows } = await this.supabase
      .from('package_pricing_tiers')
      .select('*')
      .eq('package_id', pkgRow.id)
      .order('min_pax', { ascending: true });

    return PackageMapper.toDomain(pkgRow as TourPackageRow, (tierRows || []) as PricingTierRow[]);
  }

  async findBySlug(slug: string): Promise<TourPackage | null> {
    const { data: pkgRow, error } = await this.supabase
      .from('tour_packages')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !pkgRow) {
      return null;
    }

    const { data: tierRows } = await this.supabase
      .from('package_pricing_tiers')
      .select('*')
      .eq('package_id', pkgRow.id)
      .order('min_pax', { ascending: true });

    return PackageMapper.toDomain(pkgRow as TourPackageRow, (tierRows || []) as PricingTierRow[]);
  }

  async create(pkg: Omit<TourPackage, 'id' | 'createdAt' | 'updatedAt'>): Promise<TourPackage> {
    const persistenceData = PackageMapper.toPersistence(pkg);

    const { data, error } = await this.supabase
      .from('tour_packages')
      .insert(persistenceData)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to create tour package: ${error?.message}`);
    }

    let savedTiers: PricingTier[] = [];
    if (pkg.pricingTiers && pkg.pricingTiers.length > 0) {
      savedTiers = await this.savePricingTiers(data.id, pkg.pricingTiers);
    }

    return PackageMapper.toDomain(data as TourPackageRow, (savedTiers || []).map((t) => PackageMapper.tierToPersistence(t, data.id) as PricingTierRow));
  }

  async update(id: string, pkg: Partial<TourPackage>): Promise<TourPackage> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    // Check if package exists by UUID or Slug
    let checkQuery = this.supabase.from('tour_packages').select('id, slug');
    if (isUuid) {
      checkQuery = checkQuery.eq('id', id);
    } else {
      checkQuery = checkQuery.eq('slug', id);
    }

    const { data: existing } = await checkQuery.maybeSingle();

    if (!existing) {
      // Create new package if not existing in database (was a fallback dummy)
      return this.create({
        slug: pkg.slug || id,
        title: pkg.title || 'Lombok Tour Package',
        tagline: pkg.tagline || '',
        destination: pkg.destination || 'Lombok',
        duration: pkg.duration || '1 Day',
        category: pkg.category || 'adventure',
        basePriceIdr: pkg.basePriceIdr || 500000,
        imageUrl: pkg.imageUrl || 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80',
        gallery: pkg.gallery || [],
        highlights: pkg.highlights || [],
        included: pkg.included || [],
        excluded: pkg.excluded || [],
        itinerary: pkg.itinerary || [],
        status: pkg.status || 'published',
        isFeatured: pkg.isFeatured || false,
        pricingTiers: pkg.pricingTiers || [],
      });
    }

    const realId = existing.id;
    const persistenceData = PackageMapper.toPersistence(pkg);
    persistenceData.updated_at = new Date().toISOString();

    const { data, error } = await this.supabase
      .from('tour_packages')
      .update(persistenceData)
      .eq('id', realId)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to update tour package: ${error?.message}`);
    }

    let savedTiers: PricingTier[] = [];
    if (pkg.pricingTiers) {
      savedTiers = await this.savePricingTiers(realId, pkg.pricingTiers);
    } else {
      savedTiers = await this.getPricingTiers(realId);
    }

    return PackageMapper.toDomain(data as TourPackageRow, (savedTiers || []).map((t) => PackageMapper.tierToPersistence(t, realId) as PricingTierRow));
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('tour_packages')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete tour package: ${error.message}`);
    }
    return true;
  }

  async getPricingTiers(packageId: string): Promise<PricingTier[]> {
    const { data, error } = await this.supabase
      .from('package_pricing_tiers')
      .select('*')
      .eq('package_id', packageId)
      .order('min_pax', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch pricing tiers: ${error.message}`);
    }

    return (data || []).map((row: PricingTierRow) => PackageMapper.tierToDomain(row));
  }

  async savePricingTiers(packageId: string, tiers: PricingTier[]): Promise<PricingTier[]> {
    // Delete existing tiers for clean sync
    await this.supabase.from('package_pricing_tiers').delete().eq('package_id', packageId);

    if (!tiers || tiers.length === 0) {
      return [];
    }

    const rows = tiers.map((t) => PackageMapper.tierToPersistence(t, packageId));
    const { data, error } = await this.supabase
      .from('package_pricing_tiers')
      .insert(rows)
      .select();

    if (error) {
      throw new Error(`Failed to save pricing tiers: ${error.message}`);
    }

    return (data || []).map((row: PricingTierRow) => PackageMapper.tierToDomain(row));
  }
}
