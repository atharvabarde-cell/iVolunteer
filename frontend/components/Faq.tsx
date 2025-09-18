import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is iVolunteer?",
    answer:
      "iVolunteer is a platform that connects you with NGOs, donation drives, and volunteering opportunities to make a meaningful impact in your community.",
  },
  {
    question: "How do I earn coins?",
    answer:
      "You can earn coins by registering, donating, joining activities, or participating in volunteering events.",
  },
  {
    question: "Can I redeem my coins?",
    answer:
      "Yes! Coins can be redeemed for exclusive rewards, recognition, and participation perks in future activities.",
  },
  {
    question: "Is iVolunteer free to use?",
    answer:
      "Absolutely. iVolunteer is completely free to use for volunteers. NGOs and organizations can also list opportunities at no cost.",
  },
];

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-6 md:px-12 ">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Frequently Asked Questions ❓
        </h2>
        <p className="text-gray-600 mt-3">
          Got questions? We’ve got answers. Here’s everything you need to know
          about getting started with iVolunteer.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="flex justify-between items-center w-full p-5 text-left"
            >
              <span className="font-semibold text-gray-900">
                {faq.question}
              </span>
              <motion.span
                animate={{ rotate: activeIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-5 h-5 text-gray-500" />
              </motion.span>
            </button>

            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-5 pb-5 text-gray-600"
                >
                  {faq.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Faq;
