import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Desteklenen dillerin listesi
  locales: ["en", "tr"],

  // Varsayılan dil English (/ dizini English olacak)
  defaultLocale: "en",

  // Locale prefix'i sadece default olmayan diller için göster
  localePrefix: "as-needed",
});
