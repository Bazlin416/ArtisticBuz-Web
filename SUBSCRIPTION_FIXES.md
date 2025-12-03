# Subscription System Fixes

## Changes Made

### 1. Fixed Webhook to Use Service Role Key
**Problem:** Webhook was using anon key which doesn't have permission to update subscriptions
**Solution:** Changed webhook to use `SUPABASE_SERVICE_ROLE_KEY`

**File:** `app/api/webhook/route.ts`
- Now uses service role client with full database access
- Added detailed logging for debugging
- Added error handling for insert operations

### 2. Changed Subscription Period from Lifetime to 14 Days
**Problem:** Subscription was set to 365 days (1 year)
**Solution:** Changed to 14 days

**Changes:**
- Webhook now sets `current_period_end` to 14 days from now
- Success page updated to say "14 days access"
- Subscription modal updated to say "14 days access"

### 3. Added Geolocation-Based Currency Detection
**Problem:** All payments were in USD regardless of user location
**Solution:** Implemented automatic currency detection based on IP geolocation

**File:** `components/subscription/subscription-modal.tsx`
- Uses ipapi.co to detect user's country
- Automatically selects appropriate currency:
  - Kenya (KE): KSH 130
  - USA (US): $1.00
  - UK (GB): £0.80
  - Nigeria (NG): ₦1,600
  - South Africa (ZA): R19
  - EU countries: €0.95
  - Default: $1.00
- Displays detected currency and amount in modal

**File:** `app/api/create-checkout-session/route.ts`
- Accepts country code in request body
- Maps country to currency and amount
- Creates Stripe checkout with correct currency

### 4. Enhanced Subscription Status Check
**Problem:** Subscription status wasn't updating immediately after payment
**Solution:** Added forced re-checks on success page

**File:** `app/success/page.tsx`
- Checks subscription immediately on page load
- Rechecks after 2 seconds to handle webhook delays

### 5. Improved Logging
Added comprehensive logging throughout the payment flow:
- `[WEBHOOK]` prefix for webhook events
- `[CHECKOUT]` prefix for checkout session creation
- `[SUCCESS]` prefix for success page subscription checks

## Testing the Fixes

### 1. Test Subscription Flow
```
1. Sign up for new account
2. Click "Subscribe Now"
3. Modal should show currency based on your location
4. Complete Stripe payment
5. Check Supabase subscriptions table - status should be 'active'
6. Success page should confirm 14-day access
7. Calculator should be unlocked
```

### 2. Test Webhook
```bash
# Check webhook endpoint receives events
# In Stripe Dashboard -> Webhooks -> Click on webhook -> View events

# Should see:
- checkout.session.completed event
- Status: succeeded
```

### 3. Test Currency Detection
```
1. Open subscription modal
2. Check browser console for: "Detected country: XX, Currency: YYY"
3. Modal should show local currency amount
4. Stripe checkout should use that currency
```

## Environment Variables Required

Make sure these are set in Vercel:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Critical for webhook!
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Stripe Webhook Configuration

1. Go to Stripe Dashboard -> Webhooks
2. Add endpoint: `https://your-domain.com/api/webhook`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## Database Schema

Subscriptions table structure:
```sql
- user_id: uuid (references auth.users)
- stripe_customer_id: text
- status: text ('active', 'inactive', etc.)
- current_period_start: timestamptz
- current_period_end: timestamptz (now set to +14 days)
```

## Supported Currencies

| Country | Currency | Amount | Display |
|---------|----------|--------|---------|
| US | USD | 100 | $1.00 |
| KE | KES | 130 | KSH 130 |
| GB | GBP | 80 | £0.80 |
| NG | NGN | 1600 | ₦1,600 |
| ZA | ZAR | 19 | R19 |
| EU | EUR | 95 | €0.95 |

## Debugging Tips

### Check Webhook Status
```bash
# View webhook logs in Stripe Dashboard
# Look for [WEBHOOK] prefixed logs in Vercel logs
```

### Check Subscription Status
```sql
-- In Supabase SQL Editor
SELECT
  user_id,
  status,
  current_period_start,
  current_period_end,
  created_at
FROM subscriptions
WHERE user_id = 'user-id-here';
```

### Check Payment Records
```sql
SELECT
  user_id,
  amount,
  currency,
  status,
  created_at
FROM payments
ORDER BY created_at DESC;
```

## Common Issues

### Issue: Subscription status not updating
**Solution:**
1. Check webhook is configured in Stripe
2. Verify `SUPABASE_SERVICE_ROLE_KEY` is set
3. Check Vercel logs for webhook errors

### Issue: Wrong currency displayed
**Solution:**
1. Check browser console for detected country
2. Verify ipapi.co is accessible
3. Falls back to USD if detection fails

### Issue: Calculator still locked after payment
**Solution:**
1. Wait 2-3 seconds for webhook to process
2. Refresh the page
3. Check subscription status in database
4. Check browser console for `[SUCCESS]` logs

## Next Steps

1. Deploy to Vercel with all environment variables
2. Configure Stripe webhook endpoint
3. Test payment flow end-to-end
4. Monitor webhook delivery in Stripe Dashboard
5. Check subscription status updates in Supabase
