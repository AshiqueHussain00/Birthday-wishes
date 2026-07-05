import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  FaGift, FaHeart, FaEnvelopeOpenText, FaStar,
  FaBirthdayCake, FaQuoteLeft, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

/* ─── Wish cards ─── */
const wishes = [
  {
    icon: FaHeart,
    label: 'Love & Joy',
    emoji: '💕',
    color: '#C2788A',
    bg: 'linear-gradient(135deg,#FDF0F3,#FCDFE5)',
    text: 'May your heart always be light, your smiles be frequent, and your life overflowing with people who cherish you exactly as you are.',
  },
  {
    icon: FaStar,
    label: 'Health & Success',
    emoji: '⭐',
    color: '#C9A96E',
    bg: 'linear-gradient(135deg,#FBF7F1,#F5E6C8)',
    text: 'Wishing you the strength and clarity to pursue every dream you hold dear. You have an incredible power to turn aspirations into beautiful reality.',
  },
  {
    icon: HiSparkles,
    label: 'Peace & Serenity',
    emoji: '🌸',
    color: '#9C4A5C',
    bg: 'linear-gradient(135deg,#FDF0F3,#FBF7F1)',
    text: 'Whenever life feels overwhelming, may you always find quiet moments of beauty, soft laughter, and gentle warmth that restore your wonderful spirit.',
  },
];

/* ─── Confetti burst ─── */
function fireConfetti() {
  const colors = ['#C2788A','#C9A96E','#FFF0F2','#F5E6C8','#DEB887','#FF91C8'];
  const end = Date.now() + 3800;
  const frame = () => {
    confetti({ particleCount: 6, angle: 60,  spread: 55, origin: { x: 0,   y: 0.7 }, colors });
    confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1,   y: 0.7 }, colors });
    confetti({ particleCount: 4, angle: 90,  spread: 70, origin: { x: 0.5, y: 0.6 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}

/* ─── Floating particle decoration ─── */
function FloatingDot({ style }) {
  return (
    <motion.div
      animate={{ y: [0, -14, 0], opacity: [0.4, 0.8, 0.4] }}
      transition={{ repeat: Infinity, duration: 3 + Math.random() * 2, ease: 'easeInOut' }}
      className="absolute rounded-full pointer-events-none"
      style={style}
    />
  );
}

export default function SurpriseGift() {
  const [isOpen, setIsOpen]         = useState(false);
  const [activeWish, setActiveWish] = useState(0);
  const [flipped, setFlipped]       = useState(false);
  const sectionRef = useRef(null);

  const handleOpen = () => { setIsOpen(true); fireConfetti(); };
  const nextWish   = () => setActiveWish(i => (i + 1) % wishes.length);
  const prevWish   = () => setActiveWish(i => (i - 1 + wishes.length) % wishes.length);
  const w = wishes[activeWish];

  return (
    <section
      ref={sectionRef}
      id="surprise"
      className="relative py-20 md:py-32 overflow-hidden font-outfit"
      style={{ background: 'linear-gradient(160deg,#FDF0F3 0%,#FBF7F1 50%,#F5E6C8 100%)' }}
    >
      {/* ─ Background blobs ─ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-24 w-64 h-64 md:w-96 md:h-96 rounded-full opacity-20 blur-3xl animate-float-slow"
          style={{ background: 'radial-gradient(circle,#C2788A,transparent)' }} />
        <div className="absolute bottom-1/4 -right-24 w-56 h-56 md:w-80 md:h-80 rounded-full opacity-15 blur-3xl animate-float-delay"
          style={{ background: 'radial-gradient(circle,#C9A96E,transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-[500px] md:h-[500px] rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle,#C2788A,transparent)' }} />
        <FloatingDot style={{ top:'12%', left:'8%',  width:10, height:10, background:'#C2788A', opacity:0.3 }} />
        <FloatingDot style={{ top:'25%', right:'10%', width:7,  height:7,  background:'#C9A96E', opacity:0.35 }} />
        <FloatingDot style={{ bottom:'20%', left:'15%', width:8, height:8, background:'#9C4A5C', opacity:0.25 }} />
        <FloatingDot style={{ bottom:'30%', right:'8%',  width:12, height:12, background:'#C2788A', opacity:0.2 }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">

          {/* ══════════════════════════════════
              CLOSED STATE — centered gift box
          ══════════════════════════════════ */}
          {!isOpen && (
            <motion.div
              key="closed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center text-center"
            >
              {/* Badge */}
              <div className="badge mb-6">
                <HiSparkles className="text-rose-gold" /> A Secret Just for You
              </div>

              {/* Headline */}
              <h2
                className="font-playfair font-extrabold text-charcoal tracking-tight mb-4"
                style={{ fontSize: 'clamp(1.8rem,5vw,3.5rem)' }}
              >
                Unwrap Your Birthday Surprise
              </h2>
              <p className="text-muted font-light text-sm md:text-base max-w-md mb-10 md:mb-14 px-4">
                Something special has been waiting just for you, Piku. Click the gift to reveal it 🎀
              </p>

              {/* Gift box + orbit */}
              <div
                className="relative flex items-center justify-center mb-10 cursor-pointer group select-none"
                style={{ width: 240, height: 240 }}
                onClick={handleOpen}
              >
                {/* Orbit rings */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
                  className="absolute w-56 h-56 rounded-full border border-dashed pointer-events-none"
                  style={{ borderColor: 'rgba(194,120,138,0.25)' }}
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                  className="absolute w-40 h-40 rounded-full border pointer-events-none"
                  style={{ borderColor: 'rgba(201,169,110,0.2)' }}
                />

                {/* Pulsing glow */}
                <motion.div
                  animate={{ scale: [1,1.18,1], opacity:[0.2,0.42,0.2] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className="absolute w-36 h-36 rounded-[2rem] blur-2xl pointer-events-none"
                  style={{ background: 'linear-gradient(135deg,#C2788A,#C9A96E)' }}
                />

                {/* Sparkle orbit dots */}
                {[0,60,120,180,240,300].map((deg,i) => {
                  const rad = (deg * Math.PI) / 180;
                  const r = 112;
                  return (
                    <motion.div key={i}
                      animate={{ scale:[0.5,1.2,0.5], opacity:[0.3,1,0.3] }}
                      transition={{ repeat:Infinity, delay:i*0.4, duration:2.4, ease:'easeInOut' }}
                      className="absolute w-2 h-2 rounded-full pointer-events-none"
                      style={{
                        background: i%2===0 ? '#C2788A' : '#C9A96E',
                        left: `calc(50% + ${Math.cos(rad)*r}px - 4px)`,
                        top:  `calc(50% + ${Math.sin(rad)*r}px - 4px)`,
                      }}
                    />
                  );
                })}

                {/* Box */}
                <motion.div
                  whileHover={{ scale: 1.07, rotate: 4 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative z-10 w-32 h-32 md:w-36 md:h-36 rounded-[1.75rem] bg-white flex items-center justify-center"
                  style={{ boxShadow: '0 12px 48px rgba(194,120,138,0.25), 0 2px 8px rgba(194,120,138,0.12)' }}
                >
                  {/* Ribbons */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-full h-5 rounded opacity-20" style={{ background: 'linear-gradient(90deg,#C2788A,#9C4A5C)' }} />
                  </div>
                  <div className="absolute inset-0 flex justify-center pointer-events-none">
                    <div className="h-full w-5 rounded opacity-20" style={{ background: 'linear-gradient(180deg,#C2788A,#9C4A5C)' }} />
                  </div>
                  {/* Bow */}
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-2xl pointer-events-none select-none">🎀</div>

                  <motion.div animate={{ y:[0,-8,0] }} transition={{ repeat:Infinity, duration:2.5, ease:'easeInOut' }}>
                    <FaGift className="text-5xl md:text-6xl transition-colors duration-300" style={{ color:'#C2788A' }} />
                  </motion.div>
                </motion.div>
              </div>

              <motion.p
                animate={{ opacity:[0.5,1,0.5] }}
                transition={{ repeat:Infinity, duration:2 }}
                className="text-xs font-bold uppercase tracking-[0.22em]"
                style={{ color:'#C2788A' }}
              >
                ✦ Tap to open ✦
              </motion.p>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════
              OPEN STATE
              Mobile  : flip card → wish panel (stacked)
              Desktop : flip card LEFT (3/5) | wishes RIGHT (2/5)
          ══════════════════════════════════════════════════ */}
          {isOpen && (
            <motion.div
              key="open"
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 110, damping: 20 }}
            >
              {/* Section header */}
              <div className="text-center mb-10 md:mb-14">
                <div className="badge mx-auto mb-4 w-fit">
                  <FaBirthdayCake className="text-rose-gold" /> Birthday Card Revealed!
                </div>
                <h2 className="font-playfair font-extrabold text-charcoal tracking-tight"
                  style={{ fontSize:'clamp(1.8rem,5vw,3.2rem)' }}
                >
                  A Card From the{' '}
                  <span className="font-script text-gradient-rose" style={{ fontSize:'1.2em' }}>Heart</span>
                </h2>
              </div>

              {/* Two-panel grid — stacked mobile, side-by-side desktop */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 items-start">

                {/* ▌ LEFT — Flip card (3/5 on desktop) */}
                <div className="lg:col-span-3">
                  <motion.div
                    style={{ cursor:'pointer' }}
                    onClick={() => setFlipped(f => !f)}
                    className="w-full"
                  >
                    <AnimatePresence mode="wait">
                      {!flipped ? (
                        /* Front — letter */
                        <motion.div key="front"
                          initial={{ rotateY:90, opacity:0 }} animate={{ rotateY:0, opacity:1 }}
                          exit={{ rotateY:-90, opacity:0 }} transition={{ duration:0.45 }}
                          className="glass-premium rounded-2xl md:rounded-3xl p-6 md:p-10 relative overflow-hidden"
                        >
                          {/* Gold top bar */}
                          <div className="absolute top-0 left-0 w-full h-1"
                            style={{ background:'linear-gradient(90deg,transparent,#C9A96E,#C2788A,#C9A96E,transparent)' }} />
                          {/* Corner ornaments */}
                          {['top-4 left-4 border-t border-l rounded-tl-lg',
                            'top-4 right-4 border-t border-r rounded-tr-lg',
                            'bottom-4 left-4 border-b border-l rounded-bl-lg',
                            'bottom-4 right-4 border-b border-r rounded-br-lg',
                          ].map((cls, i) => (
                            <div key={i} className={`absolute w-6 h-6 pointer-events-none ${cls}`}
                              style={{ borderColor:'rgba(201,169,110,0.4)' }} />
                          ))}

                          <div className="flex items-center gap-2 mb-5">
                            <FaEnvelopeOpenText className="text-base flex-shrink-0" style={{ color:'#C2788A' }} />
                            <span className="text-xs font-bold uppercase tracking-widest" style={{ color:'#C9A96E' }}>
                              A Note Just for You
                            </span>
                          </div>

                          <FaQuoteLeft className="text-2xl mb-3 opacity-20" style={{ color:'#C2788A' }} />

                          <h3 className="font-playfair font-bold text-charcoal mb-6"
                            style={{ fontSize:'clamp(1.3rem,3.5vw,2.2rem)' }}
                          >
                            Dear <span className="text-gradient-rose">Priyanka (Piku)</span>,
                          </h3>

                          <div className="space-y-4 text-muted font-light text-sm md:text-base leading-relaxed">
                            <p>
                              As you step into your{' '}
                              <strong className="text-deep-rose font-semibold">beautiful 23rd year</strong>,
                              I wanted to create this special space to celebrate the incredible light and happiness
                              you bring to everyone around you. Your warmth, grace, and infectious laughter make
                              the world a genuinely brighter place.
                            </p>
                            <p>
                              Five years of friendship — five years of laughter, growth, and memories I will always
                              hold close. May this birthday be the start of your most extraordinary year yet, full
                              of surprises, serenity, and every dream coming true. You are absolutely wonderful, Piku. 💕
                            </p>
                          </div>

                          <div className="mt-8 pt-5 border-t" style={{ borderColor:'rgba(194,120,138,0.15)' }}>
                            <p className="font-script" style={{ fontSize:'clamp(1.6rem,4vw,2.5rem)', color:'#C2788A' }}>
                              With all my warm wishes,
                            </p>
                            <p className="text-xs font-semibold uppercase tracking-widest mt-2" style={{ color:'#C9A96E' }}>
                              Your Friend, Always 🌸
                            </p>
                          </div>

                          <p className="absolute bottom-3 right-4 text-[9px] font-bold uppercase tracking-widest opacity-35"
                            style={{ color:'#C2788A' }}
                          >
                            Tap to flip →
                          </p>
                        </motion.div>
                      ) : (
                        /* Back — art card */
                        <motion.div key="back"
                          initial={{ rotateY:-90, opacity:0 }} animate={{ rotateY:0, opacity:1 }}
                          exit={{ rotateY:90, opacity:0 }} transition={{ duration:0.45 }}
                          className="rounded-2xl md:rounded-3xl relative overflow-hidden flex flex-col items-center justify-center text-center py-14 px-6"
                          style={{
                            background:'linear-gradient(135deg,#9C4A5C 0%,#C2788A 45%,#C9A96E 100%)',
                            minHeight:380,
                          }}
                        >
                          <div className="absolute inset-0 opacity-[0.06]"
                            style={{ backgroundImage:'radial-gradient(circle,white 1px,transparent 1px)', backgroundSize:'24px 24px' }} />

                          <motion.div animate={{ scale:[1,1.07,1], rotate:[0,3,-2,0] }}
                            transition={{ repeat:Infinity, duration:3 }} className="text-7xl mb-5"
                          >🎂</motion.div>

                          <h3 className="font-playfair font-extrabold text-white mb-3"
                            style={{ fontSize:'clamp(1.6rem,4vw,2.8rem)', textShadow:'0 2px 20px rgba(0,0,0,0.2)' }}
                          >
                            Happy 23rd Birthday!
                          </h3>
                          <p className="font-script text-white/80 mb-6" style={{ fontSize:'clamp(1.4rem,3vw,2.2rem)' }}>
                            Priyanka (Piku)
                          </p>

                          <div className="flex gap-3 text-3xl mb-7">
                            {['🌸','✨','💕','🌟','🎉'].map((e,i) => (
                              <motion.span key={i} animate={{ y:[0,-8,0] }}
                                transition={{ repeat:Infinity, delay:i*0.2, duration:1.2 }}>{e}</motion.span>
                            ))}
                          </div>

                          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-5 py-3 text-white text-xs font-semibold uppercase tracking-widest">
                            5 Years of Beautiful Friendship ❤️
                          </div>
                          <p className="absolute bottom-3 right-4 text-[9px] font-bold uppercase tracking-widest text-white/30">
                            ← Tap to flip
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>

                {/* ▌ RIGHT — Wish panel (2/5 on desktop) */}
                <div className="lg:col-span-2 flex flex-col gap-4">

                  {/* Header + nav */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-playfair font-bold text-charcoal text-lg md:text-xl">
                        Wishes for You 💝
                      </h4>
                      <p className="text-muted text-xs font-light mt-0.5">Three blessings, specially chosen</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={prevWish}
                        className="w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 hover:scale-110"
                        style={{ background:'rgba(255,255,255,0.7)', borderColor:'rgba(194,120,138,0.2)' }}
                      >
                        <FaChevronLeft className="text-xs" style={{ color:'#9C4A5C' }} />
                      </button>
                      <button onClick={nextWish}
                        className="w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 hover:scale-110"
                        style={{ background:'rgba(255,255,255,0.7)', borderColor:'rgba(194,120,138,0.2)' }}
                      >
                        <FaChevronRight className="text-xs" style={{ color:'#9C4A5C' }} />
                      </button>
                    </div>
                  </div>

                  {/* Pip dots */}
                  <div className="flex gap-2">
                    {wishes.map((_,i) => (
                      <button key={i} onClick={() => setActiveWish(i)}
                        className="rounded-full transition-all duration-300"
                        style={{ width: activeWish===i ? 24 : 8, height:8,
                          background: activeWish===i ? w.color : 'rgba(194,120,138,0.2)' }}
                      />
                    ))}
                  </div>

                  {/* Wish card */}
                  <AnimatePresence mode="wait">
                    <motion.div key={activeWish}
                      initial={{ opacity:0, x:20, scale:0.97 }}
                      animate={{ opacity:1, x:0, scale:1 }}
                      exit={{ opacity:0, x:-20, scale:0.97 }}
                      transition={{ duration:0.3 }}
                      className="rounded-2xl md:rounded-3xl p-5 md:p-6 flex flex-col gap-4 relative overflow-hidden"
                      style={{ background:w.bg, border:'1px solid rgba(255,255,255,0.85)', minHeight:220 }}
                    >
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm"
                        style={{ background:`linear-gradient(135deg,${w.color}20,${w.color}40)`, border:`1px solid ${w.color}30` }}
                      >
                        <w.icon className="text-lg" style={{ color:w.color }} />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{w.emoji}</span>
                          <span className="font-playfair font-bold text-charcoal text-base">{w.label}</span>
                        </div>
                        <p className="text-muted text-sm font-light leading-relaxed">{w.text}</p>
                      </div>

                      <div className="mt-auto pt-3 border-t flex items-center justify-between"
                        style={{ borderColor:`${w.color}20` }}
                      >
                        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color:w.color }}>
                          {activeWish+1} / {wishes.length}
                        </span>
                        <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background:`${w.color}20` }}>
                          <div className="h-full rounded-full transition-all duration-500"
                            style={{ width:`${((activeWish+1)/wishes.length)*100}%`, background:w.color }} />
                        </div>
                      </div>

                      <div className="absolute -bottom-5 -right-5 w-20 h-20 rounded-full blur-2xl pointer-events-none"
                        style={{ background:w.color, opacity:0.12 }} />
                    </motion.div>
                  </AnimatePresence>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2 md:gap-3">
                    {[
                      { num:'23', label:'Years Young',   icon:'🎂' },
                      { num:'5',  label:'Yrs Together',  icon:'💕' },
                      { num:'∞',  label:'Memories Made', icon:'✨' },
                    ].map((stat,i) => (
                      <motion.div key={i} whileHover={{ y:-3 }}
                        className="rounded-xl md:rounded-2xl p-3 text-center flex flex-col items-center gap-1"
                        style={{ background:'rgba(255,255,255,0.8)', border:'1px solid rgba(194,120,138,0.12)' }}
                      >
                        <span className="text-base">{stat.icon}</span>
                        <span className="font-playfair font-extrabold text-charcoal text-lg md:text-2xl">{stat.num}</span>
                        <span className="text-muted text-[9px] md:text-[10px] font-light leading-tight text-center">{stat.label}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Close */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => { setIsOpen(false); setFlipped(false); setActiveWish(0); }}
                  className="text-xs font-semibold uppercase tracking-widest opacity-40 hover:opacity-70 transition-opacity"
                  style={{ color:'#9C4A5C' }}
                >
                  ← Close card
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </section>
  );
}