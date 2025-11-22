'use client';

import { BaldnessType } from '@/types/calculator';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

interface BaldnessTypeCardProps {
  type: BaldnessType;
  isSelected: boolean;
  onSelect: (type: BaldnessType) => void;
}

export function BaldnessTypeCard({ type, isSelected, onSelect }: BaldnessTypeCardProps) {
  return (
    <button
      onClick={() => onSelect(type)}
      className={cn(
        'relative p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 text-left w-full',
        isSelected
          ? 'border-emerald-500 bg-emerald-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-emerald-300'
      )}
    >
      {isSelected && (
        <div className="absolute top-3 right-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
        </div>
      )}

      <div className="text-6xl mb-4 text-center">{type.image}</div>

      <h3 className="font-semibold text-lg text-gray-900 mb-1">
        {type.title}
      </h3>

      <p className="text-sm text-emerald-600 font-medium mb-2">
        {type.type}
      </p>

      <p className="text-sm text-gray-600 mb-3">
        {type.description}
      </p>

      <div className="bg-gray-100 rounded-lg px-3 py-2 text-center">
        <p className="text-xs text-gray-500 mb-1">Estimated Grafts</p>
        <p className="font-bold text-emerald-600">{type.grafts}</p>
      </div>
    </button>
  );
}
