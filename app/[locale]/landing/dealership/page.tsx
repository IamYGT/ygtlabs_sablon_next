import { Metadata } from 'next';
import DealershipClient from './components/DealershipClient';

export const metadata: Metadata = {
  title: 'Bayilik Başvurusu - ATA Performance',
  description: 'ATA Performance bayi ağına katılın. Bayilik başvuru formu ve şartları.',
};

export default function DealershipPage() {
  return <DealershipClient />;
} 