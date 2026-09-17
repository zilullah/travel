import type { Sponsor } from "./domain/sponsor.types";

export const FALLBACK_SPONSORS: Sponsor[] = [
  {
    id: "demo-rinjani-trails",
    name: "Rinjani Trails",
    logoUrl: "/assets/sponsors/rinjani-trails.svg",
    websiteUrl: "https://www.google.com/maps/search/Rinjani+Lombok",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "demo-gili-blue",
    name: "Gili Blue",
    logoUrl: "/assets/sponsors/gili-blue.svg",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "demo-mandalika-drive",
    name: "Mandalika Drive",
    logoUrl: "/assets/sponsors/mandalika-drive.svg",
    displayOrder: 3,
    isActive: true,
  },
  {
    id: "demo-sasak-hospitality",
    name: "Sasak Hospitality",
    logoUrl: "/assets/sponsors/sasak-hospitality.svg",
    displayOrder: 4,
    isActive: true,
  },
];
