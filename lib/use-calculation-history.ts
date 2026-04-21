"use client";

import { useState, useEffect, useCallback } from "react";
import { BaldnessType } from "@/types/calculator";
import type { GenderPreference } from "@/lib/calculator-data";

export interface CalculationRecord {
  id: string;
  savedAt: string;
  selectedTypes: BaldnessType[];
  hairType: "straight" | "wavy" | "curly" | "afro";
  desiredDensity: "sparse" | "natural" | "dense";
  genderPreference: GenderPreference;
  totalGraftsRange: string;
  totalPriceRange: string;
}

const STORAGE_KEY = "ab_calc_history";
const MAX_RECORDS = 5;

export function useCalculationHistory() {
  const [history, setHistory] = useState<CalculationRecord[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch {}
  }, []);

  const save = useCallback((record: Omit<CalculationRecord, "id" | "savedAt">) => {
    setHistory((prev) => {
      const entry: CalculationRecord = {
        ...record,
        id: Date.now().toString(),
        savedAt: new Date().toISOString(),
      };
      const updated = [entry, ...prev].slice(0, MAX_RECORDS);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const clear = useCallback(() => {
    setHistory([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }, []);

  return { history, save, clear };
}
