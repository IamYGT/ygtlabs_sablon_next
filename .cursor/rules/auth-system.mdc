---
description: auth
alwaysApply: false
---
# Authentication & Authorization System

Bu proje modern bir authentication ve authorization sistemi kullanır. Zustand store ve TanStack Query kombinasyonu ile optimize edilmiş bir yapıya sahiptir.

## Auth Store Architecture

### Modern Auth Store ([lib/stores/auth-store.ts](mdc:lib/stores/auth-store.ts))
- Zustand ile state management
- Persist middleware ile localStorage integration
- Session monitoring ve expiry tracking
- Permission-based access control

```typescript
// Doğru kullanım
const { user, isAuthenticated, hasPermission } = useAuth();
const hasAdminAccess = useHasAdminAccess();
const isAdmin = useIsAdmin();
```

### Auth Hooks ([lib/hooks/useAuth.ts](mdc:lib/hooks/useAuth.ts))
- `useAuth()` - Ana auth hook
- `useCurrentUser()` - TanStack Query ile cache'li user fetch
- `useLogin()` - Login mutation
- `useLogout()` - Logout mutation
- `useAuthGuard()` - Route protection
- `useHasPermission()` - Permission check

## Server-Side Authentication

### Session Utils ([lib/session-utils.ts](mdc:lib/session-utils.ts))
- Server-side auth utilities
- `getCurrentUser()` - Request'ten user bilgisi
- `getCurrentUserFromToken()` - Token'dan user bilgisi
- `hasValidSessionToken()` - Middleware için token validation

```typescript
// API route'larda kullanım
const user = await getCurrentUser(request);
if (!user) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

## Permission System

### Permission Constants ([lib/constants.ts](mdc:lib/constants.ts))
```typescript
export const PERMISSIONS = {
  LAYOUT_ADMIN_ACCESS: "layout.admin.access",
  LAYOUT_USER_ACCESS: "layout.user.access",
  FUNCTION_USERS_CREATE: "function.users.create",
  // ...
};
```

### Permission Checks
```typescript
// Component'lerde permission kontrolü
const hasUserCreatePermission = useHasPermission(PERMISSIONS.FUNCTION_USERS_CREATE);
const canAccessAdmin = useHasAdminAccess();

// Server-side permission kontrolü
const hasPermission = user?.permissions?.includes(permission) || false;
```

## Auth Guard Patterns

### Route Protection
```typescript
// Component seviyesinde koruma
function ProtectedComponent() {
  const { isAuthorized, isLoading } = useAuthGuard("function.users.view");
  
  if (isLoading) return <Loading />;
  if (!isAuthorized) return <Unauthorized />;
  
  return <Content />;
}
```

### Middleware Integration ([middleware.ts](mdc:middleware.ts))
- Route-based authentication
- Locale-aware redirects
- Session token validation
- Admin/User area protection

## Best Practices

### 1. Client-Side Auth
- Always use auth hooks from [lib/hooks/useAuth.ts](mdc:lib/hooks/useAuth.ts)
- Prefer `useAuth()` for general auth state
- Use specific hooks like `useHasPermission()` for granular checks
- Never store sensitive data in client state

### 2. Server-Side Auth
- Use [lib/session-utils.ts](mdc:lib/session-utils.ts) for server-side operations
- Always validate permissions on server-side
- Use `getCurrentUser()` in API routes
- Implement proper error handling

### 3. Permission Management
- Define permissions in [lib/constants.ts](mdc:lib/constants.ts)
- Use descriptive permission names
- Group permissions by functionality
- Always check permissions on both client and server

### 4. Session Management
- Session tokens are stored in HTTP-only cookies
- Automatic session refresh with TanStack Query
- Session expiry monitoring
- Multi-device logout support

## Security Considerations

1. **Token Security**: Session tokens are HTTP-only cookies
2. **Permission Validation**: Always validate permissions server-side
3. **Session Expiry**: Automatic session monitoring and refresh
4. **CSRF Protection**: Built-in CSRF protection with cookies
5. **Secure Headers**: Proper security headers in middleware

## Error Handling

```typescript
// Auth error handling
const { login } = useLogin();

try {
  await login({ email, password });
} catch (error) {
  // Error automatically handled by auth store
  // UI notifications shown via useUIStore
}
```

Bu sistem, güvenli, ölçeklenebilir ve kullanıcı dostu bir authentication deneyimi sağlar.

