import { Metadata } from 'next';
import CorporateClient from './components/CorporateClient';

export const metadata: Metadata = {
  title: 'Kurumsal - ATA Performance',
  description: 'ATA Performance hakkında detaylı bilgi, misyonumuz, vizyonumuz ve uzman ekibimiz.',
};

export default function CorporatePage() {
  return <CorporateClient />;
} 