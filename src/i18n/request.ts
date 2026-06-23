import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale } from "./config";

export default getRequestConfig(async ({ locale }) => {
  const validLocale = locales.includes(locale as any) ? locale : defaultLocale;
  
  return {
    messages: (await import(`../../messages/${validLocale}.json`)).default,
  };
});
