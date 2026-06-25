"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const t = useTranslations();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentLocale = pathname.startsWith("/en") ? "en" : "pt";
  const switchLocale = currentLocale === "pt" ? "en" : "pt";

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg" role="navigation" aria-label="Main navigation">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${currentLocale}`} className="flex items-center gap-2" aria-label="YumyLand - Pagina inicial">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600" aria-hidden="true">
              <span className="text-lg font-bold text-white">Y</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Yumy<span className="text-primary-500">Land</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-primary-500 transition-colors" aria-label="Ver funcionalidades">
              {t("landing.footer.features")}
            </a>
            <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-primary-500 transition-colors" aria-label="Ver planos e precos">
              {t("landing.footer.pricing")}
            </a>
            <Link
              href={`/${switchLocale}`}
              className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
              aria-label={switchLocale === "en" ? "Switch to English" : "Mudar para Portugues"}
            >
              {switchLocale === "en" ? "\uD83C\uDDEC\uD83C\uDDE7 EN" : "\uD83C\uDDF2\uD83C\uDDFF PT"}
            </Link>
            <Link
              href={`/${currentLocale}/login`}
              className="text-sm font-medium text-gray-600 hover:text-primary-500 transition-colors"
              aria-label="Entrar na sua conta"
            >
              {t("common.login")}
            </Link>
            <Link
              href={`/${currentLocale}/register`}
              className="btn-primary text-sm"
              aria-label="Criar conta gratuita"
            >
              {t("common.register")}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden border-t border-gray-100 py-4 space-y-3 animate-slideUp" role="menu">
            <a
              href="#features"
              className="block text-sm font-medium text-gray-600 hover:text-primary-500"
              onClick={closeMobileMenu}
              role="menuitem"
              aria-label="Ver funcionalidades"
            >
              {t("landing.footer.features")}
            </a>
            <a
              href="#pricing"
              className="block text-sm font-medium text-gray-600 hover:text-primary-500"
              onClick={closeMobileMenu}
              role="menuitem"
              aria-label="Ver planos e precos"
            >
              {t("landing.footer.pricing")}
            </a>
            <Link
              href={`/${switchLocale}`}
              className="block text-sm font-medium text-gray-500"
              onClick={closeMobileMenu}
              role="menuitem"
              aria-label={switchLocale === "en" ? "Switch to English" : "Mudar para Portugues"}
            >
              {switchLocale === "en" ? "\uD83C\uDDEC\uD83C\uDDE7 English" : "\uD83C\uDDF2\uD83C\uDDFF Portugues"}
            </Link>
            <Link
              href={`/${currentLocale}/login`}
              className="block text-sm font-medium text-gray-600"
              onClick={closeMobileMenu}
              role="menuitem"
              aria-label="Entrar na sua conta"
            >
              {t("common.login")}
            </Link>
            <Link
              href={`/${currentLocale}/register`}
              className="block btn-primary text-center text-sm"
              onClick={closeMobileMenu}
              role="menuitem"
              aria-label="Criar conta gratuita"
            >
              {t("common.register")}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
