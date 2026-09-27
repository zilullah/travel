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
    "nav.tours": "Tours",
    "nav.rentals": "Rentals",
    "nav.pickup": "Transfers",
    "nav.properties": "Properties",
    "nav.about": "About",
    "nav.contact": "WhatsApp",
    "header.tagline": "Tours • Transfers • Real Estate",
    "header.whatsapp_cta": "WhatsApp Us",
    "header.whatsapp_247": "Contact WhatsApp 24/7",
    "whatsapp.consultation": "Consult via WhatsApp",

    // Scattered Gallery
    "gallery.badge": "Lombok Visual Journey",
    "gallery.title": "Snapshot Real Adventures in Lombok",
    "gallery.desc":
      "Explore hidden gems of Lombok from Mount Rinjani summit, Mandalika sunset savanna, to exclusive private villas.",
    "gallery.explore": "Explore",
    "gallery.rinjani_title": "Mount Rinjani Caldera",
    "gallery.rinjani_sub": "3,726 MASL summit • Cloud sea & turquoise lake.",
    "gallery.rinjani_badge_top": "3D2N Trek",
    "gallery.rinjani_badge_extra": "Sembalun Route",
    "gallery.gili_title": "Secret Gili Snorkeling",
    "gallery.gili_sub":
      "Crystal clear water at Gili Nanggu & wild sea turtles.",
    "gallery.gili_badge_top": "Island Hopping",
    "gallery.gili_stat": "99% Clarity",
    "gallery.gili_badge_extra": "Private Boat",
    "gallery.merese_title": "Bukit Merese Savanna",
    "gallery.merese_sub": "Mandalika ocean breeze, green hills & 360° sunset.",
    "gallery.merese_badge_top": "18:10 WITA",
    "gallery.merese_stat": "GOLDEN HOUR",
    "gallery.merese_badge_extra": "Mandalika Coast",
    "gallery.pink_title": "Pink Sand Beach",
    "gallery.pink_sub": "Naturally tinted pink sands from red deep-sea corals.",
    "gallery.pink_badge_top": "Highlight",
    "gallery.pink_stat": "ALL-INCLUSIVE",
    "gallery.pink_badge_extra": "Speedboat Pier",
    "gallery.tiu_title": "Tiu Kelep Waterfall",
    "gallery.tiu_sub": "Lush Senaru jungle with majestic refreshing waterfall.",
    "gallery.tiu_badge_top": "Hidden Gem",
    "gallery.tiu_stat": "North Lombok",
    "gallery.tiu_badge_extra": "Forest Trek",
    "gallery.pusuk_title": "Baun Pusuk Forest",
    "gallery.pusuk_sub": "Scenic mountain pass with friendly roadside monkeys.",
    "gallery.pusuk_badge_top": "Pusuk Forest",
    "gallery.pusuk_stat": "ROAD TRIP",
    "gallery.pusuk_badge_extra": "Innova Chauffeur",
    "gallery.surf_title": "Selong Belanak Surf",
    "gallery.surf_sub":
      "Soft coral-free sands, ideal for beginner surf lessons.",
    "gallery.surf_badge_top": "Surf & Sun",
    "gallery.surf_stat": "BEGINNER",
    "gallery.surf_badge_extra": "South Coast",
    "gallery.villa_title": "Infinity Villa Kuta",
    "gallery.villa_sub":
      "Wake up and swim overlooking Mandalika hills and ocean.",
    "gallery.villa_badge_top": "Villa & Stay",
    "gallery.villa_stat": "EXCLUSIVE",
    "gallery.villa_badge_extra": "Mandalika Ridge",

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
    "transfer.form_title": "Book Transfer",
    "transfer.form_desc":
      "Instant quote and private chauffeur reservation dispatched via WhatsApp.",
    "transfer.pickup_point": "Pickup Point",
    "transfer.dropoff_point": "Drop-off Destination",
    "transfer.vehicle_choice": "Select Vehicle",
    "transfer.date_time": "Date & Flight / Pickup Time",
    "transfer.pickup_date": "Pickup Date",
    "transfer.pickup_time": "Flight / Pickup Time",
    "transfer.pickup_placeholder": "e.g. hotel or pickup location",
    "transfer.dropoff_placeholder": "e.g. villa, hotel, or harbor",
    "transfer.vehicle_placeholder": "e.g. Innova, HiAce, or suitable vehicle",
    "transfer.notes_placeholder":
      "Flight number, hotel name, luggage count, or child seat requests...",
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
    "property.features": "Features & Legal Due Diligence",
    "property.asking_price": "Asking Price",
    "property.rental_price": "Rental Price",

    // Reviews Section
    "reviews.badge": "Verified Guest Stories",
    "reviews.title": "Trusted by Travelers & Villa Investors Worldwide",
    "reviews.desc":
      "Honest feedback from international guests who explored Lombok with our drivers, guides, and real estate advisors.",
    "property.rooms": "Rooms",
    "reviews.trip1": "Rinjani 3D2N Summit + Airport Pickup",
    "reviews.trip2": "Kuta Mandalika Villa Acquisition",
    "reviews.trip3": "Secret Gili Snorkeling & Private Boat",
    "reviews.quote1":
      "Flawless communication from the moment we landed at BIL. Our driver Hendra was waiting on time, and our mountain guides made the summit push feel safe and unforgettable.",
    "reviews.quote2":
      "Clear legal diligence and transparent PMA advisory. We inspected three turnkey villas in Selong Belanak and closed our leasehold smoothly.",
    "reviews.quote3":
      "Private island hopping at Gili Nanggu with crystal waters, sea turtles, and grilled fish right on the sandbar. Truly the best day of our Indonesia trip.",

    // Rentals Section
    "rental.badge": "Lombok Scooter & Car Rental",
    "rental.title": "Rent Motorbikes & Cars in Lombok",
    "rental.desc":
      "Explore Lombok with total freedom. Premium maintained scooters and cars with 2 helmets, raincoats, and 24/7 road assistance.",
    "rental.tab_all": "All Vehicles",
    "rental.tab_motorcycle": "Scooters / Motorbikes",
    "rental.tab_car": "Cars / MPV",
    "rental.per_day": "/ day",
    "rental.pax": "Pax",
    "rental.with_driver": "With Driver",
    "rental.self_drive": "Self Drive",
    "rental.book_now": "Rent via WhatsApp",
    "rental.view_details": "View Details",
    "rental.details": "Details",
    "rental.rent_wa": "Rent",
    "rental.back_to_list": "← Back to Rentals",
    "rental.specifications": "Vehicle Specifications",
    "rental.facilities": "Included Amenities & Features",
    "rental.transmission": "Transmission",
    "rental.capacity": "Capacity",
    "rental.type": "Category",
    // "rental.rental_terms": "Rental Terms & Delivery",
    // "rental.term1":
    //   "Free delivery to Lombok International Airport (BIL) or Kuta Lombok area hotel",
    // "rental.term2": "Clean SNI helmets + fresh raincoats provided",
    // "rental.term3": "24/7 emergency roadside assistance support across Lombok",
    // "rental.term4": "Valid ID / Passport required for booking verification",

    // About Us
    "about.badge": "Your Local Lombok Travel Partner",
    "about.title":
      "Trusted Lombok Tour Organizer, Airport Transfer & Island Experiences",
    "about.intro":
      "Lombok Travel Organizer is a trusted local agency dedicated to delivering seamless island adventures, reliable airport transfers, motorbike/car rentals, and verified South Lombok villa investments.",
    "about.body":
      "Based in Lombok with fluent English support, our team handles everything from your Mount Rinjani summit treks and Secret Gili private boat tours to hassle-free Mandalika airport pickups. Follow our journey on social media for live island updates, guest stories, and travel tips.",
    "about.card1_title": "Custom Tours & Adventures",
    "about.card1_text":
      "Choose curated Lombok tour packages or customize private itineraries for Rinjani trekking, Pink Beach, and Secret Gili island hopping.",
    "about.card2_title": "Transparent & Reliable Logistics",
    "about.card2_text":
      "Clear pricing for airport transfers, well-maintained scooter & car rentals, and verified legal due diligence for property surveys.",
    "about.card3_title": "24/7 Local WhatsApp Concierge",
    "about.card3_text":
      "Our Lombok-based team is always reachable via WhatsApp for instant booking assistance, flight tracking, and local recommendations.",
    "about.local_team": "Lombok Local Team",
    "about.english_support": "Fluent English Support",
    "about.private_planning": "Tailored Private Trips",
    "about.social_heading": "Follow Our Island Journeys",
    "about.social_sub":
      "Check out real guest moments, travel guides & behind-the-scenes on Instagram & TikTok",
    "about.tiktok_label": "Watch on TikTok",
    "about.instagram_label": "Follow on Instagram",

    // Tours & Booking
    "tour.badge": "Curated Lombok Tour Packages",
    "tour.title": "Authentic Island Adventures & Trekking",
    "tour.desc":
      "Explore curated Lombok tour packages for European and international travelers, from Rinjani trekking and Gili island hopping to South Lombok beaches, private boats, and flexible day trips.",
    "tour.featured": "Featured",
    "tour.start_from": "Start from",
    "tour.person": "/ person",
    "tour.book": "Book Tour",
    "tour.view_details": "View Details",
    "tour.back_to_list": "← Back to Tour Packages",
    "tour.highlights": "Highlights & Key Sights",
    "tour.included": "Included in Package",
    "tour.excluded": "Excluded (Not Included)",
    "tour.itinerary": "Day-by-Day Itinerary",
    "tour.pricing_tiers": "Group & Tier Pricing",
    "tour.select_pax": "Select Travelers & Pricing",
    "booking.title": "Inquire Legal Dossier & Site Tour",
    "booking.desc":
      "Request full title certificates, ROI breakdown, and private property viewing.",
    "booking.full_name": "Your Full Name",
    "booking.full_name_placeholder": "Full name",
    "booking.survey_date": "Target Survey Date",
    "booking.group_size": "Group / Party Size",
    "booking.questions": "Questions / Specific Interest",
    "booking.questions_placeholder":
      "e.g. PT PMA structure, villa permits, or daily rental projections...",
    "booking.request": "Request Dossier via WhatsApp",
    "header.language": "Language / Bahasa",
    "header.toggle_menu": "Toggle navigation menu",

    // Footer
    "footer.desc":
      "Your premier partner in Lombok: Curated tour packages, airport pick-ups and private transfers, and verified luxury property investments.",
    "footer.quick_links": "Quick Links",
    "footer.contact_support": "Contact & Support",
    "footer.rights":
      "© 2026 Lombok Travel Organizer & Property. All rights reserved.",
  },
  id: {
    // Nav & Header
    "nav.tours": "Wisata",
    "nav.rentals": "Rental",
    "nav.pickup": "Antar-Jemput",
    "nav.properties": "Properti",
    "nav.about": "Tentang Kami",
    "nav.contact": "WhatsApp",
    "header.tagline": "Wisata • Antar-Jemput • Properti",
    "header.whatsapp_cta": "Hubungi WhatsApp",
    "header.whatsapp_247": "Hubungi WhatsApp 24/7",
    "whatsapp.consultation": "Konsultasi via WhatsApp",

    // Scattered Gallery
    "gallery.badge": "Lombok Visual Journey",
    "gallery.title": "Snapshot Petualangan Nyata di Lombok",
    "gallery.desc":
      "Jelajahi keindahan tersembunyi pulau Lombok dari puncak Rinjani, savana sunset Mandalika, hingga villa eksklusif.",
    "gallery.explore": "Jelajahi",
    "gallery.rinjani_title": "Kaldera Rinjani",
    "gallery.rinjani_sub":
      "Puncak 3,726 MDPL • Lautan awan & danau Segara Anak.",
    "gallery.rinjani_badge_top": "Trek 3H2M",
    "gallery.rinjani_badge_extra": "Jalur Sembalun",
    "gallery.gili_title": "Snorkeling Gili Rahasia",
    "gallery.gili_sub": "Air sebening kaca di Gili Nanggu & kura-kura jinak.",
    "gallery.gili_badge_top": "Island Hopping",
    "gallery.gili_stat": "Air Bening 99%",
    "gallery.gili_badge_extra": "Kapal Privat",
    "gallery.merese_title": "Savanna Bukit Merese",
    "gallery.merese_sub": "Angin sepoi Mandalika, padang hijau & sunset 360°.",
    "gallery.merese_badge_top": "18:10 WITA",
    "gallery.merese_stat": "GOLDEN HOUR",
    "gallery.merese_badge_extra": "Pesisir Mandalika",
    "gallery.pink_title": "Pantai Pasir Pink",
    "gallery.pink_sub": "Pasir merona alami pecahan koral merah laut dalam.",
    "gallery.pink_badge_top": "Pilihan Utama",
    "gallery.pink_stat": "ALL-INCLUSIVE",
    "gallery.pink_badge_extra": "Dermaga Speedboat",
    "gallery.tiu_title": "Air Terjun Tiu Kelep",
    "gallery.tiu_sub":
      "Hutan rimbun Senaru dengan air terjun megah menyegarkan.",
    "gallery.tiu_badge_top": "Hidden Gem",
    "gallery.tiu_stat": "Lombok Utara",
    "gallery.tiu_badge_extra": "Trek Hutan Segar",
    "gallery.pusuk_title": "Hutan Monyet Baun Pusuk",
    "gallery.pusuk_sub": "Jalur tepi jalan berkabut & kawanan monyet ramah.",
    "gallery.pusuk_badge_top": "Hutan Pusuk",
    "gallery.pusuk_stat": "ROAD TRIP",
    "gallery.pusuk_badge_extra": "Innova & Supir",
    "gallery.surf_title": "Selancar Selong Belanak",
    "gallery.surf_sub": "Pasir halus tanpa karang tajam, ramah bagi pemula.",
    "gallery.surf_badge_top": "Surf & Sun",
    "gallery.surf_stat": "RAMAH PEMULA",
    "gallery.surf_badge_extra": "Pesisir Selatan",
    "gallery.villa_title": "Infinity Villa Kuta",
    "gallery.villa_sub":
      "Berenang langsung menghadap pemandangan bukit dan laut.",
    "gallery.villa_badge_top": "Villa & Stay",
    "gallery.villa_stat": "EKSKLUSIF",
    "gallery.villa_badge_extra": "Kuta Mandalika",

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
    "transfer.pickup_date": "Tanggal Jemput",
    "transfer.pickup_time": "Jam Penerbangan / Jemput",
    "transfer.pickup_placeholder": "contoh: hotel atau lokasi jemput",
    "transfer.dropoff_placeholder": "contoh: villa, hotel, atau pelabuhan",
    "transfer.vehicle_placeholder":
      "contoh: Innova, HiAce, atau kendaraan sesuai kebutuhan",
    "transfer.notes_placeholder":
      "Nomor penerbangan, nama hotel, jumlah bagasi, atau permintaan kursi anak...",
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
    "property.features": "Fitur & Legalitas Dokumen",
    "property.asking_price": "Harga Penawaran",
    "property.rental_price": "Harga Sewa",

    // Reviews Section
    "reviews.badge": "Kisah Nyata Tamu & Wisatawan",
    "reviews.title": "Dipercaya oleh Wisatawan & Investor Villa Mancanegara",
    "reviews.desc":
      "Testimoni jujur dari para tamu yang menjelajahi Lombok bersama tim pemandu, driver, dan konsultan properti kami.",
    "property.rooms": "Kamar",
    "reviews.trip1": "Puncak Rinjani 3H2M + Antar-Jemput Bandara",
    "reviews.trip2": "Akuisisi Villa Kuta Mandalika",
    "reviews.trip3": "Snorkeling Gili Rahasia & Kapal Privat",
    "reviews.quote1":
      "Komunikasi sangat lancar sejak kami mendarat di BIL. Driver kami, Hendra, sudah menunggu tepat waktu dan pemandu gunung membuat pendakian terasa aman serta tak terlupakan.",
    "reviews.quote2":
      "Pendampingan legal yang jelas dan konsultasi PMA yang transparan. Kami melihat tiga villa siap huni di Selong Belanak dan menyelesaikan proses leasehold dengan lancar.",
    "reviews.quote3":
      "Island hopping privat di Gili Nanggu dengan air jernih, penyu, dan ikan bakar langsung di gundukan pasir. Hari terbaik selama perjalanan kami di Indonesia.",

    // Rentals Section
    "rental.badge": "Rental Motor & Mobil Lombok",
    "rental.title": "Sewa Motor & Mobil Nyaman di Lombok",
    "rental.desc":
      "Jelajahi Lombok dengan bebas dan leluasa. Unit motor dan mobil terawat prima, lengkap dengan 2 helm SNI, jas hujan, dan bantuan darurat 24 jam.",
    "rental.tab_all": "Semua Kendaraan",
    "rental.tab_motorcycle": "Sewa Motor",
    "rental.tab_car": "Sewa Mobil",
    "rental.per_day": "/ hari",
    "rental.pax": "Penumpang",
    "rental.with_driver": "Dengan Supir",
    "rental.self_drive": "Lepas Kunci",
    "rental.book_now": "Sewa via WhatsApp",
    "rental.view_details": "Lihat Detail",
    "rental.details": "Detail",
    "rental.rent_wa": "Sewa",
    "rental.back_to_list": "← Kembali ke Katalog Rental",
    "rental.specifications": "Spesifikasi Kendaraan",
    "rental.facilities": "Fasilitas & Fitur Termasuk",
    "rental.transmission": "Transmisi",
    "rental.capacity": "Kapasitas",
    "rental.type": "Kategori",
    "rental.rental_terms": "Syarat & Ketentuan Sewa",
    "rental.term1":
      "Serah terima unit fleksibel di area Bandara Lombok (BIL) atau hotel",
    "rental.term2": "Termasuk 2 helm SNI bersih + jas hujan siap pakai",
    "rental.term3": "Bantuan darurat roadside assistance 24 jam se-Lombok",
    "rental.term4": "Cukup tunjukkan KTP / Paspor & SIM untuk verifikasi cepat",

    // Tentang Kami
    "about.badge": "Mitra Perjalanan Lokal Lombok",
    "about.title":
      "Penyelenggara Wisata Lombok Terpercaya, Antar-Jemput Bandara & Pengalaman Pulau",
    "about.intro":
      "Lombok Travel Organizer adalah agen lokal resmi dan terpercaya yang melayani paket wisata pulau terbaik, antar-jemput bandara tepat waktu, rental motor/mobil prima, dan konsultasi investasi villa Lombok Selatan.",
    "about.body":
      "Berbasis di Lombok dengan tim lokal ramah dan berpengalaman, kami siap membantu pendakian Gunung Rinjani, island hopping Gili privat, hingga penjemputan bandara BIL Mandalika secara mudah via WhatsApp. Ikuti media sosial kami untuk update wisata dan dokumentasi perjalanan terkini.",
    "about.card1_title": "Paket Wisata & Petualangan Kustom",
    "about.card1_text":
      "Pilih paket tour Lombok favorit atau atur itinerary privat Anda sendiri: trekking Rinjani, Pantai Pink, hingga Secret Gili snorkeling.",
    "about.card2_title": "Layanan Transportasi & Logistik Jelas",
    "about.card2_text":
      "Tarif transparan untuk antar-jemput bandara & pelabuhan, armada sewa motor dan mobil terawat, serta pendampingan survei properti.",
    "about.card3_title": "Bantuan WhatsApp Cepat 24/7",
    "about.card3_text":
      "Tim lokal kami di Lombok siap mendampingi kebutuhan perjalanan, pelacakan jam penerbangan, hingga rekomendasi kuliner lokal.",
    "about.local_team": "Tim Lokal Asli Lombok",
    "about.english_support": "Bahasa Indonesia & English",
    "about.private_planning": "Perjalanan Privat Fleksibel",
    "about.social_heading": "Ikuti Petualangan Kami",
    "about.social_sub":
      "Tonton keseruan liburan tamu kami, tips wisata, dan pesona Lombok di Instagram & TikTok",
    "about.tiktok_label": "Tonton di TikTok",
    "about.instagram_label": "Ikuti di Instagram",

    // Paket Wisata & Booking
    "tour.badge": "Paket Wisata Lombok Pilihan",
    "tour.title": "Petualangan Pulau dan Trekking Autentik",
    "tour.desc":
      "Jelajahi paket wisata Lombok pilihan untuk wisatawan lokal dan mancanegara, mulai dari trekking Rinjani, island hopping Gili, pantai Lombok Selatan, kapal privat, hingga perjalanan harian fleksibel.",
    "tour.featured": "Pilihan",
    "tour.start_from": "Mulai dari",
    "tour.person": "/ orang",
    "tour.book": "Pesan Wisata",
    "tour.view_details": "Lihat Detail",
    "tour.back_to_list": "← Kembali ke Paket Wisata",
    "tour.highlights": "Highlight & Destinasi Utama",
    "tour.included": "Termasuk dalam Paket",
    "tour.excluded": "Tidak Termasuk",
    "tour.itinerary": "Rencana Perjalanan (Itinerary)",
    "tour.pricing_tiers": "Pilihan Jumlah Orang & Harga",
    "tour.select_pax": "Pilih Jumlah Peserta",
    "booking.title": "Tanyakan Dokumen Legal & Tur Lokasi",
    "booking.desc":
      "Minta sertifikat hak lengkap, rincian ROI, dan jadwal kunjungan properti privat.",
    "booking.full_name": "Nama Lengkap",
    "booking.full_name_placeholder": "Nama lengkap",
    "booking.survey_date": "Tanggal Survei",
    "booking.group_size": "Jumlah Rombongan",
    "booking.questions": "Pertanyaan / Minat Khusus",
    "booking.questions_placeholder":
      "Contoh: struktur PT PMA, perizinan villa, atau proyeksi sewa harian...",
    "booking.request": "Minta Dokumen via WhatsApp",
    "header.language": "Bahasa / Language",
    "header.toggle_menu": "Buka atau tutup menu navigasi",

    // Footer
    "footer.desc":
      "Mitra terpercaya di Lombok: Paket tour pilihan, layanan antar-jemput bandara & sewa mobil, serta investasi properti villa terverifikasi.",
    "footer.quick_links": "Tautan Cepat",
    "footer.contact_support": "Kontak & Bantuan",
    "footer.rights":
      "© 2026 Lombok Travel Organizer & Property. Seluruh hak cipta dilindungi.",
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
