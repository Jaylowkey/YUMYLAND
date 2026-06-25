"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HeroSection() {
  const t = useTranslations("landing.hero");
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "pt";

  return (
    <section className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24" aria-label="Hero">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-100 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge - stagger 1 */}
          <div className="animate-stagger-1 mb-6 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700">
            <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse" aria-hidden="true" />
            SaaS #1 para Restaurantes em Moçambique
          </div>

          {/* Title - stagger 2 */}
          <h1 className="animate-stagger-2 mx-auto max-w-4xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            {t("title")}
          </h1>

          {/* Subtitle - stagger 3 */}
          <p className="animate-stagger-3 mx-auto mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl">
            {t("subtitle")}
          </p>

          {/* CTAs - stagger 4 */}
          <div className="animate-stagger-4 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/${locale}/register`}
              className="btn-primary text-base px-8 py-4 w-full sm:w-auto"
              aria-label={`${t("cta")} - Criar conta gratuita`}
            >
              {t("cta")} →
            </Link>
            <a
              href="#features"
              className="btn-secondary text-base px-8 py-4 w-full sm:w-auto"
              aria-label={`${t("ctaSecondary")} - Ver funcionalidades`}
            >
              {t("ctaSecondary")}
            </a>
          </div>

          {/* Social proof */}
          <div className="animate-stagger-4 mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-white bg-gradient-to-br from-primary-300 to-primary-500"
                  />
                ))}
              </div>
              <span>+200 empresas</span>
            </div>
            <div className="flex items-center gap-1" aria-label="Avaliacao 4.9 de 5 estrelas">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-1">4.9/5 avaliação</span>
            </div>
          </div>

          {/* Hero Image Placeholder with floating animation */}
          <div className="mt-16 mx-auto max-w-5xl animate-stagger-4">
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-b from-gray-50 to-white p-2 shadow-2xl shadow-gray-200/50">
              <div className="rounded-xl bg-white border border-gray-100 overflow-hidden">
                <div className="bg-gray-800 px-4 py-2 flex items-center gap-2" aria-hidden="true">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 text-center">
                    <div className="inline-flex items-center rounded bg-gray-700 px-3 py-0.5 text-xs text-gray-300">
                      app.yumyland.co.mz/dashboard
                    </div>
                  </div>
                </div>
                <div className="p-8 bg-gradient-to-br from-orange-50 to-yellow-50 min-h-[300px] flex items-center justify-center">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-lg" aria-label="Dashboard preview statistics">
                    <div className="animate-float bg-white rounded-lg p-4 shadow-sm text-center" style={{ animationDelay: "0s" }}>
                      <div className="text-2xl font-bold text-primary-500">156</div>
                      <div className="text-xs text-gray-500 mt-1">Vendas</div>
                    </div>
                    <div className="animate-float bg-white rounded-lg p-4 shadow-sm text-center" style={{ animationDelay: "0.5s" }}>
                      <div className="text-2xl font-bold text-green-500">24</div>
                      <div className="text-xs text-gray-500 mt-1">Reservas</div>
                    </div>
                    <div className="animate-float bg-white rounded-lg p-4 shadow-sm text-center" style={{ animationDelay: "1s" }}>
                      <div className="text-2xl font-bold text-blue-500">89</div>
                      <div className="text-xs text-gray-500 mt-1">Clientes</div>
                    </div>
                    <div className="animate-float bg-white rounded-lg p-4 shadow-sm text-center" style={{ animationDelay: "1.5s" }}>
                      <div className="text-2xl font-bold text-purple-500">45K</div>
                      <div className="text-xs text-gray-500 mt-1">MZN</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
