import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2025-11-17.clover',
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

    const supabase = (() => {
      const { createClient } = require('@supabase/supabase-js');
      return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_ROLE_KEY || ''
      );
    })();

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

        const { data: existingSubscription } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('user_id', userId)
          .maybeSingle();

        if (existingSubscription) {
          await supabase
            .from('subscriptions')
            .update({
              stripe_customer_id: session.customer as string,
              status: 'active',
              current_period_start: new Date().toISOString(),
              current_period_end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId);
        } else {
          const { error: insertError } = await supabase.from('subscriptions').insert({
            user_id: userId,
            stripe_customer_id: session.customer as string,
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          });

          if (insertError) {
            console.error('[WEBHOOK] Error inserting subscription:', insertError);
          } else {
            console.log('[WEBHOOK] Subscription created successfully for user:', userId);
          }
        }

        const { error: paymentError } = await supabase.from('payments').insert({
          user_id: userId,
          stripe_payment_intent_id: session.payment_intent as string,
          amount: session.amount_total || 100,
          currency: session.currency || 'usd',
          status: 'succeeded',
        });

        if (paymentError) {
          console.error('[WEBHOOK] Error inserting payment:', paymentError);
        } else {
          console.log('[WEBHOOK] Payment recorded successfully');
        }

        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment succeeded:', paymentIntent.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error('Payment failed:', paymentIntent.id);
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
