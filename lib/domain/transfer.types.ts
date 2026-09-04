export type TransferLocationType = 'pickup' | 'dropoff' | 'both';

export interface TransferLocation {
  id: string;
  name: string;
  locationType: TransferLocationType;
  area: string;
  isActive: boolean;
  displayOrder: number;
  createdAt?: string;
}

export interface TransferVehicle {
  id: string;
  name: string;
  category: string;
  capacityPax: number;
  baseRateIdr: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt?: string;
}
