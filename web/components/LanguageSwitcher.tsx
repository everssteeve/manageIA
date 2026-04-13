"use client";

import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { ThemeToggle } from "./ThemeToggle";

const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
  es: "ES",
};

interface Props {
  currentLang: Locale;
}

export function LanguageSwitcher({ currentLang }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (locale: Locale) => {
    // Replace the [lang] segment in the path
    const segments = pathname.split("/");
    segments[1] = locale;
    router.push(segments.join("/"));
  };

  return (
    <div className="flex items-center gap-1">
      <ThemeToggle />
      {(Object.keys(LOCALE_LABELS) as Locale[]).map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          className={`text-xs font-medium px-1.5 py-0.5 rounded transition-colors ${
            locale === currentLang
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
              : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          }`}
        >
          {LOCALE_LABELS[locale]}
        </button>
      ))}
    </div>
  );
}
