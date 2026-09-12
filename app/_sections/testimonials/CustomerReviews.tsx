"use client";

import React, { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import MarqueeModule from "react-fast-marquee";
import { formatImageUrl } from "@/app/_lib/utils";
import { CustomerReviewItem } from "@/lib/domain/review.types";

// SSR can expose the CommonJS default wrapper instead of the component.
const Marquee =
  (MarqueeModule as unknown as { default?: typeof MarqueeModule }).default ??
  MarqueeModule;
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const CARD_SIZES = ["medium", "small", "large"] as const;

function subscribeToMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const getReducedMotion = () => window.matchMedia(REDUCED_MOTION).matches;
const getServerReducedMotion = () => true;

interface CustomerReviewsProps {
  reviews?: CustomerReviewItem[];
}

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({
  reviews = [],
}) => {
  const reducedMotion = useSyncExternalStore(
    subscribeToMotion,
    getReducedMotion,
    getServerReducedMotion,
  );
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [failedUrls, setFailedUrls] = useState<string[]>([]);
  const items = reviews.filter(
    (review) =>
      review.isActive &&
      /^https?:\/\//i.test(review.screenshotUrl.trim()) &&
      URL.canParse(review.screenshotUrl.trim()) &&
      !failedUrls.includes(review.screenshotUrl),
  );

  if (!items.length) return null;

  const cards = items.map((review, index) => (
    <ReviewImage
      key={review.id}
      review={review}
      size={CARD_SIZES[index % CARD_SIZES.length]}
      onError={() =>
        setFailedUrls((current) =>
          current.includes(review.screenshotUrl)
            ? current
            : [...current, review.screenshotUrl],
        )
      }
    />
  ));
  const lanes =
    cards.length < 4
      ? [cards]
      : [
          cards.filter((_, index) => index % 2 === 0),
          cards.filter((_, index) => index % 2 !== 0),
        ];
  const animated = !reducedMotion && cards.length > 1;
  const googleMapsUrl = reviews
    .filter((review) => review.isActive)
    .map((review) => review.googleMapsUrl?.trim())
    .find((value) => {
      if (!value || !URL.canParse(value)) return false;
      const url = new URL(value);
      return (
        url.protocol === "https:" &&
        !url.username &&
        !url.password &&
        (["maps.app.goo.gl", "maps.google.com"].includes(url.hostname) ||
          (["google.com", "www.google.com", "goo.gl"].includes(url.hostname) &&
            /^\/maps(?:\/|$)/.test(url.pathname)))
      );
    });

  return (
    <section
      id="reviews"
      aria-label="Customer review screenshots"
      className="review-section"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
    >
      {animated && (
        <div className="review-controls">
          <button
            type="button"
            className="review-pause"
            aria-pressed={paused}
            onClick={() => setPaused((current) => !current)}
          >
            {paused ? "Lanjutkan animasi" : "Jeda animasi"}
          </button>
        </div>
      )}
      <div className="review-wall">
        {animated ? (
          lanes.map((lane, index) => (
            <div key={index} className="review-marquee" aria-hidden="true">
              <Marquee
                direction={index === 0 ? "right" : "left"}
                speed={30}
                play={!paused && !hovered && !focused}
                gradient={false}
                autoFill
              >
                {lane}
              </Marquee>
            </div>
          ))
        ) : (
          <div
            className="review-static"
            tabIndex={0}
            role="region"
            aria-label="Screenshot review, geser untuk melihat lainnya"
          >
            <div className="review-static-images" aria-hidden="true">
              {cards}
            </div>
          </div>
        )}
      </div>
      <ul className="sr-only">
        {items.map((review) => (
          <li key={review.id}>
            {review.reviewerName}: {review.reviewText}
          </li>
        ))}
      </ul>
      <div className="review-footer">
        <a
          href="https://maps.app.goo.gl/u1Bet4WqSHhebG479"
          target="_blank"
          rel="noopener noreferrer"
          className="review-google-link"
        >
          <svg
            width="24"
            height="32"
            viewBox="0 0 24 32"
            aria-hidden="true"
            className="shrink-0"
          >
            <path
              fill="#34A853"
              d="M24 12c0 7-8 13-10 18-.7 2-3.3 2-4 0C8 25 0 19 0 12a12 12 0 0 1 24 0Z"
            />
            <path
              fill="#4285F4"
              d="M12 0a12 12 0 0 1 12 12c0 3-1.5 6-3.5 8.7L6 1.6A12 12 0 0 1 12 0Z"
            />
            <path
              fill="#1A73E8"
              d="M0 12A12 12 0 0 1 6 1.6l6 7.9-9.5 10C1 17.1 0 14.6 0 12Z"
            />
            <path
              fill="#FBBC04"
              d="m2.5 19.5 9.5-10 4 5.3-10 10c-1.2-1.7-2.4-3.4-3.5-5.3Z"
            />
            <path
              fill="#EA4335"
              d="M12 0a12 12 0 0 1 9.5 4.7L12 14l-4-5.2 7.5-8.3A12 12 0 0 0 12 0Z"
            />
            <circle cx="12" cy="12" r="4.5" fill="#FFFFFF" />
          </svg>
          <span>Lihat Semua Ulasan di Google Maps</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="shrink-0"
          >
            <path d="M7 17 17 7M7 7h10v10" />
          </svg>
          <span className="sr-only"> (buka di tab baru)</span>
        </a>
      </div>
    </section>
  );
};

interface ReviewImageProps {
  review: CustomerReviewItem;
  size: (typeof CARD_SIZES)[number];
  onError: () => void;
}

const ReviewImage: React.FC<ReviewImageProps> = ({ review, size, onError }) => (
  <figure className={`review-wall-card review-wall-card--${size}`}>
    <Image
      src={formatImageUrl(review.screenshotUrl)}
      alt=""
      fill
      sizes="(max-width: 480px) 82vw, 400px"
      className="object-contain"
      loading="lazy"
      // ponytail: arbitrary public admin image hosts; add an allowlist before server optimization.
      unoptimized
      onError={onError}
    />
  </figure>
);

export default CustomerReviews;
