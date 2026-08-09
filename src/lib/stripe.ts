import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

let _stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeSecretKey) {
    throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
  }
  if (!_stripe) {
    _stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2026-07-29.dahlia',
    });
  }
  return _stripe;
}

/** Verify a Stripe webhook signature (uses the whsec_ webhook secret). */
export function constructStripeEvent(
  payload: string,
  signature: string
): Stripe.Event {
  if (!stripeWebhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set in environment variables');
  }
  return getStripe().webhooks.constructEvent(
    payload,
    signature,
    stripeWebhookSecret
  );
}

// ─── Payment helpers ──────────────────────────────────────────────────────────

interface PaymentIntentParams {
  amount: number; // in cents
  currency: string;
  metadata?: Stripe.MetadataParam;
}

export async function createPaymentIntent({
  amount,
  currency,
  metadata,
}: PaymentIntentParams): Promise<Stripe.PaymentIntent> {
  return getStripe().paymentIntents.create({
    amount,
    currency,
    ...(metadata ? { metadata } : {}),
  });
}

interface CheckoutItem {
  price: string;
  quantity: number;
  metadata?: Stripe.MetadataParam;
}

interface CheckoutSessionParams {
  items: CheckoutItem[];
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
  metadata?: Stripe.MetadataParam;
}

export async function createCheckoutSession({
  items,
  successUrl,
  cancelUrl,
  customerEmail,
  metadata,
}: CheckoutSessionParams): Promise<Stripe.Checkout.Session> {
  return getStripe().checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: items,
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    ...(metadata ? { metadata } : {}),
    ...(customerEmail ? { customer_email: customerEmail } : {}),
  });
}