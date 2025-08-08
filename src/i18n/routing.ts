import { defineRouting } from "next-intl/routing";
import {
  defaultLocale,
  locales,
  pathnames,
  prefixes,
} from "./routing.generated";

type LocaleTuple = [string, ...string[]];
type PathnamesType = Record<string, string | Record<string, string>>;

export const routing = defineRouting({
  locales: locales as unknown as LocaleTuple,
  defaultLocale: defaultLocale,
  localePrefix: { mode: "as-needed", prefixes },
  pathnames: pathnames as unknown as PathnamesType,
});

// Type exports for better TypeScript support
export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];
