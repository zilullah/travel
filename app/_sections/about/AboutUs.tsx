"use client";

import React from "react";
import { Badge } from "@/app/_components/ui/Badge";
import {
  ShieldCheckIcon,
  UsersIcon,
  CompassIcon,
} from "@/app/_components/ui/Icons";
import { useLanguage } from "@/app/_context/LanguageContext";

const highlights = [
  {
    icon: CompassIcon,
    titleKey: "about.card1_title",
    textKey: "about.card1_text",
  },
  {
    icon: ShieldCheckIcon,
    titleKey: "about.card2_title",
    textKey: "about.card2_text",
  },
  {
    icon: UsersIcon,
    titleKey: "about.card3_title",
    textKey: "about.card3_text",
  },
] as const;

export const AboutUs: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section
      id="about"
      className="py-20 lg:py-28 bg-white border-y border-[#BAE6FD] text-[#0C4A6E]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-start">
          <div className="space-y-5">
            <Badge variant="sky">{t("about.badge")}</Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {t("about.title")}
            </h2>
            <p className="text-base sm:text-lg text-[#486581] leading-relaxed">
              {t("about.intro")}
            </p>
            <p className="text-sm sm:text-base text-[#486581] leading-relaxed">
              {t("about.body")}
            </p>
            <div className="pt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold uppercase tracking-wide text-[#0284C7]">
              <span>{t("about.local_team")}</span>
              <span>{t("about.english_support")}</span>
              <span>{t("about.private_planning")}</span>
            </div>
          </div>

          <div className="grid gap-4">
            {highlights.map(({ icon: Icon, titleKey, textKey }) => (
              <article
                key={titleKey}
                className="flex gap-4 p-5 bg-[#F7FCFF] border border-[#BAE6FD] rounded-[23px]"
              >
                <div className="shrink-0 w-11 h-11 rounded-2xl bg-[#0EA5E9] text-white flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0C4A6E]">{t(titleKey)}</h3>
                  <p className="mt-1.5 text-sm text-[#486581] leading-relaxed">
                    {t(textKey)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
