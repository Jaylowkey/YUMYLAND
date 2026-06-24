import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { constructWebhookEvent } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    // Get the raw body and Stripe signature header
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature") || "";

    if (!signature) {
      return NextResponse.json(
        { error: "Missing Stripe signature" },
        { status: 400 }
      );
    }

    // Verify and construct the webhook event
    let event;
    try {
      event = constructWebhookEvent(rawBody, signature);
    } catch (err: any) {
      console.error("Stripe webhook signature verification failed:", err.message);
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    // Handle different event types
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as any;
        await handlePaymentSucceeded(paymentIntent);
        break;
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as any;
        await handlePaymentFailed(paymentIntent);
        break;
      }
      default:
        // Acknowledge unhandled event types
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

/**
 * Handle a successful payment from Stripe.
 * Update the Payment record and related entities.
 */
async function handlePaymentSucceeded(paymentIntent: any) {
  const payment = await prisma.payment.findUnique({
    where: { transactionId: paymentIntent.id },
  });

  if (!payment) {
    console.warn(`Stripe webhook: Payment not found for PaymentIntent ${paymentIntent.id}`);
    return;
  }

  // Update payment status to completed
  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: "completed" },
  });

  // Handle related entity updates
  if (payment.subscriptionId) {
    await prisma.subscription.update({
      where: { id: payment.subscriptionId },
      data: { status: "active" },
    });
  }

  if (payment.reservationId) {
    await prisma.reservation.update({
      where: { id: payment.reservationId },
      data: {
        status: "confirmed",
        prepaid: true,
      },
    });
  }

  if (payment.orderId) {
    await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: "preparing" },
    });
  }
}

/**
 * Handle a failed payment from Stripe.
 * Update the Payment record status to 'failed'.
 */
async function handlePaymentFailed(paymentIntent: any) {
  const payment = await prisma.payment.findUnique({
    where: { transactionId: paymentIntent.id },
  });

  if (!payment) {
    console.warn(`Stripe webhook: Payment not found for PaymentIntent ${paymentIntent.id}`);
    return;
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: "failed" },
  });
}
