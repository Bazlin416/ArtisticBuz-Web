'use client';

import { BaldnessType } from '@/types/calculator';
import { BaldnessTypeCard } from './baldness-type-card';
import type { GenderPreference } from '@/lib/calculator-data';

interface BaldnessTypeGridProps {
  types: BaldnessType[];
  selectedTypes: BaldnessType[];
  onSelectType: (type: BaldnessType) => void;
  genderPreference?: GenderPreference;
  disabled?: boolean;
}

export function BaldnessTypeGrid({
  types,
  selectedTypes,
  onSelectType,
  genderPreference = 'neutral',
  disabled = false,
}: BaldnessTypeGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {types.map((type) => (
        <BaldnessTypeCard
          key={type.id}
          type={type}
          isSelected={selectedTypes.some(t => t.id === type.id)}
          onSelect={onSelectType}
          genderPreference={genderPreference}
          disabled={disabled}
        />
      ))}
    </div>
  );
}