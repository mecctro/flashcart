# FlashCart ⚡

> A lightning-fast, production-grade **headless e-commerce storefront** built with **Next.js 14+**, **TypeScript**, **Tailwind CSS**, and **GraphQL/REST API integration**. Features secure **Stripe** & **PayPal** webhook handling for production-ready payments.

[![Next.js](https://img.shields.io/badge/Next.js-14+-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3+-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Stripe](https://img.shields.io/badge/Stripe-635BFF?logo=stripe&logoColor=white)](https://stripe.com/)
[![PayPal](https://img.shields.io/badge/PayPal-00457C?logo=paypal&logoColor=white)](https://www.paypal.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🚀 Features

| Area | Highlights |
|------|------------|
| **Performance** | ⚡ Next.js App Router, Server Components, ISR, Edge caching, optimized images |
| **UI/UX** | 🎨 Tailwind CSS design system, responsive mobile-first, accessible (WCAG 2.1 AA) |
| **Payments** | 💳 Stripe Checkout / Elements + PayPal Smart Buttons, webhook verification, idempotency |
| **Cart & Checkout** | 🛒 Client-side cart (Zustand), server-side order creation, inventory reservation |
| **Data Layer** | 🔗 GraphQL (Apollo) + REST fallback, typed hooks, optimistic updates |
| **Auth (optional)** | 🔐 NextAuth.js ready, JWT sessions, social providers |
| **Observability** | 📊 Structured logging (Pino), error tracking (Sentry), webhook audit logs |
| **Testing** | ✅ Vitest + React Testing Library (unit), Playwright (e2e) |
| **CI/CD** | 🔁 GitHub Actions: lint, type-check, test, build, deploy to Vercel |

---

## 📦 Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14 (App Router, Server Components) |
| **Language** | TypeScript 5 (strict mode) |
| **Styling** | Tailwind CSS 3, Headless UI, Radix UI primitives |
| **State** | Zustand (cart), TanStack Query (server state) |
| **API** | GraphQL (Apollo Client) + REST (fetch wrapper) |
| **Payments** | Stripe Node SDK, PayPal Node SDK, webhook signatures |
| **Validation** | Zod (schemas), React Hook Form |
| **Testing** | Vitest, React Testing Library, Playwright |
| **Lint/Format** | ESLint (Airbnb + Next), Prettier, Husky |
| **Deploy** | Vercel (recommended), Docker-ready |

---

## 🗂 Project Structure

```text
FlashCart/
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router pages & layouts
│   │   ├── (auth)/         # Auth route group
│   │   ├── (shop)/         # Public shop routes
│   │   ├── api/            # API routes (webhooks, server actions)
│   │   └── checkout/       # Multi-step checkout flow
│   ├── components/
│   │   ├── ui/             # Reusable design-system primitives
│   │   ├── layout/         # Header, Footer, Navigation
│   │   ├── product/        # ProductCard, ProductGrid, PDP
│   │   ├── cart/           # CartDrawer, CartSummary, LineItem
│   │   └── checkout/       # ShippingForm, PaymentMethod, ReviewOrder
│   ├── context/            # React Context providers (CartProvider, etc.)
│   ├── hooks/              # Custom hooks (useCart, useProducts, etc.)
│   ├── lib/
│   │   ├── api/            # GraphQL client, REST wrapper, endpoints
│   │   ├── stripe/         # Stripe server/client helpers
│   │   ├── paypal/         # PayPal server/client helpers
│   │   ├── utils/          # Formatters, validators, constants
│   │   └── hooks/          # Shared TanStack Query hooks
│   ├── styles/             # Global CSS, Tailwind config extensions
│   └── types/              # Shared TypeScript interfaces
├── .github/workflows/      # CI/CD pipelines
├── tests/                  # Playwright e2e specs
├── docker/                 # Dockerfile, docker-compose.yml
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🛠 Getting Started

### Prerequisites

- Node.js **≥ 20** (LTS)
- npm **≥ 10** (or pnpm/yarn)
- Stripe account (test keys)
- PayPal Developer account (sandbox)
- Backend API (GraphQL/REST) — see **Environment Variables**

### Installation

```bash
# 1️⃣ Clone
git clone https://github.com/<your-org>/FlashCart.git
cd FlashCart

# 2️⃣ Install deps
npm ci

# 3️⃣ Configure env
cp .env.example .env.local
# edit .env.local with your keys

# 4️⃣ Run dev server
npm run dev
```

Open <http://localhost:3000> 🎉

---

## ⚙️ Environment Variables

| Variable | Required | Description |
|----------|:--------:|-------------|
| `NEXT_PUBLIC_API_URL` | ✅ | GraphQL/REST backend base URL |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅ | Stripe publishable key |
| `STRIPE_SECRET_KEY` | ✅ | Stripe secret key (server-only) |
| `STRIPE_WEBHOOK_SECRET` | ✅ | `whsec_…` from Stripe CLI / Dashboard |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | ✅ | PayPal client ID |
| `PAYPAL_CLIENT_SECRET` | ✅ | PayPal secret (server-only) |
| `PAYPAL_WEBHOOK_ID` | ✅ | PayPal webhook ID for verification |
| `NEXT_PUBLIC_APP_URL` | ✅ | Canonical frontend URL (for webhooks) |
| `SENTRY_DSN` | ❌ | Error tracking (optional) |
| `NEXT_PUBLIC_GA_ID` | ❌ | Google Analytics 4 (optional) |

> **Never commit real secrets.** Use `.env.local` (git-ignored) locally; configure in Vercel / CI secrets for deployments.

---

## 🧪 Testing

```bash
# Unit / integration
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# E2E (Playwright)
npm run test:e2e
```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | ESLint + Prettier check |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run type-check` | `tsc --noEmit` |
| `npm run test` | Vitest unit tests |
| `npm run test:e2e` | Playwright e2e tests |
| `npm run format` | Prettier write |
| `npm run prepare` | Husky install (post-install) |

---

## 🔐 Webhook Security

Both Stripe and PayPal webhooks are verified **server-side**:

```ts
// src/app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { Webhook } from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;
  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle event.type → order.created, payment_intent.succeeded, etc.
  return new Response(null, { status: 200 });
}
```

PayPal uses `PAYPAL_WEBHOOK_ID` + `paypal-webhook-sdk` verification.

---

## 🐳 Docker (Production)

```bash
# Build image
docker build -t flashcart -f docker/Dockerfile .

# Run container
docker run -p 3000:3000 --env-file .env.production flashcart
```

`docker-compose.yml` spins up the app + a local Redis (for cart caching) for full-stack local dev.

---

## 🚢 Deployment (Vercel)

1. Push to GitHub.
2. Import project in **Vercel** → **Add Environment Variables** (from table above).
3. Deploy 🎉 — Preview on every PR, Production on `main`.

> **Edge Middleware** rewrites `/checkout/*` to the Node runtime (required for Stripe/PayPal Node SDKs).

---

## 🤝 Contributing

1. Fork → create feature branch (`git checkout -b feat/amazing-feature`)
2. Commit with **Conventional Commits** (`feat: add product quick-view`)
3. Push → open PR → CI must pass (lint, type-check, tests, build)
4. Code review → squash merge

---

## 📄 License

MIT © [Your Name / Organization](https://github.com/your-org)

---

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/) — The React Framework for Production
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS
- [Stripe](https://stripe.com/) & [PayPal](https://www.paypal.com/) — Payment infrastructure
- [Radix UI](https://www.radix-ui.com/) — Unstyled, accessible primitives
- [Vercel](https://vercel.com/) — Zero-config deployment