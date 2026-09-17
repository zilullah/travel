import type { Sponsor } from "../domain/sponsor.types";
import type { SupabaseSponsorRepository } from "../repositories/supabase-sponsor.repository";

function requireHttpsUrl(value: string, label: string): string {
  const trimmed = value.trim();

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:") throw new Error();
    return url.toString();
  } catch {
    throw new Error(`${label} harus berupa URL HTTPS yang valid.`);
  }
}

export class SponsorService {
  constructor(private repo: SupabaseSponsorRepository) {}

  async listSponsors(onlyActive = false): Promise<Sponsor[]> {
    return this.repo.findAll(onlyActive);
  }

  async saveSponsors(items: Sponsor[]): Promise<Sponsor[]> {
    const normalized = items.map((item, index) => {
      const name = item.name.trim();
      if (!name) throw new Error(`Nama sponsor #${index + 1} wajib diisi.`);

      return {
        ...item,
        name,
        logoUrl: requireHttpsUrl(item.logoUrl, `URL logo sponsor #${index + 1}`),
        websiteUrl: item.websiteUrl?.trim()
          ? requireHttpsUrl(item.websiteUrl, `Website sponsor #${index + 1}`)
          : undefined,
        displayOrder: index + 1,
        isActive: item.isActive ?? true,
      };
    });

    return this.repo.saveAll(normalized);
  }
}
