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
  const [deliveryLocation, setDeliveryLocation] = useState<string>(
    "Bandara Lombok (BIL)",
  );
  const [specialNotes, setSpecialNotes] = useState<string>("");

  const baseDailyPrice =
    withDriver && vehicle.priceWithDriverPerDay
      ? vehicle.priceWithDriverPerDay
      : vehicle.pricePerDay;

  const totalPrice = baseDailyPrice * Math.max(1, durationDays);

  const handleBookRental = (e: React.FormEvent) => {
    e.preventDefault();
    const serviceType = withDriver
      ? "Dengan Supir"
      : "Lepas Kunci (Self Drive)";
    const message = `Halo Lombok Travel Organizer, saya ingin booking rental kendaraan:

*Unit:* ${vehicle.name} (${vehicle.type === "motorcycle" ? "Motor" : "Mobil"})
*Layanan:* ${serviceType}
*Durasi:* ${durationDays} Hari
*Mulai Tanggal:* ${startDate || "Segera / Flexible"}
*Lokasi Serah Terima / Antar:* ${deliveryLocation || "Bandara / Hotel"}
*Estimasi Biaya:* ${formatIDR(totalPrice)} (${formatIDR(baseDailyPrice)} / hari)
*Catatan Tambahan:* ${specialNotes || "-"}

Mohon info ketersediaan unit dan konfirmasi pemesanan. Terima kasih!`;

    const url = `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="bg-white p-6 rounded-[23px] border border-[#BAE6FD] shadow-md space-y-6 sticky top-28">
      <div>
        <span className="text-[11px] text-[#6B8CA5] uppercase font-bold tracking-wider block">
          {withDriver ? t("rental.with_driver") : t("rental.self_drive")}
        </span>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-3xl font-black text-[#0284C7]">
            {formatIDR(baseDailyPrice)}
          </span>
          <span className="text-xs text-[#5B7C93] font-medium">
            {t("rental.per_day")}
          </span>
        </div>
      </div>

      {/* Option: With Driver if available */}
      {vehicle.priceWithDriverPerDay && (
        <div className="p-3 bg-[#F0F9FF] rounded-2xl border border-[#BAE6FD] space-y-2">
          <label className="text-xs font-bold text-[#0C4A6E] uppercase block">
            Pilihan Layanan
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setWithDriver(false)}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                !withDriver
                  ? "bg-[#0284C7] text-white shadow-sm"
                  : "bg-white text-[#486581] border border-[#BAE6FD] hover:bg-[#F7FCFF]"
              }`}
            >
              Lepas Kunci
            </button>
            <button
              type="button"
              onClick={() => setWithDriver(true)}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                withDriver
                  ? "bg-[#0284C7] text-white shadow-sm"
                  : "bg-white text-[#486581] border border-[#BAE6FD] hover:bg-[#F7FCFF]"
              }`}
            >
              + Supir ({formatIDR(vehicle.priceWithDriverPerDay)}/hari)
            </button>
          </div>
        </div>
      )}

      {/* Reservation Form */}
      <form onSubmit={handleBookRental} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-[#0C4A6E] uppercase block mb-1">
              Tanggal Mulai
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-[#F7FCFF] border border-[#BAE6FD] rounded-xl px-3 py-2 text-xs text-[#0C4A6E] focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#0C4A6E] uppercase block mb-1">
              Durasi (Hari)
            </label>
            <input
              type="number"
              min={1}
              max={30}
              required
              value={durationDays}
              onChange={(e) =>
                setDurationDays(Math.max(1, Number(e.target.value)))
              }
              className="w-full bg-[#F7FCFF] border border-[#BAE6FD] rounded-xl px-3 py-2 text-xs text-[#0C4A6E] focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-[#0C4A6E] uppercase block mb-1">
            Lokasi Antar / Serah Terima
          </label>
          <input
            type="text"
            required
            placeholder="Bandara BIL / Hotel di Kuta / Mataram..."
            value={deliveryLocation}
            onChange={(e) => setDeliveryLocation(e.target.value)}
            className="w-full bg-[#F7FCFF] border border-[#BAE6FD] rounded-xl px-3.5 py-2 text-xs text-[#0C4A6E] focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[#0C4A6E] uppercase block mb-1">
            Catatan Tambahan
          </label>
          <textarea
            rows={2}
            placeholder="Jumlah helm, permintaan waktu antar khusus..."
            value={specialNotes}
            onChange={(e) => setSpecialNotes(e.target.value)}
            className="w-full bg-[#F7FCFF] border border-[#BAE6FD] rounded-xl px-3.5 py-2 text-xs text-[#0C4A6E] focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
          />
        </div>

        {/* Total Summary */}
        <div className="p-3 bg-[#F0F9FF] rounded-xl border border-[#BAE6FD] flex items-center justify-between">
          <span className="text-xs font-bold text-[#0C4A6E]">
            Total Estimasi ({durationDays} Hari):
          </span>
          <span className="text-base font-black text-[#0284C7]">
            {formatIDR(totalPrice)}
          </span>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
        >
          <WhatsAppSvg className="w-4 h-4" />
          <span>{t("rental.book_now")}</span>
        </button>
      </form>

      <p className="text-[11px] text-center text-[#6B8CA5] leading-relaxed">
        ⚡ Gratis antar & jemput unit di Bandara Internasional Lombok (BIL) atau
        hotel area Kuta Lombok.
      </p>
    </div>
  );
};
