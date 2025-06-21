import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Desteklenen dillerin listesi
  locales: ["tr", "en"],

  // Hiçbir dil eşleşmediğinde kullanılacak varsayılan dil
  defaultLocale: "tr",
});
