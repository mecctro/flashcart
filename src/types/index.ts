/**
 * Shared TypeScript interfaces for FlashCart
 */

// --- Product ---
export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number; // cents
  originalPrice?: number; // cents (for discounts)
  currency: string;
  images: string[];
  thumbnail: string;
  inStock: boolean;
  stockQuantity?: number;
  inventoryPolicy?: 'deny' | 'continue';
  rating: number;
  reviewCount: number;
  tags: string[];
  vendorId: string;
  categoryId: string;
  category: Category;
  attributes: Record<string, string | number>;
  seo?: Seo;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  children?: Category[];
}

export interface Seo {
  title?: string;
  description?: string;
  keywords?: string[];
  openGraph?: OpenGraph;
}

export interface OpenGraph {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

// --- Cart ---
export interface CartItem extends Product {
  quantity: number;
  selectedAttributes: Record<string, string>;
  priceAtAdd: number; // cents — snapshot to prevent price drift
}

export interface CartState {
  items: CartItem[];
  couponCode?: string;
  discountAmount: number; // cents
  totalItems: number;
  subtotal: number; // cents
  tax: number; // cents
  shipping: number; // cents
  total: number; // cents
}

// --- Checkout ---
export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CustomerInfo {
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  customer: CustomerInfo;
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  paymentMethod: 'stripe' | 'paypal' | 'cod';
  paymentIntentId?: string;
  paypalOrderId?: string;
  createdAt: string;
  updatedAt: string;
  vendorId?: string;
  estimatedDelivery?: string;
}

// --- Payments ---
export interface PaymentIntent {
  clientSecret: string;
  amount: number;
  currency: string;
}

export interface PayPalOrderResponse {
  id: string;
  status: string;
  links: Array<{ rel: string; href: string }>;
}

// --- API Responses ---
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
}

// --- Stripe / PayPal webhook payloads ---
export interface StripeWebhookEvent {
  id: string;
  object: string;
  type: string;
  data: { object: Record<string, unknown> };
  livemode: boolean;
  pending_webhook_deliveries?: number;
  request: {
    id?: string | null;
    idempotency_key?: string | null;
  };
  created: number;
}

export interface PayPalWebhookEvent {
  id: string;
  eventType: string;
  createTime: string;
  resource: Record<string, unknown>;
  links: Array<{ href: string; rel: string }>;
}
