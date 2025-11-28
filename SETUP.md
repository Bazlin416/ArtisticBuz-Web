# Hair Graft Calculator - Setup Guide

This application features a professional hair transplant calculator with user authentication and subscription payments via Stripe.

## Features Implemented

### 1. User Authentication
- Email/password authentication via Supabase Auth
- Secure user registration and login
- Protected calculator access (requires authentication)
- User profile management with gender preferences

### 2. Subscription System
- One-time payment of $1 for lifetime access
- Stripe payment integration
- Automatic subscription status tracking
- Premium user badges

### 3. Gender-Inclusive Calculator
- Three visualization options: Neutral, Male, Female
- Dynamic emoji icons based on user preference
- Removes gender bias in hair loss representation

### 4. Protected Calculator Results
- Calculator visible to all users
- Results only shown to authenticated AND subscribed users
- Clear upgrade prompts for non-subscribers

## Environment Setup

### 1. Supabase Configuration

Your Supabase database is already configured with the following tables:
- `user_profiles` - User information and preferences
- `subscriptions` - User subscription status
- `payments` - Payment history
- `consultations` - Consultation form submissions

The environment variables are already set in `.env`:
```
NEXT_PUBLIC_SUPABASE_URL=https://joisxcdggemxvchtkbnq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-key>
```

### 2. Stripe Configuration

To enable payments, you need to configure Stripe:

#### Step 1: Create a Stripe Account
1. Go to https://dashboard.stripe.com/register
2. Complete the registration

#### Step 2: Get Your API Keys
1. Navigate to https://dashboard.stripe.com/apikeys
2. Copy your **Publishable key** and **Secret key**
3. Update `.env`:
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

#### Step 3: Create a Webhook (for production)
1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Set the endpoint URL to: `https://your-domain.com/api/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the signing secret and update `.env`:
```
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### Step 4: Test Mode
- Use Stripe test cards for testing:
  - Success: `4242 4242 4242 4242`
  - Failure: `4000 0000 0000 0002`
  - Any future expiry date, any CVC

### 3. Application URL (Optional)
For production deployment, set:
```
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Database Schema

### user_profiles
- Stores user information
- Links to Supabase auth.users
- Includes gender_preference for calculator display

### subscriptions
- Tracks subscription status
- Stores Stripe customer and subscription IDs
- Manages subscription periods

### payments
- Records all payment transactions
- Links to subscriptions and users
- Tracks payment status

## User Flow


### For New Users:
1. User visits the site
2. Clicks on calculator
3. Prompted to sign up/login
4. After login, prompted to subscribe ($1)
5. Completes Stripe checkout
6. Redirected to success page
7. Can now use calculator with full features

### For Subscribed Users:
1. User logs in
2. Selects gender preference (Neutral/Male/Female)
3. Chooses hair loss type
4. Views detailed results with pricing
5. Can submit consultation form

## Security Features

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Secure authentication via Supabase
- Payment processing via Stripe (PCI compliant)
- Webhook signature verification

## Testing

### Test Authentication:
1. Create a test user account
2. Verify email/password login works
3. Check user profile is created in database

### Test Subscription:
1. Use Stripe test mode
2. Use test card: 4242 4242 4242 4242
3. Complete checkout
4. Verify subscription status updates
5. Confirm calculator access is granted

### Test Calculator:
1. Select different gender preferences
2. Choose various hair loss types
3. Verify results display correctly
4. Test consultation form submission

## Common Issues

### Issue: "Database not configured"
**Solution:** Check that Supabase environment variables are set correctly

### Issue: "Stripe not loading"
**Solution:** Ensure NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set and starts with `pk_`

### Issue: "Webhook not receiving events"
**Solution:**
- For local development, use Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhook`
- For production, ensure webhook URL is publicly accessible

### Issue: "Calculator locked after payment"
**Solution:**
- Check webhook was processed successfully
- Verify subscription status in database
- Try refreshing the page (subscription check runs on page load)

## Support

For issues related to:
- **Authentication:** Check Supabase dashboard logs
- **Payments:** Check Stripe dashboard events
- **Database:** Use Supabase SQL Editor to query tables

## Next Steps

1. Configure Stripe API keys
2. Test authentication flow
3. Test payment flow with test cards
4. Set up production webhook
5. Deploy to production
6. Update NEXT_PUBLIC_APP_URL

## Production Checklist

- [ ] Set production Stripe keys
- [ ] Configure production webhook
- [ ] Set NEXT_PUBLIC_APP_URL
- [ ] Test authentication flow
- [ ] Test payment flow
- [ ] Verify RLS policies
- [ ] Monitor Supabase logs
- [ ] Monitor Stripe events
- [ ] Set up error tracking
- [ ] Configure email notifications (optional)
