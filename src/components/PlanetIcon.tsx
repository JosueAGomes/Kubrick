import { motion } from 'motion/react';

interface PlanetIconProps {
  planetId: number;
  className?: string;
}

export default function PlanetIcon({ planetId, className = '' }: PlanetIconProps) {
  // Planet 1: Small colorful multi-colored planet
  if (planetId === 1) {
    return (
      <div className={`relative ${className}`}>
        <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden shadow-2xl">
          {/* Colorful stripes */}
          <div className="absolute top-1/4 left-0 right-0 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-70" />
          <div className="absolute top-1/2 left-0 right-0 h-3 bg-gradient-to-r from-pink-400 to-purple-500 opacity-60" />
          <div className="absolute bottom-1/4 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-70" />
          {/* Shine effect */}
          <div className="absolute top-3 left-3 w-8 h-8 bg-white/40 rounded-full blur-md" />
        </div>
      </div>
    );
  }

  // Planet 2: Purple/pink planet with orbital rings
  if (planetId === 2) {
    return (
      <div className={`relative ${className}`}>
        {/* Orbital rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[140%] h-[140%] border-2 border-purple-400/40 rounded-full" style={{ transform: 'rotateX(70deg)' }} />
          <div className="absolute w-[120%] h-[120%] border-2 border-pink-400/30 rounded-full" style={{ transform: 'rotateX(70deg)' }} />
        </div>
        {/* Planet body */}
        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-purple-600 via-fuchsia-500 to-pink-600 shadow-2xl overflow-hidden">
          {/* Surface details */}
          <div className="absolute top-1/4 right-1/4 w-6 h-6 bg-purple-800/40 rounded-full blur-sm" />
          <div className="absolute bottom-1/3 left-1/4 w-8 h-8 bg-pink-800/30 rounded-full blur-md" />
          {/* Shine */}
          <div className="absolute top-4 left-4 w-6 h-6 bg-white/50 rounded-full blur-md" />
        </div>
      </div>
    );
  }

  // Planet 3: Planet with orange rings
  if (planetId === 3) {
    return (
      <div className={`relative ${className}`}>
        {/* Saturn-like rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[160%] h-[60%] border-[6px] border-orange-500/60 rounded-full" style={{ transform: 'rotateX(75deg)' }} />
          <div className="absolute w-[170%] h-[65%] border-[4px] border-yellow-600/40 rounded-full" style={{ transform: 'rotateX(75deg)' }} />
        </div>
        {/* Planet body */}
        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-amber-700 via-orange-600 to-red-700 shadow-2xl overflow-hidden z-10">
          {/* Surface texture */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />
          <div className="absolute top-1/3 left-1/4 w-10 h-10 bg-orange-900/40 rounded-full blur-lg" />
          <div className="absolute bottom-1/4 right-1/3 w-8 h-8 bg-red-900/30 rounded-full blur-md" />
          {/* Shine */}
          <div className="absolute top-3 left-5 w-7 h-7 bg-yellow-200/40 rounded-full blur-md" />
        </div>
      </div>
    );
  }

  // Planet 4: Orange planet with beige rings
  if (planetId === 4) {
    return (
      <div className={`relative ${className}`}>
        {/* Beige/cream rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[150%] h-[55%] border-[5px] border-amber-300/50 rounded-full" style={{ transform: 'rotateX(70deg)' }} />
          <div className="absolute w-[160%] h-[60%] border-[3px] border-yellow-200/30 rounded-full" style={{ transform: 'rotateX(70deg)' }} />
        </div>
        {/* Planet body */}
        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-orange-500 via-orange-600 to-amber-700 shadow-2xl overflow-hidden z-10">
          {/* Surface bands */}
          <div className="absolute top-1/4 left-0 right-0 h-3 bg-gradient-to-r from-orange-700/60 to-amber-800/60" />
          <div className="absolute bottom-1/3 left-0 right-0 h-2 bg-gradient-to-r from-yellow-700/40 to-orange-800/40" />
          {/* Storm spot */}
          <div className="absolute top-1/2 right-1/4 w-6 h-6 bg-red-600/50 rounded-full blur-sm" />
          {/* Shine */}
          <div className="absolute top-4 left-6 w-8 h-8 bg-yellow-100/40 rounded-full blur-md" />
        </div>
      </div>
    );
  }

  return null;
}
