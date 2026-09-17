import { Hero } from "@/app/_sections/hero/Hero";
import { ScatteredGallerySection } from "@/app/_sections/scattered-gallery/ScatteredGallerySection";
import { AntarJemputForm } from "@/app/_sections/antar-jemput/AntarJemputForm";
import { VehicleRentalSection } from "@/app/_sections/rentals/VehicleRentalSection";
import { TourPackagesSection } from "@/app/_sections/tours/TourPackagesSection";
import { PropertyList } from "@/app/_sections/properties/PropertyList";
import { CustomerReviews } from "@/app/_sections/testimonials/CustomerReviews";
import { AboutUs } from "@/app/_sections/about/AboutUs";
import { AnimatedSection } from "@/app/_components/ui/AnimatedSection";
import { getProperties } from "@/app/_lib/properties";
import { getTourPackages } from "@/lib/packages";
import { getRentalVehicles } from "@/lib/rentals";
import { getGallerySnapshots } from "@/app/_lib/gallery";
import { getCustomerReviews } from "@/app/_lib/reviews";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lombok Travel Organizer | Tours, Airport Transfer & Luxury Property",
  description:
    "Plan your Lombok holiday with curated tours, airport transfers, private drivers, and verified villas and land in South Lombok.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Lombok Travel Organizer | Tours, Transfers & Properties",
    description:
      "Book memorable Lombok experiences, reliable airport transfers, and explore verified property opportunities in South Lombok.",
  },
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const [properties, tourPackages, rentalVehicles, gallerySnapshots, customerReviews] = await Promise.all([
    getProperties(),
    getTourPackages(),
    getRentalVehicles(),
    getGallerySnapshots(),
    getCustomerReviews(),
  ]);

  return (
    <main className="flex min-h-screen flex-col">
      {/* 1. Hero Section with quick multi-service search */}
      {/* <Hero /> */}
      {/* 2. Scattered Polaroid/Photo Gallery Showcase */}
      <AnimatedSection>
        <ScatteredGallerySection snapshots={gallerySnapshots} />
      </AnimatedSection>

      {/* 3. Dynamic Curated Tour Packages (Synced with Supabase / Admin Panel) */}
      <AnimatedSection>
        <TourPackagesSection packages={tourPackages} />
      </AnimatedSection>

      {/* 3. Scooter & Car Rental Catalog */}
      <AnimatedSection>
        <VehicleRentalSection vehicles={rentalVehicles} />
      </AnimatedSection>

      {/* 4. Standalone Antar-Jemput (Pickup/Drop-off) WhatsApp Flow (§20) */}
      <AnimatedSection>
        <AntarJemputForm />
      </AnimatedSection>

      {/* 5. Verified Properties Showcase (lombokproperty.net style) */}
      <AnimatedSection>
        <PropertyList properties={properties} />
      </AnimatedSection>

      {/* 6. About Lombok Travel Organizer */}
      <AnimatedSection>
        <AboutUs />
      </AnimatedSection>

      {/* 7. Real Customer Reviews & Social Proof */}
      <AnimatedSection>
        <CustomerReviews reviews={customerReviews} />
      </AnimatedSection>
    </main>
  );
}
