import { z } from 'zod';

export const TransferLocationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Location name is required'),
  locationType: z.enum(['pickup', 'dropoff', 'both']).default('both'),
  area: z.string().min(2, 'Area is required'),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});

export const TransferVehicleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Vehicle name is required'),
  category: z.string().min(2, 'Category is required (e.g. Comfort MPV)'),
  capacityPax: z.number().int().min(1, 'Capacity must be at least 1 pax'),
  baseRateIdr: z.number().min(0, 'Base rate must be positive'),
  imageUrl: z.string().url().optional().or(z.literal('')),
  isActive: z.boolean().default(true),
});

export function validateTransferLocation(data: unknown) {
  return TransferLocationSchema.safeParse(data);
}

export function validateTransferVehicle(data: unknown) {
  return TransferVehicleSchema.safeParse(data);
}
