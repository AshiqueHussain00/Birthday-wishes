import React, { useEffect, useRef, useState } from 'react';

export default function FloatingEffects() {
  const canvasRef = useRef(null);
  const [isMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    // Skip canvas animation entirely on mobile to prevent lag and crashes
    if (isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle class for cherry blossom petals
    class Petal {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * -height;
        this.size = Math.random() * 8 + 6;
        this.speedX = Math.random() * 1.5 - 0.5;
        this.speedY = Math.random() * 1.5 + 1.0;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 0.02 - 0.01;
        this.opacity = Math.random() * 0.4 + 0.3;
        const colors = [
          'rgba(255, 182, 193, ',
          'rgba(255, 192, 203, ',
          'rgba(247, 231, 206, ',
          'rgba(183, 110, 121, ',
        ];
        this.colorBase = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX + Math.sin(this.y / 30) * 0.3;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        if (this.y > height + 20) {
          this.y = -20;
          this.x = Math.random() * width;
          this.speedX = Math.random() * 1.5 - 0.5;
          this.speedY = Math.random() * 1.5 + 1.0;
          this.opacity = Math.random() * 0.4 + 0.3;
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-this.size, -this.size / 2, -this.size, this.size, 0, this.size);
        ctx.bezierCurveTo(this.size, this.size, this.size, -this.size / 2, 0, 0);
        ctx.fillStyle = this.colorBase + this.opacity + ')';
        // NO shadowBlur - this is extremely GPU expensive on mobile
        ctx.fill();
        ctx.restore();
      }
    }

    // Cap at 20 petals for good performance
    const petalsCount = Math.min(20, Math.floor((width * height) / 60000));
    const petals = Array.from({ length: petalsCount }, () => new Petal());

    let lastFrameTime = 0;
    const TARGET_FPS = 30; // Cap at 30fps to save battery & CPU
    const FRAME_INTERVAL = 1000 / TARGET_FPS;

    const render = (timestamp) => {
      animationFrameId = requestAnimationFrame(render);

      // Throttle to 30fps
      const delta = timestamp - lastFrameTime;
      if (delta < FRAME_INTERVAL) return;
      lastFrameTime = timestamp - (delta % FRAME_INTERVAL);

      ctx.clearRect(0, 0, width, height);
      petals.forEach((petal) => {
        petal.update();
        petal.draw();
      });
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  // On mobile, render nothing (pure CSS petals could be added later if needed)
  if (isMobile) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
}
