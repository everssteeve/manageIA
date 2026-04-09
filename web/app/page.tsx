import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/lib/i18n";

// Root redirects to the default locale — proxy.ts handles locale detection
// for real browser requests. This fallback ensures SSR consistency.
export default function RootPage() {
  redirect(`/${DEFAULT_LOCALE}`);
}
