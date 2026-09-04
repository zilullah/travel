import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PackageService } from '@/lib/services/package.service';
import { IPackageRepository } from '@/lib/repositories/package.repository.interface';
import { TourPackage, PricingTier } from '@/lib/domain/package.types';

describe('Service: PackageService Orchestration & Business Rules', () => {
  let mockRepo: IPackageRepository;
  let service: PackageService;

  const samplePackage: TourPackage = {
    id: 'pkg-1',
    slug: 'rinjani-2d1n',
    title: 'Mount Rinjani 2D1N Trek',
    tagline: 'Short trek to crater rim',
    destination: 'Senaru',
    duration: '2D1N',
    category: 'adventure',
    basePriceIdr: 1800000,
    imageUrl: 'https://images.unsplash.com/photo-sample',
    gallery: [],
    highlights: ['Crater Rim view'],
    included: ['Tent', 'Food'],
    excluded: ['Tips'],
    itinerary: [{ day: 1, title: 'Ascend', description: 'Trek to crater' }],
    status: 'draft',
    isFeatured: false,
  };

  beforeEach(() => {
    mockRepo = {
      findAll: vi.fn().mockResolvedValue([samplePackage]),
      findById: vi.fn().mockImplementation((id: string) =>
        Promise.resolve(id === 'pkg-1' ? samplePackage : null)
      ),
      findBySlug: vi.fn().mockImplementation((slug: string) =>
        Promise.resolve(slug === 'rinjani-2d1n' ? samplePackage : null)
      ),
      create: vi.fn().mockImplementation((data) => Promise.resolve({ ...data, id: 'new-id' })),
      update: vi.fn().mockImplementation((id, data) => Promise.resolve({ ...samplePackage, ...data })),
      delete: vi.fn().mockResolvedValue(true),
      getPricingTiers: vi.fn().mockResolvedValue([]),
      savePricingTiers: vi.fn().mockImplementation((_, tiers) => Promise.resolve(tiers)),
    };
    service = new PackageService(mockRepo);
  });

  it('should list all packages via repository', async () => {
    const list = await service.listPackages();
    expect(list).toHaveLength(1);
    expect(mockRepo.findAll).toHaveBeenCalled();
  });

  it('should get package by id or throw on empty id', async () => {
    const pkg = await service.getPackageById('pkg-1');
    expect(pkg?.title).toBe('Mount Rinjani 2D1N Trek');

    await expect(service.getPackageById('')).rejects.toThrow('Package ID is required');
  });

  it('should create package and automatically generate slug if not provided', async () => {
    const newPkgInput = {
      title: 'South Lombok Surf Safari',
      tagline: 'Ride world class waves in Gerupuk and Tanjung Aan',
      destination: 'Kuta / Gerupuk',
      duration: 'Full Day',
      category: 'adventure',
      basePriceIdr: 850000,
      imageUrl: 'https://images.unsplash.com/surf',
      highlights: ['Secret surf spots', 'Boat transfer included'],
      included: ['Board rental', 'Surf coach'],
      excluded: ['Lunch'],
      itinerary: [{ day: 1, title: 'Surf Session', description: 'Morning and afternoon waves' }],
      status: 'draft',
      isFeatured: false,
    };

    const created = await service.createPackage(newPkgInput);
    expect(created.id).toBe('new-id');
    expect(mockRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: 'south-lombok-surf-safari',
      })
    );
  });

  it('should update package status to published', async () => {
    const updated = await service.updatePackageStatus('pkg-1', 'published');
    expect(mockRepo.update).toHaveBeenCalledWith('pkg-1', { status: 'published' });
    expect(updated.status).toBe('published');
  });

  it('should validate and reject pricing tiers with invalid pax bounds', async () => {
    const invalidTiers: PricingTier[] = [
      {
        tierName: 'Broken Tier',
        minPax: 10,
        maxPax: 2, // invalid min > max
        pricePerPaxIdr: 400000,
      },
    ];

    await expect(service.updatePricingTiers('pkg-1', invalidTiers)).rejects.toThrow(
      'cannot be greater than maxPax'
    );
  });
});
