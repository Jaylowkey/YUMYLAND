import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getPaySuiteClient } from "@/lib/paysuite";

export async function POST(request: NextRequest) {
  try {
    // Get the raw body and signature for verification
    const rawBody = await request.text();
    const signature = request.headers.get("x-paysuite-signature") || "";

    if (!signature) {
      return NextResponse.json(
        { error: "Missing webhook signature" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const paysuite = getPaySuiteClient();
    const isValid = paysuite.verifyWebhook(rawBody, signature);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    // Parse the verified payload
    const payload = JSON.parse(rawBody);
    const { transactionId, status, reference } = payload;

    if (!transactionId || !status) {
      return NextResponse.json(
        { error: "Invalid webhook payload" },
        { status: 400 }
      );
    }

    // Find the payment record by transactionId or reference
    const payment = await prisma.payment.findFirst({
      where: {
        OR: [
          { transactionId },
          { reference },
        ],
      },
    });

    if (!payment) {
      // Payment not found - acknowledge the webhook but log warning
      console.warn(`PaySuite webhook: Payment not found for transactionId ${transactionId}`);
      return NextResponse.json({ received: true, warning: "Payment not found" });
    }

    // Map PaySuite status to our PaymentStatus enum
    let paymentStatus: "completed" | "failed" | "pending";
    if (status === "completed" || status === "success") {
      paymentStatus = "completed";
    } else if (status === "failed" || status === "cancelled") {
      paymentStatus = "failed";
    } else {
      paymentStatus = "pending";
    }

    // Update the payment record
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: paymentStatus,
        transactionId: transactionId,
      },
    });

    // If payment is completed, update related entities
    if (paymentStatus === "completed") {
      await handlePaymentCompleted(payment);
    }

    return NextResponse.json({ received: true, status: paymentStatus });
  } catch (error: any) {
    console.error("PaySuite webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

/**
 * Handle business logic when a payment is marked as completed.
 * Activates subscriptions, confirms reservations, or updates orders.
 */
async function handlePaymentCompleted(payment: {
  id: string;
  subscriptionId: string | null;
  reservationId: string | null;
  orderId: string | null;
}) {
  // Activate subscription if this was a subscription payment
  if (payment.subscriptionId) {
    await prisma.subscription.update({
      where: { id: payment.subscriptionId },
      data: { status: "active" },
    });
  }

  // Confirm reservation if this was a reservation payment
  if (payment.reservationId) {
    await prisma.reservation.update({
      where: { id: payment.reservationId },
      data: {
        status: "confirmed",
        prepaid: true,
      },
    });
  }

  // Update order status if this was an order payment
  if (payment.orderId) {
    await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: "preparing" },
    });
  }
}
