import { WHATSAPP_CONFIG } from '@/app/_constants/whatsapp';

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${encodeURIComponent(message)}`;
}
