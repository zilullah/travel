import { TransferLocation, TransferVehicle, TransferLocationType } from '../domain/transfer.types';

export interface ITransferRepository {
  // Locations
  findAllLocations(type?: TransferLocationType): Promise<TransferLocation[]>;
  createLocation(loc: Omit<TransferLocation, 'id' | 'createdAt'>): Promise<TransferLocation>;
  updateLocation(id: string, loc: Partial<TransferLocation>): Promise<TransferLocation>;
  deleteLocation(id: string): Promise<boolean>;

  // Vehicles
  findAllVehicles(): Promise<TransferVehicle[]>;
  createVehicle(veh: Omit<TransferVehicle, 'id' | 'createdAt'>): Promise<TransferVehicle>;
  updateVehicle(id: string, veh: Partial<TransferVehicle>): Promise<TransferVehicle>;
  deleteVehicle(id: string): Promise<boolean>;
}
