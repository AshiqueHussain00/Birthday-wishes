import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPause, FaRedo, FaTimes } from 'react-icons/fa';

/* ══════════════════════════════════════════════
   CONSTANTS
*/
const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 768;

/* ══════════════════════════════════════════════
   CANVAS — ANIME PARTICLE SYSTEM
   ══════════════════════════════════════════════ */

/* Draw a classic 4-pointed anime sparkle ✦ */
function drawSparkle(ctx, x, y, r, color, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = r * 0.18;
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2;
    if (i === 0) ctx.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
    else ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
    const a2 = a + Math.PI / 4;
    ctx.lineTo(x + Math.cos(a2) * r * 0.22, y + Math.sin(a2) * r * 0.22);
  }
  ctx.closePath();
  ctx.fill();
  
  // glow - DISABLED on mobile for extreme performance increase
  if (!isMobileDevice) {
    ctx.shadowColor = color;
    ctx.shadowBlur  = r * 2.5;
  }
  
  ctx.stroke();
  ctx.restore();
}

/* Draw a sakura petal */
function drawPetal(ctx, x, y, r, angle, color, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-r * 0.6, -r * 0.4, -r * 0.6, r, 0, r);
  ctx.bezierCurveTo(r * 0.6, r, r * 0.6, -r * 0.4, 0, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/* Draw a glowing orb */
function drawOrb(ctx, x, y, r, color, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  
  // Radial gradient is slower on mobile, so we use a simpler flat circle if on mobile
  if (isMobileDevice) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
    ctx.fill();
  } else {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'white');
    g.addColorStop(0.3, color);
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/* Draw speed lines (anime transition effect) */
function drawSpeedLines(ctx, W, H, alpha) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha * 0.18;
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 1;
  const cx = W / 2, cy = H / 2;
  // Reduce speed lines count on mobile
  const linesCount = isMobileDevice ? 25 : 60;
  for (let i = 0; i < linesCount; i++) {
    const a = (i / linesCount) * Math.PI * 2;
    const r0 = Math.min(W, H) * 0.08;
    const r1 = Math.min(W, H) * 1.1;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
    ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
    ctx.stroke();
  }
  ctx.restore();
}

/* Build particle pool */
function buildPool(W, H) {
  const sparkleColors = ['#FFE5F0','#FFB3D1','#E5B3FF','#B3D9FF','#FFE0B3','#B3FFD9','#FFFACD'];
  const petalColors   = ['#FFB6C8','#FF91A8','#FFCCD8','#F4A0B5','#FFD6E0'];

  const sparkleCount = isMobileDevice ? 18 : 55;
  const petalCount   = isMobileDevice ? 15 : 40;
  const orbCount     = isMobileDevice ? 6 : 18;

  const sparkles = Array.from({ length: sparkleCount }, () => ({
    type: 'sparkle',
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.6,
    vy: -(Math.random() * 0.5 + 0.2),
    r: Math.random() * 9 + 4,
    color: sparkleColors[Math.floor(Math.random() * sparkleColors.length)],
    alpha: Math.random() * 0.7 + 0.3,
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.04 + 0.02,
    born: Math.random() * 200,
  }));

  const petals = Array.from({ length: petalCount }, () => ({
    type: 'petal',
    x: Math.random() * W, y: Math.random() * H - H * 0.2,
    vx: (Math.random() - 0.5) * 0.8,
    vy: Math.random() * 1.2 + 0.5,
    r: Math.random() * 10 + 5,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.035,
    color: petalColors[Math.floor(Math.random() * petalColors.length)],
    alpha: Math.random() * 0.55 + 0.3,
  }));

  const orbs = Array.from({ length: orbCount }, () => ({
    type: 'orb',
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 22 + 6,
    color: sparkleColors[Math.floor(Math.random() * sparkleColors.length)],
    alpha: Math.random() * 0.18 + 0.06,
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.02 + 0.01,
  }));

  return [...sparkles, ...petals, ...orbs];
}

function tickPool(pool, W, H, t) {
  pool.forEach(p => {
    if (p.type === 'sparkle') {
      p.x += p.vx; p.y += p.vy;
      p.phase += p.speed;
      const a = Math.sin(p.phase) * 0.5 + 0.5;
      p.alpha = a * 0.8 + 0.1;
      if (p.y < -30) { p.y = H + 10; p.x = Math.random() * W; }
    } else if (p.type === 'petal') {
      p.x += p.vx + Math.sin(t * 0.001 + p.angle) * 0.4;
      p.y += p.vy;
      p.angle += p.spin;
      if (p.y > H + 20) { p.y = -20; p.x = Math.random() * W; }
    } else {
      p.x += p.vx; p.y += p.vy;
      p.phase += p.speed;
      p.alpha = (Math.sin(p.phase) * 0.08 + 0.12);
      if (p.x < -50 || p.x > W + 50) p.vx *= -1;
      if (p.y < -50 || p.y > H + 50) p.vy *= -1;
    }
  });
}

function drawPool(ctx, pool, t) {
  pool.forEach(p => {
    if (p.type === 'sparkle') {
      drawSparkle(ctx, p.x, p.y, p.r, p.color, p.alpha);
    } else if (p.type === 'petal') {
      drawPetal(ctx, p.x, p.y, p.r, p.angle, p.color, p.alpha);
    } else {
      drawOrb(ctx, p.x, p.y, p.r, p.color, p.alpha);
    }
  });
}

/* ══════════════════════════════════════════════
   SCENE BACKGROUNDS  (anime palettes)
══════════════════════════════════════════════ */
const SCENE_BG = [
  // 0 – Night sky  (deep indigo → purple → rose)
  ['#0D0B2A','#1A0B3B','#2D0F3E'],
  // 1 – Twilight  (navy → deep rose → plum)
  ['#0A0F2E','#2A0E3F','#1F0A2A'],
  // 2 – Sakura evening (dark plum → magenta → deep rose)
  ['#1A0520','#2E0B2E','#3D1235'],
  // 3 – Golden hour (navy → indigo → orange-rose)
  ['#080B22','#1A0D3A','#2E1040'],
  // 4 – Dreamy purple (midnight → violet → lavender dark)
  ['#0A0520','#160830','#1E0B3A'],
  // 5 – Grand finale (deep black-blue → purple → pink)
  ['#050314','#100828','#1E0830'],
];

/* Animated overlay colours per scene */
const OVERLAY_GLOW = [
  'rgba(140,80,220,0.12)',   // purple
  'rgba(220,80,140,0.12)',   // rose
  'rgba(200,60,160,0.14)',   // magenta
  'rgba(180,100,255,0.12)',  // violet
  'rgba(120,60,220,0.12)',   // deep violet
  'rgba(255,100,200,0.15)',  // finale pink
];

/* ══════════════════════════════════════════════
   SCENE TEXT  CONFIGS
══════════════════════════════════════════════ */
const SCENES = [
  {
    eyebrow: '✦ A Special Day ✦',
    title:   'Happy',
    title2:  'Birthday!',
    body:    null,
    accent:  '#FF91C8',
    gold:    '#FFD580',
  },
  {
    eyebrow: '✦ Turning 23 ✦',
    title:   'Priyanka',
    title2:  '(Piku)',
    body:    'The most wonderful 23-year-old 🌸',
    accent:  '#C891FF',
    gold:    '#FFD580',
  },
  {
    eyebrow: '🌸 23 Years of Brilliance 🌸',
    title:   'You are',
    title2:  'Extraordinary',
    body:    'Beautiful inside and out ✨',
    accent:  '#FF70C0',
    gold:    '#FFE580',
  },
  {
    eyebrow: '💫 5 Years of Friendship 💫',
    title:   'Oct 2021',
    title2:  '→ Jul 2026',
    body:    'Every moment treasured forever',
    accent:  '#91C8FF',
    gold:    '#FFD580',
  },
  {
    eyebrow: '✦ Our Journey ✦',
    title:   'Together',
    title2:  'Always',
    body:    'Laughter • Dreams • Memories 💕',
    accent:  '#B891FF',
    gold:    '#FFD580',
  },
  {
    eyebrow: '👑 Grand Finale 👑',
    title:   'Happy',
    title2:  'Birthday, Piku!',
    body:    'With love, forever & always 💝',
    accent:  '#FF91C8',
    gold:    '#FFD580',
  },
];

/* ══════════════════════════════════════════════
   ANIME SCENE OVERLAY COMPONENTS
══════════════════════════════════════════════ */

/** Magic circle that spins */
function MagicCircle({ color, size = 220, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.3, rotate: -120 }}
      animate={{ opacity: [0, 0.55, 0.45, 0.5], scale: 1, rotate: 360 }}
      transition={{ delay, duration: 4, repeat: Infinity, ease: 'linear' }}
      className="absolute pointer-events-none"
      style={{ width: size, height: size, left: `calc(50% - ${size / 2}px)`, top: `calc(50% - ${size / 2}px)` }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={size/2-6} fill="none"
          stroke={color} strokeWidth="1.5" strokeDasharray="8 6" opacity="0.7"/>
        <circle cx={size/2} cy={size/2} r={size/2-18} fill="none"
          stroke={color} strokeWidth="0.8" opacity="0.5"/>
        {[0,60,120,180,240,300].map(a => {
          const rad = (a * Math.PI) / 180;
          const r = size/2 - 6;
          return (
            <circle key={a}
              cx={size/2 + Math.cos(rad)*r} cy={size/2 + Math.sin(rad)*r}
              r="4" fill={color} opacity="0.8"/>
          );
        })}
      </svg>
    </motion.div>
  );
}

/** 4-pointed star sparkle overlay (big decorative ones) */
function BigSparkles({ color }) {
  const pos = [
    { x: '12%',  y: '18%',  size: 28, delay: 0 },
    { x: '82%',  y: '22%',  size: 22, delay: 0.5 },
    { x: '8%',   y: '70%',  size: 18, delay: 1.0 },
    { x: '88%',  y: '65%',  size: 25, delay: 0.3 },
    { x: '48%',  y: '10%',  size: 16, delay: 0.7 },
    { x: '30%',  y: '80%',  size: 20, delay: 1.2 },
    { x: '72%',  y: '80%',  size: 22, delay: 0.9 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none">
      {pos.map((p, i) => (
        <motion.div key={i}
          animate={{ opacity: [0, 1, 0.4, 1, 0], scale: [0.5, 1.2, 0.8, 1, 0.5], rotate: [0, 45] }}
          transition={{ repeat: Infinity, delay: p.delay, duration: 2.2, ease: 'easeInOut' }}
          style={{ position: 'absolute', left: p.x, top: p.y }}
        >
          <svg width={p.size} height={p.size} viewBox="0 0 40 40">
            <path d="M20 0 L22 18 L40 20 L22 22 L20 40 L18 22 L0 20 L18 18 Z"
              fill={color} opacity="0.9"/>
            <path d="M20 0 L22 18 L40 20 L22 22 L20 40 L18 22 L0 20 L18 18 Z"
              fill="white" opacity="0.3"/>
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

/** Anime-style shockwave ring */
function ShockRing({ color }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[0, 0.4, 0.8].map((delay, i) => (
        <motion.div key={i}
          initial={{ scale: 0.1, opacity: 0.8 }}
          animate={{ scale: 2.8, opacity: 0 }}
          transition={{ repeat: Infinity, delay, duration: 2.5, ease: 'easeOut' }}
          className="absolute rounded-full border-2"
          style={{ width: 100, height: 100, borderColor: color, boxShadow: `0 0 12px ${color}` }}
        />
      ))}
    </div>
  );
}

/** Floating kanji-style decorative text */
function AnimeDecoText({ scene }) {
  const decorTexts = [
    ['誕生日', '幸せ', '愛'],
    ['23歳', '美しい', '友達'],
    ['素晴らしい', '輝く', '特別'],
    ['5年間', '友情', '永遠'],
    ['一緒に', '夢', '笑い'],
    ['大好き', '特別', '幸せ'],
  ];
  const texts = decorTexts[scene] || decorTexts[0];
  const positions = [
    { x: '6%',  y: '15%', size: '0.9rem', delay: 0.2 },
    { x: '80%', y: '12%', size: '0.85rem', delay: 0.6 },
    { x: '4%',  y: '78%', size: '0.8rem', delay: 1.0 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {texts.map((txt, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 0.35, 0.25, 0.35], y: [10, 0, -5, 0] }}
          transition={{ delay: positions[i].delay, duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            left: positions[i].x,
            top: positions[i].y,
            fontSize: positions[i].size,
            color: 'rgba(255,200,240,0.55)',
            fontFamily: 'serif',
            fontWeight: 700,
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            letterSpacing: '0.15em',
          }}
        >
          {txt}
        </motion.div>
      ))}
    </div>
  );
}

/** Scene 0 – Moon + stars */
function Scene0() {
  return (
    <>
      <motion.div className="absolute top-[8%] right-[12%] pointer-events-none"
        animate={{ opacity: [0.6,1,0.7,1], scale: [0.97,1.04,0.97] }}
        transition={{ repeat: Infinity, duration: 4 }}
      >
        <svg width="80" height="80" viewBox="0 0 80 80">
          <defs>
            <radialGradient id="moonGrad" cx="40%" cy="35%">
              <stop offset="0%" stopColor="#FFFDE0"/>
              <stop offset="100%" stopColor="#FFD580"/>
            </radialGradient>
          </defs>
          <circle cx="40" cy="40" r="34" fill="url(#moonGrad)" opacity="0.95"/>
          <circle cx="54" cy="28" r="28" fill="#0D0B2A"/>
          <circle cx="40" cy="40" r="34" fill="none" stroke="#FFE880" strokeWidth="2" opacity="0.4"/>
        </svg>
      </motion.div>
      <MagicCircle color="#C891FF" size={200} delay={0.3}/>
      <BigSparkles color="#FFD580"/>
      <AnimeDecoText scene={0}/>
    </>
  );
}

/** Scene 1 – Name reveal */
function Scene1() {
  return (
    <>
      <ShockRing color="#C891FF"/>
      <MagicCircle color="#FF91C8" size={240} delay={0}/>
      <MagicCircle color="#C891FF" size={160} delay={0.5}/>
      <BigSparkles color="#FF91C8"/>
      <AnimeDecoText scene={1}/>
    </>
  );
}

/** Scene 2 – Sakura / extra petals */
function Scene2() {
  return (
    <>
      <MagicCircle color="#FF70C0" size={220} delay={0.2}/>
      <BigSparkles color="#FFE0F0"/>
      <ShockRing color="#FF70C0"/>
      <AnimeDecoText scene={2}/>
      {/* Anime "power up" aura */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0, 0.08, 0, 0.06, 0] }}
        transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut' }}
        style={{ background: 'radial-gradient(ellipse at center, rgba(255,112,192,0.35) 0%, transparent 70%)' }}
      />
    </>
  );
}

/** Scene 3 – Timeline */
function Scene3() {
  return (
    <>
      <MagicCircle color="#91C8FF" size={210} delay={0.1}/>
      <BigSparkles color="#91C8FF"/>
      <AnimeDecoText scene={3}/>
      {/* Streaming light lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[15,35,55,70,85].map((y, i) => (
          <motion.div key={i}
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: '200%', opacity: [0, 0.3, 0] }}
            transition={{ delay: i * 0.3, duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: `${y}%`,
              height: '1px',
              width: '40%',
              background: 'linear-gradient(90deg, transparent, #91C8FF, transparent)',
            }}
          />
        ))}
      </div>
    </>
  );
}

/** Scene 4 – Floating hearts + circles */
function Scene4() {
  return (
    <>
      <MagicCircle color="#B891FF" size={200} delay={0}/>
      <MagicCircle color="#FF91C8" size={130} delay={0.8}/>
      <BigSparkles color="#E0B8FF"/>
      <ShockRing color="#B891FF"/>
      <AnimeDecoText scene={4}/>
    </>
  );
}

/** Scene 5 – Grand finale */
function Scene5() {
  return (
    <>
      <ShockRing color="#FF91C8"/>
      <MagicCircle color="#FF91C8" size={260} delay={0}/>
      <MagicCircle color="#FFD580" size={180} delay={0.3}/>
      <MagicCircle color="#C891FF" size={120} delay={0.6}/>
      <BigSparkles color="#FFD580"/>
      <AnimeDecoText scene={5}/>
      {/* Full-screen glow burst */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0, 0.12, 0, 0.1, 0] }}
        transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
        style={{ background: 'radial-gradient(ellipse at center, rgba(255,200,100,0.4) 0%, transparent 65%)' }}
      />
    </>
  );
}

const SCENE_OVERLAYS = [Scene0, Scene1, Scene2, Scene3, Scene4, Scene5];

/* ══════════════════════════════════════════════
   ANIME TEXT REVEAL VARIANTS
══════════════════════════════════════════════ */
const textReveal = {
  initial: { opacity: 0, y: 30, filter: 'blur(8px)', scale: 0.9 },
  animate: (d) => ({
    opacity: 1, y: 0, filter: 'blur(0px)', scale: 1,
    transition: { delay: d, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
const TOTAL = 30;
const NUM_SCENES = 6;
const SCENE_DUR = 5;

export default function BirthdayVideo({ onClose }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const startRef  = useRef(null);
  const pausedRef = useRef(null);
  const poolRef   = useRef([]);
  const tRef      = useRef(0);

  const [elapsed,  setElapsed]  = useState(0);
  const [playing,  setPlaying]  = useState(false);
  const [finished, setFinished] = useState(false);
  const [sceneIdx, setSceneIdx] = useState(0);

  /* ── Resize ── */
  useEffect(() => {
    const resize = () => {
      const c = canvasRef.current; if (!c) return;
      c.width = c.offsetWidth; c.height = c.offsetHeight;
      poolRef.current = [];
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  /* ── Reset pool on scene change ── */
  useEffect(() => { poolRef.current = []; }, [sceneIdx]);

  /* ── Render loop ── */
  const render = useCallback((ts) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    if (startRef.current === null) startRef.current = ts;
    const el = Math.min((ts - startRef.current) / 1000, TOTAL);
    tRef.current = ts;

    const sIdx = Math.min(Math.floor(el / SCENE_DUR), NUM_SCENES - 1);
    setElapsed(el);
    setSceneIdx(sIdx);

    if (el >= TOTAL) {
      setPlaying(false); setFinished(true);
      return;
    }

    /* Background */
    ctx.clearRect(0, 0, W, H);
    const [b0, b1, b2] = SCENE_BG[sIdx];
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, b0); bg.addColorStop(0.5, b1); bg.addColorStop(1, b2);
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    /* Subtle vignette */
    const vig = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W,H)*0.72);
    vig.addColorStop(0, 'transparent');
    vig.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);

    /* Glow overlay */
    const pct = (el % SCENE_DUR) / SCENE_DUR;
    const glowAmt = Math.sin(ts * 0.001) * 0.04 + 0.08;
    ctx.fillStyle = OVERLAY_GLOW[sIdx].replace(/[\d.]+\)$/, `${glowAmt})`);
    ctx.fillRect(0, 0, W, H);

    /* Speed lines at scene boundary */
    const edge = Math.min(pct / 0.12, (1 - pct) / 0.10, 1);
    if (pct < 0.12 || pct > 0.90) {
      drawSpeedLines(ctx, W, H, 1 - edge);
      ctx.fillStyle = `rgba(0,0,0,${(1 - edge) * 0.65})`;
      ctx.fillRect(0, 0, W, H);
    }

    /* Particle pool */
    if (poolRef.current.length === 0) poolRef.current = buildPool(W, H);
    tickPool(poolRef.current, W, H, ts);
    drawPool(ctx, poolRef.current, ts);

    rafRef.current = requestAnimationFrame(render);
  }, []);

  /* ── Play ── */
  const play = useCallback(() => {
    if (finished) {
      startRef.current = null; pausedRef.current = null;
      setElapsed(0); setSceneIdx(0); setFinished(false);
      poolRef.current = [];
    }
    setPlaying(true);
  }, [finished]);

  /* ── Pause ── */
  const pause = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    pausedRef.current = elapsed;
    setPlaying(false);
  }, [elapsed]);

  /* ── Animation effect ── */
  useEffect(() => {
    if (!playing) return;
    if (pausedRef.current !== null) {
      const off = pausedRef.current * 1000;
      startRef.current = null; poolRef.current = [];
      const loop = (ts) => {
        if (startRef.current === null) startRef.current = ts - off;
        render(ts);
      };
      rafRef.current = requestAnimationFrame(loop);
      pausedRef.current = null;
    } else {
      poolRef.current = [];
      rafRef.current = requestAnimationFrame(render);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, render]);

  /* ── Keyboard ── */
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const pct    = Math.min((elapsed / TOTAL) * 100, 100);
  const scene  = SCENES[sceneIdx] || SCENES[0];
  const OvComp = SCENE_OVERLAYS[sceneIdx] || SCENE_OVERLAYS[0];

  return (
    /* ── Backdrop ── */
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 md:p-6"
      style={{ background: 'rgba(2,1,12,0.92)', backdropFilter: 'blur(18px)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >

      {/* ━━━━━━━━━━━━━━━━━ VIDEO FRAME ━━━━━━━━━━━━━━━━━ */}
      <motion.div
        className="relative w-full max-w-3xl rounded-[1.75rem] overflow-hidden"
        style={{ aspectRatio: '16/9', boxShadow: '0 0 0 1px rgba(200,145,255,0.18), 0 40px 120px rgba(0,0,0,0.7)' }}
        initial={{ scale: 0.82, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full"
          style={{ width: '100%', height: '100%' }}/>

        {/* ─── Anime decorative overlay ─── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div key={sceneIdx} className="absolute inset-0"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <OvComp />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ─── Anime text layer ─── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6 pb-16">
          <AnimatePresence mode="wait">
            <motion.div key={sceneIdx} className="flex flex-col items-center text-center gap-1 w-full"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Eyebrow */}
              <motion.p
                custom={0.1} variants={textReveal} initial="initial" animate="animate"
                className="text-[10px] md:text-xs font-bold uppercase tracking-[0.28em] mb-1"
                style={{ color: scene.gold, textShadow: `0 0 18px ${scene.gold}` }}
              >
                {scene.eyebrow}
              </motion.p>

              {/* Title line 1 */}
              <motion.h2
                custom={0.3} variants={textReveal} initial="initial" animate="animate"
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 700,
                  fontSize: 'clamp(2rem, 7vw, 5rem)',
                  color: '#fff',
                  lineHeight: 1.05,
                  textShadow: `0 0 40px ${scene.accent}, 0 4px 0 rgba(0,0,0,0.5)`,
                  WebkitTextStroke: '0.5px rgba(255,255,255,0.2)',
                }}
              >
                {scene.title}
              </motion.h2>

              {/* Title line 2 — script accent */}
              <motion.h2
                custom={0.5} variants={textReveal} initial="initial" animate="animate"
                style={{
                  fontFamily: '"Great Vibes", cursive',
                  fontWeight: 400,
                  fontSize: 'clamp(2.4rem, 8vw, 6rem)',
                  color: scene.accent,
                  lineHeight: 1,
                  textShadow: `0 0 50px ${scene.accent}CC, 0 0 20px ${scene.accent}88`,
                  marginTop: '-4px',
                }}
              >
                {scene.title2}
              </motion.h2>

              {/* Body */}
              {scene.body && (
                <motion.p
                  custom={0.8} variants={textReveal} initial="initial" animate="animate"
                  className="mt-3 px-5 py-1.5 rounded-full text-[11px] md:text-sm font-semibold tracking-wide"
                  style={{
                    fontFamily: '"Outfit", sans-serif',
                    color: 'rgba(255,240,255,0.9)',
                    background: 'rgba(255,255,255,0.08)',
                    border: `1px solid ${scene.accent}44`,
                    backdropFilter: 'blur(8px)',
                    textShadow: '0 1px 6px rgba(0,0,0,0.6)',
                    boxShadow: `0 0 20px ${scene.accent}22`,
                  }}
                >
                  {scene.body}
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ─── Controls bar ─── */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-12"
          style={{ background: 'linear-gradient(to top, rgba(0,0,5,0.85), transparent)' }}
        >
          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full mb-2.5 overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.1)' }}
          >
            <motion.div className="h-full rounded-full"
              style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #C891FF, #FF91C8, #FFD580)' }}
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <motion.button whileTap={{ scale: 0.85 }} whileHover={{ scale: 1.12 }}
              onClick={finished ? play : playing ? pause : play}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white shadow-lg flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #C891FF, #FF91C8)', boxShadow: '0 0 16px rgba(200,145,255,0.4)' }}
            >
              {finished ? <FaRedo className="text-xs"/> : playing ? <FaPause className="text-xs"/> : <FaPlay className="text-xs ml-0.5"/>}
            </motion.button>

            {/* Scene pip dots */}
            <div className="flex gap-1.5 items-center">
              {Array.from({ length: NUM_SCENES }, (_, i) => (
                <div key={i} className="rounded-full transition-all duration-400"
                  style={{
                    width: sceneIdx === i ? '20px' : '6px',
                    height: '6px',
                    background: sceneIdx === i
                      ? 'linear-gradient(90deg, #C891FF, #FF91C8)'
                      : 'rgba(255,255,255,0.22)',
                    boxShadow: sceneIdx === i ? '0 0 8px rgba(200,145,255,0.6)' : 'none',
                  }}
                />
              ))}
            </div>

            <span className="text-white/40 text-[10px] font-mono ml-auto tracking-widest">
              {String(Math.floor(elapsed)).padStart(2,'0')} / {TOTAL}s
            </span>
          </div>
        </div>

        {/* ─── Scene badge ─── */}
        <div className="absolute top-3 left-3 pointer-events-none">
          <div className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest"
            style={{ background: 'rgba(0,0,0,0.5)', color: 'rgba(200,145,255,0.9)', backdropFilter: 'blur(6px)', border: '1px solid rgba(200,145,255,0.2)' }}
          >
            ✦ Scene {sceneIdx + 1} / {NUM_SCENES}
          </div>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            CLOSE BUTTON — ALWAYS ON TOP, ALWAYS ACTIVE
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <motion.button
          whileHover={{ scale: 1.18, rotate: 90, boxShadow: '0 0 24px rgba(255,100,100,0.7)' }}
          whileTap={{ scale: 0.86 }}
          onClick={onClose}
          className="absolute top-3 right-3 z-[200] w-10 h-10 rounded-full flex items-center justify-center text-white font-black"
          style={{
            background: 'linear-gradient(135deg, #FF4D4D 0%, #CC0022 100%)',
            boxShadow: '0 0 0 2px rgba(255,100,100,0.35), 0 4px 20px rgba(200,0,0,0.45)',
          }}
          title="Close (Esc)"
        >
          <FaTimes className="text-sm" />
        </motion.button>

        {/* ─── Initial play prompt ─── */}
        {!playing && !finished && elapsed === 0 && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-6 rounded-[1.75rem]"
            style={{ background: 'rgba(2,1,18,0.75)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            {/* Decorative animated ring */}
            <div className="relative flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
                className="absolute w-32 h-32 rounded-full border border-dashed"
                style={{ borderColor: 'rgba(200,145,255,0.35)' }}
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                className="absolute w-24 h-24 rounded-full border"
                style={{ borderColor: 'rgba(255,145,200,0.25)' }}
              />

              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={play}
                className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl"
                style={{ background: 'linear-gradient(135deg, #C891FF, #FF91C8)', boxShadow: '0 0 40px rgba(200,145,255,0.55)' }}
              >
                <FaPlay className="text-xl ml-1" />
              </motion.button>
            </div>

            <div className="text-center">
              <p className="font-bold text-white text-base tracking-wide" style={{ fontFamily: '"Outfit", sans-serif', textShadow: '0 0 20px rgba(200,145,255,0.6)' }}>
                ✦ Anime Birthday Video ✦
              </p>
              <p className="text-white/40 text-xs mt-1 tracking-widest uppercase">
                30 seconds · 6 scenes · for Priyanka
              </p>
            </div>

            {/* Bouncing sparkle emojis */}
            <div className="flex gap-3">
              {['🌸','✨','🌙','💫','🌸'].map((e, i) => (
                <motion.span key={i} className="text-xl"
                  animate={{ y: [0,-8,0], opacity: [0.5,1,0.5] }}
                  transition={{ repeat: Infinity, delay: i*0.2, duration: 1.4, ease: 'easeInOut' }}
                >
                  {e}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* ─── Finished overlay ─── */}
        {finished && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-5 rounded-[1.75rem]"
            style={{ background: 'rgba(2,1,18,0.78)', backdropFilter: 'blur(4px)' }}
          >
            <div className="flex gap-2 text-4xl">
              {['🌸','✨','👑','💕','🌸'].map((e,i) => (
                <motion.span key={i}
                  animate={{ y:[0,-10,0], rotate:[0,10,-5,0] }}
                  transition={{ repeat:Infinity, delay:i*0.2, duration:1.6 }}
                >{e}</motion.span>
              ))}
            </div>
            <p className="text-white font-bold text-lg tracking-wide"
              style={{ fontFamily:'"Playfair Display",serif', textShadow:'0 0 30px rgba(200,145,255,0.7)' }}
            >
              Happy Birthday, Priyanka! 🎂
            </p>
            <p className="text-white/50 text-xs">Turning 23 — Celebrating 5 years of friendship</p>
            <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.93 }} onClick={play}
              className="flex items-center gap-2 text-white font-bold px-7 py-3 rounded-full text-sm"
              style={{ background: 'linear-gradient(135deg, #C891FF, #FF91C8)', boxShadow: '0 0 24px rgba(200,145,255,0.45)', fontFamily:'"Outfit",sans-serif' }}
            >
              <FaRedo className="text-xs" /> Watch Again
            </motion.button>
          </motion.div>
        )}

      </motion.div>
    </motion.div>
  );
}

