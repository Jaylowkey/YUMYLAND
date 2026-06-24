import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, getCurrentCompanyId } from "@/lib/auth-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const companyId = await getCurrentCompanyId();

    const reservation = await prisma.reservation.findFirst({
      where: { id: params.id, companyId },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(reservation);
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const companyId = await getCurrentCompanyId();

    const existing = await prisma.reservation.findFirst({
      where: { id: params.id, companyId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { customerName, customerPhone, date, time, guests, notes, prepaid, amount } = body;

    const reservation = await prisma.reservation.update({
      where: { id: params.id },
      data: {
        ...(customerName && { customerName }),
        ...(customerPhone && { customerPhone }),
        ...(date && { date }),
        ...(time && { time }),
        ...(guests !== undefined && { guests: parseInt(guests) }),
        ...(notes !== undefined && { notes }),
        ...(prepaid !== undefined && { prepaid }),
        ...(amount !== undefined && { amount: amount ? parseFloat(amount) : null }),
      },
    });

    return NextResponse.json(reservation);
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const companyId = await getCurrentCompanyId();

    const existing = await prisma.reservation.findFirst({
      where: { id: params.id, companyId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { status } = body;

    const validStatuses = ["pending", "confirmed", "cancelled", "completed"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be one of: pending, confirmed, cancelled, completed" },
        { status: 400 }
      );
    }

    const reservation = await prisma.reservation.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json(reservation);
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
