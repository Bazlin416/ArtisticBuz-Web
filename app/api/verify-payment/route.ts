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

    // 1. Get session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'customer'],
    });

    console.log('🔍 Verify Payment - Session:', {
      id: session.id,
      payment_status: session.payment_status,
      status: session.status,
      amount_total: session.amount_total,
      currency: session.currency,
      livemode: session.livemode,
      customer: session.customer,
    });

    // 2. Check if payment was successful
    if (session.payment_status !== 'paid') {
      return NextResponse.json({
        success: false,
        error: `Payment not completed. Status: ${session.payment_status}`,
      });
    }

    // 3. Get user ID
    const userId = session.metadata?.user_id || session.client_reference_id;
    
    if (!userId) {
      console.error('❌ No user ID found in session metadata:', session.metadata);
      return NextResponse.json({
        success: false,
        error: 'No user ID found. Please contact support.',
      });
    }

    console.log('✅ Payment verified for user:', userId);

    // 4. Calculate 14 days from NOW (not from session creation)
    const currentPeriodStart = new Date();
    const currentPeriodEnd = new Date();
    currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 14);
    currentPeriodEnd.setHours(23, 59, 59, 999); // End of day

    // 5. Create/Update subscription (UPSERT - update or insert)
    const subscriptionData = {
      user_id: userId,
      stripe_customer_id: typeof session.customer === 'string' ? session.customer : (session.customer as any)?.id || null,
      stripe_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent ? 
        (typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent.id) : 
        null,
      status: 'active',
      current_period_start: currentPeriodStart.toISOString(),
      current_period_end: currentPeriodEnd.toISOString(),
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    console.log('📝 Creating/Updating subscription with:', subscriptionData);

    // Use upsert to handle both new and existing subscriptions
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .upsert(subscriptionData, {
        onConflict: 'user_id', // Update if user already has subscription
      })
      .select()
      .single();

    if (subscriptionError) {
      console.error('❌ Subscription upsert error:', subscriptionError);
      return NextResponse.json({
        success: false,
        error: 'Failed to create/update subscription',
        details: subscriptionError.message,
      });
    }

    console.log('✅ Subscription created/updated:', subscription.id);

    // 6. Record payment (if not already recorded)
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('id')
      .eq('stripe_session_id', sessionId)
      .maybeSingle();

    if (!existingPayment) {
      const { error: paymentError } = await supabase.from('payments').insert({
        user_id: userId,
        stripe_payment_intent_id: session.payment_intent ? 
          (typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent.id) : 
          null,
        stripe_session_id: sessionId,
        subscription_id: subscription.id,
        amount: session.amount_total || 0,
        currency: session.currency || 'usd',
        status: 'succeeded',
        created_at: new Date().toISOString(),
      });

      if (paymentError) {
        console.error('❌ Payment recording error:', paymentError);
        // Don't fail the whole process if payment recording fails
      } else {
        console.log('✅ Payment recorded successfully');
      }
    }

    // 7. Return success with subscription details
    const now = new Date();
    const periodEnd = new Date(subscription.current_period_end);
    const daysRemaining = Math.ceil((periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return NextResponse.json({
      success: true,
      message: 'Payment verified and subscription activated',
      subscription: {
        id: subscription.id,
        status: subscription.status,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        days_remaining: daysRemaining > 0 ? daysRemaining : 0,
      },
      payment: {
        amount: (session.amount_total || 0) / 100, // Convert from cents
        currency: session.currency,
        status: 'succeeded',
      },
    });

  } catch (error: any) {
    console.error('🔥 Verify payment error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Payment verification failed',
        code: error.code || 'UNKNOWN_ERROR',
      },
      { status: 500 }
    );
  }
}