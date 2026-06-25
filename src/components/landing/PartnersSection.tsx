"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Company {
  id: string;
  name: string;
  type: string;
  slug: string;
  logo: string | null;
  plan?: string;
}

const typeIcons: Record<string, string> = {
  restaurant: "🍽️",
  snackbar: "🍔",
  cafe: "☕",
  bakery: "🥐",
  pizzeria: "🍕",
  bar: "🍸",
  foodtruck: "🚚",
};

const typeLabels: Record<string, string> = {
  restaurant: "Restaurante",
  snackbar: "Lanchonete",
  cafe: "Café",
  bakery: "Pastelaria",
  pizzeria: "Pizzaria",
  bar: "Bar",
  foodtruck: "Food Truck",
};

export default function PartnersSection() {
  const pathname = usePathname();
  const locale = pathname?.startsWith("/en") ? "en" : "pt";
  const [premium, setPremium] = useState<Company[]>([]);
  const [partners, setPartners] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await fetch("/api/public/companies?plan=premium&limit=6");
        if (res.ok) {
          const data = await res.json();
          setPremium(data.premium || []);
          setPartners(data.partners || []);
        }
      } catch (err) {
        // Silently fail - landing page still works without dynamic data
      } finally {
        setLoading(false);
      }
    }
    fetchCompanies();
  }, []);

  // Fallback premium companies if DB is empty or API fails
  const displayPremium = premium.length > 0 ? premium : [
    { id: "1", name: "Restaurante Tropical", type: "restaurant", slug: "restaurante-tropical", logo: null },
    { id: "2", name: "Pizza Beira", type: "pizzeria", slug: "pizza-beira", logo: null },
    { id: "3", name: "Bar Central", type: "bar", slug: "bar-central", logo: null },
  ];

  const displayPartners = partners.length > 0 ? partners : [
    { id: "1", name: "Restaurante Tropical", type: "restaurant", slug: "restaurante-tropical", logo: null, plan: "premium" },
    { id: "2", name: "Cafe Maputo", type: "cafe", slug: "cafe-maputo", logo: null, plan: "basic" },
    { id: "3", name: "Pizza Beira", type: "pizzeria", slug: "pizza-beira", logo: null, plan: "premium" },
    { id: "4", name: "Lanchonete Express", type: "snackbar", slug: "lanchonete-express", logo: null, plan: "professional" },
    { id: "5", name: "Pastelaria Rosa", type: "bakery", slug: "pastelaria-rosa", logo: null, plan: "basic" },
    { id: "6", name: "Bar do Oceano", type: "bar", slug: "bar-oceano", logo: null, plan: "professional" },
  ];

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Premium Companies Showcase */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-100 to-primary-100 px-4 py-1.5 text-sm font-medium text-purple-700 mb-4">
            <span className="text-lg">💎</span>
            {locale === "pt" ? "Empresas Premium" : "Premium Businesses"}
          </div>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {locale === "pt" ? "Destaque para membros Premium" : "Spotlight on Premium Members"}
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            {locale === "pt"
              ? "Empresas que investem na melhor experiência para seus clientes. Plano Premium inclui destaque na landing page!"
              : "Businesses investing in the best experience for their customers. Premium plan includes landing page spotlight!"}
          </p>
        </div>

        {/* Premium Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {displayPremium.map((company) => (
            <Link
              key={company.id}
              href={`/${locale}/menu/${company.slug}`}
              className="group relative rounded-2xl border-2 border-purple-100 bg-gradient-to-br from-white to-purple-50/30 p-6 transition-all hover:border-purple-300 hover:shadow-xl hover:shadow-purple-100/50 hover:-translate-y-1"
            >
              {/* Premium badge */}
              <div className="absolute -top-3 right-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-500 to-primary-500 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider shadow-lg">
                  💎 Premium
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Logo/Icon */}
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-100 to-primary-100 flex items-center justify-center text-3xl shadow-inner">
                  {typeIcons[company.type] || "🍽️"}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-lg truncate group-hover:text-purple-700 transition-colors">
                    {company.name}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <span className="text-base">{typeIcons[company.type]}</span>
                    {typeLabels[company.type] || company.type}
                  </p>
                </div>
              </div>

              {/* Benefit callout */}
              <div className="mt-4 rounded-lg bg-purple-50 p-3 border border-purple-100">
                <p className="text-xs text-purple-700 font-medium flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {locale === "pt" ? "Visibilidade extra na plataforma" : "Extra visibility on platform"}
                </p>
              </div>

              {/* View menu link */}
              <div className="mt-4 text-sm font-semibold text-purple-600 group-hover:text-purple-700 flex items-center gap-1">
                {locale === "pt" ? "Ver Cardápio" : "View Menu"} →
              </div>
            </Link>
          ))}
        </div>

        {/* Partners Carousel */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-gray-900">
            {locale === "pt" ? "Empresas Parceiras" : "Partner Businesses"}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {locale === "pt"
              ? "Junte-se a dezenas de empresas que já confiam na YumyLand"
              : "Join dozens of businesses that already trust YumyLand"}
          </p>
        </div>

        {/* Infinite scroll carousel */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />

          <div className="flex animate-scroll gap-6 overflow-hidden">
            {[...displayPartners, ...displayPartners].map((company, idx) => (
              <div
                key={`${company.id}-${idx}`}
                className="shrink-0 flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-xl">
                  {typeIcons[company.type] || "🍽️"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">{company.name}</p>
                  <p className="text-[11px] text-gray-400">{typeLabels[company.type] || company.type}</p>
                </div>
                {company.plan === "premium" && (
                  <span className="text-xs">💎</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Carousel animation CSS */}
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
