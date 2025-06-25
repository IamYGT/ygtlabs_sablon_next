import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // Genellikle [locale] segmentine karşılık gelir
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const baseMessages = (await import(`../../messages/${locale}.json`)).default;
  const adminMessages = (
    await import(`../../messages/admin/admin_${locale}.json`)
  ).default;

  return {
    locale,
    messages: {
      ...baseMessages,
      ...adminMessages,
    },
  };
});
