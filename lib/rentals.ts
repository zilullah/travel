import { RentalVehicle } from "./domain/rental.types";
import { supabaseClient } from "./supabase/client";
import { SupabaseRentalRepository } from "./repositories/supabase-rental.repository";
import { RentalService } from "./services/rental.service";

export const FALLBACK_RENTAL_VEHICLES: RentalVehicle[] = [
  {
    id: "m-1",
    name: "Honda Scoopy 110cc",
    type: "motorcycle",
    transmission: "matic",
    capacityPax: 2,
    pricePerDay: 85000,
    priceWithDriverPerDay: null,
    imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
    features: ["2 Helm SNI", "Jas Hujan", "Phone Holder", "Kondisi Prima"],
    isActive: true,
    displayOrder: 1,
  },
  {
    id: "m-2",
    name: "Yamaha NMAX 155cc",
    type: "motorcycle",
    transmission: "matic",
    capacityPax: 2,
    pricePerDay: 140000,
    priceWithDriverPerDay: null,
    imageUrl: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80",
    features: ["2 Helm SNI", "Jas Hujan", "Bagasi Luas", "Kenyamanan Touring"],
    isActive: true,
    displayOrder: 2,
  },
  {
    id: "m-3",
    name: "Honda PCX 160cc",
    type: "motorcycle",
    transmission: "matic",
    capacityPax: 2,
    pricePerDay: 150000,
    priceWithDriverPerDay: null,
    imageUrl: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80",
    features: ["2 Helm SNI", "Jas Hujan", "Keyless Smart Key", "Port Charger USB"],
    isActive: true,
    displayOrder: 3,
  },
  {
    id: "c-1",
    name: "Toyota All New Avanza",
    type: "car",
    transmission: "manual",
    capacityPax: 7,
    pricePerDay: 350000,
    priceWithDriverPerDay: 550000,
    imageUrl: "https://images.unsplash.com/photo-1549399573-970a87791404?auto=format&fit=crop&w=800&q=80",
    features: ["AC Double Blower", "Audio Bluetooth", "Kapasitas 7 Penumpang", "Lepas Kunci / Driver"],
    isActive: true,
    displayOrder: 4,
  },
  {
    id: "c-2",
    name: "Toyota Innova Reborn",
    type: "car",
    transmission: "matic",
    capacityPax: 7,
    pricePerDay: 550000,
    priceWithDriverPerDay: 750000,
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
    features: ["Suspensi Sangat Nyaman", "Interior Premium", "Audio Touchscreen", "Lepas Kunci / Driver"],
    isActive: true,
    displayOrder: 5,
  },
  {
    id: "c-3",
    name: "Toyota HiAce Commuter",
    type: "car",
    transmission: "manual",
    capacityPax: 14,
    pricePerDay: 950000,
    priceWithDriverPerDay: 1150000,
    imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
    features: ["Kapasitas 14 Penumpang", "AC Merata Tiap Baris", "Reclining Seats", "Termasuk Supir & BBM"],
    isActive: true,
    displayOrder: 6,
  },
];

export async function getRentalVehicles(onlyActive: boolean = true): Promise<RentalVehicle[]> {
  try {
    const repo = new SupabaseRentalRepository(supabaseClient);
    const service = new RentalService(repo);
    const data = await service.listVehicles(onlyActive);
    if (data && data.length > 0) return data;
  } catch (err) {
    console.warn("[Rentals] Failed to fetch vehicles from Supabase, using fallback:", err);
  }
  return onlyActive ? FALLBACK_RENTAL_VEHICLES.filter((v) => v.isActive) : FALLBACK_RENTAL_VEHICLES;
}
