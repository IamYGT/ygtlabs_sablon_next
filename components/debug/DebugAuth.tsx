'use client';

import { usePermissions } from "@/hooks/usePermissions";
import { ROLES } from "@/lib/constants";
import { useAuth } from "@/lib/hooks/useAuth";

export function DebugAuth() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const {
    userPermissions,
    hasLayoutAccess,
    hasViewAccess,
    loading: permissionsLoading
  } = usePermissions();

  console.log("🔧 DebugAuth renders:", {
    user: user ? {
      email: user.email,
      primaryRole: user.primaryRole,
      permissions: user.permissions?.length || 0
    } : null,
    isAuthenticated,
    isLoading,
    userPermissions: userPermissions.size,
    permissionsLoading,
    isSuperAdmin: user?.primaryRole === ROLES.SUPER_ADMIN
  });

  const isSuperAdmin = user?.primaryRole === ROLES.SUPER_ADMIN;
  const hasAdminLayout = hasLayoutAccess('admin');
  const hasDashboardView = hasViewAccess('admin.dashboard.view');

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg max-w-md text-xs z-50">
      <h3 className="font-bold mb-2">🔧 Auth Debug</h3>

      <div className="space-y-1">
        <div>
          <strong>User:</strong> {user?.email || 'None'}
        </div>
        <div>
          <strong>Primary Role:</strong> {user?.primaryRole || 'None'}
        </div>
        <div>
          <strong>Is Super Admin:</strong> {isSuperAdmin ? '✅' : '❌'}
        </div>
        <div>
          <strong>Is Authenticated:</strong> {isAuthenticated ? '✅' : '❌'}
        </div>
        <div>
          <strong>Auth Loading:</strong> {isLoading ? '⏳' : '✅'}
        </div>
        <div>
          <strong>Perms Loading:</strong> {permissionsLoading ? '⏳' : '✅'}
        </div>
        <div>
          <strong>User Permissions:</strong> {userPermissions.size}
        </div>
        <div>
          <strong>Admin Layout Access:</strong> {hasAdminLayout ? '✅' : '❌'}
        </div>
        <div>
          <strong>Dashboard View Access:</strong> {hasDashboardView ? '✅' : '❌'}
        </div>
      </div>

      <details className="mt-2">
        <summary className="cursor-pointer">User Permissions</summary>
        <div className="mt-1 max-h-32 overflow-y-auto">
          {userPermissions.size > 0 ? (
            Array.from(userPermissions).map(perm => (
              <div key={perm} className="text-green-400">• {perm}</div>
            ))
          ) : (
            <div className="text-red-400">No permissions</div>
          )}
        </div>
      </details>
    </div>
  );
}