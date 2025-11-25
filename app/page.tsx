"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BaldnessTypeGrid } from "@/components/calculator/baldness-type-grid";
import { ResultPanel } from "@/components/calculator/result-panel";
import { ConsultationFormModal } from "@/components/calculator/consultation-form-modal";
import { FAQSection } from "@/components/faq/faq-section";
import { baldnessTypes } from "@/lib/calculator-data";
import { BaldnessType } from "@/types/calculator";
import { Calculator, Shield, Award, Users, CheckCircle } from "lucide-react";
import HairGraftCalculator from "@/components/HairCalculator";

export default function Home() {
  const [selectedType, setSelectedType] = useState<BaldnessType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectType = (type: BaldnessType) => {
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
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-7xl mx-auto">
              {/* Left Content - Main Text */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Hair Graft Calculator
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl text-emerald-50 mb-8 leading-relaxed max-w-2xl">
                  Estimate how many hair grafts you need for a natural scaling
                  hair transplant. Our easy-to-use hair transplant graft
                  calculator helps you plan your hair restoration journey with
                  confidence.
                </p>

                {/* CTA Button */}
                <button className="bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl mb-12 lg:mb-0">
                  Get a Consultation
                </button>
              </div>

              {/* Right Content - Patient Image */}
              <div className="flex-1 flex justify-center lg:justify-end">
                <div className="relative max-w-md lg:max-w-lg">
                  {/* Main Image Container */}
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                    <img
                      src="/Patient-Images-ArtisticClinic-Nairobi-11-25-2025_12_36_AM.png"
                      alt="Patient before and after hair transplant results from Artistic Clinic Nairobi"
                      className="w-full h-auto object-cover"
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/30 to-transparent"></div>
                  </div>

                  {/* Floating Badge */}
                  <div className="absolute -bottom-4 -right-4 bg-white text-emerald-700 px-6 py-3 rounded-xl shadow-2xl font-bold text-sm">
                    Natural Results
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-emerald-300 rounded-full opacity-60"></div>
                  <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-teal-400 rounded-full opacity-40"></div>
                </div>
              </div>

              {/* <div className="flex-1 flex justify-center lg:justify-end">
                <div className="relative max-w-md lg:max-w-lg">
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl">
                    <div className="rounded-xl overflow-hidden shadow-lg">
                      <img
                        src="/Patient-Images-ArtisticClinic-Nairobi-11-25-2025_12_36_AM.png"
                        alt="Patient hair transplant results - Artistic Clinic Nairobi"
                        className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="mt-4 text-center">
                      <p className="text-emerald-200 text-sm font-medium">
                        Real Patient Results
                      </p>
                      <p className="text-emerald-300 text-xs">
                        Artistic Clinic Nairobi
                      </p>
                    </div>
                  </div>

                  <div className="absolute -top-3 -right-3 bg-emerald-400 text-emerald-900 px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                    Success Story
                  </div>
                </div>
              </div> */}
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

        <HairGraftCalculator />
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
                onClick={() => setIsModalOpen(true)}
                className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold px-8 py-4 rounded-lg text-lg transition-colors shadow-lg"
              >
                Schedule Free Consultation
              </button>
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
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Select your hair loss pattern below to get an instant estimate
                  of the number of grafts you may need for optimal results.
                </p>
              </div>

              <BaldnessTypeGrid
                types={baldnessTypes}
                selectedType={selectedType}
                onSelectType={handleSelectType}
              />

              {selectedType && (
                <div
                  id="results"
                  className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500"
                >
                  <ResultPanel
                    selectedType={selectedType}
                    onConsultationClick={() => setIsModalOpen(true)}
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {selectedType && (
        <ConsultationFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedType={selectedType.title}
          estimatedGrafts={selectedType.grafts}
        />
      )}
    </div>
  );
}
