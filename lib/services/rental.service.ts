import { IRentalRepository } from "../repositories/rental.repository.interface";
import { RentalVehicle, CreateRentalVehicleDTO, UpdateRentalVehicleDTO } from "../domain/rental.types";
import { CreateRentalVehicleSchema, UpdateRentalVehicleSchema } from "../domain/rental.validation";

export class RentalService {
  constructor(private repo: IRentalRepository) {}

  async listVehicles(onlyActive: boolean = false): Promise<RentalVehicle[]> {
    return this.repo.findAll(onlyActive);
  }

  async getVehicle(id: string): Promise<RentalVehicle | null> {
    if (!id) throw new Error("Vehicle ID is required");
    return this.repo.findById(id);
  }

  async createVehicle(data: CreateRentalVehicleDTO): Promise<RentalVehicle> {
    const validated = CreateRentalVehicleSchema.parse(data);
    return this.repo.create(validated);
  }

  async updateVehicle(id: string, data: UpdateRentalVehicleDTO): Promise<RentalVehicle> {
    if (!id) throw new Error("Vehicle ID is required");
    const validated = UpdateRentalVehicleSchema.parse(data);
    return this.repo.update(id, validated);
  }

  async deleteVehicle(id: string): Promise<boolean> {
    if (!id) throw new Error("Vehicle ID is required");
    return this.repo.delete(id);
  }
}
