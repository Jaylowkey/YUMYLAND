"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";
import { apiGet } from "@/lib/api";

interface BillingPayment {
  id: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  reference: string | null;
  transactionId: string | null;
  companyId: string;
  company: { id: string; name: string };
  createdAt: string;
}

interface BillingSummary {
  totalReceived: number;
  totalPending: number;
  totalFailed: number;
  transactionCount: number;
}

interface BillingPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface BillingResponse {
  payments: BillingPayment[];
  summary: BillingSummary;
  pagination: BillingPagination;
}

const methodLabels: Record<string, string> = {
  mpesa: "M-Pesa",
  emola: "e-Mola",
  visa: "Visa",
  mastercard: "Mastercard",
};

export default function MasterBillingPage() {
  const t = useTranslations("master");
  const [payments, setPayments] = useState<BillingPayment[]>([]);
  const [summary, setSummary] = useState<BillingSummary>({
    totalReceived: 0,
    totalPending: 0,
    totalFailed: 0,
    transactionCount: 0,
  });
  const [pagination, setPagination] = useState<BillingPagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBilling = async (page: number = 1) => {
    try {
      setLoading(true);
      const data = await apiGet<BillingResponse>(
        `/api/master/billing?page=${page}&limit=10`
      );
      setPayments(data.payments);
      setSummary(data.summary);
      setPagination(data.pagination);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to load billing data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBilling();
  }, []);

  const goToPage = (page: number) => {
    fetchBilling(page);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR");
  };

  if (loading && payments.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-48 bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-64 bg-gray-800 rounded animate-pulse mt-2" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl border border-gray-800 bg-gray-800/50 p-4 h-20 animate-pulse" />
          ))}
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 bg-gray-700 rounded animate-pulse" />
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
        <h1 className="text-2xl font-bold text-white">{t("billing")}</h1>
        <p className="text-sm text-gray-400">{t("billingSubtitle")}</p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-500/20 border border-red-500/30 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-4">
          <p className="text-sm text-gray-400">{t("totalReceived")}</p>
          <p className="text-xl font-bold text-green-400 mt-1">
            {formatCurrency(summary.totalReceived)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-4">
          <p className="text-sm text-gray-400">{t("pending")}</p>
          <p className="text-xl font-bold text-yellow-400 mt-1">
            {formatCurrency(summary.totalPending)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-4">
          <p className="text-sm text-gray-400">{t("failed")}</p>
          <p className="text-xl font-bold text-red-400 mt-1">
            {formatCurrency(summary.totalFailed)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-4">
          <p className="text-sm text-gray-400">{t("transactions")}</p>
          <p className="text-xl font-bold text-white mt-1">
            {summary.transactionCount}
          </p>
        </div>
      </div>

      {/* Billing History */}
      <div className="rounded-xl border border-gray-800 bg-gray-800/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">{t("billingHistory")}</h2>
        </div>
        {payments.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-400">{t("noPayments")}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700 bg-gray-800">
                    <th className="px-4 py-3 text-left font-medium text-gray-400">{t("company")}</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-400">{t("amount")}</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-400">{t("method")}</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-400">{t("date")}</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-400">{t("reference")}</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-400">{t("status")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-800/80 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-medium text-white">
                          {payment.company?.name || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-white font-medium">
                          {formatCurrency(payment.amount)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-300">
                          {methodLabels[payment.method] || payment.method}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-400">{formatDate(payment.createdAt)}</span>
                      </td>
                      <td className="px-4 py-3">
                        {payment.reference ? (
                          <code className="text-xs bg-gray-700 px-2 py-0.5 rounded font-mono text-gray-300">
                            {payment.reference}
                          </code>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            payment.status === "completed"
                              ? "bg-green-500/20 text-green-300"
                              : payment.status === "failed"
                              ? "bg-red-500/20 text-red-300"
                              : payment.status === "refunded"
                              ? "bg-blue-500/20 text-blue-300"
                              : "bg-yellow-500/20 text-yellow-300"
                          }`}
                        >
                          {payment.status === "completed"
                            ? `\u2713 ${t("statusPaid")}`
                            : payment.status === "failed"
                            ? `\u2717 ${t("statusFailed")}`
                            : payment.status === "refunded"
                            ? `\u21A9 ${t("statusRefunded")}`
                            : `\u23F3 ${t("statusPending")}`}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
                <p className="text-sm text-gray-400">
                  {t("paginationInfo", { page: pagination.page, totalPages: pagination.totalPages, total: pagination.total })}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToPage(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {t("previous")}
                  </button>
                  <button
                    onClick={() => goToPage(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {t("next")}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
