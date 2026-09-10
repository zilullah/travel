import { GallerySnapshotItem } from "../domain/gallery.types";
import { SupabaseGalleryRepository } from "../repositories/supabase-gallery.repository";

export class GalleryService {
  constructor(private repo: SupabaseGalleryRepository) {}

  async listSnapshots(onlyActive: boolean = false): Promise<GallerySnapshotItem[]> {
    return this.repo.findAll(onlyActive);
  }

  async saveSnapshots(items: GallerySnapshotItem[]): Promise<GallerySnapshotItem[]> {
    // Validate that image URLs and titles are present
    const validItems = items.map((item, index) => ({
      ...item,
      title: item.title?.trim() || `Snapshot #${index + 1}`,
      subtitle: item.subtitle?.trim() || "",
      imageUrl: item.imageUrl?.trim() || "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80",
      linkUrl: item.linkUrl?.trim() || "/packages",
      displayOrder: index + 1,
      isActive: item.isActive ?? true,
    }));

    return this.repo.saveAll(validItems);
  }
}
