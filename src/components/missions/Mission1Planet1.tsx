import { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  X,
  LogOut,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import alexImage from "figma:asset/e94e0884cfa8fcb3ee2ce5737d46528dd558fd87.png";
import panelBackground from "figma:asset/4283ea53c848d0c519eceb7b182ddee2701ffa65.png";

interface Mission1Planet1Props {
  onComplete: () => void;
  onBack: () => void;
}

interface ShapeType {
  id: string;
  name: string;
  sides: number;
  color: string;
}

const shapes: ShapeType[] = [
  {
    id: "triangle",
    name: "Triângulo",
    sides: 3,
    color: "#3b82f6",
  },
  {
    id: "square",
    name: "Quadrado",
    sides: 4,
    color: "#8b5cf6",
  },
  {
    id: "pentagon",
    name: "Pentágono",
    sides: 5,
    color: "#ec4899",
  },
  {
    id: "hexagon",
    name: "Hexágono",
    sides: 6,
    color: "#f59e0b",
  },
  {
    id: "heptagon",
    name: "Heptágono",
    sides: 7,
    color: "#10b981",
  },
  {
    id: "octagon",
    name: "Octógono",
    sides: 8,
    color: "#ef4444",
  },
];

// Polygon shape generator
const generatePolygonPath = (
  sides: number,
  size: number = 50,
): string => {
  const angle = (2 * Math.PI) / sides;
  const points: string[] = [];

  for (let i = 0; i < sides; i++) {
    const x = size + size * Math.cos(i * angle - Math.PI / 2);
    const y = size + size * Math.sin(i * angle - Math.PI / 2);
    points.push(`${x},${y}`);
  }

  return points.join(" ");
};

// Draggable Shape Component
interface DraggableShapeProps {
  shape: ShapeType;
  isPlaced: boolean;
}

const DraggableShape = ({
  shape,
  isPlaced,
}: DraggableShapeProps) => {
  const [isDragging, setIsDragging] = useState(false);

  if (isPlaced) return null;

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
  ) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        id: shape.id,
        sides: shape.sides,
      }),
    );
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <motion.div
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="cursor-grab active:cursor-grabbing select-none"
      style={{
        opacity: isDragging ? 0.5 : 1,
        touchAction: "none",
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex flex-col items-center space-y-1 sm:space-y-2 p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/20">
        <svg width="60" height="60" viewBox="0 0 100 100" className="sm:w-[70px] sm:h-[70px]">
          <polygon
            points={generatePolygonPath(shape.sides)}
            fill={shape.color}
            opacity="0.9"
            stroke="#00f0ff"
            strokeWidth="2"
          />
        </svg>
        <span className="text-cyan-300 text-xs font-semibold">
          {shape.name}
        </span>
      </div>
    </motion.div>
  );
};

// Drop Slot Component
interface DropSlotProps {
  expectedSides: number;
  onDrop: (sides: number) => void;
  isCorrect: boolean | null;
  shape: ShapeType;
}

const DropSlot = ({
  expectedSides,
  onDrop,
  isCorrect,
  shape,
}: DropSlotProps) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    setIsOver(true);
  };

  const handleDragLeave = (
    e: React.DragEvent<HTMLDivElement>,
  ) => {
    e.preventDefault();
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);

    try {
      const data = e.dataTransfer.getData("text/plain");
      const shapeData = JSON.parse(data);
      onDrop(shapeData.sides);
    } catch (error) {
      console.error("Error parsing drop data:", error);
    }
  };

  const getBorderColor = () => {
    if (isCorrect === true)
      return "border-green-400 shadow-green-400/50";
    if (isCorrect === false)
      return "border-red-400 shadow-red-400/50 animate-pulse";
    if (isOver) return "border-cyan-400 shadow-cyan-400/50";
    return "border-cyan-500/30 shadow-cyan-500/10";
  };

  const getBackgroundColor = () => {
    if (isCorrect === true) return "bg-green-500/10";
    if (isCorrect === false) return "bg-red-500/10";
    if (isOver) return "bg-cyan-500/20";
    return "bg-slate-800/40";
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-lg border-2 ${getBorderColor()} ${getBackgroundColor()} flex items-center justify-center transition-all duration-300 shadow-lg`}
    >
      {isCorrect === null ? (
        <div className="flex flex-col items-center">
          {/* Show outline of expected shape */}
          <svg
            width="80"
            height="80"
            viewBox="0 0 100 100"
            className="opacity-40 sm:w-[100px] sm:h-[100px]"
          >
            <polygon
              points={generatePolygonPath(shape.sides)}
              fill="none"
              stroke="#00f0ff"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          </svg>
          <div className="text-cyan-400/60 text-center text-xs mt-1 hidden sm:block">
            Arraste aqui
          </div>
        </div>
      ) : isCorrect === true ? (
        <div className="flex flex-col items-center relative">
          <svg width="80" height="80" viewBox="0 0 100 100" className="sm:w-[100px] sm:h-[100px]">
            <polygon
              points={generatePolygonPath(shape.sides)}
              fill={shape.color}
              opacity="0.9"
              stroke="#00ff00"
              strokeWidth="2"
            />
          </svg>
          <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 absolute -top-2 -right-2 sm:-top-3 sm:-right-3 drop-shadow-lg" />
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 text-red-400 mb-1 sm:mb-2" />
          <div className="text-red-400 text-center text-xs hidden sm:block">
            Forma incorreta
          </div>
        </div>
      )}
    </div>
  );
};

export default function Mission1Planet1({
  onComplete,
  onBack,
}: Mission1Planet1Props) {
  const [step, setStep] = useState<
    "intro1" | "intro2" | "alex" | "game"
  >("intro1");
  const [placedShapes, setPlacedShapes] = useState<{
    [key: string]: boolean | null;
  }>({
    slot1: null,
    slot2: null,
    slot3: null,
    slot4: null,
    slot5: null,
    slot6: null,
  });
  const [shapesPlaced, setShapesPlaced] = useState<string[]>(
    [],
  );
  const [showExitDialog, setShowExitDialog] = useState(false);

  const slots = [
    { id: "slot1", expectedSides: 3, shape: shapes[0] },
    { id: "slot2", expectedSides: 4, shape: shapes[1] },
    { id: "slot3", expectedSides: 5, shape: shapes[2] },
    { id: "slot4", expectedSides: 6, shape: shapes[3] },
    { id: "slot5", expectedSides: 7, shape: shapes[4] },
    { id: "slot6", expectedSides: 8, shape: shapes[5] },
  ];

  const handleDrop = (
    slotId: string,
    droppedSides: number,
    expectedSides: number,
  ) => {
    const isCorrect = droppedSides === expectedSides;

    setPlacedShapes((prev) => ({
      ...prev,
      [slotId]: isCorrect,
    }));

    if (isCorrect) {
      const shapeId = shapes.find(
        (s) => s.sides === droppedSides,
      )?.id;
      if (shapeId && !shapesPlaced.includes(shapeId)) {
        setShapesPlaced((prev) => [...prev, shapeId]);
      }
    } else {
      // Reset after 1 second if incorrect
      setTimeout(() => {
        setPlacedShapes((prev) => ({
          ...prev,
          [slotId]: null,
        }));
      }, 1000);
    }
  };

  const allCorrect = Object.values(placedShapes).every(
    (v) => v === true,
  );

  const handleComplete = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Exit Button - Top Right */}
      <motion.div
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          variant="outline"
          size="sm"
          className="border-red-500/50 bg-red-900/20 text-white hover:bg-red-900/40 hover:border-red-500"
          onClick={() => setShowExitDialog(true)}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </motion.div>

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent className="bg-slate-900 border-purple-500/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Você deseja realmente sair?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Seu progresso será perdido e você voltará ao mapa de missões.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={onBack}
            >
              Sim, sair
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <AnimatePresence mode="wait">
          {/* Step 1: Introduction */}
          {step === "intro1" && (
            <motion.div
              key="intro1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30">
                <CardContent className="p-6 sm:p-12">
                  <div className="flex items-center justify-center mb-6">
                    <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400" />
                  </div>
                  <h2 className="text-white text-center mb-6 text-2xl sm:text-3xl">
                    O Despertar da Jornada
                  </h2>
                  <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                    <span className="text-purple-300">
                      Ano 3500.
                    </span>{" "}
                    A astronauta Alex embarca em sua primeira
                    missão espacial: explorar novos planetas em
                    busca de vida inteligente. Ao lado de sua
                    equipe, parte cheia de esperança — mas tudo
                    muda quando uma falha misteriosa faz com que
                    percam o controle da nave.
                  </p>
                  <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                    Uma vibração percorre o casco metálico… e
                    uma imensa nave alienígena surge,
                    acoplando-se à deles. As portas se abrem e
                    seres luminosos fazem o primeiro contato —
                    não por palavras, mas por{" "}
                    <span className="text-purple-300">
                      telepatia
                    </span>
                    .
                  </p>
                  <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
                    <p className="text-white/90 italic text-center text-sm sm:text-base">
                      "Somos os habitantes de{" "}
                      <span className="text-purple-300">
                        Kubrick
                      </span>
                      , um planeta que outrora foi o centro do
                      conhecimento geométrico do universo. Mas
                      agora,{" "}
                      <span className="text-red-400">
                        Olugan Kryvo
                      </span>
                      , o Mestre das Formas e dos Ângulos,
                      ameaça destruir tudo. Apenas aqueles que
                      dominarem os segredos da geometria poderão
                      restaurar o equilíbrio e salvar nosso
                      mundo."
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      size="lg"
                      onClick={() => setStep("intro2")}
                    >
                      Continuar
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Continuation - Removed Back Button */}
          {step === "intro2" && (
            <motion.div
              key="intro2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30">
                <CardContent className="p-6 sm:p-12">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                    </div>
                  </div>
                  <h2 className="text-white text-center mb-6 text-2xl sm:text-3xl">
                    A Jornada Começa
                  </h2>
                  <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                    Assim começa a jornada de Alex e sua
                    tripulação. Eles agora precisam viajar entre
                    os planetas do{" "}
                    <span className="text-purple-300">
                      Sistema Kubrickiano
                    </span>
                    , onde o conhecimento matemático é a arma
                    mais poderosa — e o erro pode significar a
                    queda em abismos, armadilhas e plataformas
                    instáveis.
                  </p>
                  <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/30 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
                    <p className="text-white text-center text-sm sm:text-base">
                      💫 A geometria é a chave para salvar o
                      universo 💫
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      size="lg"
                      onClick={() => setStep("alex")}
                    >
                      Conhecer Alex
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Alex Introduction */}
          {step === "alex" && (
            <motion.div
              key="alex"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-5xl mx-auto"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Alex Image */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-center"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-500 blur-3xl opacity-30 rounded-full"></div>
                    <img
                      src={alexImage}
                      alt="Alex - Astronauta"
                      className="relative w-64 sm:w-80 h-auto object-contain drop-shadow-2xl"
                    />
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 px-4 sm:px-6 py-2 rounded-full">
                      <p className="text-white text-sm sm:text-base">
                        Alex - Astronauta
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Thought Bubble */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center"
                >
                  <div className="relative">
                    {/* Bubble tail - hidden on mobile */}
                    <div className="absolute -left-8 top-1/2 -translate-y-1/2 z-0 hidden lg:block">
                      <div className="w-6 h-6 bg-white rounded-full"></div>
                      <div className="w-4 h-4 bg-white rounded-full ml-2 mt-2"></div>
                      <div className="w-2 h-2 bg-white rounded-full ml-3 mt-2"></div>
                    </div>

                    <Card className="bg-white border-4 border-purple-500/30 relative z-10">
                      <CardContent className="p-6 sm:p-8">
                        <p className="text-slate-900 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                          Como você sabe, nossa nave sofreu uma
                          pane e o painel principal foi
                          danificado. Para consertar o painel e
                          continuar nossa missão, precisamos{" "}
                          <span className="font-bold text-purple-600">
                            encaixar corretamente as formas
                            geométricas
                          </span>
                          .
                        </p>
                        <p className="text-slate-900 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                          Só assim poderemos seguir em frente,
                          dominar os segredos da geometria e
                          derrotar o vilão{" "}
                          <span className="font-bold text-red-600">
                            Olugan Kryvo
                          </span>{" "}
                          — o Mestre das Formas — restaurando o
                          equilíbrio e salvando nosso mundo.
                        </p>
                        <div className="flex justify-end">
                          <Button
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                            onClick={() => setStep("game")}
                          >
                            Iniciar Reparo
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Game - Control Panel */}
          {step === "game" && (
            <motion.div
              key="game"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-7xl mx-auto"
            >
              {/* Main Game Layout - Side by Side */}
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center justify-center">
                {/* Left Side: Spaceship Control Panel with Title */}
                <div className="relative w-full lg:w-auto flex flex-col lg:ml-32 xl:ml-40">
                  {/* Title Section - Centered with Panel */}
                  <div className="text-center mb-6 sm:mb-8">
                    <h2 className="text-white mb-2 sm:mb-3 text-xl sm:text-2xl md:text-3xl">
                      Painel de Controle da Nave
                    </h2>
                    <p className="text-cyan-200 text-sm sm:text-base">
                      Arraste as formas geométricas para os encaixes
                      corretos no painel
                    </p>
                  </div>

                  {/* Panel */}
                  <div className="flex justify-center">
                    {/* Panel Background Image */}
                    <div
                      className="relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 sm:border-4 border-cyan-500/30 shadow-2xl shadow-cyan-500/20 w-full max-w-3xl"
                      style={{
                        backgroundImage: `url(${panelBackground})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {/* Dark overlay for better visibility */}
                      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900/80"></div>

                      {/* Panel Content */}
                      <div className="relative p-4 sm:p-8 md:p-12">
                        {/* Warning Lights */}
                        <div className="flex justify-center gap-2 sm:gap-4 mb-4 sm:mb-8">
                          {[1, 2, 3, 4, 5, 6].map((i) => (
                            <motion.div
                              key={i}
                              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                                placedShapes[`slot${i}`] === true
                                  ? "bg-green-400"
                                  : "bg-red-500"
                              }`}
                              animate={{
                                opacity:
                                  placedShapes[`slot${i}`] === true
                                    ? 1
                                    : [0.3, 1, 0.3],
                                boxShadow:
                                  placedShapes[`slot${i}`] === true
                                    ? "0 0 10px #4ade80"
                                    : "0 0 10px #ef4444",
                              }}
                              transition={{
                                duration: 1,
                                repeat:
                                  placedShapes[`slot${i}`] === true
                                    ? 0
                                    : Infinity,
                              }}
                            />
                          ))}
                        </div>

                        {/* Main Panel Title */}
                        <div className="text-center mb-4 sm:mb-6">
                          <div className="inline-block px-3 sm:px-6 py-1 sm:py-2 bg-cyan-500/20 border border-cyan-400/50 rounded-lg">
                            <h3 className="text-cyan-300 tracking-wider text-xs sm:text-sm md:text-base">
                              SISTEMA DE ENCAIXE GEOMÉTRICO
                            </h3>
                          </div>
                        </div>

                        {/* Control Panel Grid */}
                        <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-8 md:p-10 border border-cyan-500/30 sm:border-2 shadow-inner">
                          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
                            {slots.map((slot) => (
                              <div
                                key={slot.id}
                                className="flex justify-center"
                              >
                                <DropSlot
                                  expectedSides={slot.expectedSides}
                                  onDrop={(sides) =>
                                    handleDrop(
                                      slot.id,
                                      sides,
                                      slot.expectedSides,
                                    )
                                  }
                                  isCorrect={placedShapes[slot.id]}
                                  shape={slot.shape}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Status Display */}
                        <div className="text-center mt-4 sm:mt-6">
                          <div className="inline-block px-3 sm:px-4 py-1 sm:py-2 bg-slate-800/60 border border-cyan-500/30 rounded-lg">
                            <p className="text-cyan-300 text-xs sm:text-sm">
                              Peças Encaixadas:{" "}
                              {shapesPlaced.length}/6
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Available Shapes - Centered Vertically */}
                <div className="flex items-center lg:mt-16 xl:mt-20">
                  <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30 w-full lg:w-64 xl:w-80">
                    <CardContent className="p-4 sm:p-6">
                      <div className="text-center mb-4">
                        <h3 className="text-cyan-300 mb-2 text-sm sm:text-base">
                          Formas Disponíveis
                        </h3>
                        <p className="text-cyan-400/60 text-xs">
                          Arraste para o painel
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        {shapes.map((shape) => (
                          <div
                            key={shape.id}
                            className="flex justify-center"
                          >
                            <DraggableShape
                              shape={shape}
                              isPlaced={shapesPlaced.includes(
                                shape.id,
                              )}
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Completion Overlay - Blur Background */}
      <AnimatePresence>
        {allCorrect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backdropFilter: "blur(10px)", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-2xl"
            >
              <Card className="bg-gradient-to-r from-green-900/90 to-emerald-900/90 border-green-500/50 border-4 backdrop-blur-xl">
                <CardContent className="p-6 sm:p-8 md:p-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{ delay: 0.2, type: "spring", duration: 0.8 }}
                  >
                    <CheckCircle2 className="w-16 h-16 sm:w-20 sm:h-20 text-green-400 mx-auto mb-4 sm:mb-6 drop-shadow-2xl" />
                  </motion.div>
                  <h3 className="text-white text-center mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl">
                    🎉 Missão Completa! 🎉
                  </h3>
                  <p className="text-white/90 text-center mb-6 sm:mb-8 text-base sm:text-lg">
                    Parabéns! Você restaurou o painel de
                    controle da nave. Alex e sua equipe
                    podem continuar a jornada!
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                    <Button
                      variant="outline"
                      className="border-cyan-400/50 bg-cyan-900/20 text-cyan-200 hover:bg-cyan-900/40 hover:border-cyan-400"
                      onClick={onBack}
                    >
                      Ver Mapa
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      size="lg"
                      onClick={handleComplete}
                    >
                      Ir para a próxima missão
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}