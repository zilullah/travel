import { ITransferRepository } from '../repositories/transfer.repository.interface';
import { TransferLocation, TransferVehicle, TransferLocationType } from '../domain/transfer.types';
import { validateTransferLocation, validateTransferVehicle } from '../domain/transfer.validation';

export class TransferService {
  constructor(private transferRepo: ITransferRepository) {}

  // Locations
  async listLocations(type?: TransferLocationType): Promise<TransferLocation[]> {
    return this.transferRepo.findAllLocations(type);
  }

  async createLocation(data: unknown): Promise<TransferLocation> {
    const validation = validateTransferLocation(data);
    if (!validation.success) {
      const errorMsg = validation.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new Error(`Location Validation Error: ${errorMsg}`);
    }
    const validData = validation.data;
    return this.transferRepo.createLocation({
      name: validData.name,
      locationType: validData.locationType,
      area: validData.area,
      isActive: validData.isActive,
      displayOrder: validData.displayOrder,
    });
  }

  async updateLocation(id: string, data: Partial<TransferLocation>): Promise<TransferLocation> {
    if (!id) throw new Error('Location ID is required');
    return this.transferRepo.updateLocation(id, data);
  }

  async deleteLocation(id: string): Promise<boolean> {
    if (!id) throw new Error('Location ID is required');
    return this.transferRepo.deleteLocation(id);
  }

  // Vehicles
  async listVehicles(): Promise<TransferVehicle[]> {
    return this.transferRepo.findAllVehicles();
  }

  async createVehicle(data: unknown): Promise<TransferVehicle> {
    const validation = validateTransferVehicle(data);
    if (!validation.success) {
      const errorMsg = validation.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new Error(`Vehicle Validation Error: ${errorMsg}`);
    }
    const validData = validation.data;
    return this.transferRepo.createVehicle({
      name: validData.name,
      category: validData.category,
      capacityPax: validData.capacityPax,
      baseRateIdr: validData.baseRateIdr,
      imageUrl: validData.imageUrl,
      isActive: validData.isActive,
    });
  }

  async updateVehicle(id: string, data: Partial<TransferVehicle>): Promise<TransferVehicle> {
    if (!id) throw new Error('Vehicle ID is required');
    return this.transferRepo.updateVehicle(id, data);
  }

  async deleteVehicle(id: string): Promise<boolean> {
    if (!id) throw new Error('Vehicle ID is required');
    return this.transferRepo.deleteVehicle(id);
  }
}
