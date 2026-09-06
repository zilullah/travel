export type VehicleType = "motorcycle" | "car";
export type TransmissionType = "matic" | "manual";

export interface RentalVehicle {
  id: string;
  name: string;
  type: VehicleType;
  transmission: TransmissionType;
  capacityPax: number;
  pricePerDay: number;
  priceWithDriverPerDay?: number | null;
  imageUrl: string;
  features: string[];
  isActive: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateRentalVehicleDTO = Omit<RentalVehicle, "id" | "createdAt" | "updatedAt">;
export type UpdateRentalVehicleDTO = Partial<CreateRentalVehicleDTO>;
