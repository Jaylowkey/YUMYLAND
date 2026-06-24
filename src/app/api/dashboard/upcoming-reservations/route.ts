import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, getCurrentCompanyId } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const companyId = await getCurrentCompanyId();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    const today = new Date().toISOString().split("T")[0];

    const reservations = await prisma.reservation.findMany({
      where: {
        companyId,
        date: { gte: today },
        status: { in: ["pending", "confirmed"] },
      },
      orderBy: [{ date: "asc" }, { time: "asc" }],
      take: limit,
    });

    return NextResponse.json(reservations);
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
