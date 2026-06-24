import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole("MASTER");

    const subscription = await prisma.subscription.findUnique({
      where: { id: params.id },
      include: {
        company: {
          select: { name: true, slug: true, email: true, phone: true },
        },
        payments: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(subscription);
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole("MASTER");

    const existing = await prisma.subscription.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { status } = body;

    const validStatuses = ["active", "suspended", "cancelled", "trial"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be one of: active, suspended, cancelled, trial" },
        { status: 400 }
      );
    }

    const subscription = await prisma.subscription.update({
      where: { id: params.id },
      data: { status },
      include: {
        company: {
          select: { name: true, slug: true },
        },
      },
    });

    // If subscription is suspended or cancelled, update company status
    if (status === "suspended" || status === "cancelled") {
      await prisma.company.update({
        where: { id: existing.companyId },
        data: { status: status === "cancelled" ? "suspended" : "suspended" },
      });
    } else if (status === "active") {
      await prisma.company.update({
        where: { id: existing.companyId },
        data: { status: "active" },
      });
    }

    return NextResponse.json(subscription);
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
