"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CTASection() {
  const t = useTranslations("landing.cta");
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "pt";

  return (
    <section className="py-20 bg-gradient-to-br from-primary-500 to-primary-700">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">{t("title")}</h2>
        <p className="mt-4 text-lg text-primary-100">{t("subtitle")}</p>
        <Link
          href={`/${locale}/register`}
          className="mt-8 inline-flex items-center rounded-lg bg-white px-8 py-4 text-base font-semibold text-primary-600 shadow-lg hover:bg-gray-50 transition-all"
        >
          {t("button")} →
        </Link>
      </div>
    </section>
  );
}
