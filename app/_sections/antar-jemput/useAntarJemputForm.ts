"use client";

import { useState } from "react";
import { buildWhatsAppLink } from "@/app/_lib/whatsapp";
import { WHATSAPP_TEMPLATES } from "@/app/_constants/whatsapp";

const TEXT_LIMITS = {
  pickup: 120,
  dropoff: 120,
  vehicle: 80,
  date: 80,
  notes: 300,
} as const;

function sanitizeText(value: string, maxLength: number): string {
  return value
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function sanitizeDate(value: string): string {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "";
}

function sanitizeTime(value: string): string {
  return /^\d{2}:\d{2}$/.test(value) ? value : "";
}

export interface AntarJemputFormValues {
  pickup: string;
  dropoff: string;
  vehicle: string;
  date: string;
  time: string;
  passengers: number;
  name: string;
  notes: string;
}

export function useAntarJemputForm() {
  const [values, setValues] = useState<AntarJemputFormValues>({
    pickup: "Lombok International Airport (BIL)",
    dropoff: "Kuta Mandalika Beach / Resort",
    vehicle: "Toyota Innova Reborn (1-4 Pax)",
    date: "",
    time: "12:00",
    passengers: 2,
    name: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    field: keyof AntarJemputFormValues,
    value: string | number,
  ) => {
    if (typeof value === "string" && field in TEXT_LIMITS) {
      const maxLength = TEXT_LIMITS[field as keyof typeof TEXT_LIMITS];
      setValues((prev) => ({
        ...prev,
        [field]: sanitizeText(value, maxLength),
      }));
      return;
    }

    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const message = WHATSAPP_TEMPLATES.antarJemput({
      pickup: sanitizeText(values.pickup, TEXT_LIMITS.pickup),
      dropoff: sanitizeText(values.dropoff, TEXT_LIMITS.dropoff),
      vehicle: sanitizeText(values.vehicle, TEXT_LIMITS.vehicle),
      date: sanitizeDate(values.date) || "Hari ini / Fleksibel",
      time: sanitizeTime(values.time),
      passengers: values.passengers,
      name: values.name,
      notes: sanitizeText(values.notes, TEXT_LIMITS.notes),
    });

    const link = buildWhatsAppLink(message);
    window.open(link, "_blank");
    setIsSubmitting(false);
  };

  return {
    values,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
}
