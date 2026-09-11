import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";

vi.mock("react-fast-marquee", () => ({
  default: ({ children }: React.PropsWithChildren<Record<string, unknown>>) => (
    <div className="mock-marquee">{children}</div>
  ),
}));

import { CustomerReviews } from "@/app/_sections/testimonials/CustomerReviews";
import { LanguageProvider } from "@/app/_context/LanguageContext";

describe("CustomerReviews", () => {
  afterEach(() => {
    vi.doUnmock("react-fast-marquee");
    vi.resetModules();
  });

  it("renders with the CommonJS default wrapper used by SSR", async () => {
    vi.resetModules();
    vi.doMock("react-fast-marquee", () => ({
      default: {
        default: React.forwardRef<HTMLDivElement, React.PropsWithChildren>(
          function Marquee({ children }, ref) {
            return <div ref={ref}>{children}</div>;
          },
        ),
      },
    }));
    const { CustomerReviews: Reviews } = await import("@/app/_sections/testimonials/CustomerReviews");

    expect(renderToString(<Reviews />)).toContain("Google Maps review screenshot");
  });

  it("renders with the installed marquee package without mocks", async () => {
    vi.doUnmock("react-fast-marquee");
    vi.resetModules();
    const { CustomerReviews: Reviews } = await import("@/app/_sections/testimonials/CustomerReviews");

    expect(renderToString(<Reviews />)).toContain('id="reviews"');
  });

  it("renders image-only screenshots in both marquee directions", () => {
    const html = renderToString(
      <LanguageProvider>
        <CustomerReviews
          reviews={[{
            id: "review-1",
            reviewerName: "Nadia Guest",
            location: "Berlin, Germany",
            rating: 4,
            reviewText: "The transfer was easy and punctual.",
            serviceLabel: "Airport Transfer",
            screenshotUrl: "https://images.example.com/review.png",
            googleMapsUrl: "https://maps.google.com/example",
            displayOrder: 1,
            isActive: true,
          }]}
        />
      </LanguageProvider>,
    );

    expect(html).toContain("Google Maps review screenshot from Nadia Guest");
    expect(html).toContain('aria-label="Customer reviews moving right"');
    expect(html).toContain('aria-label="Customer reviews moving left"');
    expect(html.match(/review-marquee/g)?.length).toBeGreaterThanOrEqual(2);
    expect(html).not.toContain("The transfer was easy and punctual.");
    expect(html).not.toContain("Airport Transfer");
    expect((html.match(/Nadia Guest/g) || []).length).toBeGreaterThan(2);
  });
});
