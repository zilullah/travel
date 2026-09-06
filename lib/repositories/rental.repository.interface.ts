import { RentalVehicle, CreateRentalVehicleDTO, UpdateRentalVehicleDTO } from "../domain/rental.types";

export interface IRentalRepository {
  findAll(onlyActive?: boolean): Promise<RentalVehicle[]>;
  findById(id: string): Promise<RentalVehicle | null>;
  create(data: CreateRentalVehicleDTO): Promise<RentalVehicle>;
  update(id: string, data: UpdateRentalVehicleDTO): Promise<RentalVehicle>;
  delete(id: string): Promise<boolean>;
}
