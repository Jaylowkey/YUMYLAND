import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, getCurrentCompanyId } from "@/lib/auth-utils";
import { getPaySuiteClient } from "@/lib/paysuite";
import { createPaymentIntent } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const companyId = await getCurrentCompanyId();

    const body = await request.json();
    const { subscriptionId, paymentMethod, phone } = body;

    // Validate required fields
    if (!subscriptionId || !paymentMethod) {
      return NextResponse.json(
        { error: "subscriptionId and paymentMethod are required" },
        { status: 400 }
      );
    }

    // Validate payment method
    if (!["mpesa", "emola", "visa", "mastercard"].includes(paymentMethod)) {
      return NextResponse.json(
        { error: "paymentMethod must be 'mpesa', 'emola', 'visa', or 'mastercard'" },
        { status: 400 }
      );
    }

    // For mobile money payments, phone is required
    if (["mpesa", "emola"].includes(paymentMethod) && !phone) {
      return NextResponse.json(
        { error: "phone is required for M-Pesa and e-Mola payments" },
        { status: 400 }
      );
    }

    // Fetch the subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
        companyId,
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    const amount = subscription.amount;
    const paymentReference = `SUB-${subscriptionId}-${Date.now()}`;

    // Handle mobile money payments (M-Pesa or e-Mola) via PaySuite
    if (paymentMethod === "mpesa" || paymentMethod === "emola") {
      // Create Payment record in the database
      const payment = await prisma.payment.create({
        data: {
          amount,
          currency: "MZN",
          method: paymentMethod,
          status: "pending",
          reference: paymentReference,
          companyId,
          subscriptionId,
        },
      });

      // Initiate PaySuite payment
      const paysuite = getPaySuiteClient();
      const paysuiteResponse = await paysuite.createPayment(
        amount,
        phone,
        paymentReference,
        paymentMethod
      );

      // Update payment with transaction ID
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
          type: "mobile_money",
          message: "Payment initiated. Please confirm on your phone.",
        },
        { status: 201 }
      );
    }

    // Handle card payments (Visa or Mastercard) via Stripe
    if (paymentMethod === "visa" || paymentMethod === "mastercard") {
      // Create Stripe PaymentIntent
      const paymentIntent = await createPaymentIntent(amount, {
        companyId,
        purpose: "subscription",
        referenceId: subscriptionId,
        subscriptionPlan: subscription.plan,
      });

      // Create Payment record in the database
      const payment = await prisma.payment.create({
        data: {
          amount,
          currency: "MZN",
          method: paymentMethod,
          status: "pending",
          reference: paymentReference,
          transactionId: paymentIntent.id,
          companyId,
          subscriptionId,
        },
      });

      return NextResponse.json(
        {
          paymentId: payment.id,
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
          reference: paymentReference,
          status: "pending",
          type: "card",
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { error: "Invalid payment method" },
      { status: 400 }
    );
  } catch (error: any) {
    if (error.message === "Unauthorized: No active session") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "No company associated with this account") {
      return NextResponse.json({ error: "No company associated" }, { status: 403 });
    }
    console.error("Subscription payment error:", error);
    return NextResponse.json(
      { error: "Failed to process subscription payment" },
      { status: 500 }
    );
  }
}
