import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // Genellikle [locale] segmentine karşılık gelir
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const baseMessages = await (async () => {
    try {
      return (await import(`../../messages/${locale}.json`)).default;
    } catch {
      return (await import(`../../messages/${routing.defaultLocale}.json`))
        .default;
    }
  })();
  const adminMessages = await (async () => {
    try {
      return (await import(`../../messages/admin/admin_${locale}.json`))
        .default;
    } catch {
      return (
        await import(`../../messages/admin/admin_${routing.defaultLocale}.json`)
      ).default;
    }
  })();
  const authMessages = await (async () => {
    try {
      return (await import(`../../messages/auth/auth_${locale}.json`)).default;
    } catch {
      return (
        await import(`../../messages/auth/auth_${routing.defaultLocale}.json`)
      ).default;
    }
  })();

  return {
    locale,
    messages: {
      ...baseMessages,
      ...adminMessages,
      ...authMessages,
    },
  };
});
