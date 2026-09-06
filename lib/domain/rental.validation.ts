import { z } from "zod";

const sanitizeText = (val: string) => val.trim().replace(/[<>]/g, "");

export const RentalVehicleSchema = z.object({
  id: z.string().uuid("Invalid ID format").optional(),
  name: z
    .string()
    .min(2, "Vehicle name must be at least 2 characters")
    .max(120, "Vehicle name cannot exceed 120 characters")
    .transform(sanitizeText),
  type: z.enum(["motorcycle", "car"], {
    errorMap: () => ({ message: "Type must be motorcycle or car" }),
  }),
  transmission: z.enum(["matic", "manual"], {
    errorMap: () => ({ message: "Transmission must be matic or manual" }),
  }),
  capacityPax: z.number().int().positive("Capacity must be at least 1 person").max(100),
  pricePerDay: z.number().positive("Daily price must be greater than 0").max(100000000),
  priceWithDriverPerDay: z.number().positive().max(100000000).nullable().optional(),
  imageUrl: z
    .string()
    .url("Invalid Image URL format")
    .min(1, "Image URL is required")
    .max(500, "Image URL too long")
    .transform(sanitizeText),
  features: z
    .array(
      z
        .string()
        .min(1)
        .max(100)
        .transform(sanitizeText)
    )
    .default([]),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().min(0).max(9999).default(0),
});

export const CreateRentalVehicleSchema = RentalVehicleSchema.omit({ id: true });
export const UpdateRentalVehicleSchema = CreateRentalVehicleSchema.partial();

