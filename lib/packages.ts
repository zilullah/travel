import { TourPackage } from './domain/package.types';
import { SupabasePackageRepository } from './repositories/supabase-package.repository';
import { PackageService } from './services/package.service';
import { supabaseClient } from './supabase/client';

export const DUMMY_TOUR_PACKAGES: TourPackage[] = [
  {
    id: 'mount-rinjani-summit-trekking',
    slug: 'mount-rinjani-summit-trekking',
    title: 'Mount Rinjani Summit Trekking (3D2N)',
    tagline: 'Witness breathtaking sunrises above the clouds and the majestic Segara Anak crater lake.',
    destination: 'Senaru & Sembalun, North Lombok',
    duration: '3 Days 2 Nights',
    category: 'adventure',
    basePriceIdr: 2750000,
    imageUrl: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80',
    ],
    highlights: ['Summit 3,726m peak', 'Segara Anak Lake camp', 'Natural hot spring soak', 'Licensed guide & porter team'],
    included: ['National Park Entry', 'Tents & sleeping gear', '3x Meals daily', 'Return hotel transfer'],
    excluded: ['Personal trekking shoes', 'Warm jacket', 'Tips for guides'],
    itinerary: [
      { day: 1, title: 'Sembalun to Crater Rim (Plawangan Sembalun)', description: 'Trek through savanna grasslands up to campsite.' },
      { day: 2, title: 'Summit Attack & Lake Descent', description: 'Early 02:00 start to summit, descend to Segara Anak hot springs.' },
      { day: 3, title: 'Senaru Forest Descent to Base', description: 'Trek down through lush tropical rainforest.' },
    ],
    status: 'published',
    isFeatured: true,
    pricingTiers: [
      { tierName: 'Solo Adventurer (1 Pax)', minPax: 1, maxPax: 1, pricePerPaxIdr: 3500000, discountPercent: 0 },
      { tierName: 'Duo Trekker (2 Pax)', minPax: 2, maxPax: 2, pricePerPaxIdr: 2750000, discountPercent: 20 },
      { tierName: 'Group Squad (3-6 Pax)', minPax: 3, maxPax: 6, pricePerPaxIdr: 2250000, discountPercent: 35 },
    ],
  },
  {
    id: 'secret-gili-snorkeling-escape',
    slug: 'secret-gili-snorkeling-escape',
    title: 'Secret Gili Island Hopping & Snorkeling (Nanggu, Sudak, Kedis)',
    tagline: 'Crystal-clear turquoise lagoons and colorful coral gardens away from the tourist crowds.',
    destination: 'Sekotong / South-West Lombok',
    duration: 'Full Day (8 Hours)',
    category: 'island_hopping',
    basePriceIdr: 850000,
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    gallery: [],
    highlights: ['Feed tame tropical reef fish', 'Lunch grilled seafood at Gili Sudak', 'Tiny uninhabited sandbar Gili Kedis'],
    included: ['Private motorized outrigger boat', 'Complete snorkel gear & life jacket', 'Private AC car transfer'],
    excluded: ['Seafood lunch cost', 'Underwater camera rental'],
    itinerary: [
      { day: 1, title: 'Harbour pickup & 3-Gili Safari', description: 'Sail from Tawun harbour, snorkel Gili Nanggu, relax Gili Sudak & Kedis.' },
    ],
    status: 'published',
    isFeatured: true,
    pricingTiers: [
      { tierName: 'Private Couple (2 Pax)', minPax: 2, maxPax: 2, pricePerPaxIdr: 850000, discountPercent: 0 },
      { tierName: 'Family / Group (3-5 Pax)', minPax: 3, maxPax: 5, pricePerPaxIdr: 600000, discountPercent: 30 },
    ],
  },
  {
    id: 'south-lombok-surf-beach-safari',
    slug: 'south-lombok-surf-beach-safari',
    title: 'South Lombok Secret Beaches & Surf Safari',
    tagline: 'Explore Tanjung Aan, Mawun, Selong Belanak, and Gerupuk bay with local surf guides.',
    destination: 'Kuta & South Lombok Coastline',
    duration: 'Full Day (9 Hours)',
    category: 'adventure',
    basePriceIdr: 750000,
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    gallery: [],
    highlights: ['Merese Hill sunset 360 panorama', 'Beginner to advanced surf breaks', 'White pepper sand beaches'],
    included: ['Private driver & car', 'Fuel & parking fees', 'Beach entry tickets'],
    excluded: ['Surfboard rental', 'Surf coach fee', 'Personal meals'],
    itinerary: [
      { day: 1, title: 'Coastal Safari', description: 'Selong Belanak morning, Mawun afternoon, Merese Hill golden hour.' },
    ],
    status: 'published',
    isFeatured: true,
    pricingTiers: [
      { tierName: 'Per Vehicle (1-4 Pax)', minPax: 1, maxPax: 4, pricePerPaxIdr: 750000, discountPercent: 0 },
    ],
  },
];

export async function getTourPackages(): Promise<TourPackage[]> {
  try {
    const repo = new SupabasePackageRepository(supabaseClient);
    const service = new PackageService(repo);
    const pkgs = await service.listPackages({ status: 'published' });
    if (pkgs && pkgs.length > 0) {
      return pkgs;
    }
  } catch {
    // Graceful fallback to dummy dataset
  }
  return DUMMY_TOUR_PACKAGES;
}

export async function getTourPackageBySlug(slug: string): Promise<TourPackage | undefined> {
  try {
    const repo = new SupabasePackageRepository(supabaseClient);
    const service = new PackageService(repo);
    const pkg = await service.getPackageBySlug(slug);
    if (pkg) {
      return pkg;
    }
  } catch {
    // Graceful fallback
  }
  return DUMMY_TOUR_PACKAGES.find((p) => p.slug === slug);
}
