// src/i18n/config.ts
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Define the supported locales
export const locales = ['fr', 'en'];

// Define the default locale
export const defaultLocale = 'fr';

// Define the routing configuration
export const routing = {
  locales,
  defaultLocale,
  localeDetection: true
};

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming locale is supported
  if (!locales.includes(locale as any)) {
    notFound();
  }

  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});