import { IPropertyRepository, PropertyFilter } from '../repositories/property.repository.interface';
import { Property, PropertyStatus } from '../domain/property.types';
import { validateProperty, generatePropertySlug, PropertyInput } from '../domain/property.validation';

export class PropertyService {
  constructor(private propertyRepo: IPropertyRepository) {}

  async listProperties(filter?: PropertyFilter): Promise<Property[]> {
    return this.propertyRepo.findAll(filter);
  }

  async getPropertyById(id: string): Promise<Property | null> {
    if (!id) throw new Error('Property ID is required');
    return this.propertyRepo.findById(id);
  }

  async getPropertyBySlug(slug: string): Promise<Property | null> {
    if (!slug) throw new Error('Slug is required');
    return this.propertyRepo.findBySlug(slug);
  }

  async createProperty(data: unknown): Promise<Property> {
    const raw = typeof data === 'object' && data !== null ? { ...(data as Record<string, unknown>) } : {};
    if (!raw.slug && typeof raw.title === 'string') {
      raw.slug = generatePropertySlug(raw.title);
    }

    const validation = validateProperty(raw);
    if (!validation.success) {
      const errorMsg = validation.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new Error(`Property Validation Error: ${errorMsg}`);
    }

    const validData: PropertyInput = validation.data;

    // Slug check
    const existing = await this.propertyRepo.findBySlug(validData.slug);
    if (existing) {
      validData.slug = `${validData.slug}-${Date.now().toString().slice(-4)}`;
    }

    return this.propertyRepo.create({
      slug: validData.slug,
      title: validData.title,
      tagline: validData.tagline,
      type: validData.type,
      location: validData.location,
      priceIdr: validData.priceIdr,
      ownership: validData.ownership,
      leaseYears: validData.leaseYears,
      landSizeM2: validData.landSizeM2,
      buildingSizeM2: validData.buildingSizeM2,
      bedrooms: validData.bedrooms,
      bathrooms: validData.bathrooms,
      roi: validData.roi,
      beachDistance: validData.beachDistance,
      airportDistance: validData.airportDistance,
      image: validData.image,
      gallery: validData.gallery,
      features: validData.features,
      status: validData.status,
      isFeatured: validData.isFeatured,
    });
  }

  async updateProperty(id: string, data: Partial<Property>): Promise<Property> {
    if (!id) throw new Error('Property ID is required');

    const existing = await this.propertyRepo.findById(id);
    if (!existing) {
      throw new Error(`Property with ID ${id} not found`);
    }

    if (data.title && !data.slug) {
      data.slug = generatePropertySlug(data.title);
    }

    return this.propertyRepo.update(id, data);
  }

  async updatePropertyStatus(id: string, status: PropertyStatus): Promise<Property> {
    if (!['For Sale', 'Exclusive', 'Under Offer', 'Sold'].includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }
    return this.updateProperty(id, { status });
  }

  async deleteProperty(id: string): Promise<boolean> {
    if (!id) throw new Error('Property ID is required');
    return this.propertyRepo.delete(id);
  }
}
