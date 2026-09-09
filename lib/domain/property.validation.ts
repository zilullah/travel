import { z } from 'zod';

export const PropertySchema = z.object({
  id: z.string().optional(),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters'),
  title: z.string().min(2, 'Title is required'),
  tagline: z.string().optional().default(''),
  type: z.enum(['villa', 'land', 'commercial']),
  location: z.string().min(2, 'Location is required'),
  priceIdr: z.number().min(0, 'Price must be positive'),
  ownership: z.enum(['Freehold (SHM)', 'Leasehold (HGB)', 'PMA Foreign Investment']),
  leaseYears: z.number().int().min(1).optional().nullable(),
  landSizeM2: z.number().min(1, 'Land size must be > 0'),
  buildingSizeM2: z.number().min(1).optional().nullable(),
  bedrooms: z.number().int().min(1).optional().nullable(),
  bathrooms: z.number().int().min(1).optional().nullable(),
  roi: z.string().optional().default('12% - 16% Net ROI'),
  beachDistance: z.string().optional().default('5 Mins'),
  airportDistance: z.string().optional().default('25 Mins'),
  image: z.string().min(1, 'Main image is required'),
  gallery: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
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
