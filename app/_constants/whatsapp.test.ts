import { describe, expect, it } from "vitest";
import { WHATSAPP_TEMPLATES } from "./whatsapp";

const rental = {
  vehicleName: "Honda Vario",
  type: "motorcycle" as const,
  transmission: "matic",
  price: "Rp150.000",
  totalPrice: "Rp450.000",
  withDriver: false,
  durationDays: 3,
  startDate: "2026-09-25",
  deliveryLocation: "Kuta Lombok",
  notes: "Two helmets",
};

describe("WHATSAPP_TEMPLATES.rental", () => {
  it("builds an English rental inquiry", () => {
    const message = WHATSAPP_TEMPLATES.rental({ lang: "en", ...rental });

    expect(message).toContain("I would like to rent a vehicle in Lombok");
    expect(message).toContain("*Service:* Self Drive");
    expect(message).toContain("*Estimated Total:* Rp450.000");
    expect(message).toContain("*Rental Duration:* 3 Days");
    expect(message).toContain("*Delivery / Handover Location:* Kuta Lombok");
    expect(message).not.toContain("Saya ingin menyewa");
  });

  it("builds an Indonesian rental inquiry", () => {
    const message = WHATSAPP_TEMPLATES.rental({ lang: "id", ...rental });

    expect(message).toContain("Saya ingin menyewa kendaraan di Lombok");
    expect(message).toContain("*Opsi:* Lepas Kunci");
    expect(message).toContain("*Total Estimasi:* Rp450.000");
    expect(message).toContain("*Durasi Sewa:* 3 Hari");
    expect(message).toContain("*Lokasi Antar / Serah Terima:* Kuta Lombok");
    expect(message).not.toContain("I would like to rent");
  });
});
