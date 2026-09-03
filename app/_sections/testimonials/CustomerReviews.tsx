'use client';

import React from 'react';
import { Badge } from '@/app/_components/ui/Badge';
import { StarIcon } from '@/app/_components/ui/Icons';
import { useLanguage } from '@/app/_context/LanguageContext';

export const CustomerReviews: React.FC = () => {
  const { t } = useLanguage();

  const reviews = [
    {
      author: 'David & Emily Thompson',
      location: 'Perth, Australia',
      trip: 'Rinjani 3D2N Summit + Airport Pickup',
      quote: 'Flawless communication from the moment we landed at BIL. Our driver Hendra was waiting on time, and our mountain guides made the summit push feel safe and unforgettable.',
      rating: 5,
    },
    {
      author: 'Julien Laurent',
      location: 'Geneva, Switzerland',
      trip: 'Kuta Mandalika Villa Acquisition',
      quote: 'Clear legal diligence and transparent PMA advisory. We inspected three turnkey villas in Selong Belanak and closed our leasehold smoothly.',
      rating: 5,
    },
    {
      author: 'Aiko & Kenji Sato',
      location: 'Tokyo, Japan',
      trip: 'Secret Gili Snorkeling & Private Boat',
      quote: 'Private island hopping at Gili Nanggu with crystal waters, sea turtles, and grilled fish right on the sandbar. Truly the best day of our Indonesia trip.',
      rating: 5,
    },
  ];

  return (
    <section id="reviews" className="py-20 lg:py-28 bg-[#F7FCFF] text-[#0C4A6E] border-t border-[#BAE6FD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <Badge variant="sky">{t('reviews.badge')}</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0C4A6E]">
            {t('reviews.title')}
          </h2>
          <p className="text-[#486581] text-sm sm:text-base">
            {t('reviews.desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white rounded-[23px] p-8 border border-[#BAE6FD] shadow-md flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-500 gap-1">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 text-amber-500" />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-[#0284C7] bg-[#EFF8FF] px-2.5 py-1 rounded-full border border-[#BAE6FD]">
                    {rev.trip}
                  </span>
                </div>
                <p className="text-sm text-[#0C4A6E] leading-relaxed">
                  &ldquo;{rev.quote}&rdquo;
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#EFF8FF]">
                <h4 className="font-bold text-sm text-[#0C4A6E]">{rev.author}</h4>
                <p className="text-xs text-[#486581]">{rev.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
