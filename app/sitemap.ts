import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/app/_constants/site";
import { getProperties } from "@/app/_lib/properties";
import { maskId } from "@/app/_lib/utils";
import { getTourPackages } from "@/lib/packages";
import { getRentalVehicles } from "@/lib/rentals";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [properties, packages, rentals] = await Promise.all([
    getProperties(),
    getTourPackages(),
    getRentalVehicles(true),
  ]);

  const staticRoutes = ["", "/packages", "/rentals", "/properties"].map(
    (path) => ({ url: `${SITE_CONFIG.url}${path}` }),
  );

  const packageRoutes = packages.map((pkg) => ({
    url: `${SITE_CONFIG.url}/packages/${maskId(pkg.id || pkg.slug)}`,
  }));
  const rentalRoutes = rentals.map((vehicle) => ({
    url: `${SITE_CONFIG.url}/rentals/${maskId(vehicle.id)}`,
  }));
  const propertyRoutes = properties.map((property) => ({
    url: `${SITE_CONFIG.url}/properties/${maskId(property.id || property.slug)}`,
  }));

  return [
    ...staticRoutes,
    ...packageRoutes,
    ...rentalRoutes,
    ...propertyRoutes,
  ];
}
