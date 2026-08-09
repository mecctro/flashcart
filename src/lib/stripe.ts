// Stripe utilities — conditionally import Stripe on server-side
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

let stripe: any = null;

// Helper to construct Stripe event for webhooks
export function constructStripeEvent(payload: string, signature: string) {
  if (!stripe) {
    throw new Error('Stripe not initialized on server');
  }

  return stripe.webhooks.constructEvent(payload, signature, stripeSecretKey);
}

// ─── Payment helpers ──────────────────────────────────────────────────────────

export async function createPaymentIntent({
  amount,
  currency,
  metadata = {},
}: {
  amount: number; // in cents
  currency: string;
  metadata?: Record<string, string>;
}) {
  if (!stripe) {
    throw new Error('Stripe not initialized on server');
  }

  return stripe.paymentIntents.create({
    amount,
    currency,
    metadata,
  });
}

export async function createCheckoutSession({
  items,
  successUrl,
  cancelUrl,
  customerEmail,
  metadata = {},
}: {
  items: Array<{
    price: string;
    quantity: number;
    metadata?: Record<string, string>;
  }>;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
}) {
  if (!stripe) {
    throw new Error('Stripe not initialized on server');
  }

  const sessionParams: any = {
    payment_method_types: ['card'],
    line_items: items,
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
  };

  if (customerEmail) {
    sessionParams.customer_email = customerEmail;
  }

  return stripe.checkout.sessions.create(sessionParams);
}

// ─── Type re-exports ──────────────────────────────────────────────────────────

export type StripeTypes = {
  PaymentIntent: any;
  CheckoutSession: any;
};

// ─── Server-side initialization ────────────────────────────────────────────────

if (typeof window === 'undefined') {
  // Server-side — import Stripe
  import('stripe').then((StripeModule) => {
    const StripeConstructor = (StripeModule as any).default || StripeModule;
    stripe = new StripeConstructor(stripeSecretKey, {
      apiVersion: '2026-07-29.dahlia' as any,
      typescript: true,
    });
  });
}