import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  console.log("[WEBHOOK] POST request received");

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2025-11-17.clover" as any,
    });

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

    if (!webhookSecret) {
      console.error("[WEBHOOK] Missing webhook secret");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 },
      );
    }

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    console.log("[WEBHOOK] Processing request", {
      hasSignature: !!signature,
      bodyLength: body.length,
    });

    if (!signature) {
      console.error("[WEBHOOK] No signature found");
      return NextResponse.json(
        { error: "Missing stripe signature" },
        { status: 400 },
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log("[WEBHOOK] Event verified:", event.type);
    } catch (err: any) {
      console.error("[WEBHOOK] Signature verification failed:", err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 },
      );
    }

    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 },
      );
    }

    console.log("[WEBHOOK] Processing event type:", event.type);

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id || session.client_reference_id;

        console.log("[WEBHOOK] Checkout session completed:", {
          sessionId: session.id,
          paymentStatus: session.payment_status,
          userId,
          amount: session.amount_total,
          currency: session.currency,
        });

        if (!userId) {
          console.error("[WEBHOOK] No user ID found in session");
          return NextResponse.json({ received: true });
        }

        // Calculate 14 days from now
        const currentPeriodStart = new Date();
        const currentPeriodEnd = new Date();
        currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 14);
        currentPeriodEnd.setHours(23, 59, 59, 999);

        const subscriptionData = {
          user_id: userId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: (session.subscription as string) || null,
          status: "active",
          current_period_start: currentPeriodStart.toISOString(),
          current_period_end: currentPeriodEnd.toISOString(),
          updated_at: new Date().toISOString(),
        };

        try {
          const { data: existingSubscription } = await supabase
            .from("subscriptions")
            .select("id")
            .eq("user_id", userId)
            .maybeSingle();

          let subscriptionId;

          if (existingSubscription) {
            const { data } = await supabase
              .from("subscriptions")
              .update(subscriptionData)
              .eq("user_id", userId)
              .select("id")
              .single();
            subscriptionId = data?.id;
            console.log(
              "[WEBHOOK] Updated existing subscription:",
              subscriptionId,
            );
          } else {
            const { data } = await supabase
              .from("subscriptions")
              .insert(subscriptionData)
              .select("id")
              .single();
            subscriptionId = data?.id;
            console.log("[WEBHOOK] Created new subscription:", subscriptionId);
          }

          // Record payment
          if (subscriptionId) {
            const { error: paymentError } = await supabase
              .from("payments")
              .insert({
                user_id: userId,
                stripe_payment_intent_id: session.payment_intent as string,
                stripe_session_id: session.id,
                subscription_id: subscriptionId,
                amount: session.amount_total || 0,
                currency: session.currency || "usd",
                status: "succeeded",
              });

            if (paymentError) {
              console.error("[WEBHOOK] Error recording payment:", paymentError);
            } else {
              console.log("[WEBHOOK] Payment recorded successfully");
            }
          }

          console.log(
            "[WEBHOOK] Subscription and payment processed for user:",
            userId,
          );
        } catch (dbError: any) {
          console.error("[WEBHOOK] Database error:", dbError);
        }
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("[WEBHOOK] payment_intent.succeeded:", paymentIntent.id);

        try {
          await supabase
            .from("payments")
            .update({ status: "succeeded" })
            .eq("stripe_payment_intent_id", paymentIntent.id);
          console.log("[WEBHOOK] Payment status updated to succeeded");
        } catch (dbError: any) {
          console.error("[WEBHOOK] Database error updating payment:", dbError);
        }
        break;
      }

      default:
        console.log(`[WEBHOOK] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("[WEBHOOK] Error:", error);
    return NextResponse.json(
      { error: error.message || "Webhook handler failed" },
      { status: 500 },
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, stripe-signature",
    },
  });
}
