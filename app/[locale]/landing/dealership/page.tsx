import { Metadata } from 'next';
import DealershipClient from './components/DealershipClient';

export const metadata: Metadata = {
  title: 'Bayilik Başvurusu - Revv Tuned',
  description: 'Revv Tuned bayi ağına katılın. Bayilik başvuru formu ve şartları.',
};

export default function DealershipPage() {
  return <DealershipClient />;
} 