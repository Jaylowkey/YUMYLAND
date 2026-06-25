"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  const t = useTranslations("auth.login");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "pt";

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const getErrorMessage = (errorCode: string): string => {
    if (errorCode === "CredentialsSignin" || errorCode.includes("credentials")) {
      return locale === "pt"
        ? "Email ou senha incorretos. Verifique seus dados e tente novamente."
        : "Incorrect email or password. Please check your credentials and try again.";
    }
    if (errorCode.includes("network") || errorCode.includes("fetch")) {
      return locale === "pt"
        ? "Erro de conexao. Verifique sua internet e tente novamente."
        : "Connection error. Check your internet and try again.";
    }
    return locale === "pt"
      ? "Ocorreu um erro inesperado. Tente novamente."
      : "An unexpected error occurred. Please try again.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(getErrorMessage(result.error));
        setLoading(false);
        return;
      }

      // Redirect to dashboard on success - middleware will handle MASTER redirect
      window.location.href = `/${locale}/dashboard`;
    } catch {
      setError(getErrorMessage("unexpected"));
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

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          id="email"
          type="email"
          label={t("email")}
          placeholder="email@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              label={t("password")}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
          <div className="mt-1.5 text-right">
            <a href="#" className="text-xs text-primary-500 hover:text-primary-600">
              {t("forgotPassword")}
            </a>
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          {tc("login")}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        {t("noAccount")}{" "}
        <Link
          href={`/${locale}/register`}
          className="font-semibold text-primary-500 hover:text-primary-600"
        >
          {t("signUp")}
        </Link>
      </p>
    </div>
  );
}
