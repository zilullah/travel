"use client";

import React from "react";
import { Property } from "@/app/_lib/properties";
import { usePropertyBookingForm } from "./usePropertyBookingForm";
import { Button } from "@/app/_components/ui/Button";
import { useLanguage } from "@/app/_context/LanguageContext";

interface PropertyBookingFormProps {
  property: Property;
}

export const PropertyBookingForm: React.FC<PropertyBookingFormProps> = ({
  property,
}) => {
  const { values, handleChange, handleSubmit } =
    usePropertyBookingForm(property);
  const { t } = useLanguage();

  return (
    <div className="bg-white p-6 sm:p-8 rounded-[23px] border border-[#BAE6FD] text-[#0C4A6E] shadow-lg">
      <h3 className="text-xl font-bold mb-2 text-[#0C4A6E]">
        {t("booking.title")}
      </h3>
      <p className="text-xs text-[#486581] mb-6">{t("booking.desc")}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#0C4A6E] uppercase">
            {t("booking.full_name")}
          </label>
          <input
            type="text"
            required
            placeholder={t("booking.full_name_placeholder")}
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full bg-[#F7FCFF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#0C4A6E] focus:ring-2 focus:ring-[#0EA5E9] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0C4A6E] uppercase">
              {t("booking.survey_date")}
            </label>
            <input
              type="date"
              value={values.date}
              onChange={(e) => handleChange("date", e.target.value)}
              className="w-full bg-[#F7FCFF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#0C4A6E] focus:ring-2 focus:ring-[#0EA5E9] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0C4A6E] uppercase">
              {t("booking.group_size")}
            </label>
            <input
              type="number"
              min={1}
              value={values.guests}
              onChange={(e) => handleChange("guests", Number(e.target.value))}
              className="w-full bg-[#F7FCFF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#0C4A6E] focus:ring-2 focus:ring-[#0EA5E9] focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#0C4A6E] uppercase">
            {t("booking.questions")}
          </label>
          <textarea
            rows={3}
            placeholder={t("booking.questions_placeholder")}
            value={values.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            className="w-full bg-[#F7FCFF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-sm text-[#0C4A6E] focus:ring-2 focus:ring-[#0EA5E9] focus:outline-none"
          />
        </div>

        <div className="pt-2">
          <Button type="submit" variant="primary" fullWidth size="lg">
            {t("booking.request")}
          </Button>
        </div>
      </form>
    </div>
  );
};
