import { Property } from '@/lib/domain/property.types';
import { supabaseClient } from '@/lib/supabase/client';
import { SupabasePropertyRepository } from '@/lib/repositories/supabase-property.repository';
import { PropertyService } from '@/lib/services/property.service';

export type { Property };

export const FALLBACK_PROPERTIES: Property[] = [
  {
    id: 'kuta-sunset-cliff-villa',
    slug: 'kuta-sunset-cliff-villa',
    title: 'The Cliffside Oasis 3-Bedroom Luxury Villa',
    tagline: 'Turnkey architectural masterpiece overlooking Kuta Bay with private infinity pool',
    type: 'villa',
    location: 'Kuta Mandalika Hilltop',
    priceIdr: 4500000000,
    ownership: 'Leasehold (HGB)',
    leaseYears: 30,
    landSizeM2: 500,
    buildingSizeM2: 280,
    bedrooms: 3,
    bathrooms: 4,
    roi: '14% - 18% Net Annual ROI',
    beachDistance: '4 Mins to Kuta Beach',
    airportDistance: '20 Mins to Lombok Airport',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    features: ['Infinity Ocean-View Pool', 'Fully Furnished Turnkey', 'PMA Management Ready', 'Private Gated Security'],
    status: 'Exclusive',
    isFeatured: true,
  },
  {
    id: 'selong-belanak-beachfront-land',
    slug: 'selong-belanak-beachfront-land',
    title: 'Prime Beachfront Land Plot Selong Belanak',
    tagline: 'Direct white sand beach access with clean SHM title, perfect for boutique resort or luxury villa enclave',
    type: 'land',
    location: 'Selong Belanak Bay',
    priceIdr: 3200000000,
    ownership: 'Freehold (SHM)',
    landSizeM2: 1200,
    roi: 'High Capital Appreciation (+25% YOY)',
    beachDistance: '0 Mins (Direct Sand Access)',
    airportDistance: '30 Mins to Lombok Airport',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    features: ['Direct White Sand Access', 'Road & PLN Electricity Access', 'Clean Legal Due Diligence', 'Ideal for Boutique Resort'],
    status: 'For Sale',
    isFeatured: true,
  },
  {
    id: 'gerupuk-surf-view-villa',
    slug: 'gerupuk-surf-view-villa',
    title: 'Gerupuk Bay 2-Bedroom Surf Residence',
    tagline: 'Modern tropical villa minutes away from world-class surf breaks with exceptional rental yield',
    type: 'villa',
    location: 'Gerupuk Surf Haven',
    priceIdr: 2800000000,
    ownership: 'Leasehold (HGB)',
    leaseYears: 35,
    landSizeM2: 350,
    buildingSizeM2: 160,
    bedrooms: 2,
    bathrooms: 2,
    roi: '12% - 16% Rental Yield',
    beachDistance: '2 Mins to Surf Boat Harbor',
    airportDistance: '25 Mins to Airport',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    features: ['Panoramic Bay View', 'Plunge Pool & Sun Deck', 'Turnkey Airbnb Setup', 'High Rental Occupancy History'],
    status: 'For Sale',
    isFeatured: false,
  },
  {
    id: 'tampah-hills-ocean-plot',
    slug: 'tampah-hills-ocean-plot',
    title: 'Hillside Ocean View Development Plot',
    tagline: '180-degree sunset ocean panorama with asphalt road and water infrastructure ready',
    type: 'land',
    location: 'Tampah / Mawun Heights',
    priceIdr: 1850000000,
    ownership: 'Freehold (SHM)',
    landSizeM2: 800,
    roi: '20%+ Projected Equity Growth',
    beachDistance: '5 Mins to Mawun Beach',
    airportDistance: '25 Mins to Airport',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    features: ['180-Degree Ocean Panorama', 'Asphalt Access Road', 'Masterplan Community Adjacent', 'Certified Title (SHM)'],
    status: 'For Sale',
    isFeatured: false,
  },
];

export async function getProperties(): Promise<Property[]> {
  try {
    const repo = new SupabasePropertyRepository(supabaseClient);
    const service = new PropertyService(repo);
    const data = await service.listProperties();
    if (data && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn('[Properties] Supabase query failed, falling back to dummy data:', err);
  }
  return FALLBACK_PROPERTIES;
}

export async function getPropertyBySlug(slug: string): Promise<Property | undefined> {
  try {
    const repo = new SupabasePropertyRepository(supabaseClient);
    const service = new PropertyService(repo);
    const prop = await service.getPropertyBySlug(slug);
    if (prop) return prop;
  } catch (err) {
    console.warn('[Properties] Supabase query by slug failed, falling back:', err);
  }
  return FALLBACK_PROPERTIES.find((p) => p.slug === slug);
}
