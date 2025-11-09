import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, Star, Zap, Target, Rocket, Award, Lock, 
  ChevronLeft, Sparkles, Medal, Crown, Shield, Map,
  Clock, CheckCircle2, TrendingUp, Users, Brain, Flame
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import {  
  achievements, 
  tierConfig, 
  AchievementCategory,
  AchievementTier,
  categoryDefinitions,
  calculateAchievementProgress
} from '../data/achievements';

interface AchievementsScreenProps {
  onBack: () => void;
  onNavigateToKnowledgeMap?: () => void;
  onNavigateToProfile?: () => void;
}

export default function AchievementsScreen({ onBack, onNavigateToKnowledgeMap, onNavigateToProfile }: AchievementsScreenProps) {
  const { user, userAchievements, isAchievementUnlocked } = useUser();
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory>('all');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);
  const [selectedAchievementId, setSelectedAchievementId] = useState<string | null>(null);

  if (!user) return null;

  // Filter achievements
  const filteredAchievements = achievements.filter(achievement => {
    const categoryMatch = selectedCategory === 'all' || achievement.category === selectedCategory;
    const unlocked = isAchievementUnlocked(achievement.id);
    const unlockedMatch = !showUnlockedOnly || unlocked;
    return categoryMatch && unlockedMatch;
  });

  // Calculate statistics
  const totalAchievements = achievements.length;
  const unlockedAchievements = achievements.filter(a => isAchievementUnlocked(a.id)).length;
  const totalXP = userAchievements.reduce((sum, ua) => {
    const achievement = achievements.find(a => a.id === ua.achievementId);
    return sum + (achievement?.xpReward || 0);
  }, 0);
  const progressPercentage = (unlockedAchievements / totalAchievements) * 100;

  // Count by tier
  const tierCounts = {
    bronze: achievements.filter(a => a.tier === 'bronze' && isAchievementUnlocked(a.id)).length,
    silver: achievements.filter(a => a.tier === 'silver' && isAchievementUnlocked(a.id)).length,
    gold: achievements.filter(a => a.tier === 'gold' && isAchievementUnlocked(a.id)).length,
    platinum: achievements.filter(a => a.tier === 'platinum' && isAchievementUnlocked(a.id)).length,
    legendary: achievements.filter(a => a.tier === 'legendary' && isAchievementUnlocked(a.id)).length,
  };

  const selectedAchievement = selectedAchievementId ? achievements.find(a => a.id === selectedAchievementId) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-purple-300 hover:text-white hover:bg-purple-500/20"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white">Conquistas</h1>
                <p className="text-xs text-purple-300">Suas realizações épicas</p>
              </div>
            </div>
          </div>

          {/* Statistics Header */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl text-white">{unlockedAchievements}/{totalAchievements}</p>
                    <p className="text-xs text-white/70">Desbloqueadas</p>
                  </div>
                  <Trophy className="w-8 h-8 text-yellow-400" />
                </div>
                <Progress value={progressPercentage} className="h-1 mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl text-white">{totalXP}</p>
                    <p className="text-xs text-white/70">XP de Conquistas</p>
                  </div>
                  <Sparkles className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl text-white">{progressPercentage.toFixed(0)}%</p>
                    <p className="text-xs text-white/70">Progresso Total</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-1">
                  {Object.entries(tierCounts).map(([tier, count]) => (
                    <div key={tier} className={`flex items-center space-x-1 ${tierConfig[tier as AchievementTier].textColor}`}>
                      <Medal className="w-4 h-4" />
                      <span className="text-xs">{count}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-white/70 mt-1">Por Tier</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Category Filters */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white">Categorias</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
              className={`${
                showUnlockedOnly 
                  ? 'bg-purple-600 text-white border-purple-600' 
                  : 'bg-white/10 text-white/70 border-white/20'
              }`}
            >
              {showUnlockedOnly ? 'Mostrar Todas' : 'Apenas Desbloqueadas'}
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {categoryDefinitions.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              const count = achievements.filter(a => 
                category.id === 'all' ? true : a.category === category.id
              ).length;
              const unlockedCount = achievements.filter(a => 
                (category.id === 'all' ? true : a.category === category.id) && isAchievementUnlocked(a.id)
              ).length;

              return (
                <motion.div
                  key={category.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    onClick={() => setSelectedCategory(category.id)}
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-purple-600/30 border-purple-500/50 shadow-lg shadow-purple-500/20'
                        : 'bg-white/10 border-white/20 hover:bg-white/15'
                    }`}
                  >
                    <CardContent className="p-4 text-center">
                      <Icon className={`w-6 h-6 mx-auto mb-2 ${category.color}`} />
                      <p className="text-sm text-white mb-1">{category.label}</p>
                      <p className="text-xs text-white/50">{unlockedCount}/{count}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Achievements Grid */}
        <div>
          <h3 className="text-white mb-4">
            {selectedCategory === 'all' ? 'Todas as Conquistas' : categoryDefinitions.find(c => c.id === selectedCategory)?.label}
            <span className="text-white/50 ml-2">({filteredAchievements.length})</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredAchievements.map((achievement, index) => {
                const Icon = achievement.icon;
                const tier = tierConfig[achievement.tier];
                
                // Calculate progress dynamically
                const progressData = calculateAchievementProgress(achievement, {
                  completedMissions: user.completedMissions,
                  totalMissions: user.totalMissions,
                  unlockedPlanets: user.unlockedPlanets,
                  xp: user.xp,
                  level: user.level,
                  perfectMissions: user.perfectMissions,
                  fastCompletions: user.fastCompletions,
                  questionsCorrect: user.questionsCorrect,
                });
                
                const progress = (progressData.current / progressData.total) * 100;
                
                // Get unlock date if unlocked
                const userAchievement = userAchievements.find(ua => ua.achievementId === achievement.id);
                const unlockedDate = userAchievement ? new Date(userAchievement.unlockedDate).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short'
                }) : null;

                return (
                  <motion.div
                    key={achievement.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      onClick={() => setSelectedAchievementId(achievement.id)}
                      className={`relative cursor-pointer transition-all overflow-hidden ${
                        isAchievementUnlocked(achievement.id)
                          ? `bg-gradient-to-br ${tier.color}/10 border-${tier.borderColor} hover:shadow-lg ${tier.glowColor}`
                          : 'bg-black/40 border-white/10 hover:bg-black/50'
                      }`}
                    >
                      {/* Background pattern */}
                      {isAchievementUnlocked(achievement.id) && (
                        <div className="absolute inset-0 opacity-5">
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                        </div>
                      )}

                      <CardContent className="p-6 relative">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${
                            isAchievementUnlocked(achievement.id)
                              ? `bg-gradient-to-br ${tier.color}`
                              : 'bg-white/5'
                          }`}>
                            {isAchievementUnlocked(achievement.id) ? (
                              <Icon className="w-7 h-7 text-white" />
                            ) : (
                              <Lock className="w-7 h-7 text-white/30" />
                            )}
                          </div>

                          <Badge
                            className={`${
                              isAchievementUnlocked(achievement.id)
                                ? `${tier.bgColor} ${tier.textColor} border-${tier.borderColor}`
                                : 'bg-white/5 text-white/30 border-white/10'
                            }`}
                          >
                            {tier.label}
                          </Badge>
                        </div>

                        <h4 className={`mb-2 ${isAchievementUnlocked(achievement.id) ? 'text-white' : 'text-white/40'}`}>
                          {isAchievementUnlocked(achievement.id) ? achievement.title : '???'}
                        </h4>

                        <p className={`text-sm mb-3 ${isAchievementUnlocked(achievement.id) ? 'text-white/70' : 'text-white/30'}`}>
                          {isAchievementUnlocked(achievement.id) 
                            ? achievement.description 
                            : (achievement.secretDescription || '???')}
                        </p>

                        {/* Progress bar */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className={isAchievementUnlocked(achievement.id) ? 'text-white/70' : 'text-white/30'}>
                              Progresso
                            </span>
                            <span className={isAchievementUnlocked(achievement.id) ? 'text-white/90' : 'text-white/40'}>
                              {progressData.current}/{progressData.total}
                            </span>
                          </div>
                          <Progress 
                            value={progress} 
                            className={`h-1.5 ${isAchievementUnlocked(achievement.id) ? '' : 'opacity-30'}`}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className={`flex items-center space-x-1 ${isAchievementUnlocked(achievement.id) ? tier.textColor : 'text-white/30'}`}>
                            <Zap className="w-4 h-4" />
                            <span className="text-sm">+{achievement.xpReward} XP</span>
                          </div>

                          {isAchievementUnlocked(achievement.id) && unlockedDate && (
                            <div className="flex items-center space-x-1 text-white/50">
                              <Clock className="w-3 h-3" />
                              <span className="text-xs">{unlockedDate}</span>
                            </div>
                          )}
                        </div>

                        {/* Unlock animation sparkles */}
                        {isAchievementUnlocked(achievement.id) && achievement.tier === 'legendary' && (
                          <motion.div
                            className="absolute top-2 right-2"
                            animate={{
                              rotate: [0, 360],
                              scale: [1, 1.2, 1],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            <Sparkles className="w-5 h-5 text-purple-400" />
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Next Achievements Section */}
        <div className="mt-12">
          <h3 className="text-white mb-4 flex items-center space-x-2">
            <Target className="w-5 h-5 text-purple-400" />
            <span>Próximas Conquistas</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements
              .filter(a => !isAchievementUnlocked(a.id))
              .map(a => {
                const progressData = calculateAchievementProgress(a, {
                  completedMissions: user.completedMissions,
                  totalMissions: user.totalMissions,
                  unlockedPlanets: user.unlockedPlanets,
                  xp: user.xp,
                  level: user.level,
                  perfectMissions: user.perfectMissions,
                  fastCompletions: user.fastCompletions,
                  questionsCorrect: user.questionsCorrect,
                });
                return {
                  achievement: a,
                  progressData,
                  progressPercent: (progressData.current / progressData.total) * 100
                };
              })
              .filter(item => item.progressData.current > 0)
              .sort((a, b) => b.progressPercent - a.progressPercent)
              .slice(0, 3)
              .map(({ achievement, progressData, progressPercent }) => {
                const Icon = achievement.icon;
                const tier = tierConfig[achievement.tier];
                const remaining = progressData.total - progressData.current;

                return (
                  <Card key={achievement.id} className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-10 h-10 ${tier.bgColor} rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${tier.textColor}`} />
                        </div>
                        <div className="flex-1">
                          <h5 className="text-white text-sm">{achievement.title}</h5>
                          <p className="text-xs text-white/50">Faltam apenas {remaining}!</p>
                        </div>
                      </div>
                      <Progress value={progressPercent} className="h-2 mb-2" />
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/70">{progressData.current}/{progressData.total}</span>
                        <span className={tier.textColor}>{progressPercent.toFixed(0)}%</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            }
          </div>
        </div>
      </main>

      {/* Achievement Detail Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedAchievementId(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full"
            >
              <Card className={`${
                isAchievementUnlocked(selectedAchievement.id)
                  ? `bg-gradient-to-br ${tierConfig[selectedAchievement.tier].color}/20 border-${tierConfig[selectedAchievement.tier].borderColor}`
                  : 'bg-black/60 border-white/20'
              }`}>
                <CardHeader className="text-center pb-4">
                  <div className={`w-24 h-24 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                    isAchievementUnlocked(selectedAchievement.id)
                      ? `bg-gradient-to-br ${tierConfig[selectedAchievement.tier].color} shadow-2xl ${tierConfig[selectedAchievement.tier].glowColor}`
                      : 'bg-white/5'
                  }`}>
                    {isAchievementUnlocked(selectedAchievement.id) ? (
                      <selectedAchievement.icon className="w-12 h-12 text-white" />
                    ) : (
                      <Lock className="w-12 h-12 text-white/30" />
                    )}
                  </div>

                  <Badge className={`mx-auto mb-3 ${
                    isAchievementUnlocked(selectedAchievement.id)
                      ? `${tierConfig[selectedAchievement.tier].bgColor} ${tierConfig[selectedAchievement.tier].textColor}`
                      : 'bg-white/5 text-white/30'
                  }`}>
                    {tierConfig[selectedAchievement.tier].label}
                  </Badge>

                  <CardTitle className={isAchievementUnlocked(selectedAchievement.id) ? 'text-white' : 'text-white/40'}>
                    {isAchievementUnlocked(selectedAchievement.id) ? selectedAchievement.title : '???'}
                  </CardTitle>
                  <CardDescription className={isAchievementUnlocked(selectedAchievement.id) ? 'text-white/70' : 'text-white/30'}>
                    {isAchievementUnlocked(selectedAchievement.id) 
                      ? selectedAchievement.description 
                      : (selectedAchievement.secretDescription || 'Conquista secreta. Continue jogando para descobrir!')}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {selectedAchievement.total && (
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-white/70">Progresso</span>
                        <span className="text-white">{selectedAchievement.current}/{selectedAchievement.total}</span>
                      </div>
                      <Progress 
                        value={(selectedAchievement.current! / selectedAchievement.total) * 100} 
                        className="h-2"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <span className="text-white/70">Recompensa</span>
                    <div className={`flex items-center space-x-1 ${
                      isAchievementUnlocked(selectedAchievement.id)
                        ? tierConfig[selectedAchievement.tier].textColor
                        : 'text-white/30'
                    }`}>
                      <Zap className="w-5 h-5" />
                      <span>+{selectedAchievement.xpReward} XP</span>
                    </div>
                  </div>

                  {isAchievementUnlocked(selectedAchievement.id) && selectedAchievement.unlockedDate && (
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <span className="text-white/70">Desbloqueada em</span>
                      <span className="text-white">{selectedAchievement.unlockedDate}</span>
                    </div>
                  )}

                  <Button
                    onClick={() => setSelectedAchievementId(null)}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Fechar
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}