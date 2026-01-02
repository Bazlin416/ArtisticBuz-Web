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
      className="py-24 bg-gradient-to-b from-gray-50 to-white"
      id="faq"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-5">
              <HelpCircle className="w-8 h-8 text-emerald-600" />
            </div>

            <span className="inline-block text-sm font-semibold text-emerald-700 bg-emerald-50 px-4 py-1 rounded-full mb-4">
              Clarifying Common Concerns
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>

            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
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
                className="bg-white rounded-2xl border border-gray-200 shadow-sm transition-all hover:shadow-md"
              >
                <AccordionTrigger className="text-left hover:no-underline px-6 py-6">
                  <span className="font-semibold text-gray-900 pr-4 leading-snug">
                    {faq.question}
                  </span>
                </AccordionTrigger>

                <AccordionContent className="px-6 pb-6 text-gray-600 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Soft reassurance footer */}
          <div className="mt-14 text-center">
            <p className="text-sm text-gray-500">
              These answers are based on commonly accepted clinical practices.
              Individual treatment plans may vary.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

