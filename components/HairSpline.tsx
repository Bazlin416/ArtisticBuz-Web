"use client";

import Spline from "@splinetool/react-spline";
import { AreaKey, SPLINE_AREA_MAP } from "@/lib/spline-area-map";

export default function HairSpline({
    onAreaSelect,
}: {
    onAreaSelect: (area: AreaKey) => void;
}) {
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
                    onMouseDown={(e) => {
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









