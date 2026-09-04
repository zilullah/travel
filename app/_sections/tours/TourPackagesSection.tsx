'use client';

import React from 'react';
import { TourPackage } from '@/lib/domain/package.types';
import { formatIDR } from '@/app/_lib/utils';
import { buildWhatsAppLink } from '@/app/_lib/whatsapp';
import { WHATSAPP_TEMPLATES } from '@/app/_constants/whatsapp';
import { Button } from '@/app/_components/ui/Button';
import { Badge } from '@/app/_components/ui/Badge';
import { CompassIcon, StarIcon, CheckIcon } from '@/app/_components/ui/Icons';
import { useLanguage } from '@/app/_context/LanguageContext';

interface TourPackagesSectionProps {
  packages: TourPackage[];
}

export const TourPackagesSection: React.FC<TourPackagesSectionProps> = ({ packages }) => {
  const { t } = useLanguage();

  const handleBookTour = (pkg: TourPackage) => {
    const message = WHATSAPP_TEMPLATES.tour({
      tourTitle: pkg.title,
      duration: pkg.duration,
      date: 'Rencana Segera / Flexible',
      guests: 2,
      notes: `Booking via Landing Page untuk paket: ${pkg.title} (Base: ${formatIDR(pkg.basePriceIdr)})`,
    });
    const waUrl = buildWhatsAppLink(message);
    window.open(waUrl, '_blank');
  };

  return (
    <section id="tour-packages" className="py-20 lg:py-28 bg-[#F7FCFF] text-[#0C4A6E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <Badge variant="sky">
            {t('nav.tours') || 'Curated Lombok Tour Packages'}
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-[#0C4A6E]">
            Authentic Island Adventures & Trekking
          </h2>
          <p className="text-[#486581] text-base sm:text-lg leading-relaxed">
            Live-synced curated packages from our local guides — complete with certified guides, private boat charters, and transparent pricing tiers.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-[23px] border border-[#BAE6FD] overflow-hidden flex flex-col shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Image Banner */}
              <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                <img
                  src={pkg.imageUrl || 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80'}
                  alt={pkg.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-[#0EA5E9] text-white font-bold text-xs px-3 py-1 rounded-full uppercase shadow-sm">
                    {pkg.category.replace('_', ' ')}
                  </span>
                  {pkg.isFeatured && (
                    <span className="bg-amber-400 text-amber-950 font-bold text-xs px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                      ★ Featured
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center text-xs text-white">
                  <span className="bg-[#0369A1]/90 backdrop-blur-md px-2.5 py-1 rounded-md text-white font-bold border border-[#38BDF8]/30 flex items-center gap-1">
                    ⏱️ {pkg.duration}
                  </span>
                  <span className="bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-md flex items-center gap-1">
                    📍 {pkg.destination}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-[#0C4A6E] line-clamp-1">
                    {pkg.title}
                  </h3>
                  <p className="text-xs text-[#486581] mt-2 line-clamp-2 leading-relaxed">
                    {pkg.tagline}
                  </p>

                  {/* Key Highlights */}
                  <div className="mt-4 space-y-1.5 border-t border-[#EFF8FF] pt-3">
                    {pkg.highlights.slice(0, 3).map((hl, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[#0C4A6E]">
                        <span className="text-[#0EA5E9] font-bold">
                          <CheckIcon className="w-3.5 h-3.5 inline" />
                        </span>
                        <span className="line-clamp-1">{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer Price & WhatsApp CTA */}
                <div className="pt-4 border-t border-[#EFF8FF] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#486581] block">
                      Start from
                    </span>
                    <span className="text-lg font-black text-[#0284C7]">
                      {formatIDR(pkg.basePriceIdr)}
                    </span>
                    <span className="text-[10px] text-[#6B8CA5] block">/ person</span>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleBookTour(pkg)}
                  >
                    Book Tour
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
