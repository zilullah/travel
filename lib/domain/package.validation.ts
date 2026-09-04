import { z } from 'zod';

export const ItineraryItemSchema = z.object({
  day: z.number().int().min(1, 'Day must be at least 1'),
  title: z.string().min(2, 'Itinerary title is required'),
  description: z.string().min(5, 'Itinerary description is required'),
});

export const PricingTierSchema = z.object({
  id: z.string().optional(),
  packageId: z.string().optional(),
  tierName: z.string().min(1, 'Tier name is required'),
  minPax: z.number().int().min(1, 'Min pax must be at least 1'),
  maxPax: z.number().int().min(1, 'Max pax must be at least 1'),
  pricePerPaxIdr: z.number().min(0, 'Price per pax must be >= 0'),
  discountPercent: z.number().min(0).max(100).optional().default(0),
}).refine((data) => data.maxPax >= data.minPax, {
  message: 'Max pax must be greater than or equal to min pax',
  path: ['maxPax'],
});

export const TourPackageSchema = z.object({
  id: z.string().optional(),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  tagline: z.string().min(5, 'Tagline must be at least 5 characters'),
  destination: z.string().min(2, 'Destination is required'),
  duration: z.string().min(2, 'Duration is required (e.g. 3D2N)'),
  category: z.enum(['adventure', 'island_hopping', 'cultural', 'custom', 'honeymoon']),
  basePriceIdr: z.number().min(0, 'Base price must be positive'),
  imageUrl: z.string().url('Image URL must be a valid URL'),
  gallery: z.array(z.string().url()).default([]),
  highlights: z.array(z.string()).min(1, 'At least 1 highlight is required'),
  included: z.array(z.string()).default([]),
  excluded: z.array(z.string()).default([]),
  itinerary: z.array(ItineraryItemSchema).default([]),
  status: z.enum(['published', 'draft', 'archived']).default('draft'),
  isFeatured: z.boolean().default(false),
  pricingTiers: z.array(PricingTierSchema).optional(),
});

export type TourPackageInput = z.infer<typeof TourPackageSchema>;
export type PricingTierInput = z.infer<typeof PricingTierSchema>;

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function validateTourPackage(data: unknown) {
  return TourPackageSchema.safeParse(data);
}

export function validatePricingTier(data: unknown) {
  return PricingTierSchema.safeParse(data);
}
