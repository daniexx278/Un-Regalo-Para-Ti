import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';

interface WelcomeScreenProps {
  onOpen: () => void;
}

export default function WelcomeScreen({ onOpen }: WelcomeScreenProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [ambientHearts, setAmbientHearts] = useState<{ id: number; left: number; top: number; delay: number; scale: number; speed: number }[]>([]);

  useEffect(() => {
    // Generate scattered floating background hearts around center
    const tempHearts = Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      left: 10 + Math.random() * 80, // % width
      top: 20 + Math.random() * 60,  // % height
      delay: Math.random() * 3,
      scale: Math.random() * 0.7 + 0.5,
      speed: Math.random() * 10 + 10,
    }));
    setAmbientHearts(tempHearts);
  }, []);

  const handleStart = () => {
    setIsOpening(true);
    setTimeout(() => {
      onOpen();
    }, 1200); // Allow zoom scale animation to finish
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
      
      {/* Floating orbital ambient hearts */}
      {ambientHearts.map((h) => (
        <motion.div
          key={h.id}
          className="absolute text-pink-500/15 pointer-events-none"
          initial={{ y: 50, opacity: 0, scale: 0 }}
          animate={{
            y: [-30, -180],
            opacity: [0, 0.7, 0],
            scale: h.scale,
          }}
          transition={{
            duration: h.speed,
            repeat: Infinity,
            delay: h.delay,
            ease: "easeInOut",
          }}
          style={{
            left: `${h.left}%`,
            top: `${h.top}%`,
          }}
        >
          <Heart fill="currentColor" size={24} className="filter drop-shadow-[0_0_10px_rgba(236,72,153,0.3)]" />
        </motion.div>
      ))}

      {/* Main Glassmorphic Container with scale up and eventual zoom/fade-out */}
      <motion.div
        className="z-10 p-8 md:p-14 rounded-3xl glass-panel-glow max-w-sm md:max-w-xl text-center flex flex-col items-center mx-4"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ 
          opacity: isOpening ? 0 : 1, 
          y: isOpening ? -40 : 0,
          scale: isOpening ? 1.2 : 1 
        }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      >
        {/* Glowing Decorative Icon */}
        <motion.div
          animate={{ scale: [0.95, 1.05, 0.95], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="bg-purple-950/60 p-4 rounded-full border border-pink-500/30 mb-6 flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.2)]"
        >
          <Heart className="text-pink-500 animate-pulse fill-pink-500 filter drop-shadow-[0_0_8px_#ec4899]" size={42} />
        </motion.div>

        {/* Romantic displaying Header */}
        <h1 
          className="font-display text-4xl md:text-5xl font-bold tracking-wider mb-4 bg-gradient-to-r from-pink-300 via-purple-300 to-amber-200 bg-clip-text text-transparent text-glow-pink"
          id="welcome-title"
        >
          Un Regalo Para Ti
        </h1>

        <div className="w-16 h-[2px] bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400 my-2 rounded-full shadow-[0_0_8px_#ec4899]"></div>

        <p className="text-purple-200/90 tracking-wide text-sm md:text-base font-light max-w-sm mt-3 mb-10 leading-relaxed font-sans">
          Hay algo verdaderamente especial, mágico y brillante esperando por ti.
        </p>

        {/* Elegant glowing call-to-action button */}
        <motion.button
          onClick={handleStart}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          className="relative px-12 py-4 rounded-full font-display font-medium text-lg tracking-widest text-white bg-gradient-to-r from-purple-800 via-purple-600 to-pink-600 cursor-pointer overflow-hidden group button-glow transition-all duration-300 border-t border-pink-300/30"
          id="btn-open-universe"
        >
          {/* Subtle button spotlight effect */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
          
          <span className="flex items-center justify-center gap-2">
            ABRIR 
            <Sparkles size={18} className="text-amber-200 filter drop-shadow-[0_0_5px_rgba(252,211,77,0.8)]" />
          </span>
        </motion.button>
      </motion.div>

      {/* Decorative fine-grained sparkles floating at the bottom */}
      <div className="absolute bottom-4 text-xs font-mono text-purple-400/40 tracking-widest pointer-events-none select-none">
        PARA ALGUIEN INCREÍBLE • 2026
      </div>
    </div>
  );
}
