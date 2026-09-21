"use client";

import { WHATSAPP_TEMPLATES } from "@/app/_constants/whatsapp";
import { useLanguage } from "@/app/_context/LanguageContext";
import { buildWhatsAppLink } from "@/app/_lib/whatsapp";
import { WhatsAppIcon } from "@/app/_components/ui/Icons";

export function WhatsAppFloatingButton() {
  const { lang, t } = useLanguage();
  const label = t("whatsapp.consultation");

  return (
    <a
      href={buildWhatsAppLink(WHATSAPP_TEMPLATES.consultation[lang])}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="fixed right-4 bottom-4 z-50 inline-flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-full bg-[#0EA5E9] p-3 text-white shadow-lg transition-colors hover:bg-[#075985] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#0C4A6E] sm:right-6 sm:bottom-6 sm:px-5"
    >
      <WhatsAppIcon className="h-6 w-6 shrink-0" />
      <span className="hidden text-sm font-semibold sm:inline">{label}</span>
    </a>
  );
}
