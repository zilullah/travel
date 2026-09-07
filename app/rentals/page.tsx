import { getRentalVehicles } from "@/lib/rentals";
import { VehicleRentalSection } from "@/app/_sections/rentals/VehicleRentalSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lombok Motorbike & Car Rentals | Full Fleet Catalog",
  description:
    "Rent premium maintained scooters and cars in Lombok with free delivery to airport or hotel and 24/7 assistance.",
  alternates: {
    canonical: "/rentals",
  },
  openGraph: {
    title: "Lombok Motorbike & Car Rentals | Full Fleet Catalog",
    description:
      "Rent premium maintained scooters and cars in Lombok with free delivery to airport or hotel and 24/7 assistance.",
    url: "/rentals",
    type: "website",
  },
};

export default async function RentalsPage() {
  const vehicles = await getRentalVehicles(true);

  return (
    <main className="min-h-screen pt-24">
      <VehicleRentalSection vehicles={vehicles} />
    </main>
  );
}
