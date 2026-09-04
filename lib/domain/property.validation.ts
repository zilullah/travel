import { z } from 'zod';

export const PropertySchema = z.object({
  id: z.string().optional(),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  title: z.string().min(3, 'Title is required'),
  tagline: z.string().min(5, 'Tagline is required'),
  type: z.enum(['villa', 'land', 'commercial']),
  location: z.string().min(2, 'Location is required'),
  priceIdr: z.number().min(0, 'Price must be positive'),
  ownership: z.enum(['Freehold (SHM)', 'Leasehold (HGB)', 'PMA Foreign Investment']),
  leaseYears: z.number().int().min(1).optional(),
  landSizeM2: z.number().int().min(1, 'Land size must be > 0'),
  buildingSizeM2: z.number().int().min(1).optional(),
  bedrooms: z.number().int().min(1).optional(),
  bathrooms: z.number().int().min(1).optional(),
  roi: z.string().min(2, 'ROI description is required'),
  beachDistance: z.string().min(2, 'Beach distance is required'),
  airportDistance: z.string().min(2, 'Airport distance is required'),
  image: z.string().url('Main image URL must be valid'),
  gallery: z.array(z.string().url()).default([]),
  features: z.array(z.string()).min(1, 'At least 1 feature is required'),
  status: z.enum(['For Sale', 'Exclusive', 'Under Offer', 'Sold']).default('For Sale'),
  isFeatured: z.boolean().default(false),
});

export type PropertyInput = z.infer<typeof PropertySchema>;

export function generatePropertySlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function validateProperty(data: unknown) {
  return PropertySchema.safeParse(data);
}
