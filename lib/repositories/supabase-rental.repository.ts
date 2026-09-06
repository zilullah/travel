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
    const { data, error } = await this.client
      .from("rental_vehicles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
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
    const { data, error } = await this.client
      .from("rental_vehicles")
      .update(dbPayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update rental vehicle ${id}: ${error.message}`);
    }

    return RentalMapper.toDomain(data as DatabaseRentalVehicleRow);
  }

  async delete(id: string): Promise<boolean> {
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
