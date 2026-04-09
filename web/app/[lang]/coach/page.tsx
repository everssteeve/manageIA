import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { CoachClient } from "./CoachClient";
import type { Locale } from "@/lib/i18n";

interface Props {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ session?: string }>;
}

export default async function CoachPage({ params, searchParams }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { session } = await searchParams;
  const dict = await getDictionary(lang as Locale);

  return (
    <CoachClient
      lang={lang as Locale}
      dict={dict.coach}
      initialSessionId={session}
    />
  );
}
