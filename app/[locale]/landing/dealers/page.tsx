import { Metadata } from 'next';
import DealersClient from './components/DealersClient';

export const metadata: Metadata = {
  title: 'Bayiler - ATA Performance',
  description: 'Türkiye genelindeki ATA Performance bayilerimizi keşfedin. Size en yakın bayi ile iletişime geçin.',
};

export default function DealersPage() {
  return <DealersClient />;
} 