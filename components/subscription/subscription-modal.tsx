'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [country, setCountry] = useState<string>('default');
  const [detectedCurrency, setDetectedCurrency] = useState<string>('USD');
  const [detectedAmount, setDetectedAmount] = useState<string>('$1.00');
  const { session, loading: authLoading, checkSubscription } = useAuth();

  useEffect(() => {
    if (isOpen) {
      detectCountry();
    }
  }, [isOpen]);

  const detectCountry = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const data = await response.json();
        const detectedCountry = data.country_code || 'default';
        setCountry(detectedCountry);

        const currencyInfo = getCurrencyInfo(detectedCountry);
        setDetectedCurrency(currencyInfo.currency);
        setDetectedAmount(currencyInfo.display);

        console.log('Detected country:', detectedCountry, 'Currency:', currencyInfo.currency);
      }
    } catch (err) {
      console.error('Error detecting country:', err);
    }
  };

  const getCurrencyInfo = (countryCode: string): { currency: string; display: string } => {
    const currencyMap: Record<string, { currency: string; display: string }> = {
      'US': { currency: 'USD', display: '$1.00' },
      'KE': { currency: 'KES', display: 'KSH 130' },
      'GB': { currency: 'GBP', display: '£0.80' },
      'NG': { currency: 'NGN', display: '₦1,600' },
      'ZA': { currency: 'ZAR', display: 'R19' },
      'default': { currency: 'USD', display: '$1.00' }
    };

    const euCountries = ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'IE', 'PT', 'FI', 'GR'];
    if (euCountries.includes(countryCode)) {
      return { currency: 'EUR', display: '€0.95' };
    }

    return currencyMap[countryCode] || currencyMap['default'];
  };

  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if user is authenticated
      if (!session) {
        setError('Please log in to subscribe');
        setLoading(false);
        return;
      }

      console.log('User authenticated, user ID:', session.user.id);
      console.log('Creating checkout for country:', country);

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ country }),
      });

      console.log('Checkout response status:', response.status);

      // Handle response
      if (response.status === 401) {
        setError('Authentication failed. Please log in again.');
        setLoading(false);
        return;
      }

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // Couldn't parse JSON error
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      if (data.url) {
        console.log('Redirecting to Stripe checkout:', data.url);
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received from server');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      
      // User-friendly error messages
      if (err.message.includes('Failed to fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else if (err.message.includes('Already subscribed')) {
        setError('You already have an active subscription.');
      } else {
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
      
      setLoading(false);
    }
  };

  // Show loading state if auth is still loading
  if (authLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <span className="ml-2 text-gray-600">Loading....</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Subscribe to Access Hair Calculator</DialogTitle>
          <DialogDescription>
            Get instant access to our professional hair transplant calculator
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-100">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600 mb-2">One-time payment</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-5xl font-bold text-emerald-600">{detectedAmount}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">14 days access</p>
              <p className="text-xs text-gray-400 mt-1">Currency: {detectedCurrency}</p>
            </div>

            <div className="space-y-3 mt-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  Accurate hair graft estimation based on Norwood scale
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  Personalized cost calculations in KSH
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  Gender-inclusive visualization options
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  Expert consultation form submission
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  Access to comprehensive hair loss FAQ
                </p>
              </div>
            </div>
          </div>

          {!session && (
            <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
              Please log in to subscribe to the hair calculator
            </div>
          )}

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleSubscribe}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6"
              disabled={loading || !session}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : !session ? (
                'Please Log In to Subscribe'
              ) : (
                `Subscribe Now - ${detectedAmount}`
              )}
            </Button>

            <p className="text-xs text-center text-gray-500">
              Secure payment processed by Stripe. One-time payment, no recurring charges.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}