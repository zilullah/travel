import { describe, it, expect } from "vitest";
import { CreateRentalVehicleSchema, UpdateRentalVehicleSchema } from "../lib/domain/rental.validation";
import { RentalMapper, DatabaseRentalVehicleRow } from "../lib/repositories/rental.mapper";
import { RentalService } from "../lib/services/rental.service";
import { IRentalRepository } from "../lib/repositories/rental.repository.interface";
import { RentalVehicle, CreateRentalVehicleDTO, UpdateRentalVehicleDTO } from "../lib/domain/rental.types";

describe("Rental Module Unit Tests", () => {
  const validMotor = {
    name: "Honda Vario 160",
    type: "motorcycle" as const,
    transmission: "matic" as const,
    capacityPax: 2,
    pricePerDay: 100000,
    priceWithDriverPerDay: null,
    imageUrl: "https://example.com/vario.jpg",
    features: ["2 Helm", "Jas Hujan"],
    isActive: true,
    displayOrder: 1,
  };

  it("validates rental vehicle schemas correctly", () => {
    const parsedMotor = CreateRentalVehicleSchema.parse(validMotor);
    expect(parsedMotor.name).toBe("Honda Vario 160");
    expect(parsedMotor.type).toBe("motorcycle");

    expect(() => {
      CreateRentalVehicleSchema.parse({
        ...validMotor,
        pricePerDay: -50000,
      });
    }).toThrow();

    expect(() => {
      CreateRentalVehicleSchema.parse({
        ...validMotor,
        type: "airplane" as unknown as "motorcycle" | "car",
      });
    }).toThrow();
  });

  it("maps between domain and persistence rows accurately", () => {
    const dbRow: DatabaseRentalVehicleRow = {
      id: "uuid-123",
      name: "Toyota Fortuner",
      type: "car",
      transmission: "matic",
      capacity_pax: 7,
      price_per_day: 800000,
      price_with_driver_per_day: 1000000,
      image_url: "https://example.com/fortuner.jpg",
      features: ["4x4", "Luxury Interior"],
      is_active: true,
      display_order: 5,
      created_at: "2026-01-01T00:00:00Z",
    };

    const domainObj = RentalMapper.toDomain(dbRow);
    expect(domainObj.id).toBe("uuid-123");
    expect(domainObj.name).toBe("Toyota Fortuner");
    expect(domainObj.capacityPax).toBe(7);
    expect(domainObj.pricePerDay).toBe(800000);
    expect(domainObj.priceWithDriverPerDay).toBe(1000000);
    expect(domainObj.features).toEqual(["4x4", "Luxury Interior"]);

    const backToDb = RentalMapper.toDatabase(domainObj);
    expect(backToDb.name).toBe("Toyota Fortuner");
    expect(backToDb.capacity_pax).toBe(7);
    expect(backToDb.price_per_day).toBe(800000);
    expect(backToDb.price_with_driver_per_day).toBe(1000000);
  });

  it("handles service CRUD workflows", async () => {
    const mockStorage: RentalVehicle[] = [];
    const mockRepo: IRentalRepository = {
      async findAll(onlyActive?: boolean) {
        return onlyActive ? mockStorage.filter((x) => x.isActive) : [...mockStorage];
      },
      async findById(id: string) {
        return mockStorage.find((x) => x.id === id) || null;
      },
      async create(data: CreateRentalVehicleDTO) {
        const created: RentalVehicle = {
          id: `mock-${Date.now()}`,
          ...data,
        };
        mockStorage.push(created);
        return created;
      },
      async update(id: string, data: UpdateRentalVehicleDTO) {
        const idx = mockStorage.findIndex((x) => x.id === id);
        if (idx === -1) throw new Error("Not found");
        mockStorage[idx] = { ...mockStorage[idx], ...data };
        return mockStorage[idx];
      },
      async delete(id: string) {
        const idx = mockStorage.findIndex((x) => x.id === id);
        if (idx === -1) return false;
        mockStorage.splice(idx, 1);
        return true;
      },
    };

    const service = new RentalService(mockRepo);
    const created = await service.createVehicle(validMotor);
    expect(created.id).toBeDefined();
    expect(created.name).toBe("Honda Vario 160");

    const list = await service.listVehicles();
    expect(list.length).toBe(1);

    const updated = await service.updateVehicle(created.id, { pricePerDay: 120000 });
    expect(updated.pricePerDay).toBe(120000);

    const deleted = await service.deleteVehicle(created.id);
    expect(deleted).toBe(true);

    const remaining = await service.listVehicles();
    expect(remaining.length).toBe(0);
  });
});
