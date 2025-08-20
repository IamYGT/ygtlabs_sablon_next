---
description: middleware
alwaysApply: false
---
# Middleware Configuration

Bu proje Next.js middleware kullanarak route protection, internationalization ve authentication kontrolü sağlar. Middleware ([middleware.ts](mdc:middleware.ts)) tüm request'leri intercept eder ve gerekli kontrolleri yapar.

## Middleware Architecture

### Main Middleware Function ([middleware.ts](mdc:middleware.ts))
```typescript
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Static files and API routes skip
  // 2. i18n routing handling
  // 3. Locale extraction
  // 4. Authentication checks
  // 5. Route protection
}
```

### Configuration
```typescript
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|uploads|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
```

## Request Flow

### 1. Static File Filtering
```typescript
// Skip static files and API routes
if (
  pathname.startsWith("/_next") ||
  pathname.startsWith("/api") ||
  pathname.startsWith("/images") ||
  pathname.startsWith("/uploads") ||
  pathname === "/favicon.ico" ||
  /\.(ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2|ttf|eot|webp|webm|mp4|mp3|pdf|zip|csv|docx|xlsx|html|txt|xml|json)$/i.test(pathname)
) {
  return NextResponse.next();
}
```

### 2. Internationalization Handling
```typescript
// Handle i18n routing with next-intl
const handleI18nRouting = createMiddleware(routing);
const i18nResponse = handleI18nRouting(request);

if (i18nResponse.status === 307 || i18nResponse.status === 302) {
  return i18nResponse;
}
```

### 3. Locale and Path Extraction
```typescript
// Extract locale and clean path
const segments = pathname.split("/").filter(Boolean);
const hasLocale = segments.length > 0 && routing.locales.includes(segments[0] as "en" | "tr");
const locale = hasLocale ? segments[0] : "en";
const path = hasLocale ? "/" + segments.slice(1).join("/") || "/" : pathname;
```

### 4. Authentication Validation
```typescript
// Session token validation
const token = request.cookies.get("ecu_session")?.value;
const isAuthenticated = token && 
  token.trim() !== "" && 
  token !== "deleted" && 
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token);
```

## Route Protection Patterns

### 1. Public Routes
```typescript
// Auth routes are always accessible
if (path.startsWith("/auth")) return i18nResponse;
```

### 2. Root Route Redirection
```typescript
// Redirect authenticated users from root to dashboard
if (path === "/") {
  return isAuthenticated
    ? NextResponse.redirect(new URL(`/${locale}/admin/dashboard`, request.url))
    : i18nResponse;
}
```

### 3. Protected Routes
```typescript
// Protect admin and user areas
if ((path.startsWith("/admin") || path.startsWith("/customer")) && !isAuthenticated) {
  return NextResponse.redirect(
    new URL(`/${locale}/auth/login?callbackUrl=${encodeURIComponent(pathname)}`, request.url)
  );
}
```

## Authentication Integration

### Session Token Validation
- **Format**: UUID v4 format validation
- **Storage**: HTTP-only cookies
- **Name**: `ecu_session`
- **Validation**: Regex pattern matching

```typescript
const sessionTokenRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
```

### Session Utils Integration ([lib/session-utils.ts](mdc:lib/session-utils.ts))
```typescript
// Middleware can use session utils for advanced validation
import { hasValidSessionToken } from "@/lib/session-utils";

// In middleware
const hasValidToken = hasValidSessionToken(request);
```

## Locale-Aware Redirects

### Authentication Redirects
```typescript
// Login redirect with callback URL
const loginUrl = `/${locale}/auth/login?callbackUrl=${encodeURIComponent(pathname)}`;
return NextResponse.redirect(new URL(loginUrl, request.url));

// Dashboard redirect for authenticated users
const dashboardUrl = `/${locale}/admin/dashboard`;
return NextResponse.redirect(new URL(dashboardUrl, request.url));
```

### Locale Preservation
- All redirects preserve the current locale
- Callback URLs maintain original paths
- Turkish URLs preserve pathname translations

## Route Categories

### 1. Public Routes
- `/auth/*` - Authentication pages
- `/` - Landing page (redirects if authenticated)
- `/landing/*` - Public landing pages

### 2. Protected Routes
- `/admin/*` - Admin panel (requires authentication)
- `/customer/*` - customer dashboard (requires authentication)

### 3. Excluded Routes
- `/api/*` - API routes (handled separately)
- `/_next/*` - Next.js internal routes
- Static assets (images, CSS, JS, etc.)

## Error Handling

### Invalid Tokens
```typescript
// Invalid or expired tokens are treated as unauthenticated
const isAuthenticated = token && 
  token.trim() !== "" && 
  token !== "deleted" && 
  sessionTokenRegex.test(token);
```

### Redirect Loops Prevention
- Auth routes never redirect to prevent loops
- Static files are excluded from processing
- API routes are handled separately

## Performance Considerations

### 1. Static File Exclusion
- Comprehensive regex for static file types
- Early return for performance
- Minimal processing for assets

### 2. Efficient Pattern Matching
- Simple string operations for path checking
- Cached regex patterns
- Minimal cookie parsing

### 3. Selective Processing
- Only process routes that need protection
- Skip unnecessary operations for public routes
- Efficient locale detection

## Best Practices

### 1. Route Organization
```typescript
// Group related route checks
const isAuthRoute = path.startsWith("/auth");
const isProtectedRoute = path.startsWith("/admin") || path.startsWith("/customer");
const isPublicRoute = path.startsWith("/landing") || path === "/";
```

### 2. Locale Handling
```typescript
// Always preserve locale in redirects
const createRedirectUrl = (path: string) => `/${locale}${path}`;
```

### 3. Security
- Validate session tokens properly
- Use secure cookie settings
- Implement proper CSRF protection
- Sanitize callback URLs

### 4. Debugging
```typescript
// Add logging for development
if (process.env.NODE_ENV === 'development') {
  console.log('Middleware:', { pathname, locale, path, isAuthenticated });
}
```

## Integration Points

### 1. i18n System ([src/i18n/routing.ts](mdc:src/i18n/routing.ts))
- Automatic locale detection
- Pathname translations
- Redirect handling

### 2. Auth System ([lib/session-utils.ts](mdc:lib/session-utils.ts))
- Session validation
- User authentication
- Permission checking

### 3. Route Configuration
- Protected route patterns
- Public route exceptions
- Static file exclusions

Bu middleware sistemi, güvenli, performant ve çok dilli route protection sağlar.

