# ArtisticBuz - Hair Graft Calculator

A professional, subscription-gated hair restoration tool that provides clinically guided graft estimates, local currency pricing, 3D scalp visualisation, and specialist consultation forms. Built as a full-stack Next.js application with Supabase auth, Stripe payments, and Sanity CMS.

**Live site:** [artisticbuz.com](https://artisticbuz.com)

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Architecture Overview](#architecture-overview)
- [Calculator Logic](#calculator-logic)
- [Authentication and Subscriptions](#authentication-and-subscriptions)
- [Stripe Integration](#stripe-integration)
- [Sanity CMS](#sanity-cms)
- [Email](#email)
- [Currency Detection](#currency-detection)
- [API Routes](#api-routes)
- [Deployment](#deployment)
- [Social Media](#social-media)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5.2 |
| Styling | Tailwind CSS 3 + shadcn/ui (Radix UI) |
| Auth and DB | Supabase |
| Payments | Stripe (Checkout Sessions + Webhooks) |
| CMS | Sanity v4 |
| 3D Model | Spline (`@splinetool/react-spline`) |
| Email | Nodemailer (SMTP) |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |

---

## Project Structure

```
apps/web-app/
├── app/
│   ├── api/
│   │   ├── consultation/             # Consultation form submission endpoint
│   │   ├── create-checkout-session/  # Stripe checkout session creation
│   │   ├── cron/                     # Scheduled subscription expiry checks
│   │   ├── send-email/               # Nodemailer SMTP email dispatch
│   │   ├── verify-payment/           # Post-payment Stripe session verification
│   │   └── webhook/                  # Stripe webhook handler
│   ├── blogs/
│   │   ├── page.tsx                  # Blog listing page (ISR, revalidate 60s)
│   │   └── [slug]/page.tsx           # Blog post detail page (ISR)
│   ├── success/                      # Post-payment success and onboarding page
│   ├── privacy-policy/
│   ├── terms-of-service/
│   ├── cookie-policy/
│   ├── HomeClient.tsx                # Main homepage client component
│   ├── layout.tsx                    # Root layout (AuthProvider, Header, Footer, Meta Pixel)
│   ├── page.tsx                      # Homepage server entry
│   └── sitemap.ts                    # Dynamic XML sitemap (blog posts)
│
├── components/
│   ├── auth/
│   │   └── auth-modal.tsx            # Sign in / Sign up dialog
│   ├── calculator/
│   │   ├── baldness-type-card.tsx
│   │   ├── baldness-type-grid.tsx
│   │   ├── consultation-form-modal.tsx
│   │   └── result-panel.tsx
│   ├── faq/
│   │   └── faq-section.tsx           # Sanity-fetched FAQs with hardcoded fallback
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── policy-layout.tsx         # Shared layout for policy pages
│   ├── subscription/
│   │   └── subscription-modal.tsx
│   ├── HairCalculator.tsx            # Area-based graft calculator (Step 1)
│   ├── HairSpline.tsx                # Spline 3D head model with timeout guard
│   └── MetaPixel.tsx                 # Meta (Facebook) Pixel tracker
│
├── contexts/
│   └── auth-context.tsx              # React context: user, session, isSubscribed
│
├── lib/
│   ├── calculator-data.ts            # Norwood types, FAQ fallback, pricing tiers
│   ├── currency-service.ts           # Country detection + exchange rates + cache
│   ├── sanityClient.ts               # Sanity CDN client
│   ├── sanityEnv.ts                  # Sanity project ID, dataset, API version
│   ├── sanityImage.ts                # Sanity image URL builder
│   ├── spline-area-map.ts            # Maps Spline click events to scalp area keys
│   ├── subscription-utils.ts         # Client-side subscription expiry check
│   ├── subscription-utils-server.ts  # Server-side subscription check
│   ├── supabase.ts                   # Browser Supabase client
│   ├── supabase-server.ts            # Server Supabase client (cookies-based)
│   └── use-calculation-history.ts    # localStorage hook: last 5 calculations
│
├── sanity/
│   └── artisticbuz-content-hub/
│       ├── sanity.config.ts          # Studio config with grouped desk structure
│       └── schemaTypes/
│           ├── blog.ts               # Blog posts schema
│           ├── author.ts             # Author profiles schema
│           ├── faq.ts                # FAQ items schema
│           └── partner.ts            # Partner clinic listings schema
│
└── types/
    └── calculator.ts                 # BaldnessType interface
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project
- A Stripe account
- A Sanity project (Project ID: `e0x9v54x`, Dataset: `production`)
- An SMTP mail server

### Install dependencies

```bash
cd apps/web-app
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run the Sanity Studio

```bash
cd sanity/artisticbuz-content-hub
npm install
npx sanity dev
```

Studio runs at [http://localhost:3333](http://localhost:3333).

### Type check

```bash
npm run typecheck
```

---

## Environment Variables

Create a `.env.local` file in `apps/web-app/` with the following:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=e0x9v54x
NEXT_PUBLIC_SANITY_DATASET=production

# SMTP / Email
SMTP_HOST=mail.artisticbuz.com
SMTP_PORT=465
SMTP_USER=support@artisticbuz.com
SMTP_PASS=your-smtp-password
SMTP_FROM="Hair Graft Calculator Support <support@artisticbuz.com>"
CONSULTATION_EMAIL_TO=specialist@yourdomain.com
CONSULTATION_EMAIL_CC=support@artisticbuz.com
```

> **Security note:** Email recipients are resolved server-side only from env vars. The client never sends recipient addresses.

---

## Architecture Overview

```
User Browser
    |
    v
Next.js App Router (SSR + ISR + Client Components)
    |
    |-- Auth layer (Supabase JWT)
    |       └── AuthContext: isSubscribed, user, session
    |
    |-- Payment gate (Stripe Checkout)
    |       |── /api/create-checkout-session --> Stripe --> /success
    |       └── /api/webhook --> Supabase subscriptions table update
    |
    |-- Content (Sanity CDN)
    |       └── Blogs, Authors, FAQs, Partner Clinics
    |
    └── Calculator
            |-- Step 1: Spline 3D model --> area-based estimate
            └── Step 2: Norwood grid --> graft + price calculation
```

### Access Model

| User state | What they see |
|---|---|
| Not logged in | Auth modal prompt |
| Logged in, not subscribed | Subscription modal (Stripe Checkout) |
| Subscribed and active | Full calculator, results, consultation form |

Subscriptions are **14-day one-time access** (not recurring). Expiry is tracked in Supabase via `current_period_end`.

---

## Calculator Logic

### Norwood Pattern Selection

Users select one or more Norwood pattern cards. Graft ranges are summed and multiplied by all active factors.

### Graft Multipliers

| Factor | Option | Multiplier |
|---|---|---|
| Gender | Female | 0.80 |
| Gender | Male / Neutral | 1.00 |
| Hair Texture | Straight / Wavy | 1.00 |
| Hair Texture | Curly | 1.05 |
| Hair Texture | Afro | 1.18 |
| Desired Density | Sparse | 0.75 |
| Desired Density | Natural | 1.00 |
| Desired Density | Dense | 1.30 |

All three multipliers are applied together: `rawGrafts x gender x texture x density`

Active adjustments are shown in a blue info banner below results.

### Price Formula

```
priceMin = totalGraftMin x 2 x currencyRate
priceMax = totalGraftMax x 2 x currencyRate
```

The `x2` baseline (USD per graft) is multiplied by the live exchange rate to display in the user's local currency.

### Calculation History

Up to 5 recent estimates are saved to `localStorage` under the key `ab_calc_history`. A collapsible "Recent Estimates" panel lets users restore any previous selection with one click.

---

## Authentication and Subscriptions

Handled by **Supabase Auth** via `contexts/auth-context.tsx`.

### AuthContext values

| Value | Type | Description |
|---|---|---|
| `user` | `User or null` | Supabase user object |
| `session` | `Session or null` | Active session |
| `loading` | `boolean` | Initial auth load in progress |
| `subscriptionLoading` | `boolean` | Subscription DB check in progress |
| `isSubscribed` | `boolean` | Active and non-expired subscription |
| `checkSubscription()` | `async fn` | Re-queries the subscriptions table |

### Supabase subscriptions table

```sql
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  stripe_subscription_id text,
  stripe_customer_id text,
  status text,
  current_period_end timestamptz,
  created_at timestamptz default now()
);
```

---

## Stripe Integration

### Payment Flow

1. User clicks Subscribe
2. `POST /api/create-checkout-session` creates a Stripe Checkout Session
3. User is redirected to Stripe-hosted checkout
4. On success, Stripe redirects to `/success?session_id=...`
5. `/success` calls `POST /api/verify-payment` to confirm the session
6. Stripe fires a `checkout.session.completed` webhook to `/api/webhook`
7. Webhook upserts a row in the Supabase `subscriptions` table

### Webhook Events Handled

| Event | Action |
|---|---|
| `checkout.session.completed` | Creates or updates subscription row in Supabase |

### Local Webhook Testing

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

---

## Sanity CMS

**Project ID:** `e0x9v54x` | **Dataset:** `production`

### Content Types

| Schema | Purpose | Key Fields |
|---|---|---|
| `blog` | Blog articles | title, seoTitle, slug, mainImage, body, author (ref), tags (array) |
| `author` | Blog authors | name, slug, image, role, bio, linkedIn |
| `faq` | Homepage FAQs | question, answer, category, displayOrder, isActive |
| `partner` | Partner clinics | name, logo, city, country, website, isActive, orderRank |

### Key GROQ Queries

**Latest 3 blog posts (homepage):**
```groq
*[_type == "blog" && discoverEligible == true]
| order(publishedAt desc)[0..2] {
  title, seoTitle, slug, excerpt, publishedAt, topic, mainImage
}
```

**Active FAQs:**
```groq
*[_type == "faq" && isActive == true]
| order(displayOrder asc) { question, answer }
```

**Partner clinics:**
```groq
*[_type == "partner" && isActive == true]
| order(orderRank asc) { name, city, country, website, logo }
```

### Running the Studio

```bash
cd sanity/artisticbuz-content-hub
npx sanity dev
```

The desk is grouped as: **Blog Posts > Authors > FAQs > Partner Clinics**. Blog documents include an "Open in production" button linking to the live URL.

---

## Email

Consultation forms are sent via SMTP through `POST /api/send-email`.

- **Transport:** SMTP over port 465 (SSL) via `mail.artisticbuz.com`
- **From:** `support@artisticbuz.com`
- **To and CC:** Resolved server-side from env vars only
- Supports optional photo attachment via `multipart/form-data`

---

## Currency Detection

`lib/currency-service.ts` runs a two-step detection:

1. **Country:** `GET https://ipapi.co/json/` extracts `country_code`
2. **Exchange rate:** Fetched from `exchangerate-api.com` relative to USD
3. **Cache:** Both are cached in `localStorage` to avoid repeat API calls

The `SubscriptionModal` accepts pre-detected values as props to avoid a duplicate API call.

---

## API Routes

| Route | Method | Auth Required | Description |
|---|---|---|---|
| `/api/create-checkout-session` | POST | Yes | Creates Stripe Checkout Session |
| `/api/verify-payment` | POST | No | Verifies a Stripe session after redirect |
| `/api/webhook` | POST | Stripe signature | Handles `checkout.session.completed` |
| `/api/send-email` | POST | No | Sends consultation form via SMTP |
| `/api/consultation` | POST | No | Consultation submission handler |
| `/api/cron` | GET | No | Expires lapsed subscriptions |

---

## Deployment

The app is deployed on **Vercel**.

### Required Vercel Environment Variables

Set all values from the [Environment Variables](#environment-variables) section in the Vercel dashboard under **Settings > Environment Variables**.

### Stripe Webhook

Register `https://artisticbuz.com/api/webhook` in the Stripe dashboard under **Developers > Webhooks**. Select the `checkout.session.completed` event and copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

### Sanity CORS

In the [Sanity management console](https://www.sanity.io/manage), add the following under **API > CORS Origins**:

- `https://artisticbuz.com`
- `http://localhost:3000` 

### Build Command

```bash
npm run build
```

### ISR Revalidation

Blog pages revalidate every **60 seconds** keeping published content fresh without full redeploys.

---

## Social Media

| Platform | Link |
|---|---|
| LinkedIn | [linkedin.com/company/artisticbuz](https://www.linkedin.com/company/artisticbuz) |
| Instagram | [instagram.com/artisticbuz.ca](https://www.instagram.com/artisticbuz.ca) |
| Facebook | [facebook.com/ArtisticBuz](https://www.facebook.com/ArtisticBuz) |

---

ArtisticBuz is a product of [Buzlin Holdings Inc.](https://buzlinholdingsinc.com)
