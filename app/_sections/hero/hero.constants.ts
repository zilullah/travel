export type HeroHighlightIconType = 'star' | 'shield' | 'building' | 'users';

export interface HeroHighlightItem {
  iconType: HeroHighlightIconType;
  label: string;
  sub: string;
}

export const HERO_HIGHLIGHTS: HeroHighlightItem[] = [
  {
    iconType: 'star',
    label: '4.9/5 Rating',
    sub: '1,200+ Wisatawan & Investor',
  },
  {
    iconType: 'shield',
    label: '100% Guaranteed Pick-up',
    sub: 'Driver Terverifikasi & Armada Resmi',
  },
  {
    iconType: 'building',
    label: 'Legalitas SHM & PMA',
    sub: 'Due Diligence Notaris Terpercaya',
  },
  {
    iconType: 'users',
    label: 'Layanan 24/7 WhatsApp',
    sub: 'Respon Cepat Tim Lokal Lombok',
  },
];
