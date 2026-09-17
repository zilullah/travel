import { supabaseClient } from "@/lib/supabase/client";
import { SupabaseSponsorRepository } from "@/lib/repositories/supabase-sponsor.repository";
import { SponsorService } from "@/lib/services/sponsor.service";
import { FALLBACK_SPONSORS } from "@/lib/sponsors";
import type { Sponsor } from "@/lib/domain/sponsor.types";

export async function getSponsors(): Promise<Sponsor[]> {
  try {
    const service = new SponsorService(new SupabaseSponsorRepository(supabaseClient));
    const sponsors = await service.listSponsors(true);
    return sponsors.length > 0 ? sponsors : FALLBACK_SPONSORS;
  } catch (error) {
    console.warn("[Sponsors] Failed to fetch sponsors from Supabase:", error);
    return FALLBACK_SPONSORS;
  }
}
