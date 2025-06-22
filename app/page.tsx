import { redirect } from 'next/navigation';
import { routing } from '@/src/i18n/routing';

export default function RootPage() {
    // Varsayılan locale'e yönlendir
    redirect(`/${routing.defaultLocale}`);
} 
