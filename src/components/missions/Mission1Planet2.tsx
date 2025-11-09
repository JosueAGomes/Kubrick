import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  X,
  Check,
  Star,
  AlertCircle,
} from "lucide-react";
import alexImage from "figma:asset/e94e0884cfa8fcb3ee2ce5737d46528dd558fd87.png";
import nexarImage from "figma:asset/48256d705898e62a90d0703ab6dc27b126e5dc88.png";

type Step =
  | "intro1"
  | "intro2"
  | "dialogue"
  | "mission-intro"
  | "phase1-intro"
  | "phase1"
  | "phase2"
  | "completion"
  | "conclusion";

interface Shape {
  id: string;
  type:
    | "equilatero"
    | "isosceles"
    | "escaleno"
    | "retangulo-tri"
    | "quadrado"
    | "retangulo"
    | "losango"
    | "trapezio-isosceles"
    | "trapezio-retangulo"
    | "paralelogramo"
    | "pentagono"
    | "hexagono"
    | "heptagono"
    | "octogono"
    | "circulo"
    | "elipse"
    | "estrela5"
    | "estrela6"
    | "semicirculo";
  points?: string; // SVG polygon points
  shape?: "rect" | "polygon" | "circle" | "ellipse" | "path"; // SVG shape type
  d?: string; // SVG path data for complex shapes
  label: string;
  position: { x: number; y: number }; // Position in grid
}

export default function Mission1Planet2({
  onComplete,
  onExit,
}: {
  onComplete: () => void;
  onExit: () => void;
}) {
  const [step, setStep] = useState<Step>("intro1");
  const [showExitConfirmation, setShowExitConfirmation] =
    useState(false);

  // Phase 1 - Equilateral triangles selection with hover states
  const [selectedEquilateral, setSelectedEquilateral] =
    useState<string[]>([]);
  const [hoveredShape, setHoveredShape] = useState<
    string | null
  >(null);
  const [phase1Complete, setPhase1Complete] = useState(false);
  const [wrongSelections, setWrongSelections] = useState<
    string[]
  >([]);

  // Phase 2 - Isosceles triangles drag and drop
  const [placedIsosceles, setPlacedIsosceles] = useState<{
    [key: string]: string | null; // Changed to store shape ID instead of boolean
  }>({});
  const [phase2Complete, setPhase2Complete] = useState(false);
  const [usedShapeIds, setUsedShapeIds] = useState<string[]>(
    [],
  ); // Track used shapes
  const [wrongDropFeedback, setWrongDropFeedback] = useState<
    string | null
  >(null); // Track wrong drops
  const [showPhase2Success, setShowPhase2Success] =
    useState(false); // Success animation

  // Phase 1 shapes - comprehensive mix of geometric forms
  const phase1Shapes: Shape[] = [
    // Row 1
    {
      id: "eq1",
      type: "equilatero",
      points: "50,15 13,85 87,85",
      label: "Equilátero 1",
      position: { x: 0, y: 0 },
    },
    {
      id: "iso1",
      type: "isosceles",
      points: "50,15 25,85 75,85",
      label: "Isósceles",
      position: { x: 1, y: 0 },
    },
    {
      id: "esc1",
      type: "escaleno",
      points: "50,10 20,90 85,75",
      label: "Escaleno",
      position: { x: 2, y: 0 },
    },
    {
      id: "retTri1",
      type: "retangulo-tri",
      points: "20,20 20,80 80,80",
      label: "Triângulo Retângulo",
      position: { x: 3, y: 0 },
    },
    {
      id: "square1",
      type: "quadrado",
      shape: "rect",
      label: "Quadrado",
      position: { x: 4, y: 0 },
    },
    {
      id: "rect1",
      type: "retangulo",
      shape: "rect",
      label: "Retângulo",
      position: { x: 5, y: 0 },
    },

    // Row 2
    {
      id: "losango1",
      type: "losango",
      points: "50,10 85,50 50,90 15,50",
      label: "Losango",
      position: { x: 0, y: 1 },
    },
    {
      id: "trapIso1",
      type: "trapezio-isosceles",
      points: "25,20 75,20 90,80 10,80",
      label: "Trapézio Isósceles",
      position: { x: 1, y: 1 },
    },
    {
      id: "trapRet1",
      type: "trapezio-retangulo",
      points: "20,20 70,20 80,80 20,80",
      label: "Trapézio Retângulo",
      position: { x: 2, y: 1 },
    },
    {
      id: "paralelo1",
      type: "paralelogramo",
      points: "20,25 70,25 80,75 30,75",
      label: "Paralelogramo",
      position: { x: 3, y: 1 },
    },
    {
      id: "eq2",
      type: "equilatero",
      points: "50,15 13,85 87,85",
      label: "Equilátero 2",
      position: { x: 4, y: 1 },
    },
    {
      id: "pent1",
      type: "pentagono",
      points: "50,10 10,40 25,85 75,85 90,40",
      label: "Pentágono",
      position: { x: 5, y: 1 },
    },

    // Row 3
    {
      id: "hex1",
      type: "hexagono",
      points: "50,10 85,30 85,70 50,90 15,70 15,30",
      label: "Hexágono",
      position: { x: 0, y: 2 },
    },
    {
      id: "hept1",
      type: "heptagono",
      points: "50,8 82,25 92,55 75,85 25,85 8,55 18,25",
      label: "Heptágono",
      position: { x: 1, y: 2 },
    },
    {
      id: "oct1",
      type: "octogono",
      points: "30,10 70,10 90,30 90,70 70,90 30,90 10,70 10,30",
      label: "Octógono",
      position: { x: 2, y: 2 },
    },
    {
      id: "circ1",
      type: "circulo",
      shape: "circle",
      label: "Círculo",
      position: { x: 3, y: 2 },
    },
    {
      id: "elipse1",
      type: "elipse",
      shape: "ellipse",
      label: "Elipse",
      position: { x: 4, y: 2 },
    },
    {
      id: "eq3",
      type: "equilatero",
      points: "50,15 13,85 87,85",
      label: "Equilátero 3",
      position: { x: 5, y: 2 },
    },

    // Row 4
    {
      id: "star5_1",
      type: "estrela5",
      d: "M50,10 L61,38 L90,38 L68,55 L78,85 L50,65 L22,85 L32,55 L10,38 L39,38 Z",
      shape: "path",
      label: "Estrela 5",
      position: { x: 0, y: 3 },
    },
    {
      id: "star6_1",
      type: "estrela6",
      points:
        "50,10 57,35 82,35 62,50 68,75 50,60 32,75 38,50 18,35 43,35",
      label: "Estrela 6",
      position: { x: 1, y: 3 },
    },
    {
      id: "semi1",
      type: "semicirculo",
      d: "M 15,75 A 35,35 0 0,1 85,75 L 85,75 Z",
      shape: "path",
      label: "Semicírculo",
      position: { x: 2, y: 3 },
    },
    {
      id: "iso2",
      type: "isosceles",
      points: "50,15 25,85 75,85",
      label: "Isósceles 2",
      position: { x: 3, y: 3 },
    },
    {
      id: "esc2",
      type: "escaleno",
      points: "30,20 15,85 90,70",
      label: "Escaleno 2",
      position: { x: 4, y: 3 },
    },
    {
      id: "retTri2",
      type: "retangulo-tri",
      points: "25,25 25,75 75,75",
      label: "Triângulo Ret 2",
      position: { x: 5, y: 3 },
    },
  ];

  // Phase 2 draggable shapes - comprehensive mix (similar to Phase 1 but different distribution)
  const phase2DraggableTriangles: Shape[] = [
    // Row 1
    {
      id: "iso-drag1",
      type: "isosceles",
      points: "50,10 20,90 80,90",
      label: "Isósceles 1",
      position: { x: 0, y: 0 },
    },
    {
      id: "eq-drag1",
      type: "equilatero",
      points: "50,10 10,90 90,90",
      label: "Equilátero",
      position: { x: 1, y: 0 },
    },
    {
      id: "esc-drag1",
      type: "escaleno",
      points: "50,15 15,85 85,90",
      label: "Escaleno",
      position: { x: 2, y: 0 },
    },
    {
      id: "retTri-drag1",
      type: "retangulo-tri",
      points: "25,25 25,75 75,75",
      label: "Triângulo Ret",
      position: { x: 3, y: 0 },
    },
    {
      id: "square-drag1",
      type: "quadrado",
      shape: "rect",
      label: "Quadrado",
      position: { x: 4, y: 0 },
    },
    {
      id: "rect-drag1",
      type: "retangulo",
      shape: "rect",
      label: "Retângulo",
      position: { x: 5, y: 0 },
    },

    // Row 2
    {
      id: "losango-drag1",
      type: "losango",
      points: "50,10 85,50 50,90 15,50",
      label: "Losango",
      position: { x: 0, y: 1 },
    },
    {
      id: "trapIso-drag1",
      type: "trapezio-isosceles",
      points: "30,25 70,25 85,75 15,75",
      label: "Trap. Isósceles",
      position: { x: 1, y: 1 },
    },
    {
      id: "iso-drag2",
      type: "isosceles",
      points: "50,10 20,90 80,90",
      label: "Isósceles 2",
      position: { x: 2, y: 1 },
    },
    {
      id: "trapRet-drag1",
      type: "trapezio-retangulo",
      points: "25,25 65,25 75,75 25,75",
      label: "Trap. Retângulo",
      position: { x: 3, y: 1 },
    },
    {
      id: "paralelo-drag1",
      type: "paralelogramo",
      points: "25,30 65,30 75,70 35,70",
      label: "Paralelogramo",
      position: { x: 4, y: 1 },
    },
    {
      id: "pent-drag1",
      type: "pentagono",
      points: "50,10 10,40 25,85 75,85 90,40",
      label: "Pentágono",
      position: { x: 5, y: 1 },
    },

    // Row 3
    {
      id: "hex-drag1",
      type: "hexagono",
      points: "50,10 85,30 85,70 50,90 15,70 15,30",
      label: "Hexágono",
      position: { x: 0, y: 2 },
    },
    {
      id: "hept-drag1",
      type: "heptagono",
      points: "50,8 82,25 92,55 75,85 25,85 8,55 18,25",
      label: "Heptágono",
      position: { x: 1, y: 2 },
    },
    {
      id: "oct-drag1",
      type: "octogono",
      points: "30,10 70,10 90,30 90,70 70,90 30,90 10,70 10,30",
      label: "Octógono",
      position: { x: 2, y: 2 },
    },
    {
      id: "iso-drag3",
      type: "isosceles",
      points: "50,10 20,90 80,90",
      label: "Isósceles 3",
      position: { x: 3, y: 2 },
    },
    {
      id: "circ-drag1",
      type: "circulo",
      shape: "circle",
      label: "Círculo",
      position: { x: 4, y: 2 },
    },
    {
      id: "elipse-drag1",
      type: "elipse",
      shape: "ellipse",
      label: "Elipse",
      position: { x: 5, y: 2 },
    },

    // Row 4
    {
      id: "star5-drag1",
      type: "estrela5",
      d: "M50,10 L61,38 L90,38 L68,55 L78,85 L50,65 L22,85 L32,55 L10,38 L39,38 Z",
      shape: "path",
      label: "Estrela 5",
      position: { x: 0, y: 3 },
    },
    {
      id: "star6-drag1",
      type: "estrela6",
      points:
        "50,10 57,35 82,35 62,50 68,75 50,60 32,75 38,50 18,35 43,35",
      label: "Estrela 6",
      position: { x: 1, y: 3 },
    },
    {
      id: "semi-drag1",
      type: "semicirculo",
      d: "M 15,75 A 35,35 0 0,1 85,75 L 85,75 Z",
      shape: "path",
      label: "Semicírculo",
      position: { x: 2, y: 3 },
    },
    {
      id: "esc-drag2",
      type: "escaleno",
      points: "35,25 20,85 85,75",
      label: "Escaleno 2",
      position: { x: 3, y: 3 },
    },
    {
      id: "eq-drag2",
      type: "equilatero",
      points: "50,15 13,85 87,85",
      label: "Equilátero 2",
      position: { x: 4, y: 3 },
    },
    {
      id: "retTri-drag2",
      type: "retangulo-tri",
      points: "20,20 20,80 80,80",
      label: "Triângulo Ret 2",
      position: { x: 5, y: 3 },
    },
  ];

  // Phase 2 slots - need 3 isosceles triangles
  const phase2Slots = [
    { id: "slot1", expectedType: "isosceles" },
    { id: "slot2", expectedType: "isosceles" },
    { id: "slot3", expectedType: "isosceles" },
  ];

  const handlePhase1Select = (
    triangleId: string,
    type: string,
  ) => {
    const triangle = phase1Shapes.find(
      (t) => t.id === triangleId,
    );
    if (!triangle) return;

    // Check if already selected
    if (selectedEquilateral.includes(triangleId)) {
      setSelectedEquilateral(
        selectedEquilateral.filter((id) => id !== triangleId),
      );
      return;
    }

    // Check if equilateral
    if (triangle.type === "equilatero") {
      const newSelected = [...selectedEquilateral, triangleId];
      setSelectedEquilateral(newSelected);

      // Check if all 3 equilateral are selected
      const correctCount = newSelected.filter((id) => {
        const t = phase1Shapes.find((tri) => tri.id === id);
        return t?.type === "equilatero";
      }).length;

      if (correctCount === 3) {
        setTimeout(() => {
          setPhase1Complete(true);
        }, 500);
      }
    } else {
      // Wrong selection - show feedback then remove
      setSelectedEquilateral([
        ...selectedEquilateral,
        triangleId,
      ]);
      setWrongSelections([...wrongSelections, triangleId]);
      setTimeout(() => {
        setSelectedEquilateral(
          selectedEquilateral.filter((id) => id !== triangleId),
        );
        setWrongSelections(
          wrongSelections.filter((id) => id !== triangleId),
        );
      }, 1000);
    }
  };

  const handlePhase2Drop = (
    draggedTriangleId: string,
    slotId: string,
  ) => {
    const shape = phase2DraggableTriangles.find(
      (t) => t.id === draggedTriangleId,
    );
    if (!shape) return;

    // Check if slot already filled
    if (placedIsosceles[slotId]) return;

    // Check if shape already used
    if (usedShapeIds.includes(draggedTriangleId)) return;

    // Check if shape is isosceles
    if (shape.type === "isosceles") {
      // Correct shape!
      const newPlaced = {
        ...placedIsosceles,
        [slotId]: draggedTriangleId,
      };
      setPlacedIsosceles(newPlaced);
      setUsedShapeIds([...usedShapeIds, draggedTriangleId]);

      // Check if all 3 slots filled
      const filledSlots = Object.values(newPlaced).filter(
        (v) => v !== null,
      ).length;
      if (filledSlots === 3) {
        setShowPhase2Success(true);
        setTimeout(() => {
          setShowPhase2Success(false); // Hide feedback
        }, 2500);
        setTimeout(() => {
          setPhase2Complete(true);
        }, 2000);
      }
    } else {
      // Wrong shape - show feedback
      setWrongDropFeedback(slotId);
      setTimeout(() => {
        setWrongDropFeedback(null);
      }, 1500);
    }
  };

  const handleExit = () => {
    setShowExitConfirmation(true);
  };

  const confirmExit = () => {
    console.log("confirmExit chamado, executando onExit...");
    onExit();
  };

  const cancelExit = () => {
    setShowExitConfirmation(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Exit Button */}
      <div className="absolute top-4 right-4 z-50">
        <Button
          variant="outline"
          className="bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30"
          onClick={handleExit}
        >
          <X className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </div>

      {/* Exit Confirmation Modal */}
      <AnimatePresence>
        {showExitConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={cancelExit}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border-2 border-red-500/50 rounded-2xl p-6 sm:p-8 max-w-md w-full"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-white mb-2 text-xl sm:text-2xl">
                  Deseja realmente sair?
                </h3>
                <p className="text-white/70 mb-6">
                  Todo o progresso desta missão será perdido.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                    onClick={cancelExit}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                    onClick={confirmExit}
                  >
                    Sim, sair
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Intro 1 - Arrival at Nora */}
          {step === "intro1" && (
            <motion.div
              key="intro1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="bg-black/40 backdrop-blur-xl border-blue-500/30">
                <CardContent className="p-6 sm:p-12">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center animate-pulse">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h2 className="text-white text-center mb-6 text-2xl sm:text-3xl">
                    Planeta Nora - Mundo dos Triângulos Perdidos
                  </h2>
                  <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                    A jornada continua. Após reparar a nave,
                    Alex e sua equipe partem rumo ao{" "}
                    <span className="text-cyan-300">
                      Planeta Nora
                    </span>{" "}
                    — um dos mundos mais antigos do Sistema
                    Kubrickiano.
                  </p>
                  <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                    Quando se aproximam, percebem que algo está
                    errado. Nora, antes reluzente, agora parece{" "}
                    <span className="text-red-400">
                      devastado
                    </span>{" "}
                    — crateras, estruturas partidas e fragmentos
                    geométricos espalhados por toda parte.
                  </p>
                  <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
                    <p className="text-white/90 italic text-center text-sm sm:text-base">
                      "O que aconteceu aqui? Este planeta era
                      conhecido por sua beleza e harmonia
                      geométrica..."
                    </p>
                    <p className="text-cyan-300 text-center mt-2 text-xs sm:text-sm">
                      — Alex, observando a devastação
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
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

          {/* Step 2: Intro 2 - Meeting Nexar */}
          {step === "intro2" && (
            <motion.div
              key="intro2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30">
                <CardContent className="p-6 sm:p-12">
                  <div className="flex items-center justify-center mb-6">
                    <motion.img
                      src={nexarImage}
                      alt="Nexar"
                      className="w-32 h-32 object-contain drop-shadow-2xl"
                      animate={{
                        scale: [1, 1.05, 1],
                        filter: [
                          "drop-shadow(0 0 10px rgba(34, 211, 238, 0.5))",
                          "drop-shadow(0 0 20px rgba(34, 211, 238, 0.8))",
                          "drop-shadow(0 0 10px rgba(34, 211, 238, 0.5))",
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                  </div>
                  <h2 className="text-white text-center mb-6 text-2xl sm:text-3xl">
                    O Encontro com Nexar
                  </h2>
                  <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                    Ao pousar, são recebidos por{" "}
                    <span className="text-cyan-300">Nexar</span>
                    , um ser feito de luz azulada e formas
                    triangulares que se movem em harmonia.
                  </p>
                  <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                    Nexar explica que{" "}
                    <span className="text-red-400">
                      Olugan Kryvo
                    </span>{" "}
                    está em busca de um{" "}
                    <span className="text-yellow-300">
                      artefato místico
                    </span>{" "}
                    — uma antiga fonte de poder geométrico capaz
                    de controlar a forma e a estrutura de
                    qualquer matéria.
                  </p>
                  <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
                    <p className="text-white/90 italic text-sm sm:text-base leading-relaxed">
                      "O artefato foi destruído há milênios e
                      seus fragmentos espalhados pelos quatro
                      planetas. O que Kryvo não sabe é que os
                      Nexar conseguiram proteger a{" "}
                      <span className="text-yellow-300">
                        primeira parte
                      </span>{" "}
                      — escondendo-a nas profundezas de uma
                      caverna sagrada."
                    </p>
                    <p className="text-cyan-300 text-right mt-2 text-xs sm:text-sm">
                      — Nexar
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                      size="lg"
                      onClick={() => setStep("dialogue")}
                    >
                      Continuar
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Dialogue between Alex and Nexar */}
          {step === "dialogue" && (
            <motion.div
              key="dialogue"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-5xl mx-auto"
            >
              <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30">
                <CardContent className="p-6 sm:p-12">
                  <h2 className="text-white text-center mb-8 text-2xl sm:text-3xl">
                    Uma Aliança Necessária
                  </h2>

                  {/* Dialogue bubbles */}
                  <div className="space-y-6">
                    {/* Alex speaks */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-start gap-4"
                    >
                      <img
                        src={alexImage}
                        alt="Alex"
                        className="w-16 h-16 sm:w-20 sm:h-20 object-contain flex-shrink-0"
                      />
                      <div className="flex-1 bg-purple-900/40 border border-purple-500/30 rounded-2xl rounded-tl-none p-4 sm:p-6">
                        <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                          Então o artefato foi despedaçado… e se
                          Kryvo reunir todas as partes, ele
                          poderá dominar o Sistema inteiro?
                        </p>
                        <p className="text-purple-300 mt-2 text-xs">
                          — Alex
                        </p>
                      </div>
                    </motion.div>

                    {/* Nexar responds */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                      className="flex items-start gap-4 flex-row-reverse"
                    >
                      <img
                        src={nexarImage}
                        alt="Nexar"
                        className="w-16 h-16 sm:w-20 sm:h-20 object-contain flex-shrink-0"
                      />
                      <div className="flex-1 bg-cyan-900/40 border border-cyan-500/30 rounded-2xl rounded-tr-none p-4 sm:p-6">
                        <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                          Exato. Mas há uma esperança. Se vocês
                          encontrarem os fragmentos antes dele,
                          o equilíbrio poderá ser restaurado.
                        </p>
                        <p className="text-cyan-300 text-right mt-2 text-xs">
                          — Nexar
                        </p>
                      </div>
                    </motion.div>

                    {/* Alex determined */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.0 }}
                      className="flex items-start gap-4"
                    >
                      <img
                        src={alexImage}
                        alt="Alex"
                        className="w-16 h-16 sm:w-20 sm:h-20 object-contain flex-shrink-0"
                      />
                      <div className="flex-1 bg-purple-900/40 border border-purple-500/30 rounded-2xl rounded-tl-none p-4 sm:p-6">
                        <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                          Vamos fazer isso. Mostre-nos o
                          caminho, Nexar!
                        </p>
                        <p className="text-purple-300 mt-2 text-xs">
                          — Alex
                        </p>
                      </div>
                    </motion.div>

                    {/* Nexar gives instruction */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.4 }}
                      className="flex items-start gap-4 flex-row-reverse"
                    >
                      <img
                        src={nexarImage}
                        alt="Nexar"
                        className="w-16 h-16 sm:w-20 sm:h-20 object-contain flex-shrink-0"
                      />
                      <div className="flex-1 bg-cyan-900/40 border border-cyan-500/30 rounded-2xl rounded-tr-none p-4 sm:p-6">
                        <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                          Sigam-me. A entrada da caverna sagrada
                          está protegida por enigmas de
                          triângulos. Somente quem compreende
                          suas propriedades poderá abri-la.
                        </p>
                        <p className="text-cyan-300 text-right mt-2 text-xs">
                          — Nexar
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8 }}
                    className="flex justify-center mt-8"
                  >
                    <Button
                      className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
                      size="lg"
                      onClick={() => setStep("mission-intro")}
                    >
                      Seguir para a Caverna
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 4: Mission Intro */}
          {step === "mission-intro" && (
            <motion.div
              key="mission-intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="bg-black/40 backdrop-blur-xl border-yellow-500/30">
                <CardContent className="p-6 sm:p-12">
                  <div className="flex items-center justify-center mb-6"></div>
                  <h2 className="text-white text-center mb-6 text-2xl sm:text-3xl">
                    Os Triângulos do Artefato
                  </h2>
                  <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                    Nexar conduziu Alex até um{" "}
                    <span className="text-yellow-300">
                      grande altar de pedra
                    </span>
                    . Nele, triângulos de diferentes tamanhos e
                    formas estavam gravados nas paredes,
                    emitindo uma luz intermitente.
                  </p>
                  <div className="bg-gradient-to-r from-yellow-900/40 to-orange-900/40 border border-yellow-500/30 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
                    <p className="text-white/90 italic text-center text-sm sm:text-base leading-relaxed">
                      "Essas figuras são a chave. Precisamos
                      posicionar as formas corretas para
                      destravar o selo e alcançar o artefato."
                    </p>
                    <p className="text-cyan-300 text-center mt-2 text-xs sm:text-sm">
                      — Nexar
                    </p>
                  </div>
                  <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
                    <h3 className="text-cyan-300 mb-3 text-center">
                      Fases da Missão
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-cyan-300">
                            1
                          </span>
                        </div>
                        <p className="text-white/80 text-sm sm:text-base">
                          Identificar os triângulos equiláteros
                          nas ruínas
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-cyan-300">
                            2
                          </span>
                        </div>
                        <p className="text-white/80 text-sm sm:text-base">
                          Posicionar triângulos isósceles no
                          portal selado
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                      size="lg"
                      onClick={() => setStep("phase1-intro")}
                    >
                      Iniciar Fase 1
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Phase 1 Intro */}
          {step === "phase1-intro" && (
            <motion.div
              key="phase1-intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30">
                <CardContent className="p-6 sm:p-12">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h2 className="text-white text-center mb-6 text-2xl sm:text-3xl">
                    Triângulos Equiláteros
                  </h2>
                  <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                    Os triângulos equiláteros são figuras
                    rígidas e estáveis, com todos os lados
                    iguais. Eles são fundamentais em pontes,
                    torres e estruturas espaciais.
                  </p>
                  <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
                    <p className="text-white/90 italic text-center text-sm sm:text-base leading-relaxed">
                      "Identifique os 3 triângulos equiláteros
                      nas ruínas para avançar para a próxima
                      fase."
                    </p>
                    <p className="text-cyan-300 text-center mt-2 text-xs sm:text-sm">
                      — Nexar
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                      size="lg"
                      onClick={() => setStep("phase1")}
                    >
                      Iniciar Fase 1
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Phase 1: Equilateral Triangle Selection */}
          {step === "phase1" && (
            <motion.div
              key="phase1"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-6xl mx-auto"
            >
              <div className="mb-6 text-center">
                <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/50 mb-3">
                  Fase 1 de 2
                </Badge>
                <h2 className="text-white mb-2 text-xl sm:text-2xl">
                  Triângulos Equiláteros
                </h2>
                <p className="text-cyan-200 text-sm sm:text-base">
                  Selecione os 3 triângulos que possuem todos os
                  lados iguais
                </p>
              </div>

              <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30">
                <CardContent className="p-6 sm:p-8">
                  {/* Info box */}
                  <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-cyan-300 mb-1">
                          Dica: Triângulo Equilátero
                        </h4>
                        <p className="text-white/80 text-sm">
                          Possui 3 lados iguais e 3 ângulos
                          iguais (60° cada). É perfeitamente
                          simétrico!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Shapes grid - smaller cards, 6 columns */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3 mb-6">
                    {phase1Shapes.map((shape) => {
                      const isSelected =
                        selectedEquilateral.includes(shape.id);
                      const isCorrect =
                        isSelected &&
                        shape.type === "equilatero";
                      const isWrong =
                        isSelected &&
                        shape.type !== "equilatero";

                      const fillColor = isCorrect
                        ? "rgba(250, 204, 21, 0.3)"
                        : isWrong
                          ? "rgba(248, 113, 113, 0.3)"
                          : "rgba(34, 211, 238, 0.2)";

                      const strokeColor = isCorrect
                        ? "#fbbf24"
                        : isWrong
                          ? "#f87171"
                          : "#22d3ee";

                      return (
                        <motion.div
                          key={shape.id}
                          className={`relative aspect-square bg-slate-800/50 rounded-lg border-2 cursor-pointer transition-all ${
                            isCorrect
                              ? "border-yellow-400 shadow-lg shadow-yellow-400/50"
                              : isWrong
                                ? "border-red-400 shadow-lg shadow-red-400/50"
                                : "border-cyan-500/30 hover:border-cyan-400"
                          }`}
                          onClick={() =>
                            !phase1Complete &&
                            handlePhase1Select(
                              shape.id,
                              shape.type,
                            )
                          }
                          whileHover={
                            !phase1Complete
                              ? { scale: 1.05 }
                              : {}
                          }
                          whileTap={
                            !phase1Complete
                              ? { scale: 0.95 }
                              : {}
                          }
                          onMouseEnter={() =>
                            setHoveredShape(shape.id)
                          }
                          onMouseLeave={() =>
                            setHoveredShape(null)
                          }
                        >
                          <svg
                            viewBox="0 0 100 100"
                            className="w-full h-full p-3"
                          >
                            {/* Polygon shapes (triangles, pentagons, hexagons, etc.) */}
                            {shape.points &&
                              shape.shape !== "path" && (
                                <polygon
                                  points={shape.points}
                                  fill={fillColor}
                                  stroke={strokeColor}
                                  strokeWidth="2"
                                />
                              )}

                            {/* Rect shapes (square, rectangle) */}
                            {shape.shape === "rect" &&
                              shape.type === "quadrado" && (
                                <rect
                                  x="20"
                                  y="20"
                                  width="60"
                                  height="60"
                                  fill={fillColor}
                                  stroke={strokeColor}
                                  strokeWidth="2"
                                />
                              )}
                            {shape.shape === "rect" &&
                              shape.type === "retangulo" && (
                                <rect
                                  x="15"
                                  y="30"
                                  width="70"
                                  height="40"
                                  fill={fillColor}
                                  stroke={strokeColor}
                                  strokeWidth="2"
                                />
                              )}

                            {/* Circle */}
                            {shape.shape === "circle" && (
                              <circle
                                cx="50"
                                cy="50"
                                r="35"
                                fill={fillColor}
                                stroke={strokeColor}
                                strokeWidth="2"
                              />
                            )}

                            {/* Ellipse */}
                            {shape.shape === "ellipse" && (
                              <ellipse
                                cx="50"
                                cy="50"
                                rx="40"
                                ry="25"
                                fill={fillColor}
                                stroke={strokeColor}
                                strokeWidth="2"
                              />
                            )}

                            {/* Path shapes (stars, semicircle) */}
                            {shape.shape === "path" &&
                              shape.d && (
                                <path
                                  d={shape.d}
                                  fill={fillColor}
                                  stroke={strokeColor}
                                  strokeWidth="2"
                                />
                              )}
                          </svg>

                          {/* Feedback icons */}
                          <AnimatePresence>
                            {isCorrect && (
                              <motion.div
                                initial={{
                                  scale: 0,
                                  rotate: -180,
                                }}
                                animate={{
                                  scale: 1,
                                  rotate: 0,
                                }}
                                exit={{ scale: 0 }}
                                className="absolute inset-0 flex items-center justify-center bg-yellow-400/20 rounded-xl"
                              >
                                <Check className="w-12 h-12 text-yellow-400" />
                              </motion.div>
                            )}
                            {isWrong && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{
                                  scale: 1,
                                  rotate: [0, -10, 10, 0],
                                }}
                                exit={{ scale: 0 }}
                                className="absolute inset-0 flex items-center justify-center bg-red-400/20 rounded-xl"
                              >
                                <X className="w-12 h-12 text-red-400" />
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Hover effect */}
                          {hoveredShape === shape.id && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 flex items-center justify-center bg-cyan-500/20 rounded-lg"
                            >
                              <Sparkles className="w-8 h-8 text-cyan-400" />
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Progress indicator */}
                  <div className="text-center">
                    <p className="text-cyan-300 text-sm sm:text-base">
                      Triângulos Equiláteros Selecionados:{" "}
                      {
                        selectedEquilateral.filter((id) => {
                          const t = phase1Shapes.find(
                            (tri) => tri.id === id,
                          );
                          return t?.type === "equilatero";
                        }).length
                      }
                      /3
                    </p>
                  </div>

                  {/* Continue button */}
                  {phase1Complete && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-center mt-6"
                    >
                      <Button
                        className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                        size="lg"
                        onClick={() => setStep("phase2")}
                      >
                        Próxima Fase
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Phase 2: Isosceles Triangle Drag & Drop */}
          {step === "phase2" && (
            <motion.div
              key="phase2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-6xl mx-auto"
            >
              <div className="mb-6 text-center">
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50 mb-3">
                  Fase 2 de 2
                </Badge>
                <h2 className="text-white mb-2 text-xl sm:text-2xl">
                  Portal Selado
                </h2>
                <p className="text-purple-200 text-sm sm:text-base">
                  Arraste 3 triângulos isósceles para os
                  encaixes do portal
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: Portal with slots */}
                <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30">
                  <CardContent className="p-6">
                    <h3 className="text-purple-300 text-center mb-4">
                      Portal Geométrico
                    </h3>

                    {/* Info box */}
                    <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-purple-300 mb-1">
                            Dica: Triângulo Isósceles
                          </h4>
                          <p className="text-white/80 text-sm">
                            Possui 2 lados iguais e os ângulos
                            opostos a esses lados são
                            congruentes.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Portal slots */}
                    <div className="space-y-4">
                      {phase2Slots.map((slot, index) => {
                        const isWrongDrop =
                          wrongDropFeedback === slot.id;

                        return (
                          <div
                            key={slot.id}
                            className={`relative h-32 rounded-xl border-2 border-dashed transition-all ${
                              placedIsosceles[slot.id]
                                ? "border-purple-400 bg-purple-500/20"
                                : isWrongDrop
                                  ? "border-red-400 bg-red-500/20"
                                  : "border-purple-500/50 bg-slate-800/30"
                            }`}
                            onDragOver={(e) =>
                              e.preventDefault()
                            }
                            onDrop={(e) => {
                              e.preventDefault();
                              const triangleId =
                                e.dataTransfer.getData(
                                  "triangleId",
                                );
                              handlePhase2Drop(
                                triangleId,
                                slot.id,
                              );
                            }}
                          >
                            <div className="absolute inset-0 flex items-center justify-center">
                              {placedIsosceles[slot.id] ? (
                                <motion.div
                                  initial={{
                                    scale: 0,
                                    rotate: -180,
                                  }}
                                  animate={{
                                    scale: 1,
                                    rotate: 0,
                                  }}
                                  className="w-full h-full flex items-center justify-center"
                                >
                                  <Check className="w-16 h-16 text-purple-400" />
                                </motion.div>
                              ) : isWrongDrop ? (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{
                                    scale: 1,
                                    rotate: [
                                      0, -10, 10, -10, 10, 0,
                                    ],
                                  }}
                                  transition={{ duration: 0.5 }}
                                  className="w-full h-full flex flex-col items-center justify-center"
                                >
                                  <X className="w-16 h-16 text-red-400 mb-2" />
                                  <p className="text-red-300 text-xs">
                                    Forma incorreta!
                                  </p>
                                </motion.div>
                              ) : (
                                <p className="text-purple-300/50 text-sm">
                                  Encaixe {index + 1}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Progress */}
                    <div className="text-center mt-6">
                      <p className="text-purple-300 text-sm">
                        Encaixes Preenchidos:{" "}
                        {
                          Object.values(placedIsosceles).filter(
                            (v) => v !== null,
                          ).length
                        }
                        /3
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Right: Draggable triangles */}
                <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30">
                  <CardContent className="p-6">
                    <h3 className="text-cyan-300 text-center mb-4">
                      Formas Disponíveis
                    </h3>
                    <p className="text-white/70 text-sm text-center mb-6">
                      Arraste os triângulos corretos
                    </p>

                    {/* Draggable shapes grid - 6 columns, smaller cards */}
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
                      {phase2DraggableTriangles.map((shape) => {
                        const isUsed = usedShapeIds.includes(
                          shape.id,
                        );

                        // Don't render shapes that have been used
                        if (isUsed) {
                          return null;
                        }

                        return (
                          <motion.div
                            key={shape.id}
                            draggable={!phase2Complete}
                            onDragStart={(e: any) => {
                              e.dataTransfer.setData(
                                "triangleId",
                                shape.id,
                              );
                            }}
                            initial={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className={`aspect-square bg-slate-800/50 rounded-lg border-2 border-cyan-500/30 hover:border-cyan-400 cursor-move transition-all ${
                              phase2Complete
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            whileHover={
                              !phase2Complete
                                ? { scale: 1.05 }
                                : {}
                            }
                            whileTap={
                              !phase2Complete
                                ? { scale: 0.95 }
                                : {}
                            }
                          >
                            <svg
                              viewBox="0 0 100 100"
                              className="w-full h-full p-3"
                            >
                              {/* Polygon shapes (triangles, pentagons, hexagons, etc.) */}
                              {shape.points &&
                                shape.shape !== "path" && (
                                  <polygon
                                    points={shape.points}
                                    fill="rgba(34, 211, 238, 0.2)"
                                    stroke="#22d3ee"
                                    strokeWidth="2"
                                  />
                                )}

                              {/* Rect shapes (square, rectangle) */}
                              {shape.shape === "rect" &&
                                shape.type === "quadrado" && (
                                  <rect
                                    x="20"
                                    y="20"
                                    width="60"
                                    height="60"
                                    fill="rgba(34, 211, 238, 0.2)"
                                    stroke="#22d3ee"
                                    strokeWidth="2"
                                  />
                                )}
                              {shape.shape === "rect" &&
                                shape.type === "retangulo" && (
                                  <rect
                                    x="15"
                                    y="30"
                                    width="70"
                                    height="40"
                                    fill="rgba(34, 211, 238, 0.2)"
                                    stroke="#22d3ee"
                                    strokeWidth="2"
                                  />
                                )}

                              {/* Circle */}
                              {shape.shape === "circle" && (
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="35"
                                  fill="rgba(34, 211, 238, 0.2)"
                                  stroke="#22d3ee"
                                  strokeWidth="2"
                                />
                              )}

                              {/* Ellipse */}
                              {shape.shape === "ellipse" && (
                                <ellipse
                                  cx="50"
                                  cy="50"
                                  rx="40"
                                  ry="25"
                                  fill="rgba(34, 211, 238, 0.2)"
                                  stroke="#22d3ee"
                                  strokeWidth="2"
                                />
                              )}

                              {/* Path shapes (stars, semicircle) */}
                              {shape.shape === "path" &&
                                shape.d && (
                                  <path
                                    d={shape.d}
                                    fill="rgba(34, 211, 238, 0.2)"
                                    stroke="#22d3ee"
                                    strokeWidth="2"
                                  />
                                )}
                            </svg>
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Success feedback animation */}
              <AnimatePresence>
                {showPhase2Success && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-md bg-black/50"
                  >
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        duration: 0.5,
                        type: "spring",
                        bounce: 0.4,
                      }}
                      className="relative flex flex-col items-center"
                    >
                      {/* Sparkles rotating circle */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.2, 1] }}
                        transition={{ duration: 0.6 }}
                        className="bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-full p-10 shadow-2xl mb-6"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <Sparkles className="w-20 h-20 text-white" />
                        </motion.div>
                      </motion.div>

                      {/* Success message */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-center space-y-3 px-8"
                      >
                        <motion.h2
                          initial={{ scale: 0.8 }}
                          animate={{ scale: [0.8, 1.1, 1] }}
                          transition={{
                            delay: 0.4,
                            duration: 0.5,
                          }}
                          className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300"
                        >
                          🎉 Parabéns! 🎉
                        </motion.h2>
                        <motion.h3
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          className="text-white text-2xl sm:text-3xl"
                        >
                          Portal Destravado!
                        </motion.h3>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.8 }}
                          className="text-purple-200 text-base sm:text-lg"
                        >
                          Todos os triângulos isósceles foram
                          encontrados!
                        </motion.p>
                      </motion.div>

                      {/* Decorative particles */}
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, x: 0, y: 0 }}
                          animate={{
                            scale: [0, 1, 0],
                            x:
                              Math.cos((i * Math.PI * 2) / 8) *
                              150,
                            y:
                              Math.sin((i * Math.PI * 2) / 8) *
                              150,
                          }}
                          transition={{
                            duration: 1.5,
                            delay: 0.3 + i * 0.1,
                            repeat: Infinity,
                            repeatDelay: 0.5,
                          }}
                          className="absolute top-1/2 left-1/2 w-3 h-3 bg-yellow-400 rounded-full"
                        />
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Continue button */}
              {phase2Complete && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center mt-6"
                >
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    size="lg"
                    onClick={() => setStep("completion")}
                  >
                    Obter o Fragmento
                    <Star className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Completion - Getting the artifact */}
          {step === "completion" && (
            <motion.div
              key="completion"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="bg-black/40 backdrop-blur-xl border-yellow-500/30">
                <CardContent className="p-6 sm:p-12">
                  <motion.div
                    className="flex items-center justify-center mb-6"
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                      <Star className="w-16 h-16 text-white" />
                    </div>
                  </motion.div>

                  <h2 className="text-white text-center mb-6 text-2xl sm:text-3xl">
                    O Fragmento Recuperado!
                  </h2>

                  <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-6">
                    O altar treme e uma luz dourada surge no
                    centro da caverna. Alex estende a mão e
                    retira um{" "}
                    <span className="text-yellow-300">
                      fragmento reluzente
                    </span>{" "}
                    — a primeira parte do artefato geométrico.
                  </p>

                  {/* Dialogue */}
                  <div className="space-y-4 mb-8">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-start gap-4 flex-row-reverse"
                    >
                      <img
                        src={nexarImage}
                        alt="Nexar"
                        className="w-16 h-16 object-contain flex-shrink-0"
                      />
                      <div className="flex-1 bg-cyan-900/40 border border-cyan-500/30 rounded-2xl rounded-tr-none p-4">
                        <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                          Vocês provaram que ainda há sabedoria
                          entre as estrelas. Leve este
                          fragmento… e continuem sua busca.
                        </p>
                        <p className="text-cyan-300 text-right mt-2 text-xs">
                          — Nexar
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                      className="flex items-start gap-4"
                    >
                      <img
                        src={alexImage}
                        alt="Alex"
                        className="w-16 h-16 object-contain flex-shrink-0"
                      />
                      <div className="flex-1 bg-purple-900/40 border border-purple-500/30 rounded-2xl rounded-tl-none p-4">
                        <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                          Conseguimos! Este é apenas o começo.
                          Vamos seguir para o próximo planeta
                          antes que Olugan Kryvo nos alcance.
                        </p>
                        <p className="text-purple-300 mt-2 text-xs">
                          — Alex
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Rewards */}
                  <div className="bg-gradient-to-r from-yellow-900/40 to-orange-900/40 border border-yellow-500/30 rounded-lg p-6 mb-6">
                    <h3 className="text-yellow-300 text-center mb-4">
                      Recompensas Obtidas
                    </h3>
                    <div className="flex justify-center gap-8">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Star className="w-8 h-8 text-yellow-400" />
                        </div>
                        <p className="text-white">+150 XP</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Sparkles className="w-8 h-8 text-purple-400" />
                        </div>
                        <p className="text-white">
                          1º Fragmento
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button
                      className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                      size="lg"
                      onClick={() => setStep("conclusion")}
                    >
                      Continuar
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Conclusion */}
          {step === "conclusion" && (
            <motion.div
              key="conclusion"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30">
                <CardContent className="p-6 sm:p-12">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  <h2 className="text-white text-center mb-6 text-2xl sm:text-3xl">
                    Aprendizado Conquistado
                  </h2>

                  <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-lg p-6 mb-6">
                    <p className="text-white/90 text-base leading-relaxed mb-4">
                      Alex conclui que os{" "}
                      <span className="text-cyan-300">
                        triângulos
                      </span>{" "}
                      são figuras rígidas e estáveis,
                      fundamentais em pontes, torres e
                      estruturas espaciais.
                    </p>
                    <p className="text-white/90 text-base leading-relaxed">
                      Ela percebe que cada tipo —{" "}
                      <span className="text-yellow-300">
                        equilátero
                      </span>
                      ,{" "}
                      <span className="text-purple-300">
                        isósceles
                      </span>{" "}
                      e{" "}
                      <span className="text-pink-300">
                        escaleno
                      </span>{" "}
                      — possui propriedades únicas, mas todas
                      compartilham o mesmo poder de equilíbrio.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/30 rounded-lg p-6 mb-8">
                    <p className="text-white text-center italic text-lg">
                      "O conhecimento é a verdadeira forma da
                      força. Próximo destino: o Planeta Vector!"
                    </p>
                  </div>

                  <div className="flex justify-center gap-4">
                    <Button
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      onClick={onExit}
                    >
                      Voltar ao Mapa
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                      size="lg"
                      onClick={onComplete}
                    >
                      Missão Concluída
                      <Check className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}