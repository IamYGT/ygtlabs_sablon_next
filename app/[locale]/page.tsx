'use client';

import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LandingPageContent from './landing/page';

export default function HomePage() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const { hasLayoutAccess, loading: permissionsLoading } = usePermissions();
    const router = useRouter();
    const [hasRedirected, setHasRedirected] = useState(false);

    useEffect(() => {
        // Eğer zaten yönlendirme yapıldıysa tekrar yapma
        if (hasRedirected) return;

        // Yükleme devam ediyorsa bekle
        if (authLoading || permissionsLoading) return;

        // Giriş yapmamış kullanıcılar için landing page göster
        if (!isAuthenticated || !user) return;

        // Kullanıcının rolüne ve yetkilerine göre akıllı yönlendirme
        const redirectUser = () => {
            // Super admin her yere erişebilir - admin'e yönlendir
            if (user.primaryRole === 'super_admin') {
                setHasRedirected(true);
                router.push('/admin/dashboard');
                return;
            }

            // Admin layout erişimi varsa admin paneline yönlendir
            if (hasLayoutAccess('admin')) {
                setHasRedirected(true);
                router.push('/admin/dashboard');
                return;
            }

            // customer layout erişimi varsa customer paneline yönlendir
            if (hasLayoutAccess('user')) {
                setHasRedirected(true);
                router.push('/customer/dashboard');
                return;
            }

            // Hiçbir panel erişimi yoksa landing page'de kal
            console.log('User has no panel access, staying on landing page');
        };

        redirectUser();
    }, [isAuthenticated, user, authLoading, permissionsLoading, hasLayoutAccess, router, hasRedirected]);

    // Yükleme durumu
    if (authLoading || permissionsLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    // Landing page göster
    return <LandingPageContent />;
}
