"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const t = useTranslations("landing.footer");
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "pt";

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600">
                <span className="text-sm font-bold text-white">Y</span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                Yumy<span className="text-primary-500">Land</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-500 max-w-xs">
              {t("description")}
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900">{t("product")}</h4>
            <ul className="mt-4 space-y-2">
              <li><a href="#features" className="text-sm text-gray-500 hover:text-primary-500">{t("features")}</a></li>
              <li><a href="#pricing" className="text-sm text-gray-500 hover:text-primary-500">{t("pricing")}</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900">{t("company")}</h4>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-sm text-gray-500 hover:text-primary-500">{t("about")}</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-primary-500">{t("contact")}</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-primary-500">{t("privacy")}</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-primary-500">{t("terms")}</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} YumyLand. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
