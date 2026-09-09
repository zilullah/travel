import { SupabaseClient } from "@supabase/supabase-js";
import { IRentalRepository } from "./rental.repository.interface";
import { RentalVehicle, CreateRentalVehicleDTO, UpdateRentalVehicleDTO } from "../domain/rental.types";
import { RentalMapper, DatabaseRentalVehicleRow } from "./rental.mapper";

export class SupabaseRentalRepository implements IRentalRepository {
  constructor(private client: SupabaseClient) {}

  async findAll(onlyActive: boolean = false): Promise<RentalVehicle[]> {
    let query = this.client
      .from("rental_vehicles")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (onlyActive) {
      query = query.eq("is_active", true);
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(`Failed to fetch rental vehicles: ${error.message}`);
    }

    return (data || []).map((row) => RentalMapper.toDomain(row as DatabaseRentalVehicleRow));
  }

  async findById(id: string): Promise<RentalVehicle | null> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let query = this.client.from("rental_vehicles").select("*");
    if (isUuid) {
      query = query.eq("id", id);
    } else {
      return null;
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch rental vehicle ${id}: ${error.message}`);
    }

    return data ? RentalMapper.toDomain(data as DatabaseRentalVehicleRow) : null;
  }

  async create(payload: CreateRentalVehicleDTO): Promise<RentalVehicle> {
    const dbPayload = RentalMapper.toDatabase(payload);
    const { data, error } = await this.client
      .from("rental_vehicles")
      .insert(dbPayload)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create rental vehicle: ${error.message}`);
    }

    return RentalMapper.toDomain(data as DatabaseRentalVehicleRow);
  }

  async update(id: string, payload: UpdateRentalVehicleDTO): Promise<RentalVehicle> {
    const dbPayload = RentalMapper.toDatabase(payload);
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    // Check if item exists in database or was from fallback dataset
    let checkQuery = this.client.from("rental_vehicles").select("id");
    if (isUuid) {
      checkQuery = checkQuery.eq("id", id);
    } else {
      checkQuery = checkQuery.eq("name", payload.name || "");
    }

    const { data: existing } = await checkQuery.maybeSingle();

    if (!existing) {
      const { data, error } = await this.client
        .from("rental_vehicles")
        .insert({
          name: payload.name || "Rental Vehicle",
          type: payload.type || "motorcycle",
          transmission: payload.transmission || "matic",
          capacity_pax: payload.capacityPax || 2,
          price_per_day: payload.pricePerDay || 100000,
          price_with_driver_per_day: payload.priceWithDriverPerDay ?? null,
          image_url:
            payload.imageUrl ||
            "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
          features: payload.features || [],
          is_active: payload.isActive ?? true,
          display_order: payload.displayOrder ?? 0,
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to save new rental vehicle: ${error.message}`);
      }

      return RentalMapper.toDomain(data as DatabaseRentalVehicleRow);
    }

    const realId = existing.id;
    const { data, error } = await this.client
      .from("rental_vehicles")
      .update(dbPayload)
      .eq("id", realId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update rental vehicle ${id}: ${error.message}`);
    }

    return RentalMapper.toDomain(data as DatabaseRentalVehicleRow);
  }

  async delete(id: string): Promise<boolean> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (!isUuid) {
      return true;
    }

    const { error } = await this.client
      .from("rental_vehicles")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete rental vehicle ${id}: ${error.message}`);
    }

    return true;
  }
}
