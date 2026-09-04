import { describe, it, expect } from 'vitest';
import { generateSlug, validateTourPackage, validatePricingTier } from '@/lib/domain/package.validation';

describe('Domain: Package Validation & Invariants', () => {
  it('should generate valid URL slug from package title', () => {
    expect(generateSlug('Mount Rinjani Summit Trekking 3D2N')).toBe('mount-rinjani-summit-trekking-3d2n');
    expect(generateSlug('Secret Gili: Nanggu & Sudak Tour!')).toBe('secret-gili-nanggu-sudak-tour');
  });

  it('should validate valid tour package data', () => {
    const validPackage = {
      title: 'Secret Gili Snorkeling Tour',
      slug: 'secret-gili-snorkeling-tour',
      tagline: 'Discover pristine coral reefs and uncrowded beaches in South West Lombok.',
      destination: 'Sekotong / South West Lombok',
      duration: 'Full Day (8 Hours)',
      category: 'island_hopping',
      basePriceIdr: 750000,
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      highlights: ['Gili Nanggu snorkeling', 'Gili Sudak seafood lunch'],
      included: ['Private boat', 'Snorkel gear', 'Guide'],
      excluded: ['Tips', 'Personal expenses'],
      itinerary: [
        { day: 1, title: 'Island Hopping & Reef Exploration', description: 'Depart from harbour to Gili Nanggu, Sudak, and Kedis.' },
      ],
      status: 'published',
      isFeatured: true,
    };

    const res = validateTourPackage(validPackage);
    expect(res.success).toBe(true);
  });

  it('should reject invalid package missing highlights or with negative price', () => {
    const invalidPackage = {
      title: 'Trek',
      slug: 'invalid slug with spaces',
      tagline: 'Short',
      destination: '',
      duration: '',
      category: 'unknown_cat',
      basePriceIdr: -500,
      imageUrl: 'not-a-url',
      highlights: [],
    };

    const res = validateTourPackage(invalidPackage);
    expect(res.success).toBe(false);
  });

  it('should validate pricing tier invariant (maxPax >= minPax)', () => {
    const validTier = {
      tierName: 'Duo Pax',
      minPax: 2,
      maxPax: 2,
      pricePerPaxIdr: 500000,
      discountPercent: 10,
    };

    expect(validatePricingTier(validTier).success).toBe(true);

    const invalidTier = {
      tierName: 'Broken Tier',
      minPax: 5,
      maxPax: 2, // invalid: max < min
      pricePerPaxIdr: 500000,
    };

    expect(validatePricingTier(invalidTier).success).toBe(false);
  });
});
