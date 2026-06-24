import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, getCurrentCompanyId } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const companyId = await getCurrentCompanyId();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || "";

    const skip = (page - 1) * limit;

    const where: any = { companyId };

    if (status) {
      where.status = status;
    }

    const [reservations, total] = await Promise.all([
      prisma.reservation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.reservation.count({ where }),
    ]);

    return NextResponse.json({
      reservations,
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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const companyId = await getCurrentCompanyId();

    const body = await request.json();
    const { customerName, customerPhone, date, time, guests, notes, prepaid, amount } = body;

    if (!customerName || !customerPhone || !date || !time || !guests) {
      return NextResponse.json(
        { error: "Customer name, phone, date, time, and number of guests are required" },
        { status: 400 }
      );
    }

    const reservation = await prisma.reservation.create({
      data: {
        customerName,
        customerPhone,
        date,
        time,
        guests: parseInt(guests),
        notes: notes || null,
        prepaid: prepaid || false,
        amount: amount ? parseFloat(amount) : null,
        companyId,
      },
    });

    return NextResponse.json(reservation, { status: 201 });
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
