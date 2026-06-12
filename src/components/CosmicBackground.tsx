import { useEffect, useRef } from 'react';

export default function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Star model
    interface Star {
      x: number;
      y: number;
      size: number;
      twinkleSpeed: number;
      phase: number;
      color: string;
    }

    // Particle model for nebula dust
    interface Dust {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      color: string;
    }

    const stars: Star[] = [];
    const dustParticles: Dust[] = [];

    // Generate stars
    const starColors = [
      'rgba(255, 255, 255, ',
      'rgba(244, 180, 255, ', // Rose
      'rgba(180, 220, 255, ', // Light Blue
      'rgba(255, 240, 200, ', // Warm Gold
    ];

    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        phase: Math.random() * Math.PI * 2,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      });
    }

    // Generate ambient dust
    const dustColors = [
      'rgba(168, 85, 247, ', // Purple
      'rgba(236, 72, 153, ', // Pink
      'rgba(59, 130, 246, ',  // Blue
    ];
    for (let i = 0; i < 40; i++) {
      dustParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        radius: Math.random() * 3 + 1,
        alpha: Math.random() * 0.4 + 0.1,
        color: dustColors[Math.floor(Math.random() * dustColors.length)],
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Create nebula-like deep spatial backdrop using canvas gradient helper
      const radialGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        Math.max(width, height)
      );
      radialGrad.addColorStop(0, '#100a2b'); // Cosmic Indigo
      radialGrad.addColorStop(0.5, '#070417'); // Nebula Shadows
      radialGrad.addColorStop(1, '#020108'); // Empty Space Void
      ctx.fillStyle = radialGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw dust particles (gaseous effect)
      dustParticles.forEach((dust) => {
        dust.x += dust.vx;
        dust.y += dust.vy;

        // Wrap boundaries
        if (dust.x < 0) dust.x = width;
        if (dust.x > width) dust.x = 0;
        if (dust.y < 0) dust.y = height;
        if (dust.y > height) dust.y = 0;

        ctx.beginPath();
        const grad = ctx.createRadialGradient(dust.x, dust.y, 0, dust.x, dust.y, dust.radius * 4);
        grad.addColorStop(0, `${dust.color}${dust.alpha})`);
        grad.addColorStop(0.5, `${dust.color}${dust.alpha * 0.3})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = grad;
        ctx.arc(dust.x, dust.y, dust.radius * 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw and animate stars
      stars.forEach((star) => {
        star.phase += star.twinkleSpeed;
        const currentAlpha = 0.2 + (Math.sin(star.phase) + 1) * 0.4;
        ctx.fillStyle = `${star.color}${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Optional tiny cross flare for brighter stars
        if (star.size > 1.6 && currentAlpha > 0.7) {
          ctx.strokeStyle = `${star.color}${currentAlpha * 0.3})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(star.x - 4, star.y);
          ctx.lineTo(star.x + 4, star.y);
          ctx.moveTo(star.x, star.y - 4);
          ctx.lineTo(star.x, star.y + 4);
          ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-20">
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" id="canvas-cobweb" />
      
      {/* Cinematic purple/pink glowing nebulas using raw CSS blurs */}
      <div className="absolute top-1/4 -left-1/4 w-[60vw] h-[60vw] rounded-full bg-purple-900/15 mix-blend-screen filter blur-[120px] animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 -right-1/4 w-[60vw] h-[60vw] rounded-full bg-pink-900/10 mix-blend-screen filter blur-[150px] animate-pulse-slow font-display"></div>
      <div className="absolute top-1/2 left-1/3 w-[40vw] h-[40vw] rounded-full bg-blue-950/20 mix-blend-screen filter blur-[100px] animate-pulse-slow"></div>
    </div>
  );
}
