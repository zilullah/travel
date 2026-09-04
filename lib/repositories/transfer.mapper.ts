import { TransferLocation, TransferVehicle } from '../domain/transfer.types';

export class TransferMapper {
  static locationToDomain(row: any): TransferLocation {
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

  static locationToPersistence(domain: Partial<TransferLocation>): any {
    const row: any = {};
    if (domain.name !== undefined) row.name = domain.name;
    if (domain.locationType !== undefined) row.location_type = domain.locationType;
    if (domain.area !== undefined) row.area = domain.area;
    if (domain.isActive !== undefined) row.is_active = domain.isActive;
    if (domain.displayOrder !== undefined) row.display_order = domain.displayOrder;
    return row;
  }

  static vehicleToDomain(row: any): TransferVehicle {
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

  static vehicleToPersistence(domain: Partial<TransferVehicle>): any {
    const row: any = {};
    if (domain.name !== undefined) row.name = domain.name;
    if (domain.category !== undefined) row.category = domain.category;
    if (domain.capacityPax !== undefined) row.capacity_pax = domain.capacityPax;
    if (domain.baseRateIdr !== undefined) row.base_rate_idr = domain.baseRateIdr;
    if (domain.imageUrl !== undefined) row.image_url = domain.imageUrl;
    if (domain.isActive !== undefined) row.is_active = domain.isActive;
    return row;
  }
}
