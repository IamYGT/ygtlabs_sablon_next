import { Metadata } from 'next';
import ChiptuningClient from './components/ChiptuningClient';

export const metadata: Metadata = {
  title: 'Chiptuning - Revv Tuned',
  description: 'Profesyonel chiptuning hizmetleri ile aracınızın performansını artırın, yakıt tüketimini optimize edin.',
};

export default function ChiptuningPage() {
  return <ChiptuningClient />;
} 