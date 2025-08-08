import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./src/i18n/routing";
// Note: For edge compatibility, complex permission validation is handled client-side
// This middleware focuses on basic auth and routing

const handleI18nRouting = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/uploads") ||
    pathname === "/favicon.ico" ||
    /\.(ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2|ttf|eot|webp|webm|mp4|mp3|pdf|zip|csv|docx|xlsx|html|txt|xml|json)$/i.test(
      pathname
    )
  ) {
    return NextResponse.next();
  }

  const i18nResponse = handleI18nRouting(request);
  if (i18nResponse.status === 307 || i18nResponse.status === 302)
    return i18nResponse;

  const segments = pathname.split("/").filter(Boolean);
  const hasLocale =
    segments.length > 0 && routing.locales.includes(segments[0] as any);
  const locale = hasLocale ? segments[0] : routing.defaultLocale;
  const path = hasLocale ? "/" + segments.slice(1).join("/") || "/" : pathname;

  const token = request.cookies.get("ecu_session")?.value;
  const isAuthenticated =
    token &&
    token.trim() !== "" &&
    token !== "deleted" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      token
    );

  if (path.startsWith("/auth")) return i18nResponse;

  // Ana sayfa için otomatik yönlendirme kaldırıldı - kullanıcı hangi yetkiye sahipse ona uygun sayfa gösterilir
  if (path === "/") {
    return i18nResponse;
  }

  // /admin yoluna erişim için otomatik yönlendirme kaldırıldı - AdminPageGuard kontrol edecek
  // Bu yönlendirme yetkisiz kullanıcılar için döngü yaratıyordu

  if (
    (path.startsWith("/admin") || path.startsWith("/users")) &&
    !isAuthenticated
  ) {
    return NextResponse.redirect(
      new URL(
        `/${locale}/auth/login?callbackUrl=${encodeURIComponent(pathname)}`,
        request.url
      )
    );
  }

  return i18nResponse;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|uploads|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
