"use client";
import { useState } from "react";

export default function HairGraftCalculator() {
  // BALDNESS AREAS TOGGLE LOGIC
  const [selectedAreas, setSelectedAreas] = useState<number[]>([]);

  // Define scalp areas with their positions and base graft values
  const scalpAreas = [
    { id: 1, label: "Front", baseGrafts: 900, color: "bg-red-400" },
    { id: 2, label: "Mid Scalp", baseGrafts: 700, color: "bg-blue-400" },
    { id: 3, label: "Crown", baseGrafts: 1100, color: "bg-green-400" },
    { id: 4, label: "Temples", baseGrafts: 400, color: "bg-purple-400" },
    { id: 5, label: "Hairline", baseGrafts: 600, color: "bg-yellow-400" },
  ];

  // SLIDER STATE
  const [density, setDensity] = useState(50);

  // AGE DROPDOWN
  const [age, setAge] = useState(18);

  // CALCULATE BASE GRAFT FROM SELECTED AREAS
  const baseGrafts = selectedAreas.reduce(
    (sum, id) => sum + (scalpAreas.find(area => area.id === id)?.baseGrafts || 0),
    0
  );

  // APPLY DENSITY FACTOR
  const densityFactor = density / 100 + 0.4; 
  const graftResult = Math.round(baseGrafts * densityFactor);

  // HAIR = approx 2.4x grafts
  const hairResult = Math.round(graftResult * 2.4);

  // AGE MODIFIER (slight effect)
  const ageModifier = age > 40 ? 0.9 : 1;
  const finalGrafts = Math.round(graftResult * ageModifier);
  const finalHair = Math.round(hairResult * ageModifier);

  // AREA CLICK HANDLER
  const toggleArea = (id: number) => {
    setSelectedAreas((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-5">
      {/* TITLE */}
      <h1 className="text-3xl font-bold text-center mb-3">Hair Graft Calculator</h1>
      <p className="text-center text-gray-600 mb-4">
        Select the balding or receding parts on your scalp.
      </p>

      {/* MULTIPLE HEAD PERSPECTIVES */}
      <div className="flex flex-wrap justify-center gap-8 my-6">
        {/* Front View */}
        <div className="relative w-48 h-48 bg-gray-100 rounded-full border-2 border-gray-300">
          {/* Crown Area */}
          <div 
            className={`absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full cursor-pointer border-2 ${selectedAreas.includes(3) ? 'bg-green-400 border-green-600' : 'bg-green-200 border-green-300 opacity-50'}`}
            onClick={() => toggleArea(3)}
            title="Crown"
          ></div>
          
          {/* Mid Scalp Area */}
          <div 
            className={`absolute top-16 left-1/2 transform -translate-x-1/2 w-24 h-16 rounded-lg cursor-pointer border-2 ${selectedAreas.includes(2) ? 'bg-blue-400 border-blue-600' : 'bg-blue-200 border-blue-300 opacity-50'}`}
            onClick={() => toggleArea(2)}
            title="Mid Scalp"
          ></div>
          
          {/* Front Area */}
          <div 
            className={`absolute top-28 left-1/2 transform -translate-x-1/2 w-32 h-16 rounded-t-lg cursor-pointer border-2 ${selectedAreas.includes(1) ? 'bg-red-400 border-red-600' : 'bg-red-200 border-red-300 opacity-50'}`}
            onClick={() => toggleArea(1)}
            title="Front"
          ></div>
          
          {/* Hairline Area */}
          <div 
            className={`absolute top-40 left-1/2 transform -translate-x-1/2 w-36 h-4 rounded-t-full cursor-pointer border-2 ${selectedAreas.includes(5) ? 'bg-yellow-400 border-yellow-600' : 'bg-yellow-200 border-yellow-300 opacity-50'}`}
            onClick={() => toggleArea(5)}
            title="Hairline"
          ></div>
        </div>

        {/* Side View */}
        <div className="relative w-48 h-48 bg-gray-100 rounded-full border-2 border-gray-300">
          {/* Crown Area (Side) */}
          <div 
            className={`absolute top-8 right-8 w-12 h-12 rounded-full cursor-pointer border-2 ${selectedAreas.includes(3) ? 'bg-green-400 border-green-600' : 'bg-green-200 border-green-300 opacity-50'}`}
            onClick={() => toggleArea(3)}
            title="Crown"
          ></div>
          
          {/* Mid Scalp Area (Side) */}
          <div 
            className={`absolute top-20 right-12 w-16 h-12 rounded-lg cursor-pointer border-2 ${selectedAreas.includes(2) ? 'bg-blue-400 border-blue-600' : 'bg-blue-200 border-blue-300 opacity-50'}`}
            onClick={() => toggleArea(2)}
            title="Mid Scalp"
          ></div>
          
          {/* Front Area (Side) */}
          <div 
            className={`absolute top-32 right-16 w-20 h-12 rounded-t-lg cursor-pointer border-2 ${selectedAreas.includes(1) ? 'bg-red-400 border-red-600' : 'bg-red-200 border-red-300 opacity-50'}`}
            onClick={() => toggleArea(1)}
            title="Front"
          ></div>
          
          {/* Temple Area */}
          <div 
            className={`absolute top-36 right-4 w-8 h-16 rounded-lg cursor-pointer border-2 ${selectedAreas.includes(4) ? 'bg-purple-400 border-purple-600' : 'bg-purple-200 border-purple-300 opacity-50'}`}
            onClick={() => toggleArea(4)}
            title="Temples"
          ></div>
        </div>

        {/* Top View */}
        <div className="relative w-48 h-48 bg-gray-100 rounded-full border-2 border-gray-300">
          {/* Crown Area (Top) */}
          <div 
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full cursor-pointer border-2 ${selectedAreas.includes(3) ? 'bg-green-400 border-green-600' : 'bg-green-200 border-green-300 opacity-50'}`}
            onClick={() => toggleArea(3)}
            title="Crown"
          ></div>
          
          {/* Mid Scalp Area (Top) */}
          <div 
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full cursor-pointer border-2 ${selectedAreas.includes(2) ? 'bg-blue-400 border-blue-600' : 'bg-blue-200 border-blue-300 opacity-50'}`}
            onClick={() => toggleArea(2)}
            title="Mid Scalp"
          ></div>
          
          {/* Front Area (Top) */}
          <div 
            className={`absolute top-8 left-1/2 transform -translate-x-1/2 w-36 h-20 rounded-t-full cursor-pointer border-2 ${selectedAreas.includes(1) ? 'bg-red-400 border-red-600' : 'bg-red-200 border-red-300 opacity-50'}`}
            onClick={() => toggleArea(1)}
            title="Front"
          ></div>
          
          {/* Temple Areas (Top) */}
          <div 
            className={`absolute top-20 left-8 w-12 h-16 rounded-lg cursor-pointer border-2 ${selectedAreas.includes(4) ? 'bg-purple-400 border-purple-600' : 'bg-purple-200 border-purple-300 opacity-50'}`}
            onClick={() => toggleArea(4)}
            title="Temples"
          ></div>
          <div 
            className={`absolute top-20 right-8 w-12 h-16 rounded-lg cursor-pointer border-2 ${selectedAreas.includes(4) ? 'bg-purple-400 border-purple-600' : 'bg-purple-200 border-purple-300 opacity-50'}`}
            onClick={() => toggleArea(4)}
            title="Temples"
          ></div>
        </div>
      </div>

      {/* SELECTABLE AREAS BUTTONS */}
      <div className="flex flex-wrap justify-center gap-3 my-6">
        {scalpAreas.map((area) => (
          <button
            key={area.id}
            onClick={() => toggleArea(area.id)}
            className={`px-4 py-2 rounded-lg border transition ${
              selectedAreas.includes(area.id)
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white border-gray-300"
            }`}
          >
            {area.label}
          </button>
        ))}
      </div>

      {/* SLIDER */}
      <div className="mt-10">
        <p className="text-center text-gray-600">
          Use the bar below and decide the expected density
        </p>

        <div className="flex justify-between text-sm text-gray-500 mt-3">
          <span>Totally Bald</span>
          <span>Appearance Of Fullness</span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={density}
          onChange={(e) => setDensity(Number(e.target.value))}
          className="w-full mt-3"
        />
      </div>

      {/* AGE SELECTOR */}
      <div className="mt-6">
        <p className="font-semibold mb-1">Choose Your Age:</p>
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
      <div className="flex justify-between mt-10 gap-4">
        {/* GRAFT BOX */}
        <div className="flex-1 p-2 bg-gray-100 rounded-xl text-center shadow">
          <p className="text-xl font-bold">GRAFT</p>
          <p className="text-3xl font-semibold mt-2">{finalGrafts}</p>
        </div>

        {/* HAIR BOX */}
        <div className="flex-1 p-2 bg-blue-600 text-white rounded-xl text-center shadow">
          <p className="text-xl font-bold">HAIR</p>
          <p className="text-3xl font-semibold mt-2">{finalHair}</p>
        </div>
      </div>

      {/* SELECTED AREAS SUMMARY */}
      {selectedAreas.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="font-semibold mb-2">Selected Areas:</p>
          <div className="flex flex-wrap gap-2">
            {selectedAreas.map(id => {
              const area = scalpAreas.find(a => a.id === id);
              return area ? (
                <span key={id} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {area.label} ({area.baseGrafts} grafts)
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}