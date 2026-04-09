import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { OnboardingClient } from "./OnboardingClient";
import type { Locale } from "@/lib/i18n";

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function OnboardingPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  return <OnboardingClient lang={lang as Locale} dict={dict.onboarding} />;
}
