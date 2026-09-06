"use client";

import React, { useState, useMemo } from "react";
import { RentalVehicle, VehicleType } from "@/lib/domain/rental.types";
import { VehicleCard } from "./VehicleCard";
import { Badge } from "@/app/_components/ui/Badge";
import { useLanguage } from "@/app/_context/LanguageContext";
import { MotorcycleSvg, CarSvg } from "./rental.icons";

interface VehicleRentalSectionProps {
  vehicles: RentalVehicle[];
}

export const VehicleRentalSection: React.FC<VehicleRentalSectionProps> = ({ vehicles = [] }) => {
  const { t } = useLanguage();
  const [filterType, setFilterType] = useState<"all" | VehicleType>("all");

  const filteredVehicles = useMemo(() => {
    if (filterType === "all") return vehicles;
    return vehicles.filter((v) => v.type === filterType);
  }, [vehicles, filterType]);

  return (
    <section id="rental" className="py-20 lg:py-28 bg-[#F0F9FF] text-[#0C4A6E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <Badge variant="sky">{t("rental.badge")}</Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-[#0C4A6E]">
              {t("rental.title")}
            </h2>
            <p className="text-[#486581] text-base leading-relaxed">
              {t("rental.desc")}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center p-1.5 bg-white border border-[#BAE6FD] rounded-[23px] shadow-sm self-start">
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-2 rounded-[18px] text-xs sm:text-sm font-bold transition-all ${
                filterType === "all"
                  ? "bg-[#0284C7] text-white shadow-sm"
                  : "text-[#486581] hover:text-[#0C4A6E]"
              }`}
            >
              {t("rental.tab_all")}
            </button>
            <button
              onClick={() => setFilterType("motorcycle")}
              className={`px-4 py-2 rounded-[18px] text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                filterType === "motorcycle"
                  ? "bg-[#0284C7] text-white shadow-sm"
                  : "text-[#486581] hover:text-[#0C4A6E]"
              }`}
            >
              <MotorcycleSvg className="w-4 h-4" />
              <span>{t("rental.tab_motorcycle")}</span>
            </button>
            <button
              onClick={() => setFilterType("car")}
              className={`px-4 py-2 rounded-[18px] text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                filterType === "car"
                  ? "bg-[#0284C7] text-white shadow-sm"
                  : "text-[#486581] hover:text-[#0C4A6E]"
              }`}
            >
              <CarSvg className="w-4 h-4" />
              <span>{t("rental.tab_car")}</span>
            </button>
          </div>
        </div>

        {/* Vehicles Grid */}
        {filteredVehicles.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-[23px] border border-[#BAE6FD] text-[#486581]">
            Tidak ada unit kendaraan yang tersedia pada kategori ini saat ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
