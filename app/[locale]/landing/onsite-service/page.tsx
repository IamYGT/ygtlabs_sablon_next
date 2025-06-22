import { Metadata } from 'next';
import OnsiteServiceClient from './components/OnsiteServiceClient';

export const metadata: Metadata = {
  title: 'Yerinde Hizmet - Revv Tuned',
  description: 'Mobil chiptuning hizmeti. Aracınızı getirmeden, istediğiniz yerde profesyonel chiptuning.',
};

export default function OnsiteServicePage() {
  return <OnsiteServiceClient />;
} 