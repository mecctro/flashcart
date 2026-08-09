# FlashCart — Development Setup

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your Stripe and PayPal credentials.

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)** to see the storefront.

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — Lint and fix code
- `npm run type-check` — Run TypeScript type checking
- `npm run format` — Format code with Prettier
- `npm run clean` — Clean build artifacts

## Tech Stack

- **Frontend:** Next.js 14+, React 18, TypeScript, Tailwind CSS
- **State:** Zustand
- **Forms:** React Hook Form + Zod validation
- **Payments:** Stripe, PayPal
- **API:** GraphQL + REST
- **Icons:** Lucide React, Radix UI Icons
- **Styling:** Tailwind CSS, Tailwind Merge, Class Variance Authority

## Features

- ✅ Headless e-commerce architecture
- ✅ Product catalog with variants
- ✅ Shopping cart with persistence
- ✅ Checkout with Stripe/PayPal
- ✅ Webhook handling for payments
- ✅ Responsive design with Tailwind
- ✅ TypeScript for type safety
- ✅ ESLint + Prettier for code quality

## Environment Variables

Required for local development:

```env
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-paypal-client-id

# API
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Webhooks

Register these endpoints in your payment provider dashboards:

- **Stripe:** `https://your-domain.com/api/webhooks/stripe`
- **PayPal:** `https://your-domain.com/api/webhooks/paypal`

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   │   └── webhooks/      # Payment webhooks
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/                # Reusable UI components
│   ├── layout/            # Layout components
│   ├── product/           # Product-related components
│   ├── cart/              # Cart components
│   └── checkout/          # Checkout components
├── lib/                   # Utilities and helpers
│   ├── api.ts             # API client
│   ├── stripe.ts          # Stripe utilities
│   ├── paypal.ts          # PayPal utilities
│   ├── utils.ts           # General utilities
│   └── hooks.ts           # Custom React hooks
├── store/                 # State management
│   └── cartStore.ts       # Cart state
├── types/                 # TypeScript types
│   └── index.ts           # Shared types
└── styles/                # CSS modules
```

## Contributing

1. Follow the existing code style
2. Run `npm run lint` before committing
3. Add tests for new features
4. Update documentation as needed

## License

MIT License