import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";
import type { CustomerReviewItem } from "@/lib/domain/review.types";

const motion = vi.hoisted(() => ({ reduced: false }));
vi.mock("react", async (importOriginal) => {
  const original = await importOriginal<typeof import("react")>();
  return { ...original, useSyncExternalStore: () => motion.reduced };
});

const mockMarquee = () => ({
  default: ({ children, direction, speed, play }: React.PropsWithChildren<{
    direction: string; speed: number; play: boolean;
  }>) => <div data-direction={direction} data-speed={speed} data-play={play}>{children}</div>,
});

const reviews: CustomerReviewItem[] = Array.from({ length: 6 }, (_, index) => ({
  id: `fixture-${index}`,
  reviewerName: `Test reviewer ${index}`,
  reviewText: `Test transcription ${index}`,
  screenshotUrl: `https://images.example.com/review-${index}.png`,
  location: "Test location",
  rating: 5,
  serviceLabel: "Test service",
  displayOrder: index + 1,
  isActive: true,
}));

async function render(reviewsProp: CustomerReviewItem[] = reviews) {
  vi.doMock("react-fast-marquee", mockMarquee);
  const { CustomerReviews } = await import("@/app/_sections/testimonials/CustomerReviews");
  return renderToString(<CustomerReviews reviews={reviewsProp} />);
}

function imageCount(html: string) {
  return (html.match(/<img /g) || []).length;
}

describe("CustomerReviews", () => {
  afterEach(() => {
    motion.reduced = false;
    vi.doUnmock("react-fast-marquee");
    vi.resetModules();
  });

  it("renders with the CommonJS default wrapper used by SSR", async () => {
    vi.doMock("react-fast-marquee", () => ({ default: { default: mockMarquee().default } }));
    const { CustomerReviews } = await import("@/app/_sections/testimonials/CustomerReviews");
    expect(renderToString(<CustomerReviews reviews={reviews} />)).toContain('data-direction="right"');
  });

  it("renders safely with the installed marquee package", async () => {
    vi.doUnmock("react-fast-marquee");
    const { CustomerReviews } = await import("@/app/_sections/testimonials/CustomerReviews");
    const html = renderToString(<CustomerReviews reviews={reviews} />);
    expect(html).toContain('id="reviews"');
    expect(html).toContain("Test transcription 0");
  });

  it("splits screenshots across opposite lanes with stable mixed sizes and no manual copies", async () => {
    const html = await render();
    expect(imageCount(html)).toBe(6);
    expect(html).toContain('data-direction="right"');
    expect(html).toContain('data-direction="left"');
    expect(html).toContain('data-speed="30"');
    expect(html).toContain('data-play="true"');
    for (const size of ["small", "medium", "large"]) {
      expect(html.match(new RegExp(`review-wall-card--${size}`, "g"))).toHaveLength(2);
    }
    expect(html.match(/class="object-contain"/g)).toHaveLength(6);
    expect(html).not.toContain("object-cover");
    expect(html).toContain('aria-pressed="false"');
    expect(html).toContain("Jeda animasi");
  });

  it("hides decorative tracks and exposes each transcription only once", async () => {
    const html = await render();
    expect(html.match(/class="review-marquee" aria-hidden="true"/g)).toHaveLength(2);
    expect(html).toContain('<ul class="sr-only">');
    expect(html.match(/Test transcription 0/g)).toHaveLength(1);
    expect(html.match(/Test reviewer 0/g)).toHaveLength(1);
    expect(html).not.toContain("Test service");
  });

  it("renders every screenshot once in a scrollable region for reduced motion", async () => {
    motion.reduced = true;
    const html = await render();
    expect(imageCount(html)).toBe(6);
    expect(html).toContain('class="review-static" tabindex="0"');
    expect(html).not.toContain('class="review-marquee"');
    expect(html).not.toContain("Jeda animasi");
  });

  it("keeps a single screenshot static and uses one lane for small collections", async () => {
    expect(await render([reviews[0]])).toContain('class="review-static"');
    const html = await render(reviews.slice(0, 3));
    expect(html.match(/data-direction=/g)).toHaveLength(1);
    expect(imageCount(html)).toBe(3);
  });

  it("does not invent fallback reviews for empty or inactive data", async () => {
    expect(await render([])).toBe("");
    expect(await render([{ ...reviews[0], isActive: false }])).toBe("");
    expect(await render([{ ...reviews[0], screenshotUrl: "  " }])).toBe("");
    expect(await render([{ ...reviews[0], screenshotUrl: "https://" }])).toBe("");
    expect(await render([{ ...reviews[0], screenshotUrl: "javascript:alert(1)" }])).toBe("");
  });

  it.each(["https://maps.app.goo.gl/example", "https://www.google.com/maps/place/example/reviews", "https://maps.google.com/?cid=123", "https://goo.gl/maps/example"])("links to configured Google Maps reviews below the wall: %s", async (url) => {
    const html = await render([{ ...reviews[0], googleMapsUrl: ` ${url} ` }]);
    expect(html).toContain(`href="${url}" target="_blank" rel="noopener noreferrer"`);
    expect(html).toContain("Lihat Semua Ulasan di Google Maps");
    expect(html).toContain("buka di tab baru");
    expect(html.indexOf('class="review-footer"')).toBeGreaterThan(html.indexOf('</ul>'));
    expect(html.match(/class="review-google-link"/g)).toHaveLength(1);
  });

  it("omits the link when no active review has a safe Google Maps URL", async () => {
    expect(await render()).not.toContain('class="review-google-link"');
    for (const googleMapsUrl of ["javascript:alert(1)", "https://", "http://maps.google.com", "https://google.com.evil.test/maps", "https://example.com/maps", "https://www.google.com/search", "https://user:pass@maps.google.com/"]) {
      expect(await render([{ ...reviews[0], googleMapsUrl }])).not.toContain('class="review-google-link"');
    }
    expect(await render([reviews[0], { ...reviews[1], isActive: false, googleMapsUrl: "https://maps.app.goo.gl/inactive" }])).not.toContain('class="review-google-link"');
  });

  it("skips invalid links and uses the first valid active review link", async () => {
    const html = await render([
      { ...reviews[0], googleMapsUrl: "https://example.com" },
      { ...reviews[1], googleMapsUrl: "https://maps.app.goo.gl/first" },
      { ...reviews[2], googleMapsUrl: "https://maps.app.goo.gl/second" },
    ]);
    expect(html).toContain('href="https://maps.app.goo.gl/first"');
    expect(html).not.toContain('href="https://maps.app.goo.gl/second"');
  });

  it("normalizes Google Drive screenshot URLs", async () => {
    const html = await render([{ ...reviews[0], screenshotUrl: "https://drive.google.com/file/d/test-image/view" }]);
    expect(html).toContain("https://drive.google.com/thumbnail?id=test-image&amp;sz=w1600");
  });
});
