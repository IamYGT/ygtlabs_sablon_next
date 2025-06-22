'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth, useCurrentUser } from '@/lib/hooks/useAuth';

export default function LocaleHomePage() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const { isLoading: queryLoading } = useCurrentUser();
    const router = useRouter();
    const params = useParams();
    const locale = (params.locale as string) || 'tr';

    useEffect(() => {
        // Loading sırasında redirect yapma
        if (isLoading || queryLoading) return;

        if (isAuthenticated && user) {
            const hasAdminAccess = user.permissions?.includes('layout.admin.access');
            router.push(`/${locale}/${hasAdminAccess ? 'admin' : 'users'}/dashboard`);
        } else {
            router.push(`/${locale}/auth/login`);
        }
    }, [isAuthenticated, user, isLoading, queryLoading, router, locale]);

    // Loading state göster
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Yönlendiriliyor...</p>
            </div>
        </div>
    );
}
