import { useEffect, useState, useRef } from 'react';

interface Planet {
  id: number;
  position: { x: number; y: number };
}

interface Position {
  x: number;
  y: number;
}

interface ConstellationLinesProps {
  planets: Planet[];
}

export default function ConstellationLines({ planets }: ConstellationLinesProps) {
  const [planetPositions, setPlanetPositions] = useState<Record<number, Position>>({});
  const svgRef = useRef<SVGSVGElement>(null);

  // Definir conexões entre planetas (1→2, 2→3, 3→4)
  const connections = [
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 4 }
  ];

  // Calcular posições reais dos centros dos planetas no DOM
  const calculateRealPositions = () => {
    const newPositions: Record<number, Position> = {};

    planets.forEach(planet => {
      const planetElement = document.querySelector(`[data-planet-id="${planet.id}"]`);
      
      if (planetElement && svgRef.current) {
        const svgRect = svgRef.current.getBoundingClientRect();
        const planetRect = planetElement.getBoundingClientRect();
        
        // Calcular centro do planeta relativo ao SVG (em porcentagem)
        const centerX = ((planetRect.left + planetRect.width / 2 - svgRect.left) / svgRect.width) * 100;
        const centerY = ((planetRect.top + planetRect.height / 2 - svgRect.top) / svgRect.height) * 100;
        
        newPositions[planet.id] = { x: centerX, y: centerY };
      }
    });

    setPlanetPositions(newPositions);
  };

  // Calcular posições após renderização e no resize
  useEffect(() => {
    // Aguardar a renderização completa dos planetas
    const timer = setTimeout(calculateRealPositions, 150);
    
    // Recalcular no resize
    const handleResize = () => {
      setTimeout(calculateRealPositions, 100);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [planets]);

  return (
    <svg 
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <defs>
        {/* Gradiente espacial azul-roxo */}
        <linearGradient id="constellationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#66e0ff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#b16bff" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {connections.map((connection, index) => {
        const startPos = planetPositions[connection.from];
        const endPos = planetPositions[connection.to];
        
        // Só renderizar se ambas as posições existirem
        if (!startPos || !endPos) return null;

        return (
          <line
            key={`${connection.from}-${connection.to}-${index}`}
            x1={`${startPos.x}%`}
            y1={`${startPos.y}%`}
            x2={`${endPos.x}%`}
            y2={`${endPos.y}%`}
            stroke="url(#constellationGradient)"
            strokeWidth="1.5"
            strokeDasharray="4,3"
            strokeLinecap="round"
            className="animate-pulse"
          />
        );
      })}
    </svg>
  );
}