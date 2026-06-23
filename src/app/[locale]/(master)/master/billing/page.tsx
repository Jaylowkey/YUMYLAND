"use client";

import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils";

const billingHistory = [
  { id: "1", company: "Lanchonete do João", amount: 999, method: "M-Pesa", date: "2024-12-15", status: "paid", reference: "MP-2024-001234" },
  { id: "2", company: "Restaurante Sol", amount: 1999, method: "Visa", date: "2024-12-14", status: "paid", reference: "VS-2024-005678" },
  { id: "3", company: "Bar Central", amount: 1999, method: "Mastercard", date: "2024-12-13", status: "paid", reference: "MC-2024-009012" },
  { id: "4", company: "Café Maputo", amount: 499, method: "e-Mola", date: "2024-12-12", status: "paid", reference: "EM-2024-003456" },
  { id: "5", company: "Pizzaria do Bairro", amount: 999, method: "e-Mola", date: "2024-12-10", status: "failed", reference: "EM-2024-007890" },
  { id: "6", company: "Lanchonete do João", amount: 999, method: "M-Pesa", date: "2024-11-15", status: "paid", reference: "MP-2024-001200" },
  { id: "7", company: "Restaurante Sol", amount: 1999, method: "Visa", date: "2024-11-14", status: "paid", reference: "VS-2024-005600" },
  { id: "8", company: "Café Maputo", amount: 499, method: "e-Mola", date: "2024-11-12", status: "paid", reference: "EM-2024-003400" },
];

const summary = {
  totalReceived: 485000,
  totalPending: 2998,
  totalFailed: 999,
  transactionCount: 198,
};

export default function MasterBillingPage() {
  const t = useTranslations("master");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">{t("billing")}</h1>
        <p className="text-sm text-gray-400">Histórico de cobranças e pagamentos</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-4">
          <p className="text-sm text-gray-400">Total Recebido (Mês)</p>
          <p className="text-xl font-bold text-green-400 mt-1">{formatCurrency(summary.totalReceived)}</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-4">
          <p className="text-sm text-gray-400">Pendente</p>
          <p className="text-xl font-bold text-yellow-400 mt-1">{formatCurrency(summary.totalPending)}</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-4">
          <p className="text-sm text-gray-400">Falharam</p>
          <p className="text-xl font-bold text-red-400 mt-1">{formatCurrency(summary.totalFailed)}</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-4">
          <p className="text-sm text-gray-400">Transações</p>
          <p className="text-xl font-bold text-white mt-1">{summary.transactionCount}</p>
        </div>
      </div>

      {/* Billing History */}
      <div className="rounded-xl border border-gray-800 bg-gray-800/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Histórico de Cobranças</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-800">
                <th className="px-4 py-3 text-left font-medium text-gray-400">Empresa</th>
                <th className="px-4 py-3 text-left font-medium text-gray-400">Valor</th>
                <th className="px-4 py-3 text-left font-medium text-gray-400">Método</th>
                <th className="px-4 py-3 text-left font-medium text-gray-400">Data</th>
                <th className="px-4 py-3 text-left font-medium text-gray-400">Referência</th>
                <th className="px-4 py-3 text-left font-medium text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {billingHistory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-800/80 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-medium text-white">{item.company}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-white font-medium">{formatCurrency(item.amount)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-300">{item.method}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-400">{item.date}</span>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-xs bg-gray-700 px-2 py-0.5 rounded font-mono text-gray-300">
                      {item.reference}
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      item.status === "paid" ? "bg-green-500/20 text-green-300" :
                      item.status === "failed" ? "bg-red-500/20 text-red-300" :
                      "bg-yellow-500/20 text-yellow-300"
                    }`}>
                      {item.status === "paid" ? "✓ Pago" : item.status === "failed" ? "✗ Falhou" : "⏳ Pendente"}
                    </span>
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
