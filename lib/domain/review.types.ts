export interface CustomerReviewItem {
  id: string;
  reviewerName: string;
  location: string;
  rating: number;
  reviewText: string;
  serviceLabel: string;
  screenshotUrl: string;
  googleMapsUrl?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateCustomerReviewDTO = Omit<CustomerReviewItem, "id" | "createdAt" | "updatedAt">;
export type UpdateCustomerReviewDTO = Partial<CreateCustomerReviewDTO>;
