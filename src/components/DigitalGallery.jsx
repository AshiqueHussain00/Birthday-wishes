import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

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
      <div className={`${className} flex items-center justify-center bg-[#0d0d11] text-6xl`} style={style}>
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

  return (
    <>
      <section
        id="gallery"
        className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden w-full select-none"
        style={{
          background: '#08080a',
          // Layout variables to calculate centring calculations
          '--card-width-mobile': '280px',
          '--card-gap-mobile': '20px',
          '--card-width-desktop': '450px',
          '--card-gap-desktop': '40px',
        }}
      >
        {/* ── BACKGROUND PARALLAX SYNC ── */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.28 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.0, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full filter blur-[15px] scale-105"
            >
              <ImgFallback
                src={activeMemory.img}
                alt=""
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
          {/* Overlay mask for high contrast & dark cinematic mood */}
          <div
            className="absolute inset-0 z-1"
            style={{
              background: 'linear-gradient(to bottom, rgba(8,8,10,0.85) 0%, rgba(8,8,10,0.4) 50%, rgba(8,8,10,0.9) 100%)'
            }}
          />
        </div>

        {/* ── INTERACTIVE PHOTO SLIDES ── */}
        <div className="relative z-10 w-full h-full flex items-center justify-center overflow-hidden">
          <motion.div
            className="flex items-center"
            style={{
              // Center math: translate = 50vw - (half card width) - (index * (card width + gap))
              '--card-width': 'var(--card-width-mobile)',
              '--card-gap': 'var(--card-gap-mobile)',
              transform: `translateX(calc(50vw - (var(--card-width) / 2) - (${activeIndex} * (var(--card-width) + var(--card-gap)))))`
            }}
            className="flex items-center transition-transform duration-500 ease-out"
          >
            <style dangerouslySetInnerHTML={{__html: `
              #gallery .flex {
                --card-width: var(--card-width-mobile);
                --card-gap: var(--card-gap-mobile);
              }
              @media (min-width: 768px) {
                #gallery .flex {
                  --card-width: var(--card-width-desktop);
                  --card-gap: var(--card-gap-desktop);
                }
              }
            `}} />

            {memoryData.map((memory, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={memory.id}
                  className="shrink-0 transition-all duration-500 relative cursor-pointer"
                  style={{
                    width: 'var(--card-width)',
                    marginRight: 'var(--card-gap)',
                    opacity: isActive ? 1 : 0.22,
                    transform: isActive ? 'scale(1)' : 'scale(0.92)',
                  }}
                  onClick={() => {
                    if (isActive) {
                      setLightbox(memory);
                    } else {
                      setActiveIndex(index);
                    }
                  }}
                >
                  <div
                    className="relative aspect-[3/4] w-full rounded-sm overflow-hidden"
                    style={{
                      boxShadow: isActive 
                        ? '0 30px 60px -15px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.08)' 
                        : '0 10px 30px -10px rgba(0,0,0,0.6)'
                    }}
                  >
                    <ImgFallback
                      src={memory.img}
                      alt={memory.caption}
                      className="w-full h-full object-cover select-none"
                    />
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* ── UI OVERLAY ELEMENTS (Exact Screenshot Placements) ── */}

        {/* TOP RIGHT: Page Counter (Playfair serif styling) */}
        <div className="absolute top-8 right-8 md:top-12 md:right-16 z-20 select-none">
          <p className="font-playfair font-normal text-white/80 text-xl sm:text-2xl tracking-[0.1em]">
            {activeIndex + 1} <span className="text-white/30 mx-1">/</span> {memoryData.length}
          </p>
        </div>

        {/* BOTTOM LEFT: Caption text block */}
        <div className="absolute bottom-8 left-8 md:bottom-12 md:left-16 z-20 text-left max-w-sm sm:max-w-md select-none pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <h3 
                className="font-playfair font-normal text-white uppercase tracking-[0.08em] leading-none mb-3"
                style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
              >
                {activeMemory.caption}
              </h3>
              <p className="text-white/60 text-xs sm:text-sm font-light tracking-[0.15em] uppercase font-outfit">
                {activeMemory.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* BOTTOM RIGHT: Vertical Ticks Page Indicator */}
        <div className="absolute bottom-8 right-8 md:bottom-12 md:right-16 z-20 flex items-end gap-1.5 h-10 select-none">
          {memoryData.map((_, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className="transition-all duration-300 outline-none flex items-end"
                style={{ height: '100%' }}
              >
                <div
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: isActive ? '2px' : '1px',
                    height: isActive ? '32px' : '14px',
                    background: isActive ? '#ffffff' : 'rgba(255,255,255,0.22)',
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* LEFT/RIGHT Subtle click navigators */}
        <div 
          onClick={handlePrev} 
          className="absolute left-0 top-0 bottom-0 w-[15vw] z-20 cursor-w-resize"
          title="Previous"
        />
        <div 
          onClick={handleNext} 
          className="absolute right-0 top-0 bottom-0 w-[15vw] z-20 cursor-e-resize"
          title="Next"
        />

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