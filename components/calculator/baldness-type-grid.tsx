'use client';

import { BaldnessType } from '@/types/calculator';
import { BaldnessTypeCard } from './baldness-type-card';
import type { GenderPreference } from '@/lib/calculator-data';

interface BaldnessTypeGridProps {
  types: BaldnessType[];
  selectedType: BaldnessType | null;
  onSelectType: (type: BaldnessType) => void;
  genderPreference?: GenderPreference;
  disabled?: boolean;
}

export function BaldnessTypeGrid({
  types,
  selectedType,
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
          isSelected={selectedType?.id === type.id}
          onSelect={onSelectType}
          genderPreference={genderPreference}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
