import { Metadata } from 'next';
import ServicesClient from './components/ServicesClient';

export const metadata: Metadata = {
  title: 'Hizmetler - ATA Performance',
  description: 'Chiptuning, ECU remapping, performans testleri ve daha fazlası. Tüm hizmetlerimizi keşfedin.',
};

export default function ServicesPage() {
  return <ServicesClient />;
} 