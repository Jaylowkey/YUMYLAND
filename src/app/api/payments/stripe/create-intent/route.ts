import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, getCurrentCompanyId } from "@/lib/auth-utils";
import { createPaymentIntent } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const companyId = await getCurrentCompanyId();

    const body = await request.json();
    const { amount, purpose, referenceId, paymentMethod } = body;

    // Validate required fields
    if (!amount || !purpose || !referenceId) {
      return NextResponse.json(
        { error: "amount, purpose, and referenceId are required" },
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

    // Determine payment method for the record (visa or mastercard)
    const method = paymentMethod === "mastercard" ? "mastercard" : "visa";

    // Build the relation field based on purpose
    const relationField: Record<string, string> = {};
    if (purpose === "subscription") {
      relationField.subscriptionId = referenceId;
    } else if (purpose === "reservation") {
      relationField.reservationId = referenceId;
    } else if (purpose === "order") {
      relationField.orderId = referenceId;
    }

    // Create Stripe PaymentIntent
    const paymentIntent = await createPaymentIntent(amount, {
      companyId,
      purpose,
      referenceId,
    });

    // Generate a reference for the payment
    const paymentReference = `STRIPE-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Create Payment record in the database
    const payment = await prisma.payment.create({
      data: {
        amount,
        currency: "MZN",
        method,
        status: "pending",
        reference: paymentReference,
        transactionId: paymentIntent.id,
        companyId,
        ...relationField,
      },
    });

    return NextResponse.json(
      {
        paymentId: payment.id,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        reference: paymentReference,
        status: "pending",
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
    console.error("Stripe create-intent error:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
