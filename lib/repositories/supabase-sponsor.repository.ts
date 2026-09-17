import type { SupabaseClient } from "@supabase/supabase-js";
import type { Sponsor } from "../domain/sponsor.types";

interface SponsorRow {
  id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export class SupabaseSponsorRepository {
  constructor(private supabase: SupabaseClient) {}

  private mapToDomain(row: SponsorRow): Sponsor {
    return {
      id: row.id,
      name: row.name,
      logoUrl: row.logo_url,
      websiteUrl: row.website_url || undefined,
      displayOrder: row.display_order,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async findAll(onlyActive = false): Promise<Sponsor[]> {
    let query = this.supabase
      .from("sponsors")
      .select("*")
      .order("display_order", { ascending: true });

    if (onlyActive) query = query.eq("is_active", true);

    const { data, error } = await query;
    if (error) throw new Error(`Gagal memuat sponsor: ${error.message}`);
    return ((data || []) as SponsorRow[]).map((row) => this.mapToDomain(row));
  }

  async saveAll(items: Sponsor[]): Promise<Sponsor[]> {
    const existing = await this.findAll(false);
    const existingIds = new Set(existing.map((item) => item.id));
    const savedIds = new Set(items.map((item) => item.id).filter((id) => existingIds.has(id)));
    const deletedIds = existing.filter((item) => !savedIds.has(item.id)).map((item) => item.id);

    const rows = items.map((item, index) => ({
      id: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.id)
        ? item.id
        : crypto.randomUUID(),
      name: item.name,
      logo_url: item.logoUrl,
      website_url: item.websiteUrl || null,
      display_order: index + 1,
      is_active: item.isActive,
      updated_at: new Date().toISOString(),
    }));

    if (rows.length > 0) {
      const { error } = await this.supabase.from("sponsors").upsert(rows);
      if (error) throw new Error(`Gagal menyimpan sponsor: ${error.message}`);
    }

    if (deletedIds.length > 0) {
      const { error } = await this.supabase.from("sponsors").delete().in("id", deletedIds);
      if (error) throw new Error(`Gagal menghapus sponsor: ${error.message}`);
    }

    return this.findAll(false);
  }
}
