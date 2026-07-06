import React from 'react';
import { motion } from 'framer-motion';

export default function WelcomeScreen({ onStart }) {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#FBF7F1' }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.8, ease: "easeInOut" } }}
    >
      {/* Premium Background Blobs */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-[#C2788A]/20 rounded-full blur-[80px] mix-blend-multiply" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-[#C9A96E]/20 rounded-full blur-[100px] mix-blend-multiply" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="relative z-10 text-center px-4 w-full max-w-2xl"
      >
        {/* Slogan */}
        <h1 className="font-playfair text-5xl sm:text-6xl md:text-7xl font-extrabold text-[#2C282B] tracking-wide mb-6 leading-tight">
          Ashique <br className="sm:hidden" />
          <span className="font-script text-[#C2788A] font-normal px-2 text-6xl sm:text-7xl md:text-8xl lowercase">with</span> <br className="sm:hidden" />
          Priyanka
        </h1>
        
        <p className="font-outfit text-xs sm:text-sm md:text-base text-[#7A6E78] tracking-[0.25em] uppercase mb-12 opacity-80">
          A Celebration of Beautiful Memories
        </p>

        {/* Get Started Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="group relative px-10 py-4 sm:px-12 sm:py-5 rounded-full font-outfit font-semibold text-white tracking-widest uppercase overflow-hidden text-sm sm:text-base transition-shadow duration-300"
          style={{ 
            background: 'linear-gradient(135deg, #C2788A 0%, #C9A96E 100%)', 
            boxShadow: '0 10px 30px -5px rgba(194,120,138,0.4)' 
          }}
        >
          <span className="relative z-10 flex items-center gap-3">
            Get Started
            <svg 
              className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-500 group-hover:translate-x-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
          {/* Shine effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
        </motion.button>
      </motion.div>
      
      {/* Decorative Corner Accents */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-[#C9A96E]/30 rounded-tl-3xl hidden md:block" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-[#C9A96E]/30 rounded-br-3xl hidden md:block" />
    </motion.div>
  );
}
