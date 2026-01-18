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

    console.log('Verify Payment - Retrieved session:', {
      id: session.id,
      payment_status: session.payment_status,
      status: session.status,
      customer: session.customer,
      amount_total: session.amount_total,
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

    console.log('Verify Payment - Checking for user:', userId);

    // IMPORTANT: Just verify, don't create/update
    // Check if subscription exists and is active
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (subscriptionError || !subscription) {
      // Subscription not created yet by webhook - wait and retry
      return NextResponse.json({
        success: false,
        error: 'Subscription not active yet. Please wait a moment.',
        retry: true,
      });
    }

    // Verify payment exists
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('stripe_session_id', sessionId)
      .eq('status', 'succeeded')
      .single();

    if (paymentError || !payment) {
      // Payment not recorded yet by webhook - wait and retry
      return NextResponse.json({
        success: false,
        error: 'Payment not recorded yet. Please wait a moment.',
        retry: true,
      });
    }

    // Check if subscription has expired
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

    return NextResponse.json({
      success: true,
      message: 'Payment verified and subscription active',
      subscription: {
        id: subscription.id,
        status: subscription.status,
        current_period_end: subscription.current_period_end,
        days_remaining: Math.ceil((periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      },
    });

  } catch (error: any) {
    console.error('Verify payment error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}