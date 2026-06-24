"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { apiPost } from "@/lib/api";

const timeSlots = [
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "18:00", "18:30", "19:00", "19:30", "20:00",
  "20:30", "21:00", "21:30",
];

const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20];

export default function ReservePage() {
  const t = useTranslations("reserve");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const params = useParams();
  const locale = pathname.startsWith("/en") ? "en" : "pt";
  const slug = params.slug as string;

  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    date: "",
    time: "",
    guests: 2,
    name: "",
    phone: "",
    notes: "",
    payNow: false,
    paymentMethod: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError("");

      // Submit reservation
      const reservationData = {
        slug,
        customerName: form.name,
        customerPhone: form.phone,
        date: form.date,
        time: form.time,
        guests: form.guests,
        notes: form.notes,
        payNow: form.payNow,
        paymentMethod: form.paymentMethod || undefined,
      };

      const result = await apiPost<{ id: string; amount?: number }>("/api/public/reserve", reservationData);

      // If payNow is selected, initiate payment
      if (form.payNow && form.paymentMethod && result.id) {
        const amount = result.amount || 2500; // Default reservation deposit

        if (form.paymentMethod === "mpesa" || form.paymentMethod === "emola") {
          // Use PaySuite for M-Pesa and e-Mola
          await apiPost("/api/payments/paysuite/initiate", {
            reservationId: result.id,
            amount,
            phone: form.phone,
            method: form.paymentMethod,
          });
        } else if (form.paymentMethod === "visa" || form.paymentMethod === "mastercard") {
          // Use Stripe for Visa/Mastercard
          await apiPost("/api/payments/stripe/create-intent", {
            reservationId: result.id,
            amount,
            method: form.paymentMethod,
          });
        }
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit reservation");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">\u2705</div>
          <h1 className="text-2xl font-bold text-gray-900">{t("success")}</h1>
          <p className="mt-3 text-gray-600">
            {form.date} as {form.time} - {form.guests} pessoas
          </p>
          {form.payNow && (
            <p className="mt-2 text-sm text-green-600">Pagamento iniciado via {form.paymentMethod.toUpperCase()}</p>
          )}
          <div className="mt-6 space-y-3">
            <Link
              href={`/${locale}/menu/${slug}`}
              className="block btn-primary text-center"
            >
              Ver Cardapio
            </Link>
            <Link
              href={`/${locale}`}
              className="block btn-secondary text-center"
            >
              {tc("back")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="mx-auto max-w-3xl px-4 py-8">
          <Link
            href={`/${locale}/menu/${slug}`}
            className="inline-flex items-center gap-1 text-sm text-blue-100 hover:text-white mb-4"
          >
            ← {tc("back")}
          </Link>
          <h1 className="text-2xl font-bold">\uD83D\uDCC5 {t("title")}</h1>
          <p className="mt-1 text-blue-100">{slug.replace(/-/g, " ")}</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 -mt-4">
        <form onSubmit={handleSubmit} className="card">
          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 mb-4">{error}</div>
          )}

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step >= s
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div className={`w-12 h-0.5 ${step > s ? "bg-blue-500" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Date & Time */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">{t("selectDate")} & {t("selectTime")}</h2>

              <div>
                <label className="label">{t("selectDate")}</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="label">{t("selectTime")}</label>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setForm({ ...form, time })}
                      className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        form.time === time
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">{t("selectGuests")}</label>
                <div className="grid grid-cols-6 gap-2">
                  {guestOptions.map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setForm({ ...form, guests: num })}
                      className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        form.guests === num
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="button"
                className="w-full"
                size="lg"
                onClick={() => setStep(2)}
                disabled={!form.date || !form.time}
              >
                {tc("next")} →
              </Button>
            </div>
          )}

          {/* Step 2: Personal Info */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Seus Dados</h2>

              <Input
                id="name"
                label={t("name")}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Joao Silva"
                required
              />
              <Input
                id="phone"
                type="tel"
                label={t("phone")}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+258 84 000 0000"
                required
              />
              <div>
                <label className="label">{t("notes")}</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Ex: Mesa perto da janela, aniversario..."
                  className="input min-h-[80px] resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  size="lg"
                  onClick={() => setStep(1)}
                >
                  ← {tc("back")}
                </Button>
                <Button
                  type="button"
                  className="flex-1"
                  size="lg"
                  onClick={() => setStep(3)}
                  disabled={!form.name || !form.phone}
                >
                  {tc("next")} →
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">{t("payNow")}</h2>

              {/* Reservation Summary */}
              <div className="rounded-lg bg-blue-50 p-4">
                <h3 className="font-medium text-gray-900 mb-2">Resumo da Reserva</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>\uD83D\uDCC5 {form.date} as {form.time}</p>
                  <p>\uD83D\uDC65 {form.guests} pessoas</p>
                  <p>\uD83D\uDC64 {form.name}</p>
                  <p>\uD83D\uDCDE {form.phone}</p>
                  {form.notes && <p>\uD83D\uDCDD {form.notes}</p>}
                </div>
              </div>

              {/* Pay now toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.payNow}
                  onChange={(e) => setForm({ ...form, payNow: e.target.checked })}
                  className="h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">{t("payNow")}</span>
                  <p className="text-xs text-gray-500">Garanta sua reserva com pagamento antecipado</p>
                </div>
              </label>

              {form.payNow && (
                <div>
                  <label className="label">{t("paymentMethods")}</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "mpesa", name: "M-Pesa", icon: "\uD83D\uDCF1" },
                      { id: "emola", name: "e-Mola", icon: "\uD83D\uDCB3" },
                      { id: "visa", name: "Visa", icon: "\uD83D\uDCB3" },
                      { id: "mastercard", name: "Mastercard", icon: "\uD83D\uDCB3" },
                    ].map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setForm({ ...form, paymentMethod: method.id })}
                        className={`rounded-lg border p-3 text-left transition-colors ${
                          form.paymentMethod === method.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-200"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{method.icon}</span>
                          <span className="text-sm font-medium text-gray-900">{method.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  size="lg"
                  onClick={() => setStep(2)}
                >
                  ← {tc("back")}
                </Button>
                <Button type="submit" className="flex-1" size="lg" disabled={submitting}>
                  {submitting ? "Enviando..." : `\u2713 ${t("confirmReservation")}`}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
