import { Hero } from "@/app/_sections/hero/Hero";
import { AntarJemputForm } from "@/app/_sections/antar-jemput/AntarJemputForm";
import { PropertyList } from "@/app/_sections/properties/PropertyList";
import { CustomerReviews } from "@/app/_sections/testimonials/CustomerReviews";
import { AnimatedSection } from "@/app/_components/ui/AnimatedSection";
import { getProperties } from "@/app/_lib/properties";

export default async function Home() {
  const properties = await getProperties();

  return (
    <main className="flex min-h-screen flex-col">
      {/* 1. Hero Section with quick multi-service search */}
      <Hero />

      {/* 2. Standalone Antar-Jemput (Pickup/Drop-off) WhatsApp Flow (§20) */}
      <AnimatedSection>
        <AntarJemputForm />
      </AnimatedSection>

      {/* 3. Verified Properties Showcase (lombokproperty.net style) */}
      <AnimatedSection>
        <PropertyList properties={properties} />
      </AnimatedSection>

      {/* 4. Real Customer Reviews & Social Proof */}
      <AnimatedSection>
        <CustomerReviews />
      </AnimatedSection>
    </main>
  );
}
