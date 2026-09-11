"use client";

import React from "react";
import MarqueeModule from "react-fast-marquee";
import { formatImageUrl } from "@/app/_lib/utils";
import { CustomerReviewItem } from "@/lib/domain/review.types";
import { FALLBACK_CUSTOMER_REVIEWS } from "@/lib/reviews";

// SSR can expose the CommonJS default wrapper instead of the component.
const Marquee = (MarqueeModule as unknown as { default?: typeof MarqueeModule }).default ?? MarqueeModule;

interface CustomerReviewsProps {
  reviews?: CustomerReviewItem[];
}

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({ reviews }) => {
  const items = reviews && reviews.length > 0 ? reviews : FALLBACK_CUSTOMER_REVIEWS;
  const laneItems = Array.from(
    { length: Math.max(4, items.length) },
    (_, index) => items[index % items.length],
  );

  return (
    <section
      id="reviews"
      aria-label="Customer review screenshots"
      className="overflow-hidden border-t border-[#BAE6FD] bg-[#F7FCFF] py-10 lg:py-14"
    >
      <div className="review-wall space-y-4" aria-label="Customer review image wall">
        <div className="review-marquee" aria-label="Customer reviews moving right">
          <Marquee
            direction="right"
            speed={45}
            pauseOnHover
            pauseOnClick={false}
            gradient
            gradientColor="#F7FCFF"
            gradientWidth={80}
            className="review-marquee-track"
            autoFill
          >
            {laneItems.map((review, index) => (
              <ReviewImage key={`right-${review.id}-${index}`} review={review} />
            ))}
          </Marquee>
        </div>

        <div className="review-marquee" aria-label="Customer reviews moving left">
          <Marquee
            direction="left"
            speed={45}
            pauseOnHover
            pauseOnClick={false}
            gradient
            gradientColor="#F7FCFF"
            gradientWidth={80}
            className="review-marquee-track"
            autoFill
          >
            {laneItems.map((review, index) => (
              <ReviewImage key={`left-${review.id}-${index}`} review={review} />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
};

const ReviewImage: React.FC<{ review: CustomerReviewItem }> = ({ review }) => {
  const screenshot = formatImageUrl(review.screenshotUrl);

  if (!screenshot) return null;

  return (
    <figure className="review-wall-card mx-2 h-56 w-[min(78vw,360px)] shrink-0 overflow-hidden rounded-2xl border border-[#BAE6FD] bg-white shadow-md sm:h-64 sm:w-[390px]">
      {/* Admin-managed URLs can come from any public image host, so use a native image element here. */}
      <img
        src={screenshot}
        alt={`Google Maps review screenshot from ${review.reviewerName}`}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </figure>
  );
};

export default CustomerReviews;
