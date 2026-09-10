import { SupabaseClient } from "@supabase/supabase-js";
import { GallerySnapshotItem } from "../domain/gallery.types";
import { FALLBACK_GALLERY_SNAPSHOTS } from "../gallery";

export interface GallerySnapshotRow {
  id: string;
  title: string;
  subtitle: string;
  badge_top: string | null;
  badge_stat: string | null;
  badge_extra: string | null;
  image_url: string;
  link_url: string;
  display_order: number;
  is_active: boolean;
  rotation?: string | null;
  z_index?: string | null;
  position_classes?: string | null;
  card_width_classes?: string | null;
  image_aspect_classes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export class SupabaseGalleryRepository {
  constructor(private supabase: SupabaseClient) {}

  private mapToDomain(row: GallerySnapshotRow): GallerySnapshotItem {
    return {
      id: row.id,
      title: row.title,
      subtitle: row.subtitle,
      badgeTop: row.badge_top || undefined,
      badgeStat: row.badge_stat || undefined,
      badgeExtra: row.badge_extra || undefined,
      imageUrl: row.image_url,
      linkUrl: row.link_url || "/packages",
      displayOrder: row.display_order ?? 0,
      isActive: row.is_active ?? true,
      rotation: row.rotation || undefined,
      zIndex: row.z_index || undefined,
      positionClasses: row.position_classes || undefined,
      cardWidthClasses: row.card_width_classes || undefined,
      imageAspectClasses: row.image_aspect_classes || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapToPersistence(domain: GallerySnapshotItem): Partial<GallerySnapshotRow> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(domain.id);
    const id = isUuid
      ? domain.id
      : typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : domain.id;

    return {
      id,
      title: domain.title,
      subtitle: domain.subtitle,
      badge_top: domain.badgeTop || null,
      badge_stat: domain.badgeStat || null,
      badge_extra: domain.badgeExtra || null,
      image_url: domain.imageUrl,
      link_url: domain.linkUrl || "/packages",
      display_order: domain.displayOrder ?? 0,
      is_active: domain.isActive ?? true,
      rotation: domain.rotation || null,
      z_index: domain.zIndex || null,
      position_classes: domain.positionClasses || null,
      card_width_classes: domain.cardWidthClasses || null,
      image_aspect_classes: domain.imageAspectClasses || null,
      updated_at: new Date().toISOString(),
    };
  }

  async findAll(onlyActive: boolean = false): Promise<GallerySnapshotItem[]> {
    let query = this.supabase
      .from("gallery_snapshots")
      .select("*")
      .order("display_order", { ascending: true });

    if (onlyActive) {
      query = query.eq("is_active", true);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return onlyActive
        ? FALLBACK_GALLERY_SNAPSHOTS.filter((item) => item.isActive)
        : FALLBACK_GALLERY_SNAPSHOTS;
    }

    return (data as GallerySnapshotRow[]).map((row) => this.mapToDomain(row));
  }

  async saveAll(items: GallerySnapshotItem[]): Promise<GallerySnapshotItem[]> {
    if (!items || items.length === 0) return [];

    // Clear and insert or upsert
    try {
      await this.supabase.from("gallery_snapshots").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    } catch {
      // ignore table delete error if table is empty
    }

    const rows = items.map((item, idx) => ({
      ...this.mapToPersistence(item),
      display_order: idx + 1,
    }));

    const { data, error } = await this.supabase
      .from("gallery_snapshots")
      .upsert(rows)
      .select();

    if (error || !data) {
      // In case table does not exist or database is offline, return updated items as-is
      console.warn("Could not persist to Supabase gallery_snapshots:", error?.message);
      return items;
    }

    return (data as GallerySnapshotRow[]).map((row) => this.mapToDomain(row));
  }
}
