'use client';

import { usePermissions } from "@/hooks/usePermissions";
import { ROLES } from "@/lib/constants";
import { useAuth } from "@/lib/hooks/useAuth";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

interface AdminPageGuardProps {
  children: React.ReactNode;
  requiredPermission?: string; // Opsiyonel, view permission'ı
  requireLayout?: 'admin' | 'user'; // Layout erişim kontrolü
  fallback?: React.ReactNode;
}

/**
 * Admin sayfalarını korur - yeni permission sistemi ile
 * Layout + View erişim kontrolü yapar
 */
export function AdminPageGuard({
  children,
  requiredPermission,
  requireLayout = 'admin',
  fallback
}: AdminPageGuardProps) {
  const { user, isAuthenticated } = useAuth();
  const { hasLayoutAccess, hasViewAccess, loading: permissionsLoading } = usePermissions();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const t = useTranslations('AdminGuard');

  // super_admin için tüm kısıtlamaları kaldır
  const isSuperAdmin = user?.primaryRole === ROLES.SUPER_ADMIN;

  // Erişim kontrolleri
  const hasRequiredLayoutAccess = isSuperAdmin || hasLayoutAccess(requireLayout);
  const hasRequiredViewAccess = !requiredPermission || isSuperAdmin || hasViewAccess(requiredPermission);

  // Debug log
  console.log("🛡️ AdminPageGuard:", {
    user: user?.email,
    role: user?.primaryRole,
    requireLayout,
    requiredPermission,
    hasRequiredLayoutAccess,
    hasRequiredViewAccess,
    isSuperAdmin,
    isAuthenticated,
    permissionsLoading
  });

  // Server-side debug log
  useEffect(() => {
    if (user && !permissionsLoading) {
      fetch('/api/debug/admin-guard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requireLayout,
          requiredPermission
        })
      }).catch(console.error);
    }
  }, [user, permissionsLoading, requireLayout, requiredPermission]);

  useEffect(() => {
    // Sadece debug log'ları için - yönlendirme yok
    if (!user || permissionsLoading) {
      return; // Yüklenme durumu
    }

    // super_admin için hiçbir kısıtlama yok
    if (isSuperAdmin) {
      return;
    }

    // Layout erişim kontrolü - sadece log
    if (!hasRequiredLayoutAccess) {
      console.log(`❌ Layout access denied to ${requireLayout} for user ${user.email}`);

      // Server-side log da gönder
      fetch('/api/debug/admin-guard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'LAYOUT_DENIED',
          requireLayout,
          requiredPermission,
          userEmail: user.email
        })
      }).catch(console.error);

      return;
    }

    // View erişim kontrolü - sadece log
    if (requiredPermission && !hasRequiredViewAccess) {
      console.log(`❌ View access denied to ${requiredPermission} for user ${user.email}`);

      // Server-side log da gönder
      fetch('/api/debug/admin-guard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'VIEW_DENIED',
          requireLayout,
          requiredPermission,
          userEmail: user.email
        })
      }).catch(console.error);

      return;
    }
  }, [
    user,
    permissionsLoading,
    hasRequiredLayoutAccess,
    hasRequiredViewAccess,
    isSuperAdmin,
    requireLayout,
    requiredPermission
  ]);

  // Giriş yapmamış kullanıcı durumu
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-600 mb-4">{t('loginRequiredTitle')}</h1>
          <p className="text-gray-600 mb-4">{t('loginRequiredDesc')}</p>
          <a
            href={`/${locale}/auth/login?callbackUrl=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname : '/')}`}
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('loginButton')}
          </a>
        </div>
      </div>
    );
  }

  // Yükleme durumu
  if (!user || permissionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  // super_admin için her şeye erişim
  if (isSuperAdmin) {
    return <>{children}</>;
  }

  // Layout erişim kontrolü - akıllı yönlendirme ile
  if (!hasRequiredLayoutAccess) {
    // Eğer admin paneli isteniyor ama kullanıcının user erişimi varsa yönlendir
    if (requireLayout === 'admin' && hasLayoutAccess('user')) {
      router.push(`/${locale}/users/dashboard`);
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t('redirectingUserPanel')}</p>
          </div>
        </div>
      );
    }

    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">{t('accessDeniedTitle')}</h1>
          <p className="text-gray-600 mb-4">{t('accessDeniedDesc')}</p>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-600">
              <strong>{t('requiredPermission')}</strong> {requireLayout === 'admin' ? t('adminPanel') : t('userPanel')} erişimi
            </p>
          </div>
          <div className="space-y-2">
            {hasLayoutAccess('user') && (
              <button
                onClick={() => router.push(`/${locale}/users/dashboard`)}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('goToUserPanel')}
              </button>
            )}
            <button
              onClick={() => router.push(`/${locale}`)}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              {t('backToHome')}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            {t('contactAdmin')}
          </p>
        </div>
      </div>
    );
  }

  // View erişim kontrolü
  if (requiredPermission && !hasRequiredViewAccess) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L12 12l2.122-2.121m0 0l1.415-1.414M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-orange-600 mb-4">{t('pageAccessRestrictedTitle')}</h1>
          <p className="text-gray-600 mb-4">{t('pageAccessRestrictedDesc')}</p>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-600">
              <strong>{t('requiredPermission')}</strong> <code className="bg-gray-200 px-1 rounded text-xs">{requiredPermission}</code>
            </p>
          </div>
          <p className="text-sm text-gray-500">
            {t('contactAdmin')}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Function Guard - Belirli işlevler için erişim kontrolü
 */
export function FunctionGuard({
  children,
  requiredPermission,
  fallback,
  showMessage = true
}: {
  children: React.ReactNode;
  requiredPermission: string;
  fallback?: React.ReactNode;
  showMessage?: boolean;
}) {
  const { user } = useAuth();
  const { hasFunctionAccess } = usePermissions();
  const t = useTranslations('AdminGuard');

  const isSuperAdmin = user?.primaryRole === ROLES.SUPER_ADMIN;
  const hasAccess = isSuperAdmin || hasFunctionAccess(requiredPermission);

  if (!hasAccess) {
    if (fallback !== undefined) {
      return <>{fallback}</>;
    }

    if (!showMessage) {
      return null;
    }

    return (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
        <p className="text-red-600 text-sm">
          {t('noPermissionForFunction')} <span className="font-mono text-xs ml-1">{t('permissionCode', { permission: requiredPermission })}</span>
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Super Admin Guard - sadece super_admin erişebilir
 */
export function SuperAdminGuard({
  children,
  fallback
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { user, isAuthenticated } = useAuth();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const t = useTranslations('AdminGuard');

  const isSuperAdmin = user?.primaryRole === ROLES.SUPER_ADMIN;

  useEffect(() => {
    // Sadece debug log'ları için - yönlendirme yok
    if (user && !isSuperAdmin) {
      console.log(`❌ Super admin access denied for user ${user.email}`);
      return;
    }
  }, [user, isSuperAdmin]);

  // Giriş yapmamış kullanıcı durumu
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-600 mb-4">{t('loginRequiredTitle')}</h1>
          <p className="text-gray-600 mb-4">{t('loginRequiredDesc')}</p>
          <a
            href={`/${locale}/auth/login?callbackUrl=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname : '/')}`}
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('loginButton')}
          </a>
        </div>
      </div>
    );
  }

  // Yükleme durumu
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!isSuperAdmin) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">{t('superAdminRequiredTitle')}</h1>
          <p className="text-gray-600 mb-4">{t('superAdminRequiredDesc')}</p>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-600">
              <strong>{t('currentRole')}</strong> {user?.primaryRole || 'Unknown'}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>{t('requiredRole')}</strong> {t('superAdmin')}
            </p>
          </div>
          <p className="text-sm text-gray-500">
            {t('contactAdmin')}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
