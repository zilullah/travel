export interface ScatteredCardItem {
  id: string;
  titleKey: string;
  subtitleKey: string;
  badgeTopKey?: string;
  badgeTopVariant?: 'sky' | 'slate' | 'emerald' | 'amber';
  badgeCategoryKey?: string;
  badgeTimeOrStatKey?: string;
  badgeExtraKey?: string;
  badgeExtraVariant?: 'blue' | 'amber' | 'slate';
  imageUrl: string;
  rotation: string;
  zIndex: string;
  positionClasses: string;
  cardWidthClasses?: string;
  imageAspectClasses?: string;
  linkUrl: string;
}

export const SCATTERED_GALLERY_ITEMS: ScatteredCardItem[] = [
  // Top Row (3 items)
  {
    id: 'rinjani',
    titleKey: 'gallery.rinjani_title',
    subtitleKey: 'gallery.rinjani_sub',
    badgeTopKey: 'gallery.rinjani_badge_top',
    badgeTimeOrStatKey: '3,726 MDPL',
    badgeExtraKey: 'gallery.rinjani_badge_extra',
    imageUrl: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80',
    rotation: '-rotate-[4deg]',
    zIndex: 'z-20',
    positionClasses: 'lg:top-0 lg:left-[0%] xl:left-[1%]',
    cardWidthClasses: 'w-[260px] xl:w-[285px]',
    imageAspectClasses: 'aspect-[4/3]',
    linkUrl: '/packages',
  },
  {
    id: 'secret-gili',
    titleKey: 'gallery.gili_title',
    subtitleKey: 'gallery.gili_sub',
    badgeTopKey: 'gallery.gili_badge_top',
    badgeTimeOrStatKey: 'gallery.gili_stat',
    badgeExtraKey: 'gallery.gili_badge_extra',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    rotation: 'rotate-[2deg]',
    zIndex: 'z-10',
    positionClasses: 'lg:top-0 lg:left-[35%] xl:left-[36%]',
    cardWidthClasses: 'w-[250px] xl:w-[275px]',
    imageAspectClasses: 'aspect-[4/3]',
    linkUrl: '/packages',
  },
  {
    id: 'merese',
    titleKey: 'gallery.merese_title',
    subtitleKey: 'gallery.merese_sub',
    badgeTopKey: 'gallery.merese_badge_top',
    badgeTimeOrStatKey: 'gallery.merese_stat',
    badgeExtraKey: 'gallery.merese_badge_extra',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    rotation: 'rotate-[4deg]',
    zIndex: 'z-20',
    positionClasses: 'lg:top-0 lg:right-[0%] xl:right-[1%]',
    cardWidthClasses: 'w-[260px] xl:w-[285px]',
    imageAspectClasses: 'aspect-[4/3]',
    linkUrl: '/packages',
  },

  // Middle Centerpiece (1 item)
  {
    id: 'pink-beach',
    titleKey: 'gallery.pink_title',
    subtitleKey: 'gallery.pink_sub',
    badgeTopKey: 'gallery.pink_badge_top',
    badgeTimeOrStatKey: 'gallery.pink_stat',
    badgeExtraKey: 'gallery.pink_badge_extra',
    imageUrl: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=800&q=80',
    rotation: '-rotate-[1deg]',
    zIndex: 'z-30',
    positionClasses: 'lg:top-[135px] lg:left-[36%] xl:left-[37%]',
    cardWidthClasses: 'w-[270px] xl:w-[295px]',
    imageAspectClasses: 'aspect-[16/10]',
    linkUrl: '/packages',
  },

  // Bottom Row (4 items)
  {
    id: 'tiu-kelep',
    titleKey: 'gallery.tiu_title',
    subtitleKey: 'gallery.tiu_sub',
    badgeTopKey: 'gallery.tiu_badge_top',
    badgeTimeOrStatKey: 'gallery.tiu_stat',
    badgeExtraKey: 'gallery.tiu_badge_extra',
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    rotation: '-rotate-[3deg]',
    zIndex: 'z-10',
    positionClasses: 'lg:bottom-0 lg:left-[0%]',
    cardWidthClasses: 'w-[250px] xl:w-[270px]',
    imageAspectClasses: 'aspect-[4/3]',
    linkUrl: '/packages',
  },
  {
    id: 'pusuk',
    titleKey: 'gallery.pusuk_title',
    subtitleKey: 'gallery.pusuk_sub',
    badgeTopKey: 'gallery.pusuk_badge_top',
    badgeTimeOrStatKey: 'gallery.pusuk_stat',
    badgeExtraKey: 'gallery.pusuk_badge_extra',
    imageUrl: 'https://images.unsplash.com/photo-1549399573-970a87791404?auto=format&fit=crop&w=800&q=80',
    rotation: 'rotate-[2deg]',
    zIndex: 'z-20',
    positionClasses: 'lg:bottom-0 lg:left-[25.5%]',
    cardWidthClasses: 'w-[250px] xl:w-[270px]',
    imageAspectClasses: 'aspect-[4/3]',
    linkUrl: '/rentals',
  },
  {
    id: 'selong-belanak',
    titleKey: 'gallery.surf_title',
    subtitleKey: 'gallery.surf_sub',
    badgeTopKey: 'gallery.surf_badge_top',
    badgeTimeOrStatKey: 'gallery.surf_stat',
    badgeExtraKey: 'gallery.surf_badge_extra',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    rotation: '-rotate-[3deg]',
    zIndex: 'z-20',
    positionClasses: 'lg:bottom-0 lg:right-[25.5%]',
    cardWidthClasses: 'w-[250px] xl:w-[270px]',
    imageAspectClasses: 'aspect-[4/3]',
    linkUrl: '/packages',
  },
  {
    id: 'kuta-villa',
    titleKey: 'gallery.villa_title',
    subtitleKey: 'gallery.villa_sub',
    badgeTopKey: 'gallery.villa_badge_top',
    badgeTimeOrStatKey: 'gallery.villa_stat',
    badgeExtraKey: 'gallery.villa_badge_extra',
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    rotation: 'rotate-[4deg]',
    zIndex: 'z-10',
    positionClasses: 'lg:bottom-0 lg:right-[0%]',
    cardWidthClasses: 'w-[250px] xl:w-[270px]',
    imageAspectClasses: 'aspect-[4/3]',
    linkUrl: '/properties',
  },
];
