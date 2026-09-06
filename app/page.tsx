import { Hero } from "@/app/_sections/hero/Hero";
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

export default async function Home() {
  const [properties, tourPackages, rentalVehicles] = await Promise.all([
    getProperties(),
    getTourPackages(),
    getRentalVehicles(),
  ]);

  return (
    <main className="flex min-h-screen flex-col">
      {/* 1. Hero Section with quick multi-service search */}
      <Hero />

      {/* 2. Dynamic Curated Tour Packages (Synced with Supabase / Admin Panel) */}
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
        <CustomerReviews />
      </AnimatedSection>
    </main>
  );
}
