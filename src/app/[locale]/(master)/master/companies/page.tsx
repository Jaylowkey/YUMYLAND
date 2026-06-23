"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Company } from "@/types";

const mockCompanies: Company[] = [
  { id: "1", name: "Lanchonete do João", ownerName: "João Silva", email: "joao@email.com", phone: "+258 84 555 1234", type: "snackbar", plan: "professional", status: "active", createdAt: "2024-01-15", slug: "lanchonete-do-joao" },
  { id: "2", name: "Café Maputo", ownerName: "Maria Costa", email: "maria@cafe.com", phone: "+258 85 666 7890", type: "cafe", plan: "basic", status: "active", createdAt: "2024-03-20", slug: "cafe-maputo" },
  { id: "3", name: "Restaurante Sol", ownerName: "Carlos Neto", email: "carlos@sol.com", phone: "+258 84 333 4567", type: "restaurant", plan: "premium", status: "active", createdAt: "2024-02-10", slug: "restaurante-sol" },
  { id: "4", name: "Pastelaria Rosa", ownerName: "Ana Rosa", email: "ana@rosa.com", phone: "+258 86 222 3456", type: "bakery", plan: "basic", status: "trial", createdAt: "2024-12-01", slug: "pastelaria-rosa" },
  { id: "5", name: "Pizzaria do Bairro", ownerName: "Pedro Almeida", email: "pedro@pizza.com", phone: "+258 84 111 2345", type: "pizzeria", plan: "professional", status: "suspended", createdAt: "2024-06-15", slug: "pizzaria-do-bairro" },
  { id: "6", name: "Bar Central", ownerName: "Sofia Machava", email: "sofia@bar.com", phone: "+258 84 777 8901", type: "bar", plan: "premium", status: "active", createdAt: "2024-04-22", slug: "bar-central" },
];

const typeLabels: Record<string, string> = {
  snackbar: "Lanchonete", restaurant: "Restaurante", cafe: "Café",
  bakery: "Pastelaria", pizzeria: "Pizzaria", bar: "Bar", foodtruck: "Food Truck",
};

export default function MasterCompaniesPage() {
  const t = useTranslations("master");
  const tc = useTranslations("common");
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateStatus = (id: string, status: Company["status"]) => {
    setCompanies(companies.map((c) => c.id === id ? { ...c, status } : c));
  };

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
                      <p className="text-xs text-gray-500">{company.ownerName} • {company.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-300">{typeLabels[company.type]}</span>
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
