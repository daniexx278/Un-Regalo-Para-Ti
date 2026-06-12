import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AppState, HeartData } from "./types";
import CosmicBackground from "./components/CosmicBackground";
import WelcomeScreen from "./components/WelcomeScreen";
import CongratsScreen from "./components/CongratsScreen";
import GalaxyUniverse from "./components/GalaxyUniverse";
import HeartMessagePanel from "./components/HeartMessagePanel";
import FinalUnlocks from "./components/FinalUnlocks";

// Poetic, romantic heart materials dedicated to congratulating academic achievement
const INITIAL_HEARTS: HeartData[] = [
  {
    id: 1,
    title: "Esfuerzo",
    subtitle: "MENSAJE DEL PRIMER CORAZÓN • COMPROMISO",
    content:
      "Lo primero que quiero reconocer en ti es tu esfuerzo. He visto cómo das lo mejor de ti incluso cuando las cosas se ponen difíciles, cómo sigues adelante cuando el cansancio aparece y cómo dedicas tiempo, energía y compromiso a cada meta que te propones. Admiro profundamente la disciplina con la que enfrentas tus responsabilidades y la determinación que demuestras para cumplir todo aquello que te propones. Este logro no es casualidad; es el resultado de muchas horas de trabajo, constancia y dedicación. Estoy muy orgulloso de todo lo que has conseguido.",
    color: "#ff3b30", // Ruby Red
    coordinateColor: 0xff3b30,
    opened: false,
  },
  {
    id: 2,
    title: "Resiliencia",
    subtitle: "MENSAJE DEL SEGUNDO CORAZÓN • FORTALEZA",
    content:
      "Una de las cosas que más admiro de ti es tu capacidad para levantarte cada vez que la vida te presenta un desafío. A lo largo de este semestre hubo momentos difíciles, situaciones inesperadas y días en los que todo parecía más complicado de lo normal, pero nunca dejaste que eso definiera tu camino. Siempre encontraste la manera de seguir avanzando, aprender de las dificultades y convertir cada obstáculo en una oportunidad para crecer. Tu fortaleza inspira a quienes te rodean y me recuerda cada día la increíble persona que eres.",
    color: "#ff2d55", // Rose Magenta
    coordinateColor: 0xff2d55,
    opened: false,
  },
  {
    id: 3,
    title: "Creatividad",
    subtitle: "MENSAJE DEL TERCER CORAZÓN • PERSPECTIVA",
    content:
      "Me encanta la forma en que ves el mundo. Tienes una capacidad especial para encontrar soluciones diferentes, pensar más allá de lo evidente y aportar ideas nuevas cuando otros solo ven límites. Tu creatividad no solo se refleja en lo que haces, sino también en la manera en que te adaptas a los cambios, aprendes cosas nuevas y transformas los problemas en oportunidades. Admiro mucho esa habilidad de reinventarte constantemente y de aportar siempre una perspectiva única que hace que todo a tu alrededor sea mejor.",
    color: "#f59e0b", // Gold Amber
    coordinateColor: 0xf59e0b,
    opened: false,
  },
  {
    id: 4,
    title: "Liderazgo",
    subtitle: "MENSAJE DEL CUARTO CORAZÓN • INSPIRACIÓN",
    content:
      "Tu liderazgo es algo que admiro profundamente porque nace de tu ejemplo. No necesitas imponer tu voz para inspirar a los demás; lo haces con tus acciones, con tu compromiso y con la forma en que asumes responsabilidades. He visto cómo apoyas a quienes te rodean, cómo ayudas a tu equipo a avanzar y cómo transmites confianza incluso en los momentos más exigentes. Tienes la capacidad de motivar a otros simplemente siendo tú misma, y esa es una de las cualidades más valiosas que una persona puede tener.",
    color: "#9b5de5", // Celestial Violet
    coordinateColor: 0x9b5de5,
    opened: false,
  },
  {
    id: 5,
    title: "Amabilidad",
    subtitle: "MENSAJE DEL QUINTO CORAZÓN • GENEROSIDAD",
    content:
      "Tu amabilidad es una de las características más hermosas que tienes. Siempre estás pendiente de las personas que te rodean, te preocupas por cómo se sienten y buscas la manera de ayudar cuando alguien lo necesita. Tienes una forma muy especial de hacer que los demás se sientan escuchados, valorados y acompañados. Incluso en los momentos en los que tienes muchas responsabilidades, encuentras espacio para brindar una palabra de apoyo o un gesto de cariño. Esa generosidad y consideración hablan de la gran persona que eres.",
    color: "#f43f5e", // Magenta Rose
    coordinateColor: 0xf43f5e,
    opened: false,
  },
  {
    id: 6,
    title: "Amor",
    subtitle: "MENSAJE DEL SEXTO CORAZÓN • SENTIMIENTO",
    content:
      "Si tuviera que elegir una palabra para resumir todo lo que eres, sería amor. Amor por las personas que te importan, por tus sueños, por las metas que persigues y por todo aquello a lo que entregas tu corazón. Tu capacidad para cuidar, apoyar, comprender y estar presente para los demás es algo que me conmueve profundamente. Gracias por compartir tu cariño, tu ternura y tu luz con quienes tenemos la suerte de estar cerca de ti. Eres una persona extraordinaria y quiero que nunca olvides lo orgulloso que estoy de ti y lo mucho que te quiero.",
    color: "#3b82f6", // Midnight Blue
    coordinateColor: 0x3b82f6,
    opened: false,
  },
];

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
  const [hearts, setHearts] = useState<HeartData[]>(INITIAL_HEARTS);
  const [selectedHeartId, setSelectedHeartId] = useState<number | null>(null);

  // Load persistence configurations
  useEffect(() => {
    const saved = localStorage.getItem("regalo_hearts_v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<HeartData>[];
        setHearts((prev) =>
          prev.map((h) => {
            const saveMatch = parsed.find((p) => p.id === h.id);
            return saveMatch ? { ...h, opened: !!saveMatch.opened } : h;
          }),
        );
      } catch (e) {
        console.error("Error reading heart achievements cache data", e);
      }
    }
  }, []);

  const saveToLocal = (updatedHearts: HeartData[]) => {
    const minimalData = updatedHearts.map(({ id, opened }) => ({ id, opened }));
    localStorage.setItem("regalo_hearts_v1", JSON.stringify(minimalData));
  };

  const handleOpenWelcome = () => {
    setAppState(AppState.CONGRATS);
  };

  const handleContinueCongrats = () => {
    setAppState(AppState.UNIVERSE);
  };

  const handleSelectHeart = (id: number) => {
    // Mark as opened
    const updated = hearts.map((h) =>
      h.id === id ? { ...h, opened: true } : h,
    );
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
              isFinalUnlocked={hearts.every((h) => h.opened)}
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
