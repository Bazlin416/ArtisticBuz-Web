'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export default function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { checkSubscription } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const verifyPayment = async () => {
    if (retryCount >= maxRetries) {
      setStatus('error');
      setMessage('Payment verification is taking longer than expected. Your payment was successful, but subscription activation may be delayed. Please refresh in a minute.');
      return;
    }

    try {
      console.log('Verifying payment for session:', sessionId, 'Retry:', retryCount + 1);
      
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage('Payment verified successfully! Your subscription is now active.');
        
        // Update subscription status in auth context
        setTimeout(() => {
          checkSubscription();
        }, 1000);
        
        // Redirect to calculator after 3 seconds
        setTimeout(() => {
          router.push('/#calculator');
        }, 3000);
      } else if (data.retry) {
        // Webhook hasn't processed yet - retry after delay
        setRetryCount(prev => prev + 1);
        console.log(`Retrying verification... (${retryCount + 1}/${maxRetries})`);
        setTimeout(() => {
          verifyPayment();
        }, 2000); // 2 second delay
      } else if (data.expired) {
        setStatus('error');
        setMessage('Subscription has expired. Please contact support.');
      } else {
        setStatus('error');
        setMessage(data.error || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setRetryCount(prev => prev + 1);
      if (retryCount < maxRetries) {
        setTimeout(() => {
          verifyPayment();
        }, 2000);
      } else {
        setStatus('error');
        setMessage('An error occurred while verifying payment. Please contact support.');
      }
    }
  };

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      setMessage('No session ID found. Please contact support with your payment details.');
      return;
    }

    verifyPayment();
  }, [sessionId, router, checkSubscription]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        {status === 'loading' && (
          <div className="text-center">
            <Loader2 className="h-16 w-16 animate-spin text-emerald-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verifying Payment
            </h2>
            <p className="text-gray-600 mb-2">
              Please wait while we confirm your payment...
            </p>
            <p className="text-sm text-gray-500">
              Attempt {retryCount + 1} of {maxRetries}
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to calculator in 3 seconds...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Verification Failed
            </h2>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/')}
                className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                Return to Home
              </button>
              <button
                onClick={() => {
                  setRetryCount(0);
                  setStatus('loading');
                  setTimeout(() => verifyPayment(), 500);
                }}
                className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}