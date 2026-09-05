import type { MetadataRoute } from "next";
import { getProperties } from "@/app/_lib/properties";
import { SITE_CONFIG } from "@/app/_constants/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await getProperties();

  return [
    {
      url: SITE_CONFIG.url,
    },
    {
      url: `${SITE_CONFIG.url}/properties`,
    },
    ...properties.map((property) => ({
      url: `${SITE_CONFIG.url}/properties/${property.slug}`,
    })),
  ];
}
