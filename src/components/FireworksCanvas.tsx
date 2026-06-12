import { useEffect, useRef } from 'react';

interface FireworksProps {
  autoLaunch?: boolean;
  intensity?: 'high' | 'normal' | 'ambient';
}

export default function FireworksCanvas({ autoLaunch = true, intensity = 'normal' }: FireworksProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let animationId: number;

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
      gravity: number;
      resistance: number;
      fade: number;
      size: number;
      sparkleChance: boolean;

      constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        
        // Circular random velocities
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 1.5;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.alpha = 1;
        this.color = color;
        this.gravity = 0.04;
        this.resistance = 0.98; // Air resistance decelerates particles
        this.fade = Math.random() * 0.015 + 0.008;
        this.size = Math.random() * 2 + 1;
        this.sparkleChance = Math.random() > 0.4;
      }

      update() {
        this.vx *= this.resistance;
        this.vy *= this.resistance;
        this.vy += this.gravity;
        
        this.x += this.vx;
        this.y += this.vy;
        
        this.alpha -= this.fade;
      }

      draw(c: CanvasRenderingContext2D) {
        if (this.alpha <= 0) return;
        c.save();
        c.globalAlpha = this.alpha;
        
        // Add glowing tail effects
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        // Optional sparkling flickers for a magical dream-like feel
        if (this.sparkleChance && Math.random() > 0.5) {
          c.fillStyle = '#ffffff';
          c.shadowBlur = 10;
          c.shadowColor = this.color;
        } else {
          c.fillStyle = this.color;
          c.shadowBlur = 5;
          c.shadowColor = this.color;
        }
        
        c.fill();
        c.restore();
      }
    }

    class Firework {
      x: number;
      y: number;
      targetY: number;
      vy: number;
      color: string;
      exploded: boolean;
      particles: Particle[];

      constructor(startX: number, targetHeight: number, color: string) {
        this.x = startX;
        this.y = height;
        this.targetY = targetHeight;
        this.vy = -(Math.random() * 4 + 7);
        this.color = color;
        this.exploded = false;
        this.particles = [];
      }

      update() {
        if (!this.exploded) {
          this.y += this.vy;
          this.vy += 0.05; // Launch deceleration
          if (this.y <= this.targetY || this.vy >= 0) {
            this.explode();
          }
        } else {
          for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.update();
            if (p.alpha <= 0) {
              this.particles.splice(i, 1);
            }
          }
        }
      }

      explode() {
        this.exploded = true;
        const count = intensity === 'high' ? 120 : intensity === 'normal' ? 70 : 35;
        for (let i = 0; i < count; i++) {
          this.particles.push(new Particle(this.x, this.y, this.color));
        }
      }

      draw(c: CanvasRenderingContext2D) {
        if (!this.exploded) {
          // Draw shell trail rocket ascending
          c.save();
          c.fillStyle = this.color;
          c.beginPath();
          c.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
          c.fill();
          
          // Draw simple lingering tail
          c.strokeStyle = 'rgba(255,255,255,0.15)';
          c.lineWidth = 1;
          c.beginPath();
          c.moveTo(this.x, this.y);
          c.lineTo(this.x, this.y - this.vy * 1.5);
          c.stroke();
          c.restore();
        } else {
          this.particles.forEach((p) => p.draw(c));
        }
      }
    }

    const activeFireworks: Firework[] = [];
    const colors = [
      '#ec4899', // Romantic pink
      '#a855f7', // Purple
      '#eab308', // Shiny gold
      '#3b82f6', // Cosmic Blue
      '#f43f5e', // Hot Rose
      '#facc15', // Sunflower Amber
    ];

    const launchBurst = () => {
      const startX = Math.random() * (width - 200) + 100;
      const targetHeight = Math.random() * (height * 0.5) + height * 0.15;
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      activeFireworks.push(new Firework(startX, targetHeight, randomColor));
    };

    let launchTimer = 0;
    const launchInterval = intensity === 'high' ? 25 : intensity === 'normal' ? 60 : 150;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Initial bursts
    if (autoLaunch) {
      const initialBursts = intensity === 'high' ? 5 : 2;
      for (let i = 0; i < initialBursts; i++) {
        setTimeout(launchBurst, i * 400);
      }
    }

    const loop = () => {
      // Clear with soft trails
      ctx.fillStyle = 'rgba(11, 7, 30, 0.2)';
      ctx.fillRect(0, 0, width, height);

      if (autoLaunch) {
        launchTimer++;
        if (launchTimer >= launchInterval) {
          launchBurst();
          launchTimer = 0;
        }
      }

      // Update and Draw Fireworks
      for (let i = activeFireworks.length - 1; i >= 0; i--) {
        const fw = activeFireworks[i];
        fw.update();
        fw.draw(ctx);
        if (fw.exploded && fw.particles.length === 0) {
          activeFireworks.splice(i, 1);
        }
      }

      animationId = requestAnimationFrame(loop);
    };

    loop();

    // Click to shoot custom fireworks interactively
    const handleClick = (e: MouseEvent) => {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      activeFireworks.push(new Firework(e.clientX, e.clientY, randomColor));
    };

    canvas.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (canvas) {
        canvas.removeEventListener('click', handleClick);
      }
      cancelAnimationFrame(animationId);
    };
  }, [intensity, autoLaunch]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 block w-full h-full pointer-events-auto z-10"
      title="¡Haz clic en la pantalla para lanzar más fuegos artificiales!"
    />
  );
}
