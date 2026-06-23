"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import Badge from "@/components/ui/Badge";
import { Customer } from "@/types";
import { formatCurrency, getLoyaltyColor } from "@/lib/utils";

const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Maria Silva",
    email: "maria@email.com",
    phone: "+258 84 555 1234",
    points: 1250,
    level: "diamond",
    totalSpent: 125000,
    joinDate: "2024-01-15",
    companyId: "1",
    digitalCardId: "YL-001-DIA",
  },
  {
    id: "2",
    name: "Carlos Mondlane",
    email: "carlos@email.com",
    phone: "+258 85 666 7890",
    points: 680,
    level: "gold",
    totalSpent: 68000,
    joinDate: "2024-03-20",
    companyId: "1",
    digitalCardId: "YL-002-GLD",
  },
  {
    id: "3",
    name: "Ana Costa",
    email: "ana@email.com",
    phone: "+258 84 333 4567",
    points: 320,
    level: "silver",
    totalSpent: 32000,
    joinDate: "2024-05-10",
    companyId: "1",
    digitalCardId: "YL-003-SLV",
  },
  {
    id: "4",
    name: "Pedro João",
    email: "pedro@email.com",
    phone: "+258 86 222 3456",
    points: 150,
    level: "bronze",
    totalSpent: 15000,
    joinDate: "2024-08-05",
    companyId: "1",
    digitalCardId: "YL-004-BRZ",
  },
  {
    id: "5",
    name: "Sofia Neto",
    email: "sofia@email.com",
    phone: "+258 84 111 2345",
    points: 89,
    level: "bronze",
    totalSpent: 8900,
    joinDate: "2024-09-12",
    companyId: "1",
    digitalCardId: "YL-005-BRZ",
  },
  {
    id: "6",
    name: "Roberto Machava",
    email: "roberto@email.com",
    phone: "+258 84 777 8901",
    points: 450,
    level: "silver",
    totalSpent: 45000,
    joinDate: "2024-04-22",
    companyId: "1",
    digitalCardId: "YL-006-SLV",
  },
];

const levelIcons: Record<string, string> = {
  bronze: "🥉",
  silver: "🥈",
  gold: "🥇",
  diamond: "💎",
};

export default function CustomersPage() {
  const t = useTranslations("customers");
  const tc = useTranslations("common");
  const [customers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === "all" || c.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const levelFilters = [
    { value: "all", label: tc("all") },
    { value: "diamond", label: `💎 ${t("levels.diamond")}` },
    { value: "gold", label: `🥇 ${t("levels.gold")}` },
    { value: "silver", label: `🥈 ${t("levels.silver")}` },
    { value: "bronze", label: `🥉 ${t("levels.bronze")}` },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-sm text-gray-500">{customers.length} clientes cadastrados</p>
      </div>

      {/* Loyalty Program Info */}
      <div className="card bg-gradient-to-r from-primary-50 to-yellow-50 border-primary-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              ⭐ {t("loyaltyProgram")}
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
              onClick={() => setLevelFilter(f.value)}
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
      {filteredCustomers.length === 0 ? (
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
                  <th className="px-4 py-3 text-left font-medium text-gray-500">{t("totalSpent")}</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">{t("digitalCard")}</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">{t("joinDate")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredCustomers.map((customer) => (
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
                      <span className="text-gray-600">{formatCurrency(customer.totalSpent)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono text-gray-600">
                        {customer.digitalCardId}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-500">{customer.joinDate}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
