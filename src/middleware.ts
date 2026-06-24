import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { getToken } from "next-auth/jwt";
import { locales, defaultLocale } from "./i18n/config";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

// Routes that require authentication
const protectedPaths = ["/dashboard", "/categories", "/products", "/reservations", "/customers"];

// Routes that require MASTER role
const masterPaths = ["/master"];

// Routes that are always public (no auth needed)
const publicPaths = ["/login", "/register", "/menu", "/reserve"];

function getPathnameWithoutLocale(pathname: string): string {
  const localePattern = new RegExp(`^/(${locales.join("|")})`);
  return pathname.replace(localePattern, "") || "/";
}

function getLocaleFromPathname(pathname: string): string {
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return locale;
    }
  }
  return defaultLocale;
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth check for API routes, static files, and Next.js internals
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/_vercel") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Get the pathname without locale prefix for route matching
  const pathWithoutLocale = getPathnameWithoutLocale(pathname);
  const locale = getLocaleFromPathname(pathname);

  // Check if the path is a protected route
  const isProtectedRoute = protectedPaths.some(
    (path) => pathWithoutLocale === path || pathWithoutLocale.startsWith(`${path}/`)
  );

  // Check if the path is a master route
  const isMasterRoute = masterPaths.some(
    (path) => pathWithoutLocale === path || pathWithoutLocale.startsWith(`${path}/`)
  );

  // For protected or master routes, check authentication
  if (isProtectedRoute || isMasterRoute) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Not authenticated - redirect to login
    if (!token) {
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Master route but not MASTER role - redirect to dashboard
    if (isMasterRoute && token.role !== "MASTER") {
      const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // Apply next-intl middleware for locale handling
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
