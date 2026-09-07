import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getTourPackageBySlug, getTourPackages } from "@/lib/packages";
import { formatIDR, formatImageUrl, maskId, unmaskId } from "@/app/_lib/utils";
import { Badge } from "@/app/_components/ui/Badge";
import { CheckIcon } from "@/app/_components/ui/Icons";
import { LocalizedText } from "@/app/_components/ui/LocalizedText";
import { TourPackageDetailClient } from "@/app/_sections/tours/TourPackageDetailClient";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const packages = await getTourPackages();
  return packages.flatMap((p) => [
    { slug: p.slug },
    { slug: maskId(p.id || p.slug) },
  ]);
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const rawKey = unmaskId(slug);
  const pkg = (await getTourPackageBySlug(rawKey)) || (await getTourPackageBySlug(slug));

  if (!pkg) {
    return {
      title: "Tour Package Not Found | Lombok Travel Organizer",
      robots: { index: false, follow: false },
    };
  }

  const maskedToken = maskId(pkg.id || pkg.slug);

  return {
    title: `${pkg.title} | Lombok Tour Package`,
    description: `${pkg.tagline} Discover ${pkg.destination} with expert local guides and flexible booking.`,
    alternates: {
      canonical: `/packages/${maskedToken}`,
    },
    openGraph: {
      title: `${pkg.title} | Lombok Tour Package`,
      description: pkg.tagline,
      url: `/packages/${maskedToken}`,
      type: "website",
      images: pkg.imageUrl
        ? [{ url: formatImageUrl(pkg.imageUrl), alt: pkg.title }]
        : undefined,
    },
  };
}

export default async function TourPackageDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const rawKey = unmaskId(slug);
  const pkg = (await getTourPackageBySlug(rawKey)) || (await getTourPackageBySlug(slug));

  if (!pkg) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-28 pb-20 bg-[#F7FCFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/#tour-packages"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#0C4A6E] mb-6 hover:underline"
        >
          <LocalizedText translationKey="tour.back_to_list" />
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* Hero Image Banner */}
            <div className="relative rounded-[23px] overflow-hidden border border-[#BAE6FD] shadow-md bg-slate-900 h-80 sm:h-96">
              <img
                src={formatImageUrl(
                  pkg.imageUrl ||
                    "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80",
                )}
                alt={pkg.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="bg-[#0EA5E9] text-white font-bold text-xs px-3 py-1 rounded-full uppercase shadow-sm">
                  {pkg.category.replace("_", " ")}
                </span>
                {pkg.isFeatured && (
                  <span className="bg-amber-400 text-amber-950 font-bold text-xs px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                    ★ <LocalizedText translationKey="tour.featured" />
                  </span>
                )}
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap justify-between items-center text-xs text-white gap-2">
                <span className="bg-[#0369A1]/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-white font-bold border border-[#38BDF8]/30 flex items-center gap-1.5">
                  ⏱️ {pkg.duration}
                </span>
                <span className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  📍 {pkg.destination}
                </span>
              </div>
            </div>

            {/* Overview Card */}
            <div className="bg-white p-6 sm:p-8 rounded-[23px] border border-[#BAE6FD] shadow-sm space-y-5">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0C4A6E]">
                  {pkg.title}
                </h1>
                <p className="text-sm sm:text-base text-[#486581] leading-relaxed">
                  {pkg.tagline}
                </p>
              </div>

              {/* Highlights */}
              <div className="pt-4 border-t border-[#EFF8FF] space-y-3">
                <h2 className="font-bold text-sm text-[#0C4A6E] uppercase tracking-wider">
                  <LocalizedText translationKey="tour.highlights" />
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pkg.highlights.map((hl, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 text-xs sm:text-sm text-[#0C4A6E] bg-[#F0F9FF] p-3 rounded-xl border border-[#BAE6FD]"
                    >
                      <span className="text-[#0EA5E9] font-bold">
                        <CheckIcon className="w-4 h-4" />
                      </span>
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#EFF8FF]">
                <div className="space-y-2.5">
                  <h3 className="font-bold text-xs text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <LocalizedText translationKey="tour.included" />
                  </h3>
                  <ul className="space-y-2 text-xs text-[#486581]">
                    {pkg.included.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2.5">
                  <h3 className="font-bold text-xs text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <LocalizedText translationKey="tour.excluded" />
                  </h3>
                  <ul className="space-y-2 text-xs text-[#486581]">
                    {pkg.excluded.map((exc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold mt-0.5">✕</span>
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Itinerary Timeline Card */}
            {pkg.itinerary && pkg.itinerary.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-[23px] border border-[#BAE6FD] shadow-sm space-y-6">
                <h2 className="text-xl font-bold text-[#0C4A6E] flex items-center gap-2">
                  <span>🗺️</span>
                  <LocalizedText translationKey="tour.itinerary" />
                </h2>

                <div className="relative border-l-2 border-[#BAE6FD] ml-4 sm:ml-6 space-y-8 pl-6 sm:pl-8">
                  {pkg.itinerary.map((item, index) => (
                    <div key={index} className="relative group">
                      <div className="absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 rounded-full bg-[#0284C7] text-white font-black text-xs flex items-center justify-center shadow-md border-2 border-white">
                        {item.day}
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="font-bold text-base text-[#0C4A6E]">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#486581] leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Booking & Pricing Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <TourPackageDetailClient pkg={pkg} />
          </div>
        </div>
      </div>
    </main>
  );
}
