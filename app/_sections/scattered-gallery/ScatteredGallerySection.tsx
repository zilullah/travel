"use client";

import React from "react";
import Link from "next/link";
import { formatImageUrl } from "@/app/_lib/utils";
import { Badge } from "@/app/_components/ui/Badge";
import { useLanguage } from "@/app/_context/LanguageContext";
import { GallerySnapshotItem } from "@/lib/domain/gallery.types";
import { FALLBACK_GALLERY_SNAPSHOTS } from "@/lib/gallery";

interface ScatteredGallerySectionProps {
  snapshots?: GallerySnapshotItem[];
}

export const ScatteredGallerySection: React.FC<ScatteredGallerySectionProps> = ({
  snapshots,
}) => {
  const { t } = useLanguage();
  const items = snapshots && snapshots.length > 0 ? snapshots : FALLBACK_GALLERY_SNAPSHOTS;

  return (
    <section className="relative min-h-[calc(100vh-4.5rem)] lg:h-[calc(100vh-4.5rem)] flex flex-col justify-between pt-20 sm:pt-24 lg:pt-22 pb-4 sm:pb-6 bg-[#F7FCFF] overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#BAE6FD]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-6 right-10 w-72 h-72 bg-[#E0F2FE]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex-1 flex flex-col justify-between">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-1 sm:space-y-1.5 mb-2">
          <Badge variant="sky">{t("gallery.badge")}</Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-black text-[#0C4A6E] tracking-tight">
            {t("gallery.title")}
          </h2>
          <p className="text-xs sm:text-sm text-[#486581] max-w-xl mx-auto">
            {t("gallery.desc")}
          </p>
        </div>

        {/* Scattered Gallery Canvas (Desktop) */}
        <div className="relative flex-1 min-h-[380px] max-h-[440px] w-full hidden lg:block my-auto">
          {items.map((item, idx) => (
            <ScatteredCard key={item.id || idx} item={item} index={idx} isScattered />
          ))}
        </div>

        {/* Mobile & Tablet Responsive Flow Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 lg:hidden py-4">
          {items.map((item, idx) => (
            <ScatteredCard key={item.id || idx} item={item} index={idx} isScattered={false} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Preset scattered layout positioning for 8 slots
const DEFAULT_POSITIONS = [
  { positionClasses: "lg:top-0 lg:left-[0%] xl:left-[1%]", rotation: "-rotate-[4deg]", zIndex: "z-20", cardWidthClasses: "w-[260px] xl:w-[285px]", imageAspectClasses: "aspect-[4/3]" },
  { positionClasses: "lg:top-0 lg:left-[35%] xl:left-[36%]", rotation: "rotate-[2deg]", zIndex: "z-10", cardWidthClasses: "w-[250px] xl:w-[275px]", imageAspectClasses: "aspect-[4/3]" },
  { positionClasses: "lg:top-0 lg:right-[0%] xl:right-[1%]", rotation: "rotate-[4deg]", zIndex: "z-20", cardWidthClasses: "w-[260px] xl:w-[285px]", imageAspectClasses: "aspect-[4/3]" },
  { positionClasses: "lg:top-[135px] lg:left-[36%] xl:left-[37%]", rotation: "-rotate-[1deg]", zIndex: "z-30", cardWidthClasses: "w-[270px] xl:w-[295px]", imageAspectClasses: "aspect-[16/10]" },
  { positionClasses: "lg:bottom-0 lg:left-[0%]", rotation: "-rotate-[3deg]", zIndex: "z-10", cardWidthClasses: "w-[250px] xl:w-[270px]", imageAspectClasses: "aspect-[4/3]" },
  { positionClasses: "lg:bottom-0 lg:left-[25.5%]", rotation: "rotate-[2deg]", zIndex: "z-20", cardWidthClasses: "w-[250px] xl:w-[270px]", imageAspectClasses: "aspect-[4/3]" },
  { positionClasses: "lg:bottom-0 lg:right-[25.5%]", rotation: "-rotate-[3deg]", zIndex: "z-20", cardWidthClasses: "w-[250px] xl:w-[270px]", imageAspectClasses: "aspect-[4/3]" },
  { positionClasses: "lg:bottom-0 lg:right-[0%]", rotation: "rotate-[4deg]", zIndex: "z-10", cardWidthClasses: "w-[250px] xl:w-[270px]", imageAspectClasses: "aspect-[4/3]" },
];

interface ScatteredCardProps {
  item: GallerySnapshotItem;
  index: number;
  isScattered?: boolean;
}

const ScatteredCard: React.FC<ScatteredCardProps> = ({
  item,
  index,
  isScattered = true,
}) => {
  const { t } = useLanguage();
  const preset = DEFAULT_POSITIONS[index % DEFAULT_POSITIONS.length];

  const cardWidth = item.cardWidthClasses || preset.cardWidthClasses;
  const imageAspect = item.imageAspectClasses || preset.imageAspectClasses;
  const positionClasses = item.positionClasses || preset.positionClasses;
  const zIndex = item.zIndex || preset.zIndex;
  const rotation = item.rotation || preset.rotation;

  return (
    <div
      className={`${
        isScattered
          ? `absolute ${cardWidth} ${positionClasses} ${zIndex} ${rotation}`
          : "w-full"
      } group transition-all duration-300 hover:scale-105 hover:z-40 hover:rotate-0`}
    >
      <div className="relative bg-white p-2.5 pb-3 rounded-2xl border border-[#BAE6FD] shadow-md group-hover:shadow-2xl transition-all duration-300">
        {/* Top Tape Sticker Accent */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-3.5 bg-white/70 backdrop-blur-xs border border-slate-200 shadow-xs rounded-xs -rotate-2 z-20" />

        {/* Photo Container with balanced aspect-ratio */}
        <div
          className={`relative w-full ${imageAspect} rounded-xl overflow-hidden bg-slate-900 mb-2`}
        >
          <img
            src={formatImageUrl(item.imageUrl)}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

          {/* Top badge */}
          {item.badgeTop && (
            <div className="absolute top-1.5 left-1.5">
              <span className="bg-white/90 backdrop-blur-md text-[#0C4A6E] font-bold text-[8.5px] px-2 py-0.5 rounded-full shadow-xs border border-white/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]" />
                {item.badgeTop}
              </span>
            </div>
          )}

          {/* Bottom badge */}
          {item.badgeStat && (
            <div className="absolute bottom-1.5 right-1.5">
              <span className="bg-black/60 backdrop-blur-md text-white font-semibold text-[8.5px] px-1.5 py-0.5 rounded border border-white/20">
                {item.badgeStat}
              </span>
            </div>
          )}
        </div>

        {/* Content Info */}
        <div className="space-y-0.5 px-0.5">
          <div className="flex items-start justify-between gap-1">
            <h3 className="font-extrabold text-[#0C4A6E] text-xs xl:text-[13px] leading-tight group-hover:text-[#0284C7] transition-colors line-clamp-1">
              {item.title}
            </h3>
            {item.badgeStat && (
              <span className="text-[8px] font-bold text-[#0284C7] bg-[#EFF8FF] px-1 py-0.5 rounded border border-[#BAE6FD] whitespace-nowrap">
                {item.badgeStat}
              </span>
            )}
          </div>

          <p className="text-[10px] text-[#486581] leading-tight line-clamp-1 italic">
            {item.subtitle}
          </p>

          <div className="pt-1 mt-1 border-t border-[#EFF8FF] flex items-center justify-between text-[9.5px] font-medium text-[#6B8CA5]">
            <span className="truncate max-w-[140px]">{item.badgeExtra || ""}</span>
            <Link
              href={item.linkUrl || "/packages"}
              className="text-[#0284C7] font-bold hover:underline flex-shrink-0"
            >
              {t("gallery.explore")} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
