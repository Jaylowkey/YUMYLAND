import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const companyId = session.user.companyId;

    // If user is MASTER without a company, return platform-wide stats
    if (!companyId) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      const [totalPayments, reservationsToday, activeClients, monthlyPayments] = await Promise.all([
        prisma.payment.aggregate({
          where: { createdAt: { gte: today }, status: "completed" },
          _sum: { amount: true },
        }),
        prisma.reservation.count({
          where: { date: today.toISOString().split("T")[0] },
        }),
        prisma.customer.count(),
        prisma.payment.aggregate({
          where: { createdAt: { gte: startOfMonth }, status: "completed" },
          _sum: { amount: true },
        }),
      ]);

      return NextResponse.json({
        salesToday: totalPayments._sum.amount || 0,
        reservationsToday,
        activeClients,
        monthlyRevenue: monthlyPayments._sum.amount || 0,
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const todayStr = today.toISOString().split("T")[0];

    // Sales today: sum of completed payments today
    const salesToday = await prisma.payment.aggregate({
      where: {
        companyId,
        createdAt: { gte: today },
        status: "completed",
      },
      _sum: { amount: true },
    });

    // Reservations today
    const reservationsToday = await prisma.reservation.count({
      where: {
        companyId,
        date: todayStr,
      },
    });

    // Active clients (total customers for this company)
    const activeClients = await prisma.customer.count({
      where: { companyId },
    });

    // Monthly revenue
    const monthlyRevenue = await prisma.payment.aggregate({
      where: {
        companyId,
        createdAt: { gte: startOfMonth },
        status: "completed",
      },
      _sum: { amount: true },
    });

    return NextResponse.json({
      salesToday: salesToday._sum.amount || 0,
      reservationsToday,
      activeClients,
      monthlyRevenue: monthlyRevenue._sum.amount || 0,
    });
  } catch (error: any) {
    if (error.message === "Unauthorized: No active session") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
