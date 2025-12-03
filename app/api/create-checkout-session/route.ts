import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

// Currency mapping based on country
const currencyMap: Record<string, { currency: string; amount: number }> = {
  'US': { currency: 'usd', amount: 100 }, // $1
  'KE': { currency: 'kes', amount: 130 }, // 130 KES (~$1)
  'GB': { currency: 'gbp', amount: 80 },  // £0.80
  'EU': { currency: 'eur', amount: 95 },  // €0.95
  'NG': { currency: 'ngn', amount: 1600 }, // 1600 NGN (~$1)
  'ZA': { currency: 'zar', amount: 19 },  // 19 ZAR (~$1)
  'default': { currency: 'usd', amount: 100 }
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
      apiVersion: '2025-11-17.clover',
    });
    const supabase = createServerSupabaseClient();
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
