'use client';

import { usePermissions } from "@/hooks/usePermissions";
import { ROLES } from "@/lib/constants";
import { useAuth } from "@/lib/hooks/useAuth";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
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

  useEffect(() => {
    if (permissionsLoading || !user) {
      return; // Veriler yüklenene kadar bekle
    }

    // super_admin her zaman erişebilir
    if (isSuperAdmin) {
      return;
    }

    // Yetki kontrolleri ve yönlendirme
    if (!hasRequiredLayoutAccess || (requiredPermission && !hasRequiredViewAccess)) {
      router.push(`/${locale}/auth/forbidden`);
    }
  }, [
    user,
    permissionsLoading,
    isSuperAdmin,
    hasRequiredLayoutAccess,
    hasRequiredViewAccess,
    requiredPermission,
    router,
    locale
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

  // Yetki kontrolleri useEffect içinde yapıldığı için,
  // burada sadece yükleme ve super_admin durumlarını kontrol edip çocuk bileşenleri render ediyoruz.
  // Yönlendirme gerçekleşene kadar bu kısım render edilebilir, bu yüzden bir fallback göstermek önemlidir.
  if (!isSuperAdmin && (!hasRequiredLayoutAccess || (requiredPermission && !hasRequiredViewAccess))) {
    // Yönlendirme gerçekleşirken boş bir fragment veya fallback göster
    return fallback || null;
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
      // Debug log removed for production
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
              <strong>{t('currentRole')}</strong> {user?.primaryRole || t('unknown')}
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