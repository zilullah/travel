import { TransferLocation, TransferVehicle } from "@/lib/domain/transfer.types";
import { supabaseClient } from "@/lib/supabase/client";
import { SupabaseTransferRepository } from "@/lib/repositories/supabase-transfer.repository";
import { TransferService } from "@/lib/services/transfer.service";

export const FALLBACK_TRANSFER_LOCATIONS: TransferLocation[] = [
  {
    id: "1",
    name: "Lombok International Airport (BIL)",
    locationType: "both",
    area: "Central Lombok",
    isActive: true,
    displayOrder: 1,
  },
  {
    id: "2",
    name: "Bangsal Harbor (Boat to Gili)",
    locationType: "both",
    area: "North Lombok",
    isActive: true,
    displayOrder: 2,
  },
  {
    id: "3",
    name: "Lembar Harbor (Bali Ferry)",
    locationType: "both",
    area: "West Lombok",
    isActive: true,
    displayOrder: 3,
  },
  {
    id: "4",
    name: "Senggigi Resort Area",
    locationType: "both",
    area: "West Lombok",
    isActive: true,
    displayOrder: 4,
  },
  {
    id: "5",
    name: "Kuta Mandalika Hotel",
    locationType: "both",
    area: "South Lombok",
    isActive: true,
    displayOrder: 5,
  },
  {
    id: "6",
    name: "Senaru / Sembalun (Rinjani Base)",
    locationType: "both",
    area: "East / North Lombok",
    isActive: true,
    displayOrder: 6,
  },
];

export const FALLBACK_TRANSFER_VEHICLES: TransferVehicle[] = [
  {
    id: "1",
    name: "Toyota All New Avanza (1-4 Pax)",
    category: "Standard MPV",
    capacityPax: 4,
    baseRateIdr: 350000,
    isActive: true,
  },
  {
    id: "2",
    name: "Toyota Innova Reborn (1-4 Pax)",
    category: "Comfort MPV",
    capacityPax: 6,
    baseRateIdr: 550000,
    isActive: true,
  },
  {
    id: "3",
    name: "Toyota HiAce Commuter (7-14 Pax)",
    category: "Minibus",
    capacityPax: 14,
    baseRateIdr: 950000,
    isActive: true,
  },
  {
    id: "4",
    name: "Toyota Alphard VIP (1-5 Pax)",
    category: "Luxury MPV",
    capacityPax: 5,
    baseRateIdr: 1800000,
    isActive: true,
  },
];

export async function getTransferLocations(): Promise<TransferLocation[]> {
  try {
    const repo = new SupabaseTransferRepository(supabaseClient);
    const service = new TransferService(repo);
    const data = await service.listLocations();
    if (data && data.length > 0) return data;
  } catch (err) {
    console.warn(
      "[Transfers] Failed to fetch locations from Supabase, using fallback:",
      err,
    );
  }
  return FALLBACK_TRANSFER_LOCATIONS;
}

export async function getTransferVehicles(): Promise<TransferVehicle[]> {
  try {
    const repo = new SupabaseTransferRepository(supabaseClient);
    const service = new TransferService(repo);
    const data = await service.listVehicles();
    if (data && data.length > 0) return data;
  } catch (err) {
    console.warn(
      "[Transfers] Failed to fetch vehicles from Supabase, using fallback:",
      err,
    );
  }
  return FALLBACK_TRANSFER_VEHICLES;
}
