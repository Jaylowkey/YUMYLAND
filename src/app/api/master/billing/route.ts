import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  try {
    await requireRole("MASTER");

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          company: {
            select: { id: true, name: true },
          },
        },
      }),
      prisma.payment.count(),
    ]);

    // Aggregate summary stats
    const [completedAgg, pendingAgg, failedAgg] = await Promise.all([
      prisma.payment.aggregate({
        where: { status: "completed" },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: { status: "pending" },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: { status: "failed" },
        _sum: { amount: true },
      }),
    ]);

    const summary = {
      totalReceived: completedAgg._sum.amount || 0,
      totalPending: pendingAgg._sum.amount || 0,
      totalFailed: failedAgg._sum.amount || 0,
      transactionCount: total,
    };

    return NextResponse.json({
      payments,
      summary,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
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
