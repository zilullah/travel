"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "id";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav & Header
    "nav.tours": "Tour Packages",
    "nav.about": "About Us",
    "nav.pickup": "Airport & Harbor Transfer",
    "nav.properties": "Properties & Villas",
    "nav.contact": "Contact WhatsApp",
    "header.tagline": "Tours • Transfers • Real Estate",
    "header.whatsapp_cta": "WhatsApp Us",
    "header.whatsapp_247": "Contact WhatsApp 24/7",

    // Hero
    "hero.badge": "All-In-One Lombok Tourism, Fleet & Real Estate",
    "hero.title_part1": "Discover Lombok, Hire Transport & ",
    "hero.title_part2": "Invest In Paradise",
    "hero.desc":
      "Plan your Lombok holiday with a trusted local team: Mt. Rinjani trekking, secret Gili tours, reliable airport transfers, private car hire, and verified South Lombok villas.",
    "hero.tab_tour": "Tour Package",
    "hero.tab_transport": "Airport & Transfer",
    "hero.tab_property": "Villa & Land",
    "hero.label_destination": "Tour / Destination",
    "hero.label_date": "Trip Date",
    "hero.label_travelers": "Travelers",
    "hero.label_pickup": "Pickup Point",
    "hero.label_dropoff": "Drop-off Destination",
    "hero.label_vehicle": "Vehicle Class",
    "hero.label_prop_type": "Property Type",
    "hero.label_location": "Target Location",
    "hero.label_budget": "Budget Range",
    "hero.btn_check_tour": "Check Rates & Book",
    "hero.btn_book_transfer": "Reserve Transfer",
    "hero.btn_inquire_prop": "Get Property Dossier",

    // Transfer Section
    "transfer.badge": "Transfer & Private Chauffeur",
    "transfer.title": "Fast & Reliable Lombok Airport & Harbor Transfer",
    "transfer.desc":
      "Direct private transfer service across Lombok with flight tracking, clean air-conditioned vehicles, and English-speaking professional drivers.",
    "transfer.feat1": "Flight delay guarantee with zero penalty fee",
    "transfer.feat2":
      "Fixed transparent rates (All-inclusive toll, fuel & parking)",
    "transfer.feat3": "Instant WhatsApp dispatch & live driver coordination",
    "transfer.form_title": "Book Transfer / Rental Chauffeur",
    "transfer.form_desc":
      "Instant quote and private chauffeur reservation dispatched via WhatsApp.",
    "transfer.pickup_point": "Pickup Point",
    "transfer.dropoff_point": "Drop-off Destination",
    "transfer.vehicle_choice": "Select Vehicle",
    "transfer.date_time": "Date & Flight / Pickup Time",
    "transfer.passengers": "Passengers (Pax)",
    "transfer.flight_notes": "Flight Number / Hotel Name / Special Notes",
    "transfer.btn_book": "Book via WhatsApp Concierge",

    // Property Section
    "property.badge": "Lombok Real Estate & Investment",
    "property.title": "Verified Villas & Beachfront Land",
    "property.desc":
      "Explore high-yield turnkey villas and freehold land plots with complete legal due diligence and foreign investment (PT PMA) advisory.",
    "property.land_size": "Land Size",
    "property.building_size": "Building",
    "property.bedrooms": "Bedrooms",
    "property.roi": "Est. ROI",
    "property.price": "Asking Price",
    "property.view_details": "View Details",
    "property.features_legal": "Features & Legal Due Diligence",
    "property.back_to_list": "← Back to properties list",

    // Reviews Section
    "reviews.badge": "Verified Guest Stories",
    "reviews.title": "Trusted by Travelers & Villa Investors Worldwide",
    "reviews.desc":
      "Honest feedback from international guests who explored Lombok with our drivers, guides, and real estate advisors.",

    // About Us
    "about.badge": "Your Local Lombok Travel Partner",
    "about.title":
      "Travel Lombok with local knowledge and international-friendly support",
    "about.intro":
      "Lombok Travel Organizer helps international visitors experience the island with less uncertainty and more time for the places that matter.",
    "about.body":
      "From your first airport pickup to a private Rinjani trek, island-hopping day, or South Lombok villa viewing, our local team coordinates the practical details in clear English through WhatsApp.",
    "about.card1_title": "Trips shaped around you",
    "about.card1_text":
      "Choose a ready-made Lombok tour or ask us to build a private itinerary around your pace, interests, and travel dates.",
    "about.card2_title": "Clear, practical planning",
    "about.card2_text":
      "Get straightforward information about transfers, vehicles, activities, timing, and property viewings before you arrive.",
    "about.card3_title": "Local help from arrival onward",
    "about.card3_text":
      "Our Lombok-based team stays reachable on WhatsApp for airport coordination, driver support, and on-island questions.",

    // Footer
    "footer.desc":
      "Your premier partner in Lombok: Curated tour packages, airport pick-ups and private transfers, and verified luxury property investments.",
    "footer.quick_links": "Quick Links",
    "footer.contact_support": "Contact & Support",
    "footer.rights":
      "© 2026 Lombok Experience & Property. All rights reserved.",
  },
  id: {
    // Nav & Header
    "nav.tours": "Paket Wisata",
    "nav.about": "Tentang Kami",
    "nav.pickup": "Antar-Jemput Bandara & Pelabuhan",
    "nav.properties": "Properti & Villa",
    "nav.contact": "Kontak WhatsApp",
    "header.tagline": "Wisata • Antar-Jemput • Properti",
    "header.whatsapp_cta": "Hubungi WhatsApp",
    "header.whatsapp_247": "Hubungi WhatsApp 24/7",

    // Hero
    "hero.badge": "Pariwisata Lombok, Transportasi & Properti Terpercaya",
    "hero.title_part1": "Jelajahi Lombok, Sewa Transportasi & ",
    "hero.title_part2": "Investasi Properti Impian",
    "hero.desc":
      "Rencanakan liburan Lombok bersama tim lokal terpercaya: pendakian Rinjani, wisata Gili, antar-jemput bandara, rental mobil privat, dan villa terverifikasi di Lombok Selatan.",
    "hero.tab_tour": "Paket Wisata",
    "hero.tab_transport": "Antar-Jemput",
    "hero.tab_property": "Villa & Tanah",
    "hero.label_destination": "Destinasi Wisata",
    "hero.label_date": "Tanggal Perjalanan",
    "hero.label_travelers": "Jumlah Wisatawan",
    "hero.label_pickup": "Titik Jemput",
    "hero.label_dropoff": "Tujuan Pengantaran",
    "hero.label_vehicle": "Kelas Kendaraan",
    "hero.label_prop_type": "Tipe Properti",
    "hero.label_location": "Lokasi Properti",
    "hero.label_budget": "Rentang Anggaran",
    "hero.btn_check_tour": "Cek Harga & Pesan",
    "hero.btn_book_transfer": "Pesan Antar-Jemput",
    "hero.btn_inquire_prop": "Dapatkan Dokumen Properti",

    // Transfer Section
    "transfer.badge": "Antar-Jemput & Rental Driver Privat",
    "transfer.title": "Antar-Jemput Bandara & Pelabuhan Lombok Cepat & Nyaman",
    "transfer.desc":
      "Layanan antar-jemput privat di seluruh penjuru Lombok dengan pelacak penerbangan, armada ber-AC bersih, dan sopir profesional berpengalaman.",
    "transfer.feat1": "Garansi delay penerbangan tanpa biaya denda",
    "transfer.feat2":
      "Tarif transparan & pasti (Termasuk tol, bensin, dan parkir)",
    "transfer.feat3": "Respon WhatsApp kilat & koordinasi pengemudi langsung",
    "transfer.form_title": "Pesan Antar-Jemput / Rental Chauffeur",
    "transfer.form_desc":
      "Estimasi tarif langsung dan reservasi sopir privat terhubung ke WhatsApp.",
    "transfer.pickup_point": "Titik Jemput",
    "transfer.dropoff_point": "Tujuan Pengantaran",
    "transfer.vehicle_choice": "Pilihan Kendaraan",
    "transfer.date_time": "Tanggal & Jam Jemput / Penerbangan",
    "transfer.passengers": "Jumlah Penumpang (Pax)",
    "transfer.flight_notes": "Nomor Penerbangan / Nama Hotel / Catatan Khusus",
    "transfer.btn_book": "Pesan via WhatsApp Concierge",

    // Property Section
    "property.badge": "Investasi & Real Estate Lombok",
    "property.title": "Villa Terverifikasi & Tanah Tepi Pantai",
    "property.desc":
      "Telusuri villa mewah siap huni dengan yield tinggi dan kavling tanah hak milik (SHM) lengkap dengan pendampingan hukum dan legalitas PMA.",
    "property.land_size": "Luas Tanah",
    "property.building_size": "Luas Bangunan",
    "property.bedrooms": "Kamar Tidur",
    "property.roi": "Estimasi ROI",
    "property.price": "Harga Penawaran",
    "property.view_details": "Lihat Detail",
    "property.features_legal": "Fitur & Legalitas Dokumen",
    "property.back_to_list": "← Kembali ke daftar properti",

    // Reviews Section
    "reviews.badge": "Kisah Nyata Tamu & Wisatawan",
    "reviews.title": "Dipercaya oleh Wisatawan & Investor Villa Mancanegara",
    "reviews.desc":
      "Testimoni jujur dari para tamu yang menjelajahi Lombok bersama tim pemandu, driver, dan konsultan properti kami.",

    // Tentang Kami
    "about.badge": "Mitra Perjalanan Lokal Lombok",
    "about.title":
      "Jelajahi Lombok dengan wawasan lokal dan bantuan yang mudah dipahami wisatawan internasional",
    "about.intro":
      "Lombok Travel Organizer membantu wisatawan mancanegara menikmati Lombok dengan lebih tenang dan lebih banyak waktu untuk menikmati destinasi terbaik.",
    "about.body":
      "Mulai dari penjemputan bandara, trekking Rinjani privat, island hopping, hingga kunjungan villa di Lombok Selatan, tim lokal kami membantu mengatur detail perjalanan melalui WhatsApp.",
    "about.card1_title": "Perjalanan sesuai kebutuhan",
    "about.card1_text":
      "Pilih paket wisata Lombok atau minta itinerary privat sesuai ritme, minat, dan tanggal perjalanan Anda.",
    "about.card2_title": "Perencanaan yang jelas",
    "about.card2_text":
      "Dapatkan informasi praktis tentang transfer, kendaraan, aktivitas, jadwal, dan kunjungan properti sebelum tiba.",
    "about.card3_title": "Bantuan lokal sejak tiba",
    "about.card3_text":
      "Tim kami di Lombok siap dihubungi melalui WhatsApp untuk koordinasi bandara, driver, dan pertanyaan selama perjalanan.",

    // Footer
    "footer.desc":
      "Mitra terpercaya di Lombok: Paket tour pilihan, layanan antar-jemput bandara & sewa mobil, serta investasi properti villa terverifikasi.",
    "footer.quick_links": "Tautan Cepat",
    "footer.contact_support": "Kontak & Bantuan",
    "footer.rights":
      "© 2026 Lombok Experience & Property. Seluruh hak cipta dilindungi.",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("site_lang") as Language;
    if (saved === "en" || saved === "id") {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("site_lang", newLang);
  };

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations["en"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
