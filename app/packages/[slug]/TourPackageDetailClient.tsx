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

  const handleBookNow = () => {
    const message = WHATSAPP_TEMPLATES.tour({
      tourTitle: pkg.title,
      duration: pkg.duration,
      date: tripDate || "Rencana Segera / Flexible",
      guests: currentTier.minPax || 2,
      notes: `Detail Page Booking\nPaket: ${pkg.title}\nTier: ${currentTier.tierName} (${formatIDR(currentTier.pricePerPaxIdr)}/pax)\nCatatan: ${specialNotes || "Tidak ada catatan"}`,
    });
    const waUrl = buildWhatsAppLink(message);
    window.open(waUrl, "_blank");
  };

  return (
    <div className="bg-white p-6 rounded-[23px] border border-[#BAE6FD] shadow-md space-y-6 sticky top-28">
      <div>
        <span className="text-[11px] text-[#6B8CA5] uppercase font-bold tracking-wider block">
          {t("tour.start_from")}
        </span>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-3xl font-black text-[#0284C7]">
            {formatIDR(currentTier.pricePerPaxIdr)}
          </span>
          <span className="text-xs text-[#5B7C93] font-medium">
            {t("tour.person")}
          </span>
        </div>
      </div>

      {/* Pricing Tiers Selection */}
      {tiers.length > 0 && (
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-[#0C4A6E] uppercase tracking-wider block">
            {t("tour.pricing_tiers")}
          </label>
          <div className="space-y-2">
            {tiers.map((tier, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedTierIndex(idx)}
                className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${
                  selectedTierIndex === idx
                    ? "border-[#0284C7] bg-[#F0F9FF] ring-2 ring-[#0284C7]/20"
                    : "border-[#E0F2FE] bg-white hover:bg-[#F7FCFF]"
                }`}
              >
                <div>
                  <div className="font-bold text-[#0C4A6E]">{tier.tierName}</div>
                  <div className="text-[10px] text-[#6B8CA5]">
                    {tier.minPax === tier.maxPax
                      ? `${tier.minPax} Pax`
                      : `${tier.minPax} - ${tier.maxPax} Pax`}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-[#0284C7]">
                    {formatIDR(tier.pricePerPaxIdr)}
                  </div>
                  {tier.discountPercent > 0 && (
                    <span className="text-[9px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded">
                      Save {tier.discountPercent}%
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Booking Inputs */}
      <div className="space-y-3 pt-2 border-t border-[#EFF8FF]">
        <div>
          <label className="text-xs font-bold text-[#0C4A6E] uppercase block mb-1">
            {t("hero.label_date")}
          </label>
          <input
            type="date"
            value={tripDate}
            onChange={(e) => setTripDate(e.target.value)}
            className="w-full bg-[#F7FCFF] border border-[#BAE6FD] rounded-xl px-3.5 py-2 text-xs text-[#0C4A6E] focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[#0C4A6E] uppercase block mb-1">
            {t("booking.questions")}
          </label>
          <textarea
            rows={2}
            value={specialNotes}
            onChange={(e) => setSpecialNotes(e.target.value)}
            placeholder="Special requests, hotel pickup point..."
            className="w-full bg-[#F7FCFF] border border-[#BAE6FD] rounded-xl px-3.5 py-2 text-xs text-[#0C4A6E] focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
          />
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={handleBookNow}
        className="shadow-md"
      >
        {t("tour.book")}
      </Button>

      <p className="text-[11px] text-center text-[#6B8CA5] leading-relaxed">
        🔒 Fast response & direct confirmation with our local Lombok travel team via WhatsApp.
      </p>
    </div>
  );
};
