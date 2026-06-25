"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const plans = ["basic", "professional", "premium"] as const;

export default function PricingSection() {
  const t = useTranslations("landing.pricing");
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
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const cards = sectionRef.current?.querySelectorAll(".reveal-on-scroll");
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="pricing" className="py-20" aria-label="Pricing plans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={sectionRef}>
        {/* Header */}
        <div className="text-center mb-16 reveal-on-scroll">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-lg text-gray-600">{t("subtitle")}</p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {plans.map((plan, index) => {
            const isProfessional = plan === "professional";
            const features = t.raw(`${plan}.features`) as string[];

            return (
              <div
                key={plan}
                className={cn(
                  "reveal-on-scroll relative rounded-2xl border p-8 transition-all plan-card-hover",
                  isProfessional
                    ? "border-primary-500 bg-white shadow-xl scale-105 z-10"
                    : "border-gray-200 bg-white shadow-sm hover:shadow-md"
                )}
                style={{ transitionDelay: `${index * 0.15}s` }}
                role="article"
                aria-label={`${t(`${plan}.name`)} plan - ${t(`${plan}.price`)} ${t("currency")}${t("monthly")}`}
              >
                {isProfessional && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-primary-500 px-4 py-1 text-xs font-semibold text-white">
                      {t("popular")}
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">{t(`${plan}.name`)}</h3>
                  <div className="mt-4 flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-gray-900">{t(`${plan}.price`)}</span>
                    <span className="text-sm text-gray-500">{t("currency")}{t("monthly")}</span>
                  </div>
                </div>

                <ul className="mt-8 space-y-3" aria-label={`Features for ${t(`${plan}.name`)} plan`}>
                  {features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg
                        className={cn("h-5 w-5 shrink-0", isProfessional ? "text-primary-500" : "text-green-500")}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/${locale}/register`}
                  className={cn(
                    "mt-8 block w-full rounded-lg py-3 text-center text-sm font-semibold transition-all",
                    isProfessional
                      ? "bg-primary-500 text-white hover:bg-primary-600 shadow-sm"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  )}
                  aria-label={`${t("cta")} - ${t(`${plan}.name`)} plan`}
                >
                  {t("cta")}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
