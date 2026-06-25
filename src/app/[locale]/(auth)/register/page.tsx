"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import { signIn } from "next-auth/react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

type PasswordStrength = "weak" | "medium" | "strong";

function getPasswordStrength(password: string): PasswordStrength {
  if (password.length === 0) return "weak";
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score >= 4) return "strong";
  if (score >= 2) return "medium";
  return "weak";
}

const strengthColors: Record<PasswordStrength, string> = {
  weak: "bg-red-500",
  medium: "bg-yellow-500",
  strong: "bg-green-500",
};

const strengthWidths: Record<PasswordStrength, string> = {
  weak: "w-1/3",
  medium: "w-2/3",
  strong: "w-full",
};

interface FieldErrors {
  companyName?: string;
  ownerName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterPage() {
  const t = useTranslations("auth.register");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "pt";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
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
    // Clear field error on change
    if (fieldErrors[field as keyof FieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = useCallback(
    (formData: typeof form): FieldErrors => {
      const errors: FieldErrors = {};

      if (!formData.companyName.trim()) {
        errors.companyName = locale === "pt" ? "Nome da empresa obrigatorio" : "Company name is required";
      }
      if (!formData.ownerName.trim()) {
        errors.ownerName = locale === "pt" ? "Nome do proprietario obrigatorio" : "Owner name is required";
      }
      if (!formData.email.trim()) {
        errors.email = locale === "pt" ? "Email obrigatorio" : "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = locale === "pt" ? "Email invalido" : "Invalid email address";
      }
      if (!formData.phone.trim()) {
        errors.phone = locale === "pt" ? "Telefone obrigatorio" : "Phone is required";
      }
      if (formData.password.length < 6) {
        errors.password = locale === "pt" ? "Minimo 6 caracteres" : "Minimum 6 characters";
      }
      if (formData.confirmPassword !== formData.password) {
        errors.confirmPassword = locale === "pt" ? "As senhas nao coincidem" : "Passwords do not match";
      }

      return errors;
    },
    [locale]
  );

  const validateField = useCallback(
    (field: string, value: string) => {
      // Run full validation and pick the relevant field error
      const currentForm = { ...form, [field]: value };
      const errors = validateForm(currentForm);
      setFieldErrors((prev) => ({ ...prev, [field]: errors[field as keyof FieldErrors] || undefined }));
    },
    [form, validateForm]
  );

  const handleBlur = (field: string) => {
    validateField(field, form[field as keyof typeof form]);
  };

  const passwordStrength = getPasswordStrength(form.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate all fields using the single source of truth
    const errors = validateForm(form);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      // Call register API
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: form.companyName,
          ownerName: form.ownerName,
          email: form.email,
          phone: form.phone,
          password: form.password,
          businessType: form.businessType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // Auto-login after successful registration
      const signInResult = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (signInResult?.error) {
        // Registration succeeded but auto-login failed, redirect to login
        window.location.href = `/${locale}/login`;
        return;
      }

      // Redirect to dashboard
      window.location.href = `/${locale}/dashboard`;
    } catch {
      setError(
        locale === "pt"
          ? "Erro inesperado. Tente novamente."
          : "An unexpected error occurred. Please try again."
      );
      setLoading(false);
    }
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

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700 animate-fadeIn">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="companyName"
          label={t("companyName")}
          placeholder="Ex: Lanchonete do Joao"
          value={form.companyName}
          onChange={(e) => handleChange("companyName", e.target.value)}
          onBlur={() => handleBlur("companyName")}
          error={fieldErrors.companyName}
          required
        />

        <Input
          id="ownerName"
          label={t("ownerName")}
          placeholder="Joao Silva"
          value={form.ownerName}
          onChange={(e) => handleChange("ownerName", e.target.value)}
          onBlur={() => handleBlur("ownerName")}
          error={fieldErrors.ownerName}
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
            onBlur={() => handleBlur("email")}
            error={fieldErrors.email}
            required
          />
          <Input
            id="phone"
            type="tel"
            label={t("phone")}
            placeholder="+258 84 000 0000"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            onBlur={() => handleBlur("phone")}
            error={fieldErrors.phone}
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
          <div>
            <Input
              id="password"
              type="password"
              label={t("password")}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              onBlur={() => handleBlur("password")}
              error={fieldErrors.password}
              required
            />
            {form.password.length > 0 && (
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strengthColors[passwordStrength]} ${strengthWidths[passwordStrength]}`}
                    />
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      passwordStrength === "weak"
                        ? "text-red-600"
                        : passwordStrength === "medium"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {passwordStrength === "weak"
                      ? locale === "pt"
                        ? "Fraca"
                        : "Weak"
                      : passwordStrength === "medium"
                      ? locale === "pt"
                        ? "Media"
                        : "Medium"
                      : locale === "pt"
                      ? "Forte"
                      : "Strong"}
                  </span>
                </div>
              </div>
            )}
          </div>
          <Input
            id="confirmPassword"
            type="password"
            label={t("confirmPassword")}
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            onBlur={() => handleBlur("confirmPassword")}
            error={fieldErrors.confirmPassword}
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
