import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// This can be called by a cron service like GitHub Actions, Vercel Cron, etc.
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Add a simple auth check for cron jobs
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    // Get all active subscriptions that have expired
    const now = new Date().toISOString();
    
    const { data: expiredSubscriptions, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'active')
      .lt('current_period_end', now);

    if (error) {
      console.error('Error fetching expired subscriptions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch subscriptions' },
        { status: 500 }
      );
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
        return NextResponse.json(
          { error: 'Failed to update subscriptions' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Updated ${expiredSubscriptions.length} subscriptions to inactive`,
        expiredCount: expiredSubscriptions.length,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'No expired subscriptions found',
      expiredCount: 0,
    });

  } catch (error: any) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: error.message || 'Cron job failed' },
      { status: 500 }
    );
  }
}