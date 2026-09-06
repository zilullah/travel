import assert from "node:assert/strict";
import { TransferLocationSchema, TransferVehicleSchema } from "../lib/domain/transfer.validation";
import { TransferMapper, TransferLocationRow, TransferVehicleRow } from "../lib/repositories/transfer.mapper";
import { TransferService } from "../lib/services/transfer.service";
import { ITransferRepository } from "../lib/repositories/transfer.repository.interface";
import { TransferLocation, TransferVehicle } from "../lib/domain/transfer.types";

async function runTransferTests() {
  console.log("🧪 Starting Transfer Module Unit Tests...");

  // 1. Validation Schemas
  const validLoc = {
    name: "Bandara Internasional Lombok (BIL)",
    locationType: "both" as const,
    area: "Praya",
    isActive: true,
    displayOrder: 1,
  };
  const parsedLoc = TransferLocationSchema.parse(validLoc);
  assert.equal(parsedLoc.name, "Bandara Internasional Lombok (BIL)");

  const validVeh = {
    name: "Toyota Innova Reborn",
    category: "Comfort MPV",
    capacityPax: 5,
    baseRateIdr: 450000,
    isActive: true,
  };
  const parsedVeh = TransferVehicleSchema.parse(validVeh);
  assert.equal(parsedVeh.category, "Comfort MPV");

  // 2. Mapper
  const locRow: TransferLocationRow = {
    id: "loc-1",
    name: "Kuta Mandalika",
    location_type: "both",
    area: "South Lombok",
    is_active: true,
    display_order: 2,
    created_at: "2026-01-01T00:00:00Z",
  };
  const locDomain = TransferMapper.locationToDomain(locRow);
  assert.equal(locDomain.id, "loc-1");
  assert.equal(locDomain.locationType, "both");

  const vehRow: TransferVehicleRow = {
    id: "veh-1",
    name: "Toyota HiAce Premio",
    category: "Executive Minivan",
    capacity_pax: 11,
    base_rate_idr: 950000,
    image_url: null,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
  };
  const vehDomain = TransferMapper.vehicleToDomain(vehRow);
  assert.equal(vehDomain.capacityPax, 11);

  // 3. Service
  const mockLocs: TransferLocation[] = [];
  const mockVehs: TransferVehicle[] = [];
  const mockRepo: ITransferRepository = {
    async findAllLocations() {
      return [...mockLocs];
    },
    async createLocation(data) {
      const item: TransferLocation = { id: `loc-${Date.now()}`, ...data };
      mockLocs.push(item);
      return item;
    },
    async updateLocation(id, data) {
      const idx = mockLocs.findIndex((x) => x.id === id);
      if (idx === -1) throw new Error("Not found");
      mockLocs[idx] = { ...mockLocs[idx], ...data };
      return mockLocs[idx];
    },
    async deleteLocation(id) {
      const idx = mockLocs.findIndex((x) => x.id === id);
      if (idx === -1) return false;
      mockLocs.splice(idx, 1);
      return true;
    },
    async findAllVehicles() {
      return [...mockVehs];
    },
    async createVehicle(data) {
      const item: TransferVehicle = { id: `veh-${Date.now()}`, ...data };
      mockVehs.push(item);
      return item;
    },
    async updateVehicle(id, data) {
      const idx = mockVehs.findIndex((x) => x.id === id);
      if (idx === -1) throw new Error("Not found");
      mockVehs[idx] = { ...mockVehs[idx], ...data };
      return mockVehs[idx];
    },
    async deleteVehicle(id) {
      const idx = mockVehs.findIndex((x) => x.id === id);
      if (idx === -1) return false;
      mockVehs.splice(idx, 1);
      return true;
    },
  };

  const service = new TransferService(mockRepo);
  const createdLoc = await service.createLocation(validLoc);
  assert.equal(createdLoc.name, "Bandara Internasional Lombok (BIL)");

  const createdVeh = await service.createVehicle(validVeh);
  assert.equal(createdVeh.name, "Toyota Innova Reborn");

  console.log("✅ All Transfer Unit Tests Passed Successfully!");
}

runTransferTests().catch((err) => {
  console.error("❌ Transfer test failed:", err);
  process.exit(1);
});
