"use client";

import { useLanguage } from "@/app/_context/LanguageContext";

interface LocalizedTextProps {
  translationKey: string;
}

export function LocalizedText({ translationKey }: LocalizedTextProps) {
  const { t } = useLanguage();
  return t(translationKey);
}
