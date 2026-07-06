import React from 'react';
import { motion } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import { FaHeart, FaChevronDown, FaPlayCircle } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

export default function Hero({ name, onPlayVideo }) {
  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden font-outfit w-full px-4 sm:px-6 md:px-8"
      style={{ background: 'linear-gradient(135deg, #FDF0F3 0%, #FBF7F1 45%, #F5E6C8 100%)' }}
    >
      {/* ── Atmospheric background blobs (hidden on mobile for performance) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="hidden md:block absolute -top-16 -left-16 w-[500px] h-[500px] lg:w-[700px] lg:h-[700px] rounded-full opacity-40"
          style={{ background: 'radial-gradient(circle, #F4B8C6 0%, transparent 70%)' }} />
        <div className="hidden md:block absolute -bottom-20 -right-16 w-[600px] h-[600px] lg:w-[800px] lg:h-[800px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, #F5E6C8 0%, transparent 70%)' }} />
        <div className="hidden md:block absolute top-1/3 right-4 w-72 h-72 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #C2788A 0%, transparent 70%)' }} />
        {/* Dot grid — desktop only */}
        <div className="hidden md:block absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, #9C4A5C 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }} />
      </div>

      {/* ── Main card (Grand Full-Width Responsive Design) ── */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 rounded-3xl sm:rounded-[2.5rem] md:rounded-[3rem] p-6 sm:p-10 md:p-16 lg:p-20 text-center w-full max-w-[92vw] lg:max-w-6xl mx-auto shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.45) 100%)',
          border: '1px solid rgba(255,255,255,0.70)',
          boxShadow: '0 24px 60px rgba(156,74,92,0.08), 0 4px 12px rgba(156,74,92,0.05), inset 0 0 30px rgba(255,255,255,0.25)',
        }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="badge mx-auto mb-5 sm:mb-8 w-fit text-[10px] sm:text-xs"
        >
          <HiSparkles className="text-rose-gold animate-twinkle" />
          Celebrating a Special Day
          <HiSparkles className="text-rose-gold animate-twinkle" style={{ animationDelay: '1s' }} />
        </motion.div>

        {/* Cursive sub-header */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.9 }}
          className="font-script text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-deep-rose mb-2 opacity-80"
        >
          Wishing all the best to...
        </motion.p>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="font-playfair font-extrabold text-charcoal tracking-tight leading-none mb-6 sm:mb-8"
          style={{ fontSize: 'clamp(2.2rem, 8.5vw, 7rem)' }}
        >
          Happy Birthday,
          <br />
          <span className="text-gradient-rose block mt-2 pb-3">
            <Typewriter
              words={['Gorgeous', 'Priyanka', 'Piku', `${name}`]}
              loop={0}
              cursor
              cursorStyle="✦"
              typeSpeed={75}
              deleteSpeed={45}
              delaySpeed={2200}
            />
          </span>
        </motion.h1>

        {/* Body copy */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 1 }}
          className="max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl mx-auto mb-8 sm:mb-12 text-sm sm:text-base md:text-lg lg:text-xl font-light leading-relaxed text-muted"
        >
          Today we celebrate your 23rd year on this earth — and 5 wonderful years of an
          irreplaceable friendship. Your laughter, grace, and warmth make every moment brighter.
          Here's to you, Piku! 🌸
        </motion.p>

        {/* CTA Buttons — always horizontal, scaling dynamically with screen size */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-row flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 w-full"
        >
          <a
            href="#surprise"
            className="group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-full font-semibold text-white text-[10px] sm:text-xs md:text-sm transition-all duration-300 shadow-gold hover:shadow-gold-hover hover:-translate-y-1 whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg, #C2788A 0%, #9C4A5C 60%, #6B2D3E 100%)' }}
          >
            <FaHeart className="text-white/80 group-hover:scale-125 transition-transform duration-300 flex-shrink-0 text-[10px] sm:text-xs" />
            Open Your Gift
          </a>
          <button
            onClick={onPlayVideo}
            className="group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-full font-semibold text-[10px] sm:text-xs md:text-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-card border whitespace-nowrap"
            style={{
              color: '#9C4A5C',
              borderColor: 'rgba(194,120,138,0.3)',
              background: 'rgba(255,255,255,0.65)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <FaPlayCircle className="text-rose-gold group-hover:scale-110 transition-transform duration-300 flex-shrink-0 text-[10px] sm:text-xs" />
            Watch Birthday Video
          </button>
          <a
            href="#gallery"
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-full font-semibold text-rose-gold text-[10px] sm:text-xs md:text-sm border border-rose-gold/25 bg-white/60 hover:bg-white hover:border-rose-gold/50 hover:shadow-card hover:-translate-y-1 transition-all duration-300 whitespace-nowrap"
          >
            View Our Memories
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.7, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none"
      >
        <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-rose-gold/70 font-semibold">Scroll</span>
        <FaChevronDown className="text-rose-gold/60 text-xs" />
      </motion.div>
    </section>
  );
}