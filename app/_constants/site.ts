const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_CONFIG = {
  name: "Lombok Travel Organizer",
  description:
    "Curated Lombok tours, airport transfers, private drivers, scooter & car rentals, and verified property opportunities in South Lombok.",
  url: configuredSiteUrl || "https://lomboktravelorganizer.com",
  socials: {
    tiktok: "https://www.tiktok.com/@lomboktravelorganizer.id",
    instagram: "https://www.instagram.com/lomboktravelorganizer.id?igsi=MTU2dzF6OG5kZHg1eg==",
  },
};
