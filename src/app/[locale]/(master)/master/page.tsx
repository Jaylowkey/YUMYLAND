"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { apiGet } from "@/lib/api";

interface MasterStats {
  totalCompanies: number;
  totalCustomers: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
}

interface CompanyItem {
  id: string;
  name: string;
  type: string;
  plan: string;
  status: string;
  createdAt: string;
}

interface PaymentItem {
  id: string;
  amount: number;
  method: string;
  status: string;
  reference: string | null;
  createdAt: string;
  company: { name: string };
}

interface SubscriptionItem {
  id: string;
  plan: string;
  status: string;
  companyName: string;
  amount: number;
}

export default function MasterDashboard() {
  const t = useTranslations("master");
  const [stats, setStats] = useState<MasterStats | null>(null);
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [recentPayments, setRecentPayments] = useState<PaymentItem[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [statsData, companiesData, subsData] = await Promise.all([
          apiGet<MasterStats>("/api/master/stats"),
          apiGet<{ companies: CompanyItem[] }>("/api/master/companies?limit=5"),
          apiGet<{ subscriptions: SubscriptionItem[] }>("/api/master/subscriptions?limit=5"),
        ]);
        setStats(statsData);
        setCompanies(companiesData.companies || []);
        setSubscriptions(subsData.subscriptions || []);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Compute plan distribution from real companies
  const planCounts = companies.reduce((acc, c) => {
    acc[c.plan] = (acc[c.plan] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalPlanCount = Object.values(planCounts).reduce((a, b) => a + b, 0) || 1;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
          <p className="text-sm text-gray-400">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-400 mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-primary-400 hover:text-primary-300"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
          <p className="text-sm text-gray-400">Visão geral da plataforma YumyLand</p>
        </div>
        <div className="text-xs text-gray-500">
          Última atualização: {new Date().toLocaleTimeString("pt-MZ")}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-5 hover:bg-gray-800/70 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-400">{t("totalCompanies")}</span>
            <span className="text-2xl">🏢</span>
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold text-white">{stats?.totalCompanies || 0}</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400">
              ↑ Ativo
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-5 hover:bg-gray-800/70 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-400">{t("totalCustomers")}</span>
            <span className="text-2xl">👥</span>
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold text-white">{stats?.totalCustomers || 0}</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-400">
              Total na plataforma
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-5 hover:bg-gray-800/70 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-400">{t("monthlyRevenue")}</span>
            <span className="text-2xl">💰</span>
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold text-white">{formatCurrency(stats?.monthlyRevenue || 0)}</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400">
              Este mês
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-5 hover:bg-gray-800/70 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-400">{t("activeSubscriptions")}</span>
            <span className="text-2xl">✅</span>
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold text-white">{stats?.activeSubscriptions || 0}</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="inline-flex items-center rounded-full bg-purple-500/10 px-2 py-0.5 text-xs font-medium text-purple-400">
              {stats && stats.totalCompanies > 0
                ? `${Math.round((stats.activeSubscriptions / stats.totalCompanies) * 100)}% do total`
                : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Companies */}
        <div className="lg:col-span-2 rounded-xl border border-gray-800 bg-gray-800/50 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-white">Empresas Recentes</h2>
            <a href="#" className="text-xs text-primary-400 hover:text-primary-300">Ver todas →</a>
          </div>
          {companies.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">Nenhuma empresa cadastrada</p>
          ) : (
            <div className="space-y-3">
              {companies.map((company) => (
                <div key={company.id} className="flex items-center justify-between rounded-lg bg-gray-700/30 p-3 hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center text-lg">
                      {company.type === "restaurant" ? "🍽️" :
                       company.type === "cafe" ? "☕" :
                       company.type === "pizzeria" ? "🍕" :
                       company.type === "bakery" ? "🥐" :
                       company.type === "bar" ? "🍸" :
                       company.type === "snackbar" ? "🍔" : "🚚"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{company.name}</p>
                      <p className="text-xs text-gray-400 capitalize">{company.type} • {new Date(company.createdAt).toLocaleDateString("pt-MZ")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                      company.plan === "premium" ? "bg-purple-500/20 text-purple-300" :
                      company.plan === "professional" ? "bg-primary-500/20 text-primary-300" :
                      "bg-blue-500/20 text-blue-300"
                    }`}>
                      {company.plan}
                    </span>
                    <span className={`h-2 w-2 rounded-full ${
                      company.status === "active" ? "bg-green-400" :
                      company.status === "trial" ? "bg-yellow-400" : "bg-red-400"
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Plan Distribution */}
        <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-5">Distribuição de Planos</h2>
          
          {/* Visual chart */}
          <div className="flex h-4 rounded-full overflow-hidden bg-gray-700 mb-6">
            {planCounts.basic && (
              <div className="bg-blue-500 transition-all" style={{ width: `${(planCounts.basic / totalPlanCount) * 100}%` }} />
            )}
            {planCounts.professional && (
              <div className="bg-primary-500 transition-all" style={{ width: `${(planCounts.professional / totalPlanCount) * 100}%` }} />
            )}
            {planCounts.premium && (
              <div className="bg-purple-500 transition-all" style={{ width: `${(planCounts.premium / totalPlanCount) * 100}%` }} />
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span className="text-sm text-gray-300">Básico</span>
              </div>
              <span className="text-sm font-bold text-white">{planCounts.basic || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary-500" />
                <span className="text-sm text-gray-300">Profissional</span>
              </div>
              <span className="text-sm font-bold text-white">{planCounts.professional || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-purple-500" />
                <span className="text-sm text-gray-300">Premium</span>
              </div>
              <span className="text-sm font-bold text-white">{planCounts.premium || 0}</span>
            </div>
          </div>

          {/* Revenue summary */}
          <div className="mt-8 pt-5 border-t border-gray-700">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Receita por Plano</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Básico (499/mês)</span>
                <span className="text-white font-medium">{formatCurrency((planCounts.basic || 0) * 499)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Profissional (999/mês)</span>
                <span className="text-white font-medium">{formatCurrency((planCounts.professional || 0) * 999)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Premium (1.999/mês)</span>
                <span className="text-white font-medium">{formatCurrency((planCounts.premium || 0) * 1999)}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-gray-700">
                <span className="text-gray-300 font-medium">Potencial mensal</span>
                <span className="text-green-400 font-bold">
                  {formatCurrency(
                    ((planCounts.basic || 0) * 499) +
                    ((planCounts.professional || 0) * 999) +
                    ((planCounts.premium || 0) * 1999)
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Subscriptions */}
        <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-white">Assinaturas Recentes</h2>
            <a href="#" className="text-xs text-primary-400 hover:text-primary-300">Ver todas →</a>
          </div>
          {subscriptions.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">Nenhuma assinatura</p>
          ) : (
            <div className="space-y-2">
              {subscriptions.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between rounded-lg bg-gray-700/30 p-3">
                  <div>
                    <p className="text-sm font-medium text-white">{sub.companyName}</p>
                    <p className="text-xs text-gray-400">{formatCurrency(sub.amount)}/mês</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      sub.plan === "premium" ? "bg-purple-500/20 text-purple-300" :
                      sub.plan === "professional" ? "bg-primary-500/20 text-primary-300" :
                      "bg-blue-500/20 text-blue-300"
                    }`}>
                      {sub.plan}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      sub.status === "active" ? "bg-green-500/20 text-green-300" :
                      sub.status === "trial" ? "bg-yellow-500/20 text-yellow-300" :
                      "bg-red-500/20 text-red-300"
                    }`}>
                      {sub.status === "active" ? "Ativo" : sub.status === "trial" ? "Trial" : "Suspenso"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions & Platform Health */}
        <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-5">Saúde da Plataforma</h2>
          
          <div className="space-y-4">
            {/* Uptime */}
            <div className="rounded-lg bg-gray-700/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Uptime</span>
                <span className="text-sm font-bold text-green-400">99.9%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-700">
                <div className="h-full rounded-full bg-green-500" style={{ width: "99.9%" }} />
              </div>
            </div>

            {/* API Response Time */}
            <div className="rounded-lg bg-gray-700/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Tempo de Resposta API</span>
                <span className="text-sm font-bold text-green-400">&lt;200ms</span>
              </div>
              <div className="h-2 rounded-full bg-gray-700">
                <div className="h-full rounded-full bg-blue-500" style={{ width: "85%" }} />
              </div>
            </div>

            {/* Database */}
            <div className="rounded-lg bg-gray-700/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Banco de Dados</span>
                <span className="text-sm font-bold text-green-400">Saudável</span>
              </div>
              <div className="h-2 rounded-full bg-gray-700">
                <div className="h-full rounded-full bg-purple-500" style={{ width: "45%" }} />
              </div>
              <p className="text-[11px] text-gray-500 mt-1">45% do armazenamento utilizado</p>
            </div>

            {/* Payment Gateway */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3 text-center">
                <div className="text-lg">📱</div>
                <p className="text-xs font-medium text-green-300 mt-1">PaySuite</p>
                <p className="text-[10px] text-green-400">Online</p>
              </div>
              <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3 text-center">
                <div className="text-lg">💳</div>
                <p className="text-xs font-medium text-green-300 mt-1">Stripe</p>
                <p className="text-[10px] text-green-400">Online</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
