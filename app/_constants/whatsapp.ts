export const WHATSAPP_CONFIG = {
  phoneNumber: "6287754552859",
  defaultGreeting: "Hello LombokTravelOrganizer 👋",
};

export const WHATSAPP_TEMPLATES = {
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
    vehicleName: string;
    type: "motorcycle" | "car";
    transmission: string;
    price: string;
    durationDays?: number;
    startDate?: string;
    withDriver?: boolean;
    name?: string;
    notes?: string;
  }) => {
    let msg = `${WHATSAPP_CONFIG.defaultGreeting}\n\nSaya ingin menyewa kendaraan di Lombok:\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `🛵 *Unit Kendaraan:* ${params.vehicleName}\n`;
    msg += `🏷️ *Kategori:* ${params.type === "motorcycle" ? "Sewa Motor" : "Sewa Mobil"} (${params.transmission.toUpperCase()})\n`;
    msg += `💰 *Tarif:* ${params.price} / hari\n`;
    if (params.withDriver !== undefined) {
      msg += `🚗 *Opsi:* ${params.withDriver ? "Dengan Supir" : "Lepas Kunci"}\n`;
    }
    if (params.durationDays) msg += `⏱️ *Durasi Sewa:* ${params.durationDays} Hari\n`;
    if (params.startDate) msg += `📅 *Mulai Tanggal:* ${params.startDate}\n`;
    if (params.name) msg += `👤 *Nama Penyewa:* ${params.name}\n`;
    if (params.notes) msg += `💬 *Catatan:* ${params.notes}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `Mohon informasi ketersediaan unit dan persyaratan sewanya. Terima kasih!`;
    return msg;
  },
};
