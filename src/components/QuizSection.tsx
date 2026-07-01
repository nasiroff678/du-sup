/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, RefreshCw, Check, Award, Flame, Navigation, HelpCircle } from 'lucide-react';
import { QUIZ_QUESTIONS, TOURS } from '../data';
import { Tour } from '../types';

interface QuizSectionProps {
  onApplyPromo: (code: string, discount: number) => void;
  onSelectTour: (tourId: string) => void;
}

export default function QuizSection({ onApplyPromo, onSelectTour }: QuizSectionProps) {
  const [currentStep, setCurrentStep] = useState<number>(-1); // -1: Intro, 0+: Questions, -2: Result
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [copied, setCopied] = useState(false);
  const [recommendedTour, setRecommendedTour] = useState<Tour | null>(null);

  const handleStart = () => {
    setAnswers({});
    setCurrentStep(0);
  };

  const handleAnswer = (questionId: number, value: string) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate recommendation
      calculateRecommendation(updated);
    }
  };

  const calculateRecommendation = (finalAnswers: Record<number, string>) => {
    // Basic recommendation logic:
    // If beginner or relaxation is preferred -> Route "Gusinka" (calmer forest)
    // If pro, friend group, or sport -> Route "Golden Sands" (under the bridge, active)
    const experience = finalAnswers[1];
    const motivation = finalAnswers[3];

    if (experience === 'beginner' || motivation === 'relax') {
      setRecommendedTour(TOURS.find(t => t.id === 'gusinka') || TOURS[0]);
    } else {
      setRecommendedTour(TOURS.find(t => t.id === 'golden_sands') || TOURS[1]);
    }
    setCurrentStep(-2); // Result screen
  };

  const copyPromo = () => {
    navigator.clipboard.writeText('DUSUP20');
    setCopied(true);
    onApplyPromo('DUSUP20', 20);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="quiz" className="py-16 md:py-24 bg-[#F5F7F5] text-river-deep overflow-hidden relative">
      <div className="absolute right-0 top-0 opacity-10 pointer-events-none text-primary">
        <HelpCircle size={400} />
      </div>

      <div className="px-4 md:px-16 max-w-4xl mx-auto relative z-10 text-center">
        <AnimatePresence mode="wait">
          {currentStep === -1 && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 bg-[#007BFF]/10 text-[#007BFF] px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase">
                <Sparkles size={14} className="text-primary animate-pulse" />
                <span>Интерактивный помощник</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold font-headline tracking-tight text-[#1A1A1B] leading-tight">
                Не знаете, какой маршрут выбрать?
              </h2>
              <p className="text-base md:text-lg text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
                Пройдите короткий тест за 1 минуту, и мы подберем идеальный сплав под ваш уровень подготовки, а также подарим скидку 20% на ваше первое приключение!
              </p>
              <div className="pt-4">
                <button
                  id="quiz-start-btn"
                  onClick={handleStart}
                  className="bg-[#007BFF] hover:bg-[#0056b3] text-white px-8 py-4 rounded-2xl font-headline font-bold text-lg hover:scale-105 transition-all custom-light-shadow inline-flex items-center gap-3 cursor-pointer group"
                >
                  Пройти тест
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <p className="text-xs text-[#4B5563]/60">* Скидка применится автоматически при бронировании</p>
            </motion.div>
          )}

          {currentStep >= 0 && currentStep < QUIZ_QUESTIONS.length && (
            <motion.div
              key={`question-${currentStep}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* Progress bar */}
              <div className="max-w-md mx-auto space-y-2">
                <div className="flex justify-between text-xs font-semibold text-[#4B5563]">
                  <span>Вопрос {currentStep + 1} из {QUIZ_QUESTIONS.length}</span>
                  <span className="text-[#007BFF]">{Math.round(((currentStep + 1) / QUIZ_QUESTIONS.length) * 100)}% заполнено</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <motion.div
                    className="bg-[#007BFF] h-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              <h3 className="text-2xl md:text-3xl font-extrabold font-headline tracking-tight leading-snug text-[#1A1A1B]">
                {QUIZ_QUESTIONS[currentStep].text}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto pt-4">
                {QUIZ_QUESTIONS[currentStep].options.map((option, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(QUIZ_QUESTIONS[currentStep].id, option.value)}
                    className="bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-[#007BFF]/50 text-[#1A1A1B] rounded-2xl p-6 text-center transition-all custom-light-shadow flex flex-col items-center justify-center gap-4 cursor-pointer min-h-[160px] group"
                  >
                    <div className="w-12 h-12 rounded-full bg-secondary-light text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <span className="material-symbols-outlined text-2xl">{option.icon}</span>
                    </div>
                    <span className="font-bold text-sm md:text-base leading-tight">
                      {option.text}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep === -2 && recommendedTour && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="w-16 h-16 bg-sky-50 text-primary rounded-full flex items-center justify-center mx-auto border border-primary/20">
                <Award size={36} />
              </div>

              <div className="space-y-3">
                <p className="text-xs uppercase tracking-widest text-[#007BFF] font-bold">Мы подобрали идеальный сплав!</p>
                <h3 className="text-3xl md:text-4xl font-extrabold font-headline text-[#1A1A1B]">{recommendedTour.title}</h3>
                <p className="text-[#4B5563] max-w-xl mx-auto text-sm md:text-base leading-relaxed">
                  Отличный выбор! С вашими ответами этот маршрут принесет максимум удовольствия и ярких эмоций на реке Агидель.
                </p>
              </div>

              {/* Recommended tour card */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 max-w-xl mx-auto flex flex-col md:flex-row items-center gap-6 text-left custom-light-shadow">
                <img
                  src={recommendedTour.imageUrl}
                  alt={recommendedTour.title}
                  className="w-full md:w-40 h-28 object-cover rounded-xl"
                />
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 text-xs text-[#007BFF] font-bold">
                    <Navigation size={12} />
                    <span>{recommendedTour.distance} • {recommendedTour.duration}</span>
                  </div>
                  <p className="text-xs md:text-sm text-[#4B5563] line-clamp-2">
                    {recommendedTour.description}
                  </p>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <span className="text-lg font-extrabold text-[#1A1A1B]">{recommendedTour.price} ₽</span>
                    <button
                      onClick={() => {
                        onSelectTour(recommendedTour.id);
                        onApplyPromo('DUSUP20', 20);
                      }}
                      className="bg-[#007BFF] text-white hover:bg-[#0056b3] px-5 py-2 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      Выбрать этот
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Coupon card - using Accent Yellow (#FACC15) */}
              <div className="max-w-md mx-auto bg-gradient-to-r from-[#FACC15]/10 to-[#FACC15]/20 border border-[#FACC15]/40 p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 justify-center">
                  <Flame className="text-[#e2b712] animate-pulse" size={20} />
                  <span className="font-bold text-sm tracking-wide uppercase text-[#b38f00]">Ваш купон на скидку 20%</span>
                </div>
                <div className="flex items-center justify-between bg-white border border-slate-100 px-6 py-3 rounded-xl custom-light-shadow">
                  <span className="font-mono text-xl md:text-2xl font-black tracking-widest text-[#1A1A1B]">DUSUP20</span>
                  <button
                    onClick={copyPromo}
                    className="bg-[#007BFF] hover:bg-[#0056b3] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copied ? <Check size={14} /> : <Sparkles size={14} />}
                    {copied ? 'Скопировано!' : 'Скопировать'}
                  </button>
                </div>
                <p className="text-xs text-[#4B5563]">
                  Промокод применится автоматически при бронировании любого сплава или проката.
                </p>
              </div>

              <div className="flex justify-center gap-4 pt-2">
                <button
                  onClick={handleStart}
                  className="text-[#4B5563] hover:text-[#1A1A1B] text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <RefreshCw size={14} />
                  Пройти тест заново
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
