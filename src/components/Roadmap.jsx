import React from 'react';
import { motion } from 'framer-motion';
import { FaCompass, FaSmile, FaSeedling, FaMapMarkedAlt, FaHeart, FaCrown } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

const roadmapData = [
  {
    date: "October 2021",
    title: "The Spark",
    emoji: "⚡",
    description: "The very beginning — a simple connection that instantly turned into deep conversations, shared laughter, and endless dreams painted together.",
    icon: FaCompass,
    accent: '#C2788A',
    bg: 'linear-gradient(135deg, #FDF0F3, #FBF7F1)',
  },
  {
    date: "October 2022",
    title: "A Year of Laughter",
    emoji: "🌸",
    description: "Twelve months of inside jokes, shared secrets, and realising that everything in life is infinitely brighter when we face it side by side.",
    icon: FaSmile,
    accent: '#9C4A5C',
    bg: 'linear-gradient(135deg, #FDF0F3, #FCDFE5)',
  },
  {
    date: "October 2023",
    title: "Growing Together",
    emoji: "🌱",
    description: "Building a foundation of trust, deep understanding, and unwavering support — cheering each other on through every milestone.",
    icon: FaSeedling,
    accent: '#C9A96E',
    bg: 'linear-gradient(135deg, #FBF7F1, #F5E6C8)',
  },
  {
    date: "October 2024",
    title: "Beautiful Adventures",
    emoji: "✈️",
    description: "Exploring new horizons, capturing gorgeous memories, and writing a story that feels more beautiful with every passing chapter.",
    icon: FaMapMarkedAlt,
    accent: '#C2788A',
    bg: 'linear-gradient(135deg, #FDF0F3, #FBF7F1)',
  },
  {
    date: "October 2025",
    title: "The Deepening Bond",
    emoji: "❤️",
    description: "Facing challenges hand-in-hand, growing stronger together, and becoming more certain than ever of how truly special this journey is.",
    icon: FaHeart,
    accent: '#6B2D3E',
    bg: 'linear-gradient(135deg, #FCDFE5, #FDF0F3)',
  },
  {
    date: "July 8, 2026",
    title: "Celebrating Priyanka",
    emoji: "👑",
    description: "Today marks five extraordinary years — and the celebration of a wonderful, radiant soul. Happy Birthday, Piku! Here's to forever. 🎉",
    icon: FaCrown,
    accent: '#C9A96E',
    bg: 'linear-gradient(135deg, #F5E6C8, #FBF7F1)',
    isFinal: true,
  },
];

export default function Roadmap() {
  return (
    <section id="roadmap" className="relative py-20 md:py-32 lg:py-36 overflow-hidden font-outfit"
      style={{ background: 'linear-gradient(180deg, #FBF7F1 0%, #FDF0F3 50%, #FBF7F1 100%)' }}
    >
      {/* ── Background ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #C2788A, transparent)' }} />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'radial-gradient(circle, #9C4A5C 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ── */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-20 lg:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="badge mx-auto mb-5 w-fit"
          >
            <HiSparkles className="text-rose-gold" />
            Our Milestones
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-playfair font-extrabold text-charcoal tracking-tight mb-5"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
          >
            The 5-Year{' '}
            <span className="font-script text-gradient-rose" style={{ fontSize: '1.2em' }}>
              Journey
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0 }}
            className="text-muted font-light text-sm sm:text-base leading-relaxed"
          >
            Tracing our beautiful story — step by step — from October 2021 to today.
          </motion.p>
        </div>

        {/* ── Timeline ── */}
        <div className="relative">

          {/* Central dashed line */}
          <div
            className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-1/2"
            style={{
              background: 'linear-gradient(to bottom, transparent 0%, #C2788A 15%, #C9A96E 85%, transparent 100%)',
              opacity: 0.35,
            }}
          />

          {roadmapData.map((milestone, index) => {
            const Icon = milestone.icon;
            const isLeft = index % 2 === 0;

            return (
              <div
                key={index}
                className={`relative flex flex-col md:flex-row mb-12 md:mb-16 lg:mb-20 last:mb-0 items-start md:items-center ${isLeft ? 'md:flex-row-reverse' : ''}`}
              >

                {/* ── Node ── */}
                <div className="absolute left-5 md:left-1/2 -translate-x-1/2 z-20">
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="relative"
                  >
                    {/* Glow ring for final node */}
                    {milestone.isFinal && (
                      <div className="absolute inset-[-6px] rounded-full animate-pulse-glow pointer-events-none"
                        style={{ background: 'rgba(201,169,110,0.25)', borderRadius: '50%' }} />
                    )}

                    {/* Icon disc */}
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white shadow-gold relative z-10"
                      style={{ background: `linear-gradient(135deg, ${milestone.accent}, ${milestone.isFinal ? '#AA8744' : '#6B2D3E'})` }}
                    >
                      <Icon className="text-sm" />
                    </div>
                  </motion.div>
                </div>

                {/* ── Card ── */}
                <div className={`w-full md:w-[calc(50%-48px)] pl-16 sm:pl-20 md:pl-0 ${isLeft ? 'md:pr-10 lg:pr-16' : 'md:pl-10 lg:pl-16'}`}>
                  <motion.div
                    initial={{ opacity: 0, x: isLeft ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ type: 'spring', stiffness: 90, damping: 18, delay: 0.05 }}
                    whileHover={{ y: -5 }}
                    className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 relative overflow-hidden group"
                    style={{ background: milestone.bg }}
                  >
                    {/* Corner accent gradient blob */}
                    <div
                      className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
                      style={{ background: milestone.accent }}
                    />

                    {/* Date badge */}
                    <div className="badge mb-3 sm:mb-5" style={{ color: milestone.accent, borderColor: `${milestone.accent}40`, background: `${milestone.accent}10` }}>
                      {milestone.date}
                    </div>

                    {/* Title row */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm text-white flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${milestone.accent}, #6B2D3E)` }}
                      >
                        <Icon className="text-sm" />
                      </div>
                      <h3 className="font-playfair font-bold text-charcoal text-base sm:text-xl tracking-tight">
                        {milestone.title} <span>{milestone.emoji}</span>
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-muted text-sm leading-relaxed font-light">
                      {milestone.description}
                    </p>

                    {/* Final card extra shimmer border */}
                    {milestone.isFinal && (
                      <div className="absolute inset-0 rounded-3xl pointer-events-none"
                        style={{ boxShadow: 'inset 0 0 0 1.5px rgba(201,169,110,0.4)' }} />
                    )}
                  </motion.div>
                </div>

              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}
