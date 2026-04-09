import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { Providers } from "./providers";
import { DEFAULT_LOCALE } from "@/lib/i18n";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Manager AI Coach",
  description: "Navigate your transition to AI-augmented work",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const lang = headersList.get("x-locale") ?? DEFAULT_LOCALE;

  return (
    <html lang={lang} className="h-full antialiased">
      <body className={`${inter.className} min-h-full bg-background text-foreground`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
