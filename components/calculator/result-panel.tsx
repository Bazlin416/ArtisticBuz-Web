'use client';

import { BaldnessType } from '@/types/calculator';
import { calculatePrice } from '@/lib/calculator-data';
import { Button } from '@/components/ui/button';
import { Calculator, DollarSign, Scissors } from 'lucide-react';

interface ResultPanelProps {
  selectedType: BaldnessType;
  onConsultationClick: () => void;
}

export function ResultPanel({ selectedType, onConsultationClick }: ResultPanelProps) {
  const avgGrafts = Math.round((selectedType.graftMin + selectedType.graftMax) / 2);
  const priceInfo = calculatePrice(selectedType.graftMin, selectedType.graftMax);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 shadow-lg border border-emerald-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Your Results</h3>
          <p className="text-sm text-gray-600">Based on {selectedType.title}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Scissors className="w-5 h-5 text-emerald-600" />
            <p className="text-sm font-medium text-gray-600">Estimated Grafts</p>
          </div>
          <p className="text-3xl font-bold text-emerald-600">{selectedType.grafts}</p>
          <p className="text-xs text-gray-500 mt-1">Average: {avgGrafts.toLocaleString()} grafts</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <p className="text-sm font-medium text-gray-600">Estimated Cost (KSH)</p>
          </div>
          {priceInfo ? (
            <>
              <p className="text-3xl font-bold text-emerald-600">
                KSH {formatPrice(priceInfo.min)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Fixed pricing</p>
            </>
          ) : (
            <>
              <p className="text-3xl font-bold text-emerald-600">Custom</p>
              <p className="text-xs text-gray-500 mt-1">Pricing available</p>
            </>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="w-5 h-5 text-emerald-600" />
            <p className="text-sm font-medium text-gray-600">Hair Density</p>
          </div>
          <p className="text-3xl font-bold text-emerald-600">Natural</p>
          <p className="text-xs text-gray-500 mt-1">Optimal coverage</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 mb-6">
        <h4 className="font-semibold text-gray-900 mb-2">About Your Selection</h4>
        <p className="text-gray-600 text-sm leading-relaxed">
          {selectedType.description} This calculation is an estimate based on typical cases.
          Your actual requirements may vary based on hair characteristics, desired density,
          and coverage area.
        </p>
      </div>

      <Button
        onClick={onConsultationClick}
        size="lg"
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-6 text-lg shadow-md"
      >
        Get Free Consultation
      </Button>

      <p className="text-center text-xs text-gray-500 mt-4">
        Submit your details and photos for a personalized assessment from our specialists
      </p>
    </div>
  );
}
