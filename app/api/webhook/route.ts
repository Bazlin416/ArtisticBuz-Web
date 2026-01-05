import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerSupabaseClient } from '@/lib/supabase-server'; // Use the server client

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2025-12-15.clover',
    });
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    // Use the server Supabase client
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    console.log('[WEBHOOK] Processing event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id || session.client_reference_id;

        if (!userId) {
          console.error('[WEBHOOK] No user ID found in session');
          return NextResponse.json({ received: true });
        }

        console.log('[WEBHOOK] Processing subscription for user:', userId);

        const subscriptionData = {
          user_id: userId,
          stripe_customer_id: session.customer as string,
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { data: existingSubscription } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('user_id', userId)
          .maybeSingle();

        let subscriptionId;

        if (existingSubscription) {
          const { data } = await supabase
            .from('subscriptions')
            .update(subscriptionData)
            .eq('user_id', userId)
            .select('id')
            .single();
          subscriptionId = data?.id;
        } else {
          const { data } = await supabase
            .from('subscriptions')
            .insert(subscriptionData)
            .select('id')
            .single();
          subscriptionId = data?.id;
        }

        // Record payment
        await supabase.from('payments').insert({
          user_id: userId,
          stripe_payment_intent_id: session.payment_intent as string,
          stripe_session_id: session.id,
          subscription_id: subscriptionId,
          amount: session.amount_total || 0,
          currency: session.currency || 'usd',
          status: 'succeeded',
        });

        console.log('[WEBHOOK] Subscription and payment processed for user:', userId);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook handler failed' },
      { status: 500 }
    );
  }
}