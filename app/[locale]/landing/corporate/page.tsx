import { Metadata } from 'next';
import CorporateClient from './components/CorporateClient';

export const metadata: Metadata = {
  title: 'Kurumsal - Revv Tuned',
  description: 'Revv Tuned hakkında detaylı bilgi, misyonumuz, vizyonumuz ve uzman ekibimiz.',
};

export default function CorporatePage() {
  return <CorporateClient />;
} 