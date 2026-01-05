'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { faqs } from '@/lib/calculator-data';
import { HelpCircle } from 'lucide-react';

export function FAQSection() {
  return (
    <section
      className="py-28 bg-white"
      id="faq"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-full mb-5 shadow-lg">
              <HelpCircle className="w-10 h-10 text-emerald-700" />
            </div>

            <span className="inline-block text-sm font-semibold text-emerald-700 bg-emerald-50 px-5 py-1.5 rounded-full mb-4">
              Clarifying Common Concerns
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>

            <p className="text-gray-600 text-lg max-w-7xl mx-auto leading-relaxed">
              Clear, transparent answers to help you understand graft estimation,
              hair transplantation, and what to expect from the process.
            </p>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="space-y-5">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 rounded-3xl border border-gray-200 shadow-md hover:shadow-xl transition-all"
              >
                <AccordionTrigger className="text-left px-6 py-5 hover:no-underline">
                  <span className="font-semibold text-gray-900 text-lg">
                    {faq.question}
                  </span>
                </AccordionTrigger>

                <AccordionContent className="px-6 pb-6 text-gray-700 leading-relaxed text-sm">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Soft reassurance footer */}
          <div className="mt-16 text-center">
            <p className="text-sm text-gray-500 max-w-7xl mx-auto">
              These answers are based on commonly accepted clinical practices. Individual treatment plans may vary.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}


