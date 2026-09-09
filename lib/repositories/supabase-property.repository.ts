import { SupabaseClient } from '@supabase/supabase-js';
import { IPropertyRepository, PropertyFilter } from './property.repository.interface';
import { Property } from '../domain/property.types';
import { PropertyMapper, PropertyRow } from './property.mapper';

export class SupabasePropertyRepository implements IPropertyRepository {
  constructor(private supabase: SupabaseClient) {}

  async findAll(filter?: PropertyFilter): Promise<Property[]> {
    let query = this.supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter?.type) {
      query = query.eq('type', filter.type);
    }
    if (filter?.status) {
      query = query.eq('status', filter.status);
    }
    if (filter?.isFeatured !== undefined) {
      query = query.eq('is_featured', filter.isFeatured);
    }
    if (filter?.location) {
      query = query.ilike('location', `%${filter.location}%`);
    }
    if (filter?.searchQuery) {
      query = query.or(`title.ilike.%${filter.searchQuery}%,location.ilike.%${filter.searchQuery}%,tagline.ilike.%${filter.searchQuery}%`);
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(`Failed to fetch properties: ${error.message}`);
    }

    return (data || []).map((row: PropertyRow) => PropertyMapper.toDomain(row));
  }

  async findById(id: string): Promise<Property | null> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let query = this.supabase.from('properties').select('*');

    if (isUuid) {
      query = query.eq('id', id);
    } else {
      query = query.eq('slug', id);
    }

    const { data, error } = await query.maybeSingle();

    if (error || !data) return null;
    return PropertyMapper.toDomain(data as PropertyRow);
  }

  async findBySlug(slug: string): Promise<Property | null> {
    const { data, error } = await this.supabase
      .from('properties')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) return null;
    return PropertyMapper.toDomain(data as PropertyRow);
  }

  async create(prop: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property> {
    const persistenceData = PropertyMapper.toPersistence(prop);

    const { data, error } = await this.supabase
      .from('properties')
      .insert(persistenceData)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to create property: ${error?.message}`);
    }

    return PropertyMapper.toDomain(data as PropertyRow);
  }

  async update(id: string, prop: Partial<Property>): Promise<Property> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    // Check if property exists by UUID or Slug
    let checkQuery = this.supabase.from('properties').select('id, slug');
    if (isUuid) {
      checkQuery = checkQuery.eq('id', id);
    } else {
      checkQuery = checkQuery.eq('slug', id);
    }

    const { data: existing } = await checkQuery.maybeSingle();

    if (!existing) {
      return this.create({
        slug: prop.slug || id,
        title: prop.title || 'Lombok Property',
        tagline: prop.tagline || '',
        type: prop.type || 'villa',
        location: prop.location || 'Lombok',
        priceIdr: prop.priceIdr || 1000000000,
        ownership: prop.ownership || 'Leasehold (HGB)',
        leaseYears: prop.leaseYears,
        landSizeM2: prop.landSizeM2 || 500,
        buildingSizeM2: prop.buildingSizeM2,
        bedrooms: prop.bedrooms,
        bathrooms: prop.bathrooms,
        roi: prop.roi || '12% - 16% Net ROI',
        beachDistance: prop.beachDistance || '5 Mins',
        airportDistance: prop.airportDistance || '25 Mins',
        image: prop.image || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
        gallery: prop.gallery || [],
        features: prop.features || [],
        status: prop.status || 'For Sale',
        isFeatured: prop.isFeatured || false,
      });
    }

    const realId = existing.id;
    const persistenceData = PropertyMapper.toPersistence(prop);
    persistenceData.updated_at = new Date().toISOString();

    const { data, error } = await this.supabase
      .from('properties')
      .update(persistenceData)
      .eq('id', realId)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to update property: ${error?.message}`);
    }

    return PropertyMapper.toDomain(data as PropertyRow);
  }

  async delete(id: string): Promise<boolean> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let checkQuery = this.supabase.from('properties').delete();
    if (isUuid) {
      checkQuery = checkQuery.eq('id', id);
    } else {
      checkQuery = checkQuery.eq('slug', id);
    }

    const { error } = await checkQuery;

    if (error) {
      throw new Error(`Failed to delete property: ${error.message}`);
    }
    return true;
  }
}
