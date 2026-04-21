'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, AlertCircle, RefreshCw, Calendar, Calculator, UserCheck, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';

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
  const [expiryDate, setExpiryDate] = useState<string>('');

  const maxRetries = 2;

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

      if (typeof window !== 'undefined' && window.fbq && !purchaseTracked) {
        window.fbq('track', 'Purchase', { currency: 'USD', value: 1.0 });
        setPurchaseTracked(true);
      }

      // Compute expiry label (now + 14 days)
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 14);
      setExpiryDate(expiry.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }));

      setStatus('verifying');
      setMessage('Payment verified! Activating your subscription…');

      await verifySubscriptionUpdate();

      setStatus('success');
      setMessage('Subscription activated!');

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
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg w-full">

        {/* Loading */}
        {(status === 'loading' || status === 'verifying') && (
          <div className="text-center">
            {status === 'loading'
              ? <Loader2 className="h-14 w-14 animate-spin text-emerald-600 mx-auto mb-4" />
              : <RefreshCw className="h-14 w-14 animate-spin text-blue-600 mx-auto mb-4" />
            }
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {status === 'loading' ? 'Completing Purchase' : 'Activating Subscription'}
            </h2>
            <p className="text-gray-500 text-sm">{status === 'loading' ? debugInfo : message}</p>
          </div>
        )}

        {/* Success */}
        {status === 'success' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-9 w-9 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">You're all set!</h2>
              <p className="text-gray-600 text-sm">Your 14-day full access is now active.</p>
            </div>

            {/* Access card */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-emerald-700 font-semibold uppercase tracking-wide mb-0.5">Access expires</p>
                <p className="text-lg font-bold text-emerald-800">{expiryDate || '14 days from today'}</p>
              </div>
              <Calendar className="w-8 h-8 text-emerald-500" />
            </div>

            {/* What's unlocked */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">What you've unlocked</p>
              <ul className="space-y-2">
                {[
                  "Full graft estimates based on the Norwood scale",
                  "Female pattern & hair texture adjustments",
                  "Cost range in your local currency",
                  "3D scalp area visualisation",
                  "Specialist consultation form",
                  "Hair loss FAQ library",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Next steps */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Your next steps</p>
              <div className="space-y-3">
                {[
                  { icon: Calculator, step: "1", text: "Use the 3D model to select affected scalp areas" },
                  { icon: BookOpen, step: "2", text: "Pick your Norwood pattern from the grid" },
                  { icon: UserCheck, step: "3", text: "Submit a specialist consultation form" },
                ].map(({ icon: Icon, step, text }) => (
                  <div key={step} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                    <div className="w-7 h-7 bg-emerald-600 text-white rounded-full text-xs font-bold flex items-center justify-center shrink-0">{step}</div>
                    <Icon className="w-4 h-4 text-gray-400 shrink-0" />
                    <p className="text-sm text-gray-700">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/#calculator"
              className="block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md"
            >
              Go to Calculator →
            </Link>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div className="text-center">
            <AlertCircle className="h-14 w-14 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-1">{message}</h2>
            <p className="text-gray-500 text-sm mb-6">{debugInfo}</p>
            <button
              onClick={() => { setRetryCount(0); setStatus('loading'); verifyPayment(); }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-all"
            >
              Try Again
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
