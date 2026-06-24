"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import StatCard from "@/components/ui/StatCard";
import { formatCurrency } from "@/lib/utils";
import { apiGet } from "@/lib/api";

interface DashboardStats {
  salesToday: number;
  reservationsToday: number;
  activeClients: number;
  monthlyRevenue: number;
}

interface RecentOrder {
  id: string;
  customer: string;
  items: string;
  total: number;
  time: string;
}

interface UpcomingReservation {
  id: string;
  customer: string;
  date: string;
  time: string;
  guests: number;
  status: string;
}

export default function DashboardPage() {
  const t = useTranslations("dashboard");

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [upcoming, setUpcoming] = useState<UpcomingReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [statsData, ordersData, upcomingData] = await Promise.all([
          apiGet<DashboardStats>("/api/dashboard/stats"),
          apiGet<RecentOrder[]>("/api/dashboard/recent-orders"),
          apiGet<UpcomingReservation[]>("/api/dashboard/upcoming-reservations"),
        ]);
        setStats(statsData);
        setRecentOrders(ordersData);
        setUpcoming(upcomingData);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-32 bg-gray-100 rounded animate-pulse mt-2" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card h-28 animate-pulse bg-gray-100" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card h-64 animate-pulse bg-gray-100" />
          <div className="card h-64 animate-pulse bg-gray-100" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center py-12">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-sm text-primary-500 hover:underline"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-sm text-gray-500">{t("welcome")}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t("salesToday")}
          value={formatCurrency(stats?.salesToday || 0)}
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title={t("reservationsToday")}
          value={stats?.reservationsToday || 0}
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          trend={{ value: 5, positive: true }}
        />
        <StatCard
          title={t("activeClients")}
          value={stats?.activeClients || 0}
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          trend={{ value: 8, positive: true }}
        />
        <StatCard
          title={t("monthlyRevenue")}
          value={formatCurrency(stats?.monthlyRevenue || 0)}
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
          trend={{ value: 15, positive: true }}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("recentOrders")}</h2>
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Nenhum pedido recente</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary-50 flex items-center justify-center">
                      <span className="text-xs font-semibold text-primary-600">
                        {order.customer.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                      <p className="text-xs text-gray-500">{order.items}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(order.total)}</p>
                    <p className="text-xs text-gray-400">{order.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Reservations */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("upcomingReservations")}</h2>
          <div className="space-y-3">
            {upcoming.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Nenhuma reserva futura</p>
            ) : (
              upcoming.map((res) => (
                <div key={res.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{res.customer}</p>
                      <p className="text-xs text-gray-500">
                        {res.date} - {res.time} - {res.guests} pessoas
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      res.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {res.status === "confirmed" ? "Confirmada" : "Pendente"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
