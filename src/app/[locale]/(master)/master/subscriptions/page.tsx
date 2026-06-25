"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";
import { Subscription } from "@/types";
import { apiGet, apiPatch } from "@/lib/api";

const methodLabels: Record<string, string> = {
  mpesa: "M-Pesa", emola: "e-Mola", visa: "Visa", mastercard: "Mastercard",
};

export default function MasterSubscriptionsPage() {
  const t = useTranslations("master");
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await apiGet<any>("/api/master/subscriptions");
      setSubscriptions(data.subscriptions || data || []);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const filtered = filter === "all"
    ? subscriptions
    : subscriptions.filter((s) => s.status === filter);

  const updateStatus = async (id: string, status: Subscription["status"]) => {
    try {
      await apiPatch(`/api/master/subscriptions/${id}`, { status });
      await fetchSubscriptions();
    } catch (err: any) {
      setError(err.message || "Failed to update subscription");
    }
  };

  if (loading && subscriptions.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-48 bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-64 bg-gray-800 rounded animate-pulse mt-2" />
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-800/50 overflow-hidden">
          <div className="space-y-4 p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-700 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">{t("subscriptions")}</h1>
        <p className="text-sm text-gray-400">Gestao de assinaturas das empresas</p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-900/30 border border-red-800 p-3 text-sm text-red-300">{error}</div>
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["all", "active", "trial", "suspended", "cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === f
                ? "bg-primary-500 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
            }`}
          >
            {f === "all" ? "Todos" : f === "active" ? "Ativos" : f === "trial" ? "Trial" : f === "suspended" ? "Suspensos" : "Cancelados"}
          </button>
        ))}
      </div>

      {/* Subscriptions Table */}
      <div className="rounded-xl border border-gray-800 bg-gray-800/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-800">
                <th className="px-4 py-3 text-left font-medium text-gray-400">{t("companyName")}</th>
                <th className="px-4 py-3 text-left font-medium text-gray-400">{t("plan")}</th>
                <th className="px-4 py-3 text-left font-medium text-gray-400">Valor</th>
                <th className="px-4 py-3 text-left font-medium text-gray-400">Pagamento</th>
                <th className="px-4 py-3 text-left font-medium text-gray-400">Validade</th>
                <th className="px-4 py-3 text-left font-medium text-gray-400">{t("status")}</th>
                <th className="px-4 py-3 text-right font-medium text-gray-400">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-800/80 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-medium text-white">{sub.companyName}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      sub.plan === "premium" ? "bg-purple-500/20 text-purple-300" :
                      sub.plan === "professional" ? "bg-primary-500/20 text-primary-300" :
                      "bg-blue-500/20 text-blue-300"
                    }`}>
                      {t(`plans.${sub.plan}`)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-white font-medium">
                      {sub.amount === 0 ? "Gratis" : `${formatCurrency(sub.amount)}/mes`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-300">{methodLabels[sub.paymentMethod] || sub.paymentMethod}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-400 text-xs">{sub.startDate} - {sub.endDate}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      sub.status === "active" ? "bg-green-500/20 text-green-300" :
                      sub.status === "trial" ? "bg-yellow-500/20 text-yellow-300" :
                      sub.status === "suspended" ? "bg-red-500/20 text-red-300" :
                      "bg-gray-500/20 text-gray-300"
                    }`}>
                      {sub.status === "active" ? "Ativo" : sub.status === "trial" ? "Trial" : sub.status === "suspended" ? "Suspenso" : "Cancelado"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {sub.status === "suspended" && (
                        <button
                          onClick={() => updateStatus(sub.id, "active")}
                          className="rounded-lg px-2.5 py-1 text-xs font-medium bg-green-500/20 text-green-300 hover:bg-green-500/30"
                        >
                          {t("activate")}
                        </button>
                      )}
                      {sub.status === "active" && (
                        <button
                          onClick={() => updateStatus(sub.id, "suspended")}
                          className="rounded-lg px-2.5 py-1 text-xs font-medium bg-red-500/20 text-red-300 hover:bg-red-500/30"
                        >
                          {t("suspend")}
                        </button>
                      )}
                      {sub.status === "trial" && (
                        <button
                          onClick={() => updateStatus(sub.id, "active")}
                          className="rounded-lg px-2.5 py-1 text-xs font-medium bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                        >
                          {t("renew")}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
