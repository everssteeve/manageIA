import "server-only";

import type { Locale } from "./i18n-config";

export type { Locale } from "./i18n-config";
export { LOCALES, DEFAULT_LOCALE, hasLocale } from "./i18n-config";

const dictionaries = {
  en: () =>
    import("./dictionaries/en.json").then((module) => module.default),
  fr: () =>
    import("./dictionaries/fr.json").then((module) => module.default),
  es: () =>
    import("./dictionaries/es.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale]();

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
