"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Company } from "@/types";
import { apiGet, apiPatch } from "@/lib/api";

const typeLabels: Record<string, string> = {
  snackbar: "Lanchonete", restaurant: "Restaurante", cafe: "Cafe",
  bakery: "Pastelaria", pizzeria: "Pizzaria", bar: "Bar", foodtruck: "Food Truck",
};

export default function MasterCompaniesPage() {
  const t = useTranslations("master");
  const tc = useTranslations("common");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await apiGet<any>("/api/master/companies");
      setCompanies(data.companies || data || []);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateStatus = async (id: string, status: Company["status"]) => {
    try {
      await apiPatch(`/api/master/companies/${id}`, { status });
      await fetchCompanies();
    } catch (err: any) {
      setError(err.message || "Failed to update company");
    }
  };

  if (loading && companies.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-48 bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-32 bg-gray-800 rounded animate-pulse mt-2" />
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{t("companies")}</h1>
          <p className="text-sm text-gray-400">{companies.length} empresas cadastradas</p>
        </div>
        <div className="relative max-w-xs w-full">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder={`${tc("search")}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-9 rounded-lg border border-gray-700 bg-gray-800 pl-9 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/20"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-900/30 border border-red-800 p-3 text-sm text-red-300">{error}</div>
      )}

      {/* Companies Table */}
      <div className="rounded-xl border border-gray-800 bg-gray-800/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-800">
                <th className="px-4 py-3 text-left font-medium text-gray-400">{t("companyName")}</th>
                <th className="px-4 py-3 text-left font-medium text-gray-400">Tipo</th>
                <th className="px-4 py-3 text-left font-medium text-gray-400">{t("plan")}</th>
                <th className="px-4 py-3 text-left font-medium text-gray-400">{t("status")}</th>
                <th className="px-4 py-3 text-left font-medium text-gray-400">Data</th>
                <th className="px-4 py-3 text-right font-medium text-gray-400">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-800/80 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-white">{company.name}</p>
                      <p className="text-xs text-gray-500">{company.ownerName} - {company.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-300">{typeLabels[company.type] || company.type}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      company.plan === "premium" ? "bg-purple-500/20 text-purple-300" :
                      company.plan === "professional" ? "bg-primary-500/20 text-primary-300" :
                      "bg-blue-500/20 text-blue-300"
                    }`}>
                      {t(`plans.${company.plan}`)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      company.status === "active" ? "bg-green-500/20 text-green-300" :
                      company.status === "trial" ? "bg-yellow-500/20 text-yellow-300" :
                      "bg-red-500/20 text-red-300"
                    }`}>
                      {company.status === "active" ? "Ativo" : company.status === "trial" ? "Trial" : "Suspenso"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-400 text-xs">{company.createdAt}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {company.status === "suspended" && (
                        <button
                          onClick={() => updateStatus(company.id, "active")}
                          className="rounded-lg px-2.5 py-1 text-xs font-medium bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-colors"
                        >
                          {t("activate")}
                        </button>
                      )}
                      {company.status === "active" && (
                        <button
                          onClick={() => updateStatus(company.id, "suspended")}
                          className="rounded-lg px-2.5 py-1 text-xs font-medium bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
                        >
                          {t("suspend")}
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
