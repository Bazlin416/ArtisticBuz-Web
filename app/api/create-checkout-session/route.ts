import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

// First, define the helper function
function getAmountInSmallestUnit(currency: string, amount: number): number {
  // Currencies without minor units (they use the amount as-is)
  const zeroDecimalCurrencies = ['JPY', 'KRW', 'VND', 'CLP', 'ISK', 'PYG'];
  
  const currencyCode = currency.toUpperCase();
  
  if (zeroDecimalCurrencies.includes(currencyCode)) {
    return amount; // Already in correct unit
  }
  
  // For most currencies, multiply by 100 to get smallest unit
  return Math.round(amount * 100);
}

// Updated currency mapping using the helper function
const currencyMap: Record<string, { currency: string; amount: number }> = {
  'US': { currency: 'usd', amount: getAmountInSmallestUnit('usd', 4.99) },        // $4.99 → 499 cents
  'KE': { currency: 'kes', amount: getAmountInSmallestUnit('kes', 649) },        // 649 KES → 64900 cents
  'GB': { currency: 'gbp', amount: getAmountInSmallestUnit('gbp', 3.99) },       // £3.99 → 399 pence
  'EU': { currency: 'eur', amount: getAmountInSmallestUnit('eur', 4.75) },       // €4.75 → 475 cents
  'NG': { currency: 'ngn', amount: getAmountInSmallestUnit('ngn', 7984) },       // 7,984 NGN → 798400 kobo
  'ZA': { currency: 'zar', amount: getAmountInSmallestUnit('zar', 95) },         // 95 ZAR → 9500 cents
  'default': { currency: 'usd', amount: getAmountInSmallestUnit('usd', 4.99) }   // $4.99 → 499 cents
};

export async function POST(request: Request) {
  try {
    // Get country from request headers or body
    let country = 'default';
    try {
      const body = await request.json();
      country = body.country || 'default';
    } catch {
      // If no body, use default
    }

    // Determine currency and amount based on country
    const { currency, amount } = currencyMap[country] || currencyMap['default'];

    console.log('[CHECKOUT] Creating session for country:', country, 'currency:', currency, 'amount:', amount);

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2025-12-15.clover',
    });
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Auth error in checkout:', { authError, hasUser: !!user });
      return NextResponse.json(
        { error: 'Not authenticated', details: authError?.message },
        { status: 401 }
      );
    }

    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingSubscription && existingSubscription.status === 'active') {
      return NextResponse.json(
        { error: 'Already subscribed' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: 'Hair Calculator Access - 14 Days',
              description: '14-day access to professional hair transplant calculator',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/?canceled=true`,
      client_reference_id: user.id,
      customer_email: user.email,
      metadata: {
        user_id: user.id,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
