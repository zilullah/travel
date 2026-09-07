import { getTourPackages } from "@/lib/packages";
import { TourPackagesSection } from "@/app/_sections/tours/TourPackagesSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lombok Tour Packages & Trekking Adventures | Full Catalog",
  description:
    "Explore curated Lombok tour packages: Mount Rinjani summit trekking, secret Gili island hopping, and surf beach safari.",
  alternates: {
    canonical: "/packages",
  },
  openGraph: {
    title: "Lombok Tour Packages & Trekking Adventures | Full Catalog",
    description:
      "Explore curated Lombok tour packages: Mount Rinjani summit trekking, secret Gili island hopping, and surf beach safari.",
    url: "/packages",
    type: "website",
  },
};

export default async function PackagesPage() {
  const packages = await getTourPackages();

  return (
    <main className="min-h-screen pt-24">
      <TourPackagesSection packages={packages} />
    </main>
  );
}
