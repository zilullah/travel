import type { Language } from "@/app/_context/LanguageContext";

export const WHATSAPP_CONFIG = {
  phoneNumber: "6287754552859",
  defaultGreeting: "Hello LombokTravelOrganizer 👋",
};

export const WHATSAPP_TEMPLATES = {
  consultation: {
    en: `${WHATSAPP_CONFIG.defaultGreeting}\n\nI would like to consult about travel services in Lombok. Could you please assist me? Thank you!`,
    id: `${WHATSAPP_CONFIG.defaultGreeting}\n\nSaya ingin berkonsultasi tentang layanan perjalanan di Lombok. Mohon bantuannya, terima kasih!`,
  },

  property: (params: {
    title: string;
    location: string;
    price: string;
    date?: string;
    guests?: number;
    name?: string;
    notes?: string;
  }) => {
    let msg = `${WHATSAPP_CONFIG.defaultGreeting}\n\nSaya tertarik untuk konsultasi / booking Properti:\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `🏡 *Properti:* ${params.title}\n`;
    msg += `📍 *Lokasi:* ${params.location}\n`;
    msg += `💰 *Harga:* ${params.price}\n`;
    if (params.name) msg += `👤 *Nama:* ${params.name}\n`;
    if (params.date) msg += `📅 *Rencana Kunjungan / Survei:* ${params.date}\n`;
    if (params.guests) msg += `👥 *Jumlah Orang:* ${params.guests}\n`;
    if (params.notes) msg += `💬 *Catatan:* ${params.notes}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `Mohon info ketersediaan legalitas (dossier) & jadwal survei. Terima kasih!`;
    return msg;
  },

  antarJemput: (params: {
    pickup: string;
    dropoff: string;
    vehicle: string;
    date: string;
    time?: string;
    passengers: number;
    name?: string;
    notes?: string;
  }) => {
    const englishText = [
      "Hello LombokTravelOrganizer 👋*",
      "",
      "I would like to book a Private drop and pick up Transfer Service:",
      "━━━━━━━━━━━━━━━━━━━━━",
      `🚗 Vehicle: ${params.vehicle}`,
      `📍 Pick-up Point: ${params.pickup}`,
      `📍 Drop-off Destination: ${params.dropoff}`,
      `📅 Date: ${params.date}`,
      params.time ? `⏰ Time: ${params.time}` : null,
      `👥 Number of Passengers: ${params.passengers} People`,
      params.notes ? `💬 Note / Flight Number: ${params.notes}` : null,
      "━━━━━━━━━━━━━━━━━━━━━",
      "",
      "Could you please confirm driver availability and the total price?",
      "Thank you so much, and I’m looking forward to my trip to Lombok! 🌴",
    ]
      .filter((line): line is string => Boolean(line))
      .join("\n");

    const indonesiaText = [
      "",
      "--- Bahasa Indonesia ---",
      "",
      "Halo LombokTravelOrganizer 👋",
      "",
      "Saya ingin memesan layanan transfer Private drop and pick up:",
      "━━━━━━━━━━━━━━━━━━━━━",
      `🚗 Kendaraan: ${params.vehicle}`,
      `📍 Titik Jemput: ${params.pickup}`,
      `📍 Tujuan Drop-off: ${params.dropoff}`,
      `📅 Tanggal: ${params.date}`,
      params.time ? `⏰ Waktu: ${params.time}` : null,
      `👥 Jumlah Penumpang: ${params.passengers} Orang`,
      params.notes ? `💬 Catatan / Nomor Penerbangan: ${params.notes}` : null,
      "━━━━━━━━━━━━━━━━━━━━━",
      "",
      "Mohon konfirmasi ketersediaan sopir dan total harga yang harus dibayar.",
      "Terima kasih banyak, saya menantikan perjalanan saya ke Lombok! 🌴",
    ]
      .filter((line): line is string => Boolean(line))
      .join("\n");

    return `${englishText}${indonesiaText}`;
  },

  tour: (params: {
    tourTitle: string;
    duration: string;
    date?: string;
    guests?: number;
    name?: string;
    notes?: string;
  }) => {
    let msg = `${WHATSAPP_CONFIG.defaultGreeting}\n\nSaya ingin booking Paket Wisata:\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `🏝️ *Paket:* ${params.tourTitle}\n`;
    msg += `⏱️ *Durasi:* ${params.duration}\n`;
    if (params.date) msg += `📅 *Tanggal:* ${params.date}\n`;
    if (params.guests) msg += `👥 *Jumlah Peserta:* ${params.guests} Orang\n`;
    if (params.name) msg += `👤 *Nama:* ${params.name}\n`;
    if (params.notes) msg += `💬 *Catatan:* ${params.notes}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `Mohon informasi detail itinerary dan penawaran terbaik. Terima kasih!`;
    return msg;
  },

  rental: (params: {
    lang: Language;
    vehicleName: string;
    type: "motorcycle" | "car";
    transmission: string;
    price: string;
    totalPrice?: string;
    durationDays?: number;
    startDate?: string;
    withDriver?: boolean;
    deliveryLocation?: string;
    name?: string;
    notes?: string;
  }) => {
    const isEnglish = params.lang === "en";
    const category = isEnglish
      ? params.type === "motorcycle"
        ? "Motorbike Rental"
        : "Car Rental"
      : params.type === "motorcycle"
        ? "Sewa Motor"
        : "Sewa Mobil";
    const lines = [
      WHATSAPP_CONFIG.defaultGreeting,
      "",
      isEnglish
        ? "I would like to rent a vehicle in Lombok:"
        : "Saya ingin menyewa kendaraan di Lombok:",
      "━━━━━━━━━━━━━━━━━━━━━",
      `🛵 *${isEnglish ? "Vehicle" : "Unit Kendaraan"}:* ${params.vehicleName}`,
      `🏷️ *${isEnglish ? "Category" : "Kategori"}:* ${category} (${params.transmission.toUpperCase()})`,
      `💰 *${isEnglish ? "Rate" : "Tarif"}:* ${params.price} / ${isEnglish ? "day" : "hari"}`,
      params.totalPrice
        ? `🧾 *${isEnglish ? "Estimated Total" : "Total Estimasi"}:* ${params.totalPrice}`
        : null,
      params.withDriver === undefined
        ? null
        : `🚗 *${isEnglish ? "Service" : "Opsi"}:* ${
            params.withDriver
              ? isEnglish
                ? "With Driver"
                : "Dengan Supir"
              : isEnglish
                ? "Self Drive"
                : "Lepas Kunci"
          }`,
      params.durationDays
        ? `⏱️ *${isEnglish ? "Rental Duration" : "Durasi Sewa"}:* ${params.durationDays} ${isEnglish ? "Days" : "Hari"}`
        : null,
      params.startDate
        ? `📅 *${isEnglish ? "Start Date" : "Mulai Tanggal"}:* ${params.startDate}`
        : null,
      params.deliveryLocation
        ? `📍 *${isEnglish ? "Delivery / Handover Location" : "Lokasi Antar / Serah Terima"}:* ${params.deliveryLocation}`
        : null,
      params.name
        ? `👤 *${isEnglish ? "Renter Name" : "Nama Penyewa"}:* ${params.name}`
        : null,
      params.notes
        ? `💬 *${isEnglish ? "Notes" : "Catatan"}:* ${params.notes}`
        : null,
      "━━━━━━━━━━━━━━━━━━━━━",
      isEnglish
        ? "Please confirm vehicle availability and rental requirements. Thank you!"
        : "Mohon informasi ketersediaan unit dan persyaratan sewanya. Terima kasih!",
    ];

    return lines.filter((line): line is string => line !== null).join("\n");
  },
};
