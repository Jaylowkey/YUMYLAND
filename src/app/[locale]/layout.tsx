import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/config";
import PWARegister from "@/components/PWARegister";
import SessionProvider from "@/components/SessionProvider";
import ToastProvider from "@/components/ui/ToastProvider";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata = {
  title: "YumyLand - Gestão inteligente para o seu negócio",
  description:
    "Plataforma SaaS completa para gestão de lanchonetes, restaurantes, cafés e pastelarias em Moçambique. Cardapio digital, reservas online, fidelidade de clientes e muito mais.",
  manifest: "/manifest.json",
  themeColor: "#f97316",
  keywords: ["restaurante", "gestao", "cardapio digital", "reservas", "mozambique", "SaaS", "YumyLand"],
  authors: [{ name: "YumyLand" }],
  openGraph: {
    title: "YumyLand - Gestão inteligente para o seu negócio",
    description: "Plataforma SaaS completa para gestão de lanchonetes, restaurantes, cafés e pastelarias em Moçambique.",
    siteName: "YumyLand",
    type: "website",
    locale: "pt_MZ",
  },
  twitter: {
    card: "summary_large_image",
    title: "YumyLand - Gestão inteligente para o seu negócio",
    description: "Plataforma SaaS completa para gestão de lanchonetes, restaurantes, cafés e pastelarias em Moçambique.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f97316" />
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
      </head>
      <body className={inter.className}>
        <SessionProvider>
          <NextIntlClientProvider messages={messages}>
            <ToastProvider>
              {children}
            </ToastProvider>
          </NextIntlClientProvider>
        </SessionProvider>
        <PWARegister />
      </body>
    </html>
  );
}
