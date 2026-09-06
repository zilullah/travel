"use client";

import React, { useState } from "react";
import { Button } from "@/app/_components/ui/Button";
import { buildWhatsAppLink } from "@/app/_lib/whatsapp";
import { WHATSAPP_TEMPLATES } from "@/app/_constants/whatsapp";
import {
  CompassIcon,
  CarIcon,
  BuildingIcon,
  SparklesIcon,
  StarIcon,
  ShieldCheckIcon,
} from "@/app/_components/ui/Icons";
import { useLanguage } from "@/app/_context/LanguageContext";

export const Hero: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"tour" | "transport" | "property">(
    "tour",
  );

  // Tour State
  const [tourDestination, setTourDestination] = useState(
    "Mount Rinjani Trekking",
  );
  const [tourDate, setTourDate] = useState("");
  const [tourGuests, setTourGuests] = useState(2);

  // Transport State
  const [pickUpLocation, setPickUpLocation] = useState(
    "Lombok International Airport (BIL)",
  );
  const [dropOffLocation, setDropOffLocation] = useState("Kuta / Mandalika");
  const [vehicleCategory, setVehicleCategory] = useState(
    "Innova Reborn (1-4 Pax)",
  );
  const [transportDate, setTransportDate] = useState("");

  // Property State
  const [propertyType, setPropertyType] = useState("Luxury Villa");
  const [propertyLocation, setPropertyLocation] = useState(
    "Kuta / South Lombok",
  );
  const [priceBudget, setPriceBudget] = useState("Rp 2.5 M - Rp 5 M");

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let message = "";

    if (activeTab === "tour") {
      message = WHATSAPP_TEMPLATES.tour({
        tourTitle: tourDestination,
        duration: "Standard",
        date: tourDate || "Flexible",
        guests: tourGuests,
        notes: `Quick Search Tour: ${tourDestination}`,
      });
    } else if (activeTab === "transport") {
      message = WHATSAPP_TEMPLATES.antarJemput({
        pickup: pickUpLocation,
        dropoff: dropOffLocation,
        vehicle: vehicleCategory,
        date: transportDate || "Hari ini / Segera",
        passengers: 2,
        notes: `Quick Pick-up Booking`,
      });
    } else {
      message = WHATSAPP_TEMPLATES.property({
        title: `${propertyType} (${propertyLocation})`,
        location: propertyLocation,
        price: priceBudget,
        notes: `Konsultasi Properti & ROI`,
      });
    }

    const waUrl = buildWhatsAppLink(message);
    window.open(waUrl, "_blank");
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden bg-gradient-to-b from-[#EFF8FF] via-[#F7FCFF] to-white">
      {/* Background Image with Light Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-10 mix-blend-multiply scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=2000&q=80')`,
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/60 via-transparent to-white" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0EA5E9]/10 border border-[#BAE6FD] text-[#0284C7] text-xs font-semibold uppercase tracking-wider">
            <SparklesIcon className="w-3.5 h-3.5 text-[#0EA5E9]" />
            <span>{t("hero.badge")}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0C4A6E] tracking-tight leading-[1.15]">
            {t("hero.title_part1")}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] via-[#0284C7] to-[#075985]">
              {t("hero.title_part2")}
            </span>
          </h1>
          <p className="text-base sm:text-lg text-[#486581] max-w-2xl mx-auto leading-relaxed">
            {t("hero.desc")}
          </p>
        </div>

        {/* Multi-Service Interactive Booking Widget */}

        {/* Sleek Minimalist Trust Strip */}
        {/* <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-medium text-[#486581]">
          <div className="flex items-center gap-2">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="w-3.5 h-3.5 fill-current text-amber-500" />
              ))}
            </div>
            <span className="font-bold text-[#0C4A6E]">4.9/5</span>
            <span className="text-[#6B8CA5]">(1,200+ Reviews)</span>
          </div>

          <div className="hidden sm:block w-1 h-1 rounded-full bg-[#BAE6FD]" />

          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="w-4 h-4 text-[#0EA5E9]" />
            <span className="text-[#0C4A6E] font-semibold">100% On-Time Pick-up Guarantee</span>
          </div>

          <div className="hidden sm:block w-1 h-1 rounded-full bg-[#BAE6FD]" />

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[#0C4A6E] font-semibold">Instant WhatsApp Concierge 24/7</span>
          </div>
        </div> */}
      </div>
    </section>
  );
};
