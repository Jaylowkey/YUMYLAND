import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const companyId = session.user.companyId;

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    const today = new Date().toISOString().split("T")[0];

    const where: any = {
      date: { gte: today },
      status: { in: ["pending", "confirmed"] },
    };

    // If user has a company, filter by company
    if (companyId) {
      where.companyId = companyId;
    }

    const reservations = await prisma.reservation.findMany({
      where,
      orderBy: [{ date: "asc" }, { time: "asc" }],
      take: limit,
      ...(companyId ? {} : {
        include: { company: { select: { name: true } } },
      }),
    });

    // Format for the frontend
    const formatted = reservations.map((r: any) => ({
      id: r.id,
      customer: r.customerName,
      date: r.date,
      time: r.time,
      guests: r.guests,
      status: r.status,
      ...(r.company ? { companyName: r.company.name } : {}),
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    if (error.message === "Unauthorized: No active session") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Upcoming reservations error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
