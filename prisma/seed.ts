import prisma from "../lib/prisma";

async function main() {
  // Seed default languages if not present
  const defaults = [
    {
      code: "en",
      name: "English",
      nativeName: "English",
      isDefault: true,
      isActive: true,
      direction: "ltr",
      urlPrefix: null,
    },
    {
      code: "tr",
      name: "Turkish",
      nativeName: "Türkçe",
      isDefault: false,
      isActive: true,
      direction: "ltr",
      urlPrefix: "tr",
    },
  ];

  for (const lang of defaults) {
    await prisma.language.upsert({
      where: { code: lang.code },
      update: {
        name: lang.name,
        nativeName: lang.nativeName,
        isActive: lang.isActive,
        isDefault: lang.isDefault,
        direction: lang.direction,
        urlPrefix: lang.urlPrefix,
      },
      create: { ...lang },
    });
  }

  // Seed sample route translations
  const baseRoutes = [
    "/landing",
    "/landing/chiptuning",
    "/landing/corporate",
    "/landing/services",
    "/landing/onsite-service",
    "/landing/blog",
    "/landing/dealers",
    "/landing/contact",
    "/landing/dealership",
    "/landing/faq",
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/forbidden",
    "/auth/unauthorized",
    "/auth/error",
    "/admin/dashboard",
    "/admin/users",
    "/admin/roles",
    "/admin/permissions",
    "/admin/profile",
    "/customer/dashboard",
  ];

  for (const name of baseRoutes) {
    await prisma.i18nRoute.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  // Example translations (can be adjusted via admin UI later)
  const trTranslations: Record<string, string> = {
    "/landing": "/",
    "/landing/corporate": "/kurumsal",
    "/landing/services": "/hizmetler",
    "/landing/onsite-service": "/yerinde-hizmet",
    "/landing/dealers": "/bayiler",
    "/landing/contact": "/iletisim",
    "/landing/dealership": "/bayilik-basvurusu",
    "/landing/faq": "/sss",
    "/auth/login": "/giris",
    "/auth/register": "/kayit-ol",
    "/auth/forgot-password": "/sifremi-unuttum",
    "/auth/forbidden": "/erisim-engellendi",
    "/auth/unauthorized": "/yetkisiz",
    "/auth/error": "/hata",
    "/admin/dashboard": "/admin/panel",
    "/admin/users": "/admin/kullanicilar",
    "/admin/roles": "/admin/roller",
    "/admin/permissions": "/admin/yetkiler",
    "/admin/profile": "/admin/profil",
    "/customer/dashboard": "/musteri/panel",
  };

  for (const [routeName, path] of Object.entries(trTranslations)) {
    await prisma.i18nRouteTranslation.upsert({
      where: { routeName_localeCode: { routeName, localeCode: "tr" } },
      update: { path },
      create: { routeName, localeCode: "tr", path },
    });
  }

  // English clean root paths for landing (default locale)
  const enTranslations: Record<string, string> = {
    "/landing": "/",
    "/landing/chiptuning": "/chiptuning",
    "/landing/corporate": "/corporate",
    "/landing/services": "/services",
    "/landing/onsite-service": "/onsite-service",
    "/landing/blog": "/blog",
    "/landing/dealers": "/dealers",
    "/landing/contact": "/contact",
    "/landing/dealership": "/dealership",
    "/landing/faq": "/faq",
  };
  for (const [routeName, path] of Object.entries(enTranslations)) {
    await prisma.i18nRouteTranslation.upsert({
      where: { routeName_localeCode: { routeName, localeCode: "en" } },
      update: { path },
      create: { routeName, localeCode: "en", path },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
