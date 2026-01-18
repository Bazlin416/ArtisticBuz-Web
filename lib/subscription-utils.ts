// lib/subscription-utils.ts (Client version)
import { createClient } from './supabase';

export async function checkAndUpdateSubscriptionExpiration(userId: string) {
  try {
    const supabase = createClient();
    if (!supabase) return false;

    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !subscription) {
      return false;
    }

    // Check if subscription has expired
    const now = new Date();
    const periodEnd = new Date(subscription.current_period_end);
    const isExpired = periodEnd < now;

    // If active but expired, update to inactive
    if ((subscription.status === 'active' || subscription.status === 'trialing') && isExpired) {
      await supabase
        .from('subscriptions')
        .update({ 
          status: 'inactive',
          updated_at: now.toISOString()
        })
        .eq('id', subscription.id);
      
      return false;
    }

    // Return true only if active AND not expired
    return (subscription.status === 'active' || subscription.status === 'trialing') && !isExpired;
  } catch (error) {
    console.error('Error checking subscription expiration:', error);
    return false;
  }
}