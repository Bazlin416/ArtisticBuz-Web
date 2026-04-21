"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, Clock } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { CurrencyService } from "@/lib/currency-service";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Optional: pass pre-detected values from the parent page to avoid a duplicate API call
  detectedCountry?: string;
  detectedAmount?: string;
  detectedCurrency?: string;
}

export function SubscriptionModal({
  isOpen,
  onClose,
  detectedCountry,
  detectedAmount: propAmount,
  detectedCurrency: propCurrency,
}: SubscriptionModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [country, setCountry] = useState<string>(detectedCountry ?? "default");
  const [displayAmount, setDisplayAmount] = useState<string>(propAmount ?? "");
  const [displayCurrency, setDisplayCurrency] = useState<string>(propCurrency ?? "USD");
  const [loadingCurrency, setLoadingCurrency] = useState(!propAmount);
  const { session, loading: authLoading } = useAuth();

  useEffect(() => {
    // If parent already provided currency info, use it and skip the API call
    if (propAmount) {
      setDisplayAmount(propAmount);
      setDisplayCurrency(propCurrency ?? "USD");
      setCountry(detectedCountry ?? "default");
      setLoadingCurrency(false);
      return;
    }
    // Otherwise detect on open
    if (isOpen) detectCountry();
  }, [isOpen, propAmount]);

  const detectCountry = async () => {
    try {
      setLoadingCurrency(true);
      const response = await fetch("https://ipapi.co/json/");
      if (response.ok) {
        const data = await response.json();
        const countryCode = data.country_code || "US";
        setCountry(countryCode);
        const info = await CurrencyService.getCurrencyInfo(countryCode);
        setDisplayAmount(info.display);
        setDisplayCurrency(info.currency);
      }
    } catch {
      const fallback = await CurrencyService.getCurrencyInfo("US");
      setDisplayAmount(fallback.display);
      setDisplayCurrency(fallback.currency);
    } finally {
      setLoadingCurrency(false);
    }
  };

  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!session) {
        setError("Please log in to subscribe");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country }),
      });

      if (response.status === 401) {
        setError("Authentication failed. Please log in again.");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        let msg = `Error: ${response.status}`;
        try { msg = (await response.json()).error || msg; } catch {}
        throw new Error(msg);
      }

      const data = await response.json();
      if (data.error) { setError(data.error); setLoading(false); return; }
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err: any) {
      if (err.message?.includes("Failed to fetch")) {
        setError("Network error. Please check your connection and try again.");
      } else if (err.message?.includes("Already subscribed")) {
        setError("You already have an active subscription.");
      } else {
        setError(err.message || "An unexpected error occurred. Please try again.");
      }
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Unlock the Full Hair Calculator
          </DialogTitle>
          <DialogDescription>
            One-time payment for complete access to graft estimates, cost breakdowns, and specialist consultation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Pricing card */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-100">
            <div className="text-center mb-5">
              {/* Prominent 14-day access badge */}
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                <Clock className="w-4 h-4" />
                14-Day Full Access
              </div>

              <p className="text-sm text-gray-500 mb-1">One-time payment — no recurring charges</p>

              <div className="flex items-center justify-center gap-2 my-3">
                {loadingCurrency ? (
                  <div className="h-12 w-28 bg-emerald-200 rounded-lg animate-pulse" />
                ) : (
                  <span className="text-5xl font-bold text-emerald-600">{displayAmount}</span>
                )}
              </div>

              <p className="text-xs text-gray-400">
                {loadingCurrency ? "Detecting your currency..." : `Billed in ${displayCurrency}`}
              </p>
            </div>

            <div className="space-y-3">
              {[
                "Accurate graft estimates based on the Norwood scale",
                "Female pattern adjustment for diffuse thinning",
                "Transparent cost range in your local currency",
                "3D scalp area visualisation with the interactive model",
                "Specialist consultation form submission",
                "Full access to our hair loss FAQ library",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {!session && (
            <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
              Please log in before subscribing.
            </div>
          )}

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleSubscribe}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6"
              disabled={loading || !session || loadingCurrency}
            >
              {loading ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
              ) : !session ? (
                "Please Log In to Subscribe"
              ) : loadingCurrency ? (
                "Detecting your currency..."
              ) : (
                `Get 14-Day Access — ${displayAmount}`
              )}
            </Button>

            <p className="text-xs text-center text-gray-500">
              Secure payment via Stripe. One-time charge, access expires after 14 days.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
