import { motion } from 'motion/react';
import { 
  Star, Trophy, Target, Zap, User, Edit2, Lock, Save, X, 
  Award, Rocket, Shield, Sparkles, Crown, Flame, BookOpen,
  Brain, MapPin, Clock, TrendingUp, Check, ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useUser } from '../contexts/UserContext';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import alexImage from 'figma:asset/e94e0884cfa8fcb3ee2ce5737d46528dd558fd87.png';
import lunaImage from 'figma:asset/ba0a2904ecec112bf024ea6e538671a9436702e6.png';
import robotImage from 'figma:asset/d968718c002086b0bde719964755ce6bc6cd6e4c.png';
import alienZyxImage from 'figma:asset/af346811e3c33f3aea4ef5740d6362a49d74acd4.png';
import alienKryvoImage from 'figma:asset/f16b38dcac6395bf5dd60b8a4eda48546c745ab9.png';
import pilotImage from 'figma:asset/e4a81757b3af249f2a402f59195cc71f42a1913c.png';

interface ProfileScreenProps {
  onBack: () => void;
}

// Avatar options
const avatarOptions = [
  { id: 'astronaut-1', image: alexImage, name: 'Astronauta Alex' },
  { id: 'astronaut-2', image: lunaImage, name: 'Astronauta Luna' },
  { id: 'robot', image: robotImage, name: 'Robô Nexar' },
  { id: 'alien-1', image: alienZyxImage, name: 'Alien Zyx' },
  { id: 'alien-2', image: alienKryvoImage, name: 'Alien Kryvo' },
  { id: 'rocket', image: pilotImage, name: 'Piloto Estelar' },
];

// Achievement badges
const achievements = [
  {
    id: 'first-mission',
    name: 'Primeira Missão',
    description: 'Complete sua primeira missão',
    icon: Rocket,
    color: 'from-blue-400 to-cyan-400',
    unlocked: true,
  },
  {
    id: 'triangle-master',
    name: 'Mestre dos Triângulos',
    description: 'Complete todas as missões de Nora',
    icon: Trophy,
    color: 'from-purple-400 to-pink-400',
    unlocked: true,
  },
  {
    id: 'genius',
    name: 'Gênio da Geometria',
    description: 'Acerte 10 questões seguidas',
    icon: Brain,
    color: 'from-yellow-400 to-orange-400',
    unlocked: false,
  },
  {
    id: 'speed-runner',
    name: 'Velocista Espacial',
    description: 'Complete uma missão em menos de 5 minutos',
    icon: Zap,
    color: 'from-green-400 to-emerald-400',
    unlocked: false,
  },
  {
    id: 'champion',
    name: 'Campeão de Euklidia',
    description: 'Complete todas as missões do jogo',
    icon: Crown,
    color: 'from-amber-400 to-yellow-400',
    unlocked: false,
  },
  {
    id: 'explorer',
    name: 'Explorador Galáctico',
    description: 'Desbloqueie todos os planetas',
    icon: MapPin,
    color: 'from-indigo-400 to-purple-400',
    unlocked: false,
  },
];

// Mock data for progress chart
const progressData = [
  { day: 'Seg', xp: 0 },
  { day: 'Ter', xp: 100 },
  { day: 'Qua', xp: 250 },
  { day: 'Qui', xp: 250 },
  { day: 'Sex', xp: 250 },
  { day: 'Sáb', xp: 250 },
  { day: 'Dom', xp: 250 },
];

export default function ProfileScreen({ onBack }: ProfileScreenProps) {
  const { user, updateUserName, updateUserAvatar } = useUser();
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(
    avatarOptions.find(a => a.id === user?.avatar) || avatarOptions[0]
  );
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);

  if (!user) return null;

  const handleSaveName = () => {
    if (newName.trim()) {
      updateUserName(newName.trim());
      setIsEditingName(false);
    }
  };

  const handleAvatarSelect = (avatar: typeof avatarOptions[0]) => {
    setSelectedAvatar(avatar);
    updateUserAvatar(avatar.id);
    setShowAvatarDialog(false);
  };

  const handleCancelEdit = () => {
    setNewName(user.name);
    setIsEditingName(false);
  };

  const xpProgress = (user.xp % 1000) / 1000 * 100;
  const nextLevelXP = 1000;
  const currentLevelXP = user.xp % 1000;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const successRate = user.totalMissions > 0 ? (user.completedMissions / user.totalMissions * 100) : 0;

  // Generate stars for background
  const stars = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    opacity: Math.random() * 0.5 + 0.3,
    delay: Math.random() * 3,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map(star => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
            }}
            animate={{
              opacity: [star.opacity, star.opacity * 0.3, star.opacity],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: star.delay,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            className="text-white/80 hover:text-white hover:bg-white/10"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </motion.div>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 mb-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                {/* Avatar Section */}
                <div className="relative">
                  <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
                    <DialogTrigger asChild>
                      <motion.div
                        className="relative cursor-pointer group"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-6xl relative overflow-hidden">
                          <img src={selectedAvatar.image} alt={selectedAvatar.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Edit2 className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        {/* Level Badge */}
                        <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full w-12 h-12 flex items-center justify-center border-4 border-slate-900">
                          <span className="text-slate-900">{user.level}</span>
                        </div>
                      </motion.div>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-purple-500/30">
                      <DialogHeader>
                        <DialogTitle className="text-white">Escolha seu Avatar</DialogTitle>
                        <DialogDescription className="text-white/70">
                          Selecione um avatar que represente você no Reino da Geometria
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        {avatarOptions.map((avatar) => (
                          <motion.div
                            key={avatar.id}
                            className={`
                              cursor-pointer p-4 rounded-xl border-2 transition-all
                              ${selectedAvatar.id === avatar.id 
                                ? 'border-purple-500 bg-purple-500/20' 
                                : 'border-white/10 bg-white/5 hover:border-purple-500/50 hover:bg-white/10'
                              }
                            `}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAvatarSelect(avatar)}
                          >
                            <div className="w-16 h-16 rounded-lg overflow-hidden mb-2 mx-auto">
                              <img src={avatar.image} alt={avatar.name} className="w-full h-full object-cover" />
                            </div>
                            <p className="text-white text-xs text-center">{avatar.name}</p>
                          </motion.div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* User Info */}
                <div className="flex-1">
                  {/* Name Section */}
                  <div className="mb-4">
                    {isEditingName ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="bg-white/10 border-white/20 text-white max-w-xs"
                          placeholder="Seu nome"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveName();
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-green-400 hover:text-green-300 hover:bg-green-400/10"
                          onClick={handleSaveName}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                          onClick={handleCancelEdit}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <h2 className="text-white">{user.name}</h2>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-white/60 hover:text-white hover:bg-white/10 h-8 w-8"
                          onClick={() => setIsEditingName(true)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    <p className="text-purple-300 mt-1">Explorador de Euklidia</p>
                  </div>

                  {/* XP Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-sm">Nível {user.level}</span>
                      <span className="text-white/70 text-sm">
                        {currentLevelXP} / {nextLevelXP} XP
                      </span>
                    </div>
                    <Progress value={xpProgress} className="h-2" />
                    <p className="text-white/50 text-xs">
                      {nextLevelXP - currentLevelXP} XP para o próximo nível
                    </p>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex gap-4 mt-4">
                    <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <div>
                        <p className="text-white">{user.xp}</p>
                        <p className="text-white/50 text-xs">XP Total</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                      <Trophy className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-white">{user.achievements}</p>
                        <p className="text-white/50 text-xs">Conquistas</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                      <Target className="w-5 h-5 text-cyan-400" />
                      <div>
                        <p className="text-white">{user.completedMissions}/{user.totalMissions}</p>
                        <p className="text-white/50 text-xs">Missões</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs Content - REMOVED */}
      </div>
    </div>
  );
}