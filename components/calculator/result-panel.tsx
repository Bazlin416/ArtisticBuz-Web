'use client';

import { BaldnessType } from '@/types/calculator';
import { Button } from '@/components/ui/button';
import { Calculator, DollarSign, Scissors } from 'lucide-react';

interface ResultPanelProps {
  selectedTypes: BaldnessType[];
  onConsultationClick: () => void;
  totals: {
    totalGraftMin: number;
    totalGraftMax: number;
    totalGraftsRange: string;
    avgGrafts: number;
    totalPriceRange: string;
  };
}

export function ResultPanel({
  selectedTypes,
  onConsultationClick,
  totals
}: ResultPanelProps) {
  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 shadow-lg border border-emerald-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Your Results</h3>
          <p className="text-sm text-gray-600">
            {selectedTypes.length} area{selectedTypes.length !== 1 ? 's' : ''} selected
          </p>
        </div>
      </div>

      {/* Selected Types List */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Selected Areas:</h4>
        <div className="flex flex-wrap gap-3 mb-4">
          {selectedTypes.map((type) => (
            <div
              key={type.id}
              className="bg-white px-4 py-2 rounded-lg border border-emerald-200 text-emerald-700 flex items-center gap-2 shadow-sm"
            >
              <span>{type.title}</span>
              <span className="text-xs bg-emerald-100 px-2 py-0.5 rounded">
                {type.grafts}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Scissors className="w-5 h-5 text-emerald-600" />
            <p className="text-sm font-medium text-gray-600">Total Estimated Grafts</p>
          </div>
          <p className="text-3xl font-bold text-emerald-600">{totals.totalGraftsRange}</p>
          <p className="text-xs text-gray-500 mt-1">Average: {totals.avgGrafts.toLocaleString()} grafts</p>
          <p className="text-xs text-gray-500 mt-1">({selectedTypes.length} area{selectedTypes.length !== 1 ? 's' : ''})</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <p className="text-sm font-medium text-gray-600">Estimated Cost</p>
          </div>
          {totals.totalPriceRange ? (
            <>
              <p className="text-2xl font-bold text-emerald-600 leading-tight">
                {totals.totalPriceRange}
              </p>
              <p className="text-xs text-gray-500 mt-1">Based on {totals.avgGrafts.toLocaleString()} grafts</p>
            </>
          ) : (
            <>
              <p className="text-3xl font-bold text-emerald-600">Custom</p>
              <p className="text-xs text-gray-500 mt-1">Pricing available on consultation</p>
            </>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="w-5 h-5 text-emerald-600" />
            <p className="text-sm font-medium text-gray-600">Coverage Areas</p>
          </div>
          <p className="text-3xl font-bold text-emerald-600">{selectedTypes.length}</p>
          <p className="text-xs text-gray-500 mt-1">
            {selectedTypes.length > 1 ? 'Multiple areas' : 'Single area'}
          </p>
          <p className="text-xs text-gray-500 mt-1">Natural density coverage</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 mb-6">
        <h4 className="font-semibold text-gray-900 mb-2">About Your Selection</h4>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          You've selected {selectedTypes.length} area{selectedTypes.length !== 1 ? 's' : ''} for hair restoration.
          This combined calculation provides an estimate based on typical cases for multiple areas.
          Your actual requirements may vary based on hair characteristics, desired density, and coverage area.
        </p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Individual graft estimates are combined for a total calculation</li>
          <li>• Pricing is based on the total number of grafts needed</li>
          <li>• Multiple areas may require staged procedures for optimal results</li>
          <li>• A consultation will provide a precise personalized assessment</li>
        </ul>
      </div>

      <Button
        onClick={onConsultationClick}
        size="lg"
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-6 text-lg shadow-md hover:shadow-lg transition-shadow"
      >
        Request a Free Consultation
      </Button>

      <p className="text-center text-xs text-gray-500 mt-4">
        Submit your details for a personalized assessment from our specialists. Response within 24 hours.
      </p>
    </div>
  );
}
