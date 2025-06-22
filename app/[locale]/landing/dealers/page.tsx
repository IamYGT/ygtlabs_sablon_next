import { Metadata } from 'next';
import DealersClient from './components/DealersClient';

export const metadata: Metadata = {
  title: 'Bayiler - Revv Tuned',
  description: 'Türkiye genelindeki Revv Tuned bayilerimizi keşfedin. Size en yakın bayi ile iletişime geçin.',
};

export default function DealersPage() {
  return <DealersClient />;
} 