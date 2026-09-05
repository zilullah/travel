import { notFound } from "next/navigation";
import { getPropertyBySlug, getProperties } from "@/app/_lib/properties";
import { PropertyBookingForm } from "@/app/_sections/property-booking/PropertyBookingForm";
import { Badge } from "@/app/_components/ui/Badge";
import { formatIDR } from "@/app/_lib/utils";
import { CheckIcon } from "@/app/_components/ui/Icons";
import Link from "next/link";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const properties = await getProperties();
  return properties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return {
      title: "Property Not Found | Lombok Travel Organizer",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${property.title} | Lombok Property`,
    description: `${property.tagline}. Explore location, ownership, estimated returns, and arrange a private viewing with Lombok Travel Organizer.`,
    alternates: {
      canonical: `/properties/${property.slug}`,
    },
    openGraph: {
      title: `${property.title} | Lombok Property`,
      description: property.tagline,
      url: `/properties/${property.slug}`,
      type: "website",
      images: property.image
        ? [{ url: property.image, alt: property.title }]
        : undefined,
    },
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-28 pb-20 bg-[#F7FCFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#0C4A6E] mb-6 hover:underline"
        >
          ← Kembali ke daftar properti
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-[23px] overflow-hidden border border-[#BAE6FD] shadow-md bg-slate-900 h-96">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="bg-white p-8 rounded-[23px] border border-[#BAE6FD] shadow-sm space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="sky">{property.status}</Badge>
                <Badge variant="slate">{property.ownership}</Badge>
              </div>

              <h1 className="text-3xl font-extrabold text-[#0C4A6E]">
                {property.title}
              </h1>
              <p className="text-sm text-[#486581] leading-relaxed">
                {property.tagline}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-[#EFF8FF] text-sm">
                <div>
                  <span className="text-xs text-[#6B8CA5] block uppercase">
                    Luas Tanah
                  </span>
                  <span className="font-bold text-[#0C4A6E]">
                    {property.landSizeM2} m²
                  </span>
                </div>
                {property.buildingSizeM2 && (
                  <div>
                    <span className="text-xs text-[#6B8CA5] block uppercase">
                      Luas Bangunan
                    </span>
                    <span className="font-bold text-[#0C4A6E]">
                      {property.buildingSizeM2} m²
                    </span>
                  </div>
                )}
                {property.bedrooms && (
                  <div>
                    <span className="text-xs text-[#6B8CA5] block uppercase">
                      Kamar Tidur
                    </span>
                    <span className="font-bold text-[#0C4A6E]">
                      {property.bedrooms} Kamar
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-xs text-[#6B8CA5] block uppercase">
                    Estimasi ROI
                  </span>
                  <span className="font-bold text-[#0284C7]">
                    {property.roi}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h3 className="font-bold text-sm text-[#0C4A6E] uppercase">
                  Fitur & Legalitas
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#486581]">
                  {property.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="text-[#0EA5E9] font-bold">
                        <CheckIcon className="w-3.5 h-3.5 inline" />
                      </span>{" "}
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar Booking Form */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-[23px] border border-[#BAE6FD] shadow-sm">
              <span className="text-xs text-[#6B8CA5] uppercase font-bold block">
                Harga Penawaran
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-[#0C4A6E]">
                  {formatIDR(property.priceIdr)}
                </span>
              </div>
            </div>

            <PropertyBookingForm property={property} />
          </div>
        </div>
      </div>
    </main>
  );
}
