// lib/spline-area-map.ts

export type AreaKey =
    | "front"
    | "mid"
    | "crown"
    | "temples"
    | "donor";

export const SPLINE_AREA_MAP: Record<string, AreaKey> = {
    "Frontal Forelock": "front",

    "Mid-Scalp": "mid",

    "Vertex": "crown",
    "Vertex Transition": "crown",

    "Right Temporal Recession": "temples",
    "Left Temporal Recession": "temples",

    "Occipital Donor": "donor",
};


