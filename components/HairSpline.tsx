"use client";

import { useState, useRef, useEffect } from "react";
import Spline from "@splinetool/react-spline";
import { AreaKey, SPLINE_AREA_MAP } from "@/lib/spline-area-map";

interface SplineMouseEvent {
  target?: {
    name?: string;
  };
}

export default function HairSpline({
  onAreaSelect,
}: {
  onAreaSelect: (area: AreaKey) => void;
}) {
  const [hasError, setHasError] = useState(false);
  const loadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadTimerRef.current = setTimeout(() => setHasError(true), 15000);
    return () => {
      if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
    };
  }, []);

  const handleLoad = () => {
    if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
  };

  const handleRetry = () => {
    setHasError(false);
    loadTimerRef.current = setTimeout(() => setHasError(true), 15000);
  };

  if (hasError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-2xl">
        <div className="text-center p-6">
          <p className="text-gray-500 text-sm mb-3">
            3D model failed to load. Please check your connection.
          </p>
          <button
            onClick={handleRetry}
            className="text-emerald-600 underline text-sm hover:text-emerald-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div className="
        w-full h-full
        sm:w-full sm:h-full
        min-h-[480px] sm:min-h-[500px] lg:min-h-[540px]
        scale-100 sm:scale-105 lg:scale-110
        -translate-y-1 sm:-translate-y-0 lg:translate-y-0
      ">
        <Spline
          scene="https://prod.spline.design/SAklkfzSePErzGQk/scene.splinecode"
          style={{ width: "100%", height: "100%" }}
          onLoad={handleLoad}
          onMouseDown={(e: SplineMouseEvent) => {
            const rawName = e.target?.name;
            const mappedArea = rawName
              ? SPLINE_AREA_MAP[rawName]
              : undefined;

            if (mappedArea) {
              onAreaSelect(mappedArea);
            }
          }}
        />
      </div>
    </div>
  );
}
