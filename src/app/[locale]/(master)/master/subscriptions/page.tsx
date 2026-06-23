"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { Subscription } from "@/types";

const mockSubscriptions: Subscription[] = [
  { id: "1", companyId: "1", companyName: "Lanchonete do João", plan: "professional", status: "active", startDate: "2024-01-15", endDate: "2025-01-15", amount: 999, paymentMethod: "mpesa" },
  { id: "2", companyId: "2", companyName: "Café Maputo", plan: "basic", status: "active", startDate: "2024-03-20", endDate: "2025-03-20", amount: 499, paymentMethod: "emola" },
  { id: "3", companyId: "3", companyName: "Restaurante Sol", plan: "premium", status: "active", startDate: "2024-02-10", endDate: "2025-02-10", amount: 1999, paymentMethod: "visa" },
  { id: "4", companyId: "4", companyName: "Pastelaria Rosa", plan: "basic", status: "trial", startDate: "2024-12-01", endDate: "2025-01-01", amount: 0, paymentMethod: "mpesa" },
  { id: "5", companyId: "5", companyName: "Pizzaria do Bairro", plan: "professional", status: "suspended", startDate: "2024-06-15", endDate: "2024-12-15", amount: 999, paymentMethod: "emola" },
  { id: "6", companyId: "6", companyName: "Bar Central", plan: "premium", status: "active", startDate: "2024-04-22", endDate: "2025-04-22", amount: 1999, paymentMethod: "mastercard" },
];

const methodLabels: Record<string, string> = {
  mpesa: "M-Pesa", emola: "e-Mola", visa: "Visa", mastercard: "Mastercard",
};

export default function MasterSubscriptionsPage() {
  const t = useTranslations("master");
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all"
    ? subscriptions
    : subscriptions.filter((s) => s.status === filter);

  const updateStatus = (id: string, status: Subscription["status"]) => {
    setSubscriptions(subscriptions.map((s) => s.id === id ? { ...s, status } : s));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">{t("subscriptions")}</h1>
        <p className="text-sm text-gray-400">Gestão de assinaturas das empresas</p>
      </div>

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
                      {sub.amount === 0 ? "Grátis" : `${formatCurrency(sub.amount)}/mês`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-300">{methodLabels[sub.paymentMethod]}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-400 text-xs">{sub.startDate} → {sub.endDate}</span>
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
