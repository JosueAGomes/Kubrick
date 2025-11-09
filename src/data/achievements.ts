import { 
  Trophy, Star, Zap, Target, Rocket, CheckCircle2, 
  Shield, Map, Brain, Flame, Crown, Sparkles, Clock,
  Award, Medal
} from 'lucide-react';

// Achievement Tiers
export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary';

// Achievement Categories
export type AchievementCategory = 'explorer' | 'geometry' | 'speedster' | 'perfectionist' | 'legendary' | 'all';

// Achievement Condition Types
export type AchievementConditionType = 
  | 'missions_completed'
  | 'planets_unlocked'
  | 'xp_earned'
  | 'level_reached'
  | 'perfect_missions'
  | 'fast_completions'
  | 'questions_correct'
  | 'streak_days'
  | 'all_missions_complete';

export interface AchievementCondition {
  type: AchievementConditionType;
  value: number;
  category?: string; // For specific categories like 'angles', 'triangles'
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any; // Lucide icon component
  category: AchievementCategory;
  tier: AchievementTier;
  xpReward: number;
  condition: AchievementCondition;
  secretDescription?: string; // Shows when locked
}

export interface UserAchievement {
  achievementId: string;
  unlockedDate: string;
  progress?: number; // For tracking partial progress
}

// Tier configurations
export const tierConfig = {
  bronze: { 
    color: 'from-orange-600 to-orange-800', 
    bgColor: 'bg-orange-500/20',
    borderColor: 'border-orange-500/30',
    textColor: 'text-orange-400',
    glowColor: 'shadow-orange-500/50',
    label: 'Bronze'
  },
  silver: { 
    color: 'from-slate-400 to-slate-600', 
    bgColor: 'bg-slate-400/20',
    borderColor: 'border-slate-400/30',
    textColor: 'text-slate-300',
    glowColor: 'shadow-slate-400/50',
    label: 'Prata'
  },
  gold: { 
    color: 'from-yellow-500 to-yellow-700', 
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/30',
    textColor: 'text-yellow-400',
    glowColor: 'shadow-yellow-500/50',
    label: 'Ouro'
  },
  platinum: { 
    color: 'from-cyan-400 to-blue-600', 
    bgColor: 'bg-cyan-400/20',
    borderColor: 'border-cyan-400/30',
    textColor: 'text-cyan-400',
    glowColor: 'shadow-cyan-400/50',
    label: 'Platina'
  },
  legendary: { 
    color: 'from-purple-500 via-pink-500 to-purple-500', 
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30',
    textColor: 'text-purple-400',
    glowColor: 'shadow-purple-500/50',
    label: 'Lendário'
  }
};

// All available achievements
export const achievements: Achievement[] = [
  // EXPLORER ACHIEVEMENTS
  {
    id: 'first-journey',
    title: 'Primeira Jornada',
    description: 'Complete sua primeira missão no Reino da Geometria',
    icon: Rocket,
    category: 'explorer',
    tier: 'bronze',
    xpReward: 100,
    condition: { type: 'missions_completed', value: 1 }
  },
  {
    id: 'planet-explorer',
    title: 'Explorador Iniciante',
    description: 'Desbloqueie o Planeta 2',
    icon: Map,
    category: 'explorer',
    tier: 'bronze',
    xpReward: 150,
    condition: { type: 'planets_unlocked', value: 2 }
  },
  {
    id: 'five-missions',
    title: 'Guerreiro Espacial',
    description: 'Complete 5 missões',
    icon: Shield,
    category: 'explorer',
    tier: 'silver',
    xpReward: 250,
    condition: { type: 'missions_completed', value: 5 }
  },
  {
    id: 'planet-conqueror',
    title: 'Conquistador de Planetas',
    description: 'Desbloqueie todos os 4 planetas',
    icon: Star,
    category: 'explorer',
    tier: 'platinum',
    xpReward: 500,
    condition: { type: 'planets_unlocked', value: 4 }
  },
  {
    id: 'ten-missions',
    title: 'Veterano Espacial',
    description: 'Complete 10 missões',
    icon: Medal,
    category: 'explorer',
    tier: 'gold',
    xpReward: 400,
    condition: { type: 'missions_completed', value: 10 }
  },

  // GEOMETRY ACHIEVEMENTS
  {
    id: 'angle-master',
    title: 'Mestre dos Ângulos',
    description: 'Acerte 10 questões sobre ângulos',
    icon: Target,
    category: 'geometry',
    tier: 'silver',
    xpReward: 200,
    condition: { type: 'questions_correct', value: 10, category: 'angles' }
  },
  {
    id: 'triangle-expert',
    title: 'Especialista em Triângulos',
    description: 'Acerte 15 questões sobre triângulos',
    icon: Brain,
    category: 'geometry',
    tier: 'gold',
    xpReward: 400,
    condition: { type: 'questions_correct', value: 15, category: 'triangles' }
  },
  {
    id: 'geometry-prodigy',
    title: 'Prodígio da Geometria',
    description: 'Acerte 50 questões no total',
    icon: Award,
    category: 'geometry',
    tier: 'platinum',
    xpReward: 600,
    condition: { type: 'questions_correct', value: 50 }
  },

  // SPEEDSTER ACHIEVEMENTS
  {
    id: 'speed-of-light',
    title: 'Velocidade da Luz',
    description: 'Complete uma missão em menos de 5 minutos',
    icon: Zap,
    category: 'speedster',
    tier: 'silver',
    xpReward: 250,
    condition: { type: 'fast_completions', value: 1 }
  },
  {
    id: 'speed-demon',
    title: 'Demônio da Velocidade',
    description: 'Complete 5 missões rapidamente (menos de 5 min cada)',
    icon: Flame,
    category: 'speedster',
    tier: 'gold',
    xpReward: 400,
    condition: { type: 'fast_completions', value: 5 }
  },

  // PERFECTIONIST ACHIEVEMENTS
  {
    id: 'perfectionist',
    title: 'Perfeccionista',
    description: 'Complete uma missão com 100% de acerto',
    icon: CheckCircle2,
    category: 'perfectionist',
    tier: 'gold',
    xpReward: 300,
    condition: { type: 'perfect_missions', value: 1 }
  },
  {
    id: 'flawless-five',
    title: 'Cinco Perfeitos',
    description: 'Complete 5 missões com 100% de acerto',
    icon: Star,
    category: 'perfectionist',
    tier: 'platinum',
    xpReward: 600,
    condition: { type: 'perfect_missions', value: 5 }
  },

  // LEGENDARY ACHIEVEMENTS
  {
    id: 'all-missions',
    title: 'Lenda de Euklidia',
    description: 'Complete todas as missões disponíveis',
    icon: Trophy,
    category: 'legendary',
    tier: 'legendary',
    xpReward: 1000,
    condition: { type: 'all_missions_complete', value: 1 },
    secretDescription: 'Complete sua jornada épica e torne-se uma lenda!'
  },
  {
    id: 'xp-master',
    title: 'Mestre do XP',
    description: 'Acumule 5000 pontos de XP',
    icon: Sparkles,
    category: 'legendary',
    tier: 'legendary',
    xpReward: 1500,
    condition: { type: 'xp_earned', value: 5000 },
    secretDescription: 'Acumule pontos de experiência e torne-se um mestre'
  },
  {
    id: 'level-10',
    title: 'Elite Espacial',
    description: 'Alcance o nível 10',
    icon: Crown,
    category: 'legendary',
    tier: 'legendary',
    xpReward: 2000,
    condition: { type: 'level_reached', value: 10 },
    secretDescription: 'Chegue ao topo da hierarquia espacial'
  },
];

// Helper function to get achievement by ID
export function getAchievementById(id: string): Achievement | undefined {
  return achievements.find(a => a.id === id);
}

// Helper function to calculate progress for an achievement
export function calculateAchievementProgress(
  achievement: Achievement,
  userStats: {
    completedMissions: number;
    totalMissions: number;
    unlockedPlanets: number[];
    xp: number;
    level: number;
    perfectMissions?: number;
    fastCompletions?: number;
    questionsCorrect?: { [category: string]: number };
  }
): { current: number; total: number; isUnlocked: boolean } {
  const { condition } = achievement;
  let current = 0;
  const total = condition.value;

  switch (condition.type) {
    case 'missions_completed':
      current = userStats.completedMissions;
      break;
    case 'planets_unlocked':
      current = userStats.unlockedPlanets.length;
      break;
    case 'xp_earned':
      current = userStats.xp;
      break;
    case 'level_reached':
      current = userStats.level;
      break;
    case 'perfect_missions':
      current = userStats.perfectMissions || 0;
      break;
    case 'fast_completions':
      current = userStats.fastCompletions || 0;
      break;
    case 'questions_correct':
      if (condition.category) {
        current = userStats.questionsCorrect?.[condition.category] || 0;
      } else {
        // Total questions correct across all categories
        current = Object.values(userStats.questionsCorrect || {}).reduce((sum, val) => sum + val, 0);
      }
      break;
    case 'all_missions_complete':
      current = userStats.completedMissions >= userStats.totalMissions ? 1 : 0;
      break;
  }

  return {
    current: Math.min(current, total),
    total,
    isUnlocked: current >= total
  };
}

// Category definitions for UI
export const categoryDefinitions = [
  { id: 'all' as AchievementCategory, label: 'Todas', icon: Trophy, color: 'text-purple-400' },
  { id: 'explorer' as AchievementCategory, label: 'Explorador Espacial', icon: Rocket, color: 'text-blue-400' },
  { id: 'geometry' as AchievementCategory, label: 'Mestre da Geometria', icon: Target, color: 'text-green-400' },
  { id: 'speedster' as AchievementCategory, label: 'Velocista Cósmico', icon: Zap, color: 'text-yellow-400' },
  { id: 'perfectionist' as AchievementCategory, label: 'Perfeccionista', icon: CheckCircle2, color: 'text-pink-400' },
  { id: 'legendary' as AchievementCategory, label: 'Lendário', icon: Crown, color: 'text-purple-400' },
];
