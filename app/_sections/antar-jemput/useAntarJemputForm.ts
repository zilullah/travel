'use client';

import { useState } from 'react';
import { buildWhatsAppLink } from '@/app/_lib/whatsapp';
import { WHATSAPP_TEMPLATES } from '@/app/_constants/whatsapp';

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
    pickup: 'Lombok International Airport (BIL)',
    dropoff: 'Kuta Mandalika Beach / Resort',
    vehicle: 'Toyota Innova Reborn (1-6 Pax + Chauffeur)',
    date: '',
    time: '12:00',
    passengers: 2,
    name: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    field: keyof AntarJemputFormValues,
    value: string | number
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const message = WHATSAPP_TEMPLATES.antarJemput({
      pickup: values.pickup,
      dropoff: values.dropoff,
      vehicle: values.vehicle,
      date: values.date || 'Hari ini / Fleksibel',
      time: values.time,
      passengers: values.passengers,
      name: values.name,
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
