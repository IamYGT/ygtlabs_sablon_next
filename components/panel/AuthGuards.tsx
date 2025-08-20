'use client';

import { useAuth, useCurrentUser } from '@/lib/hooks/useAuth';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

interface AuthGuardProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

// Loading Spinner Component
function LoadingSpinner() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Yükleniyor...</p>
            </div>
        </div>
    );
}

// Admin Guard
export function AdminGuard({ children, fallback }: AuthGuardProps) {
    const { user, isAuthenticated, isLoading, hasAdminAccess } = useAuth();
    const { isLoading: queryLoading } = useCurrentUser();
    const router = useRouter();
    const params = useParams();
    const locale = (params.locale as string) || 'en';

    // Loading durumu
    const loading = isLoading || queryLoading;

    // Redirect işlemlerini useEffect ile render sonrasına ertele
    useEffect(() => {
        if (loading) return; // Loading sırasında redirect yapma

        if (!isAuthenticated || !user) {
            // Hard redirect to ensure clean state
            window.location.href = `/${locale}/auth/login`;
            return;
        }

        if (!hasAdminAccess()) {
            router.push(`/${locale}/auth/forbidden`);
            return;
        }
    }, [loading, isAuthenticated, user, hasAdminAccess, router, locale]);

    // Loading durumu
    if (loading) {
        return fallback || <LoadingSpinner />;
    }

    // Giriş yapmamış kullanıcılar için loading göster
    if (!isAuthenticated || !user) {
        return fallback || <LoadingSpinner />;
    }

    // admin layout erişim kontrolü (geriye dönük uyum dahil)
    if (!hasAdminAccess()) {
        return fallback || <LoadingSpinner />;
    }

    // Admin access var - içeriği göster
    return <>{children}</>;
}

// User Guard - user.layout veya admin.layout (geriye dönük: layout.user.access/layout.admin.access)
export function UserGuard({ children, fallback }: AuthGuardProps) {
    const { user, isAuthenticated, isLoading, hasUserAccess } = useAuth();
    const { isLoading: queryLoading } = useCurrentUser();
    const router = useRouter();
    const params = useParams();
    const locale = (params.locale as string) || 'en';

    // Loading durumu
    const loading = isLoading || queryLoading;

    // Redirect işlemlerini useEffect ile render sonrasına ertele
    useEffect(() => {
        if (loading) return; // Loading sırasında redirect yapma

        if (!isAuthenticated || !user) {
            // Hard redirect to ensure clean state
            window.location.href = `/${locale}/auth/login`;
            return;
        }

        if (!hasUserAccess()) {
            router.push(`/${locale}/auth/forbidden`);
            return;
        }
    }, [loading, isAuthenticated, user, hasUserAccess, router, locale]);

    // Loading durumu
    if (loading) {
        return fallback || <LoadingSpinner />;
    }

    // Giriş yapmamış kullanıcılar için loading göster
    if (!isAuthenticated || !user) {
        return fallback || <LoadingSpinner />;
    }

    // layout.user.access veya layout.admin.access permission kontrolü
    if (!hasUserAccess()) {
        return fallback || <LoadingSpinner />;
    }

    // User veya admin access var - içeriği göster
    return <>{children}</>;
}

// Customer Guard - customer.layout permission kontrolü
export function CustomerGuard({ children, fallback }: AuthGuardProps) {
    const { user, isAuthenticated, isLoading, hasCustomerAccess } = useAuth();
    const { isLoading: queryLoading } = useCurrentUser();
    const router = useRouter();
    const params = useParams();
    const locale = (params.locale as string) || 'en';

    // Loading durumu
    const loading = isLoading || queryLoading;

    // Redirect işlemlerini useEffect ile render sonrasına ertele
    useEffect(() => {
        if (loading) return; // Loading sırasında redirect yapma

        if (!isAuthenticated || !user) {
            // Hard redirect to ensure clean state
            window.location.href = `/${locale}/auth/login`;
            return;
        }

        if (!hasCustomerAccess()) {
            router.push(`/${locale}/auth/forbidden`);
            return;
        }
    }, [loading, isAuthenticated, user, hasCustomerAccess, router, locale]);

    // Loading durumu
    if (loading) {
        return fallback || <LoadingSpinner />;
    }

    // Giriş yapmamış kullanıcılar için loading göster
    if (!isAuthenticated || !user) {
        return fallback || <LoadingSpinner />;
    }

    // customer.layout permission kontrolü
    if (!hasCustomerAccess()) {
        return fallback || <LoadingSpinner />;
    }

    // Customer access var - içeriği göster
    return <>{children}</>;
}

// Guest Guard - sadece giriş yapmamış kullanıcılar geçebilir
export function GuestGuard({ children, fallback }: AuthGuardProps) {
    const { user, isAuthenticated, isLoading, hasAdminAccess } = useAuth();
    const { isLoading: queryLoading } = useCurrentUser();
    const router = useRouter();
    const params = useParams();
    const locale = (params.locale as string) || 'en';

    // Loading durumu
    const loading = isLoading || queryLoading;

    // Redirect işlemlerini useEffect ile render sonrasına ertele
    useEffect(() => {
        if (loading) return; // Loading sırasında redirect yapma

        if (isAuthenticated && user) {
            if (hasAdminAccess()) {
                router.push(`/${locale}/admin/dashboard`);
            } else {
                router.push(`/${locale}/customer/dashboard`);
            }
        }
    }, [loading, isAuthenticated, user, hasAdminAccess, router, locale]);

    // Loading durumu
    if (loading) {
        return fallback || <LoadingSpinner />;
    }

    // Giriş yapmış kullanıcılar için loading göster
    if (isAuthenticated && user) {
        return fallback || <LoadingSpinner />;
    }

    // Guest kullanıcı - içeriği göster
    return <>{children}</>;
}

// Auth Required Guard - sadece giriş yapmış kullanıcılar geçebilir
export function AuthRequiredGuard({ children, fallback }: AuthGuardProps) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const { isLoading: queryLoading } = useCurrentUser();
    const router = useRouter();
    const params = useParams();
    const locale = (params.locale as string) || 'en';

    // Loading durumu
    const loading = isLoading || queryLoading;

    // Redirect işlemlerini useEffect ile render sonrasına ertele
    useEffect(() => {
        if (loading) return; // Loading sırasında redirect yapma

        if (!isAuthenticated || !user) {
            // Hard redirect to ensure clean state
            window.location.href = `/${locale}/auth/login`;
        }
    }, [loading, isAuthenticated, user, router, locale]);

    // Loading durumu
    if (loading) {
        return fallback || <LoadingSpinner />;
    }

    // Giriş yapmamış kullanıcılar için loading göster
    if (!isAuthenticated || !user) {
        return fallback || <LoadingSpinner />;
    }

    // Authenticated user - içeriği göster
    return <>{children}</>;
} 