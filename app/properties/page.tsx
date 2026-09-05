import { getProperties } from "@/app/_lib/properties";
import { PropertyList } from "@/app/_sections/properties/PropertyList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lombok Real Estate & Villas | Full Listings",
  description:
    "Explore verified luxury villas for sale and freehold land in South Lombok, Kuta, and Selong Belanak.",
  alternates: {
    canonical: "/properties",
  },
  openGraph: {
    title: "Lombok Real Estate & Villas | Full Listings",
    description:
      "Explore verified luxury villas for sale and freehold land in South Lombok, Kuta, and Selong Belanak.",
    url: "/properties",
    type: "website",
  },
};

export default async function PropertiesPage() {
  const properties = await getProperties();

  return (
    <main className="min-h-screen pt-24">
      <PropertyList properties={properties} />
    </main>
  );
}
