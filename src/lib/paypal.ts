import { Product } from '@/types';

// ─── Environment ───────────────────────────────────────────────────────────

export const PAYPAL_CLIENT_ID =
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';

export const PAYPAL_CURRENCY = 'USD';

// ─── Server-side: create PayPal order ──────────────────────────────────────

interface PayPalItem {
  id: string;
  product: Product;
  quantity: number;
}

export async function createPayPalOrder(items: PayPalItem[]) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || ''}/payments/paypal/orders`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            items: items.map((item) => ({
              id: item.id,
              name: item.product.title,
              unit_amount: {
                currency_code: 'USD',
                value: (item.product.price / 100).toFixed(2),
              },
              quantity: item.quantity,
              product_id: item.product.id,
            })),
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`PayPal order creation failed: ${response.status}`);
  }

  return response.json();
}

// ─── Server-side: capture PayPal payment ───────────────────────────────────

export async function capturePayPalOrder(orderId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || ''}/payments/paypal/orders/${orderId}/capture`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }
  );

  if (!response.ok) {
    throw new Error(`PayPal capture failed: ${response.status}`);
  }

  return response.json();
}

// ─── Server-side: get client token (for SDK) ───────────────────────────────

interface ClientTokenResponse {
  client_token: string;
}

export async function getDataClientToken(): Promise<ClientTokenResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || ''}/payments/paypal/client-token`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch PayPal client token: ${response.status}`);
  }

  return response.json();
}