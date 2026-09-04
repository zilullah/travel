import { describe, it, expect, vi } from 'vitest';
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
    create: vi.fn().mockImplementation((data: any) =>
      Promise.resolve({ id: 'p2', ...data, createdAt: '2026-01-01', updatedAt: '2026-01-01' })
    ),
    update: vi.fn().mockImplementation((id: string, data: any) =>
      Promise.resolve({ ...mockProperties[0], ...data, id })
    ),
    delete: vi.fn().mockResolvedValue(true),
  };

  const service = new PropertyService(mockRepo);

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
      } as any)
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
