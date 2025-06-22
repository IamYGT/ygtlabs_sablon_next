import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./src/i18n/routing";

// next-intl middleware'ını oluştur
const handleI18nRouting = createMiddleware(routing);

// Constants
const AUTH_COOKIE_NAME = "ecu_session";

// Helper function to check if session token exists and has valid format
function hasValidSessionToken(request: NextRequest): boolean {
  const sessionToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  console.log(`🔍 Middleware session check:`, {
    path: request.nextUrl.pathname,
    hasToken: !!sessionToken,
    tokenValue: sessionToken ? `${sessionToken.substring(0, 8)}...` : "none",
    tokenLength: sessionToken?.length || 0,
  });

  if (
    !sessionToken ||
    sessionToken.trim() === "" ||
    sessionToken === "deleted"
  ) {
    console.log(`❌ No valid session token found`);
    return false;
  }

  // UUID format validation
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const isValidFormat = uuidRegex.test(sessionToken);

  console.log(`🔍 Token format validation:`, {
    token: `${sessionToken.substring(0, 8)}...`,
    isValidFormat,
  });

  return isValidFormat;
}

// Helper functions
function extractLocale(
  pathname: string,
  locales: readonly string[]
): { locale: string; pathWithoutLocale: string } {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && locales.includes(segments[0])) {
    const locale = segments[0];
    const pathWithoutLocale = "/" + segments.slice(1).join("/") || "/";
    return { locale, pathWithoutLocale };
  }
  return { locale: "en", pathWithoutLocale: pathname };
}

function isAuthPath(path: string): boolean {
  return path.startsWith("/auth");
}

function isProtectedPath(path: string): boolean {
  return path.startsWith("/admin") || path.startsWith("/users");
}

function getLoginUrl(locale: string, callbackUrl?: string): string {
  const baseUrl = `/${locale}/auth/login`;
  return callbackUrl
    ? `${baseUrl}?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : baseUrl;
}

function getDashboardUrl(locale: string): string {
  return `/${locale}/users/dashboard`; // Client-side will redirect to admin if needed
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes("/api/") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/uploads") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.includes("/.well-known/") ||
    // Skip files with extensions (static assets)
    /\.(ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2|ttf|eot|webp|webm|mp4|mp3|pdf|zip|csv|docx|xlsx|html|txt|xml|json)$/i.test(
      pathname
    )
  ) {
    return NextResponse.next();
  }

  // Handle i18n routing first
  const i18nResponse = handleI18nRouting(request);
  if (i18nResponse.status === 307 || i18nResponse.status === 302) {
    return i18nResponse;
  }

  // Extract locale and path
  const { locale, pathWithoutLocale } = extractLocale(
    pathname,
    routing.locales
  );

  // Check if user has valid session token
  const hasValidSession = hasValidSessionToken(request);

  // Auth pages - always allow access, let client-side handle redirects
  if (isAuthPath(pathWithoutLocale)) {
    console.log(`🔍 Auth page check:`, {
      path: pathWithoutLocale,
      hasValidSession,
      action: "always allow access - client will handle redirects",
    });

    // Client-side GuestGuard will handle redirects if user is authenticated
    // This prevents infinite loops when session is invalid but cookie exists
    return i18nResponse;
  }

  // Root path - redirect based on auth status
  if (pathWithoutLocale === "/" || pathWithoutLocale === "") {
    if (hasValidSession) {
      const dashboardUrl = getDashboardUrl(locale);
      console.log(`🔄 Root redirect to dashboard: ${dashboardUrl}`);
      return NextResponse.redirect(new URL(dashboardUrl, request.url));
    } else {
      const loginUrl = getLoginUrl(locale);
      console.log(`🔄 Root redirect to login: ${loginUrl}`);
      return NextResponse.redirect(new URL(loginUrl, request.url));
    }
  }

  // Protected paths - require authentication
  if (isProtectedPath(pathWithoutLocale)) {
    console.log(`🔍 Protected path check:`, {
      path: pathWithoutLocale,
      hasValidSession,
      action: hasValidSession ? "allow access" : "redirect to login",
    });

    if (!hasValidSession) {
      const loginUrl = getLoginUrl(locale, pathname);
      console.log(`🔒 Protected path redirect to login: ${loginUrl}`);
      return NextResponse.redirect(new URL(loginUrl, request.url));
    }
  }

  return i18nResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (images directory)
     * - uploads (uploads directory)
     * - Static file extensions
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images|uploads|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
