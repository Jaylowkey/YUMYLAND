import { getServerSession as getNextAuthSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Get the current server-side session.
 * Use in Server Components and API routes.
 */
export async function getServerSession() {
  return await getNextAuthSession(authOptions);
}

/**
 * Require authentication. Throws an error if no session exists.
 * Use in API routes to protect endpoints.
 */
export async function requireAuth() {
  const session = await getServerSession();

  if (!session?.user) {
    throw new Error("Unauthorized: No active session");
  }

  return session;
}

/**
 * Require a specific role. Throws an error if the user does not have the required role.
 * Use in API routes to enforce role-based access.
 */
export async function requireRole(requiredRole: string) {
  const session = await requireAuth();

  if (session.user.role !== requiredRole) {
    throw new Error(`Forbidden: Requires ${requiredRole} role`);
  }

  return session;
}

/**
 * Get the current user's company ID.
 * Throws if not authenticated or no company is associated.
 */
export async function getCurrentCompanyId(): Promise<string> {
  const session = await requireAuth();

  if (!session.user.companyId) {
    throw new Error("No company associated with this account");
  }

  return session.user.companyId;
}
