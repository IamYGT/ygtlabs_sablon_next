import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Desteklenen dillerin listesi
  locales: ["en", "tr"],

  // Varsayılan dil English (/ dizini English olacak)
  defaultLocale: "en",

  // Locale prefix'i sadece default olmayan diller için göster
  localePrefix: {
    mode: "as-needed",
    prefixes: {
      // 'en' has no prefix
      tr: "/tr",
    },
  },

  // Pathname translations - Türkçe URL'ler için
  pathnames: {
    // Landing page
    "/landing": {
      en: "/landing",
      tr: "/anasayfa",
    },

    // Auth routes
    "/auth/login": {
      en: "/login",
      tr: "/giris",
    },
    "/auth/register": {
      en: "/register",
      tr: "/kayit-ol",
    },
    "/auth/forgot-password": {
      en: "/forgot-password",
      tr: "/sifremi-unuttum",
    },
    "/auth/forbidden": {
      en: "/forbidden",
      tr: "/erisim-engellendi",
    },
    "/auth/unauthorized": {
      en: "/unauthorized",
      tr: "/yetkisiz",
    },
    "/auth/error": {
      en: "/error",
      tr: "/hata",
    },

    // Admin routes
    "/admin/dashboard": {
      en: "/admin/dashboard",
      tr: "/admin/kontrol-paneli",
    },
    "/admin/users": {
      en: "/admin/users",
      tr: "/admin/kullanicilar",
    },
    "/admin/roles": {
      en: "/admin/roles",
      tr: "/admin/roller",
    },
    "/admin/permissions": {
      en: "/admin/permissions",
      tr: "/admin/yetkiler",
    },
    "/admin/profile": {
      en: "/admin/profile",
      tr: "/admin/profil",
    },

    // User routes
    "/users/dashboard": {
      en: "/users/dashboard",
      tr: "/kullanicilar/kontrol-paneli",
    },
  },
});

// Type exports for better TypeScript support
export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];
