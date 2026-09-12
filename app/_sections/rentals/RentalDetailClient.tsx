"use client";

import React, { useState } from "react";
import { RentalVehicle } from "@/lib/domain/rental.types";
import { formatIDR } from "@/app/_lib/utils";
import { WHATSAPP_CONFIG } from "@/app/_constants/whatsapp";
import { useLanguage } from "@/app/_context/LanguageContext";
import { WhatsAppSvg } from "@/app/_sections/rentals/rental.icons";
import { Button } from "@/app/_components/ui/Button";

interface RentalDetailClientProps {
  vehicle: RentalVehicle;
}

export const RentalDetailClient: React.FC<RentalDetailClientProps> = ({
  vehicle,
}) => {
  const { t } = useLanguage();
  const [withDriver, setWithDriver] = useState<boolean>(false);
  const [durationDays, setDurationDays] = useState<number>(1);
  const [startDate, setStartDate] = useState<string>("");
  const [deliveryLocation, setDeliveryLocation] = useState<string>("Bandara Lombok (BIL)");
  const [specialNotes, setSpecialNotes] = useState<string>("");

  const baseDailyPrice = withDriver && vehicle.priceWithDriverPerDay
    ? vehicle.priceWithDriverPerDay
    : vehicle.pricePerDay;

  const totalPrice = baseDailyPrice * Math.max(1, durationDays);

  const handleBooking = () => {
    const serviceType = withDriver ? "Dengan Supir" : "Lepas Kunci";
    const message = `Halo Lombok Travel Organizer, saya ingin sewa unit:
- Unit: ${vehicle.name} (${vehicle.type === "motorcycle" ? "Motor" : "Mobil"})
- Layanan: ${serviceType}
- Durasi: ${durationDays} Hari (Mulai: ${startDate || "Fleksibel / Belum Ditentukan"})
- Lokasi Serah Terima: ${deliveryLocation}
- Estimasi Biaya: ${formatIDR(totalPrice)}
${specialNotes ? `- Catatan: ${specialNotes}` : ""}

Mohon konfirmasi ketersediaan unit. Terima kasih.`;

    const url = `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="bg-white p-6 rounded-[23px] border border-[#BAE6FD] shadow-sm space-y-6 sticky top-28">
      {/* Price Summary */}
      <div>
        <span className="text-xs text-[#6B8CA5] uppercase font-bold block">
          Tarif Sewa Harian
        </span>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-3xl font-black text-[#0C4A6E]">
            {formatIDR(baseDailyPrice)}
          </span>
          <span className="text-xs text-[#6B8CA5] font-semibold">
            {t("rental.per_day")}
          </span>
        </div>
      </div>

      {/* Driver Option for Cars */}
      {vehicle.type === "car" && vehicle.priceWithDriverPerDay && (
        <div className="space-y-2 pt-2 border-t border-[#EFF8FF]">
          <label className="text-xs font-bold text-[#0C4A6E] uppercase block">
            Pilihan Layanan
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setWithDriver(false)}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                !withDriver
                  ? "border-[#0284C7] bg-[#F0F9FF] text-[#0C4A6E] ring-1 ring-[#0284C7]"
                  : "border-[#BAE6FD] hover:bg-[#F7FCFF] text-[#5B7C93]"
              }`}
            >
              Lepas Kunci
            </button>
            <button
              type="button"
              onClick={() => setWithDriver(true)}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                withDriver
                  ? "border-[#0284C7] bg-[#F0F9FF] text-[#0C4A6E] ring-1 ring-[#0284C7]"
                  : "border-[#BAE6FD] hover:bg-[#F7FCFF] text-[#5B7C93]"
              }`}
            >
              + Supir ({formatIDR(vehicle.priceWithDriverPerDay)}/hr)
            </button>
          </div>
        </div>
      )}

      {/* Duration & Dates */}
      <div className="space-y-3 pt-2 border-t border-[#EFF8FF]">
        <div>
          <label className="text-xs font-semibold text-[#0C4A6E] block mb-1">
            Durasi Sewa (Hari)
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDurationDays((d) => Math.max(1, d - 1))}
              className="w-9 h-9 rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] font-black text-[#0284C7] flex items-center justify-center hover:bg-[#BAE6FD]"
            >
              -
            </button>
            <span className="text-sm font-bold text-[#0C4A6E] min-w-[50px] text-center">
              {durationDays} Hari
            </span>
            <button
              type="button"
              onClick={() => setDurationDays((d) => d + 1)}
              className="w-9 h-9 rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] font-black text-[#0284C7] flex items-center justify-center hover:bg-[#BAE6FD]"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-[#0C4A6E] block mb-1">
            Tanggal Mulai Sewa
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full text-xs p-2.5 rounded-xl border border-[#BAE6FD] bg-[#F7FCFF] focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
          />
        </div>

        <div>
          <label htmlFor="delivery-location" className="text-xs font-semibold text-[#0C4A6E] block mb-1">
            Lokasi Pengantaran / Penyerahan
          </label>
          <input
            id="delivery-location"
            name="deliveryLocation"
            type="text"
            value={deliveryLocation}
            onChange={(e) => setDeliveryLocation(e.target.value)}
            placeholder="Masukkan nama hotel, bandara, atau alamat lengkap"
            className="w-full text-xs p-2.5 rounded-xl border border-[#BAE6FD] bg-[#F7FCFF] focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[#0C4A6E] block mb-1">
            Catatan Khusus (Opsional)
          </label>
          <textarea
            rows={2}
            value={specialNotes}
            onChange={(e) => setSpecialNotes(e.target.value)}
            placeholder="Nomor penerbangan, request helm ukuran L/M, dll..."
            className="w-full text-xs p-2.5 rounded-xl border border-[#BAE6FD] bg-[#F7FCFF] focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
          />
        </div>
      </div>

      {/* Total Calculation */}
      <div className="p-3.5 bg-[#F0F9FF] rounded-xl border border-[#BAE6FD] flex items-center justify-between">
        <div>
          <span className="text-[10px] text-[#6B8CA5] uppercase font-bold block">
            Total Estimasi
          </span>
          <span className="text-xs text-[#5B7C93]">
            {durationDays} hari × {formatIDR(baseDailyPrice)}
          </span>
        </div>
        <div className="text-right">
          <span className="text-lg font-black text-[#0284C7]">
            {formatIDR(totalPrice)}
          </span>
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={handleBooking}
        className="shadow-md flex items-center justify-center gap-2"
      >
        <WhatsAppSvg className="w-5 h-5" />
        <span>Sewa via WhatsApp</span>
      </Button>

      <p className="text-[11px] text-[#6B8CA5] text-center leading-relaxed">
        Pembayaran fleksibel dan aman saat serah terima unit.
      </p>
    </div>
  );
};
