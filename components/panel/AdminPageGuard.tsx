'use client';

import { usePermissions } from "@/hooks/usePermissions";
import { ROLES } from "@/lib/constants";
import { useAuth } from "@/lib/hooks/useAuth";
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
  const locale = params?.locale || 'tr';

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
    if (!isAuthenticated) {
      // Giriş yapmamış kullanıcıyı login'e yönlendir
      router.push(`/${locale}/auth/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (!user || permissionsLoading) {
      return; // Yüklenme durumu
    }

    // super_admin için hiçbir kısıtlama yok
    if (isSuperAdmin) {
      return;
    }

    // Layout erişim kontrolü
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

      router.push(`/${locale}/auth/forbidden`);
      return;
    }

    // View erişim kontrolü (eğer belirtilmişse)
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

      router.push(`/${locale}/auth/forbidden`);
      return;
    }
  }, [
    isAuthenticated,
    user,
    permissionsLoading,
    hasRequiredLayoutAccess,
    hasRequiredViewAccess,
    isSuperAdmin,
    requireLayout,
    requiredPermission,
    router,
    locale
  ]);

  // Yükleme durumu
  if (!isAuthenticated || !user || permissionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // super_admin için her şeye erişim
  if (isSuperAdmin) {
    return <>{children}</>;
  }

  // Layout erişim kontrolü
  if (!hasRequiredLayoutAccess) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Layout Erişim Reddedildi</h1>
          <p className="text-gray-600">Bu panel türüne erişim yetkiniz bulunmamaktadır.</p>
          <p className="text-sm text-gray-500 mt-2">Gerekli yetki: {requireLayout}.layout</p>
        </div>
      </div>
    );
  }

  // View erişim kontrolü
  if (requiredPermission && !hasRequiredViewAccess) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Sayfa Erişim Reddedildi</h1>
          <p className="text-gray-600">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
          <p className="text-sm text-gray-500 mt-2">Gerekli yetki: {requiredPermission}</p>
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
          Bu işlev için yetkiniz bulunmuyor.
          <span className="font-mono text-xs ml-1">({requiredPermission})</span>
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
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || 'tr';

  const isSuperAdmin = user?.primaryRole === ROLES.SUPER_ADMIN;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/${locale}/auth/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (user && !isSuperAdmin) {
      console.log(`❌ Super admin access denied for user ${user.email}`);
      router.push(`/${locale}/auth/forbidden`);
      return;
    }
  }, [isAuthenticated, user, isSuperAdmin, router, locale]);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isSuperAdmin) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Yetersiz Yetki</h1>
          <p className="text-gray-600">Bu alana sadece süper adminler erişebilir.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}