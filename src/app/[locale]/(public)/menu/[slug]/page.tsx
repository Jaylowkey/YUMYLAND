"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

// Mock menu data for a restaurant
const menuCategories = [
  { id: "all", name: "Todos", icon: "🍽️" },
  { id: "burgers", name: "Hambúrgueres", icon: "🍔" },
  { id: "pizzas", name: "Pizzas", icon: "🍕" },
  { id: "drinks", name: "Bebidas", icon: "🥤" },
  { id: "desserts", name: "Sobremesas", icon: "🍰" },
  { id: "combos", name: "Combos", icon: "🍱" },
];

const menuItems = [
  {
    id: "1", name: "Hambúrguer Clássico", description: "Pão brioche, carne 150g, queijo cheddar, alface, tomate e molho especial",
    price: 350, category: "burgers", image: "🍔", available: true, isPromotion: false, isCombo: false,
  },
  {
    id: "2", name: "Hambúrguer Duplo", description: "Pão brioche, 2x carne 150g, queijo duplo, bacon crocante",
    price: 550, category: "burgers", image: "🍔", available: true, isPromotion: true, promotionPrice: 450, isCombo: false,
  },
  {
    id: "3", name: "Pizza Margherita", description: "Molho de tomate San Marzano, mozzarella fresca, manjericão",
    price: 650, category: "pizzas", image: "🍕", available: true, isPromotion: false, isCombo: false,
  },
  {
    id: "4", name: "Pizza 4 Queijos", description: "Mozzarella, gorgonzola, parmesão e provolone",
    price: 750, category: "pizzas", image: "🍕", available: true, isPromotion: false, isCombo: false,
  },
  {
    id: "5", name: "Refrigerante", description: "Coca-Cola, Fanta, Sprite - 350ml",
    price: 60, category: "drinks", image: "🥤", available: true, isPromotion: false, isCombo: false,
  },
  {
    id: "6", name: "Suco Natural", description: "Laranja, manga, maracujá ou abacaxi - 500ml",
    price: 120, category: "drinks", image: "🧃", available: true, isPromotion: false, isCombo: false,
  },
  {
    id: "7", name: "Pastel de Nata", description: "Pastel de nata tradicional com canela",
    price: 45, category: "desserts", image: "🍮", available: true, isPromotion: false, isCombo: false,
  },
  {
    id: "8", name: "Brownie com Sorvete", description: "Brownie de chocolate com sorvete de baunilha",
    price: 180, category: "desserts", image: "🍫", available: true, isPromotion: false, isCombo: false,
  },
  {
    id: "9", name: "Combo Família", description: "4x Hambúrguer + 4x Batata Frita + 4x Refrigerante",
    price: 1600, category: "combos", image: "🍱", available: true, isPromotion: true, promotionPrice: 1200, isCombo: true,
  },
  {
    id: "10", name: "Combo Casal", description: "2x Hambúrguer + 2x Batata + 2x Suco",
    price: 900, category: "combos", image: "🍱", available: true, isPromotion: true, promotionPrice: 750, isCombo: true,
  },
];

export default function MenuPage() {
  const t = useTranslations("menu");
  const tc = useTranslations("customers");
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "pt";
  const [activeCategory, setActiveCategory] = useState("all");
  const [showLoyaltyModal, setShowLoyaltyModal] = useState(false);

  const filteredItems = activeCategory === "all"
    ? menuItems
    : menuItems.filter((item) => item.category === activeCategory);

  const promotions = menuItems.filter((item) => item.isPromotion);
  const combos = menuItems.filter((item) => item.isCombo);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Lanchonete do João</h1>
              <p className="mt-1 text-primary-100">📍 Av. Eduardo Mondlane, Maputo</p>
              <p className="text-primary-100 text-sm">⏰ 08:00 - 22:00 • 📞 +258 84 000 0000</p>
            </div>
            <div className="hidden sm:flex flex-col gap-2">
              <Link
                href={`/${locale}/reserve/lanchonete-do-joao`}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-primary-600 hover:bg-gray-50 transition-colors"
              >
                📅 {t("reserve")}
              </Link>
              <button
                onClick={() => setShowLoyaltyModal(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-white/20 backdrop-blur px-4 py-2 text-sm font-semibold text-white hover:bg-white/30 transition-colors"
              >
                ⭐ {tc("becomeLoyal")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6">
        {/* Promotions Banner */}
        {promotions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              🔥 {t("promotions")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {promotions.map((item) => (
                <div key={item.id} className="rounded-xl border-2 border-red-100 bg-red-50 p-4 flex items-center gap-4">
                  <div className="text-4xl">{item.image}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-xs text-gray-500">{item.description}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-lg font-bold text-red-600">
                        {formatCurrency(item.promotionPrice || item.price)}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <div className="sticky top-0 z-20 bg-gray-50 py-3 -mx-4 px-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {menuCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  activeCategory === cat.id
                    ? "bg-primary-500 text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-primary-200 hover:text-primary-600"
                }`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image placeholder */}
              <div className="h-32 bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center text-5xl relative">
                {item.image}
                {item.isPromotion && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="danger">-{Math.round(((item.price - (item.promotionPrice || item.price)) / item.price) * 100)}%</Badge>
                  </div>
                )}
                {item.isCombo && (
                  <div className="absolute top-2 left-2">
                    <Badge variant="info">Combo</Badge>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    {item.isPromotion && item.promotionPrice ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg font-bold text-primary-600">{formatCurrency(item.promotionPrice)}</span>
                        <span className="text-xs text-gray-400 line-through">{formatCurrency(item.price)}</span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">{formatCurrency(item.price)}</span>
                    )}
                  </div>
                  <button className="rounded-lg bg-primary-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-600 transition-colors">
                    {t("addToOrder")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile sticky footer */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex gap-3">
          <Link
            href={`/${locale}/reserve/lanchonete-do-joao`}
            className="flex-1 btn-primary text-center text-sm"
          >
            📅 {t("reserve")}
          </Link>
          <button
            onClick={() => setShowLoyaltyModal(true)}
            className="flex-1 btn-secondary text-center text-sm"
          >
            ⭐ {tc("becomeLoyal")}
          </button>
        </div>
      </div>

      {/* Loyalty Modal */}
      {showLoyaltyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowLoyaltyModal(false)} />
          <div className="relative z-50 w-full max-w-md rounded-xl bg-white p-6 shadow-xl mx-4">
            <div className="text-center">
              <div className="text-5xl mb-4">⭐</div>
              <h2 className="text-xl font-bold text-gray-900">{tc("becomeLoyal")}</h2>
              <p className="mt-2 text-sm text-gray-600">{tc("loyaltyDescription")}</p>
              <div className="mt-6 grid grid-cols-4 gap-2">
                <div className="rounded-lg bg-orange-50 p-3 text-center">
                  <div className="text-xl">🥉</div>
                  <div className="text-xs font-medium text-gray-600 mt-1">{tc("levels.bronze")}</div>
                  <div className="text-[10px] text-gray-400">0+ pts</div>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <div className="text-xl">🥈</div>
                  <div className="text-xs font-medium text-gray-600 mt-1">{tc("levels.silver")}</div>
                  <div className="text-[10px] text-gray-400">200+ pts</div>
                </div>
                <div className="rounded-lg bg-yellow-50 p-3 text-center">
                  <div className="text-xl">🥇</div>
                  <div className="text-xs font-medium text-gray-600 mt-1">{tc("levels.gold")}</div>
                  <div className="text-[10px] text-gray-400">500+ pts</div>
                </div>
                <div className="rounded-lg bg-purple-50 p-3 text-center">
                  <div className="text-xl">💎</div>
                  <div className="text-xs font-medium text-gray-600 mt-1">{tc("levels.diamond")}</div>
                  <div className="text-[10px] text-gray-400">1000+ pts</div>
                </div>
              </div>
              <div className="mt-6 p-4 rounded-lg bg-gray-50 text-left text-sm text-gray-600">
                <p className="font-medium text-gray-900 mb-2">Como funciona:</p>
                <ul className="space-y-1.5">
                  <li>✅ Crie sua conta grátis</li>
                  <li>✅ Receba seu cartão digital</li>
                  <li>✅ Acumule pontos a cada compra</li>
                  <li>✅ 100 MZN = 1 ponto</li>
                  <li>✅ 100 pontos = 100 MZN de desconto</li>
                </ul>
              </div>
              <Button className="w-full mt-6" size="lg">
                Criar Conta Grátis
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
