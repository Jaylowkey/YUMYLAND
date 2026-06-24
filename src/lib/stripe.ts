import Stripe from "stripe";

/**
 * Initialize Stripe client with the secret key.
 */
function getStripeClient(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY environment variable is not set");
  }

  return new Stripe(secretKey, {
    apiVersion: "2024-06-20",
    typescript: true,
  });
}

// Singleton instance
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    stripeInstance = getStripeClient();
  }
  return stripeInstance;
}

/**
 * Convert MZN amount to the smallest currency unit (cents).
 * Stripe requires amounts in the smallest unit of the currency.
 * For MZN (Mozambican Metical), 1 MZN = 100 centavos.
 */
export function convertToSmallestUnit(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Create a Stripe PaymentIntent for card payments.
 * Amount should be provided in MZN (will be converted to cents).
 */
export async function createPaymentIntent(
  amount: number,
  metadata: Record<string, string> = {}
): Promise<Stripe.PaymentIntent> {
  const stripe = getStripe();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: convertToSmallestUnit(amount),
    currency: "mzn",
    metadata,
    payment_method_types: ["card"],
  });

  return paymentIntent;
}

/**
 * Construct and verify a Stripe webhook event.
 * Throws if the signature is invalid.
 */
export function constructWebhookEvent(
  body: string | Buffer,
  signature: string
): Stripe.Event {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET environment variable is not set");
  }

  return stripe.webhooks.constructEvent(body, signature, webhookSecret);
}

export default getStripe;
