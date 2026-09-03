'use client';

import React, { useState } from 'react';
import { Button } from '@/app/_components/ui/Button';
import { buildWhatsAppLink } from '@/app/_lib/whatsapp';
import { WHATSAPP_TEMPLATES } from '@/app/_constants/whatsapp';
import { CompassIcon, CarIcon, BuildingIcon, SparklesIcon, StarIcon, ShieldCheckIcon } from '@/app/_components/ui/Icons';
import { useLanguage } from '@/app/_context/LanguageContext';

export const Hero: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'tour' | 'transport' | 'property'>('tour');

  // Tour State
  const [tourDestination, setTourDestination] = useState('Mount Rinjani Trekking');
  const [tourDate, setTourDate] = useState('');
  const [tourGuests, setTourGuests] = useState(2);

  // Transport State
  const [pickUpLocation, setPickUpLocation] = useState('Lombok International Airport (BIL)');
  const [dropOffLocation, setDropOffLocation] = useState('Kuta / Mandalika');
  const [vehicleCategory, setVehicleCategory] = useState('Innova Reborn (1-6 Pax)');
  const [transportDate, setTransportDate] = useState('');

  // Property State
  const [propertyType, setPropertyType] = useState('Luxury Villa');
  const [propertyLocation, setPropertyLocation] = useState('Kuta / South Lombok');
  const [priceBudget, setPriceBudget] = useState('Rp 2.5 M - Rp 5 M');

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let message = '';

    if (activeTab === 'tour') {
      message = WHATSAPP_TEMPLATES.tour({
        tourTitle: tourDestination,
        duration: 'Standard',
        date: tourDate || 'Flexible',
        guests: tourGuests,
        notes: `Quick Search Tour: ${tourDestination}`,
      });
    } else if (activeTab === 'transport') {
      message = WHATSAPP_TEMPLATES.antarJemput({
        pickup: pickUpLocation,
        dropoff: dropOffLocation,
        vehicle: vehicleCategory,
        date: transportDate || 'Hari ini / Segera',
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
    window.open(waUrl, '_blank');
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
            <span>{t('hero.badge')}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0C4A6E] tracking-tight leading-[1.15]">
            {t('hero.title_part1')}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] via-[#0284C7] to-[#075985]">
              {t('hero.title_part2')}
            </span>
          </h1>
          <p className="text-base sm:text-lg text-[#486581] max-w-2xl mx-auto leading-relaxed">
            {t('hero.desc')}
          </p>
        </div>

        {/* Multi-Service Interactive Booking Widget */}
        <div className="mt-10 max-w-4xl mx-auto bg-white rounded-[23px] p-4 sm:p-6 shadow-xl border border-[#BAE6FD]">
          {/* Tab Switchers */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-[#EFF8FF] rounded-[23px] mb-6 border border-[#D9F1FF]">
            <button
              type="button"
              onClick={() => setActiveTab('tour')}
              className={`flex-1 min-w-[120px] py-3 px-4 rounded-[23px] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'tour'
                  ? 'bg-[#0EA5E9] text-white shadow-md'
                  : 'text-[#486581] hover:text-[#0C4A6E]'
              }`}
            >
              <CompassIcon className="w-4 h-4" />
              <span>{t('hero.tab_tour')}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('transport')}
              className={`flex-1 min-w-[120px] py-3 px-4 rounded-[23px] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'transport'
                  ? 'bg-[#0EA5E9] text-white shadow-md'
                  : 'text-[#486581] hover:text-[#0C4A6E]'
              }`}
            >
              <CarIcon className="w-4 h-4" />
              <span>{t('hero.tab_transport')}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('property')}
              className={`flex-1 min-w-[120px] py-3 px-4 rounded-[23px] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'property'
                  ? 'bg-[#0EA5E9] text-white shadow-md'
                  : 'text-[#486581] hover:text-[#0C4A6E]'
              }`}
            >
              <BuildingIcon className="w-4 h-4" />
              <span>{t('hero.tab_property')}</span>
            </button>
          </div>

          {/* Tab Form Fields */}
          <form onSubmit={handleQuickSearch}>
            {activeTab === 'tour' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-[#0C4A6E]">
                    {t('hero.label_destination')}
                  </label>
                  <select
                    value={tourDestination}
                    onChange={(e) => setTourDestination(e.target.value)}
                    className="w-full bg-[#F7FCFF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#0C4A6E] focus:ring-2 focus:ring-[#0EA5E9] focus:outline-none"
                  >
                    <option value="Mount Rinjani Trekking (2D1N / 3D2N)">Mount Rinjani Trekking</option>
                    <option value="Secret Gili Snorkeling (Nanggu, Sudak)">Secret Gili Snorkeling</option>
                    <option value="South Lombok Surf & Beach Safari">South Lombok Beach & Surf</option>
                    <option value="Pink Beach & Waterfalls">Pink Beach & Waterfalls</option>
                  </select>
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-[#0C4A6E]">
                    {t('hero.label_date')}
                  </label>
                  <input
                    type="date"
                    value={tourDate}
                    onChange={(e) => setTourDate(e.target.value)}
                    className="w-full bg-[#F7FCFF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#0C4A6E] focus:ring-2 focus:ring-[#0EA5E9] focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-[#0C4A6E]">
                    {t('hero.label_travelers')}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={tourGuests}
                    onChange={(e) => setTourGuests(Number(e.target.value))}
                    className="w-full bg-[#F7FCFF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#0C4A6E] focus:ring-2 focus:ring-[#0EA5E9] focus:outline-none"
                  />
                </div>
                <div className="flex items-end">
                  <Button type="submit" variant="primary" fullWidth size="md">
                    {t('hero.btn_check_tour')}
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'transport' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-[#0C4A6E]">
                    {t('hero.label_pickup')}
                  </label>
                  <select
                    value={pickUpLocation}
                    onChange={(e) => setPickUpLocation(e.target.value)}
                    className="w-full bg-[#F7FCFF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#0C4A6E] focus:ring-2 focus:ring-[#0EA5E9] focus:outline-none"
                  >
                    <option value="Lombok International Airport (BIL)">Lombok Airport (BIL)</option>
                    <option value="Bangsal Harbor (Gili Boat)">Bangsal Harbor</option>
                    <option value="Lembar Harbor (Bali Ferry)">Lembar Harbor</option>
                    <option value="Kuta / Mandalika Hotel">Kuta / Mandalika</option>
                    <option value="Senggigi Resort Area">Senggigi Area</option>
                  </select>
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-[#0C4A6E]">
                    {t('hero.label_dropoff')}
                  </label>
                  <select
                    value={dropOffLocation}
                    onChange={(e) => setDropOffLocation(e.target.value)}
                    className="w-full bg-[#F7FCFF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#0C4A6E] focus:ring-2 focus:ring-[#0EA5E9] focus:outline-none"
                  >
                    <option value="Kuta / Mandalika">Kuta / Mandalika</option>
                    <option value="Bangsal Harbor (Gili Boat)">Bangsal Harbor</option>
                    <option value="Senggigi Strip">Senggigi Strip</option>
                    <option value="Selong Belanak Bay">Selong Belanak</option>
                    <option value="Senaru / Sembalun (Rinjani)">Senaru / Sembalun</option>
                  </select>
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-[#0C4A6E]">
                    {t('hero.label_vehicle')}
                  </label>
                  <select
                    value={vehicleCategory}
                    onChange={(e) => setVehicleCategory(e.target.value)}
                    className="w-full bg-[#F7FCFF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#0C4A6E] focus:ring-2 focus:ring-[#0EA5E9] focus:outline-none"
                  >
                    <option value="Avanza / Xenia (1-4 Pax)">Toyota Avanza (1-4 Pax)</option>
                    <option value="Innova Reborn (1-6 Pax)">Innova Reborn (1-6 Pax)</option>
                    <option value="Toyota HiAce (7-14 Pax)">Toyota HiAce (7-14 Pax)</option>
                    <option value="Toyota Alphard VIP (1-5 Pax)">Toyota Alphard VIP</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button type="submit" variant="primary" fullWidth size="md">
                    {t('hero.btn_book_transfer')}
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'property' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-[#0C4A6E]">
                    {t('hero.label_prop_type')}
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full bg-[#F7FCFF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#0C4A6E] focus:ring-2 focus:ring-[#0EA5E9] focus:outline-none"
                  >
                    <option value="Luxury Villa">Luxury Turnkey Villa</option>
                    <option value="Beachfront Land">Beachfront Land Plot</option>
                    <option value="Hilltop Ocean View Plot">Hilltop Ocean View Plot</option>
                    <option value="Commercial Resort Lot">Commercial Resort Lot</option>
                  </select>
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-[#0C4A6E]">
                    {t('hero.label_location')}
                  </label>
                  <select
                    value={propertyLocation}
                    onChange={(e) => setPropertyLocation(e.target.value)}
                    className="w-full bg-[#F7FCFF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#0C4A6E] focus:ring-2 focus:ring-[#0EA5E9] focus:outline-none"
                  >
                    <option value="Kuta / South Lombok">Kuta / South Lombok</option>
                    <option value="Selong Belanak Bay">Selong Belanak Bay</option>
                    <option value="Tanjung Aan / Gerupuk">Tanjung Aan / Gerupuk</option>
                    <option value="Torok / Tampah Hills">Torok / Tampah Hills</option>
                  </select>
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-[#0C4A6E]">
                    {t('hero.label_budget')}
                  </label>
                  <select
                    value={priceBudget}
                    onChange={(e) => setPriceBudget(e.target.value)}
                    className="w-full bg-[#F7FCFF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#0C4A6E] focus:ring-2 focus:ring-[#0EA5E9] focus:outline-none"
                  >
                    <option value="Under Rp 2 M">Under Rp 2 M (&lt; $130K)</option>
                    <option value="Rp 2.5 M - Rp 5 M">Rp 2.5 M - Rp 5 M ($160K - $320K)</option>
                    <option value="Rp 5 M - Rp 10 M">Rp 5 M - Rp 10 M ($320K - $650K)</option>
                    <option value="Above Rp 10 M">Above Rp 10 M (&gt; $650K)</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button type="submit" variant="primary" fullWidth size="md">
                    {t('hero.btn_inquire_prop')}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Sleek Minimalist Trust Strip */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-medium text-[#486581]">
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
        </div>
      </div>
    </section>
  );
};
