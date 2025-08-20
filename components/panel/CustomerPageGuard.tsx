'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';

interface CustomerPageGuardProps {
    children: React.ReactNode;
    requiredPermission?: string;
}

export function CustomerPageGuard({ children, requiredPermission }: CustomerPageGuardProps) {
    const { user, isAuthenticated, hasCustomerAccess, hasPermission } = useAuth();
    const router = useRouter();
    const params = useParams();
    const locale = (params.locale as string) || 'en';

    useEffect(() => {
        if (!isAuthenticated || !user) {
            router.push(`/${locale}/auth/login`);
            return;
        }

        if (!hasCustomerAccess()) {
            router.push(`/${locale}/auth/forbidden`);
            return;
        }

        if (requiredPermission && !hasPermission(requiredPermission)) {
            router.push(`/${locale}/customer/dashboard`);
            return;
        }
    }, [isAuthenticated, user, hasCustomerAccess, hasPermission, requiredPermission, router, locale]);

    // If no user or not authenticated, return null (useEffect will handle redirect)
    if (!isAuthenticated || !user || !hasCustomerAccess()) {
        return null;
    }

    // If specific permission is required and user doesn't have it
    if (requiredPermission && !hasPermission(requiredPermission)) {
        return null;
    }

    return <>{children}</>;
}
