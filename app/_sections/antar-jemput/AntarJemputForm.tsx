'use client';

import React from 'react';
import { useAntarJemputForm } from './useAntarJemputForm';
import { Button } from '@/app/_components/ui/Button';
import { Badge } from '@/app/_components/ui/Badge';
import { CheckIcon } from '@/app/_components/ui/Icons';
import { useLanguage } from '@/app/_context/LanguageContext';

export const AntarJemputForm: React.FC = () => {
  const { values, handleChange, handleSubmit } = useAntarJemputForm();
  const { t } = useLanguage();

  return (
    <section id="antar-jemput" className="py-20 lg:py-28 bg-[#F7FCFF] text-[#0C4A6E] border-t border-[#BAE6FD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left info */}
          <div className="lg:col-span-5 space-y-6">
            <Badge variant="sky">
              {t('transfer.badge')}
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-[#0C4A6E]">
              {t('transfer.title')}
            </h2>
            <p className="text-[#486581] text-base leading-relaxed">
              {t('transfer.desc')}
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#0EA5E9]/15 text-[#0284C7] flex items-center justify-center">
                  <CheckIcon className="w-3.5 h-3.5" />
                </span>
                <span className="text-sm font-medium text-[#0C4A6E]">{t('transfer.feat1')}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#0EA5E9]/15 text-[#0284C7] flex items-center justify-center">
                  <CheckIcon className="w-3.5 h-3.5" />
                </span>
                <span className="text-sm font-medium text-[#0C4A6E]">{t('transfer.feat2')}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#0EA5E9]/15 text-[#0284C7] flex items-center justify-center">
                  <CheckIcon className="w-3.5 h-3.5" />
                </span>
                <span className="text-sm font-medium text-[#0C4A6E]">{t('transfer.feat3')}</span>
              </div>
            </div>
          </div>

          {/* Right form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-[23px] border border-[#BAE6FD] shadow-xl">
            <h3 className="text-2xl font-bold text-[#0C4A6E] mb-2">{t('transfer.form_title')}</h3>
            <p className="text-xs sm:text-sm text-[#486581] mb-6">
              {t('transfer.form_desc')}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0C4A6E] uppercase">
                    {t('transfer.pickup_point')}
                  </label>
                  <select
                    value={values.pickup}
                    onChange={(e) => handleChange('pickup', e.target.value)}
                    className="w-full bg-[#F7FCFF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#0C4A6E] focus:ring-2 focus:ring-[#0EA5E9] focus:outline-none"
                  >
                    <option value="Lombok International Airport (BIL)">Lombok Airport (BIL)</option>
                    <option value="Bangsal Harbor (Boat to Gili)">Bangsal Harbor (Gili)</option>
                    <option value="Lembar Harbor (Bali Ferry)">Lembar Harbor</option>
                    <option value="Senggigi Resort Area">Senggigi Area</option>
                    <option value="Kuta Mandalika Hotel">Kuta Mandalika</option>
                    <option value="Senaru / Sembalun (Rinjani Base)">Senaru / Sembalun</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0C4A6E] uppercase">
                    {t('transfer.dropoff_point')}
                  </label>
                  <select
                    value={values.dropoff}
                    onChange={(e) => handleChange('dropoff', e.target.value)}
                    className="w-full bg-[#F7FCFF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#0C4A6E] focus:ring-2 focus:ring-[#0EA5E9] focus:outline-none"
                  >
                    <option value="Kuta Mandalika Beach / Resort">Kuta Mandalika Beach</option>
                    <option value="Bangsal Harbor (Fast Boat to Gili)">Bangsal Harbor</option>
                    <option value="Senggigi Strip">Senggigi Strip</option>
                    <option value="Selong Belanak Bay">Selong Belanak</option>
                    <option value="Tetebatu Waterfall & Rice Terraces">Tetebatu Nature Area</option>
                    <option value="Lombok Airport (BIL)">Lombok Airport (BIL)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0C4A6E] uppercase">
                    {t('transfer.vehicle_choice')}
                  </label>
                  <select
                    value={values.vehicle}
                    onChange={(e) => handleChange('vehicle', e.target.value)}
                    className="w-full bg-[#F7FCFF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#0C4A6E] focus:ring-2 focus:ring-[#0EA5E9] focus:outline-none"
                  >
                    <option value="Toyota Avanza (1-4 Pax)">Toyota Avanza (1-4 Pax)</option>
                    <option value="Innova Reborn (1-6 Pax)">Innova Reborn (1-6 Pax)</option>
                    <option value="Toyota HiAce Commuter (7-14 Pax)">Toyota HiAce (7-14 Pax)</option>
                    <option value="Toyota Alphard VIP (1-5 Pax)">Toyota Alphard VIP</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0C4A6E] uppercase">
                    {t('transfer.date_time')}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 15 Oct, 14:30 / JT-650"
                    value={values.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className="w-full bg-[#F7FCFF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#0C4A6E] focus:ring-2 focus:ring-[#0EA5E9] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-[#0C4A6E] uppercase">
                    {t('transfer.flight_notes')}
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Flight flight number, hotel name, luggage count, or child seat requests..."
                    value={values.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    className="w-full bg-[#F7FCFF] border border-[#BAE6FD] rounded-xl px-3.5 py-2 text-sm text-[#0C4A6E] focus:ring-2 focus:ring-[#0EA5E9] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" fullWidth size="lg">
                  {t('transfer.btn_book')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
