"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import Badge from "@/components/ui/Badge";
import { Customer } from "@/types";
import { formatCurrency, getLoyaltyColor } from "@/lib/utils";
import { apiGet } from "@/lib/api";

const levelIcons: Record<string, string> = {
  bronze: "\uD83E\uDD49",
  silver: "\uD83E\uDD48",
  gold: "\uD83E\uDD47",
  diamond: "\uD83D\uDC8E",
};

const levelThresholds: Record<string, { next: string | null; pointsNeeded: number }> = {
  bronze: { next: "silver", pointsNeeded: 200 },
  silver: { next: "gold", pointsNeeded: 500 },
  gold: { next: "diamond", pointsNeeded: 1000 },
  diamond: { next: null, pointsNeeded: 0 },
};

function getLoyaltyProgress(level: string, points: number) {
  const threshold = levelThresholds[level];
  if (!threshold || !threshold.next) {
    return { percentage: 100, remaining: 0, nextLevel: null };
  }
  const percentage = Math.min(100, Math.round((points / threshold.pointsNeeded) * 100));
  const remaining = Math.max(0, threshold.pointsNeeded - points);
  return { percentage, remaining, nextLevel: threshold.next };
}

export default function CustomersPage() {
  const t = useTranslations("customers");
  const tc = useTranslations("common");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (levelFilter !== "all") params.set("level", levelFilter);
      params.set("page", page.toString());
      params.set("limit", limit.toString());
      const url = `/api/customers${params.toString() ? `?${params.toString()}` : ""}`;
      const data = await apiGet<{ customers: Customer[]; total: number } | Customer[]>(url);
      if (Array.isArray(data)) {
        setCustomers(data);
        setTotal(data.length);
      } else {
        setCustomers(data.customers || []);
        setTotal(data.total || 0);
      }
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [levelFilter, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchCustomers();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const totalPages = Math.ceil(total / limit);

  const levelFilters = [
    { value: "all", label: tc("all") },
    { value: "diamond", label: `\uD83D\uDC8E ${t("levels.diamond")}` },
    { value: "gold", label: `\uD83E\uDD47 ${t("levels.gold")}` },
    { value: "silver", label: `\uD83E\uDD48 ${t("levels.silver")}` },
    { value: "bronze", label: `\uD83E\uDD49 ${t("levels.bronze")}` },
  ];

  if (loading && customers.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-32 bg-gray-100 rounded animate-pulse mt-2" />
        </div>
        <div className="card h-32 animate-pulse bg-gray-100" />
        <div className="card overflow-hidden p-0">
          <div className="space-y-4 p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
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
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-sm text-gray-500">{total} {t("registered")}</p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      {/* Loyalty Program Info */}
      <div className="card bg-gradient-to-r from-primary-50 to-yellow-50 border-primary-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              \u2B50 {t("loyaltyProgram")}
            </h2>
            <p className="text-sm text-gray-600 mt-1">{t("loyaltyDescription")}</p>
          </div>
          <div className="flex items-center gap-3">
            {Object.entries(levelIcons).map(([level, icon]) => (
              <div key={level} className="text-center">
                <div className="text-xl">{icon}</div>
                <div className="text-xs text-gray-500 capitalize">{t(`levels.${level}`)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder={`${tc("search")}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {levelFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => { setLevelFilter(f.value); setPage(1); }}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                levelFilter === f.value
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      {customers.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-sm text-gray-500">{t("noCustomers")}</p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-4 py-3 text-left font-medium text-gray-500">{t("name")}</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">{t("level")}</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">{t("points")}</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">{t("progress")}</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">{t("totalSpent")}</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">{t("joinDate")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {customers.map((customer) => {
                  const progress = getLoyaltyProgress(customer.level, customer.points);
                  return (
                    <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                            <span className="text-xs font-bold text-white">
                              {customer.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{customer.name}</p>
                            <p className="text-xs text-gray-500">{customer.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${getLoyaltyColor(customer.level)}`}>
                          {levelIcons[customer.level]} {t(`levels.${customer.level}`)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-gray-900">{customer.points}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-32">
                          {progress.nextLevel ? (
                            <div>
                              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                <span>{progress.percentage}%</span>
                                <span>{levelIcons[progress.nextLevel]} {t(`levels.${progress.nextLevel}`)}</span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-300"
                                  style={{ width: `${progress.percentage}%` }}
                                />
                              </div>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {t("remaining", { count: progress.remaining })}
                              </p>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <span className="text-yellow-500">\u2605</span>
                              {t("maxLevel")}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-600">{formatCurrency(customer.totalSpent)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-500">{customer.joinDate}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {t("paginationInfo", { page, totalPages, total })}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t("previous")}
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t("next")}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
