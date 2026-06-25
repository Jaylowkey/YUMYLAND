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

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await fetch("/api/public/companies?plan=premium&limit=6");
        if (res.ok) {
          const data = await res.json();
          setPremium(data.premium || []);
          setPartners(data.partners || []);
        }
      } catch {
        // Silently fail
      }
    }
    fetchCompanies();
  }, []);

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
    { id: "7", name: "Churrasqueira Sol", type: "restaurant", slug: "churrasqueira-sol", logo: null, plan: "professional" },
    { id: "8", name: "Gelataria Fria", type: "cafe", slug: "gelataria-fria", logo: null, plan: "basic" },
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {displayPremium.map((company) => (
            <Link
              key={company.id}
              href={`/${locale}/menu/${company.slug}`}
              className="group relative rounded-2xl border-2 border-purple-100 bg-gradient-to-br from-white to-purple-50/30 p-6 transition-all hover:border-purple-300 hover:shadow-xl hover:shadow-purple-100/50 hover:-translate-y-1"
            >
              <div className="absolute -top-3 right-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-500 to-primary-500 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider shadow-lg">
                  💎 Premium
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-100 to-primary-100 flex items-center justify-center text-3xl shadow-inner">
                  {typeIcons[company.type] || "🍽️"}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-lg truncate group-hover:text-purple-700 transition-colors">
                    {company.name}
                  </h3>
                  <p className="text-sm text-gray-500">{typeLabels[company.type] || company.type}</p>
                </div>
              </div>
              <div className="mt-4 rounded-lg bg-purple-50 p-3 border border-purple-100">
                <p className="text-xs text-purple-700 font-medium flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {locale === "pt" ? "Visibilidade extra na plataforma" : "Extra visibility on platform"}
                </p>
              </div>
              <div className="mt-4 text-sm font-semibold text-purple-600 group-hover:text-purple-700 flex items-center gap-1">
                {locale === "pt" ? "Ver Cardápio" : "View Menu"} →
              </div>
            </Link>
          ))}
        </div>

        {/* Partners Logos Carousel - ONLY LOGOS */}
        <div className="text-center mb-10">
          <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">
            {locale === "pt" ? "Empresas que confiam na YumyLand" : "Businesses that trust YumyLand"}
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />

          <div className="flex animate-scroll gap-12 items-center">
            {[...displayPartners, ...displayPartners, ...displayPartners].map((company, idx) => (
              <div
                key={`${company.id}-${idx}`}
                className="shrink-0 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
              >
                {company.logo ? (
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="h-10 w-auto max-w-[120px] object-contain"
                  />
                ) : (
                  /* Text-based logo when no image */
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-lg font-bold text-gray-600">
                      {company.name.charAt(0)}
                    </div>
                    <span className="text-sm font-bold text-gray-500 whitespace-nowrap">
                      {company.name}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-scroll {
          animation: scroll 25s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
