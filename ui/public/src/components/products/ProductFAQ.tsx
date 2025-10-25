"use client";
import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

export interface FAQItem {
  question: string;
  answers: string[];
}

const faqData: FAQItem[] = [
  {
    question: "Delivery Details",
    answers: [
      "We deliver all over Pakistan with safe and reliable shipping.",
      "ALHAMEEDCOMPUTERS – Within 24 Hours for Karachi (Order before 5 pm).",
      "Leopards Courier – 2 to 4 days for Cash on Delivery (COD) parcels.",
      "Non-COD parcels delivered over land take 4 to 5 days.",
      "Overnight delivery (Expedited) available within 48 hours.",
      "Delivery times may vary depending on location and circumstances.",
    ],
  },
  {
    question: "Warranty Policy",
    answers: [
      "All products come with a comprehensive 2-year manufacturer warranty.",
      "Warranty covers defects in materials and workmanship.",
      "Free repair or replacement is included within the warranty period.",
      "Extended warranty options are available for purchase.",
      "Keep your receipt as proof of purchase for warranty claims.",
    ],
  },
  {
    question: "Refund / Return / Exchange Policy",
    answers: [
      "Hassle-free 30-day return policy for eligible items.",
      "Items must be in original condition with tags attached.",
      "Returns are free for defective items; customer-initiated returns may incur a small processing fee.",
      "Exchanges are processed within 2-3 business days.",
      "Digital products and personalized items are non-returnable unless defective.",
    ],
  },
];

const ProductFAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number): void => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="w-full space-y-2">
      {faqData.map((faq: FAQItem, index: number) => (
        <div
          key={index}
          className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-white"
        >
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full px-6 py-4 text-left flex items-center justify-between bg-gray-800 hover:bg-gray-900 text-white font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 cursor-pointer"
          >
            <span className="text-base">
              {faq.question}
            </span>
            <div
              className={`flex-shrink-0 ml-2 transition-transform duration-300 ${
                activeIndex === index ? "rotate-180" : "rotate-0"
              }`}
            >
              {activeIndex === index ? (
                <Minus className="w-5 h-5" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
            </div>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              activeIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm sm:text-base">
                {faq.answers.map((ans, i) => (
                  <li key={i}>{ans}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductFAQ;
