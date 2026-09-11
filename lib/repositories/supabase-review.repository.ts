import { SupabaseClient } from "@supabase/supabase-js";
import { CustomerReviewItem } from "../domain/review.types";
import { FALLBACK_CUSTOMER_REVIEWS } from "../reviews";

export interface CustomerReviewRow {
  id: string;
  reviewer_name: string;
  location: string;
  rating: number;
  review_text: string;
  service_label: string;
  screenshot_url: string;
  google_maps_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export class SupabaseReviewRepository {
  constructor(private supabase: SupabaseClient) {}

  private mapToDomain(row: CustomerReviewRow): CustomerReviewItem {
    return {
      id: row.id,
      reviewerName: row.reviewer_name,
      location: row.location,
      rating: row.rating,
      reviewText: row.review_text,
      serviceLabel: row.service_label,
      screenshotUrl: row.screenshot_url,
      googleMapsUrl: row.google_maps_url || undefined,
      displayOrder: row.display_order ?? 0,
      isActive: row.is_active ?? true,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapToPersistence(item: CustomerReviewItem) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.id);
    const id = isUuid
      ? item.id
      : typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : item.id;

    return {
      id,
      reviewer_name: item.reviewerName,
      location: item.location,
      rating: item.rating,
      review_text: item.reviewText,
      service_label: item.serviceLabel,
      screenshot_url: item.screenshotUrl,
      google_maps_url: item.googleMapsUrl || null,
      display_order: item.displayOrder,
      is_active: item.isActive,
      updated_at: new Date().toISOString(),
    };
  }

  async findAll(onlyActive = false): Promise<CustomerReviewItem[]> {
    let query = this.supabase
      .from("customer_reviews")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (onlyActive) query = query.eq("is_active", true);

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return onlyActive
        ? FALLBACK_CUSTOMER_REVIEWS.filter((item) => item.isActive)
        : FALLBACK_CUSTOMER_REVIEWS;
    }

    return (data as CustomerReviewRow[]).map((row) => this.mapToDomain(row));
  }

  async saveAll(items: CustomerReviewItem[]): Promise<CustomerReviewItem[]> {
    if (items.length === 0) return [];

    const rows = items.map((item, index) =>
      this.mapToPersistence({ ...item, displayOrder: index + 1 }),
    );
    const { data, error } = await this.supabase
      .from("customer_reviews")
      .upsert(rows)
      .select();

    if (error || !data) {
      console.warn("Could not persist customer reviews:", error?.message);
      return items;
    }

    return (data as CustomerReviewRow[]).map((row) => this.mapToDomain(row));
  }
}
