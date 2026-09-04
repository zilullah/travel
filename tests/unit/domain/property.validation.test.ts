import { describe, it, expect } from 'vitest';
import { validateProperty, generatePropertySlug } from '@/lib/domain/property.validation';
import { Property } from '@/lib/domain/property.types';

describe('Property Domain & Validation', () => {
  it('should generate a valid slug from title', () => {
    const title = 'The Cliffside Oasis 3-Bedroom Luxury Villa';
    const slug = generatePropertySlug(title);
    expect(slug).toBe('the-cliffside-oasis-3-bedroom-luxury-villa');
  });

  it('should validate a complete valid villa property', () => {
    const validData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'> = {
      slug: 'cliffside-oasis-villa',
      title: 'Cliffside Oasis Villa',
      tagline: 'Luxury 3-bedroom infinity pool villa in Kuta Mandalika',
      type: 'villa',
      location: 'Kuta Mandalika',
      priceIdr: 4500000000,
      ownership: 'Leasehold (HGB)',
      leaseYears: 30,
      landSizeM2: 500,
      buildingSizeM2: 280,
      bedrooms: 3,
      bathrooms: 4,
      roi: '14% - 18% Net Annual ROI',
      beachDistance: '4 Mins to Kuta Beach',
      airportDistance: '20 Mins to Airport',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811',
      features: ['Infinity Ocean-View Pool', 'Fully Furnished Turnkey'],
      status: 'Exclusive',
      isFeatured: true,
    };

    const result = validateProperty(validData);
    expect(result.success).toBe(true);
  });

  it('should reject invalid negative price or land size', () => {
    const invalidData = {
      slug: 'invalid-property',
      title: 'Invalid Property',
      tagline: 'Test',
      type: 'villa',
      location: 'Kuta',
      priceIdr: -1000,
      ownership: 'Freehold (SHM)',
      landSizeM2: -50,
      roi: '10%',
      beachDistance: '5 Mins',
      airportDistance: '20 Mins',
      image: 'https://example.com/img.jpg',
      features: [],
      status: 'For Sale',
    };

    const result = validateProperty(invalidData);
    expect(result.success).toBe(false);
  });
});
