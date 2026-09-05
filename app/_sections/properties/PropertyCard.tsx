"use client";

import React from "react";
import Link from "next/link";
import { Property } from "@/app/_lib/properties";
import { Button } from "@/app/_components/ui/Button";
import { formatIDR, formatImageUrl } from "@/app/_lib/utils";
import { MapPinIcon, TrendingUpIcon } from "@/app/_components/ui/Icons";
import { useLanguage } from "@/app/_context/LanguageContext";

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-[23px] border border-[#BAE6FD] overflow-hidden flex flex-col shadow-md hover:shadow-xl transition-all duration-300">
      <div className="relative h-60 w-full overflow-hidden bg-slate-100">
        <img
          src={formatImageUrl(property.image)}
          alt={property.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-[#0EA5E9] text-white font-bold text-xs px-3 py-1 rounded-full uppercase shadow-sm">
            {property.status}
          </span>
          <span className="bg-white/80 backdrop-blur-md text-[#0C4A6E] font-semibold text-xs px-3 py-1 rounded-full border border-white/40">
            {property.ownership}
          </span>
        </div>

        <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center text-xs text-white">
          <span className="bg-[#0369A1]/90 backdrop-blur-md px-2.5 py-1 rounded-md text-white font-bold border border-[#38BDF8]/30 flex items-center gap-1">
            <TrendingUpIcon className="w-3.5 h-3.5 text-[#38BDF8]" />
            {property.roi}
          </span>
          <span className="bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-md flex items-center gap-1">
            <MapPinIcon className="w-3.5 h-3.5 text-white" />
            {property.location}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-[#0C4A6E] line-clamp-1">
            {property.title}
          </h3>
          <p className="text-xs text-[#486581] mt-1 line-clamp-2">
            {property.tagline}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-[#0C4A6E] font-medium">
          <span className="bg-[#EFF8FF] px-2.5 py-1 rounded-md border border-[#BAE6FD]">
            {t("property.land_size")}: {property.landSizeM2} m²
          </span>
          {property.buildingSizeM2 && (
            <span className="bg-[#EFF8FF] px-2.5 py-1 rounded-md border border-[#BAE6FD]">
              {t("property.building_size")}: {property.buildingSizeM2} m²
            </span>
          )}
          {property.bedrooms && (
            <span className="bg-[#EFF8FF] px-2.5 py-1 rounded-md border border-[#BAE6FD]">
              {property.bedrooms} {t("property.bedrooms")}
            </span>
          )}
        </div>

        <div className="pt-4 mt-auto border-t border-[#EFF8FF] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#486581] block">
              {t("property.price")}
            </span>
            <span className="text-lg font-black text-[#0284C7]">
              {formatIDR(property.priceIdr)}
            </span>
          </div>

          <Link href={`/properties/${property.slug}`}>
            <Button variant="primary" size="sm">
              {t("property.view_details")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
