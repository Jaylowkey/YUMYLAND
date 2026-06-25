"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function CTASection() {
  const t = useTranslations("landing.cta");
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "pt";
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.2 }
    );

    const elements = sectionRef.current?.querySelectorAll(".reveal-on-scroll");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-primary-500 to-primary-700" aria-label="Call to action">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center" ref={sectionRef}>
        <h2 className="reveal-on-scroll text-3xl font-bold text-white sm:text-4xl">{t("title")}</h2>
        <p className="reveal-on-scroll mt-4 text-lg text-primary-100">{t("subtitle")}</p>
        <Link
          href={`/${locale}/register`}
          className="reveal-on-scroll mt-8 inline-flex items-center rounded-lg bg-white px-8 py-4 text-base font-semibold text-primary-600 shadow-lg hover:bg-gray-50 transition-all animate-pulseGlow"
          aria-label={`${t("button")} - Comece agora gratuitamente`}
        >
          {t("button")} →
        </Link>
      </div>
    </section>
  );
}
