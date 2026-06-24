"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Reservation } from "@/types";
import { apiGet, apiPatch } from "@/lib/api";

export default function ReservationsPage() {
  const t = useTranslations("reservations");
  const tc = useTranslations("common");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const fetchReservations = async (status?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (status && status !== "all") params.set("status", status);
      const url = `/api/reservations${params.toString() ? `?${params.toString()}` : ""}`;
      const data = await apiGet<Reservation[]>(url);
      setReservations(data);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to load reservations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations(filter);
  }, [filter]);

  const updateStatus = async (id: string, status: Reservation["status"]) => {
    try {
      await apiPatch(`/api/reservations/${id}`, { status });
      await fetchReservations(filter);
    } catch (err: any) {
      setError(err.message || "Failed to update reservation");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "warning" | "success" | "danger" | "info"> = {
      pending: "warning",
      confirmed: "success",
      cancelled: "danger",
      completed: "info",
    };
    return <Badge variant={variants[status]}>{t(`statuses.${status}`)}</Badge>;
  };

  const statusFilters = [
    { value: "all", label: tc("all") },
    { value: "pending", label: t("statuses.pending") },
    { value: "confirmed", label: t("statuses.confirmed") },
    { value: "completed", label: t("statuses.completed") },
    { value: "cancelled", label: t("statuses.cancelled") },
  ];

  if (loading && reservations.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-32 bg-gray-100 rounded animate-pulse mt-2" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="card h-24 animate-pulse bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-sm text-gray-500">{reservations.length} reservas no total</p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === f.value
                ? "bg-primary-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Reservations List */}
      {reservations.length === 0 ? (
        <div className="card text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-4 text-sm text-gray-500">{t("noReservations")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="card hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left: Info */}
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{reservation.customerName}</h3>
                      {getStatusBadge(reservation.status)}
                      {reservation.prepaid && (
                        <Badge variant="info">Pago</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{reservation.customerPhone}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {reservation.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {reservation.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {reservation.guests} {t("guests")}
                      </span>
                    </div>
                    {reservation.notes && (
                      <p className="text-xs text-gray-400 mt-1 italic">📝 {reservation.notes}</p>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 sm:shrink-0">
                  {reservation.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateStatus(reservation.id, "confirmed")}
                      >
                        {t("confirm")}
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => updateStatus(reservation.id, "cancelled")}
                      >
                        {t("cancel")}
                      </Button>
                    </>
                  )}
                  {reservation.status === "confirmed" && (
                    <Button
                      size="sm"
                      onClick={() => updateStatus(reservation.id, "completed")}
                    >
                      {t("complete")}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
