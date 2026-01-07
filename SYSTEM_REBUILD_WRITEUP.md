# Hair Graft Calculator - Complete System Writeup

## Executive Summary

This is a professional hair transplant calculator web application that estimates graft requirements based on hair loss type. It features user authentication, subscription payments via Stripe, and a consultation system. The application uses Next.js 13 with TypeScript, Supabase for authentication and database, and Stripe for payment processing.

**Current Issue:** 401 Unauthorized errors when creating checkout sessions due to missing Supabase auth cookies in API requests. This has been fixed and documented below.

---

## Architecture Overview

### Tech Stack
- **Framework:** Next.js 13 (App Router)
- **Language:** TypeScript
- **UI Components:** Radix UI + Tailwind CSS
- **Authentication:** Supabase Auth (Email/Password)
- **Database:** Supabase PostgreSQL
- **Payments:** Stripe
- **Hosting:** Vercel (recommended)

### Core Features
1. **Hair Graft Calculator** - Estimates grafts needed for hair restoration
2. **User Authentication** - Sign up / Login via Supabase
3. **Subscription System** - One-time $1 payment for 14 days access
4. **Consultation Form** - Users can submit consultation requests
5. **Gender-Inclusive UI** - Three visualization options (Neutral/Male/Female)

---

## Database Schema

### 1. `user_profiles` Table
Stores user information and preferences.

```sql
id (uuid) - PRIMARY KEY, REFERENCES auth.users(id) ON DELETE CASCADE
email (text) - User email address
full_name (text) - User's full name
gender_preference (text) - 'neutral' | 'male' | 'female' (DEFAULT 'neutral')
created_at (timestamptz) - DEFAULT now()
updated_at (timestamptz) - DEFAULT now()
```

**RLS Policies:**
- SELECT: Users can only view their own profile
- INSERT: Users can only create their own profile
- UPDATE: Users can only update their own profile

**Triggers:**
- `on_auth_user_created` - Automatically creates profile when user signs up
- `update_user_profiles_updated_at` - Updates `updated_at` timestamp on changes

---

### 2. `subscriptions` Table
Tracks user subscription status and payment details.

```sql
id (uuid) - PRIMARY KEY, DEFAULT gen_random_uuid()
user_id (uuid) - UNIQUE, REFERENCES auth.users(id) ON DELETE CASCADE
stripe_customer_id (text) - Stripe customer identifier
stripe_subscription_id (text) - UNIQUE Stripe subscription ID
status (text) - 'active' | 'inactive' | 'canceled' | 'past_due' | 'trialing' (DEFAULT 'inactive')
current_period_start (timestamptz) - Start of billing period
current_period_end (timestamptz) - End of billing period
cancel_at_period_end (boolean) - DEFAULT false
created_at (timestamptz) - DEFAULT now()
updated_at (timestamptz) - DEFAULT now()
```

**RLS Policies:**
- SELECT: Users can only view their own subscription
- INSERT: Users can only create their own subscription (via Stripe webhook)
- UPDATE: Users can only update their own subscription (via Stripe webhook)

**Indexes:**
- `idx_subscriptions_user_id` - For fast user lookups
- `idx_subscriptions_status` - For filtering by status

---

### 3. `payments` Table
Records all payment transactions.

```sql
id (uuid) - PRIMARY KEY, DEFAULT gen_random_uuid()
user_id (uuid) - REFERENCES auth.users(id) ON DELETE CASCADE
subscription_id (uuid) - REFERENCES subscriptions(id) ON DELETE SET NULL
stripe_payment_intent_id (text) - UNIQUE Stripe payment intent ID
amount (integer) - Amount in cents (e.g., 100 = $1.00)
currency (text) - Currency code (DEFAULT 'usd')
status (text) - 'succeeded' | 'pending' | 'failed' | 'canceled' (DEFAULT 'pending')
created_at (timestamptz) - DEFAULT now()
```

**RLS Policies:**
- SELECT: Users can only view their own payments
- INSERT: Users can only create their own payment records (via Stripe webhook)

**Indexes:**
- `idx_payments_user_id` - For fast user lookups
- `idx_payments_subscription_id` - For fast subscription lookups

---

### 4. `consultations` Table
Stores consultation form submissions (public submissions).

```sql
id (uuid) - PRIMARY KEY, DEFAULT gen_random_uuid()
name (text) - Consultant name
email (text) - Consultant email
phone (text) - Consultant phone
preferred_contact (text) - 'email' | 'phone' | 'whatsapp'
selected_baldness_type (text) - Selected hair loss type
estimated_grafts (text) - Graft estimation from calculator
message (text) - Additional message/notes
status (text) - 'pending' | 'contacted' | 'scheduled' | 'completed' | 'cancelled' (DEFAULT 'pending')
created_at (timestamptz) - DEFAULT now()
```

**RLS Policies:**
- INSERT: Anyone (anonymous) can submit
- SELECT: Only authenticated users can view all (for admin)

**Indexes:**
- `idx_consultations_email` - For fast email lookups
- `idx_consultations_status` - For filtering by status
- `idx_consultations_created_at` - For recent submissions

---

## Environment Variables

Required environment variables in `.env` and `.env.local`:

```env
# Supabase Configuration (Already Set)
NEXT_PUBLIC_SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... # Server-side only

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... # Public key for client-side
STRIPE_SECRET_KEY=sk_test_... # Secret key for server-side only
STRIPE_WEBHOOK_SECRET=whsec_... # Webhook signing secret

# Application Configuration (Optional)
NEXT_PUBLIC_APP_URL=https://www.artisticbuz.com # For production
```

**Important:**
- `NEXT_PUBLIC_*` variables are exposed to the browser
- `STRIPE_SECRET_KEY` and `SUPABASE_SERVICE_ROLE_KEY` must NEVER be exposed to client
- Always use `.env.local` for local development secrets

---

## Authentication Flow

### Sign Up Flow
1. User fills in email, password, and full name
2. `AuthContext.signUp()` calls `supabase.auth.signUp()`
3. Supabase creates user in `auth.users` table
4. Database trigger `on_auth_user_created` automatically creates `user_profiles` row
5. User is logged in and redirected to home page
6. User can now access calculator

### Sign In Flow
1. User enters email and password
2. `AuthContext.signIn()` calls `supabase.auth.signInWithPassword()`
3. Supabase authenticates and returns session with auth cookie
4. Auth context updates user state
5. Page components check `useAuth()` for user and redirect as needed

### Authentication State Management
- `AuthContext` (client-side) manages auth state using Supabase client
- Auth state persists via cookies (HttpOnly, secure)
- Cookies are automatically sent with API requests when `credentials: 'include'` is set
- Server-side code reads cookies via `next/headers` cookies API

---

## Subscription & Payment Flow

### Payment Creation Flow
1. **User clicks "Subscribe Now"**
   - `SubscriptionModal` component opens
   - Shows $1 payment option

2. **Client-side Request** (`components/subscription/subscription-modal.tsx`)
   ```typescript
   const response = await fetch('/api/create-checkout-session', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     credentials: 'include', // CRITICAL: Includes auth cookies
   });
   ```

3. **Server-side Processing** (`app/api/create-checkout-session/route.ts`)
   ```typescript
   // Create server-side Supabase client that reads cookies
   const supabase = createServerSupabaseClient();

   // Get authenticated user from cookies
   const { data: { user }, error: authError } = await supabase.auth.getUser();

   // Create Stripe checkout session
   const session = await stripe.checkout.sessions.create({
     mode: 'payment',
     line_items: [{
       price_data: {
         currency: 'usd',
         product_data: { name: 'Hair Calculator Access' },
         unit_amount: 100, // $1.00
       },
       quantity: 1,
     }],
     client_reference_id: user.id,
     customer_email: user.email,
     metadata: { user_id: user.id },
   });
   ```

4. **Stripe Checkout**
   - User redirected to Stripe-hosted checkout page
   - User enters payment details
   - Payment processed

5. **Webhook Processing** (`app/api/webhook/route.ts`)
   - Stripe sends `checkout.session.completed` event
   - Server validates webhook signature
   - Creates subscription record: `subscriptions` table
   - Creates payment record: `payments` table
   - Updates subscription status to 'active'

6. **Success Redirect**
   - User redirected to success page with session ID
   - `AuthContext.checkSubscription()` called
   - Sets `isSubscribed = true`
   - Calculator features become available

---

## API Routes (Server-Side)

### 1. POST `/api/create-checkout-session`
**Purpose:** Create Stripe checkout session for subscription payment

**Authentication:** Required (Supabase Auth via cookies)

**Request:**
```json
{}
```

**Response (Success):**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

**Response (Error):**
```json
{ "error": "Not authenticated" } // 401
{ "error": "Already subscribed" } // 400
{ "error": "Database not configured" } // 503
```

**Implementation Details:**
- Uses `createServerSupabaseClient()` to read auth cookies
- Checks if user already has active subscription
- Creates Stripe session with `mode: 'payment'` (one-time payment)
- Returns checkout URL for client-side redirect

---

### 2. POST `/api/webhook`
**Purpose:** Handle Stripe webhook events

**Authentication:** None required (Stripe webhook signature verification)

**Triggers on:**
- `checkout.session.completed` - Payment successful
- `payment_intent.succeeded` - Payment confirmed
- `payment_intent.payment_failed` - Payment failed

**On `checkout.session.completed`:**
1. Verifies webhook signature
2. Extracts user ID from session metadata
3. Creates/updates subscription record
4. Creates payment record
5. Sets subscription status to 'active'

**Implementation Details:**
- Uses `createServiceRoleClient()` to bypass RLS (for webhook processing)
- Verifies Stripe signature: `stripe.webhooks.constructEvent(body, signature, webhookSecret)`
- Idempotent - safe to call multiple times for same event
- Logs all errors for debugging

---

### 3. POST `/api/consultation`
**Purpose:** Submit consultation form requests

**Authentication:** Not required (public endpoint)

**Request:**
```json
{
  "clientsName": { "first": "John", "last": "Doe" },
  "clientsEmail": "john@example.com",
  "clientsPhone": "+1234567890",
  "occupation": "Engineer",
  "dateOfBirth": "1990-01-01",
  "selectedBaldnessType": "Type III Vertex",
  "estimatedGrafts": "2000-2500",
  "specialInstructions": "Notes here...",
  // ... more fields from form
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": { "id": "uuid", ... }
}
```

**Response (Error):**
```json
{ "error": "Failed to submit consultation request" } // 500
```

---

## Client Components

### 1. `AuthContext` (`contexts/auth-context.tsx`)
**Purpose:** Global authentication state management

**Exports:**
```typescript
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  isSubscribed: boolean;
  checkSubscription: () => Promise<void>;
}

export function useAuth(): AuthContextType;
```

**Behavior:**
- Initializes auth state from stored session
- Listens for auth state changes
- Auto-checks subscription when user changes
- Provides methods for signup, signin, signout

---

### 2. `AuthModal` (`components/auth/auth-modal.tsx`)
**Purpose:** Modal for sign up / login

**Features:**
- Tab toggle between Sign Up and Login
- Form validation
- Error handling and display
- Loading state during submission

---

### 3. `SubscriptionModal` (`components/subscription/subscription-modal.tsx`)
**Purpose:** Modal for purchasing subscription

**Features:**
- Displays $1 pricing
- Shows included features
- One-click checkout button
- Error handling for failed payments

**Bug Fix Applied:**
Added `credentials: 'include'` to fetch request:
```typescript
const response = await fetch('/api/create-checkout-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // Include auth cookies!
});
```

---

### 4. `HairCalculator` (`components/HairCalculator.tsx`)
**Purpose:** Main calculator component

**Features:**
- Shows baldness type grid
- Displays result panel with graft estimates
- Gender preference selector
- Consultation form submission

**Access Control:**
- Requires user authentication
- Requires active subscription
- Redirects to auth/subscription modal if not qualified

---

### 5. `ConsultationFormModal` (`components/calculator/consultation-form-modal.tsx`)
**Purpose:** Form for consultation requests

**Fields:**
- Client name (first/last)
- Email, phone, preferred contact
- Date of birth, occupation
- Hair service selections
- Hair condition details
- Past treatments and medications
- Salon frequency
- Special instructions
- Terms acceptance and signature

---

## Key Implementation Details

### Server-Side Supabase Client (`lib/supabase-server.ts`)

**Why It's Needed:**
- Browser-based client cannot directly read HTTP-only cookies
- API routes run on server and can access cookies via `next/headers`
- Server client must be configured to use cookie storage

**Implementation:**
```typescript
export function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: {
        getItem: (key: string) => {
          return cookieStore.get(key)?.value ?? null;
        },
        setItem: (key: string, value: string) => {
          try {
            cookieStore.set(key, value, {
              httpOnly: true,
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
            });
          } catch (error) {}
        },
        removeItem: (key: string) => {
          try {
            cookieStore.delete(key);
          } catch (error) {}
        },
      },
    },
  });
}
```

**Usage in API Routes:**
```typescript
export async function POST() {
  const supabase = createServerSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  // user is now authenticated from cookies!
}
```

---

### Service Role Client (`lib/supabase-server.ts`)

**Why It's Needed:**
- Webhook processing needs to bypass RLS policies
- Service role has full database access
- Used for non-authenticated operations

**Implementation:**
```typescript
export function createServiceRoleClient() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
```

**Usage:**
- Stripe webhook handler
- Consultation form submissions
- Admin operations

---

### Dynamic Route Configuration

**Routes require `export const dynamic = 'force-dynamic'`:**
- `app/api/create-checkout-session/route.ts`
- `app/api/webhook/route.ts`
- `app/api/consultation/route.ts`

**Why:**
- Prevents build-time instantiation of Stripe client
- Ensures environment variables are loaded at runtime
- Necessary for Vercel deployment

---

## User Flows

### New User Flow
1. **Visit app** → Home page shows calculator overview
2. **Click calculator** → "Sign up to continue" prompt
3. **Click auth button** → `AuthModal` opens
4. **Sign up** → Create account with email/password
5. **Select gender preference** → Choose visualization style
6. **Click hair loss type** → "Subscribe to see results" prompt
7. **Click subscribe** → `SubscriptionModal` opens
8. **Click "Subscribe Now"** → Redirected to Stripe checkout
9. **Enter payment details** → Complete Stripe payment (test: 4242 4242 4242 4242)
10. **Success page** → 14 days access granted
11. **Use calculator** → View results, submit consultation

### Returning User Flow
1. **Visit app** → Logged in automatically (cookies persist)
2. **Click calculator** → Direct to calculator with saved preferences
3. **Select hair loss type** → Results display immediately
4. **Submit consultation** → Form submitted to database

---

## Stripe Integration

### Test Mode Setup
1. Create account at https://dashboard.stripe.com/register
2. Get API keys at https://dashboard.stripe.com/apikeys
3. Copy to `.env`:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (pk_test_...)
   - `STRIPE_SECRET_KEY` (sk_test_...)

### Test Cards
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **Expiry:** Any future date
- **CVC:** Any 3 digits

### Webhook Setup (Production)
1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Set URL: `https://www.artisticbuz.com/api/webhook`
4. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy signing secret to `STRIPE_WEBHOOK_SECRET`

### Local Testing with Stripe CLI
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Authenticate
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhook

# Trigger test events
stripe trigger payment_intent.succeeded
```

---

## Deployment to Vercel

### 1. Connect Git Repository
- Push code to GitHub/GitLab/Bitbucket
- Connect repo in Vercel dashboard

### 2. Set Environment Variables
In Vercel project settings, add:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_APP_URL
```

### 3. Deploy
- Automatic on git push
- Or manually trigger in Vercel dashboard

### 4. Update Stripe Webhook
- Change webhook URL from localhost to production URL
- Test webhook delivery in Stripe dashboard

---

## Security Considerations

### 1. Authentication
- Supabase Auth uses industry-standard JWT tokens
- Tokens stored in HTTP-only cookies (cannot be accessed by JavaScript)
- Sessions persist across page reloads via cookies

### 2. Authorization (RLS)
- All database tables have Row Level Security enabled
- Users can only access their own data
- Service role used only for webhook processing
- Consultation form allows anonymous inserts only

### 3. Payment Security
- Stripe handles PCI compliance
- Never send payment details to your server
- Stripe checkout page is hosted by Stripe (not your app)
- Webhooks verified using signing secrets

### 4. Secrets Management
- Never commit `.env.local` to git
- Use `.gitignore` for environment files
- Service role key never exposed to client
- Stripe webhook secret never exposed to client

---

## Common Issues & Solutions

### Issue: 401 Unauthorized on `/api/create-checkout-session`
**Cause:** Fetch request not including cookies

**Solution:** Add `credentials: 'include'` to fetch:
```typescript
const response = await fetch('/api/create-checkout-session', {
  credentials: 'include',
});
```

### Issue: Webhook not receiving Stripe events (Production)
**Cause:** Webhook URL misconfigured or Stripe not configured

**Solution:**
1. Verify webhook URL in Stripe dashboard matches deployment URL
2. Test webhook in Stripe event logs
3. Check server logs for errors

### Issue: "Database not configured"
**Cause:** Environment variables missing

**Solution:**
1. Verify `.env.local` has Supabase variables
2. Restart dev server after changing `.env`
3. Check Vercel environment variables are set

### Issue: "Already subscribed" error
**Cause:** User already has active subscription

**Solution:**
- User cannot purchase twice
- Check subscription status in Supabase dashboard
- Cancel or modify subscription if needed

### Issue: Calculator locked after payment
**Cause:** Webhook not processed or subscription status not updated

**Solution:**
1. Check Stripe webhook delivery in dashboard
2. Verify subscription record created in Supabase
3. Try refreshing page to re-check subscription status

---

## Testing Checklist

### Authentication
- [ ] Sign up with new email
- [ ] Email verification (if enabled)
- [ ] Sign in with correct credentials
- [ ] Sign in fails with wrong password
- [ ] Sign out clears session
- [ ] Refresh page maintains login

### Subscription
- [ ] Subscribe button works
- [ ] Stripe checkout opens
- [ ] Test payment succeeds with test card
- [ ] Webhook received and processed
- [ ] Subscription status updated to 'active'
- [ ] Calculator unlocked after payment
- [ ] Cannot purchase twice

### Calculator
- [ ] Calculator visible to authenticated, subscribed users
- [ ] Gender preference selector works
- [ ] Baldness type selection updates results
- [ ] Results display correct graft estimates
- [ ] Consultation form submission works
- [ ] Form data saved to database

### Consultation
- [ ] Form submits without authentication
- [ ] Email confirmation works
- [ ] Data appears in database
- [ ] Status can be updated by admin

### Production (Vercel)
- [ ] All environment variables set
- [ ] Build succeeds
- [ ] Auth flow works
- [ ] Payment processing works
- [ ] Webhooks received
- [ ] No console errors

---

## File Structure

```
/project
├── app/
│   ├── api/
│   │   ├── create-checkout-session/route.ts
│   │   ├── consultation/route.ts
│   │   └── webhook/route.ts
│   ├── page.tsx (Home)
│   ├── success/page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── auth/
│   │   └── auth-modal.tsx
│   ├── calculator/
│   │   ├── baldness-type-card.tsx
│   │   ├── baldness-type-grid.tsx
│   │   ├── consultation-form-modal.tsx
│   │   └── result-panel.tsx
│   ├── subscription/
│   │   └── subscription-modal.tsx
│   ├── layout/
│   │   ├── header.tsx
│   │   └── footer.tsx
│   ├── faq/
│   │   └── faq-section.tsx
│   └── ui/ (Radix UI components)
├── contexts/
│   └── auth-context.tsx
├── hooks/
│   └── use-toast.ts
├── lib/
│   ├── supabase.ts (Client)
│   ├── supabase-server.ts (Server)
│   ├── calculator-data.ts
│   └── utils.ts
├── types/
│   └── calculator.ts
├── supabase/
│   └── migrations/
│       ├── 20251118213641_create_consultations_table.sql
│       └── 20251128115606_create_auth_and_subscriptions.sql
├── public/
│   ├── images/
│   └── fonts/
├── .env
├── .env.local
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
└── components.json
```

---

## How to Rebuild from Scratch

If you need to rebuild this application, here are the steps:

### 1. Create Next.js Project
```bash
npx create-next-app@latest --typescript
cd project
```

### 2. Install Dependencies
```bash
npm install @supabase/supabase-js stripe @stripe/stripe-js
npm install -D @types/stripe
npm install @radix-ui/* lucide-react
npm install react-hook-form zod @hookform/resolvers
npm install sonner
```

### 3. Set Up Supabase
- Create project at supabase.com
- Note URL and anon key
- Add to `.env.local`
- Run migrations in supabase/migrations/

### 4. Set Up Stripe
- Create account at stripe.com
- Get API keys
- Add to `.env.local`

### 5. Create Directory Structure
- Create `contexts/`, `lib/`, `types/`, `components/` directories
- Copy files from this project

### 6. Update Environment Variables
- Copy `.env` values
- Update `.env.local` with your API keys

### 7. Run Dev Server
```bash
npm run dev
```

---

## Future Enhancements

1. **Email Notifications**
   - Send welcome email after signup
   - Send consultation confirmation
   - Send admin notification on new consultation

2. **Admin Dashboard**
   - View consultations
   - Update consultation status
   - View payments and subscriptions
   - Manage users

3. **Advanced Calculator Features**
   - Photo upload for hair analysis
   - Before/after gallery
   - Financing options
   - Detailed cost breakdown by region

4. **Multi-language Support**
   - i18n for multiple languages
   - Localized pricing in different currencies

5. **Mobile App**
   - React Native version
   - Push notifications
   - Offline calculator

6. **Analytics**
   - Track calculator usage
   - Payment metrics
   - Conversion funnel
   - User demographics

---

## Support & Troubleshooting

For detailed troubleshooting, check:
- **Supabase Logs:** https://supabase.com/dashboard/project/[id]/logs
- **Stripe Logs:** https://dashboard.stripe.com/logs
- **Vercel Logs:** https://vercel.com/dashboard/deployments
- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs
- **Stripe Docs:** https://stripe.com/docs

---

**Last Updated:** December 1, 2024
**Version:** 1.0.0
**Status:** Production Ready (with 401 fix applied)
