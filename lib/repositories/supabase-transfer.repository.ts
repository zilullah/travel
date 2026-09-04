import { SupabaseClient } from '@supabase/supabase-js';
import { ITransferRepository } from './transfer.repository.interface';
import { TransferLocation, TransferVehicle, TransferLocationType } from '../domain/transfer.types';
import { TransferMapper } from './transfer.mapper';

export class SupabaseTransferRepository implements ITransferRepository {
  constructor(private supabase: SupabaseClient) {}

  async findAllLocations(type?: TransferLocationType): Promise<TransferLocation[]> {
    let query = this.supabase
      .from('transfer_locations')
      .select('*')
      .order('display_order', { ascending: true });

    if (type && type !== 'both') {
      query = query.or(`location_type.eq.${type},location_type.eq.both`);
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(`Failed to fetch transfer locations: ${error.message}`);
    }

    return (data || []).map(TransferMapper.locationToDomain);
  }

  async createLocation(loc: Omit<TransferLocation, 'id' | 'createdAt'>): Promise<TransferLocation> {
    const row = TransferMapper.locationToPersistence(loc);
    const { data, error } = await this.supabase
      .from('transfer_locations')
      .insert(row)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to create transfer location: ${error?.message}`);
    }

    return TransferMapper.locationToDomain(data);
  }

  async updateLocation(id: string, loc: Partial<TransferLocation>): Promise<TransferLocation> {
    const row = TransferMapper.locationToPersistence(loc);
    const { data, error } = await this.supabase
      .from('transfer_locations')
      .update(row)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to update transfer location: ${error?.message}`);
    }

    return TransferMapper.locationToDomain(data);
  }

  async deleteLocation(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('transfer_locations')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete transfer location: ${error.message}`);
    }
    return true;
  }

  async findAllVehicles(): Promise<TransferVehicle[]> {
    const { data, error } = await this.supabase
      .from('transfer_vehicles')
      .select('*')
      .order('capacity_pax', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch vehicles: ${error.message}`);
    }

    return (data || []).map(TransferMapper.vehicleToDomain);
  }

  async createVehicle(veh: Omit<TransferVehicle, 'id' | 'createdAt'>): Promise<TransferVehicle> {
    const row = TransferMapper.vehicleToPersistence(veh);
    const { data, error } = await this.supabase
      .from('transfer_vehicles')
      .insert(row)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to create vehicle: ${error?.message}`);
    }

    return TransferMapper.vehicleToDomain(data);
  }

  async updateVehicle(id: string, veh: Partial<TransferVehicle>): Promise<TransferVehicle> {
    const row = TransferMapper.vehicleToPersistence(veh);
    const { data, error } = await this.supabase
      .from('transfer_vehicles')
      .update(row)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to update vehicle: ${error?.message}`);
    }

    return TransferMapper.vehicleToDomain(data);
  }

  async deleteVehicle(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('transfer_vehicles')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete vehicle: ${error.message}`);
    }
    return true;
  }
}
