import Image from "next/image";
import { formatImageUrl } from "@/app/_lib/utils";
import type { Sponsor } from "@/lib/domain/sponsor.types";

interface SponsorGridSectionProps {
  sponsors: Sponsor[];
}

function SponsorLogo({ sponsor }: { sponsor: Sponsor }) {
  const content = (
    <>
      <div className="relative h-20 w-full sm:h-24">
        <Image
          src={formatImageUrl(sponsor.logoUrl)}
          alt={`${sponsor.name} logo`}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
          className="object-contain p-2"
        />
      </div>
      <span className="mt-3 text-center text-sm font-bold text-[#0C4A6E]">
        {sponsor.name}
      </span>
    </>
  );

  const classes =
    "group flex min-h-40 flex-col items-center justify-center rounded-[23px] border border-[#BAE6FD] bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-[#38BDF8] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0284C7]";

  if (!sponsor.websiteUrl) return <div className={classes}>{content}</div>;

  return (
    <a
      href={sponsor.websiteUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={classes}
      aria-label={`Kunjungi website ${sponsor.name} (buka di tab baru)`}
    >
      {content}
    </a>
  );
}

export function SponsorGridSection({ sponsors }: SponsorGridSectionProps) {
  if (sponsors.length === 0) return null;

  return (
    <section aria-labelledby="sponsor-title" className="relative overflow-hidden bg-[#F7FCFF] py-16 sm:py-20">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto mb-9 max-w-2xl text-center">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-[#0284C7]">
            Kolaborasi lokal
          </p>
          <h2 id="sponsor-title" className="mt-3 text-3xl font-black tracking-tight text-[#0C4A6E] sm:text-4xl">
            Dipercaya oleh partner perjalanan kami
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#486581] sm:text-base">
            Bersama partner pilihan, kami membantu perjalanan di Lombok berjalan lebih mudah.
          </p>
        </header>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {sponsors.map((sponsor) => (
            <SponsorLogo key={sponsor.id} sponsor={sponsor} />
          ))}
        </div>
      </div>
    </section>
  );
}
