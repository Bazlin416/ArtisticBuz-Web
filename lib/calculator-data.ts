import { BaldnessType } from "@/types/calculator";

export type GenderPreference = "neutral" | "male" | "female";

export const baldnessTypeImages = {
  neutral: {
    1: "/NeutralNorwoodTypes/Type1.png",
    2: "/NeutralNorwoodTypes/Type2.png",
    3: "/NeutralNorwoodTypes/Type3.png",
    4: "/NeutralNorwoodTypes/Type4.png",
    5: "/NeutralNorwoodTypes/Type5.png",
    6: "/NeutralNorwoodTypes/Type6.png",
    7: "/NeutralNorwoodTypes/Type7.png",
  },
  male: {
    1: "/MaleNorwoodTypes/Type1.png",
    2: "/MaleNorwoodTypes/Type2.png",
    3: "/MaleNorwoodTypes/Type3.png",
    4: "/MaleNorwoodTypes/Type4.png",
    5: "/MaleNorwoodTypes/Type5.png",
    6: "/MaleNorwoodTypes/Type6.png",
    7: "/MaleNorwoodTypes/Type7.png",
  },
  female: {
    1: "/FemaleNorwoodTypes/Type1.png",
    2: "/FemaleNorwoodTypes/Type2.png",
    3: "/FemaleNorwoodTypes/Type3.png",
    4: "/FemaleNorwoodTypes/Type4.png",
    5: "/FemaleNorwoodTypes/Type5.png",
    6: "/FemaleNorwoodTypes/Type6.png",
    7: "/FemaleNorwoodTypes/Type7.png",
  },
};

export const baldnessTypes: BaldnessType[] = [
  {
    id: 1,
    title: "Norwood Type 1",
    type: "Minimal Hair Loss",
    grafts: "0 – 500 grafts",
    graftMin: 0,
    graftMax: 500,
    description: "No significant hair loss. Minimal recession of the hairline.",
    image: "🧑",
  },
  {
    id: 2,
    title: "Norwood Type 2",
    type: "Early Recession",
    grafts: "500 – 1200 grafts",
    graftMin: 500,
    graftMax: 1200,
    description: "Slight recession at the temples forming an M-shape hairline.",
    image: "👤",
  },
  {
    id: 3,
    title: "Norwood Type 3",
    type: "Moderate Recession",
    grafts: "1800 – 2200 grafts",
    graftMin: 1800,
    graftMax: 2200,
    description: "Receding hairline with deeper temporal loss and thinning.",
    image: "🙂",
  },
  {
    id: 4,
    title: "Norwood Type 4",
    type: "Advanced Recession",
    grafts: "2500 – 3000 grafts",
    graftMin: 2500,
    graftMax: 3000,
    description:
      "Significant hair loss at the crown with pronounced frontal recession.",
    image: "😐",
  },
  {
    id: 5,
    title: "Norwood Type 5",
    type: "Extensive Loss",
    grafts: "3500 – 4000 grafts",
    graftMin: 3500,
    graftMax: 4000,
    description:
      "Large area of hair loss with a thin band of hair separating frontal and crown areas.",
    image: "🙁",
  },
  {
    id: 6,
    title: "Norwood Type 6",
    type: "Severe Loss",
    grafts: "4500 – 5000 grafts",
    graftMin: 4500,
    graftMax: 5000,
    description:
      "Extensive baldness with minimal hair remaining on the sides and back.",
    image: "😕",
  },
  {
    id: 7,
    title: "Norwood Type 7",
    type: "Complete Baldness",
    grafts: "5500 – 6500 grafts",
    graftMin: 5500,
    graftMax: 6500,
    description:
      "Most severe form with only a narrow horseshoe-shaped band of hair remaining.",
    image: "😔",
  },
];

export interface PricingTier {
  min: number;
  max: number;
  price: number;
}

export const pricingTiers: PricingTier[] = [
  { min: 500, max: 1000, price: 110000 },
  { min: 1500, max: 2500, price: 150000 },
  { min: 3500, max: 4500, price: 180000 },
];

export function calculatePrice(graftMin: number, graftMax: number) {
  if (graftMin === 0 && graftMax === 0) {
    return null;
  }
  
  const avgGrafts = Math.round((graftMin + graftMax) / 2);
  const pricePerGraft = 250; // Example: 250 KSH per graft
  const basePrice = avgGrafts * pricePerGraft;
  
  return {
    min: Math.round(basePrice * 0.9), // 10% lower
    max: Math.round(basePrice * 1.1), // 10% higher
    avg: basePrice
  };
}

export const faqs = [
  {
    question: "What is a hair graft?",
    answer:
      "A hair graft is a naturally occurring grouping of hair follicles. Each graft typically contains 1-4 hairs. During hair transplantation, these grafts are carefully extracted and transplanted to areas experiencing hair loss.",
  },
  {
    question: "How many grafts do I need?",
    answer:
      "The number of grafts needed depends on your level of hair loss, the area to be covered, and your desired density. Our calculator provides an estimate based on the Norwood scale, but a personalized consultation with our specialists will give you the most accurate assessment.",
  },
  {
    question: "Can grafts grow naturally after transplantation?",
    answer:
      "Yes! Transplanted hair grafts are taken from the permanent zone at the back of your head, which is genetically resistant to balding. Once transplanted, these grafts will continue to grow naturally for a lifetime, requiring no special maintenance.",
  },
  {
    question: "How long does a hair transplant procedure take?",
    answer:
      "The duration varies based on the number of grafts needed. Typically, procedures range from 4-8 hours. Larger sessions requiring 4000+ grafts may be split into multiple days for optimal results and patient comfort.",
  },
  {
    question: "Is the procedure painful?",
    answer:
      "The procedure is performed under local anesthesia, so you will not feel pain during the transplant. Some patients report mild discomfort during the anesthesia administration, and minor soreness may occur for a few days post-procedure.",
  },
  {
    question: "What is the recovery time?",
    answer:
      "Most patients can return to work within 3-5 days. The transplanted area will heal completely within 10-14 days. You can resume normal activities gradually, with full physical activities typically allowed after 2-3 weeks.",
  },
];
