import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { Locale } from "@/lib/i18n";

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher currentLang={lang as Locale} />
      </div>
      <main className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            {dict.home.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-lg mx-auto">
            {dict.home.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="text-2xl mb-2">📚</div>
            <h3 className="font-semibold text-gray-900 mb-1">{dict.home.learningPath.title}</h3>
            <p className="text-sm text-gray-600">{dict.home.learningPath.description}</p>
          </div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="text-2xl mb-2">🤖</div>
            <h3 className="font-semibold text-gray-900 mb-1">{dict.home.aiCoach.title}</h3>
            <p className="text-sm text-gray-600">{dict.home.aiCoach.description}</p>
          </div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="text-2xl mb-2">📈</div>
            <h3 className="font-semibold text-gray-900 mb-1">{dict.home.progressTracking.title}</h3>
            <p className="text-sm text-gray-600">{dict.home.progressTracking.description}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`/${lang}/auth/signin`}
            className="inline-flex items-center justify-center h-11 px-8 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            {dict.home.getStarted}
          </Link>
          <Link
            href={`/${lang}/dashboard`}
            className="inline-flex items-center justify-center h-11 px-8 rounded-md border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            {dict.home.dashboard}
          </Link>
        </div>
      </main>
    </div>
  );
}
