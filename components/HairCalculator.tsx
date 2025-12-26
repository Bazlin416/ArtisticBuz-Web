"use client";
import { useEffect, useState } from "react";
import type { AreaKey } from "@/lib/spline-area-map";

/* ================= COMPONENT ================= */
export default function HairGraftCalculator({
  externalArea,
}: {
  externalArea?: AreaKey;
}) {
  /* ================= STATE ================= */
  const [selectedAreas, setSelectedAreas] = useState<AreaKey[]>([]);
  const [density, setDensity] = useState(50);
  const [age, setAge] = useState(18);

  /* ================= DATA ================= */
  const scalpAreas: {
    key: AreaKey;
    label: string;
    baseGrafts: number;
  }[] = [
      { key: "front", label: "Frontal / Forelock", baseGrafts: 900 },
      { key: "temples", label: "Temples", baseGrafts: 400 },
      { key: "mid", label: "Mid Scalp", baseGrafts: 700 },
      { key: "crown", label: "Crown / Vertex", baseGrafts: 1100 },
      { key: "donor", label: "Occipital Donor", baseGrafts: 0 }, // optional
    ];

  /* ================= EFFECT (Spline → Calculator) ================= */
  useEffect(() => {
    if (!externalArea) return;

    setSelectedAreas((prev) =>
      prev.includes(externalArea) ? prev : [...prev, externalArea]
    );
  }, [externalArea]);

  /* ================= TOGGLE ================= */
  const toggleArea = (key: AreaKey) => {
    setSelectedAreas((prev) =>
      prev.includes(key) ? prev.filter((a) => a !== key) : [...prev, key]
    );
  };

  /* ================= CALCULATIONS ================= */
  const baseGrafts = selectedAreas.reduce((sum, key) => {
    const area = scalpAreas.find((a) => a.key === key);
    return sum + (area?.baseGrafts || 0);
  }, 0);

  const densityFactor = density / 100 + 0.4;
  const graftResult = Math.round(baseGrafts * densityFactor);
  const hairResult = Math.round(graftResult * 2.4);

  const ageModifier = age > 40 ? 0.9 : 1;
  const finalGrafts = Math.round(graftResult * ageModifier);
  const finalHair = Math.round(hairResult * ageModifier);

  /* ================= UI ================= */
  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-5">
      <h1 className="text-3xl font-bold text-center mb-3">
        Hair Graft Calculator
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Select the balding or receding parts on your scalp.
      </p>

      {/* AREA BUTTONS */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {scalpAreas.map((area) => (
          <button
            key={area.key}
            onClick={() => toggleArea(area.key)}
            className={`px-4 py-2 rounded-lg border transition ${selectedAreas.includes(area.key)
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white border-gray-300"
              }`}
          >
            {area.label}
          </button>
        ))}
      </div>

      {/* DENSITY */}
      <div className="mb-8">
        <p className="text-center text-gray-600 mb-2">
          Expected hair density
        </p>
        <input
          type="range"
          min={0}
          max={100}
          value={density}
          onChange={(e) => setDensity(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* AGE */}
      <div className="mb-10">
        <p className="font-semibold mb-1">Choose Your Age</p>
        <select
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          className="border px-3 py-2 rounded-lg w-full max-w-xs"
        >
          {Array.from({ length: 60 }).map((_, i) => (
            <option key={i} value={i + 18}>
              {i + 18}
            </option>
          ))}
        </select>
      </div>

      {/* RESULTS */}
      <div className="flex gap-4">
        <div className="flex-1 p-6 bg-gray-100 rounded-xl text-center">
          <p className="text-xl font-bold">GRAFTS</p>
          <p className="text-3xl mt-2">{finalGrafts}</p>
        </div>

        <div className="flex-1 p-6 bg-blue-600 text-white rounded-xl text-center">
          <p className="text-xl font-bold">HAIRS</p>
          <p className="text-3xl mt-2">{finalHair}</p>
        </div>
      </div>
    </div>
  );
}

