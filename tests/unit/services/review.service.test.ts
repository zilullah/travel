import { describe, expect, it, vi } from "vitest";
import { ReviewService } from "@/lib/services/review.service";
import { CustomerReviewItem } from "@/lib/domain/review.types";
import { SupabaseReviewRepository } from "@/lib/repositories/supabase-review.repository";

describe("ReviewService", () => {
  const review: CustomerReviewItem = {
    id: "review-1",
    reviewerName: "  Guest  ",
    location: "  Perth  ",
    rating: 8,
    reviewText: "  Great trip.  ",
    serviceLabel: "  Rinjani  ",
    screenshotUrl: "  https://drive.google.com/file/d/demo/view  ",
    displayOrder: 99,
    isActive: true,
  };

  it("sanitizes review content, clamps ratings, and normalizes order", async () => {
    const repo = { saveAll: vi.fn().mockResolvedValue([]) } as unknown as SupabaseReviewRepository;
    const service = new ReviewService(repo);

    await service.saveReviews([review]);

    expect(repo.saveAll).toHaveBeenCalledWith([
      expect.objectContaining({
        reviewerName: "Guest",
        location: "Perth",
        rating: 5,
        reviewText: "Great trip.",
        serviceLabel: "Rinjani",
        screenshotUrl: "https://drive.google.com/file/d/demo/view",
        displayOrder: 1,
      }),
    ]);
  });

  it("lists reviews with the requested active filter", async () => {
    const repo = { findAll: vi.fn().mockResolvedValue([]) } as unknown as SupabaseReviewRepository;
    const service = new ReviewService(repo);

    await service.listReviews(true);

    expect(repo.findAll).toHaveBeenCalledWith(true);
  });
});
