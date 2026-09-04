import { ITransferRepository } from '../repositories/transfer.repository.interface';
import { TransferLocation, TransferVehicle, TransferLocationType } from '../domain/transfer.types';
import { validateTransferLocation, validateTransferVehicle } from '../domain/transfer.validation';

export class TransferService {
  constructor(private transferRepo: ITransferRepository) {}

  // Locations
  async listLocations(type?: TransferLocationType): Promise<TransferLocation[]> {
    return this.transferRepo.findAllLocations(type);
  }

  async createLocation(data: any): Promise<TransferLocation> {
    const validation = validateTransferLocation(data);
    if (!validation.success) {
      const errorMsg = validation.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new Error(`Location Validation Error: ${errorMsg}`);
    }
    return this.transferRepo.createLocation(validation.data as any);
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

  async createVehicle(data: any): Promise<TransferVehicle> {
    const validation = validateTransferVehicle(data);
    if (!validation.success) {
      const errorMsg = validation.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new Error(`Vehicle Validation Error: ${errorMsg}`);
    }
    return this.transferRepo.createVehicle(validation.data as any);
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
