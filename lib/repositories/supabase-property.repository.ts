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
    const { data, error } = await this.supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return PropertyMapper.toDomain(data as PropertyRow);
  }

  async findBySlug(slug: string): Promise<Property | null> {
    const { data, error } = await this.supabase
      .from('properties')
      .select('*')
      .eq('slug', slug)
      .single();

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
    const persistenceData = PropertyMapper.toPersistence(prop);
    persistenceData.updated_at = new Date().toISOString();

    const { data, error } = await this.supabase
      .from('properties')
      .update(persistenceData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to update property: ${error?.message}`);
    }

    return PropertyMapper.toDomain(data as PropertyRow);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete property: ${error.message}`);
    }
    return true;
  }
}
