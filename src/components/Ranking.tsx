import {
  Crown,
  Trophy,
  Medal,
  Award,
  Star,
  Zap,
  Target,
  ArrowUp,
  ArrowDown,
  Minus,
  Home,
  Map,
  LogOut,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useUser } from "../contexts/UserContext";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import alexImage from "figma:asset/e94e0884cfa8fcb3ee2ce5737d46528dd558fd87.png";
import lunaImage from "figma:asset/ba0a2904ecec112bf024ea6e538671a9436702e6.png";
import robotImage from "figma:asset/d968718c002086b0bde719964755ce6bc6cd6e4c.png";
import alienZyxImage from "figma:asset/af346811e3c33f3aea4ef5740d6362a49d74acd4.png";
import alienKryvoImage from "figma:asset/f16b38dcac6395bf5dd60b8a4eda48546c745ab9.png";
import pilotImage from "figma:asset/e4a81757b3af249f2a402f59195cc71f42a1913c.png";

// Avatar options
const avatarOptions = [
  {
    id: "astronaut-1",
    image: alexImage,
    name: "Astronauta Alex",
  },
  {
    id: "astronaut-2",
    image: lunaImage,
    name: "Astronauta Luna",
  },
  { id: "robot", image: robotImage, name: "Robô Nexar" },
  { id: "alien-1", image: alienZyxImage, name: "Alien Zyx" },
  {
    id: "alien-2",
    image: alienKryvoImage,
    name: "Alien Kryvo",
  },
  { id: "rocket", image: pilotImage, name: "Piloto Estelar" },
];

interface RankingPlayer {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  rank: number;
  change?: "up" | "down" | "same";
}

interface RankingProps {
  onBack: () => void;
}

export default function Ranking({ onBack }: RankingProps) {
  const { user, logout } = useUser();
  const [leaderboard, setLeaderboard] = useState<
    RankingPlayer[]
  >([]);
  const [userRank, setUserRank] = useState<number>(1);

  // Gerar leaderboard mockado
  useEffect(() => {
    if (!user) return;

    const mockPlayers: RankingPlayer[] = [
      {
        id: "1",
        name: "Capitã Stella",
        avatar: "astronaut-2",
        xp: 2450,
        level: 5,
        rank: 1,
        change: "up",
      },
      {
        id: "2",
        name: "Comandante Orion",
        avatar: "rocket",
        xp: 2280,
        level: 4,
        rank: 2,
        change: "same",
      },
      {
        id: "3",
        name: "Piloto Cosmo",
        avatar: "astronaut-1",
        xp: 2150,
        level: 4,
        rank: 3,
        change: "down",
      },
      {
        id: "4",
        name: "Explorador Vega",
        avatar: "robot",
        xp: 1920,
        level: 4,
        rank: 4,
        change: "up",
      },
      {
        id: "5",
        name: "Navegador Sirius",
        avatar: "alien-1",
        xp: 1850,
        level: 3,
        rank: 5,
        change: "same",
      },
      {
        id: "6",
        name: "Astronauta Nova",
        avatar: "astronaut-2",
        xp: 1720,
        level: 3,
        rank: 6,
        change: "up",
      },
      {
        id: "7",
        name: "Cientista Kepler",
        avatar: "robot",
        xp: 1650,
        level: 3,
        rank: 7,
        change: "down",
      },
      {
        id: "8",
        name: "Engenheiro Galileu",
        avatar: "astronaut-1",
        xp: 1580,
        level: 3,
        rank: 8,
        change: "same",
      },
      {
        id: "9",
        name: "Explorador Nebula",
        avatar: "alien-2",
        xp: 1420,
        level: 3,
        rank: 9,
        change: "up",
      },
      {
        id: "10",
        name: "Piloto Andromeda",
        avatar: "rocket",
        xp: 1350,
        level: 2,
        rank: 10,
        change: "down",
      },
    ];

    const currentUserRank: RankingPlayer = {
      id: user.name,
      name: user.name,
      avatar: user.avatar,
      xp: user.xp,
      level: user.level,
      rank: 0, // Rank inicial, será calculado
      change: "same",
    };

    // 1. Garante que o usuário não está duplicado na lista
    const uniquePlayers = mockPlayers.filter(
      (p) => p.id !== user.name,
    );
    const allPlayers = [...uniquePlayers, currentUserRank].sort(
      (a, b) => b.xp - a.xp,
    );

    // 2. Atribui o rank correto, tratando empates
    let currentRank = 0;
    let lastXp = -1;
    const rankedPlayers = allPlayers.map((player, index) => {
      if (player.xp !== lastXp) {
        currentRank = index + 1;
        lastXp = player.xp;
      }
      return { ...player, rank: currentRank };
    });

    // 3. Encontra o rank do usuário atual
    const userFinalRank =
      rankedPlayers.find((p) => p.id === user.name)?.rank || 0;
    setUserRank(userFinalRank);

    setLeaderboard(rankedPlayers);
  }, [user]);

  if (!user) return null;

  // Separa o pódio (Top 3) do resto do ranking
  const podium = leaderboard.filter((p) => p.rank <= 3);
  const restOfRanking = leaderboard.filter((p) => p.rank > 3);

  // Ordena o pódio para a exibição (2º, 1º, 3º)
  const first = podium.find((p) => p.rank === 1);
  const second = podium.find((p) => p.rank === 2);
  const third = podium.find((p) => p.rank === 3);
  const podiumOrder = [second, first, third].filter(
    Boolean,
  ) as RankingPlayer[];

  const getRankBg = (
    position: number,
    isCurrentUser: boolean,
  ) => {
    if (isCurrentUser) {
      return "bg-gradient-to-r from-purple-500/30 to-blue-500/30 border-purple-400/60";
    }
    switch (position) {
      case 1:
        return "bg-gradient-to-r from-yellow-400/30 to-amber-500/30 border-yellow-400/60";
      case 2:
        return "bg-gradient-to-r from-slate-400/30 to-slate-500/30 border-slate-400/60";
      case 3:
        return "bg-gradient-to-r from-orange-400/30 to-amber-600/30 border-orange-400/60";
      default:
        return "bg-white/10 border-white/20";
    }
  };

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-7 h-7 text-yellow-400" />;
      case 2:
        return <Trophy className="w-6 h-6 text-slate-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-400" />;
      default:
        return <div className="w-6 h-6" />; // Placeholder
    }
  };

  const getPlayerAvatar = (avatarId: string) => {
    const avatar = avatarOptions.find((a) => a.id === avatarId);
    return avatar ? avatar.image : alexImage;
  };

  const getChangeIcon = (change?: "up" | "down" | "same") => {
    switch (change) {
      case "up":
        return <ArrowUp className="w-4 h-4 text-green-400" />;
      case "down":
        return <ArrowDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-white/40" />;
    }
  };

  const stars = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    opacity: Math.random() * 0.5 + 0.3,
    delay: Math.random() * 3,
  }));

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white font-sans">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {stars.map((star) => (
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
              opacity: [
                star.opacity,
                star.opacity * 0.3,
                star.opacity,
              ],
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

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Ranking Galáctico
          </h1>
          <p className="text-purple-200 text-lg">
            Veja como você está se saindo comparado aos outros
            exploradores de Euklidia!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10"
        >
          <Card className="bg-black/20 backdrop-blur-md border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3 text-xl">
                <Star className="w-6 h-6 text-yellow-400" />{" "}
                Suas Estatísticas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center h-8 mb-2">
                    {getRankIcon(userRank)}
                  </div>
                  <div className="text-white/80">Posição</div>
                  <div className="text-2xl font-bold text-white">
                    #{userRank}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-center h-8 mb-2">
                    <Zap className="w-7 h-7 text-yellow-400" />
                  </div>
                  <div className="text-white/80">
                    Total de XP
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {user.xp} XP
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-center h-8 mb-2">
                    <Target className="w-7 h-7 text-purple-400" />
                  </div>
                  <div className="text-white/80">Nível</div>
                  <div className="text-2xl font-bold text-white">
                    Nível {user.level}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10"
        >
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            Top 3 Exploradores
          </h2>
          <div className="flex justify-center items-end gap-4">
            {podiumOrder.map((player, index) => {
              const isCurrentUser = player.id === user.name;
              const isFirstPlace = player.rank === 1;
              return (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.4 + index * 0.1,
                  }}
                  className={`w-1/3 max-w-xs ${isFirstPlace ? "order-2" : index === 0 ? "order-1" : "order-3"}`}
                >
                  <Card
                    className={`border-2 backdrop-blur-sm ${getRankBg(player.rank, isCurrentUser)} ${isFirstPlace ? "scale-110 z-10" : ""}`}
                  >
                    <CardContent className="p-4 text-center flex flex-col items-center">
                      <div className="h-8 mb-2 flex items-center justify-center">
                        {getRankIcon(player.rank)}
                      </div>
                      <div
                        className={`mx-auto mb-3 rounded-full overflow-hidden border-4 ${isFirstPlace ? "w-24 h-24 border-yellow-400" : "w-20 h-20 border-white/30"}`}
                      >
                        <img
                          src={getPlayerAvatar(player.avatar)}
                          alt={player.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-lg font-bold text-white mb-1">
                        {player.name}
                      </div>
                      <Badge
                        variant="secondary"
                        className="mb-2 bg-purple-500/50 border-purple-400/50"
                      >
                        Nível {player.level}
                      </Badge>
                      <div className="text-xl font-semibold text-yellow-300 flex items-center justify-center gap-1">
                        <Star className="w-5 h-5" /> {player.xp}{" "}
                        XP
                      </div>
                      {isFirstPlace && (
                        <div className="mt-2 font-bold text-yellow-400">
                          Campeão
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="bg-black/20 backdrop-blur-md border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white text-xl">
                 Ranking Completo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {restOfRanking.map((player, index) => {
                  const isCurrentUser = player.id === user.name;
                  return (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.6 + index * 0.05,
                      }}
                      className={`flex items-center justify-between p-3 rounded-lg border ${getRankBg(player.rank, isCurrentUser)}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 w-12 text-lg font-bold">
                          {player.rank}º{" "}
                          {getChangeIcon(player.change)}
                        </div>
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
                          <img
                            src={getPlayerAvatar(player.avatar)}
                            alt={player.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-white flex items-center gap-2">
                            {player.name}
                            {isCurrentUser && (
                              <Badge className="bg-purple-600 text-xs">
                                Você
                              </Badge>
                            )}
                          </div>
                          <div className="text-white/60 text-sm">
                            Nível {player.level}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-lg font-semibold text-yellow-300">
                        <Star className="w-5 h-5" /> {player.xp}{" "}
                        XP
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="flex justify-between mt-10">
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={onBack}
          >
            <Home className="w-5 h-5 mr-2" /> Início
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={logout}
          >
            <LogOut className="w-5 h-5 mr-2" /> Sair
          </Button>
        </div>
      </div>
    </div>
  );
}