"use client";

import { useState, useEffect } from "react"; // Add useEffect import
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BaldnessTypeGrid } from "@/components/calculator/baldness-type-grid";
import { ResultPanel } from "@/components/calculator/result-panel";
import { ConsultationFormModal } from "@/components/calculator/consultation-form-modal";
import { FAQSection } from "@/components/faq/faq-section";
import { AuthModal } from "@/components/auth/auth-modal";
import { SubscriptionModal } from "@/components/subscription/subscription-modal";
import { baldnessTypes } from "@/lib/calculator-data";
import { BaldnessType } from "@/types/calculator";
import { Calculator, Shield, Award, Users, Lock } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import type { GenderPreference } from "@/lib/calculator-data";

export default function Home() {
  const [selectedType, setSelectedType] = useState<BaldnessType | null>(null);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [genderPreference, setGenderPreference] = useState<GenderPreference>('neutral');
  const { user, isSubscribed, loading } = useAuth();
  const [country, setCountry] = useState<string>('default');
  const [detectedCurrency, setDetectedCurrency] = useState<string>('USD');
  const [detectedAmount, setDetectedAmount] = useState<string>('$1.00');

  // Move the useEffect hook here, after all useState declarations
  useEffect(() => {
    detectCountry();
  }, []);

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

  const handleSelectType = (type: BaldnessType) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!isSubscribed) {
      setIsSubscriptionModalOpen(true);
      return;
    }

    setSelectedType(type);
    setTimeout(() => {
      document
        .getElementById("results")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20">
        <section className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-7xl mx-auto">
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Hair Graft Calculator
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl text-emerald-50 mb-8 leading-relaxed max-w-2xl">
                  Estimate how many hair grafts you need for a natural hair
                  transplant. Our easy-to-use hair transplant graft
                  calculator helps you plan your hair restoration journey with
                  confidence.
                </p>

                <button
                  onClick={() => setIsConsultationModalOpen(true)}
                  className="bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl mb-12 lg:mb-0">
                  Get a Consultation
                </button>
              </div>

              <div className="flex-1 flex justify-center lg:justify-end">
                <div className="relative max-w-md lg:max-w-lg">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                    <img
                      src="/Patient-Images-ArtisticClinic-Nairobi-11-25-2025_12_36_AM.png"
                      alt="Patient before and after hair transplant results from Artistic Clinic Nairobi"
                      className="w-full h-auto object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/30 to-transparent"></div>
                  </div>

                  <div className="absolute -bottom-4 -right-4 bg-white text-emerald-700 px-6 py-3 rounded-xl shadow-2xl font-bold text-sm">
                    Natural Results
                  </div>

                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-emerald-300 rounded-full opacity-60"></div>
                  <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-teal-400 rounded-full opacity-40"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="font-bold text-2xl text-gray-900 mb-1">
                  15,000+
                </h3>
                <p className="text-gray-600 text-sm">Happy Patients</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="font-bold text-2xl text-gray-900 mb-1">
                  20+ Years
                </h3>
                <p className="text-gray-600 text-sm">Experience</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="font-bold text-2xl text-gray-900 mb-1">98%</h3>
                <p className="text-gray-600 text-sm">Success Rate</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="font-bold text-2xl text-gray-900 mb-1">
                  Certified
                </h3>
                <p className="text-gray-600 text-sm">Specialists</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50" id="calculator">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Calculate Your Hair Restoration Needs
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
                  Select your hair loss pattern below to get an instant estimate
                  of the number of grafts you may need for optimal results.
                </p>

                {!loading && !user && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto mb-8">
                    <Lock className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Sign In to Access Calculator
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Create an account or sign in to use our professional hair graft calculator
                    </p>
                    <Button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Sign In / Create Account
                    </Button>
                  </div>
                )}

                {!loading && user && !isSubscribed && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 max-w-2xl mx-auto mb-8">
                    <Lock className="w-12 h-12 text-amber-600 mx-auto mb-3" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Subscribe to Access Results
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Get lifetime access to the calculator for just {detectedAmount}
                    </p>
                    <Button
                      onClick={() => setIsSubscriptionModalOpen(true)}
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      Subscribe Now - {detectedAmount}
                    </Button>
                  </div>
                )}

                {user && isSubscribed && (
                  <div className="flex justify-center gap-4 mb-8">
                    <button
                      onClick={() => setGenderPreference('neutral')}
                      className={`px-6 py-3 rounded-lg font-medium transition-all ${
                        genderPreference === 'neutral'
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Neutral
                    </button>
                    <button
                      onClick={() => setGenderPreference('male')}
                      className={`px-6 py-3 rounded-lg font-medium transition-all ${
                        genderPreference === 'male'
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Male
                    </button>
                    <button
                      onClick={() => setGenderPreference('female')}
                      className={`px-6 py-3 rounded-lg font-medium transition-all ${
                        genderPreference === 'female'
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Female
                    </button>
                  </div>
                )}
              </div>

              <BaldnessTypeGrid
                types={baldnessTypes}
                selectedType={selectedType}
                onSelectType={handleSelectType}
                genderPreference={genderPreference}
                disabled={!user || !isSubscribed}
              />

              {selectedType && user && isSubscribed && (
                <div
                  id="results"
                  className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500"
                >
                  <ResultPanel
                    selectedType={selectedType}
                    onConsultationClick={() => setIsConsultationModalOpen(true)}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Choose Our Hair Restoration Services?
              </h2>
              <p className="text-gray-300 text-lg mb-12">
                We combine advanced techniques with personalized care to deliver
                natural, lasting results
              </p>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3">Expert Team</h3>
                  <p className="text-gray-300 text-sm">
                    Board-certified surgeons with decades of combined experience
                    in hair restoration
                  </p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3">Safe & Proven</h3>
                  <p className="text-gray-300 text-sm">
                    FDA-approved techniques with comprehensive safety protocols
                    and sterile environments
                  </p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3">
                    Personalized Care
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Customized treatment plans tailored to your unique hair
                    characteristics and goals
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FAQSection />

        <section className="py-20 bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Start Your Hair Restoration Journey?
              </h2>
              <p className="text-emerald-50 text-lg mb-8">
                Get a free consultation with our specialists and receive a
                personalized treatment plan
              </p>
              <button
                onClick={() => setIsConsultationModalOpen(true)}
                className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold px-8 py-4 rounded-lg text-lg transition-colors shadow-lg"
              >
                Schedule Free Consultation
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
      />

      {selectedType && (
        <ConsultationFormModal
          isOpen={isConsultationModalOpen}
          onClose={() => setIsConsultationModalOpen(false)}
          selectedType={selectedType.title}
          estimatedGrafts={selectedType.grafts}
        />
      )}
    </div>
  );
}