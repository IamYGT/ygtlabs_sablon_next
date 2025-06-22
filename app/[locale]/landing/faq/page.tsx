import { Metadata } from 'next';
import FAQClient from './components/FAQClient';

export const metadata: Metadata = {
  title: 'Sık Sorulan Sorular - Revv Tuned',
  description: 'Chiptuning ve hizmetlerimiz hakkında sık sorulan sorular ve cevapları.',
};

export default function FAQPage() {
  return <FAQClient />;
} 