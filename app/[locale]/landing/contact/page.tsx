import { Metadata } from 'next';
import ContactClient from './components/ContactClient';

export const metadata: Metadata = {
  title: 'İletişim - Revv Tuned',
  description: 'Bizimle iletişime geçin. Randevu alın, sorularınızı sorun. Profesyonel chiptuning hizmetleri.',
};

export default function ContactPage() {
  return <ContactClient />;
} 