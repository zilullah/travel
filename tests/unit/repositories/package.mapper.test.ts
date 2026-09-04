import { describe, it, expect } from 'vitest';
import { PackageMapper, TourPackageRow, PricingTierRow } from '@/lib/repositories/package.mapper';
import { TourPackage, PricingTier } from '@/lib/domain/package.types';

describe('Repository: PackageMapper DTO <-> Domain', () => {
  it('should correctly map raw Supabase row to domain entity', () => {
    const rawRow: TourPackageRow = {
      id: 'pkg-123',
      slug: 'rinjani-trekking',
      title: 'Rinjani Trekking',
      tagline: 'Best mountain adventure',
      destination: 'Senaru',
      duration: '3D2N',
      category: 'adventure',
      base_price_idr: '2500000',
      image_url: 'https://images.unsplash.com/sample',
      gallery: ['https://images.unsplash.com/g1'],
      highlights: ['Crater Rim', 'Hot Springs'],
      included: ['Guide', 'Tents'],
      excluded: ['Flight'],
      itinerary: [{ day: 1, title: 'Ascent', description: 'Trek to Pos 3' }],
      status: 'published',
      is_featured: true,
      created_at: '2026-01-01T00:00:00Z',
    };

    const rawTiers: PricingTierRow[] = [
      {
        id: 'tier-1',
        package_id: 'pkg-123',
        tier_name: 'Solo',
        min_pax: 1,
        max_pax: 1,
        price_per_pax_idr: '2500000',
        discount_percent: '0',
      },
    ];

    const domain = PackageMapper.toDomain(rawRow, rawTiers);

    expect(domain.id).toBe('pkg-123');
    expect(domain.basePriceIdr).toBe(2500000);
    expect(domain.isFeatured).toBe(true);
    expect(domain.pricingTiers).toHaveLength(1);
    expect(domain.pricingTiers?.[0].pricePerPaxIdr).toBe(2500000);
  });

  it('should correctly convert domain entity to persistence row', () => {
    const domain: Partial<TourPackage> = {
      title: 'Pink Beach Explorer',
      slug: 'pink-beach-explorer',
      basePriceIdr: 600000,
      isFeatured: false,
      status: 'draft',
    };

    const persistence = PackageMapper.toPersistence(domain);

    expect(persistence.title).toBe('Pink Beach Explorer');
    expect(persistence.slug).toBe('pink-beach-explorer');
    expect(persistence.base_price_idr).toBe(600000);
    expect(persistence.is_featured).toBe(false);
    expect(persistence.status).toBe('draft');
  });

  it('should map pricing tier domain model to persistence row', () => {
    const tier: PricingTier = {
      tierName: 'Group Saver (4-8 Pax)',
      minPax: 4,
      maxPax: 8,
      pricePerPaxIdr: 450000,
      discountPercent: 25,
    };

    const row = PackageMapper.tierToPersistence(tier, 'package-uuid-999');

    expect(row.package_id).toBe('package-uuid-999');
    expect(row.tier_name).toBe('Group Saver (4-8 Pax)');
    expect(row.min_pax).toBe(4);
    expect(row.max_pax).toBe(8);
    expect(row.price_per_pax_idr).toBe(450000);
    expect(row.discount_percent).toBe(25);
  });
});
