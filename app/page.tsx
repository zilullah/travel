import { Hero } from "@/app/_sections/hero/Hero";
import { AntarJemputForm } from "@/app/_sections/antar-jemput/AntarJemputForm";
import { TourPackagesSection } from "@/app/_sections/tours/TourPackagesSection";
import { PropertyList } from "@/app/_sections/properties/PropertyList";
import { CustomerReviews } from "@/app/_sections/testimonials/CustomerReviews";
import { AboutUs } from "@/app/_sections/about/AboutUs";
import { AnimatedSection } from "@/app/_components/ui/AnimatedSection";
import { getProperties } from "@/app/_lib/properties";
import { getTourPackages } from "@/lib/packages";

export default async function Home() {
  const [properties, tourPackages] = await Promise.all([
    getProperties(),
    getTourPackages(),
  ]);

  return (
    <main className="flex min-h-screen flex-col">
      {/* 1. Hero Section with quick multi-service search */}
      <Hero />

      <AboutUs />

      {/* 2. Dynamic Curated Tour Packages (Synced with Supabase / Admin Panel) */}
      <AnimatedSection>
        <TourPackagesSection packages={tourPackages} />
      </AnimatedSection>

      {/* 3. Standalone Antar-Jemput (Pickup/Drop-off) WhatsApp Flow (§20) */}
      <AnimatedSection>
        <AntarJemputForm />
      </AnimatedSection>

      {/* 4. Verified Properties Showcase (lombokproperty.net style) */}
      <AnimatedSection>
        <PropertyList properties={properties} />
      </AnimatedSection>

      {/* 5. Real Customer Reviews & Social Proof */}
      <AnimatedSection>
        <CustomerReviews />
      </AnimatedSection>
    </main>
  );
}
