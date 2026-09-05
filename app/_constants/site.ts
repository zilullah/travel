const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_CONFIG = {
  name: "Lombok Travel Organizer",
  description:
    "Curated Lombok tours, airport transfers, private drivers, and verified property opportunities in South Lombok.",
  url: configuredSiteUrl || "https://lomboktravelorganizer.com",
};
