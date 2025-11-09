import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Achievement, getAchievementById, tierConfig } from '../data/achievements';
import { useEffect, useState } from 'react';

interface AchievementUnlockedModalProps {
  achievement: Achievement | null | undefined;
  onClose: () => void;
}

export default function AchievementUnlockedModal({ 
  achievement, 
  onClose 
}: AchievementUnlockedModalProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (achievement) {
      setShow(true);
    }
  }, [achievement]);

  if (!achievement) return null;

  const tier = tierConfig[achievement.tier];
  const Icon = achievement.icon;
}