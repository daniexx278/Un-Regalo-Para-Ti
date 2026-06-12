import { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Trophy, Star, Heart, Volume2, VolumeX, Flame, Sparkles, Navigation } from 'lucide-react';
import FireworksCanvas from './FireworksCanvas';

interface FinalUnlocksProps {
  onBackToUniverse: () => void;
}

export default function FinalUnlocks({ onBackToUniverse }: FinalUnlocksProps) {
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<number | null>(null);

  // Trigger non-stop cascading celebration confetti
  useEffect(() => {
    const end = Date.now() + (10 * 1000); // 10 seconds of intensive confetti

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#f59e0b', '#ec4899', '#a855f7'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#f59e0b', '#ec4899', '#a855f7'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Spawn a big confetti blast in the center
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });

    return () => {
      // Clean up synth if playing
      stopCelestialMusic();
    };
  }, []);

  // Web Audio Pentatonic Synthesizer Engine
  const startCelestialMusic = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      // Pentatonic Scale in C Major (C, D, E, G, A) - always harmonious!
      const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];

      setIsPlayingMusic(true);

      const playMelody = () => {
        if (!ctx || ctx.state === 'suspended') return;

        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        // Select golden pentatonic chime
        const randomFreq = scale[Math.floor(Math.random() * scale.length)];
        osc.frequency.setValueAtTime(randomFreq, ctx.currentTime);
        
        // Soft chime envelope
        osc.type = 'sine';
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.1); // soft attack
        gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.0); // long decay chime

        osc.start();
        osc.stop(ctx.currentTime + 3.1);
      };

      // Play initial chime
      playMelody();

      // Trigger every 1.5 seconds
      synthIntervalRef.current = window.setInterval(playMelody, 1400);
    } catch (err) {
      console.error("Synthesizer could not start due to browser context restrictions.", err);
    }
  };

  const stopCelestialMusic = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setIsPlayingMusic(false);
  };

  const toggleCelestialMusic = () => {
    if (isPlayingMusic) {
      stopCelestialMusic();
    } else {
      startCelestialMusic();
    }
  };

  const stats = [
    { name: 'Perseverancia', value: '+1000', color: 'from-amber-400 to-yellow-500', desc: 'Por cada desvelada y reto superado.' },
    { name: 'Disciplina', value: '+1000', color: 'from-pink-400 to-pink-600', desc: 'Por tu enfoque impecable y consistencia.' },
    { name: 'Esfuerzo', value: '+1000', color: 'from-purple-400 to-purple-600', desc: 'Por dar el máximo con brillantez.' },
    { name: 'Amor Incondicional', value: '∞ Unidades', color: 'from-red-400 to-rose-600', desc: 'Por siempre estar en mi corazón.', isLove: true },
  ];

  return (
    <div className="relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-center p-4 py-12 md:py-6 bg-[#09051a]">
      {/* Heavy celebration fireworks background */}
      <FireworksCanvas autoLaunch={true} intensity="high" />

      {/* Main Container */}
      <div className="z-20 w-full max-w-3xl rounded-3xl glass-panel-glow p-6 md:p-12 text-center flex flex-col items-center relative border border-yellow-500/30 shadow-[0_0_60px_rgba(234,179,8,0.15)]">
        
        {/* Decorative Stars */}
        <div className="absolute top-4 left-6 text-yellow-400/30 animate-pulse pointer-events-none select-none">
          <Star size={24} fill="currentColor" />
        </div>
        <div className="absolute top-10 right-8 text-yellow-400/30 animate-pulse delay-700 pointer-events-none select-none">
          <Star size={18} fill="currentColor" />
        </div>

        {/* Shiny Trophy Header Icon */}
        <motion.div
          animate={{ 
            rotateY: [0, 360], 
            scale: [0.95, 1.05, 0.95],
            boxShadow: ['0 0 10px rgba(234,179,8,0.2)', '0 0 40px rgba(234,179,8,0.6)', '0 0 10px rgba(234,179,8,0.2)']
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-600/30 to-yellow-500/40 border border-yellow-400/50 flex items-center justify-center mb-6 shadow-xl"
        >
          <Trophy className="text-yellow-400 animate-pulse filter drop-shadow-[0_0_12px_rgba(234,179,8,0.8)]" size={48} />
        </motion.div>

        {/* Celebratory Headers */}
        <h2 className="font-display text-3xl md:text-5xl font-black tracking-widest text-shadow text-yellow-400 text-glow-gold uppercase">
          🏆 LOGRO DESBLOQUEADO
        </h2>
        <h3 className="font-display text-xl md:text-2xl font-bold tracking-[0.2em] text-pink-300 uppercase mt-1 mb-2">
          SEMESTRE SUPERADO
        </h3>

        <div className="w-40 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent my-3"></div>

        <p className="text-purple-200/95 text-xs md:text-sm tracking-wide max-w-xl font-sans mt-2 mb-8 leading-relaxed">
          ¡Lo completaste! Has superado con éxito un semestre lleno de dedicación, intelecto y fortaleza. Abre esta corona y celebra tus estadísticas de nivel superior:
        </p>

        {/* Game Stats Achievements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl text-left mb-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, x: i % 2 === 0 ? -25 : 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.25 + 0.5, duration: 0.8 }}
              className="bg-purple-950/20 backdrop-blur-sm border border-purple-900/30 p-4 rounded-2xl flex items-center gap-4 relative overflow-hidden group hover:border-pink-500/30 transition-all duration-300"
            >
              {/* Stat glow indicator */}
              <div className="absolute top-0 left-0 w-1.5 h-full bg-yellow-400 rounded-l-full"></div>

              <div className="flex-1">
                <span className="font-display font-bold text-slate-300 text-xs tracking-wider uppercase block">
                  {stat.name}
                </span>
                <span className="font-sans text-[10px] text-purple-300/80 leading-tight block mt-0.5">
                  {stat.desc}
                </span>
              </div>
              
              <div className="text-right">
                <span className={`font-display font-black text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r ${stat.color} filter drop-shadow-[0_2px_8px_rgba(245,158,11,0.2)]`}>
                  {stat.value}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Synthesizer Player Controller Widget */}
        <div className="bg-purple-950/45 p-5 rounded-2xl border border-pink-500/20 w-full max-w-md flex flex-col items-center gap-3 mb-8 shadow-inner">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-yellow-400 animate-spin-slow" />
            <span className="font-display text-xs tracking-widest text-purple-200">SINTETIZADOR CELESTIAL</span>
            <Sparkles size={14} className="text-yellow-400 animate-spin-slow" />
          </div>
          <p className="text-[10px] text-purple-300/80 max-w-xs leading-normal">
            Genera acordes cósmicos en tiempo real para ambientar esta magnífica celebración.
          </p>

          <button
            onClick={toggleCelestialMusic}
            className={`px-6 py-2.5 rounded-full font-mono text-xs tracking-widest flex items-center gap-2 cursor-pointer transition-all duration-300 ${
              isPlayingMusic 
                ? 'bg-pink-600 text-white shadow-[0_0_15px_#ec4899]' 
                : 'bg-slate-900 text-pink-300 border border-pink-500/30 hover:bg-pink-950/20'
            }`}
            id="synth-sound-toggle"
          >
            {isPlayingMusic ? (
              <>
                <Volume2 size={13} className="animate-bounce" />
                DENTRO DEL AIRE (DETENER)
              </>
            ) : (
              <>
                <VolumeX size={13} />
                ACTIVAR CHIMES CELESTIALES
              </>
            )}
          </button>
        </div>

        {/* Back to universe navigation button */}
        <motion.button
          onClick={onBackToUniverse}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-3.5 rounded-full font-display font-semibold text-xs tracking-widest text-[#150a31] bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 cursor-pointer shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] border-t border-white/20 transition-all flex items-center gap-2 uppercase"
          id="btn-return-galaxy-final"
        >
          <span>Volver a la Galaxia</span>
          <Navigation size={13} className="rotate-90 fill-[#150a31]" />
        </motion.button>
      </div>

      <div className="absolute bottom-4 font-mono text-[9px] text-purple-400/30 tracking-[0.3em] pointer-events-none uppercase">
        ORGULLOSA DE TI HOY Y SIEMPRE ❤️
      </div>
    </div>
  );
}
