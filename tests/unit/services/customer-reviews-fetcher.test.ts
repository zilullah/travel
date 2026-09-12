import { afterEach, describe, expect, it, vi } from "vitest";

const { listReviews } = vi.hoisted(() => ({ listReviews: vi.fn() }));
vi.mock("@/lib/supabase/client", () => ({ supabaseClient: {} }));
vi.mock("@/lib/repositories/supabase-review.repository", () => ({ SupabaseReviewRepository: class {} }));
vi.mock("@/lib/services/review.service", () => ({
  ReviewService: class { listReviews = listReviews; },
}));

import { getCustomerReviews } from "@/app/_lib/reviews";

describe("getCustomerReviews", () => {
  afterEach(() => vi.restoreAllMocks());

  it("requests active reviews and returns existing data", async () => {
    const reviews = [{ id: "fixture" }];
    listReviews.mockResolvedValue(reviews);
    expect(await getCustomerReviews()).toEqual(reviews);
    expect(listReviews).toHaveBeenCalledWith(true);
  });

  it("returns no public demo reviews when the database is empty", async () => {
    listReviews.mockResolvedValue([]);
    expect(await getCustomerReviews()).toEqual([]);
  });

  it("returns no public demo reviews when the database fails", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    listReviews.mockRejectedValue(new Error("Test database failure"));
    expect(await getCustomerReviews()).toEqual([]);
  });
});
