'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export default function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const { checkSubscription, isSubscribed } = useAuth();

  const [status, setStatus] = useState<'loading' | 'verifying' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [purchaseTracked, setPurchaseTracked] = useState(false);

  const maxRetries = 2;

  /** Ensure subscription state actually updates */
  const verifySubscriptionUpdate = async (attempt = 0): Promise<boolean> => {
    if (attempt >= 3) return false;

    await checkSubscription();
    await new Promise(res => setTimeout(res, 500));

    if (isSubscribed) return true;
    return verifySubscriptionUpdate(attempt + 1);
  };

  const verifyPayment = async () => {
    if (!sessionId) {
      setStatus('error');
      setMessage('No payment session found.');
      setDebugInfo('Please contact support.');
      return;
    }

    try {
      setDebugInfo(`Verifying payment… (${retryCount + 1}/${maxRetries + 1})`);

      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Payment verification failed');
      }

      // ✅ Track Meta Pixel once
      if (typeof window !== 'undefined' && window.fbq && !purchaseTracked) {
        window.fbq('track', 'Purchase', {
          currency: 'USD',
          value: 1.0,
        });
        setPurchaseTracked(true);
      }

      setStatus('verifying');
      setMessage('Payment verified! Activating your subscription…');

      const subscriptionReady = await verifySubscriptionUpdate();

      setStatus('success');
      setMessage(
        subscriptionReady
          ? 'Subscription activated successfully!'
          : 'Payment successful! Subscription may take a moment to activate.'
      );

      setDebugInfo(
        subscriptionReady
          ? 'You now have full access.'
          : 'If access is delayed, refresh the page.'
      );

      setTimeout(() => {
        router.push('/#calculator');
      }, 2000);

    } catch (error: any) {
      if (retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
        setTimeout(verifyPayment, 2000);
      } else {
        setStatus('error');
        setMessage('Unable to verify payment.');
        setDebugInfo(error.message || 'Please contact support.');
      }
    }
  };

  useEffect(() => {
    verifyPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">

        {status === 'loading' && (
          <div className="text-center">
            <Loader2 className="h-16 w-16 animate-spin text-emerald-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold">Completing Purchase</h2>
            <p className="text-gray-600">{debugInfo}</p>
          </div>
        )}

        {status === 'verifying' && (
          <div className="text-center">
            <RefreshCw className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold">Activating Subscription</h2>
            <p className="text-gray-600">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold">{message}</h2>
            <p className="text-gray-500">{debugInfo}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold">{message}</h2>
            <p className="text-gray-500 mb-4">{debugInfo}</p>

            <button
              onClick={() => {
                setRetryCount(0);
                setStatus('loading');
                verifyPayment();
              }}
              className="w-full bg-emerald-600 text-white py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
