import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ArrowLeft, CloudRain, Star, Sparkles } from 'lucide-react';
import { HeartData } from '../types';

interface HeartMessagePanelProps {
  heart: HeartData;
  onBackToUniverse: () => void;
}

export default function HeartMessagePanel({ heart, onBackToUniverse }: HeartMessagePanelProps) {
  const [petals, setPetals] = useState<{ id: number; left: number; size: number; delay: number; duration: number }[]>([]);
  const [sparkles, setSparkles] = useState<{ id: number; left: number; top: number; size: number }[]>([]);

  useEffect(() => {
    // Generate beautiful randomized falling petals
    const tempPetals = Array.from({ length: 22 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // % width
      size: Math.random() * 18 + 8, // px size
      delay: Math.random() * 8, // seconds
      duration: Math.random() * 6 + 6, // speed of falling
    }));
    setPetals(tempPetals);

    // Dynamic glowing sparkles on the backdrop
    const tempSparkles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 90 + 5,
      top: Math.random() * 80 + 10,
      size: Math.random() * 3 + 1,
    }));
    setSparkles(tempSparkles);
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-center p-4 py-12 md:py-6">
      
      {/* Falling romantic petals layer (utilizes the petal keyframe in index.css) */}
      <div className="absolute inset-0 pointer-events-none select-none z-10 overflow-hidden">
        {petals.map((p) => (
          <div
            key={p.id}
            className="petal"
            style={{
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size * 1.2}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Sparkling background stars */}
      {sparkles.map((sp) => (
        <motion.div
          key={sp.id}
          className="absolute bg-white rounded-full pointer-events-none -z-10 animate-sparkle"
          style={{
            left: `${sp.left}%`,
            top: `${sp.top}%`,
            width: `${sp.size}px`,
            height: `${sp.size}px`,
            boxShadow: `0 0 ${sp.size * 5}px rgba(234, 179, 8, 0.4)`,
          }}
        />
      ))}

      {/* Main Backwards Navigation Header */}
      <div className="absolute top-6 left-6 z-30 pointer-events-auto">
        <motion.button
          onClick={onBackToUniverse}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full glass-panel text-xs tracking-widest text-purple-200 hover:text-white uppercase font-display cursor-pointer transition-all border border-purple-500/20"
          id={`btn-back-to-universe-top-${heart.id}`}
        >
          <ArrowLeft size={14} className="text-pink-400" />
          Volver al Universo
        </motion.button>
      </div>

      {/* Dynamic Romantic Message Letter Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: -30 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 w-full max-w-2xl rounded-3xl glass-panel p-8 md:p-14 text-center flex flex-col items-center mt-12 md:mt-0 shadow-[0_15px_40px_rgba(15,10,40,0.7)] border border-pink-500/15"
      >
        {/* Heart Logo decorated by surrounding mini stars */}
        <div className="relative mb-6">
          <motion.div
            animate={{ scale: [0.92, 1.08, 0.92] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 rounded-full flex items-center justify-center bg-purple-950/40 border border-pink-500/30 shadow-[0_0_20px_rgba(236,72,153,0.15)]"
          >
            <Heart 
              className="text-pink-500 filter drop-shadow-[0_0_12px_#ec4899] fill-current" 
              size={36} 
              style={{ color: heart.color }}
            />
          </motion.div>
          
          <motion.span 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-1 -right-1 text-yellow-400"
          >
            <Sparkles size={16} />
          </motion.span>
        </div>

        {/* Dynamic Display Title */}
        <h4 className="font-display font-black text-2xl md:text-3xl text-purple-100 tracking-wider uppercase mb-1 drop-shadow-sm">
          {heart.title}
        </h4>
        
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-pink-400/90 font-semibold mb-6">
          {heart.subtitle}
        </p>

        {/* Divider accent line */}
        <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-pink-500 to-transparent mb-8"></div>

        {/* Dynamic text content */}
        <div className="w-full text-left font-sans text-purple-100/90 text-sm md:text-base leading-relaxed space-y-6 max-h-[38vh] overflow-y-auto pr-3 scrollbar-thin">
          <p className="indent-4 tracking-wide text-justify text-purple-200">
            {heart.content}
          </p>
        </div>

        <div className="w-full h-[1px] bg-purple-900/40 my-8"></div>

        {/* Action Button: Volver a la Galaxia */}
        <motion.button
          onClick={onBackToUniverse}
          whileHover={{ scale: 1.05, boxShadow: `0 0 25px rgba(236,72,153,0.4)` }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-3.5 rounded-full font-display font-medium text-xs tracking-widest text-[#f5f3ff] bg-gradient-to-r from-pink-600 via-purple-600 to-purple-800 border-t border-white/10 hover:brightness-110 cursor-pointer shadow-[0_0_15px_rgba(235,53,130,0.2)] transition-all flex items-center gap-2"
          id={`btn-back-to-universe-bottom-${heart.id}`}
        >
          <span>VOLVER AL UNIVERSO</span>
          <ArrowLeft size={13} className="text-pink-400" />
        </motion.button>
      </motion.div>

      {/* Decorative Signature at the bottom */}
      <div className="absolute bottom-4 font-mono text-[9px] text-purple-400/30 tracking-[0.3em] font-light">
        UN LIBRO DE AMOR EN LAS ESTRELLAS
      </div>
    </div>
  );
}
