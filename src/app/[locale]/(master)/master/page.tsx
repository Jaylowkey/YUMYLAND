"use client";

import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils";

const stats = [
  { key: "totalCompanies", value: 234, icon: "🏢", trend: "+12 este mês" },
  { key: "totalCustomers", value: 5847, icon: "👥", trend: "+342 este mês" },
  { key: "monthlyRevenue", value: 485000, icon: "💰", trend: "+18% vs mês anterior", isCurrency: true },
  { key: "activeSubscriptions", value: 198, icon: "✅", trend: "84% do total" },
];

const recentActivity = [
  { type: "new_company", message: "Nova empresa: Café Maputo", time: "Há 2h" },
  { type: "payment", message: "Pagamento recebido: Restaurante Sol - 999 MZN", time: "Há 3h" },
  { type: "upgrade", message: "Upgrade: Lanchonete ABC → Profissional", time: "Há 5h" },
  { type: "new_company", message: "Nova empresa: Pastelaria Rosa", time: "Há 6h" },
  { type: "payment", message: "Pagamento recebido: Bar Central - 1.999 MZN", time: "Há 8h" },
  { type: "suspended", message: "Suspensa: Pizzaria do Bairro (pagamento atrasado)", time: "Há 1d" },
];

const planDistribution = [
  { plan: "Básico", count: 89, percentage: 38, color: "bg-blue-500" },
  { plan: "Profissional", count: 97, percentage: 41, color: "bg-primary-500" },
  { plan: "Premium", count: 48, percentage: 21, color: "bg-purple-500" },
];

const revenueByMethod = [
  { method: "M-Pesa", amount: 245000, percentage: 50, icon: "📱" },
  { method: "e-Mola", amount: 125000, percentage: 26, icon: "💳" },
  { method: "Visa/Mastercard", amount: 115000, percentage: 24, icon: "💳" },
];

export default function MasterDashboard() {
  const t = useTranslations("master");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
        <p className="text-sm text-gray-400">Visão geral da plataforma YumyLand</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.key} className="rounded-xl border border-gray-800 bg-gray-800/50 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-400">{t(stat.key)}</span>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-white">
                {stat.isCurrency ? formatCurrency(stat.value) : stat.value.toLocaleString()}
              </span>
            </div>
            <p className="mt-1 text-xs text-green-400">{stat.trend}</p>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plan Distribution */}
        <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Distribuição de Planos</h2>
          <div className="space-y-4">
            {planDistribution.map((plan) => (
              <div key={plan.plan}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-300">{plan.plan}</span>
                  <span className="text-sm font-medium text-white">{plan.count} ({plan.percentage}%)</span>
                </div>
                <div className="h-2 rounded-full bg-gray-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${plan.color}`}
                    style={{ width: `${plan.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by Payment Method */}
        <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Receita por Método</h2>
          <div className="space-y-3">
            {revenueByMethod.map((item) => (
              <div key={item.method} className="flex items-center justify-between rounded-lg bg-gray-700/50 p-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{item.method}</p>
                    <p className="text-xs text-gray-400">{item.percentage}% do total</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-white">{formatCurrency(item.amount)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Atividade Recente</h2>
          <div className="space-y-3">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${
                  activity.type === "new_company" ? "bg-green-400" :
                  activity.type === "payment" ? "bg-blue-400" :
                  activity.type === "upgrade" ? "bg-purple-400" :
                  "bg-red-400"
                }`} />
                <div className="min-w-0">
                  <p className="text-sm text-gray-300 truncate">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
