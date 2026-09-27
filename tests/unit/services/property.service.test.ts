import { beforeEach, describe, it, expect, vi } from 'vitest';
import { PropertyService } from '@/lib/services/property.service';
import { IPropertyRepository } from '@/lib/repositories/property.repository.interface';
import { Property } from '@/lib/domain/property.types';

describe('PropertyService', () => {
  const mockProperties: Property[] = [
    {
      id: 'p1',
      slug: 'villa-1',
      title: 'Villa One',
      tagline: 'Stunning sunset villa',
      type: 'villa',
      location: 'Kuta',
      priceIdr: 4000000000,
      ownership: 'Freehold (SHM)',
      landSizeM2: 400,
      roi: '15%',
      beachDistance: '5 mins',
      airportDistance: '20 mins',
      image: 'https://example.com/1.jpg',
      features: ['Pool'],
      status: 'For Sale',
      isFeatured: true,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    },
  ];

  const mockRepo: IPropertyRepository = {
    findAll: vi.fn().mockResolvedValue(mockProperties),
    findById: vi.fn().mockImplementation((id: string) =>
      Promise.resolve(mockProperties.find((p) => p.id === id) || null)
    ),
    findBySlug: vi.fn().mockImplementation((slug: string) =>
      Promise.resolve(mockProperties.find((p) => p.slug === slug) || null)
    ),
    create: vi.fn().mockImplementation((data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) =>
      Promise.resolve({ id: 'p2', ...data, createdAt: '2026-01-01', updatedAt: '2026-01-01' })
    ),
    update: vi.fn().mockImplementation((id: string, data: Partial<Property>) =>
      Promise.resolve({ ...mockProperties[0], ...data, id })
    ),
    delete: vi.fn().mockResolvedValue(true),
  };

  const service = new PropertyService(mockRepo);

  beforeEach(() => vi.clearAllMocks());

  it('creates and updates rental listings without losing the status', async () => {
    const created = await service.createProperty({ ...mockProperties[0], status: 'For Rent' });
    expect(created.status).toBe('For Rent');
    expect(mockRepo.create).toHaveBeenCalledWith(expect.objectContaining({ status: 'For Rent' }));

    expect((await service.updateProperty('p1', { status: 'For Rent' })).status).toBe('For Rent');
    expect((await service.updatePropertyStatus('p1', 'For Rent')).status).toBe('For Rent');
  });

  it('normalizes optional null sizes when creating a rental listing', async () => {
    await service.createProperty({
      ...mockProperties[0], status: 'For Rent',
      leaseYears: null, buildingSizeM2: null, bedrooms: null, bathrooms: null,
    });
    expect(mockRepo.create).toHaveBeenCalledWith(expect.objectContaining({
      leaseYears: undefined, buildingSizeM2: undefined, bedrooms: undefined, bathrooms: undefined,
    }));
  });

  it('passes the rental filter to persistence', async () => {
    await service.listProperties({ status: 'For Rent' });
    expect(mockRepo.findAll).toHaveBeenCalledWith({ status: 'For Rent' });
  });

  it.each(['Unavailable', '', null])('rejects invalid status %s before persistence', async (status) => {
    const invalidStatus = status as Property['status'];
    await expect(service.createProperty({ ...mockProperties[0], status })).rejects.toThrow(/Validation/);
    await expect(service.updateProperty('p1', { status: invalidStatus })).rejects.toThrow('Invalid property status');
    await expect(service.updatePropertyStatus('p1', invalidStatus)).rejects.toThrow('Invalid property status');
    expect(mockRepo.create).not.toHaveBeenCalled();
    expect(mockRepo.update).not.toHaveBeenCalled();
  });

  it('rejects an undefined status in the status-only operation', async () => {
    await expect(service.updatePropertyStatus('p1', undefined as unknown as Property['status'])).rejects.toThrow('Invalid property status');
    expect(mockRepo.update).not.toHaveBeenCalled();
  });

  it('should list all properties', async () => {
    const list = await service.listProperties();
    expect(list).toHaveLength(1);
    expect(list[0].title).toBe('Villa One');
  });

  it('should throw error when creating property with invalid payload', async () => {
    await expect(
      service.createProperty({
        title: '',
        priceIdr: -500,
      })
    ).rejects.toThrow(/Property Validation Error/);
  });

  it('should create property when payload is valid', async () => {
    const created = await service.createProperty({
      slug: 'villa-two',
      title: 'Villa Two',
      tagline: 'Brand new luxury beachfront villa',
      type: 'villa',
      location: 'Selong Belanak',
      priceIdr: 5000000000,
      ownership: 'Freehold (SHM)',
      landSizeM2: 600,
      roi: '16%',
      beachDistance: '0 mins',
      airportDistance: '30 mins',
      image: 'https://example.com/2.jpg',
      features: ['Beach Access'],
      status: 'Exclusive',
    });

    expect(created.id).toBe('p2');
    expect(created.slug).toBe('villa-two');
  });

  it('should update property status', async () => {
    const updated = await service.updatePropertyStatus('p1', 'Sold');
    expect(updated.status).toBe('Sold');
  });
});
