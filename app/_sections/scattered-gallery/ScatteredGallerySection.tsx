"use client";

import React from "react";
import Link from "next/link";
import { formatImageUrl } from "@/app/_lib/utils";
import {
  SCATTERED_GALLERY_ITEMS,
  ScatteredCardItem,
} from "./gallery.constants";
import { Badge } from "@/app/_components/ui/Badge";
import { useLanguage } from "@/app/_context/LanguageContext";

export const ScatteredGallerySection: React.FC = () => {
  const { t } = useLanguage();

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

        {/* Scattered Gallery Canvas (Fit into 100vh viewport without clipping) */}
        <div className="relative flex-1 min-h-[380px] max-h-[440px] w-full hidden lg:block my-auto">
          {SCATTERED_GALLERY_ITEMS.map((item) => (
            <ScatteredCard key={item.id} item={item} isScattered />
          ))}
        </div>

        {/* Mobile & Tablet Responsive Flow Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 lg:hidden py-4">
          {SCATTERED_GALLERY_ITEMS.map((item) => (
            <ScatteredCard key={item.id} item={item} isScattered={false} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface ScatteredCardProps {
  item: ScatteredCardItem;
  isScattered?: boolean;
}

const ScatteredCard: React.FC<ScatteredCardProps> = ({
  item,
  isScattered = true,
}) => {
  const { t } = useLanguage();
  const cardWidth = item.cardWidthClasses || "w-[250px] xl:w-[270px]";
  const imageAspect = item.imageAspectClasses || "aspect-[4/3]";

  const title = t(item.titleKey);
  const subtitle = t(item.subtitleKey);
  const badgeTop = item.badgeTopKey ? t(item.badgeTopKey) : undefined;
  const badgeStat = item.badgeTimeOrStatKey
    ? t(item.badgeTimeOrStatKey)
    : undefined;
  const badgeExtra = item.badgeExtraKey ? t(item.badgeExtraKey) : undefined;

  return (
    <div
      className={`${
        isScattered
          ? `absolute ${cardWidth} ${item.positionClasses} ${item.zIndex} ${item.rotation}`
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
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

          {/* Top badge */}
          {badgeTop && (
            <div className="absolute top-1.5 left-1.5">
              <span className="bg-white/90 backdrop-blur-md text-[#0C4A6E] font-bold text-[8.5px] px-2 py-0.5 rounded-full shadow-xs border border-white/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]" />
                {badgeTop}
              </span>
            </div>
          )}

          {/* Bottom badge */}
          {badgeStat && (
            <div className="absolute bottom-1.5 right-1.5">
              <span className="bg-black/60 backdrop-blur-md text-white font-semibold text-[8.5px] px-1.5 py-0.5 rounded border border-white/20">
                {badgeStat}
              </span>
            </div>
          )}
        </div>

        {/* Content Info */}
        <div className="space-y-0.5 px-0.5">
          <div className="flex items-start justify-between gap-1">
            <h3 className="font-extrabold text-[#0C4A6E] text-xs xl:text-[13px] leading-tight group-hover:text-[#0284C7] transition-colors line-clamp-1">
              {title}
            </h3>
            {badgeStat && (
              <span className="text-[8px] font-bold text-[#0284C7] bg-[#EFF8FF] px-1 py-0.5 rounded border border-[#BAE6FD] whitespace-nowrap">
                {badgeStat}
              </span>
            )}
          </div>

          <p className="text-[10px] text-[#486581] leading-tight line-clamp-1 italic">
            {subtitle}
          </p>

          <div className="pt-1 mt-1 border-t border-[#EFF8FF] flex items-center justify-between text-[9.5px] font-medium text-[#6B8CA5]">
            <span className="truncate max-w-[140px]">{badgeExtra}</span>
            <Link
              href={item.linkUrl}
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
