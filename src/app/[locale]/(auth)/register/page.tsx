"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export default function RegisterPage() {
  const t = useTranslations("auth.register");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "pt";

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    ownerName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    businessType: "snackbar",
  });

  const businessTypes = [
    { value: "snackbar", label: t("types.snackbar") },
    { value: "restaurant", label: t("types.restaurant") },
    { value: "cafe", label: t("types.cafe") },
    { value: "bakery", label: t("types.bakery") },
    { value: "pizzeria", label: t("types.pizzeria") },
    { value: "bar", label: t("types.bar") },
    { value: "foodtruck", label: t("types.foodtruck") },
  ];

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      window.location.href = `/${locale}/dashboard`;
    }, 1500);
  };

  return (
    <div>
      {/* Mobile Logo */}
      <div className="lg:hidden mb-8 text-center">
        <Link href={`/${locale}`} className="inline-flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600">
            <span className="text-xl font-bold text-white">Y</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">
            Yumy<span className="text-primary-500">Land</span>
          </span>
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="mt-2 text-sm text-gray-600">{t("subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="companyName"
          label={t("companyName")}
          placeholder="Ex: Lanchonete do João"
          value={form.companyName}
          onChange={(e) => handleChange("companyName", e.target.value)}
          required
        />

        <Input
          id="ownerName"
          label={t("ownerName")}
          placeholder="João Silva"
          value={form.ownerName}
          onChange={(e) => handleChange("ownerName", e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="email"
            type="email"
            label={t("email")}
            placeholder="email@exemplo.com"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />
          <Input
            id="phone"
            type="tel"
            label={t("phone")}
            placeholder="+258 84 000 0000"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            required
          />
        </div>

        <Select
          id="businessType"
          label={t("businessType")}
          options={businessTypes}
          value={form.businessType}
          onChange={(e) => handleChange("businessType", e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="password"
            type="password"
            label={t("password")}
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            required
          />
          <Input
            id="confirmPassword"
            type="password"
            label={t("confirmPassword")}
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            required
          />
        </div>

        <div className="pt-2">
          <Button type="submit" className="w-full" size="lg" loading={loading}>
            {tc("register")}
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          {t("agree")}{" "}
          <a href="#" className="text-primary-500 hover:underline">
            {t("termsLink")}
          </a>
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        {t("hasAccount")}{" "}
        <Link
          href={`/${locale}/login`}
          className="font-semibold text-primary-500 hover:text-primary-600"
        >
          {t("signIn")}
        </Link>
      </p>
    </div>
  );
}
