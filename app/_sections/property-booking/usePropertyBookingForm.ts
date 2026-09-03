'use client';

import { useState } from 'react';
import { Property } from '@/app/_lib/properties';
import { buildWhatsAppLink } from '@/app/_lib/whatsapp';
import { WHATSAPP_TEMPLATES } from '@/app/_constants/whatsapp';
import { formatIDR } from '@/app/_lib/utils';

export interface PropertyBookingFormValues {
  name: string;
  date: string;
  guests: number;
  notes: string;
}

export function usePropertyBookingForm(property: Property) {
  const [values, setValues] = useState<PropertyBookingFormValues>({
    name: '',
    date: '',
    guests: 2,
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    field: keyof PropertyBookingFormValues,
    value: string | number
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const message = WHATSAPP_TEMPLATES.property({
      title: property.title,
      location: property.location,
      price: `${formatIDR(property.priceIdr)} (${property.ownership})`,
      name: values.name,
      date: values.date || 'Fleksibel',
      guests: values.guests,
      notes: values.notes,
    });

    const link = buildWhatsAppLink(message);
    window.open(link, '_blank');
    setIsSubmitting(false);
  };

  return {
    values,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
}
