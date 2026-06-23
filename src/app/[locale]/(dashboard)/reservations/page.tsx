"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Reservation } from "@/types";

const mockReservations: Reservation[] = [
  {
    id: "1",
    customerName: "Roberto Machava",
    customerPhone: "+258 84 555 1234",
    date: "2024-12-20",
    time: "19:00",
    guests: 4,
    status: "pending",
    notes: "Mesa perto da janela",
    prepaid: true,
    amount: 2500,
    companyId: "1",
    createdAt: "2024-12-18",
  },
  {
    id: "2",
    customerName: "Família Neto",
    customerPhone: "+258 85 666 7890",
    date: "2024-12-20",
    time: "20:00",
    guests: 6,
    status: "confirmed",
    prepaid: false,
    companyId: "1",
    createdAt: "2024-12-17",
  },
  {
    id: "3",
    customerName: "Joana Pereira",
    customerPhone: "+258 84 333 4567",
    date: "2024-12-21",
    time: "12:30",
    guests: 2,
    status: "confirmed",
    notes: "Aniversário, trazer bolo",
    prepaid: true,
    amount: 1800,
    companyId: "1",
    createdAt: "2024-12-16",
  },
  {
    id: "4",
    customerName: "Carlos Mondlane",
    customerPhone: "+258 86 222 3456",
    date: "2024-12-19",
    time: "13:00",
    guests: 3,
    status: "completed",
    prepaid: false,
    companyId: "1",
    createdAt: "2024-12-15",
  },
  {
    id: "5",
    customerName: "Ana Sofia",
    customerPhone: "+258 84 111 2345",
    date: "2024-12-19",
    time: "19:30",
    guests: 2,
    status: "cancelled",
    prepaid: false,
    companyId: "1",
    createdAt: "2024-12-15",
  },
];

export default function ReservationsPage() {
  const t = useTranslations("reservations");
  const tc = useTranslations("common");
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [filter, setFilter] = useState<string>("all");

  const filteredReservations = filter === "all"
    ? reservations
    : reservations.filter((r) => r.status === filter);

  const updateStatus = (id: string, status: Reservation["status"]) => {
    setReservations(reservations.map((r) =>
      r.id === id ? { ...r, status } : r
    ));
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-sm text-gray-500">{reservations.length} reservas no total</p>
      </div>

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
      {filteredReservations.length === 0 ? (
        <div className="card text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-4 text-sm text-gray-500">{t("noReservations")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReservations.map((reservation) => (
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
