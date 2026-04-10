// Edge-safe locale config — no server-only imports, safe to use in middleware.
// Keep in sync with lib/i18n.ts

export type Locale = "en" | "fr" | "es";

export const LOCALES: Locale[] = ["en", "fr", "es"];
export const DEFAULT_LOCALE: Locale = "en";

export const hasLocale = (locale: string): locale is Locale =>
  LOCALES.includes(locale as Locale);
