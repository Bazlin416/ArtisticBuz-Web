'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export default function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { checkSubscription } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2; // Reduced since we're not waiting for webhook

  const verifyPayment = async () => {
    if (!sessionId) {
      setStatus('error');
      setMessage('No payment session found.');
      setDebugInfo('Please contact support with your payment details.');
      return;
    }

    try {
      console.log('🔍 Verifying payment for session:', sessionId);
      setDebugInfo(`Verifying payment... Attempt ${retryCount + 1}/${maxRetries}`);
      
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();
      console.log('✅ Verify payment response:', data);

      if (data.success) {
        setStatus('success');
        setMessage('Payment successful! Your subscription is now active.');
        setDebugInfo(`Access granted until: ${new Date(data.subscription.current_period_end).toLocaleDateString()}`);
        
        // Immediately update auth context
        setTimeout(() => {
          checkSubscription();
        }, 500);
        
        // Redirect after 3 seconds
        setTimeout(() => {
          router.push('/#calculator');
        }, 3000);
        
      } else {
        // Retry once if it's a temporary error
        if (retryCount < maxRetries - 1 && 
            (data.error.includes('temporarily') || data.error.includes('wait'))) {
          setRetryCount(prev => prev + 1);
          setDebugInfo(`Retrying... (${retryCount + 1}/${maxRetries})`);
          setTimeout(() => verifyPayment(), 2000);
        } else {
          setStatus('error');
          setMessage(`Payment verification failed: ${data.error || 'Unknown error'}`);
          setDebugInfo(`Session ID: ${sessionId}. Please contact support.`);
        }
      }
    } catch (error: any) {
      console.error('❌ Network error:', error);
      
      if (retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
        setDebugInfo(`Network error. Retrying... (${retryCount + 1}/${maxRetries})`);
        setTimeout(() => verifyPayment(), 2000);
      } else {
        setStatus('error');
        setMessage('Network error. Please check your connection and refresh the page.');
        setDebugInfo(`If problem persists, contact support with session ID: ${sessionId}`);
      }
    }
  };

  useEffect(() => {
    verifyPayment();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-200">
        {status === 'loading' && (
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 border-4 border-emerald-100 rounded-full"></div>
              </div>
              <Loader2 className="h-20 w-20 animate-spin text-emerald-600 mx-auto" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Completing Your Purchase
              </h2>
              <p className="text-gray-600 mb-4">
                Please wait while we confirm your payment...
              </p>
              <div className="space-y-2">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${(retryCount / maxRetries) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500">
                  Step {retryCount + 1} of {maxRetries + 1}
                </p>
              </div>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-12 w-12 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                🎉 Payment Successful!
              </h2>
              <p className="text-gray-600 mb-6">
                {message}
              </p>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-emerald-800 font-medium">
                  {debugInfo}
                </p>
              </div>
              <div className="animate-pulse">
                <p className="text-sm text-gray-500">
                  Redirecting to calculator in 3 seconds...
                </p>
              </div>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-gradient-to-r from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Issue Detected
              </h2>
              <p className="text-gray-600 mb-4">
                {message}
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-800 font-medium">
                  {debugInfo}
                </p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setRetryCount(0);
                    setStatus('loading');
                    setTimeout(() => verifyPayment(), 500);
                  }}
                  className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-md"
                >
                  Try Again
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Return to Home
                </button>
                <a
                  href={`mailto:support@artisticbuz.com?subject=Payment Issue - Session ${sessionId}`}
                  className="block w-full text-center text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}