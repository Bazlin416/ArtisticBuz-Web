"use client";

import { useState, useEffect } from "react"; // Add useEffect import
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
import HairSpline from "@/components/HairSpline";
import HairGraftCalculator from "@/components/HairCalculator";
import { AreaKey } from "@/lib/spline-area-map";
import Image from "next/image";
import { sanityClient } from "@/lib/sanityClient";
import Link from 'next/link';
import {
  Scissors,
  Syringe,
  Sparkles,
  Brush,
  UserCheck,
} from "lucide-react";


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

  const [selectedArea, setSelectedArea] = useState<AreaKey | null>(null);

  const heroImages = [
    { src: "/American-man.png", alt: "Male hair transplant result" },
    { src: "/American-lady.png", alt: "Female hair transplant result" },
    { src: "/African-man.png", alt: "Male afro hair transplant result" },
    { src: "/African-lady.png", alt: "Female afro hair transplant result" },
  ];

  const LATEST_BLOGS_QUERY = `
*[_type == "blog" && discoverEligible == true]
| order(publishedAt desc)[0..2] {
  title,
  slug,
  excerpt,
  publishedAt,
  mainImage
}
`;

  const [latestBlogs, setLatestBlogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogs = await sanityClient.fetch(LATEST_BLOGS_QUERY);
        setLatestBlogs(blogs);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };
    fetchBlogs();
  }, []);


  // Auto-slide carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000);

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

      <main className="pt-20">
        <section className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white py-12 md:py-16 lg:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 max-w-7xl mx-auto">
              {/* Left Content */}
              <div className="flex-1 text-center lg:text-left order-2 lg:order-1 space-y-6">

                {/* Eyebrow / Badge */}
                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-2 rounded-full text-sm font-medium text-emerald-50">
                  <Shield className="w-4 h-4 text-emerald-200" />
                  Clinically Guided Hair Restoration Tool
                </div>

                {/* Headline */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
                  Know Exactly How Many{" "}
                  <span className="text-emerald-200">Hair Grafts</span>
                  <br className="hidden sm:block" />
                  You Need
                </h1>

                {/* Description */}
                <p className="text-base sm:text-lg md:text-xl text-emerald-50/90 max-w-2xl leading-relaxed">
                  Use our professional hair graft calculator to estimate the number of grafts
                  required for a natural-looking transplant — tailored to your hair loss
                  pattern, density, and goals.
                </p>

                {/* Trust Points */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-emerald-200" />
                    <span className="text-sm text-emerald-50/90">
                      15,000+ Patients Assisted
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-emerald-200" />
                    <span className="text-sm text-emerald-50/90">
                      20+ Years Clinical Insight
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calculator className="w-5 h-5 text-emerald-200" />
                    <span className="text-sm text-emerald-50/90">
                      Instant Graft Estimation
                    </span>
                  </div>
                </div>

                {/* CTA Group */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 items-center sm:items-start">

                  {/* Primary CTA */}
                  <button
                    onClick={() => {
                      const calculatorSection = document.getElementById("calculator");
                      if (calculatorSection) {
                        calculatorSection.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }
                    }}
                    disabled={!loading && !isSubscribed}
                    className={`${user && isSubscribed
                      ? "bg-white text-emerald-700 hover:bg-emerald-50 hover:shadow-xl"
                      : "bg-white/80 text-emerald-700/70 cursor-not-allowed opacity-75"
                      } px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg relative`}
                  >
                    Start Your Assessment
                    {!loading && !isSubscribed && (
                      <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                        SUBSCRIBE
                      </span>
                    )}
                  </button>

                  {/* Secondary CTA */}
                  <button
                    onClick={handleConsultationClick}
                    className="text-white/90 underline underline-offset-4 hover:text-white text-sm font-medium"
                  >
                    Speak to a Specialist
                  </button>
                </div>

                {/* Subscription Hint */}
                <p className="text-xs text-emerald-100/70 max-w-md">
                  Full graft breakdown & pricing available with a one-time subscription.
                </p>
              </div>


              {/* Right Content – Responsive Hero Visuals */}
              <div className="flex-1 w-full order-1 lg:order-2">
                {/* Desktop / Tablet: 2x2 Grid */}
                <div className="hidden lg:grid grid-cols-2 gap-4">
                  {heroImages.map((img, index) => (
                    <div
                      key={index}
                      className="relative aspect-[4/5] rounded-xl bg-white shadow-xl overflow-hidden"
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        className="object-contain p-4"
                        priority={index < 2}
                      />
                    </div>
                  ))}
                </div>

                {/* Mobile: Carousel */}
                <div className="lg:hidden relative">
                  <div className="relative aspect-[4/5] rounded-xl bg-white shadow-xl overflow-hidden">
                    <Image
                      src={heroImages[currentSlide].src}
                      alt={heroImages[currentSlide].alt}
                      fill
                      className="object-contain p-4 transition-opacity duration-500"
                      priority
                    />
                  </div>

                  {/* Dots */}
                  <div className="flex justify-center gap-2 mt-4">
                    {heroImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-2 rounded-full transition-all ${currentSlide === index
                          ? "w-6 bg-white"
                          : "w-2 bg-white/50"
                          }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Badge */}
                <div className="absolute -bottom-4 -right-4 bg-white text-emerald-700 px-4 py-2 rounded-xl shadow-lg font-bold text-sm">
                  Real Patient Results
                </div>
              </div>

            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">

              {/* Section Header */}
              <div className="text-center mb-12">
                <span className="inline-block text-sm font-semibold text-emerald-600 bg-emerald-50 px-4 py-1 rounded-full mb-4">
                  Trusted by Patients Worldwide
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                  Proven Results. Measurable Confidence.
                </h2>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

                {/* Stat Card 1 */}
                <div className="bg-gray-50 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                    15,000+
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Patients Assisted
                  </p>
                </div>

                {/* Stat Card 2 */}
                <div className="bg-gray-50 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                    20+ Years
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Clinical Experience
                  </p>
                </div>

                {/* Stat Card 3 */}
                <div className="bg-gray-50 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                    98%
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Success Rate
                  </p>
                </div>

                {/* Stat Card 4 */}
                <div className="bg-gray-50 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calculator className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                    Certified
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Hair Specialists
                  </p>
                </div>

              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 max-w-7xl">

            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-50 px-4 py-1 rounded-full mb-4">
                Our Services
              </span>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Comprehensive Hair Restoration Solutions
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed">
                ArtisticBuz offers a full range of medically guided hair restoration
                services — combining surgical precision, regenerative treatments,
                and aesthetic refinement to achieve natural, long-lasting results.
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

              {/* FUE */}
              <div className="bg-gray-50 rounded-3xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-5">
                  <Scissors className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  FUE Hair Transplant
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Follicular Unit Extraction (FUE) is a minimally invasive technique
                  where individual hair follicles are harvested and implanted for
                  natural density with minimal scarring and faster recovery.
                </p>
              </div>

              {/* FUT */}
              <div className="bg-gray-50 rounded-3xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-5">
                  <Brush className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  FUT Hair Transplant
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Follicular Unit Transplantation (FUT) is ideal for advanced hair loss
                  cases, allowing a higher graft yield through strip harvesting while
                  maintaining excellent cosmetic outcomes.
                </p>
              </div>

              {/* Beard */}
              <div className="bg-gray-50 rounded-3xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-5">
                  <UserCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Beard Transplant
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Designed for men with patchy or thin facial hair, beard transplants
                  restore fullness and symmetry using precise angle-controlled
                  implantation.
                </p>
              </div>

              {/* Eyebrow */}
              <div className="bg-gray-50 rounded-3xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-5">
                  <Sparkles className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Eyebrow Transplant
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  A highly artistic procedure that restores eyebrow shape and density,
                  customized to facial structure, gender, and natural growth direction.
                </p>
              </div>

              {/* PRP */}
              <div className="bg-gray-50 rounded-3xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-5">
                  <Syringe className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  PRP Treatment
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Platelet-Rich Plasma (PRP) therapy stimulates dormant follicles,
                  improves graft survival, and strengthens existing hair using your
                  body’s natural growth factors.
                </p>
              </div>

              {/* SMP */}
              <div className="bg-gray-50 rounded-3xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-5">
                  <Brush className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Scalp Micropigmentation (SMP)
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  A non-surgical cosmetic solution that creates the appearance of fuller
                  hair or a clean shaved look by depositing medical-grade pigment into
                  the scalp.
                </p>
              </div>

            </div>

            {/* CTA */}
            <div className="text-center mt-16">
              <button
                onClick={() => {
                  const calculatorSection = document.getElementById("calculator");
                  if (calculatorSection) {
                    calculatorSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition-all"
              >
                Calculate Your Graft Requirement
              </button>
            </div>

          </div>
        </section>

        <section
          id="calculator"
          className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">

              {/* Section Header */}
              <div className="text-center max-w-3xl mx-auto mb-14">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-50 px-4 py-1 rounded-full mb-4">
                  <Calculator className="w-4 h-4" />
                  Step 1: Hair Loss Assessment
                </span>

                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Calculate Your Hair Restoration Needs
                </h2>

                <p className="text-gray-600 text-lg">
                  Select the areas affected by hair loss to receive a clinically guided
                  estimate of the number of grafts required for natural, balanced
                  results.
                </p>
              </div>

              {/* ACCESS STATES */}
              <div className="space-y-8 mb-12">

                {/* Not signed in */}
                {!loading && !user && (
                  <div className="max-w-3xl mx-auto bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center">
                    <Lock className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Sign In to Begin Your Assessment
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Create an account or sign in to access our professional hair graft
                      calculator.
                    </p>
                    <Button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl"
                    >
                      Sign In / Create Account
                    </Button>
                  </div>
                )}

                {/* Signed in but not subscribed */}
                {!loading && user && !isSubscribed && (
                  <div className="max-w-3xl mx-auto bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
                    <Lock className="w-10 h-10 text-amber-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Unlock Full Calculator Access
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Get lifetime access to detailed graft estimates for just{" "}
                      <strong>{detectedAmount}</strong>.
                    </p>
                    <Button
                      onClick={() => setIsSubscriptionModalOpen(true)}
                      className="bg-amber-600 hover:bg-amber-700 px-8 py-3 rounded-xl"
                    >
                      Subscribe Now — {detectedAmount}
                    </Button>
                  </div>
                )}
              </div>

              {/* ACTIVE CALCULATOR */}
              {user && isSubscribed && (
                <div className="space-y-10">

                  {/* Gender Preference */}
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-sm text-gray-500">
                      Select reference pattern
                    </p>

                    <div className="inline-flex bg-gray-100 rounded-2xl p-1 shadow-inner">
                      {[
                        { key: "neutral", label: "Neutral" },
                        { key: "male", label: "Male" },
                        { key: "female", label: "Female" },
                      ].map((option) => (
                        <button
                          key={option.key}
                          onClick={() =>
                            setGenderPreference(option.key as GenderPreference)
                          }
                          className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all ${genderPreference === option.key
                            ? "bg-white text-emerald-700 shadow"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>

                    {selectedTypes.length > 0 && (
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600">
                          {selectedTypes.length} area
                          {selectedTypes.length !== 1 ? "s" : ""} selected
                        </span>
                        <button
                          onClick={() => setSelectedTypes([])}
                          className="text-gray-500 hover:text-red-600 underline underline-offset-4"
                        >
                          Clear selection
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Baldness Grid */}
                  <BaldnessTypeGrid
                    types={baldnessTypes}
                    selectedTypes={selectedTypes}
                    onSelectType={handleSelectType}
                    genderPreference={genderPreference}
                    disabled={!user || !isSubscribed}
                  />

                  {/* Results */}
                  {selectedTypes.length > 0 && (
                    <div
                      id="results"
                      className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                    >
                      <ResultPanel
                        selectedTypes={selectedTypes}
                        onConsultationClick={() =>
                          setIsConsultationModalOpen(true)
                        }
                        totals={totals}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 max-w-7xl">

            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-50 px-4 py-1 rounded-full mb-4">
                Step 2: Area-Based Estimation
              </span>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Visualize Affected Areas for Greater Accuracy
              </h2>

              <p className="text-gray-600 text-lg">
                Interact with the 3D head model to select specific areas of hair loss.
                Your selections will instantly refine the graft estimation.
              </p>
            </div>

            {/* Workspace */}
            <div className="grid md:grid-cols-2 gap-10 items-stretch">

              {/* 3D Head Card */}
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    3D Scalp Visualization
                  </h3>
                  <p className="text-sm text-gray-500">
                    Click on areas of thinning or baldness
                  </p>
                </div>

                <div className="flex-1 rounded-2xl overflow-hidden bg-gray-50">
                  <HairSpline
                    onAreaSelect={(area) => setSelectedArea(area)}
                  />
                </div>

                <div className="mt-4 text-xs text-gray-400">
                  Tip: Rotate the model to inspect all angles
                </div>
              </div>

              {/* Calculator Card */}
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    Area-Based Graft Calculator
                  </h3>
                  <p className="text-sm text-gray-500">
                    Selected areas automatically populate below
                  </p>
                </div>

                <div className="flex-1">
                  <HairGraftCalculator
                    externalArea={selectedArea ?? undefined}
                  />
                </div>

                <div className="mt-4 text-xs text-gray-400">
                  Calculations are based on average follicular unit density
                </div>
              </div>

            </div>
          </div>
        </section>

        <section className="py-24 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white relative overflow-hidden">
          {/* Subtle grid overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[length:32px_32px]" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-7xl mx-auto">

              {/* Header */}
              <div className="max-w-3xl mb-16">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 bg-emerald-400/10 px-4 py-1 rounded-full mb-4">
                  Clinical Excellence
                </span>

                <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                  Why Patients Trust Our Hair
                  <br className="hidden sm:block" />
                  Restoration Expertise
                </h2>

                <p className="text-gray-300 text-lg">
                  Our approach combines medical precision, advanced technology,
                  and personalized planning to deliver natural, long-lasting
                  hair restoration outcomes.
                </p>
              </div>

              {/* Content Grid */}
              <div className="grid md:grid-cols-2 gap-10 items-start">

                {/* LEFT – Core Pillars */}
                <div className="space-y-6">

                  {/* Pillar 1 */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                        <Award className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          Expert-Led Procedures
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          All assessments and procedures are guided by
                          board-certified specialists with decades of
                          combined experience in modern hair restoration.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Pillar 2 */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                        <Shield className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          Safe, Proven Techniques
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          We use globally recognized, FDA-approved
                          techniques supported by strict safety protocols
                          and sterile clinical environments.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Pillar 3 */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          Personalized Treatment Planning
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          Every graft estimate and treatment plan is
                          customized to your hair type, density, and
                          long-term restoration goals.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT – Differentiation Card */}
                <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-8 shadow-xl">
                  <h3 className="text-2xl font-bold mb-4">
                    What Makes Us Different
                  </h3>

                  <ul className="space-y-4 text-sm">
                    <li className="flex items-start gap-3">
                      <span className="mt-1 w-2 h-2 bg-white rounded-full" />
                      Clinically guided graft estimation — not guesswork
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 w-2 h-2 bg-white rounded-full" />
                      Area-by-area precision using 3D scalp visualization
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 w-2 h-2 bg-white rounded-full" />
                      Designed to support both Afro-textured and straight hair
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 w-2 h-2 bg-white rounded-full" />
                      Transparent methodology backed by clinical experience
                    </li>
                  </ul>

                  <div className="mt-8">
                    <button
                      onClick={() => {
                        const calculatorSection =
                          document.getElementById("calculator");
                        if (calculatorSection) {
                          calculatorSection.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }
                      }}
                      className="bg-white text-emerald-700 font-semibold px-6 py-3 rounded-xl hover:bg-emerald-50 transition-all shadow-lg"
                    >
                      Start Your Assessment
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        <section className="py-28 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            {/* Section Header */}
            <div className="mb-14 flex items-center justify-between">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Latest Insights
                </h2>
                <p className="text-gray-600 max-w-xl">
                  Expert insights, guides, and updates to help you make informed decisions.
                </p>
              </div>

              <Link
                href="/blog"
                className="hidden md:inline-flex text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                View all →
              </Link>
            </div>

            {/* Blog Cards */}
            <div className="grid gap-8 md:grid-cols-3">
              {latestBlogs.map((blog: any) => (
                <article
                  key={blog.slug.current}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  {/* Image */}
                  {blog.mainImage && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <img
                        src={blog.mainImage}
                        alt={blog.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6 flex flex-col h-full">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-snug group-hover:text-emerald-600 transition-colors">
                      {blog.title}
                    </h3>

                    <p className="text-sm text-gray-600 mb-6 line-clamp-3">
                      {blog.excerpt}
                    </p>

                    <div className="mt-auto">
                      <Link
                        href={`/blog/${blog.slug.current}`}
                        className="inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                      >
                        Read article
                        <span className="ml-1 transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Mobile CTA */}
            <div className="mt-12 text-center md:hidden">
              <Link
                href="/blog"
                className="inline-flex text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                View all articles →
              </Link>
            </div>
          </div>
        </section>


        <FAQSection />

        <section className="py-28 bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-700 text-white relative overflow-hidden">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[length:36px_36px]" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">

              {/* Trust framing */}
              <span className="inline-block text-sm font-semibold text-white/90 bg-white/10 px-4 py-1 rounded-full mb-5">
                Final Step
              </span>

              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                Take the Next Step Toward
                <br className="hidden sm:block" />
                Confident, Natural Hair Restoration
              </h2>

              <p className="text-emerald-50 text-lg max-w-2xl mx-auto mb-10">
                Your graft estimate is the foundation. A specialist consultation
                transforms it into a safe, personalized treatment plan designed
                for long-term results.
              </p>

              {/* CTA Button */}
              <div className="relative inline-flex flex-col items-center">

                <button
                  onClick={() => {
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
                  className={`${user && isSubscribed
                    ? "bg-white text-emerald-700 hover:bg-emerald-50 hover:shadow-2xl cursor-pointer"
                    : "bg-white/80 text-emerald-700/70 cursor-not-allowed opacity-80"
                    } font-semibold px-10 py-5 rounded-xl text-lg transition-all duration-300 shadow-xl relative pr-16`}
                >
                  Book a Specialist Consultation

                  {!loading && !isSubscribed && (
                    <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      Subscription Required
                    </span>
                  )}
                </button>

                {/* Reassurance text */}
                <p className="mt-4 text-sm text-white/80 max-w-md">
                  No obligation. Your consultation focuses on assessment,
                  safety, and realistic expectations — not pressure.
                </p>
              </div>

            </div>
          </div>
        </section>

      </main>

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
