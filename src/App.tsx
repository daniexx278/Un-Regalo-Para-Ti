import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AppState, HeartData } from './types';
import CosmicBackground from './components/CosmicBackground';
import WelcomeScreen from './components/WelcomeScreen';
import CongratsScreen from './components/CongratsScreen';
import GalaxyUniverse from './components/GalaxyUniverse';
import HeartMessagePanel from './components/HeartMessagePanel';
import FinalUnlocks from './components/FinalUnlocks';

// Poetic, romantic heart materials dedicated to congratulating academic achievement
const INITIAL_HEARTS: HeartData[] = [
  {
    id: 1,
    title: "La Persistencia",
    subtitle: "MENSAJE DEL PRIMER CORAZÓN • COMPROMISO",
    content: "Ver la dedicación que has demostrado en cada entrega de este de semestre me ha fascinado profundamente. Los desvelos constantes, el estudio incansable en las madrugadas y tu devoción por la perfección dieron sus frutos. Me demostraste que no existen barreras capaces de frenar a una mente tan vibrante y dedicada. Estoy sumamente orgullosa de tu perseverancia y de cómo supiste avanzar victoriosa frente a cada reto difícil.",
    color: "#ff3b30", // Ruby Red
    coordinateColor: 0xff3b30,
    opened: false
  },
  {
    id: 2,
    title: "La Resiliencia",
    subtitle: "MENSAJE DEL SEGUNDO CORAZÓN • ENERGÍA",
    content: "Sé que hubo días llenos de agobio, donde el cansancio parecía nublar tu horizonte intelectual y el peso acumulado de las materias complejas se sentía insoportable. Sin embargo, tu valentía y temple brillaron más que nunca. No te rendiste; encontraste en tu interior la fuerza y la gracia para persistir y crear soluciones hermosas. Tu resiliencia admirable es un verdadero testimonio de tu luz.",
    color: "#ff2d55", // Rose Magenta
    coordinateColor: 0xff2d55,
    opened: false
  },
  {
    id: 3,
    title: "La Brillantez",
    subtitle: "MENSAJE DEL TERCER CORAZÓN • GENIALIDAD",
    content: "Para ti, el estudio no es solo un trámite; es un espacio donde plasmas tu talento magnífico y riguroso. Al admirar tus ideas y proyectos, puedo notar tu inmensa, delicada y profunda genialidad. Tienes una intuición asombrosa para resolver rompecabezas complicados de forma elegante y creativa. Tu curiosidad intelectual es una brújula fabulosa que te llevará lejísimos.",
    color: "#f59e0b", // Gold Amber
    coordinateColor: 0xf59e0b,
    opened: false
  },
  {
    id: 4,
    title: "El Apoyo Mutuo",
    subtitle: "MENSAJE DEL CUARTO CORAZÓN • REFUGIO",
    content: "Quiero que nunca olvides que, sin importar cuán exigente se vuelva tu carrera o cuán grandes se sientan los futuros proyectos científicos y académicos, siempre estaré aquí para aplaudir tus victorias y reconfortarte en la fatiga. Tu éxito de hoy es fruto de una disciplina inquebrantable que me inspira profundamente cada día. Estoy y siempre estaré incondicionalmente para ti.",
    color: "#9b5de5", // Celestial Violet
    coordinateColor: 0x9b5de5,
    opened: false
  },
  {
    id: 5,
    title: "Un Porvenir Inmenso",
    subtitle: "MENSAJE DEL QUINTO CORAZÓN • HORIZONTES",
    content: "Este ciclo escolar representaba un gigante temible en la planificación inicial del año, pero tú resultaste ser infinitamente más grande y elocuente que cualquier materia o examen difícil. Al contemplar hoy este logro, me queda claro que no hay meta imposible de conquistar para ti. El universo entero se alinea para iluminar tu brillante y merecido porvenir profesional.",
    color: "#f43f5e", // Magenta Rose
    coordinateColor: 0xf43f5e,
    opened: false
  },
  {
    id: 6,
    title: "Mi Mayor Orgullo",
    subtitle: "MENSAJE DEL SEXTO CORAZÓN • AMOR REAL",
    content: "Ver de cerca tu evolución intelectual y personal durante estos meses me llena el alma de un orgullo incalculable. Te transformas día a día en una versión más sabia, fuerte y brillante de ti misma. Te admiro como la estudiante extraordinaria que eres, y amo tu nobleza infinita. Eres mi estrella preferida en este y cualquier firmamento, y siempre recordaré tu triunfo como la victoria del amor.",
    color: "#3b82f6", // Midnight Blue
    coordinateColor: 0x3b82f6,
    opened: false
  }
];

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
  const [hearts, setHearts] = useState<HeartData[]>(INITIAL_HEARTS);
  const [selectedHeartId, setSelectedHeartId] = useState<number | null>(null);

  // Load persistence configurations
  useEffect(() => {
    const saved = localStorage.getItem('regalo_hearts_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<HeartData>[];
        setHearts((prev) => 
          prev.map((h) => {
            const saveMatch = parsed.find((p) => p.id === h.id);
            return saveMatch ? { ...h, opened: !!saveMatch.opened } : h;
          })
        );
      } catch (e) {
        console.error("Error reading heart achievements cache data", e);
      }
    }
  }, []);

  const saveToLocal = (updatedHearts: HeartData[]) => {
    const minimalData = updatedHearts.map(({ id, opened }) => ({ id, opened }));
    localStorage.setItem('regalo_hearts_v1', JSON.stringify(minimalData));
  };

  const handleOpenWelcome = () => {
    setAppState(AppState.CONGRATS);
  };

  const handleContinueCongrats = () => {
    setAppState(AppState.UNIVERSE);
  };

  const handleSelectHeart = (id: number) => {
    // Mark as opened
    const updated = hearts.map((h) => (h.id === id ? { ...h, opened: true } : h));
    setHearts(updated);
    saveToLocal(updated);

    setSelectedHeartId(id);
    setAppState(AppState.MESSAGE_PANEL);
  };

  const handleBackToUniverse = () => {
    setAppState(AppState.UNIVERSE);
    setSelectedHeartId(null);
  };

  const handleUnlockFinal = () => {
    setAppState(AppState.FINAL_UNLOCK);
  };

  const selectedHeart = hearts.find((h) => h.id === selectedHeartId);

  return (
    <div className="relative w-full min-h-screen text-slate-100 font-sans selection:bg-pink-500/30 selection:text-white antialiased">
      {/* Immersive interactive starry backdrop */}
      <CosmicBackground />

      {/* Screen Routing */}
      <AnimatePresence mode="wait">
        {appState === AppState.WELCOME && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <WelcomeScreen onOpen={handleOpenWelcome} />
          </motion.div>
        )}

        {appState === AppState.CONGRATS && (
          <motion.div
            key="congrats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <CongratsScreen onContinue={handleContinueCongrats} />
          </motion.div>
        )}

        {appState === AppState.UNIVERSE && (
          <motion.div
            key="universe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-screen"
            transition={{ duration: 0.8 }}
          >
            <GalaxyUniverse 
              hearts={hearts}
              onSelectHeart={handleSelectHeart}
              onUnlockFinal={handleUnlockFinal}
              isFinalUnlocked={hearts.every(h => h.opened)}
            />
          </motion.div>
        )}

        {appState === AppState.MESSAGE_PANEL && selectedHeart && (
          <motion.div
            key="message-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <HeartMessagePanel
              heart={selectedHeart}
              onBackToUniverse={handleBackToUniverse}
            />
          </motion.div>
        )}

        {appState === AppState.FINAL_UNLOCK && (
          <motion.div
            key="final-unlock"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          >
            <FinalUnlocks onBackToUniverse={handleBackToUniverse} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
