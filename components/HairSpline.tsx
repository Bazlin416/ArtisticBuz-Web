"use client";

import Spline from "@splinetool/react-spline";
import { AreaKey, SPLINE_AREA_MAP } from "@/lib/spline-area-map";

export default function HairSpline({
    onAreaSelect,
}: {
    onAreaSelect: (area: AreaKey) => void;
}) {
    return (
        <div className="w-full h-[320px] sm:h-[420px] md:h-[520px] lg:h-[620px] xl:h-[700px] relative">
            <Spline
                scene="https://prod.spline.design/eoK1MSq9P65G2jgV/scene.splinecode"
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
    );
}






