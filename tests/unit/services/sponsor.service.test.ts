import { describe, expect, it, vi } from "vitest";
import type { Sponsor } from "@/lib/domain/sponsor.types";
import type { SupabaseSponsorRepository } from "@/lib/repositories/supabase-sponsor.repository";
import { SponsorService } from "@/lib/services/sponsor.service";

const sponsor: Sponsor = {
  id: "draft-1",
  name: "  Lombok Partner  ",
  logoUrl: " https://example.com/logo.png ",
  websiteUrl: " ",
  displayOrder: 9,
  isActive: true,
};

describe("SponsorService", () => {
  it("lists active sponsors through repository", async () => {
    const repo = { findAll: vi.fn().mockResolvedValue([sponsor]) } as unknown as SupabaseSponsorRepository;
    const result = await new SponsorService(repo).listSponsors(true);
    expect(repo.findAll).toHaveBeenCalledWith(true);
    expect(result).toHaveLength(1);
  });

  it("normalizes sponsor fields and display order", async () => {
    const repo = { saveAll: vi.fn().mockImplementation(async (items) => items) } as unknown as SupabaseSponsorRepository;
    const result = await new SponsorService(repo).saveSponsors([sponsor]);
    expect(result[0]).toMatchObject({
      name: "Lombok Partner",
      logoUrl: "https://example.com/logo.png",
      websiteUrl: undefined,
      displayOrder: 1,
    });
  });

  it("rejects unsafe logo URLs", async () => {
    const repo = { saveAll: vi.fn() } as unknown as SupabaseSponsorRepository;
    await expect(
      new SponsorService(repo).saveSponsors([{ ...sponsor, logoUrl: "http://example.com/logo.png" }]),
    ).rejects.toThrow("URL HTTPS");
    expect(repo.saveAll).not.toHaveBeenCalled();
  });

  it("passes repository failures to the caller", async () => {
    const repo = { saveAll: vi.fn().mockRejectedValue(new Error("database unavailable")) } as unknown as SupabaseSponsorRepository;
    await expect(new SponsorService(repo).saveSponsors([sponsor])).rejects.toThrow("database unavailable");
  });
});
