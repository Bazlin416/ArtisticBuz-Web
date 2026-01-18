// lib/subscription-check.ts
import { createServerSupabaseClient } from './supabase-server';

export async function checkSubscriptionExpiration() {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return;

    // Get all active subscriptions that have expired
    const now = new Date().toISOString();
    
    const { data: expiredSubscriptions, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'active')
      .lt('current_period_end', now);

    if (error) {
      console.error('Error fetching expired subscriptions:', error);
      return;
    }

    // Update expired subscriptions to inactive
    if (expiredSubscriptions && expiredSubscriptions.length > 0) {
      const subscriptionIds = expiredSubscriptions.map(sub => sub.id);
      
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({ 
          status: 'inactive',
          updated_at: now 
        })
        .in('id', subscriptionIds);

      if (updateError) {
        console.error('Error updating expired subscriptions:', updateError);
      } else {
        console.log(`Updated ${expiredSubscriptions.length} expired subscriptions to inactive`);
      }
    }
  } catch (error) {
    console.error('Error in subscription expiration check:', error);
  }
}