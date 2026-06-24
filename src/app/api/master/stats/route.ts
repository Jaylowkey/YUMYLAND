import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  try {
    await requireRole("MASTER");

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [totalCompanies, totalCustomers, activeSubscriptions, monthlyRevenue] = await Promise.all([
      prisma.company.count(),
      prisma.customer.count(),
      prisma.subscription.count({
        where: { status: "active" },
      }),
      prisma.payment.aggregate({
        where: {
          createdAt: { gte: startOfMonth },
          status: "completed",
        },
        _sum: { amount: true },
      }),
    ]);

    return NextResponse.json({
      totalCompanies,
      totalCustomers,
      activeSubscriptions,
      monthlyRevenue: monthlyRevenue._sum.amount || 0,
    });
  } catch (error: any) {
    if (error.message === "Unauthorized: No active session") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message?.includes("Requires MASTER role")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
