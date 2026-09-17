import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Halaman Tidak Ditemukan | Lombok Travel Organizer",
  description:
    "Halaman yang Anda cari tidak tersedia. Kembali ke beranda atau jelajahi layanan perjalanan Lombok kami.",
  robots: {
    index: false,
    follow: true,
  },
};

const destinations = [
  { href: "/", label: "Kembali ke beranda", primary: true },
  { href: "/packages", label: "Paket wisata" },
  { href: "/rentals", label: "Rental kendaraan" },
  { href: "/properties", label: "Properti Lombok" },
];

export default function NotFound() {
  return (
    <main className="relative flex min-h-[75vh] items-center overflow-hidden bg-[#F7FCFF] px-4 pb-20 pt-32 sm:px-6">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(165deg,transparent_35%,#E0F2FE_35.2%,#BAE6FD_58%,#0EA5E9_58.2%,#075985_100%)] opacity-70"
      />

      <section className="relative mx-auto w-full max-w-3xl rounded-[23px] border border-[#BAE6FD] bg-white/95 p-7 text-center shadow-[0_24px_80px_rgba(7,89,133,0.15)] backdrop-blur sm:p-12">
        <p className="font-mono text-sm font-bold uppercase tracking-[0.3em] text-[#0284C7]">
          Rute tidak ditemukan
        </p>
        <p aria-hidden="true" className="mt-4 text-7xl font-black leading-none text-[#0EA5E9] sm:text-9xl">
          404
        </p>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-[#0C4A6E] sm:text-5xl">
          Halaman tidak ditemukan
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#486581]">
          Alamat mungkin berubah atau halaman sudah tidak tersedia. Pilih tujuan lain untuk melanjutkan perjalanan Anda di Lombok.
        </p>

        <nav aria-label="Pilihan halaman" className="mt-8 flex flex-wrap justify-center gap-3">
          {destinations.map(({ href, label, primary }) => (
            <Link
              key={href}
              href={href}
              className={`inline-flex min-h-12 items-center justify-center rounded-[23px] px-5 py-3 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0284C7] ${
                primary
                  ? "bg-[#0EA5E9] text-white hover:bg-[#0284C7]"
                  : "border border-[#BAE6FD] bg-[#EFF8FF] text-[#0C4A6E] hover:border-[#38BDF8] hover:bg-[#E0F2FE]"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </section>
    </main>
  );
}
