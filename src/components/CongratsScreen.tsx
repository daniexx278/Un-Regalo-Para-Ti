import { useEffect } from "react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import { Sparkles, Compass } from "lucide-react";
import FireworksCanvas from "./FireworksCanvas";

interface CongratsScreenProps {
  onContinue: () => void;
}

export default function CongratsScreen({ onContinue }: CongratsScreenProps) {
  useEffect(() => {
    // Fire beautiful celebratory confetti on mount
    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // Confetti coming from different angles
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() * 0.5 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() * 0.5 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.6,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, ease: "easeOut" },
    },
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Immersive Fireworks rendering on top of CosmicBackground */}
      <FireworksCanvas autoLaunch={true} intensity="high" />

      {/* Main Glass Header Panel Layered over fireworks */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="z-25 p-6 md:p-14 max-w-2xl w-full rounded-3xl glass-panel text-center flex flex-col items-center shadow-[0_0_50px_rgba(139,92,246,0.1)] relative border border-purple-500/10 pointer-events-none"
      >
        <div className="absolute -top-12 px-6 py-2 rounded-full border border-pink-500/40 bg-[#160e33]/90 text-pink-400 font-display text-sm tracking-[0.25em] shadow-[0_4px_20px_rgba(236,72,153,0.25)] flex items-gap-2 items-center uppercase">
          <Sparkles
            size={14}
            className="animate-pulse mr-1 filter drop-shadow-[0_0_4px_#ec4899]"
          />
          Momento Especial
          <Sparkles
            size={14}
            className="animate-pulse ml-1 filter drop-shadow-[0_0_4px_#ec4899]"
          />
        </div>

        <motion.h2
          variants={itemVariants}
          className="font-display text-5xl md:text-6xl font-black tracking-widest text-[#f59e0b] text-glow-gold filter drop-shadow-[0_4px_12px_rgba(234,179,8,0.3)] mt-4 mb-2 uppercase"
          id="congrats-header"
        >
          Felicidades 🎉
        </motion.h2>

        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent my-4"></div>

        <motion.p
          variants={itemVariants}
          className="font-display text-xl md:text-2xl text-purple-100 tracking-wider font-semibold mb-3 italic"
        >
          "Lo has hecho muy bien"
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="text-pink-300 md:text-lg tracking-wide max-w-md font-sans mb-3 text-glow-pink drop-shadow-sm font-medium leading-relaxed"
        >
          Superaste uno de los semestres más difíciles de tu carrera académica.
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="text-purple-200 mt-2 text-base md:text-lg font-light tracking-wide max-w-sm"
        >
          Estoy muy orgulloso de ti ❤️
        </motion.p>

        <div className="h-10"></div>

        {/* Action Button to Travel into the 3D Space */}
        <motion.div variants={itemVariants} className="pointer-events-auto">
          <motion.button
            onClick={onContinue}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 rounded-full font-display font-medium text-sm md:text-base tracking-widest text-white hover:text-amber-100 bg-gradient-to-r from-pink-600 via-purple-700 to-indigo-800 cursor-pointer overflow-hidden border border-pink-400/20 shadow-[0_0_20px_rgba(236,72,153,0.3)] group flex items-center gap-2"
            id="btn-navigate-universe"
          >
            <span>ENTRAR AL UNIVERSO</span>
            <Compass
              size={18}
              className="text-pink-400 group-hover:rotate-45 transition-transform duration-500"
            />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Touch Screen Hint */}
      <div className="absolute bottom-6 font-display text-xs text-purple-400/40 tracking-[0.2em] pointer-events-none text-center max-w-xs px-4">
        Haz clic en cualquier parte de la galaxia para lanzar fuegos
        artificiales adicionales
      </div>
    </div>
  );
}
