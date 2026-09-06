"use client";

import React from "react";
import Image from "next/image";
import { RentalVehicle } from "@/lib/domain/rental.types";
import { formatIDR } from "@/app/_lib/utils";
import { WHATSAPP_TEMPLATES, WHATSAPP_CONFIG } from "@/app/_constants/whatsapp";
import { useLanguage } from "@/app/_context/LanguageContext";
import { MotorcycleSvg, CarSvg, UsersSvg, GearSvg, CheckCircleSvg, WhatsAppSvg } from "./rental.icons";

interface VehicleCardProps {
  vehicle: RentalVehicle;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const { t } = useLanguage();

  const handleBook = () => {
    const message = WHATSAPP_TEMPLATES.rental({
      vehicleName: vehicle.name,
      type: vehicle.type,
      transmission: vehicle.transmission,
      price: formatIDR(vehicle.pricePerDay),
    });
    const url = `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="bg-white rounded-[23px] border border-[#BAE6FD] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Vehicle Image Header */}
      <div className="relative h-52 sm:h-56 w-full bg-[#F0F9FF] overflow-hidden">
        <Image
          src={vehicle.imageUrl}
          alt={vehicle.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/90 backdrop-blur-md text-[#0284C7] shadow-sm flex items-center gap-1.5">
            {vehicle.type === "motorcycle" ? (
              <>
                <MotorcycleSvg className="w-3.5 h-3.5" />
                <span>Scooter</span>
              </>
            ) : (
              <>
                <CarSvg className="w-3.5 h-3.5" />
                <span>Car / MPV</span>
              </>
            )}
          </span>
        </div>

        <div className="absolute top-3.5 right-3.5">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#0284C7] text-white shadow-md">
            {vehicle.transmission === "matic" ? "Matic" : "Manual"}
          </span>
        </div>
      </div>

      {/* Details Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-xl font-black text-[#0C4A6E] tracking-tight group-hover:text-[#0284C7] transition-colors">
              {vehicle.name}
            </h3>
          </div>

          {/* Quick Specs */}
          <div className="flex items-center gap-4 text-xs font-semibold text-[#5B7C93] py-2 border-y border-[#E0F2FE]">
            <div className="flex items-center gap-1.5">
              <UsersSvg className="w-4 h-4 text-[#0284C7]" />
              <span>{vehicle.capacityPax} {t("rental.pax")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <GearSvg className="w-4 h-4 text-[#0284C7]" />
              <span className="capitalize">{vehicle.transmission}</span>
            </div>
          </div>

          {/* Features / Inclusions */}
          <div className="space-y-1.5 pt-1">
            {vehicle.features.slice(0, 4).map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-[#486581]">
                <span className="text-emerald-600 flex-shrink-0">
                  <CheckCircleSvg className="w-3.5 h-3.5" />
                </span>
                <span className="line-clamp-1">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-4 border-t border-[#E0F2FE] flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold text-[#5B7C93] uppercase tracking-wider">
              {t("rental.self_drive")}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-xl font-black text-[#0284C7]">
                {formatIDR(vehicle.pricePerDay)}
              </span>
              <span className="text-xs text-[#5B7C93] font-medium">{t("rental.per_day")}</span>
            </div>
            {vehicle.priceWithDriverPerDay && (
              <div className="text-[10px] text-amber-700 font-bold mt-0.5">
                +Supir: {formatIDR(vehicle.priceWithDriverPerDay)}
              </div>
            )}
          </div>

          <button
            onClick={handleBook}
            className="px-4 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 flex-shrink-0 active:scale-95"
          >
            <WhatsAppSvg className="w-4 h-4" />
            <span>{t("rental.book_now")}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
