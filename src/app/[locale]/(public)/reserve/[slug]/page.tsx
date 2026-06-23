"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

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
  const locale = pathname.startsWith("/en") ? "en" : "pt";

  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-2xl font-bold text-gray-900">{t("success")}</h1>
          <p className="mt-3 text-gray-600">
            {form.date} às {form.time} • {form.guests} pessoas
          </p>
          <div className="mt-6 space-y-3">
            <Link
              href={`/${locale}/menu/lanchonete-do-joao`}
              className="block btn-primary text-center"
            >
              Ver Cardápio
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
            href={`/${locale}/menu/lanchonete-do-joao`}
            className="inline-flex items-center gap-1 text-sm text-blue-100 hover:text-white mb-4"
          >
            ← {tc("back")}
          </Link>
          <h1 className="text-2xl font-bold">📅 {t("title")}</h1>
          <p className="mt-1 text-blue-100">Lanchonete do João</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 -mt-4">
        <form onSubmit={handleSubmit} className="card">
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
                placeholder="João Silva"
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
                  placeholder="Ex: Mesa perto da janela, aniversário..."
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
                  <p>📅 {form.date} às {form.time}</p>
                  <p>👥 {form.guests} pessoas</p>
                  <p>👤 {form.name}</p>
                  <p>📞 {form.phone}</p>
                  {form.notes && <p>📝 {form.notes}</p>}
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
                      { id: "mpesa", name: "M-Pesa", icon: "📱" },
                      { id: "emola", name: "e-Mola", icon: "💳" },
                      { id: "visa", name: "Visa", icon: "💳" },
                      { id: "mastercard", name: "Mastercard", icon: "💳" },
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
                <Button type="submit" className="flex-1" size="lg">
                  ✓ {t("confirmReservation")}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
