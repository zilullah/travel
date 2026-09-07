"use client";

import React, { useState } from "react";
import { TourPackage } from "@/lib/domain/package.types";
import { formatIDR } from "@/app/_lib/utils";
import { buildWhatsAppLink } from "@/app/_lib/whatsapp";
import { WHATSAPP_TEMPLATES } from "@/app/_constants/whatsapp";
import { Button } from "@/app/_components/ui/Button";
import { useLanguage } from "@/app/_context/LanguageContext";

interface TourPackageDetailClientProps {
  pkg: TourPackage;
}

export const TourPackageDetailClient: React.FC<TourPackageDetailClientProps> = ({
  pkg,
}) => {
  const { t } = useLanguage();
  const tiers = pkg.pricingTiers || [];
  const [selectedTierIndex, setSelectedTierIndex] = useState<number>(0);
  const [tripDate, setTripDate] = useState<string>("");
  const [specialNotes, setSpecialNotes] = useState<string>("");

  const currentTier = tiers[selectedTierIndex] || {
    tierName: "Standard",
    minPax: 2,
    maxPax: 2,
    pricePerPaxIdr: pkg.basePriceIdr,
    discountPercent: 0,
  };

  const handleBooking = () => {
    const message = WHATSAPP_TEMPLATES.tour({
      tourTitle: pkg.title,
      duration: pkg.duration,
      date: tripDate || "Flexible / To be confirmed",
      guests: currentTier.minPax || 2,
      notes: `Tier: ${currentTier.tierName} (${formatIDR(currentTier.pricePerPaxIdr)}/pax)${specialNotes ? ` | Catatan: ${specialNotes}` : ""}`,
    });
    const waUrl = buildWhatsAppLink(message);
    window.open(waUrl, "_blank");
  };

  return (
    <div className="bg-white p-6 rounded-[23px] border border-[#BAE6FD] shadow-sm space-y-6 sticky top-28">
      <div>
        <span className="text-xs text-[#6B8CA5] uppercase font-bold block">
          {t("tour.start_from")}
        </span>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-3xl font-black text-[#0C4A6E]">
            {formatIDR(currentTier.pricePerPaxIdr)}
          </span>
          <span className="text-xs text-[#6B8CA5] font-semibold">
            {t("tour.person")}
          </span>
        </div>
      </div>

      {/* Tier Selector */}
      {tiers.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-[#EFF8FF]">
          <label className="text-xs font-bold text-[#0C4A6E] uppercase block">
            Pilihan Paket & Jumlah Peserta
          </label>
          <div className="space-y-2">
            {tiers.map((tier, idx) => {
              const isSelected = idx === selectedTierIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedTierIndex(idx)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                    isSelected
                      ? "border-[#0284C7] bg-[#F0F9FF] font-bold text-[#0C4A6E] ring-1 ring-[#0284C7]"
                      : "border-[#BAE6FD] hover:bg-[#F7FCFF] text-[#486581]"
                  }`}
                >
                  <div>
                    <div>{tier.tierName}</div>
                    <div className="text-[10px] text-[#6B8CA5]">
                      {tier.minPax === tier.maxPax
                        ? `${tier.minPax} Pax`
                        : `${tier.minPax}-${tier.maxPax} Pax`}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-[#0284C7] font-black">
                      {formatIDR(tier.pricePerPaxIdr)}
                    </span>
                    <span className="text-[10px] block text-[#6B8CA5]">/pax</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Booking Form Inputs */}
      <div className="space-y-3 pt-2 border-t border-[#EFF8FF]">
        <div>
          <label className="text-xs font-semibold text-[#0C4A6E] block mb-1">
            Rencana Tanggal Wisata
          </label>
          <input
            type="date"
            value={tripDate}
            onChange={(e) => setTripDate(e.target.value)}
            className="w-full text-xs p-2.5 rounded-xl border border-[#BAE6FD] bg-[#F7FCFF] focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[#0C4A6E] block mb-1">
            Catatan Tambahan (Opsional)
          </label>
          <textarea
            rows={2}
            value={specialNotes}
            onChange={(e) => setSpecialNotes(e.target.value)}
            placeholder="Hotel penjemputan, request khusus, dll..."
            className="w-full text-xs p-2.5 rounded-xl border border-[#BAE6FD] bg-[#F7FCFF] focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
          />
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={handleBooking}
        className="shadow-md"
      >
        <span>💬</span>
        <span>Booking Tour via WhatsApp</span>
      </Button>

      <p className="text-[11px] text-[#6B8CA5] text-center leading-relaxed">
        Fast response 24/7. Anda akan langsung terhubung dengan admin resmi Lombok Travel Organizer.
      </p>
    </div>
  );
};
