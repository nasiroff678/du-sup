/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, Plus, MessageSquareQuote, Star } from 'lucide-react';
import { FAQS, REVIEWS } from '../data';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 bg-slate-50" id="faq">
      <div className="px-4 md:px-16 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Left Side: Accordion */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-bold text-primary uppercase tracking-widest font-mono">Помощь гостям</span>
            <h2 className="font-headline text-3xl md:text-4xl font-black text-river-deep tracking-tight uppercase mt-1">Частые вопросы</h2>
            <p className="text-[#4B5563] text-base mt-2">
              Всё, что вам нужно знать перед тем, как совершить свое первое плавание с нами
            </p>
          </motion.div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="bg-white rounded-2xl custom-light-shadow border border-slate-100 overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFAQ(idx)}
                    className="w-full text-left p-6 flex justify-between items-center gap-4 hover:bg-slate-50/50 transition-colors cursor-pointer"
                  >
                    <span className="font-headline font-bold text-sm md:text-base text-[#1A1A1B] leading-snug">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="text-primary flex-shrink-0 bg-slate-100 p-1.5 rounded-full"
                    >
                      <Plus size={18} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="p-6 pt-0 border-t border-slate-50 text-sm text-[#4B5563] leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Reviews / Feedback */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="text-xs font-bold text-primary uppercase tracking-widest font-mono">Отзывы</span>
            <h2 className="font-headline text-3xl md:text-4xl font-black text-river-deep tracking-tight uppercase mt-1">Отзывы участников</h2>
            <p className="text-[#4B5563] text-base mt-2">
              Реальные истории и впечатления жителей Дюртюлей и гостей со всей республики
            </p>
          </motion.div>

          <div className="space-y-6">
            {REVIEWS.map((review, idx) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-6 rounded-2xl custom-light-shadow border border-slate-100 relative"
              >
                <MessageSquareQuote size={48} className="absolute top-4 right-6 text-primary/5 pointer-events-none" />
                
                {/* Accent Yellow stars for high quality reviews */}
                <div className="flex gap-0.5 text-[#FACC15] mb-3">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>

                <p className="text-sm text-[#4B5563] italic leading-relaxed mb-4">
                  "{review.text}"
                </p>

                <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                  <span className="font-bold text-xs text-[#1A1A1B]">
                    {review.name}, {review.city}
                  </span>
                  <span className="text-[10px] text-[#4B5563]/60 font-medium font-mono">
                    {review.date}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
