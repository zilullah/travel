import { GallerySnapshotItem } from "@/lib/domain/gallery.types";
import { supabaseClient } from "@/lib/supabase/client";
import { SupabaseGalleryRepository } from "@/lib/repositories/supabase-gallery.repository";
import { GalleryService } from "@/lib/services/gallery.service";
import { FALLBACK_GALLERY_SNAPSHOTS } from "@/lib/gallery";

export async function getGallerySnapshots(): Promise<GallerySnapshotItem[]> {
  try {
    const repo = new SupabaseGalleryRepository(supabaseClient);
    const service = new GalleryService(repo);
    const data = await service.listSnapshots(true);
    if (data && data.length > 0) return data;
  } catch (err) {
    console.warn("[Gallery] Failed to fetch snapshots from Supabase, using fallback:", err);
  }
  return FALLBACK_GALLERY_SNAPSHOTS.filter((item) => item.isActive);
}
