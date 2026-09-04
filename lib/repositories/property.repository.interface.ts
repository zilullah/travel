import { Property, PropertyType, PropertyStatus } from '../domain/property.types';

export interface PropertyFilter {
  type?: PropertyType;
  status?: PropertyStatus;
  location?: string;
  isFeatured?: boolean;
  searchQuery?: string;
}

export interface IPropertyRepository {
  findAll(filter?: PropertyFilter): Promise<Property[]>;
  findById(id: string): Promise<Property | null>;
  findBySlug(slug: string): Promise<Property | null>;
  create(prop: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property>;
  update(id: string, prop: Partial<Property>): Promise<Property>;
  delete(id: string): Promise<boolean>;
}
