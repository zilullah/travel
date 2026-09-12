import { CustomerReviewItem } from "@/lib/domain/review.types";
import { supabaseClient } from "@/lib/supabase/client";
import { SupabaseReviewRepository } from "@/lib/repositories/supabase-review.repository";
import { ReviewService } from "@/lib/services/review.service";

export async function getCustomerReviews(): Promise<CustomerReviewItem[]> {
  try {
    const service = new ReviewService(new SupabaseReviewRepository(supabaseClient));
    const data = await service.listReviews(true);
    if (data.length > 0) return data;
  } catch (error) {
    console.warn("[Reviews] Failed to fetch customer reviews:", error);
  }

  return [];
}
