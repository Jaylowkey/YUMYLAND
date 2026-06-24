import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, getCurrentCompanyId } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const companyId = await getCurrentCompanyId();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Sales today: sum of completed orders today
    const salesToday = await prisma.order.aggregate({
      where: {
        companyId,
        createdAt: { gte: today },
        status: { in: ["delivered", "ready"] },
      },
      _sum: { total: true },
    });

    // Reservations today
    const todayStr = today.toISOString().split("T")[0];
    const reservationsToday = await prisma.reservation.count({
      where: {
        companyId,
        date: todayStr,
      },
    });

    // Active clients (customers with orders in the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeClients = await prisma.customer.count({
      where: {
        companyId,
        orders: {
          some: {
            createdAt: { gte: thirtyDaysAgo },
          },
        },
      },
    });

    // Monthly revenue
    const monthlyRevenue = await prisma.order.aggregate({
      where: {
        companyId,
        createdAt: { gte: startOfMonth },
        status: { in: ["delivered", "ready"] },
      },
      _sum: { total: true },
    });

    return NextResponse.json({
      salesToday: salesToday._sum.total || 0,
      reservationsToday,
      activeClients,
      monthlyRevenue: monthlyRevenue._sum.total || 0,
    });
  } catch (error: any) {
    if (error.message === "Unauthorized: No active session") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
