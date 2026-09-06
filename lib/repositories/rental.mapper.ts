import { RentalVehicle } from "../domain/rental.types";

export interface DatabaseRentalVehicleRow {
  id: string;
  name: string;
  type: string;
  transmission: string;
  capacity_pax: number;
  price_per_day: number;
  price_with_driver_per_day: number | null;
  image_url: string;
  features: string[] | null;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export class RentalMapper {
  static toDomain(row: DatabaseRentalVehicleRow): RentalVehicle {
    return {
      id: row.id,
      name: row.name,
      type: (row.type === "car" ? "car" : "motorcycle") as "motorcycle" | "car",
      transmission: (row.transmission === "manual" ? "manual" : "matic") as "matic" | "manual",
      capacityPax: Number(row.capacity_pax || 1),
      pricePerDay: Number(row.price_per_day || 0),
      priceWithDriverPerDay: row.price_with_driver_per_day ? Number(row.price_with_driver_per_day) : null,
      imageUrl: row.image_url || "",
      features: Array.isArray(row.features) ? row.features : [],
      isActive: Boolean(row.is_active),
      displayOrder: Number(row.display_order || 0),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  static toDatabase(domain: Partial<RentalVehicle>): Partial<DatabaseRentalVehicleRow> {
    const row: Partial<DatabaseRentalVehicleRow> = {};
    if (domain.id !== undefined) row.id = domain.id;
    if (domain.name !== undefined) row.name = domain.name;
    if (domain.type !== undefined) row.type = domain.type;
    if (domain.transmission !== undefined) row.transmission = domain.transmission;
    if (domain.capacityPax !== undefined) row.capacity_pax = domain.capacityPax;
    if (domain.pricePerDay !== undefined) row.price_per_day = domain.pricePerDay;
    if (domain.priceWithDriverPerDay !== undefined) row.price_with_driver_per_day = domain.priceWithDriverPerDay;
    if (domain.imageUrl !== undefined) row.image_url = domain.imageUrl;
    if (domain.features !== undefined) row.features = domain.features;
    if (domain.isActive !== undefined) row.is_active = domain.isActive;
    if (domain.displayOrder !== undefined) row.display_order = domain.displayOrder;
    return row;
  }
}
