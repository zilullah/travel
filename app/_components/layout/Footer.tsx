"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "@/app/_context/LanguageContext";
import { WHATSAPP_CONFIG } from "@/app/_constants/whatsapp";

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-white text-[#0C4A6E] pt-16 pb-12 border-t border-[#BAE6FD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-[#EFF8FF]">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-sm flex items-center justify-center bg-white border border-[#BAE6FD]">
                <Image
                  src="/assets/image/logo.webp"
                  alt="Lombok Experience Logo"
                  width={36}
                  height={36}
                  className="object-contain w-full h-full"
                />
              </div>
              <span className="font-extrabold text-xl text-[#0C4A6E]">
                LOMBOK<span className="text-[#0EA5E9]">EXPERIENCE</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#486581] max-w-sm">
              {t("footer.desc")}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0C4A6E]">
              {t("footer.quick_links")}
            </h4>
            <ul className="space-y-1 text-xs text-[#486581]">
              <li>
                <a href="/#packages" className="hover:text-[#0284C7]">
                  {t("nav.tours")}
                </a>
              </li>
              <li>
                <a href="/#antar-jemput" className="hover:text-[#0284C7]">
                  {t("nav.pickup")}
                </a>
              </li>
              <li>
                <a href="/properties" className="hover:text-[#0284C7]">
                  {t("nav.properties")}
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0C4A6E]">
              {t("footer.contact_support")}
            </h4>
            <p className="text-xs text-[#486581]">
              WhatsApp: +{WHATSAPP_CONFIG.phoneNumber}
            </p>
            <p className="text-xs text-[#486581]">
              Kuta, Mandalika, Lombok Tengah, NTB
            </p>
          </div>
        </div>

        <div className="pt-6 text-center text-[11px] text-[#6B8CA5]">
          {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
};
