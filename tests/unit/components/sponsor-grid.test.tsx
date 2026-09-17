import React from "react";
import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { SponsorGridSection } from "@/app/_sections/sponsors/SponsorGridSection";
import type { Sponsor } from "@/lib/domain/sponsor.types";

const sponsors: Sponsor[] = [
  {
    id: "1",
    name: "Partner Satu",
    logoUrl: "https://example.com/one.png",
    websiteUrl: "https://example.com/",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "2",
    name: "Partner Dua",
    logoUrl: "https://example.com/two.png",
    displayOrder: 2,
    isActive: true,
  },
];

describe("SponsorGridSection", () => {
  it("renders ordered sponsor logos and safe external links", () => {
    const html = renderToString(<SponsorGridSection sponsors={sponsors} />);
    expect(html.indexOf("Partner Satu")).toBeLessThan(html.indexOf("Partner Dua"));
    expect(html).toContain('alt="Partner Satu logo"');
    expect(html).toContain('href="https://example.com/"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect((html.match(/<a /g) || [])).toHaveLength(1);
    expect(html).toContain('id="sponsor-title"');
  });

  it("renders nothing for an empty sponsor list", () => {
    expect(renderToString(<SponsorGridSection sponsors={[]} />)).toBe("");
  });
});
