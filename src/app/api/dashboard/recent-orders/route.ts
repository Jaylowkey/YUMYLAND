import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, getCurrentCompanyId } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const companyId = await getCurrentCompanyId();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    const orders = await prisma.order.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        customer: {
          select: { name: true, email: true },
        },
        items: {
          include: {
            product: {
              select: { name: true, price: true },
            },
          },
        },
      },
    });

    return NextResponse.json(orders);
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
