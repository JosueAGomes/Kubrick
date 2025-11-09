import { Lock, CheckCircle2, Circle, Star, Trophy, User, LogOut, Home, Map } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useUser } from '../contexts/UserContext';
import { motion } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import Mission1Planet1 from './missions/Mission1Planet1';
import Mission1Planet2 from './missions/Mission1Planet2';
import { ImageWithFallback } from './figma/ImageWithFallback';
import ConstellationLines from './ConstellationLines';
import alexImage from 'figma:asset/e94e0884cfa8fcb3ee2ce5737d46528dd558fd87.png';
import lunaImage from 'figma:asset/ba0a2904ecec112bf024ea6e538671a9436702e6.png';
import robotImage from 'figma:asset/d968718c002086b0bde719964755ce6bc6cd6e4c.png';
import alienZyxImage from 'figma:asset/af346811e3c33f3aea4ef5740d6362a49d74acd4.png';
import alienKryvoImage from 'figma:asset/f16b38dcac6395bf5dd60b8a4eda48546c745ab9.png';
import pilotImage from 'figma:asset/e4a81757b3af249f2a402f59195cc71f42a1913c.png';

// Planet icons
import planet1Icon from 'figma:asset/0999e446514585794cee468f8c6e8148c6b65674.png';
import planet2Icon from 'figma:asset/c76863099295ca2397a896cbdd8e4dde3c0009d0.png';
import planet3Icon from 'figma:asset/d9da30bb51fe0e9d5b85380e00fb9fd676b16262.png';
import planet4Icon from 'figma:asset/ae946d45751d193548a6ddd5e4c8239d95510f83.png';

// Avatar options
const avatarOptions = [
  { id: 'astronaut-1', image: alexImage, name: 'Astronauta Alex' },
  { id: 'astronaut-2', image: lunaImage, name: 'Astronauta Luna' },
  { id: 'robot', image: robotImage, name: 'Robô Nexar' },
  { id: 'alien-1', image: alienZyxImage, name: 'Alien Zyx' },
  { id: 'alien-2', image: alienKryvoImage, name: 'Alien Kryvo' },
  { id: 'rocket', image: pilotImage, name: 'Piloto Estelar' },
];

interface KnowledgeMapProps {
  mode?: 'full' | 'overlay';
  onBack: () => void;
  onNavigateToAchievements?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToRanking?: () => void;
}

interface Planet {
  id: number;
  name: string;
  status: 'unlocked' | 'locked' | 'completed';
  color: string;
  glowColor: string;
  position: { x: number; y: number };
  rings?: boolean;
  icon: string;
}

export default function KnowledgeMap({ mode = 'full', onBack, onNavigateToAchievements, onNavigateToProfile, onNavigateToRanking }: KnowledgeMapProps) {
  const { user, logout, completeMission, unlockPlanet } = useUser();
  const [activeMission, setActiveMission] = useState<number | null>(null);

  if (!user) return null;

  // Get current avatar
  const currentAvatar = avatarOptions.find(a => a.id === user?.avatar) || avatarOptions[0];

  // Show mission if active
  if (activeMission === 1) {
    return (
      <Mission1Planet1
        onComplete={() => {
          // Add XP and mark mission complete
          completeMission(100);
          // Unlock Planet 2
          unlockPlanet(2);
          setActiveMission(null);
        }}
        onBack={() => setActiveMission(null)}
      />
    );
  }

  if (activeMission === 2) {
    return (
      <Mission1Planet2
        onComplete={() => {
          // Add XP and mark mission complete
          completeMission(150);
          // Unlock Planet 3
          unlockPlanet(3);
          setActiveMission(null);
        }}
        onExit={() => setActiveMission(null)}
      />
    );
  }

  // Determine planet status based on user progress
  const getPlanetStatus = (planetId: number): 'unlocked' | 'locked' | 'completed' => {
    // Planet 1 is always unlocked
    if (planetId === 1) return 'unlocked';
    
    // Check if planet is in unlocked list (with safety check)
    if (user.unlockedPlanets && user.unlockedPlanets.includes(planetId)) {
      return 'unlocked';
    }
    
    return 'locked';
  };

  const planets: Planet[] = [
    {
      id: 1,
      name: 'Reino da\nGeometria',
      status: getPlanetStatus(1),
      color: 'from-blue-400 via-purple-400 to-pink-400',
      glowColor: 'rgba(147, 51, 234, 0.6)',
      position: { x: 25, y: 50 },
      rings: false,
      icon: planet1Icon
    },
    {
      id: 2,
      name: 'Nora\nTriângulos',
      status: getPlanetStatus(2),
      color: 'from-cyan-400 via-blue-400 to-cyan-600',
      glowColor: 'rgba(34, 211, 238, 0.6)',
      position: { x: 48, y: 25 },
      rings: false,
      icon: planet2Icon
    },
    {
      id: 3,
      name: 'Planeta 3',
      status: getPlanetStatus(3),
      color: 'from-slate-600 to-slate-800',
      glowColor: 'rgba(100, 116, 139, 0.3)',
      position: { x: 55, y: 65 },
      rings: true,
      icon: planet3Icon
    },
    {
      id: 4,
      name: 'Planeta 4',
      status: getPlanetStatus(4),
      color: 'from-indigo-600 to-indigo-800',
      glowColor: 'rgba(99, 102, 241, 0.3)',
      position: { x: 78, y: 40 },
      rings: false,
      icon: planet4Icon
    }
  ];

  const unlockedPlanets = planets.filter(p => p.status === 'unlocked' || p.status === 'completed').length;
  const xpToNextLevel = 1000 - (user.xp % 1000);
  const nextLevel = user.level + 1;
  const progressPercentage = (user.completedMissions / user.totalMissions) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.3,
          delay: Math.random() * 3
        })).map(star => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity
            }}
            animate={{
              opacity: [star.opacity, star.opacity * 0.3, star.opacity],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: star.delay
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white">Kubrick</h1>
                <p className="text-xs text-purple-300">Reino da Geometria</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-6">
              <button 
                onClick={onBack}
                className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Início</span>
              </button>
              <button 
                className="flex items-center space-x-2 text-white hover:text-purple-300 transition-colors"
              >
                <Map className="w-4 h-4" />
                <span>Mapa do Conhecimento</span>
              </button>
              <button 
                onClick={onNavigateToAchievements}
                className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
              >
                <Trophy className="w-4 h-4" />
                <span>Conquistas</span>
              </button>
              <button 
                onClick={onNavigateToRanking}
                className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
              >
                <Star className="w-4 h-4" />
                <span>Classificação</span>
              </button>
            </nav>

            {/* User Info */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-1.5">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-white">{user.xp} XP</span>
              </div>
              <div className="text-xs text-white/70">
                {xpToNextLevel} XP para nível {nextLevel}
              </div>
              <Badge className="bg-purple-600 hover:bg-purple-700">
                Nível {user.level}
              </Badge>
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-1.5">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-white">{user.achievements}</span>
              </div>
              <button 
                onClick={onNavigateToProfile}
                className="flex items-center space-x-3 hover:bg-white/10 rounded-lg px-3 py-1.5 transition-colors"
              >
                <span className="text-white">{user.name}</span>
                <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-white/10">
                  <img src={currentAvatar.image} alt={currentAvatar.name} className="w-full h-full object-cover" />
                </div>
              </button>
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-purple-500/20" onClick={logout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-white/70">Progresso Geral: {user.completedMissions}/{user.totalMissions}</span>
            <span className="text-sm text-white/70">{progressPercentage.toFixed(2)}%</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Back Button - Only show in overlay mode */}
        {mode === 'overlay' && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="ghost"
              className="text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              onClick={onBack}
            >
              <Home className="w-4 h-4 mr-2" />
              Voltar ao Dashboard
            </Button>
          </motion.div>
        )}

        {/* Title */}
        <div className="text-center mb-8">
          <motion.h1
            className="text-white mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Mapa Galáctico do Conhecimento
          </motion.h1>
          <motion.p
            className="text-purple-200"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Explore os planetas de Euklidia e complete suas missões espaciais!
          </motion.p>
        </div>

        {/* Map Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-16">
              <div className="relative h-[600px] rounded-lg bg-gradient-to-br from-purple-900/20 to-slate-900/20 border border-white/5 overflow-hidden">
                {/* Fundo de Universo - Camada 1: Nebulosas e Galáxias */}
                <div className="absolute inset-0" style={{ zIndex: -2 }}>
                  {/* Nebulosa roxa */}
                  <div 
                    className="absolute w-96 h-96 rounded-full blur-3xl opacity-30"
                    style={{
                      background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(168, 85, 247, 0) 70%)',
                      top: '10%',
                      left: '15%',
                      animation: 'pulse 8s ease-in-out infinite'
                    }}
                  />
                  {/* Nebulosa azul */}
                  <div 
                    className="absolute w-80 h-80 rounded-full blur-3xl opacity-25"
                    style={{
                      background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(59, 130, 246, 0) 70%)',
                      top: '50%',
                      right: '10%',
                      animation: 'pulse 10s ease-in-out infinite 2s'
                    }}
                  />
                  {/* Nebulosa rosa */}
                  <div 
                    className="absolute w-72 h-72 rounded-full blur-3xl opacity-20"
                    style={{
                      background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, rgba(236, 72, 153, 0) 70%)',
                      bottom: '15%',
                      left: '40%',
                      animation: 'pulse 12s ease-in-out infinite 4s'
                    }}
                  />
                </div>

                {/* Fundo de Universo - Camada 2: Campo de Estrelas */}
                <div className="absolute inset-0" style={{ zIndex: -1 }}>
                  {/* Estrelas pequenas */}
                  {Array.from({ length: 100 }, (_, i) => {
                    const x = Math.random() * 100;
                    const y = Math.random() * 100;
                    const size = Math.random() * 2 + 0.5;
                    const opacity = Math.random() * 0.8 + 0.2;
                    const delay = Math.random() * 5;
                    
                    return (
                      <div
                        key={`star-${i}`}
                        className="absolute rounded-full bg-white"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          width: `${size}px`,
                          height: `${size}px`,
                          opacity: opacity,
                          animation: `twinkle ${3 + Math.random() * 3}s ease-in-out infinite ${delay}s`
                        }}
                      />
                    );
                  })}
                  
                  {/* Estrelas médias brilhantes */}
                  {Array.from({ length: 20 }, (_, i) => {
                    const x = Math.random() * 100;
                    const y = Math.random() * 100;
                    const size = Math.random() * 3 + 2;
                    const delay = Math.random() * 4;
                    
                    return (
                      <div
                        key={`bright-star-${i}`}
                        className="absolute rounded-full bg-white"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          width: `${size}px`,
                          height: `${size}px`,
                          boxShadow: '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.4)',
                          animation: `twinkle ${2 + Math.random() * 2}s ease-in-out infinite ${delay}s`
                        }}
                      />
                    );
                  })}
                </div>

                {/* Constellation lines background */}
                <ConstellationLines planets={planets} />

                {/* Planets */}
                {planets.map((planet, index) => (
                  <motion.div
                    key={planet.id}
                    data-planet-id={planet.id}
                    className="absolute cursor-pointer group"
                    style={{
                      left: `${planet.position.x}%`,
                      top: `${planet.position.y}%`,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 10
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 0.5 + index * 0.15,
                      type: "spring",
                      stiffness: 200
                    }}
                    whileHover={{ scale: planet.status === 'unlocked' ? 1.1 : 1.05 }}
                    onClick={() => {
                      if (planet.status === 'unlocked') {
                        setActiveMission(planet.id);
                      }
                    }}
                  >
                    {/* Glow Effect */}
                    {planet.status === 'unlocked' && (
                      <motion.div
                        className="absolute inset-0 rounded-full blur-2xl"
                        style={{
                          background: planet.glowColor,
                          width: '140px',
                          height: '140px',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)'
                        }}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    )}

                    {/* Planet with Rings */}
                    <div className="relative">
                      {/* Planet Body - Now using custom planet icon */}
                      <div className={`relative w-28 h-28 ${planet.status === 'locked' ? 'opacity-50 grayscale' : ''}`}>
                        <ImageWithFallback
                          src={planet.icon}
                          alt={`Planet ${planet.id}`}
                          className="w-full h-full"
                        />
                        
                        {/* Lock Icon Overlay */}
                        {planet.status === 'locked' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                            <Lock className="w-10 h-10 text-white/80" />
                          </div>
                        )}

                        {/* Completed Icon Overlay */}
                        {planet.status === 'completed' && (
                          <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                            <CheckCircle2 className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Planet Name */}
                    <div className="text-center mt-3">
                      <p className="text-white text-sm whitespace-pre-line">
                        {planet.name}
                      </p>
                      <p className="text-xs text-white/50 mt-1">
                        {planet.status === 'locked' ? '🔒 Bloqueado' : ''}
                      </p>
                    </div>

                    {/* Orbit Particles for Unlocked Planets */}
                    {planet.status === 'unlocked' && (
                      <>
                        {[0, 120, 240].map((angle) => (
                          <motion.div
                            key={angle}
                            className="absolute w-2 h-2 bg-purple-400 rounded-full"
                            style={{
                              top: '50%',
                              left: '50%'
                            }}
                            animate={{
                              x: [
                                Math.cos((angle * Math.PI) / 180) * 60,
                                Math.cos(((angle + 360) * Math.PI) / 180) * 60
                              ],
                              y: [
                                Math.sin((angle * Math.PI) / 180) * 60,
                                Math.sin(((angle + 360) * Math.PI) / 180) * 60
                              ]
                            }}
                            transition={{
                              duration: 8,
                              repeat: Infinity,
                              ease: "linear"
                            }}
                          />
                        ))}
                      </>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Legend */}
        <motion.div
          className="flex items-center justify-center space-x-8 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="flex items-center space-x-2">
            <Circle className="w-4 h-4 text-blue-400 fill-blue-400" />
            <span className="text-white/70 text-sm">Desbloqueado</span>
          </div>
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-white/50" />
            <span className="text-white/70 text-sm">Bloqueado</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-white/70 text-sm">Completo</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}