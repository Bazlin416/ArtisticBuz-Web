"use client";

import { useState, useEffect } from "react";
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
import { Scissors, Syringe, Sparkles, Brush, UserCheck } from "lucide-react";
import { urlFor } from '@/lib/sanityImage'

export default function Home() {
  const [selectedTypes, setSelectedTypes] = useState<BaldnessType[]>([]);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [genderPreference, setGenderPreference] = useState<GenderPreference>("neutral");
  const { user, isSubscribed, loading } = useAuth();
  const [country, setCountry] = useState<string>("");
  const [currencyInfo, setCurrencyInfo] = useState<{ currency: string; display: string; rate: number; } | null>(null);
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
      seoTitle,
      slug,
      excerpt,
      publishedAt,
      topic,
      mainImage
    }
  `;

  const PARTNERS_QUERY = `
*[_type == "partner" && isActive == true] | order(orderRank asc) {
  name,
  city,
  country,
  website,
  logo
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { detectCountry(); }, []);

  const [partners, setPartners] = useState<any[]>([]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await sanityClient.fetch(PARTNERS_QUERY);
        setPartners(data);
      } catch (err) {
        console.error("Error fetching partners:", err);
      }
    };
    fetchPartners();
  }, []);


  const detectCountry = async () => {
    try {
      setLoadingCurrency(true);
      const response = await fetch("https://ipapi.co/json/");
      if (response.ok) {
        const data = await response.json();
        const detectedCountry = data.country_code || "US";
        setCountry(detectedCountry);

        const info = await CurrencyService.getCurrencyInfo(detectedCountry);
        setCurrencyInfo({ currency: info.currency, display: info.display, rate: info.rate });
        setDetectedCurrency(info.currency);
        setDetectedAmount(info.display);
      }
    } catch (err) {
      console.error("Error detecting country:", err);
      const fallbackInfo = await CurrencyService.getCurrencyInfo("US");
      setCurrencyInfo({ currency: fallbackInfo.currency, display: fallbackInfo.display, rate: fallbackInfo.rate });
      setDetectedCurrency(fallbackInfo.currency);
      setDetectedAmount(fallbackInfo.display);
    } finally {
      setLoadingCurrency(false);
    }
  };

  const handleSelectType = (type: BaldnessType) => {
    if (!user) { setIsAuthModalOpen(true); return; }
    if (!isSubscribed) { setIsSubscriptionModalOpen(true); return; }

    setSelectedTypes((prev) => {
      const isAlreadySelected = prev.some((t) => t.id === type.id);
      return isAlreadySelected ? prev.filter((t) => t.id !== type.id) : [...prev, type];
    });

    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleConsultationClick = () => {
    if (!user) { setIsAuthModalOpen(true); return; }
    if (!isSubscribed) {
      const calculatorSection = document.getElementById("calculator");
      if (calculatorSection) {
        calculatorSection.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    setIsConsultationModalOpen(true);
  };

  const calculateTotals = () => {
    if (selectedTypes.length === 0) return { totalGraftMin: 0, totalGraftMax: 0, totalGraftsRange: "0", avgGrafts: 0 };
    const totalGraftMin = selectedTypes.reduce((sum, type) => sum + type.graftMin, 0);
    const totalGraftMax = selectedTypes.reduce((sum, type) => sum + type.graftMax, 0);
    const avgGrafts = Math.round((totalGraftMin + totalGraftMax) / 2);
    return { totalGraftMin, totalGraftMax, totalGraftsRange: `${totalGraftMin.toLocaleString()} - ${totalGraftMax.toLocaleString()}`, avgGrafts };
  };
  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-20">

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white py-12 md:py-16 lg:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>

          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">

              <div className="flex-1 text-center lg:text-left space-y-6">
                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-2 rounded-full text-sm font-medium text-emerald-50">
                  <Shield className="w-4 h-4 text-emerald-200" />
                  Clinically Guided Hair Restoration Tool
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
                  Know Exactly How Many <span className="text-emerald-200">Hair Grafts</span> You Need & the Cost
                </h1>

                <p className="text-base sm:text-lg md:text-xl text-emerald-50/90 max-w-2xl leading-relaxed">
                  Use our professional hair graft calculator to estimate the number of grafts & the cost required for a natural-looking transplant - tailored to your hair loss pattern, density, and goals.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto sm:mx-0">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-emerald-200" />
                    <span className="text-sm text-emerald-50/90">15,000+ Patients Assisted</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-emerald-200" />
                    <span className="text-sm text-emerald-50/90">20+ Years Clinical Insight</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calculator className="w-5 h-5 text-emerald-200" />
                    <span className="text-sm text-emerald-50/90">Instant Graft Estimation</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 items-center sm:items-start">
                  <button
                    onClick={() => {
                      const calculatorSection = document.getElementById("calculator");
                      if (calculatorSection) calculatorSection.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    disabled={!loading && !isSubscribed}
                    className={`${user && isSubscribed ? "bg-white text-emerald-700 hover:bg-emerald-50 hover:shadow-xl" : "bg-white/80 text-emerald-700/70 cursor-not-allowed opacity-75"} px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg relative`}
                  >
                    Start Your Assessment
                    {!loading && !isSubscribed && (
                      <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                        SUBSCRIBE
                      </span>
                    )}
                  </button>

                  <button
                    onClick={handleConsultationClick}
                    className="text-white/90 underline underline-offset-4 hover:text-white text-sm font-medium"
                  >
                    Speak to a Specialist
                  </button>
                </div>

                <p className="text-xs text-emerald-100/70 max-w-md">
                  Full graft breakdown & pricing available with a one-time subscription.
                </p>
              </div>

              <div className="flex-1 w-full">
                <div className="hidden lg:grid grid-cols-2 gap-4">
                  {heroImages.map((img, index) => (
                    <div key={index} className="relative aspect-[4/5] rounded-xl bg-white shadow-xl overflow-hidden border-4 border-emerald-500">
                      <Image src={img.src} alt={img.alt} fill className="object-contain p-4" priority={index < 2} />
                    </div>
                  ))}
                </div>

                <div className="lg:hidden relative">
                  <div className="relative aspect-[4/5] rounded-xl bg-white shadow-xl overflow-hidden border-4 border-emerald-500">
                    <Image src={heroImages[currentSlide].src} alt={heroImages[currentSlide].alt} fill className="object-contain p-4 transition-opacity duration-500" priority />
                  </div>

                  <div className="flex justify-center gap-2 mt-4">
                    {heroImages.map((_, index) => (
                      <button key={index} onClick={() => setCurrentSlide(index)}
                        className={`h-2 rounded-full transition-all ${currentSlide === index ? "w-6 bg-white" : "w-2 bg-white/50"}`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-4 bg-white text-emerald-700 px-4 py-2 rounded-xl shadow-lg font-bold text-sm">
                  Real Patient Results
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-24 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 max-w-7xl">

            {/* Header */}
            <div className="text-center max-w-7xl mx-auto mb-16">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 bg-emerald-50 px-4 py-1 rounded-full mb-4">
                Our Services
              </span>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Comprehensive Hair Restoration Solutions
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed">
                ArtisticBuz offers a full range of medically guided hair restoration
                services – combining surgical precision, regenerative treatments,
                and aesthetic refinement to achieve natural, long-lasting results.
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "FUE Hair Transplant",
                  desc: "Follicular Unit Extraction (FUE) is a minimally invasive technique where individual hair follicles are harvested and implanted for natural density with minimal scarring and faster recovery.",
                  icon: Scissors,
                  grafts: "1,500+",
                },
                {
                  title: "FUT Hair Transplant",
                  desc: "Follicular Unit Transplantation (FUT) is ideal for advanced hair loss cases, allowing a higher graft yield through strip harvesting while maintaining excellent cosmetic outcomes.",
                  icon: Brush,
                  grafts: "2,000+",
                },
                {
                  title: "Beard Transplant",
                  desc: "Designed for men with patchy or thin facial hair, beard transplants restore fullness and symmetry using precise angle-controlled implantation.",
                  icon: UserCheck,
                  grafts: "800+",
                },
                {
                  title: "Eyebrow Transplant",
                  desc: "A highly artistic procedure that restores eyebrow shape and density, customized to facial structure, gender, and natural growth direction.",
                  icon: Sparkles,
                  grafts: "500+",
                },
                {
                  title: "PRP Treatment",
                  desc: "Platelet-Rich Plasma (PRP) therapy stimulates dormant follicles, improves graft survival, and strengthens existing hair using your body’s natural growth factors.",
                  icon: Syringe,
                  grafts: "350+",
                },
                {
                  title: "Scalp Micropigmentation (SMP)",
                  desc: "A non-surgical cosmetic solution that creates the appearance of fuller hair or a clean shaved look by depositing medical-grade pigment into the scalp.",
                  icon: Brush,
                  grafts: "400+",
                },
              ].map((service, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-tr from-emerald-100 via-teal-100 to-emerald-50
                     border-2 border-emerald-600 rounded-3xl p-8
                     hover:shadow-xl transition-shadow
                     flex flex-col"
                >
                  {/* Icon */}
                  <div className="w-12 h-12 bg-emerald-200 rounded-xl flex items-center justify-center mb-5">
                    <service.icon className="w-6 h-6 text-emerald-700" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {service.desc}
                  </p>

                  {/* Price Block – FIXED */}
                  <div className="mt-auto pt-4 border-t border-emerald-300/50">
                    <div className="text-emerald-700 font-semibold text-lg">
                      From {detectedAmount}
                    </div>

                    <div className="mt-1 text-sm text-gray-600">
                      Estimated {service.grafts} grafts
                    </div>
                  </div>
                </div>
              ))}
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
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold
                   px-8 py-4 rounded-xl shadow-lg transition-all"
              >
                Calculate Your Graft Requirement
              </button>
            </div>

          </div>
        </section>


        {/* Step 1 – Area-Based Estimation */}
        <section className="py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 max-w-7xl">

            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-50 px-4 py-1 rounded-full mb-4">
                Step 1: Area-Based Estimation
              </span>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Visualize Affected Areas for Greater Accuracy
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed">
                Interact with the 3D scalp model to select specific areas of hair loss.
                Your selections instantly refine the graft estimation for precision planning.
              </p>
            </div>

            {/* Workspace */}
            <div className="grid md:grid-cols-2 gap-10 items-stretch">

              {/* 3D Head Card */}
              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 border-2 border-emerald-200 rounded-3xl p-6 shadow-lg hover:shadow-2xl flex flex-col transition-all">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    3D Scalp Visualization
                  </h3>
                  <p className="text-sm text-gray-500">
                    Click on areas of thinning or baldness to interact
                  </p>
                </div>

                <div
                  className="
                    relative rounded-2xl bg-gray-50
                    aspect-[4/5] sm:aspect-[1/1] md:aspect-[5/6]
                    min-h-[420px] sm:min-h-[480px] lg:min-h-[520px]
                  "
                >
                  <HairSpline onAreaSelect={(area) => setSelectedArea(area)} />
                </div>

              </div>

              {/* Calculator Card */}
              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 border-2 border-emerald-200 rounded-3xl p-6 shadow-lg hover:shadow-2xl flex flex-col transition-all">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    Area-Based Graft Calculator
                  </h3>
                  <p className="text-sm text-gray-500">
                    Selected areas populate below automatically
                  </p>
                </div>

                <div className="flex-1">
                  <HairGraftCalculator externalArea={selectedArea ?? undefined} />
                </div>

                <div className="mt-4 text-xs text-gray-400">
                  Calculations are based on average follicular unit density
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Step 2 – Hair Loss Assessment */}
        <section id="calculator" className="py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4 max-w-7xl">

            {/* Section Header */}
            <div className="text-center max-w-7xl mx-auto mb-16">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-50 px-4 py-1 rounded-full mb-4">
                <Calculator className="w-4 h-4" />
                Step 2: Hair Loss Assessment
              </span>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Calculate Your Hair Restoration Needs
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed">
                Select affected areas to receive a clinically guided estimate of the number of grafts & the cost required for natural, balanced results.
              </p>
            </div>

            {/* Access States */}
            <div className="space-y-8 mb-12">

              {/* Not signed in */}
              {!loading && !user && (
                <div className="max-w-7xl mx-auto bg-blue-50 border border-blue-200 rounded-3xl p-8 text-center shadow hover:shadow-lg transition-all">
                  <Lock className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Sign In to Begin Your Assessment
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Create an account or sign in to access our professional hair graft calculator.
                  </p>
                  <Button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg"
                  >
                    Sign In / Create Account
                  </Button>
                </div>
              )}

              {/* Signed in but not subscribed */}
              {!loading && user && !isSubscribed && (
                <div className="max-w-7xl mx-auto bg-amber-50 border border-amber-200 rounded-3xl p-8 text-center shadow hover:shadow-lg transition-all">
                  <Lock className="w-10 h-10 text-amber-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Unlock Full Calculator Access
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Get 14-day full access to personalized graft estimates and cost breakdowns for just{" "}
                    <strong>{detectedAmount}</strong>.
                  </p>
                  <Button
                    onClick={() => setIsSubscriptionModalOpen(true)}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg"
                  >
                    Subscribe Now — {detectedAmount}
                  </Button>
                </div>
              )}
            </div>

            {/* Active Calculator */}
            {user && isSubscribed && (
              <div className="space-y-10">

                {/* Gender Preference */}
                <div className="flex flex-col items-center gap-4">
                  <p className="text-sm text-gray-500">Select reference pattern</p>

                  <div className="inline-flex bg-gray-100 rounded-2xl p-1 shadow-inner">
                    {[
                      { key: "neutral", label: "Neutral" },
                      { key: "male", label: "Male" },
                      { key: "female", label: "Female" },
                    ].map((option) => (
                      <button
                        key={option.key}
                        onClick={() => setGenderPreference(option.key as GenderPreference)}
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
                        {selectedTypes.length} area{selectedTypes.length !== 1 ? "s" : ""} selected
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
                  <div id="results" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <ResultPanel
                      selectedTypes={selectedTypes}
                      onConsultationClick={() => setIsConsultationModalOpen(true)}
                      totals={totals}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Clinical Excellence / Differentiation Section – White Background with Colorful Cards */}
        <section className="py-28 bg-white relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10 max-w-7xl">

            {/* Header */}
            <div className="max-w-7xl mb-16 text-center">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-50 px-4 py-1 rounded-full mb-4">
                Clinical Excellence
              </span>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4 text-gray-900">
                Why Patients Trust Our Hair Restoration Expertise
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Our approach combines medical precision, advanced technology, and personalized planning to deliver natural, long-lasting hair restoration outcomes.
              </p>
            </div>

            {/* Content Grid */}
            <div className="grid md:grid-cols-2 gap-10 items-start">

              {/* Left – Core Pillars */}
              <div className="space-y-6">
                {[
                  {
                    icon: Award,
                    title: "Expert-Led Procedures",
                    desc: "All assessments and procedures are guided by board-certified specialists with decades of combined experience.",
                    gradient: "from-emerald-100 via-teal-100 to-emerald-200",
                    iconColor: "text-emerald-600",
                  },
                  {
                    icon: Shield,
                    title: "Safe, Proven Techniques",
                    desc: "We use globally recognized, FDA-approved methods with strict safety protocols and sterile environments.",
                    gradient: "from-amber-100 via-yellow-100 to-amber-200",
                    iconColor: "text-amber-600",
                  },
                  {
                    icon: Users,
                    title: "Personalized Treatment Planning",
                    desc: "Each graft estimate and plan is customized to hair type, density, and long-term restoration goals.",
                    gradient: "from-purple-100 via-pink-100 to-purple-200",
                    iconColor: "text-purple-600",
                  },
                ].map((pillar, idx) => (
                  <div
                    key={idx}
                    className={`bg-gradient-to-br ${pillar.gradient} rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center">
                        <pillar.icon className={`w-6 h-6 ${pillar.iconColor}`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-900">{pillar.title}</h3>
                        <p className="text-gray-700 text-sm leading-relaxed">{pillar.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right – Differentiation Card */}
              <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all">
                <h3 className="text-2xl font-bold mb-4 text-white">What Makes Us Different</h3>
                <ul className="space-y-4 text-white/90 text-sm">
                  {[
                    "Clinically guided graft estimation — not guesswork",
                    "Area-by-area precision using 3D scalp visualization",
                    "Designed to support both straight hair and Afro-textured",
                    "Transparent methodology backed by clinical experience",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="mt-1 w-2 h-2 bg-white rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <button
                    onClick={() => {
                      const calculatorSection = document.getElementById("calculator");
                      if (calculatorSection) calculatorSection.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="bg-white text-emerald-700 font-semibold px-6 py-3 rounded-xl hover:bg-emerald-50 shadow-lg transition-all"
                  >
                    Start Your Assessment
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Partner Clinics Section */}
        <section className="py-28 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">

            {/* Header */}
            <div className="text-center max-w-7xl mx-auto mb-16">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-50 px-4 py-1 rounded-full mb-4">
                Our Trusted Partners
              </span>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Partner Hair Transplant Clinics
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed">
                ArtisticBuz collaborates with carefully selected, clinically vetted hair
                transplant clinics around the world to ensure safe, ethical, and
                high-quality patient outcomes.
              </p>
            </div>

            {/* Partner Grid */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {partners.map((partner, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 border-2 border-emerald-200 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all flex flex-col items-center text-center"
                >
                  {/* Logo */}
                  {partner.logo && (
                    <div className="mb-4 bg-white rounded-2xl shadow-sm flex items-center justify-center p-4 h-32">
                      <Image
                        src={urlFor(partner.logo).width(400).url()}
                        alt={partner.name}
                        width={120}
                        height={80}
                        className="object-contain"
                      />
                    </div>
                  )}

                  {/* Name */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {partner.name}
                  </h3>

                  {/* Location */}
                  <p className="text-sm text-gray-600 mb-4">
                    {partner.city}, {partner.country}
                  </p>

                  {/* Website */}
                  {partner.website && (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center justify-center px-5 py-2 text-sm font-semibold rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all"
                    >
                      Visit Clinic →
                    </a>
                  )}
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Blog Section – Latest Insights */}
        <section className="py-28 bg-gray-50">
          <div className="container mx-auto px-4 max-w-7xl">

            {/* Section Header */}
            <div className="mb-14 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Latest Insights</h2>
                <p className="text-gray-600 max-w-xl">Expert insights, guides, and updates to help you make informed decisions.</p>
              </div>
              <Link href="/blogs" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hidden md:inline-flex">
                View all →
              </Link>
            </div>

            {/* Blog Cards */}
            <div className="grid md:grid-cols-3 gap-8">
              {latestBlogs.map((blog: any) => (
                <article key={blog.slug.current} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col">
                  {blog.mainImage && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <img src={urlFor(blog.mainImage).width(600).height(400).url()} alt={blog.seoTitle || blog.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-snug group-hover:text-emerald-600 transition-colors">{blog.seoTitle || blog.title}</h3>
                    <p className="text-sm text-gray-600 mb-6 line-clamp-3">{blog.excerpt}</p>
                    <div className="mt-auto">
                      <Link href={`/blogs/${blog.slug.current}`} className="inline-flex items-center justify-center rounded-xl border border-emerald-600 px-5 py-2.5 text-sm font-semibold text-emerald-600 transition-all hover:bg-emerald-600 hover:text-white">
                        Read more <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Mobile CTA */}
            <div className="mt-12 text-center md:hidden">
              <Link href="/blogs" className="inline-flex text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                View all articles →
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection />

        {/* Final Step / Consultation CTA */}
        <section className="py-28 bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-700 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[length:36px_36px]" />
          <div className="container mx-auto px-4 relative z-10 max-w-7xl text-center">

            <span className="inline-block text-sm font-semibold text-white/90 bg-white/10 px-4 py-1 rounded-full mb-5">Final Step</span>

            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              Take the Next Step Toward Confident, Natural Hair Restoration
            </h2>

            <p className="text-emerald-50 text-lg max-w-7xl mx-auto mb-10">
              Your graft estimate is the foundation. A specialist consultation transforms it into a safe, personalized treatment plan designed for long-term results.
            </p>

            <div className="relative inline-flex flex-col items-center">
              <button
                onClick={() => {
                  const calculatorSection = document.getElementById("calculator");
                  if (calculatorSection) calculatorSection.scrollIntoView({ behavior: "smooth", block: "start" });
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

              <p className="mt-4 text-sm text-white/80 max-w-md">
                No obligation. Your consultation focuses on assessment, safety, and realistic expectations — not pressure.
              </p>
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
