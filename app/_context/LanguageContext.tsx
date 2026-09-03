'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'id';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav & Header
    'nav.tours': 'Tour Packages',
    'nav.pickup': 'Airport & Harbor Transfer',
    'nav.properties': 'Properties & Villas',
    'nav.contact': 'Contact WhatsApp',
    'header.tagline': 'Tours • Transfers • Real Estate',
    'header.whatsapp_cta': 'WhatsApp Us',
    'header.whatsapp_247': 'Contact WhatsApp 24/7',

    // Hero
    'hero.badge': 'All-In-One Lombok Tourism, Fleet & Real Estate',
    'hero.title_part1': 'Discover Lombok, Hire Transport & ',
    'hero.title_part2': 'Invest In Paradise',
    'hero.desc': 'From Mt. Rinjani trekking & secret Gili tours to guaranteed airport pick-ups, private car rentals, and high-yield luxury villas.',
    'hero.tab_tour': 'Tour Package',
    'hero.tab_transport': 'Airport & Transfer',
    'hero.tab_property': 'Villa & Land',
    'hero.label_destination': 'Tour / Destination',
    'hero.label_date': 'Trip Date',
    'hero.label_travelers': 'Travelers',
    'hero.label_pickup': 'Pickup Point',
    'hero.label_dropoff': 'Drop-off Destination',
    'hero.label_vehicle': 'Vehicle Class',
    'hero.label_prop_type': 'Property Type',
    'hero.label_location': 'Target Location',
    'hero.label_budget': 'Budget Range',
    'hero.btn_check_tour': 'Check Rates & Book',
    'hero.btn_book_transfer': 'Reserve Transfer',
    'hero.btn_inquire_prop': 'Get Property Dossier',

    // Transfer Section
    'transfer.badge': 'Transfer & Private Chauffeur',
    'transfer.title': 'Fast & Reliable Lombok Airport & Harbor Transfer',
    'transfer.desc': 'Direct private transfer service across Lombok with flight tracking, clean air-conditioned vehicles, and English-speaking professional drivers.',
    'transfer.feat1': 'Flight delay guarantee with zero penalty fee',
    'transfer.feat2': 'Fixed transparent rates (All-inclusive toll, fuel & parking)',
    'transfer.feat3': 'Instant WhatsApp dispatch & live driver coordination',
    'transfer.form_title': 'Book Transfer / Rental Chauffeur',
    'transfer.form_desc': 'Instant quote and private chauffeur reservation dispatched via WhatsApp.',
    'transfer.pickup_point': 'Pickup Point',
    'transfer.dropoff_point': 'Drop-off Destination',
    'transfer.vehicle_choice': 'Select Vehicle',
    'transfer.date_time': 'Date & Flight / Pickup Time',
    'transfer.passengers': 'Passengers (Pax)',
    'transfer.flight_notes': 'Flight Number / Hotel Name / Special Notes',
    'transfer.btn_book': 'Book via WhatsApp Concierge',

    // Property Section
    'property.badge': 'Lombok Real Estate & Investment',
    'property.title': 'Verified Villas & Beachfront Land',
    'property.desc': 'Explore high-yield turnkey villas and freehold land plots with complete legal due diligence and foreign investment (PT PMA) advisory.',
    'property.land_size': 'Land Size',
    'property.building_size': 'Building',
    'property.bedrooms': 'Bedrooms',
    'property.roi': 'Est. ROI',
    'property.price': 'Asking Price',
    'property.view_details': 'View Details',
    'property.features_legal': 'Features & Legal Due Diligence',
    'property.back_to_list': '← Back to properties list',

    // Reviews Section
    'reviews.badge': 'Verified Guest Stories',
    'reviews.title': 'Trusted by Travelers & Villa Investors Worldwide',
    'reviews.desc': 'Honest feedback from international guests who explored Lombok with our drivers, guides, and real estate advisors.',

    // Footer
    'footer.desc': 'Your premier partner in Lombok: Curated tour packages, airport pick-ups and private transfers, and verified luxury property investments.',
    'footer.quick_links': 'Quick Links',
    'footer.contact_support': 'Contact & Support',
    'footer.rights': '© 2026 Lombok Experience & Property. All rights reserved.',
  },
  id: {
    // Nav & Header
    'nav.tours': 'Paket Wisata',
    'nav.pickup': 'Antar-Jemput Bandara & Pelabuhan',
    'nav.properties': 'Properti & Villa',
    'nav.contact': 'Kontak WhatsApp',
    'header.tagline': 'Wisata • Antar-Jemput • Properti',
    'header.whatsapp_cta': 'Hubungi WhatsApp',
    'header.whatsapp_247': 'Hubungi WhatsApp 24/7',

    // Hero
    'hero.badge': 'Pariwisata Lombok, Transportasi & Properti Terpercaya',
    'hero.title_part1': 'Jelajahi Lombok, Sewa Transportasi & ',
    'hero.title_part2': 'Investasi Properti Impian',
    'hero.desc': 'Mulai dari pendakian Gunung Rinjani & wisata pulau rahasia Gili hingga antar-jemput bandara terjamin, rental mobil privat, dan villa mewah ber-yield tinggi.',
    'hero.tab_tour': 'Paket Wisata',
    'hero.tab_transport': 'Antar-Jemput',
    'hero.tab_property': 'Villa & Tanah',
    'hero.label_destination': 'Destinasi Wisata',
    'hero.label_date': 'Tanggal Perjalanan',
    'hero.label_travelers': 'Jumlah Wisatawan',
    'hero.label_pickup': 'Titik Jemput',
    'hero.label_dropoff': 'Tujuan Pengantaran',
    'hero.label_vehicle': 'Kelas Kendaraan',
    'hero.label_prop_type': 'Tipe Properti',
    'hero.label_location': 'Lokasi Properti',
    'hero.label_budget': 'Rentang Anggaran',
    'hero.btn_check_tour': 'Cek Harga & Pesan',
    'hero.btn_book_transfer': 'Pesan Antar-Jemput',
    'hero.btn_inquire_prop': 'Dapatkan Dokumen Properti',

    // Transfer Section
    'transfer.badge': 'Antar-Jemput & Rental Driver Privat',
    'transfer.title': 'Antar-Jemput Bandara & Pelabuhan Lombok Cepat & Nyaman',
    'transfer.desc': 'Layanan antar-jemput privat di seluruh penjuru Lombok dengan pelacak penerbangan, armada ber-AC bersih, dan sopir profesional berpengalaman.',
    'transfer.feat1': 'Garansi delay penerbangan tanpa biaya denda',
    'transfer.feat2': 'Tarif transparan & pasti (Termasuk tol, bensin, dan parkir)',
    'transfer.feat3': 'Respon WhatsApp kilat & koordinasi pengemudi langsung',
    'transfer.form_title': 'Pesan Antar-Jemput / Rental Chauffeur',
    'transfer.form_desc': 'Estimasi tarif langsung dan reservasi sopir privat terhubung ke WhatsApp.',
    'transfer.pickup_point': 'Titik Jemput',
    'transfer.dropoff_point': 'Tujuan Pengantaran',
    'transfer.vehicle_choice': 'Pilihan Kendaraan',
    'transfer.date_time': 'Tanggal & Jam Jemput / Penerbangan',
    'transfer.passengers': 'Jumlah Penumpang (Pax)',
    'transfer.flight_notes': 'Nomor Penerbangan / Nama Hotel / Catatan Khusus',
    'transfer.btn_book': 'Pesan via WhatsApp Concierge',

    // Property Section
    'property.badge': 'Investasi & Real Estate Lombok',
    'property.title': 'Villa Terverifikasi & Tanah Tepi Pantai',
    'property.desc': 'Telusuri villa mewah siap huni dengan yield tinggi dan kavling tanah hak milik (SHM) lengkap dengan pendampingan hukum dan legalitas PMA.',
    'property.land_size': 'Luas Tanah',
    'property.building_size': 'Luas Bangunan',
    'property.bedrooms': 'Kamar Tidur',
    'property.roi': 'Estimasi ROI',
    'property.price': 'Harga Penawaran',
    'property.view_details': 'Lihat Detail',
    'property.features_legal': 'Fitur & Legalitas Dokumen',
    'property.back_to_list': '← Kembali ke daftar properti',

    // Reviews Section
    'reviews.badge': 'Kisah Nyata Tamu & Wisatawan',
    'reviews.title': 'Dipercaya oleh Wisatawan & Investor Villa Mancanegara',
    'reviews.desc': 'Testimoni jujur dari para tamu yang menjelajahi Lombok bersama tim pemandu, driver, dan konsultan properti kami.',

    // Footer
    'footer.desc': 'Mitra terpercaya di Lombok: Paket tour pilihan, layanan antar-jemput bandara & sewa mobil, serta investasi properti villa terverifikasi.',
    'footer.quick_links': 'Tautan Cepat',
    'footer.contact_support': 'Kontak & Bantuan',
    'footer.rights': '© 2026 Lombok Experience & Property. Seluruh hak cipta dilindungi.',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('site_lang') as Language;
    if (saved === 'en' || saved === 'id') {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('site_lang', newLang);
  };

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
