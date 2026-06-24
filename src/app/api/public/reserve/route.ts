import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyId, customerName, customerPhone, date, time, guests, notes } = body;

    if (!companyId || !customerName || !customerPhone || !date || !time || !guests) {
      return NextResponse.json(
        { error: "companyId, customerName, customerPhone, date, time, and guests are required" },
        { status: 400 }
      );
    }

    // Verify company exists and is active
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    if (company.status === "suspended") {
      return NextResponse.json(
        { error: "This restaurant is currently not accepting reservations" },
        { status: 403 }
      );
    }

    // Validate date is not in the past
    const reservationDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (reservationDate < today) {
      return NextResponse.json(
        { error: "Cannot make a reservation for a past date" },
        { status: 400 }
      );
    }

    // Validate guests count
    const guestsCount = parseInt(guests);
    if (isNaN(guestsCount) || guestsCount < 1 || guestsCount > 50) {
      return NextResponse.json(
        { error: "Number of guests must be between 1 and 50" },
        { status: 400 }
      );
    }

    const reservation = await prisma.reservation.create({
      data: {
        customerName,
        customerPhone,
        date,
        time,
        guests: guestsCount,
        notes: notes || null,
        companyId,
        status: "pending",
      },
    });

    return NextResponse.json(
      {
        message: "Reservation created successfully",
        reservation: {
          id: reservation.id,
          customerName: reservation.customerName,
          date: reservation.date,
          time: reservation.time,
          guests: reservation.guests,
          status: reservation.status,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
