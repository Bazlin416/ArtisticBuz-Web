import HomeClient from "./HomeClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Hair Graft Calculator – Estimate Hair Transplant Cost",
    description:
        "Use our professional hair graft calculator to estimate graft count and hair transplant cost based on hair loss patterns.",
    alternates: {
        canonical: "https://artisticbuz.com/",
    },
};

export default function Page() {
    return (
        <>
            <HomeClient />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        mainEntity: [
                            {
                                "@type": "Question",
                                name: "How many hair grafts do I need?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text: "The number of grafts depends on hair loss pattern, density, and coverage goals. Our calculator provides a clinically guided estimate.",
                                },
                            },
                        ],
                    }),
                }}
            />
        </>
    )

}
