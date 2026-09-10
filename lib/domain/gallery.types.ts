export interface GallerySnapshotItem {
  id: string;
  title: string;
  subtitle: string;
  badgeTop?: string;
  badgeStat?: string;
  badgeExtra?: string;
  imageUrl: string;
  linkUrl: string;
  displayOrder: number;
  isActive: boolean;
  rotation?: string;
  zIndex?: string;
  positionClasses?: string;
  cardWidthClasses?: string;
  imageAspectClasses?: string;
  createdAt?: string;
  updatedAt?: string;
}
