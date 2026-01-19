import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json();
    
    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2025-11-17.clover' as any,
    });

    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 503 }
      );
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent'],
    });

    console.log('Verify Payment - Retrieved session:', {
      id: session.id,
      payment_status: session.payment_status,
      status: session.status,
      customer: session.customer,
      amount_total: session.amount_total,
      mode: session.mode,
      livemode: session.livemode,
    });

    // Check if payment was successful in Stripe
    if (session.payment_status !== 'paid') {
      return NextResponse.json({
        success: false,
        error: `Payment status is ${session.payment_status}`,
      });
    }

    const userId = session.metadata?.user_id || session.client_reference_id;
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'No user ID found in session',
      });
    }

    console.log('Verify Payment - User ID:', userId);

    // ALWAYS create/update subscription regardless of webhook
    // Calculate 14 days from now
    const currentPeriodStart = new Date();
    const currentPeriodEnd = new Date();
    currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 14);
    currentPeriodEnd.setHours(23, 59, 59, 999); // End of day

    const subscriptionData = {
      user_id: userId,
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: session.subscription as string || null,
      stripe_session_id: session.id, // Store session ID too
      status: 'active',
      current_period_start: currentPeriodStart.toISOString(),
      current_period_end: currentPeriodEnd.toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log('Verify Payment - Creating/updating subscription with data:', subscriptionData);

    // Upsert subscription (update if exists, insert if not)
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .upsert(subscriptionData, {
        onConflict: 'user_id',
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (subscriptionError) {
      console.error('Error upserting subscription:', subscriptionError);
      return NextResponse.json({
        success: false,
        error: 'Failed to create/update subscription',
        details: subscriptionError.message,
      });
    }

    console.log('Verify Payment - Subscription created/updated:', subscription.id);

    // Check if payment already exists
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('id')
      .eq('stripe_session_id', sessionId)
      .maybeSingle();

    if (!existingPayment) {
      // Record payment
      const { error: paymentError } = await supabase.from('payments').insert({
        user_id: userId,
        stripe_payment_intent_id: session.payment_intent as string,
        stripe_session_id: sessionId,
        subscription_id: subscription.id,
        amount: session.amount_total || 0,
        currency: session.currency || 'usd',
        status: 'succeeded',
        created_at: new Date().toISOString(),
      });

      if (paymentError) {
        console.error('Error recording payment:', paymentError);
      } else {
        console.log('Payment recorded successfully');
      }
    }

    // Check if subscription has expired (just in case)
    const now = new Date();
    const periodEnd = new Date(subscription.current_period_end);
    const isExpired = periodEnd < now;

    if (isExpired) {
      // Update to inactive since it's expired
      await supabase
        .from('subscriptions')
        .update({ 
          status: 'inactive',
          updated_at: now.toISOString()
        })
        .eq('id', subscription.id);
      
      return NextResponse.json({
        success: false,
        error: 'Subscription has expired. Please renew.',
        expired: true,
      });
    }

    // Calculate days remaining
    const daysRemaining = Math.ceil((periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return NextResponse.json({
      success: true,
      message: 'Payment verified and subscription activated',
      subscription: {
        id: subscription.id,
        status: subscription.status,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        days_remaining: daysRemaining,
      },
    });

  } catch (error: any) {
    console.error('Verify payment error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Payment verification failed',
        stack: error.stack 
      },
      { status: 500 }
    );
  }
}