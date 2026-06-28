/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Maximize2, Sparkles, X } from 'lucide-react';
import { GALLERY_IMAGES } from '../data';

export default function GalleryViewer() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIdx !== null) {
      setActiveIdx(activeIdx === 0 ? GALLERY_IMAGES.length - 1 : activeIdx - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIdx !== null) {
      setActiveIdx(activeIdx === GALLERY_IMAGES.length - 1 ? 0 : activeIdx + 1);
    }
  };

  return (
    <section className="py-20 bg-slate-50 overflow-hidden" id="gallery">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="px-4 md:px-16 max-w-7xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
      >
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-widest mb-2 font-mono">
            <Sparkles size={12} className="text-primary animate-pulse" />
            <span>Живые Эмоции</span>
          </div>
          <h2 className="font-headline text-3xl md:text-4xl font-black text-river-deep tracking-tight uppercase">
            Твой день на реке — в кадре
          </h2>
          <p className="text-base text-on-surface-variant mt-2 max-w-xl">
            Фотографии наших гостей и красивейших видов реки Агидель со сплавов и проката
          </p>
        </div>
      </motion.div>

      {/* Grid of All Photos as requested */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-16 max-w-7xl mx-auto">
        {GALLERY_IMAGES.map((img, idx) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: (idx % 4) * 0.1 }}
            whileHover={{ scale: 1.03, y: -4 }}
            className="relative group aspect-[4/3] bg-cover bg-center rounded-2xl custom-light-shadow hover:shadow-[0_10px_30px_rgba(0,123,255,0.15)] overflow-hidden cursor-pointer border border-slate-100"
            style={{ backgroundImage: `url(${img.url})` }}
            onClick={() => setActiveIdx(idx)}
          >
            {/* Smooth color overlay on hover */}
            <div className="absolute inset-0 bg-[#1A1A1B]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300 shadow-md">
                <Maximize2 size={18} />
              </div>
            </div>
            
            {/* Photo description footer overlay inside grid */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-100 group-hover:from-black/90 transition-all">
              <p className="text-xs text-white font-bold tracking-wide line-clamp-1">
                {img.alt}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Interactive Lightbox Overlay */}
      <AnimatePresence>
        {activeIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveIdx(null)}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-10"
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveIdx(null)}
              className="absolute top-6 right-6 text-white/75 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all cursor-pointer hover:rotate-90"
              title="Закрыть"
            >
              <X size={24} />
            </button>

            {/* Navigation: Left Arrow */}
            <button
              onClick={handlePrev}
              className="absolute left-4 md:left-8 text-white/75 hover:text-white bg-white/10 hover:bg-white/20 p-3.5 rounded-full transition-all cursor-pointer hover:scale-110 active:scale-95"
              title="Предыдущее"
            >
              <ChevronLeft size={28} />
            </button>

            {/* Main Interactive Zoom Box */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="max-w-4xl max-h-[85vh] flex flex-col items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={GALLERY_IMAGES[activeIdx].url}
                alt={GALLERY_IMAGES[activeIdx].alt}
                className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/10 select-none"
              />
              <div className="text-center space-y-1.5">
                <span className="text-[10px] font-bold tracking-widest uppercase bg-primary text-white px-2.5 py-1 rounded-md">
                  Фото {activeIdx + 1} из {GALLERY_IMAGES.length}
                </span>
                <p className="text-white text-center font-bold text-lg max-w-xl drop-shadow-md">
                  {GALLERY_IMAGES[activeIdx].alt}
                </p>
              </div>
            </motion.div>

            {/* Navigation: Right Arrow */}
            <button
              onClick={handleNext}
              className="absolute right-4 md:right-8 text-white/75 hover:text-white bg-white/10 hover:bg-white/20 p-3.5 rounded-full transition-all cursor-pointer hover:scale-110 active:scale-95"
              title="Следующее"
            >
              <ChevronRight size={28} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
