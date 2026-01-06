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
      apiVersion: '2025-12-15.clover',
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

    console.log('Retrieved session:', {
      id: session.id,
      payment_status: session.payment_status,
      status: session.status,
      customer: session.customer,
      amount_total: session.amount_total,
    });

    // Check if payment was successful
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

    console.log('Processing verification for user:', userId);

    // Check if subscription already exists
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    const subscriptionData = {
      user_id: userId,
      stripe_customer_id: session.customer as string,
      status: 'active',
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    };

    let subscriptionId;

    if (existingSubscription) {
      // Update existing subscription
      const { data, error } = await supabase
        .from('subscriptions')
        .update(subscriptionData)
        .eq('user_id', userId)
        .select('id')
        .single();

      if (error) {
        console.error('Error updating subscription:', error);
        return NextResponse.json({
          success: false,
          error: 'Failed to update subscription',
        });
      }
      subscriptionId = data.id;
    } else {
      // Create new subscription
      const { data, error } = await supabase
        .from('subscriptions')
        .insert(subscriptionData)
        .select('id')
        .single();

      if (error) {
        console.error('Error creating subscription:', error);
        return NextResponse.json({
          success: false,
          error: 'Failed to create subscription',
        });
      }
      subscriptionId = data.id;
    }

    // Record payment
    const { error: paymentError } = await supabase.from('payments').insert({
      user_id: userId,
      stripe_payment_intent_id: session.payment_intent as string,
      stripe_session_id: sessionId,
      subscription_id: subscriptionId,
      amount: session.amount_total || 0,
      currency: session.currency || 'usd',
      status: 'succeeded',
    });

    if (paymentError) {
      console.error('Error recording payment:', paymentError);
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and subscription activated',
      subscriptionId,
      sessionId,
    });

  } catch (error: any) {
    console.error('Verify payment error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}