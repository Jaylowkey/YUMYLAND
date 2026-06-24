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

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Payment ID is required" },
        { status: 400 }
      );
    }

    // Find the payment, scoped to the user's company
    const payment = await prisma.payment.findFirst({
      where: {
        id,
        companyId,
      },
      select: {
        id: true,
        amount: true,
        currency: true,
        method: true,
        status: true,
        reference: true,
        transactionId: true,
        subscriptionId: true,
        reservationId: true,
        orderId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(payment);
  } catch (error: any) {
    if (error.message === "Unauthorized: No active session") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "No company associated with this account") {
      return NextResponse.json({ error: "No company associated" }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
