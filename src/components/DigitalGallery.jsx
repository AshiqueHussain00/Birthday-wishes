import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaExpand } from 'react-icons/fa';

const memoryData = [
  { id: 1,  img: "/images/photo1.jpg",  caption: "Special Day ✨",       desc: "A beautiful beginning to a wonderful memory." },
  { id: 2,  img: "/images/photo2.jpg",  caption: "Warm Smiles 🌸",       desc: "Your happiness spreads light to everyone around you." },
  { id: 3,  img: "/images/photo3.jpg",  caption: "Sweet Moments 💖",     desc: "A cozy time filled with warmth and peaceful thoughts." },
  { id: 4,  img: "/images/photo4.jpg",  caption: "To Many More! 🥂",     desc: "Cheers to a fabulous year ahead." },
  { id: 5,  img: "/images/photo5.jpg",  caption: "Perfect Joy ⭐",        desc: "Capturing the essence of pure delight." },
  { id: 6,  img: "/images/photo6.jpg",  caption: "Golden Hour 🌟",       desc: "Shining bright under the perfect warm light." },
  { id: 7,  img: "/images/photo7.jpg",  caption: "Happy Heart 💕",       desc: "Always finding reasons to smile and celebrate." },
  { id: 8,  img: "/images/photo8.jpg",  caption: "Gentle Breeze 🍃",     desc: "Soft, tranquil moments that make life beautiful." },
  { id: 9,  img: "/images/photo9.jpg",  caption: "Magic in the Air 🪄",  desc: "When every single detail feels just right." },
  { id: 10, img: "/images/photo10.jpg", caption: "True Radiance ☀️",     desc: "Your positive spirit is truly inspiring." },
  { id: 11, img: "/images/photo11.jpg", caption: "Lovely Memories 🥰",   desc: "Looking back at the path of happy days." },
  { id: 12, img: "/images/photo12.jpg", caption: "Laughter & Fun 🎉",    desc: "Savoring the best times with loved ones." },
  { id: 13, img: "/images/photo13.jpg", caption: "Dream Big 🌠",         desc: "Wishing you strength to reach every milestone." },
  { id: 14, img: "/images/photo14.jpg", caption: "Brighter Days 🌈",     desc: "A colorful, cheerful tomorrow awaits." },
  { id: 15, img: "/images/photo15.jpg", caption: "Forever Cherished 💝", desc: "Keeping these precious moments close to the heart." },
];

/* ─── Image Fallback ─── */
function ImgFallback({ src, alt, className, style }) {
  const [error, setError] = useState(false);
  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-[#121216] text-6xl`} style={style}>
        🌸
      </div>
    );
  }
  return (
    <img
      src={src} alt={alt} loading="eager"
      className={className} style={style}
      onError={() => setError(true)}
    />
  );
}

export default function DigitalGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightbox, setLightbox]       = useState(null);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % memoryData.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + memoryData.length) % memoryData.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeMemory = memoryData[activeIndex];

  // Responsive offsets based on current slide width + gap
  const getOffsetStyle = () => {
    return {
      transform: `translateX(calc(-${activeIndex} * (var(--slide-width) + var(--slide-gap))))`
    };
  };

  return (
    <>
      <section
        id="gallery"
        className="relative min-h-screen flex flex-col justify-between overflow-hidden font-outfit py-16 md:py-24"
        style={{
          background: '#0a0a0c',
          // CSS custom variables for layout spacing (Saisei layout settings)
          '--slide-width-mobile': '68vw',
          '--slide-gap-mobile': '16px',
          '--slide-width-tablet': '48vw',
          '--slide-gap-tablet': '20px',
          '--slide-width-desktop': '24vw',
          '--slide-gap-desktop': '28px',
        }}
      >
        {/* ── BACKGROUND SYNCHRONIZATION (Saisei split view style) ── */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.18 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.85, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <ImgFallback
                src={activeMemory.img}
                alt=""
                className="w-full h-full object-cover scale-102"
              />
            </motion.div>
          </AnimatePresence>
          {/* Faded overlay matching Webflow CSS */}
          <div
            className="absolute inset-0 z-1 bg-black/75"
            style={{
              background: 'linear-gradient(to bottom, rgba(10,10,12,0.95) 0%, rgba(10,10,12,0.7) 50%, rgba(10,10,12,0.95) 100%)'
            }}
          />
        </div>

        {/* ── MAIN LAYOUT WRAPPER ── */}
        <div className="relative z-10 w-full max-w-[92vw] lg:max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 flex flex-col justify-between flex-1 gap-12">

          {/* 1. TOP HEADER: "Selected Project" Layout */}
          <div className="flex items-end justify-between border-b border-white/10 pb-6 w-full">
            <div className="flex flex-col gap-1 items-start text-left">
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-semibold">
                Selected Memory
              </span>
              <AnimatePresence mode="wait">
                <motion.h2
                  key={activeIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="font-playfair font-normal text-white text-xl sm:text-2xl md:text-3xl tracking-wide uppercase leading-tight"
                >
                  {activeMemory.caption}
                </motion.h2>
              </AnimatePresence>
            </div>

            {/* Pagination Counter */}
            <div className="font-mono text-white text-xs sm:text-sm tracking-[0.2em] flex items-center gap-1 font-bold select-none pb-1">
              <span>{String(activeIndex + 1).padStart(2, '0')}</span>
              <span className="text-white/20">/</span>
              <span className="text-white/40">{String(memoryData.length).padStart(2, '0')}</span>
            </div>
          </div>

          {/* 2. MIDDLE SLIDER GRID: Multiple cards side-by-side */}
          <div className="relative w-full overflow-hidden my-auto py-2">
            <motion.div
              className="flex select-none"
              style={{
                width: `${memoryData.length * 100}%`,
                // Set CSS variables based on responsive breakpoints
                '--slide-width': 'var(--slide-width-mobile)',
                '--slide-gap': 'var(--slide-gap-mobile)',
                ...getOffsetStyle()
              }}
              className="flex gap-[var(--slide-gap-mobile)] sm:gap-[var(--slide-gap-tablet)] lg:gap-[var(--slide-gap-desktop)] transition-transform duration-500 ease-out"
              // Media queries simulated through tailwind class variables
            >
              {/* Media queries variables setting */}
              <style dangerouslySetInnerHTML={{__html: `
                @media (min-width: 640px) {
                  #gallery .flex {
                    --slide-width: var(--slide-width-tablet);
                    --slide-gap: var(--slide-gap-tablet);
                  }
                }
                @media (min-width: 1024px) {
                  #gallery .flex {
                    --slide-width: var(--slide-width-desktop);
                    --slide-gap: var(--slide-gap-desktop);
                  }
                }
              `}} />

              {memoryData.map((memory, index) => {
                const isActive = index === activeIndex;
                return (
                  <div
                    key={memory.id}
                    className="shrink-0 transition-all duration-500 flex flex-col gap-4 text-left"
                    style={{
                      width: 'var(--slide-width)',
                      opacity: isActive ? 1 : 0.35,
                    }}
                  >
                    {/* Portrait Image (Aspect 3/4 like Saisei projects) */}
                    <div
                      className="relative aspect-[3/4] w-full rounded overflow-hidden cursor-pointer group"
                      style={{
                        boxShadow: isActive 
                          ? '0 20px 45px -10px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1)' 
                          : '0 8px 24px -5px rgba(0,0,0,0.4)',
                        transition: 'box-shadow 0.4s ease'
                      }}
                      onClick={() => {
                        if (isActive) {
                          setLightbox(memory);
                        } else {
                          setActiveIndex(index);
                        }
                      }}
                    >
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/15 group-hover:bg-transparent transition-colors duration-400 z-10" />

                      {isActive && (
                        <div className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center bg-black/45 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <FaExpand className="text-white/80 text-[10px]" />
                        </div>
                      )}

                      <ImgFallback
                        src={memory.img}
                        alt={memory.caption}
                        className="w-full h-full object-cover transform scale-101 group-hover:scale-104 transition-transform duration-700 ease-out"
                      />
                    </div>

                    {/* Meta info stacked underneath (exact Saisei text layout) */}
                    <div className="flex flex-col items-start gap-0.5">
                      <h3 className="font-playfair text-white text-sm sm:text-base font-bold leading-tight uppercase tracking-wider">
                        {memory.caption}
                      </h3>
                      <p className="text-white/40 text-[10px] sm:text-xs font-light uppercase tracking-widest leading-none mt-0.5">
                        Memory #{memory.id}
                      </p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* 3. BOTTOM CONTROLS: Saisei Text Buttons & Bullet Track */}
          <div className="flex items-center justify-between border-t border-white/10 pt-6 w-full select-none">
            {/* Left: lowercase text buttons */}
            <div className="flex items-center gap-6">
              <button
                onClick={handlePrev}
                className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-white/50 hover:text-white transition-colors duration-200 relative group pb-1"
              >
                prev
                <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-rose-gold group-hover:w-full transition-all duration-300" />
              </button>
              <button
                onClick={handleNext}
                className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-white/50 hover:text-white transition-colors duration-200 relative group pb-1"
              >
                next
                <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-rose-gold group-hover:w-full transition-all duration-300" />
              </button>
            </div>

            {/* Right: Bullet page indicators */}
            <div className="hidden md:flex items-center gap-2">
              {memoryData.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    background: i === activeIndex ? '#C9A96E' : 'rgba(255,255,255,0.18)',
                    transform: i === activeIndex ? 'scale(1.2)' : 'none',
                  }}
                />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── LIGHTBOX WINDOW ── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/96 backdrop-blur-xl"
            onClick={() => setLightbox(null)}
          >
            {/* Close */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center border border-white/10 hover:border-white/20 transition-all z-[100]"
            >
              <FaTimes className="text-lg" />
            </button>

            {/* Nav */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const idx = memoryData.findIndex(m => m.id === lightbox.id);
                setLightbox(memoryData[(idx - 1 + memoryData.length) % memoryData.length]);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 text-white flex items-center justify-center transition-all z-[100]"
            >
              ‹
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                const idx = memoryData.findIndex(m => m.id === lightbox.id);
                setLightbox(memoryData[(idx + 1) % memoryData.length]);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 text-white flex items-center justify-center transition-all z-[100]"
            >
              ›
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-4xl w-full h-[75vh] md:h-[80vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <ImgFallback
                src={lightbox.img}
                alt={lightbox.caption}
                className="max-w-full max-h-full object-contain rounded-xl select-none"
              />
              <div className="absolute bottom-4 left-4 right-4 p-5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-left">
                <span className="font-mono text-rose-gold text-xs font-bold uppercase tracking-wider block mb-1">
                  Memory Card {lightbox.id} / {memoryData.length}
                </span>
                <h4 className="font-playfair font-extrabold text-white text-lg sm:text-xl">
                  {lightbox.caption}
                </h4>
                <p className="text-white/60 text-xs sm:text-sm font-light mt-1.5 leading-relaxed">
                  {lightbox.desc}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}