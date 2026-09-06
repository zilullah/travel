import { TransferLocation, TransferVehicle, TransferLocationType } from '../domain/transfer.types';

export interface TransferLocationRow {
  id: string;
  name: string;
  location_type: TransferLocationType;
  area: string;
  is_active: boolean;
  display_order: number;
  created_at?: string;
}

export interface TransferVehicleRow {
  id: string;
  name: string;
  category: string;
  capacity_pax: number;
  base_rate_idr: number;
  image_url: string | null;
  is_active: boolean;
  created_at?: string;
}

export class TransferMapper {
  static locationToDomain(row: TransferLocationRow): TransferLocation {
    return {
      id: row.id,
      name: row.name,
      locationType: row.location_type,
      area: row.area,
      isActive: Boolean(row.is_active),
      displayOrder: Number(row.display_order || 0),
      createdAt: row.created_at,
    };
  }

  static locationToPersistence(domain: Partial<TransferLocation>): Partial<TransferLocationRow> {
    const row: Partial<TransferLocationRow> = {};
    if (domain.name !== undefined) row.name = domain.name;
    if (domain.locationType !== undefined) row.location_type = domain.locationType;
    if (domain.area !== undefined) row.area = domain.area;
    if (domain.isActive !== undefined) row.is_active = domain.isActive;
    if (domain.displayOrder !== undefined) row.display_order = domain.displayOrder;
    return row;
  }

  static vehicleToDomain(row: TransferVehicleRow): TransferVehicle {
    return {
      id: row.id,
      name: row.name,
      category: row.category,
      capacityPax: Number(row.capacity_pax),
      baseRateIdr: Number(row.base_rate_idr),
      imageUrl: row.image_url || undefined,
      isActive: Boolean(row.is_active),
      createdAt: row.created_at,
    };
  }

  static vehicleToPersistence(domain: Partial<TransferVehicle>): Partial<TransferVehicleRow> {
    const row: Partial<TransferVehicleRow> = {};
    if (domain.name !== undefined) row.name = domain.name;
    if (domain.category !== undefined) row.category = domain.category;
    if (domain.capacityPax !== undefined) row.capacity_pax = domain.capacityPax;
    if (domain.baseRateIdr !== undefined) row.base_rate_idr = domain.baseRateIdr;
    if (domain.imageUrl !== undefined) row.image_url = domain.imageUrl || null;
    if (domain.isActive !== undefined) row.is_active = domain.isActive;
    return row;
  }
}
