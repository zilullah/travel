import { CustomerReviewItem } from "./domain/review.types";

const REVIEW_SCREENSHOT_FALLBACK =
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80";

export const FALLBACK_CUSTOMER_REVIEWS: CustomerReviewItem[] = [
  {
    id: "review-david-emily",
    reviewerName: "David & Emily Thompson",
    location: "Perth, Australia",
    rating: 5,
    reviewText:
      "Flawless communication from the moment we landed at BIL. Our driver was waiting on time, and our mountain guides made the summit push feel safe and unforgettable.",
    serviceLabel: "Rinjani 3D2N + Airport Pickup",
    screenshotUrl: REVIEW_SCREENSHOT_FALLBACK,
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "review-julien-laurent",
    reviewerName: "Julien Laurent",
    location: "Geneva, Switzerland",
    rating: 5,
    reviewText:
      "Clear legal diligence and transparent PMA advisory. We inspected three turnkey villas in Selong Belanak and closed our leasehold smoothly.",
    serviceLabel: "Kuta Mandalika Villa Acquisition",
    screenshotUrl: REVIEW_SCREENSHOT_FALLBACK,
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "review-aiko-kenji",
    reviewerName: "Aiko & Kenji Sato",
    location: "Tokyo, Japan",
    rating: 5,
    reviewText:
      "Private island hopping at Gili Nanggu with crystal waters, sea turtles, and grilled fish right on the sandbar. Truly the best day of our Indonesia trip.",
    serviceLabel: "Secret Gili + Private Boat",
    screenshotUrl: REVIEW_SCREENSHOT_FALLBACK,
    displayOrder: 3,
    isActive: true,
  },
];
