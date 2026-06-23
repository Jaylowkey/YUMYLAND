"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const navItems = [
  { key: "statistics", href: "/master", icon: "📊" },
  { key: "companies", href: "/master/companies", icon: "🏢" },
  { key: "subscriptions", href: "/master/subscriptions", icon: "💳" },
  { key: "billing", href: "/master/billing", icon: "💰" },
];

export default function MasterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("master");
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "pt";

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Nav */}
      <header className="border-b border-gray-800 bg-gray-900/95 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/${locale}`} className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600">
                  <span className="text-sm font-bold text-white">Y</span>
                </div>
                <span className="text-lg font-bold text-white">
                  Yumy<span className="text-primary-400">Land</span>
                </span>
              </Link>
              <span className="rounded-full bg-purple-500/20 px-3 py-0.5 text-xs font-semibold text-purple-300">
                MASTER
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const fullHref = `/${locale}${item.href}`;
                const isActive = pathname === fullHref;
                return (
                  <Link
                    key={item.key}
                    href={fullHref}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-gray-800 text-white"
                        : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
                    )}
                  >
                    <span>{item.icon}</span>
                    {t(item.key)}
                  </Link>
                );
              })}
            </nav>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                <span className="text-xs font-bold text-white">A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <div className="md:hidden border-b border-gray-800 bg-gray-900 overflow-x-auto">
        <div className="flex px-4 py-2 gap-1">
          {navItems.map((item) => {
            const fullHref = `/${locale}${item.href}`;
            const isActive = pathname === fullHref;
            return (
              <Link
                key={item.key}
                href={fullHref}
                className={cn(
                  "shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:text-gray-200"
                )}
              >
                <span>{item.icon}</span>
                {t(item.key)}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
