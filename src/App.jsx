import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import DigitalGallery from './components/DigitalGallery';
import SurpriseGift from './components/SurpriseGift';
import FloatingEffects from './components/FloatingEffects';
import Roadmap from './components/Roadmap';
import BirthdayVideo from './components/BirthdayVideo';
import WelcomeScreen from './components/WelcomeScreen';

function App() {
  const BIRTHDAY_NAME = "Priyanka (Piku)";
  const [showVideo, setShowVideo] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <div
      className={`min-h-screen text-charcoal selection:bg-rose-gold/25 selection:text-dark-rose relative font-outfit ${!started ? 'overflow-hidden h-screen' : 'overflow-hidden'}`}
      style={{ backgroundColor: '#FBF7F1' }}
    >
      {/* Welcome Screen Overlay */}
      <AnimatePresence>
        {!started && (
          <WelcomeScreen key="welcome" onStart={() => setStarted(true)} />
        )}
      </AnimatePresence>

      {/* Background Canvas Petal Animation */}
      <FloatingEffects />

      {/* 1. Hero */}
      <Hero name={BIRTHDAY_NAME} onPlayVideo={() => setShowVideo(true)} />

      {/* 2. Gallery */}
      <DigitalGallery />

      {/* 3. Journey Roadmap */}
      <Roadmap />

      {/* 4. Surprise Gift */}
      <SurpriseGift />

      {/* Footer */}
      <footer
        className="relative z-10 py-12 md:py-16 text-center font-outfit"
        style={{
          background: 'linear-gradient(180deg, #FBF7F1 0%, #FDF0F3 100%)',
          borderTop: '1px solid rgba(194,120,138,0.12)',
        }}
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-32 sm:w-48 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #C9A96E, transparent)' }}
        />
        <p className="font-script mb-3 md:mb-4" style={{ fontSize:'clamp(2.5rem,6vw,5rem)', color: 'rgba(194,120,138,0.7)' }}>
          Happy Birthday
        </p>
        <p className="text-xs sm:text-sm font-light tracking-wide px-4" style={{ color: '#7A6E78' }}>
          Made with <span className="text-rose-gold animate-pulse">♥</span> specially for{' '}
          <span className="font-semibold text-deep-rose">{BIRTHDAY_NAME}</span>
        </p>
        <p className="text-[10px] sm:text-xs mt-3 tracking-widest uppercase opacity-40">July 8, 2026</p>
      </footer>

      {/* Birthday Video Modal */}
      <AnimatePresence>
        {showVideo && (
          <BirthdayVideo onClose={() => setShowVideo(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;