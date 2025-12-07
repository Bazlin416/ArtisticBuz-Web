'use client';

import { BaldnessType } from '@/types/calculator';
import { cn } from '@/lib/utils';
import { CheckCircle2, Lock } from 'lucide-react';
import { baldnessTypeImages, type GenderPreference } from '@/lib/calculator-data';

interface BaldnessTypeCardProps {
  type: BaldnessType;
  isSelected: boolean;
  onSelect: (type: BaldnessType) => void;
  genderPreference?: GenderPreference;
  disabled?: boolean;
}

export function BaldnessTypeCard({
  type,
  isSelected,
  onSelect,
  genderPreference = 'neutral',
  disabled = false,
}: BaldnessTypeCardProps) {
  const displayImage =
    baldnessTypeImages[genderPreference][
      type.id as keyof typeof baldnessTypeImages.neutral
    ] || type.image;

  return (
    <button
      onClick={() => !disabled && onSelect(type)}
      disabled={disabled}
      className={cn(
        'relative p-6 rounded-xl border-2 transition-all duration-300 text-left w-full',
        disabled
          ? 'opacity-60 cursor-not-allowed'
          : 'hover:shadow-lg hover:scale-105',
        isSelected
          ? 'border-emerald-500 bg-emerald-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-emerald-300'
      )}
    >
      {/* Lock icon */}
      {disabled && (
        <div className="absolute top-3 right-3">
          <Lock className="w-6 h-6 text-gray-400" />
        </div>
      )}

      {/* Selected checkmark */}
      {isSelected && !disabled && (
        <div className="absolute top-3 right-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
        </div>
      )}

      {/* IMAGE DISPLAY */}
      <div className="mb-4 flex justify-center">
        <img
          src={displayImage}
          alt={type.title}
          className="h-20 w-auto object-contain"
        />
      </div>

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
