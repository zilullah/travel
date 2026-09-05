export const WHATSAPP_CONFIG = {
  phoneNumber: "6287754552859",
  defaultGreeting: "Halo Travel Organizer Lombok.",
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
    let msg = `${WHATSAPP_CONFIG.defaultGreeting}\n\nSaya ingin memesan Layanan Antar-Jemput (Transport Pick-Up):\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `🚗 *Kendaraan:* ${params.vehicle}\n`;
    msg += `🛫 *Titik Jemput (Pickup):* ${params.pickup}\n`;
    msg += `🛬 *Tujuan (Drop-off):* ${params.dropoff}\n`;
    msg += `📅 *Tanggal:* ${params.date}\n`;
    if (params.time) msg += `⏰ *Jam:* ${params.time}\n`;
    msg += `👥 *Jumlah Penumpang:* ${params.passengers} Orang\n`;
    if (params.name) msg += `👤 *Nama Pemesan:* ${params.name}\n`;
    if (params.notes) msg += `💬 *Catatan / No Penerbangan:* ${params.notes}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `Mohon konfirmasi ketersediaan driver dan total tarif. Terima kasih!`;
    return msg;
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
};
