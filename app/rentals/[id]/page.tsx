import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getRentalVehicleById, getRentalVehicles } from "@/lib/rentals";
import { formatIDR, formatImageUrl, maskId, unmaskId } from "@/app/_lib/utils";
import { Badge } from "@/app/_components/ui/Badge";
import { LocalizedText } from "@/app/_components/ui/LocalizedText";
import { RentalDetailClient } from "@/app/_sections/rentals/RentalDetailClient";
import {
  MotorcycleSvg,
  CarSvg,
  UsersSvg,
  GearSvg,
  CheckCircleSvg,
} from "@/app/_sections/rentals/rental.icons";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const vehicles = await getRentalVehicles(false);
  return vehicles.flatMap((v) => [{ id: v.id }, { id: maskId(v.id) }]);
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const rawId = unmaskId(id);
  const vehicle =
    (await getRentalVehicleById(rawId)) || (await getRentalVehicleById(id));

  if (!vehicle) {
    return {
      title: "Vehicle Not Found | Lombok Travel Organizer",
      robots: { index: false, follow: false },
    };
  }

  const maskedToken = maskId(vehicle.id);

  return {
    title: `Sewa ${vehicle.name} di Lombok | Rental Motor & Mobil`,
    description: `Rental ${vehicle.name} (${vehicle.type === "motorcycle" ? "Motor" : "Mobil"}) di Lombok. ${formatIDR(vehicle.pricePerDay)}/hari dengan fasilitas lengkap, 2 helm SNI, dan bantuan 24 jam.`,
    alternates: {
      canonical: `/rentals/${maskedToken}`,
    },
    openGraph: {
      title: `Sewa ${vehicle.name} di Lombok`,
      description: `Sewa ${vehicle.name} harian / mingguan di Lombok dengan unit terawat prima.`,
      url: `/rentals/${maskedToken}`,
      type: "website",
      images: vehicle.imageUrl
        ? [{ url: vehicle.imageUrl, alt: vehicle.name }]
        : undefined,
    },
  };
}

export default async function RentalDetailPage({ params }: PageProps) {
  const { id } = await params;
  const rawId = unmaskId(id);
  const vehicle =
    (await getRentalVehicleById(rawId)) || (await getRentalVehicleById(id));

  if (!vehicle) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-28 pb-20 bg-[#F7FCFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/#rental"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#0C4A6E] mb-6 hover:underline"
        >
          <LocalizedText translationKey="rental.back_to_list" />
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Main Content */}
          <div className="lg:col-span-7 space-y-8">
            {/* Vehicle Image Banner */}
            <div className="relative rounded-[23px] overflow-hidden border border-[#BAE6FD] shadow-md bg-white h-80 sm:h-96">
              <img
                src={formatImageUrl(
                  vehicle.imageUrl ||
                    "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80",
                )}
                alt={vehicle.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-white/90 backdrop-blur-md text-[#0284C7] shadow-sm flex items-center gap-1.5">
                  {vehicle.type === "motorcycle" ? (
                    <>
                      <MotorcycleSvg className="w-4 h-4" />
                      <span>Scooter / Motor</span>
                    </>
                  ) : (
                    <>
                      <CarSvg className="w-4 h-4" />
                      <span>Car / MPV</span>
                    </>
                  )}
                </span>
              </div>

              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0284C7] text-white shadow-md uppercase">
                  {vehicle.transmission === "matic" ? "Matic" : "Manual"}
                </span>
              </div>
            </div>

            {/* Vehicle Specs & Details */}
            <div className="bg-white p-6 sm:p-8 rounded-[23px] border border-[#BAE6FD] shadow-sm space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#0C4A6E]">
                  {vehicle.name}
                </h1>
                <p className="text-sm text-[#486581] mt-1">
                  Armada unit rental terawat prima, bersih, dan siap menemani
                  perjalanan wisata Anda di Lombok.
                </p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-y border-[#EFF8FF]">
                <div className="p-3.5 bg-[#F0F9FF] rounded-2xl border border-[#BAE6FD] flex items-center gap-3">
                  <UsersSvg className="w-5 h-5 text-[#0284C7] flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#6B8CA5] uppercase font-bold block">
                      <LocalizedText translationKey="rental.capacity" />
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-[#0C4A6E]">
                      {vehicle.capacityPax} Pax
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-[#F0F9FF] rounded-2xl border border-[#BAE6FD] flex items-center gap-3">
                  <GearSvg className="w-5 h-5 text-[#0284C7] flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#6B8CA5] uppercase font-bold block">
                      <LocalizedText translationKey="rental.transmission" />
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-[#0C4A6E] capitalize">
                      {vehicle.transmission}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-[#F0F9FF] rounded-2xl border border-[#BAE6FD] flex items-center gap-3 col-span-2 sm:col-span-1">
                  {vehicle.type === "motorcycle" ? (
                    <MotorcycleSvg className="w-5 h-5 text-[#0284C7] flex-shrink-0" />
                  ) : (
                    <CarSvg className="w-5 h-5 text-[#0284C7] flex-shrink-0" />
                  )}
                  <div>
                    <span className="text-[10px] text-[#6B8CA5] uppercase font-bold block">
                      <LocalizedText translationKey="rental.type" />
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-[#0C4A6E] capitalize">
                      {vehicle.type === "motorcycle"
                        ? "Motorcycle"
                        : "Car / MPV"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Inclusions & Features */}
              <div className="space-y-3">
                <h2 className="text-sm font-bold text-[#0C4A6E] uppercase tracking-wider">
                  <LocalizedText translationKey="rental.facilities" />
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {vehicle.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs sm:text-sm text-[#486581] bg-[#F7FCFF] p-2.5 rounded-xl border border-[#E0F2FE]"
                    >
                      <CheckCircleSvg className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terms & Conditions */}
              {/* <div className="space-y-3 pt-4 border-t border-[#EFF8FF]">
                <h2 className="text-sm font-bold text-[#0C4A6E] uppercase tracking-wider">
                  <LocalizedText translationKey="rental.rental_terms" />
                </h2>
                <ul className="space-y-2 text-xs text-[#5B7C93]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#0284C7] font-bold mt-0.5">•</span>
                    <span><LocalizedText translationKey="rental.term1" /></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0284C7] font-bold mt-0.5">•</span>
                    <span><LocalizedText translationKey="rental.term2" /></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0284C7] font-bold mt-0.5">•</span>
                    <span><LocalizedText translationKey="rental.term3" /></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0284C7] font-bold mt-0.5">•</span>
                    <span><LocalizedText translationKey="rental.term4" /></span>
                  </li>
                </ul>
              </div> */}
            </div>
          </div>

          {/* Right Sidebar Booking Form */}
          <div className="lg:col-span-5 space-y-6">
            <RentalDetailClient key={vehicle.id} vehicle={vehicle} />
          </div>
        </div>
      </div>
    </main>
  );
}
