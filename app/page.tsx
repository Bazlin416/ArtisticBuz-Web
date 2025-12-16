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
import { CurrencyService } from "@/lib/currency-service";

export default function Home() {
  const [selectedTypes, setSelectedTypes] = useState<BaldnessType[]>([]);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [genderPreference, setGenderPreference] =
    useState<GenderPreference>("neutral");
  const { user, isSubscribed, loading } = useAuth();
  const [country, setCountry] = useState<string>("");
  const [currencyInfo, setCurrencyInfo] = useState<{
    currency: string;
    display: string;
    rate: number;
  } | null>(null);
  const [loadingCurrency, setLoadingCurrency] = useState(true);

  const [detectedCurrency, setDetectedCurrency] = useState<string>("USD");
  const [detectedAmount, setDetectedAmount] = useState<string>("$1.00");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide carousel
  useEffect(() => {
    const slides = [
      "/mzungu.png",
      "/Patient-Images-ArtisticClinic-Nairobi-11-25-2025_12_36_AM.png",
      "/female.png",
    ];

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, []);

  // Move the useEffect hook here, after all useState declarations
  useEffect(() => {
    detectCountry();
  }, []);

  const detectCountry = async () => {
    try {
      setLoadingCurrency(true);
      const response = await fetch("https://ipapi.co/json/");
      if (response.ok) {
        const data = await response.json();
        const detectedCountry = data.country_code || "US";
        setCountry(detectedCountry);

        // Get dynamic currency info
        const info = await CurrencyService.getCurrencyInfo(detectedCountry);
        setCurrencyInfo({
          currency: info.currency,
          display: info.display,
          rate: info.rate,
        });

        // Update your existing state variables
        setDetectedCurrency(info.currency);
        setDetectedAmount(info.display);

        console.log(
          "Detected country:",
          detectedCountry,
          "Currency:",
          info.currency,
          "Rate:",
          info.rate
        );
      }
    } catch (err) {
      console.error("Error detecting country:", err);
      // Fallback to USD
      const fallbackInfo = await CurrencyService.getCurrencyInfo("US");
      setCurrencyInfo({
        currency: fallbackInfo.currency,
        display: fallbackInfo.display,
        rate: fallbackInfo.rate,
      });
      setDetectedCurrency(fallbackInfo.currency);
      setDetectedAmount(fallbackInfo.display);
    } finally {
      setLoadingCurrency(false);
    }
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

    // Toggle selection
    setSelectedTypes((prev) => {
      const isAlreadySelected = prev.some((t) => t.id === type.id);
      if (isAlreadySelected) {
        return prev.filter((t) => t.id !== type.id);
      } else {
        return [...prev, type];
      }
    });

    setTimeout(() => {
      document
        .getElementById("results")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleConsultationClick = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!isSubscribed) {
      // Scroll to calculator section if not subscribed
      if (typeof window !== "undefined") {
        // Method 1: Using window.location.hash (updates URL)
        window.location.hash = "#calculator";

        // Method 2: Using scrollIntoView (smooth scroll)
        setTimeout(() => {
          const calculatorSection = document.getElementById("calculator");
          if (calculatorSection) {
            calculatorSection.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }, 100);
      }
      return;
    }

    setIsConsultationModalOpen(true);
  };

  const calculateTotals = () => {
    if (selectedTypes.length === 0) {
      return {
        totalGraftMin: 0,
        totalGraftMax: 0,
        totalGraftsRange: "0",
        avgGrafts: 0,
      };
    }

    const totalGraftMin = selectedTypes.reduce(
      (sum, type) => sum + type.graftMin,
      0
    );
    const totalGraftMax = selectedTypes.reduce(
      (sum, type) => sum + type.graftMax,
      0
    );
    const avgGrafts = Math.round((totalGraftMin + totalGraftMax) / 2);

    return {
      totalGraftMin,
      totalGraftMax,
      totalGraftsRange: `${totalGraftMin.toLocaleString()} - ${totalGraftMax.toLocaleString()}`,
      avgGrafts,
    };
  };

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20">
        <section className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white py-12 md:py-16 lg:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 max-w-7xl mx-auto">
              {/* Left Content */}
              <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                  Hair Graft Calculator
                </h1>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-emerald-50 mb-6 sm:mb-8 leading-relaxed max-w-2xl">
                  Estimate how many hair grafts you need for a natural hair
                  transplant. Our easy-to-use hair transplant graft calculator
                  helps you plan your hair restoration journey with confidence.{" "}
                  <span className="font-semibold bg-emerald-800/30 px-2 py-1 rounded">
                    Subscribe to access detailed graft counts and pricing
                    estimates.
                  </span>
                </p>

                <div className="relative inline-block">
                  <button
                    onClick={() => {
                      // Only works when subscribed
                      const calculatorSection =
                        document.getElementById("calculator");
                      if (calculatorSection) {
                        calculatorSection.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }
                    }}
                    disabled={!loading && !isSubscribed}
                    className={`${
                      user && isSubscribed
                        ? "bg-white text-emerald-700 hover:bg-emerald-50 hover:scale-105 hover:shadow-xl cursor-pointer"
                        : "bg-white/80 text-emerald-700/70 cursor-not-allowed opacity-75"
                    } px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all duration-300 transform shadow-lg relative pr-12`}
                  >
                    Get a Consultation
                    {!loading && !isSubscribed && (
                      <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                        SUBSCRIBE
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Content - Carousel */}
              <div className="flex-1 flex justify-center lg:justify-end w-full order-1 lg:order-2 mb-8 lg:mb-0">
                <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
                  {/* Carousel Container */}
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 h-48 sm:h-56 md:h-64 lg:h-80 xl:h-96 w-full">
                    {/* Images */}
                    {[
                      "/mzungu.jpg",
                      "/Patient-Images-ArtisticClinic-Nairobi-11-25-2025_12_36_AM.png",
                      "/female.png",
                    ].map((src, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                          index === currentSlide ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <img
                          src={src}
                          alt={`Hair transplant result ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/30 to-transparent"></div>
                      </div>
                    ))}

                    {/* Navigation Dots */}
                    <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                      {[0, 1, 2].map((index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                            index === currentSlide
                              ? "bg-white w-3 sm:w-4"
                              : "bg-white/50 hover:bg-white/80"
                          }`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>

                    {/* Navigation Arrows - Hidden on small screens */}
                    <button
                      onClick={() =>
                        setCurrentSlide((prev) => (prev - 1 + 3) % 3)
                      }
                      className="hidden sm:block absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors z-10"
                      aria-label="Previous slide"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => setCurrentSlide((prev) => (prev + 1) % 3)}
                      className="hidden sm:block absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors z-10"
                      aria-label="Next slide"
                    >
                      ›
                    </button>
                  </div>

                  {/* "Natural Results" badge */}
                  <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 bg-white text-emerald-700 px-3 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl shadow-xl font-bold text-xs sm:text-sm z-20 whitespace-nowrap">
                    Natural Results
                  </div>

                  {/* Decorative circles */}
                  <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-emerald-300 rounded-full opacity-60"></div>
                  <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 bg-teal-400 rounded-full opacity-40"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-5 sm:py-16 bg-white">
          <div className="container mx-auto px-2 sm:px-4">
            <div className="flex flex-row justify-between items-center gap-3 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
              {/* Stat 1 */}
              <div className="text-center flex-1">
                <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                  <Users className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-emerald-600" />
                </div>
                <h3 className="font-bold text-base sm:text-xl md:text-2xl text-gray-900 mb-0.5 sm:mb-1">
                  15,000+
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-tight">
                  Happy Patients
                </p>
              </div>

              {/* Stat 2 */}
              <div className="text-center flex-1">
                <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                  <Award className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-emerald-600" />
                </div>
                <h3 className="font-bold text-base sm:text-xl md:text-2xl text-gray-900 mb-0.5 sm:mb-1">
                  20+ Years
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-tight">
                  Experience
                </p>
              </div>

              {/* Stat 3 */}
              <div className="text-center flex-1">
                <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                  <Shield className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-emerald-600" />
                </div>
                <h3 className="font-bold text-base sm:text-xl md:text-2xl text-gray-900 mb-0.5 sm:mb-1">
                  98%
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-tight">
                  Success Rate
                </p>
              </div>

              {/* Stat 4 */}
              <div className="text-center flex-1">
                <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                  <Calculator className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-emerald-600" />
                </div>
                <h3 className="font-bold text-base sm:text-xl md:text-2xl text-gray-900 mb-0.5 sm:mb-1">
                  Certified
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-tight">
                  Specialists
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-5 bg-gray-50" id="calculator">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Calculate Your Hair Restoration Needs
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
                  Select your hair loss pattern(s) below to get an instant
                  estimate of the number of grafts you may need for optimal
                  results.
                </p>

                {!loading && !user && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto mb-8">
                    <Lock className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Sign In to Access Calculator
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Create an account or sign in to use our professional hair
                      graft calculator
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
                      Subscribe to Access Calculator and Result
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Get lifetime access to the calculator for just{" "}
                      {detectedAmount}
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
                  <div className="flex flex-col items-center gap-6 mb-8">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => setGenderPreference("neutral")}
                        className={`px-6 py-3 rounded-lg font-medium transition-all ${
                          genderPreference === "neutral"
                            ? "bg-emerald-600 text-white shadow-md"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Neutral
                      </button>
                      <button
                        onClick={() => setGenderPreference("male")}
                        className={`px-6 py-3 rounded-lg font-medium transition-all ${
                          genderPreference === "male"
                            ? "bg-emerald-600 text-white shadow-md"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Male
                      </button>
                      <button
                        onClick={() => setGenderPreference("female")}
                        className={`px-6 py-3 rounded-lg font-medium transition-all ${
                          genderPreference === "female"
                            ? "bg-emerald-600 text-white shadow-md"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Female
                      </button>
                    </div>

                    {selectedTypes.length > 0 && (
                      <div className="flex items-center gap-4">
                        <span className="text-gray-600">
                          {selectedTypes.length} area
                          {selectedTypes.length !== 1 ? "s" : ""} selected
                        </span>
                        <button
                          onClick={() => setSelectedTypes([])}
                          className="text-sm text-gray-600 hover:text-red-600 hover:underline"
                        >
                          Clear All
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <BaldnessTypeGrid
                types={baldnessTypes}
                selectedTypes={selectedTypes}
                onSelectType={handleSelectType}
                genderPreference={genderPreference}
                disabled={!user || !isSubscribed}
              />

              {selectedTypes.length > 0 && user && isSubscribed && (
                <div
                  id="results"
                  className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500"
                >
                  <ResultPanel
                    selectedTypes={selectedTypes}
                    onConsultationClick={() => setIsConsultationModalOpen(true)}
                    totals={totals}
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
                Consult our specialists and receive a
                personalized treatment plan
              </p>
              <div className="relative inline-block">
                <button
                  onClick={() => {
                    // Only works when subscribed
                    const calculatorSection =
                      document.getElementById("calculator");
                    if (calculatorSection) {
                      calculatorSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                  }}
                  disabled={!loading && !isSubscribed}
                  className={`${
                    user && isSubscribed
                      ? "bg-white text-emerald-600 hover:bg-emerald-50 hover:shadow-xl cursor-pointer"
                      : "bg-white/80 text-emerald-600/70 cursor-not-allowed opacity-75"
                  } font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 shadow-lg relative pr-16`}
                >
                  Schedule a Consultation
                  {!loading && !isSubscribed && (
                    <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      SUBSCRIBE
                    </span>
                  )}
                </button>
              </div>
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

      {selectedTypes.length > 0 && (
        <ConsultationFormModal
          isOpen={isConsultationModalOpen}
          onClose={() => setIsConsultationModalOpen(false)}
          selectedType={selectedTypes.map((t) => t.title).join(", ")}
          estimatedGrafts={totals.totalGraftsRange}
        />
      )}
    </div>
  );
}
