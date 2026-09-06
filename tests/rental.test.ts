import assert from "node:assert/strict";
import { CreateRentalVehicleSchema, UpdateRentalVehicleSchema } from "../lib/domain/rental.validation";
import { RentalMapper, DatabaseRentalVehicleRow } from "../lib/repositories/rental.mapper";
import { RentalService } from "../lib/services/rental.service";
import { IRentalRepository } from "../lib/repositories/rental.repository.interface";
import { RentalVehicle, CreateRentalVehicleDTO, UpdateRentalVehicleDTO } from "../lib/domain/rental.types";

async function runRentalTests() {
  console.log("🧪 Starting Rental Module Unit Tests...");

  // 1. Test Schema Validation
  console.log("1. Testing Validation Schemas...");
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
  const parsedMotor = CreateRentalVehicleSchema.parse(validMotor);
  assert.equal(parsedMotor.name, "Honda Vario 160");
  assert.equal(parsedMotor.type, "motorcycle");

  // Invalid validation test (negative price)
  assert.throws(() => {
    CreateRentalVehicleSchema.parse({
      ...validMotor,
      pricePerDay: -50000,
    });
  }, /Daily price must be greater than 0/);

  // Invalid type test
  assert.throws(() => {
    CreateRentalVehicleSchema.parse({
      ...validMotor,
      type: "airplane" as any,
    });
  }, /Type must be motorcycle or car/);

  // 2. Test RentalMapper
  console.log("2. Testing RentalMapper (Domain <-> DB Row)...");
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
  assert.equal(domainObj.id, "uuid-123");
  assert.equal(domainObj.name, "Toyota Fortuner");
  assert.equal(domainObj.capacityPax, 7);
  assert.equal(domainObj.pricePerDay, 800000);
  assert.equal(domainObj.priceWithDriverPerDay, 1000000);
  assert.deepEqual(domainObj.features, ["4x4", "Luxury Interior"]);

  const backToDb = RentalMapper.toDatabase(domainObj);
  assert.equal(backToDb.name, "Toyota Fortuner");
  assert.equal(backToDb.capacity_pax, 7);
  assert.equal(backToDb.price_per_day, 800000);
  assert.equal(backToDb.price_with_driver_per_day, 1000000);

  // 3. Test RentalService with Mock Repository
  console.log("3. Testing RentalService...");
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
  assert.ok(created.id);
  assert.equal(created.name, "Honda Vario 160");

  const list = await service.listVehicles();
  assert.equal(list.length, 1);

  const updated = await service.updateVehicle(created.id, { pricePerDay: 120000 });
  assert.equal(updated.pricePerDay, 120000);

  const deleted = await service.deleteVehicle(created.id);
  assert.equal(deleted, true);

  const remaining = await service.listVehicles();
  assert.equal(remaining.length, 0);

  console.log("✅ All Rental Unit Tests Passed Successfully!");
}

runRentalTests().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
