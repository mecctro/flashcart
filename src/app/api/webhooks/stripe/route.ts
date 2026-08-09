import type { Stripe } from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { constructStripeEvent } from '@/lib/stripe';
import { Readable } from 'node:stream';
import { finished } from 'node:stream/promises';
import { Buffer } from 'node:buffer';

/**
 * Stripe webhook endpoint.
 *
 * IMPORTANT: Disable body parsing — Stripe requires the raw body
 * to verify the webhook signature.
 *
 * Register this endpoint in the Stripe Dashboard:
 *   https://<your-domain>/api/webhooks/stripe
 */
export const runtime = 'nodejs';

/** Convert a NextRequest body ReadableStream into a raw Buffer */
async function streamToBuffer(stream: ReadableStream): Promise<Buffer> {
  const readable = new Readable().wrap(stream as unknown as NodeJS.ReadableStream);
  const chunks: Buffer[] = [];
  for await (const chunk of readable) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Stripe signature header missing' },
      { status: 400 }
    );
  }

  let event;

  try {
    const payload = await streamToBuffer(request.body!);
    event = constructStripeEvent(payload.toString('utf8'), signature);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[webhook] Signature verification failed:', message);
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    );
  }

  console.log(`[webhook] Received event: ${event.type}`);

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      await fulfillOrder(session);
      break;
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`[webhook] Payment succeeded for: ${paymentIntent.id}`);
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.warn(`[webhook] Payment failed for: ${paymentIntent.id}`);
      break;
    }

    default:
      console.log(`[webhook] Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function fulfillOrder(session: Stripe.Checkout.Session) {
  console.log(`[webhook] Fulfilling order for session: ${session.id}`);

  if (session.metadata?.orderId) {
    console.log(`[webhook] Order ID: ${session.metadata.orderId}`);
  }
}
