import {
  CreateCustomerReviewDTO,
  CustomerReviewItem,
} from "../domain/review.types";
import { SupabaseReviewRepository } from "../repositories/supabase-review.repository";

const DEFAULT_SCREENSHOT =
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80";

export class ReviewService {
  constructor(private repo: SupabaseReviewRepository) {}

  async listReviews(onlyActive = false): Promise<CustomerReviewItem[]> {
    return this.repo.findAll(onlyActive);
  }

  async saveReviews(items: CustomerReviewItem[]): Promise<CustomerReviewItem[]> {
    const validItems = items.map((item, index) => {
      const rating = Number(item.rating);
      return {
        ...item,
        reviewerName: item.reviewerName?.trim() || `Guest #${index + 1}`,
        location: item.location?.trim() || "Lombok traveler",
        rating: Number.isFinite(rating) ? Math.min(5, Math.max(1, Math.round(rating))) : 5,
        reviewText: item.reviewText?.trim() || "A memorable Lombok experience.",
        serviceLabel: item.serviceLabel?.trim() || "Lombok experience",
        screenshotUrl: item.screenshotUrl?.trim() || DEFAULT_SCREENSHOT,
        googleMapsUrl: item.googleMapsUrl?.trim() || undefined,
        displayOrder: index + 1,
        isActive: item.isActive ?? true,
      } satisfies CustomerReviewItem;
    });

    return this.repo.saveAll(validItems);
  }

  createDefault(displayOrder: number): CustomerReviewItem {
    const id = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `review-${Date.now()}`;
    return {
      id,
      reviewerName: "New guest",
      location: "Lombok",
      rating: 5,
      reviewText: "A memorable Lombok experience.",
      serviceLabel: "Lombok experience",
      screenshotUrl: DEFAULT_SCREENSHOT,
      displayOrder,
      isActive: true,
    };
  }
}

export type { CreateCustomerReviewDTO };
