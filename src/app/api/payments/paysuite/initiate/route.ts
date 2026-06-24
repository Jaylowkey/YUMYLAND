import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, getCurrentCompanyId } from "@/lib/auth-utils";
import { getPaySuiteClient } from "@/lib/paysuite";

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const companyId = await getCurrentCompanyId();

    const body = await request.json();
    const { amount, phone, method, purpose, referenceId } = body;

    // Validate required fields
    if (!amount || !phone || !method || !purpose || !referenceId) {
      return NextResponse.json(
        { error: "amount, phone, method, purpose, and referenceId are required" },
        { status: 400 }
      );
    }

    // Validate method
    if (!["mpesa", "emola"].includes(method)) {
      return NextResponse.json(
        { error: "method must be 'mpesa' or 'emola'" },
        { status: 400 }
      );
    }

    // Validate purpose
    if (!["subscription", "reservation", "order"].includes(purpose)) {
      return NextResponse.json(
        { error: "purpose must be 'subscription', 'reservation', or 'order'" },
        { status: 400 }
      );
    }

    // Validate amount is a positive number
    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "amount must be a positive number" },
        { status: 400 }
      );
    }

    // Build the relation field based on purpose
    const relationField: Record<string, string> = {};
    if (purpose === "subscription") {
      relationField.subscriptionId = referenceId;
    } else if (purpose === "reservation") {
      relationField.reservationId = referenceId;
    } else if (purpose === "order") {
      relationField.orderId = referenceId;
    }

    // Generate a unique reference for this payment
    const paymentReference = `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Create Payment record in the database with status 'pending'
    const payment = await prisma.payment.create({
      data: {
        amount,
        currency: "MZN",
        method,
        status: "pending",
        reference: paymentReference,
        companyId,
        ...relationField,
      },
    });

    // Initiate payment via PaySuite API
    const paysuite = getPaySuiteClient();
    const paysuiteResponse = await paysuite.createPayment(
      amount,
      phone,
      paymentReference,
      method
    );

    // Update the payment record with the PaySuite transaction ID
    await prisma.payment.update({
      where: { id: payment.id },
      data: { transactionId: paysuiteResponse.transactionId },
    });

    return NextResponse.json(
      {
        paymentId: payment.id,
        transactionId: paysuiteResponse.transactionId,
        reference: paymentReference,
        status: "pending",
        message: paysuiteResponse.message || "Payment initiated. Please confirm on your phone.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.message === "Unauthorized: No active session") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "No company associated with this account") {
      return NextResponse.json({ error: "No company associated" }, { status: 403 });
    }
    console.error("PaySuite payment initiation error:", error);
    return NextResponse.json(
      { error: "Failed to initiate payment" },
      { status: 500 }
    );
  }
}
