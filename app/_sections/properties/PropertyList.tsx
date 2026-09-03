'use client';

import React from 'react';
import { Property } from '@/app/_lib/properties';
import { PropertyCard } from './PropertyCard';
import { Badge } from '@/app/_components/ui/Badge';
import { useLanguage } from '@/app/_context/LanguageContext';

interface PropertyListProps {
  properties: Property[];
}

export const PropertyList: React.FC<PropertyListProps> = ({ properties }) => {
  const { t } = useLanguage();

  return (
    <section id="properties" className="py-20 lg:py-28 bg-[#EFF8FF] border-t border-[#BAE6FD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <Badge variant="sky">
              {t('property.badge')}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0C4A6E] tracking-tight">
              {t('property.title')}
            </h2>
            <p className="text-[#486581] text-sm sm:text-base">
              {t('property.desc')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </div>
    </section>
  );
};
