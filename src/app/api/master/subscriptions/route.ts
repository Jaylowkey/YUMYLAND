import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  try {
    await requireRole("MASTER");

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || "";

    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          company: {
            select: { name: true, slug: true },
          },
        },
      }),
      prisma.subscription.count({ where }),
    ]);

    return NextResponse.json({
      subscriptions,
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

export async function POST(request: NextRequest) {
  try {
    await requireRole("MASTER");

    const body = await request.json();
    const { companyId, plan, amount, paymentMethod, startDate, endDate } = body;

    if (!companyId || !plan || !amount || !paymentMethod || !startDate || !endDate) {
      return NextResponse.json(
        { error: "companyId, plan, amount, paymentMethod, startDate, and endDate are required" },
        { status: 400 }
      );
    }

    // Verify company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    const subscription = await prisma.subscription.create({
      data: {
        companyId,
        companyName: company.name,
        plan,
        amount: parseFloat(amount),
        paymentMethod,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: "active",
      },
      include: {
        company: {
          select: { name: true, slug: true },
        },
      },
    });

    // Update company plan
    await prisma.company.update({
      where: { id: companyId },
      data: { plan, status: "active" },
    });

    return NextResponse.json(subscription, { status: 201 });
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
