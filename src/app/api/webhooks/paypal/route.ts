import { NextRequest, NextResponse } from 'next/server';

/**
 * PayPal webhook endpoint.
 * Handles events like PAYMENT.CAPTURE.COMPLETED, PAYMENT.CAPTURE.DENIED, etc.
 *
 * IMPORTANT: Must be registered in the PayPal Developer Dashboard with your webhook URL.
 * Enable events: PAYMENT.CAPTURE.COMPLETED, PAYMENT.CAPTURE.DENIED, etc.
 *
 * Example event payload (simplified):
 * {
 *   "event_version": "1.0",
 *   "event_type": "PAYMENT.CAPTURE.COMPLETED",
 *   "create_time": "2024-01-01T00:00:00Z",
 *   "resource_type": "CAPTURE",
 *   "resource": {
 *     "id": "3L12345678901234",
 *     "status": "COMPLETED",
 *     "amount": { "currency_code": "USD", "value": "49.99" }
 *   }
 * }
 */

interface PayPalCapture {
  id: string;
  status?: string;
  custom_id?: string;
  amount?: { currency_code?: string; value?: string };
}

interface PayPalWebhookEvent {
  event_type: string;
  resource?: PayPalCapture;
}

export const runtime = 'nodejs';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as PayPalWebhookEvent;
    const event = body;

    console.log(`[PayPal Webhook] Received event: ${event.event_type}`);

    // Verify webhook signature if you have configured one
    // const isValid = await verifyPayPalWebhookSignature(request, body);
    // if (!isValid) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    // }

    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED': {
        const capture = event.resource;
        if (!capture) break;
        console.log(`[PayPal] Payment completed: ${capture.id}`);

        // Fulfill the order
        await fulfillPayPalOrder(capture);
        break;
      }

      case 'PAYMENT.CAPTURE.DENIED': {
        const capture = event.resource;
        if (!capture) break;
        console.warn(`[PayPal] Payment denied: ${capture.id}`);
        // Handle failed payment, notify customer, etc.
        break;
      }

      case 'PAYMENT.CAPTURE.PENDING': {
        const capture = event.resource;
        if (!capture) break;
        console.log(`[PayPal] Payment pending: ${capture.id}`);
        // Handle pending payment (e.g., waiting for bank approval)
        break;
      }

      default:
        console.log(`[PayPal] Unhandled event type: ${event.event_type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[PayPal Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Fulfill a PayPal payment capture.
 */
async function fulfillPayPalOrder(capture: PayPalCapture) {
  // TODO: Integrate with your order database
  // - Find order by capture.custom_id or PayPal metadata
  // - Mark as "paid"
  // - Send confirmation email
  // - Trigger fulfillment
  console.log(`[PayPal] Fulfilling order for capture: ${capture.id}`);

  // Example: Extract order ID from custom_id or metadata
  if (capture.custom_id) {
    console.log(`[PayPal] Order ID: ${capture.custom_id}`);
  }
}