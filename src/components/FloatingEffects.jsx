import React, { useEffect, useRef } from 'react';

export default function FloatingEffects() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Re-adjust canvas width and height on resize
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
        // Varied soft pink colors
        const colors = [
          'rgba(255, 182, 193, ', // Light Pink
          'rgba(255, 192, 203, ', // Pink
          'rgba(247, 231, 206, ', // Champagne
          'rgba(183, 110, 121, ', // Rose Gold
        ];
        this.colorBase = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX + Math.sin(this.y / 30) * 0.3; // sway sideways
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;

        // Reset if goes off screen
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
        
        // Draw a simple petal path
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-this.size, -this.size / 2, -this.size, this.size, 0, this.size);
        ctx.bezierCurveTo(this.size, this.size, this.size, -this.size / 2, 0, 0);
        
        ctx.fillStyle = this.colorBase + this.opacity + ')';
        ctx.shadowColor = 'rgba(183, 110, 121, 0.1)';
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.restore();
      }
    }

    const petalsCount = Math.min(60, Math.floor((width * height) / 25000));
    const petals = Array.from({ length: petalsCount }, () => new Petal());

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      petals.forEach((petal) => {
        petal.update();
        petal.draw();
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
}
