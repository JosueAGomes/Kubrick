import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { achievements, calculateAchievementProgress, UserAchievement } from '../data/achievements';

interface User {
  id: string;
  name: string;
  email: string;
  isGuest: boolean;
  xp: number;
  level: number;
  achievements: number;
  completedMissions: number;
  totalMissions: number;
  hasStartedJourney: boolean;
  unlockedPlanets: number[];
  avatar?: string;
  perfectMissions?: number;
  fastCompletions?: number;
  questionsCorrect?: { [category: string]: number };
}

interface UserContextType {
  user: User | null;
  userAchievements: UserAchievement[];
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  loginAsGuest: () => void;
  logout: () => Promise<void>;
  updateUserProgress: (xp: number, completedMissions: number) => Promise<void>;
  unlockPlanet: (planetId: number) => void;
  completeMission: (missionXP: number, stats?: MissionStats) => void;
  updateUserName: (name: string) => void;
  updateUserAvatar: (avatarId: string) => void;
  unlockAchievement: (achievementId: string) => Promise<boolean>;
  checkAchievements: () => Promise<string[]>;
  isAchievementUnlocked: (achievementId: string) => boolean;
}

interface MissionStats {
  isPerfect?: boolean;
  isFast?: boolean;
  questionsCorrect?: { [category: string]: number };
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-0eaab711`;

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  // Load achievements when user changes
  useEffect(() => {
    if (user && !user.isGuest) {
      loadAchievements();
    }
  }, [user?.id]);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        setAccessToken(session.access_token);
        await fetchUserProfile(session.access_token);
        // Load achievements after profile is loaded
        await loadAchievements(session.access_token);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setUser({
          ...data.user,
          isGuest: false,
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const loadAchievements = async (token?: string) => {
    if (!accessToken && !token) return;

    try {
      const response = await fetch(`${API_URL}/achievements`, {
        headers: {
          'Authorization': `Bearer ${token || accessToken}`,
        },
      });

      const data = await response.json();
      console.log('Loaded achievements:', data);

      if (data.success) {
        setUserAchievements(data.achievements);
      }
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (data.session) {
        setAccessToken(data.session.access_token);
        await fetchUserProfile(data.session.access_token);
        // Load achievements after profile is loaded
        await loadAchievements(data.session.access_token);
        return { success: true };
      }

      return { success: false, message: 'Erro ao fazer login' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Erro ao fazer login' };
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      console.log('=== STARTING REGISTRATION ===');
      console.log('Email:', email);
      console.log('Username:', username);
      console.log('API URL:', API_URL);
      
      // Try server route FIRST - it can auto-confirm email
      console.log('Attempting server signup with auto-confirmation...');
      
      let serverResponse;
      let serverData;
      
      try {
        serverResponse = await fetch(`${API_URL}/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ username, email, password }),
        });

        serverData = await serverResponse.json();
        console.log('=== SERVER RESPONSE ===');
        console.log('Status:', serverResponse.status);
        console.log('OK:', serverResponse.ok);
        console.log('Data:', JSON.stringify(serverData, null, 2));
      } catch (fetchError) {
        console.error('=== SERVER FETCH ERROR ===');
        console.error('Error:', fetchError);
        console.log('Falling back to frontend signup due to server error...');
        
        // If server is completely unreachable, skip to fallback
        serverResponse = null;
        serverData = null;
      }

      if (serverResponse && serverResponse.ok && serverData && serverData.success) {
        console.log('✅ Account created via server successfully! Attempting login...');
        
        // Now try to login with the created account
        const loginResult = await login(email, password);
        
        if (loginResult.success) {
          console.log('Login successful after server signup!');
          return { success: true };
        }
        
        // If login fails, provide helpful message
        return {
          success: false,
          message: 'Conta criada com sucesso! Tente fazer login agora.'
        };
      }

      // If server failed, check if it's because user already exists
      if (serverData && serverData.message && (
        serverData.message.includes('já está cadastrado') || 
        serverData.message.includes('already exists') ||
        serverData.message.includes('already registered')
      )) {
        console.log('User already exists, suggesting login...');
        return {
          success: false,
          message: 'Este email já está cadastrado. Tente fazer login ou use outro email.'
        };
      }

      // If server route failed for other reasons, log and continue to fallback
      console.log('Server signup failed:', serverData ? serverData.message || 'Unknown error' : 'Unknown error');
      console.log('Falling back to frontend signup...');
      
      // Fallback: Use Supabase signup directly (may require email confirmation)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username
          }
        }
      });

      console.log('Signup response data:', data);
      console.log('Signup response error:', error);

      if (error) {
        console.error('Signup error:', error);
        
        // Provide clear error messages
        let errorMessage = 'Erro ao criar conta. ';
        
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          errorMessage = 'Este email já está cadastrado. Tente fazer login ou use outro email.';
        } else if (error.message.includes('invalid email')) {
          errorMessage = 'Email inválido. Por favor, verifique o email digitado.';
        } else if (error.message.includes('password')) {
          errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
        } else {
          errorMessage += error.message;
        }
        
        return { success: false, message: errorMessage };
      }

      // Check if user was created (even without session for email confirmation)
      if (!data.user) {
        console.error('No user returned from signup:', data);
        return { 
          success: false, 
          message: 'Erro ao criar conta. Use o modo convidado para experimentar o jogo.' 
        };
      }

      console.log('User created:', data.user.id);
      console.log('Session:', data.session);

      // If no session (email confirmation required), try to use the server route instead
      if (!data.session) {
        console.log('No session returned - email confirmation may be required. Trying server route...');
        
        // Use server route that auto-confirms email
        const serverResponse = await fetch(`${API_URL}/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password }),
        });

        const serverData = await serverResponse.json();
        console.log('Server signup response status:', serverResponse.ok);
        console.log('Server signup response data:', serverData);
        console.log('Server signup message:', serverData.message);
        console.log('Server signup success:', serverData.success);

        // Check if server had authorization error
        if (serverData.code === 401 || (serverData.message && serverData.message.includes('authorization'))) {
          console.log('Server authorization error - user may already exist. Attempting direct login...');
          
          // The user was already created in the first attempt, try to login
          const loginResult = await login(email, password);
          
          if (loginResult.success) {
            console.log('Login successful after server error!');
            return { success: true };
          }
          
          // If login fails, it means email confirmation is required
          console.log('Login failed - email confirmation may be required');
          return {
            success: false,
            message: 'Sua conta foi criada, mas não foi possível ativá-la automaticamente. Por favor, use o modo convidado para experimentar o jogo enquanto isso. Você poderá criar uma conta completa depois.'
          };
        }

        if (!serverResponse.ok || !serverData.success) {
          // Check if it's because user already exists (from the first signup attempt)
          if (serverData.message && (
            serverData.message.includes('já está cadastrado') || 
            serverData.message.includes('already exists') ||
            serverData.message.includes('already registered')
          )) {
            console.log('User already exists, trying to login...');
            const loginResult = await login(email, password);
            if (loginResult.success) {
              return { success: true };
            }
          }
          
          return {
            success: false,
            message: serverData.message || 'Não foi possível criar sua conta no momento. Por favor, use o modo convidado para experimentar o jogo!'
          };
        }

        // Now try to login
        console.log('Account created via server, attempting login...');
        const loginResult = await login(email, password);
        
        if (!loginResult.success) {
          return {
            success: false,
            message: 'Conta criada, mas houve um erro ao fazer login. Tente fazer login manualmente ou use o modo convidado.'
          };
        }
        
        return loginResult;
      }

      // We have a session, initialize user data
      console.log('User created with session successfully:', data.user.id);
      
      // Initialize user data in backend
      const initResponse = await fetch(`${API_URL}/initialize-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.session.access_token}`,
        },
        body: JSON.stringify({ username }),
      });

      const initData = await initResponse.json();
      console.log('User initialization response:', initData);

      if (!initData.success) {
        console.error('Failed to initialize user data:', initData);
        return {
          success: false,
          message: 'Conta criada, mas houve um erro ao inicializar seus dados. Tente fazer login.'
        };
      }

      // Auto login after successful registration
      setAccessToken(data.session.access_token);
      await fetchUserProfile(data.session.access_token);
      await loadAchievements(data.session.access_token);

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: 'Erro de conexão. Verifique sua internet e tente novamente, ou entre como convidado para experimentar o jogo.' 
      };
    }
  };

  const loginAsGuest = () => {
    // Load guest data from localStorage or create new guest
    const guestData = localStorage.getItem('guestUser');
    
    if (guestData) {
      const parsedGuest = JSON.parse(guestData);
      setUser(parsedGuest);
      
      // Load guest achievements
      const guestAchievements = localStorage.getItem('guestAchievements');
      if (guestAchievements) {
        setUserAchievements(JSON.parse(guestAchievements));
      }
    } else {
      const newGuest: User = {
        id: 'guest-' + Date.now(),
        name: 'Visitante',
        email: 'guest@example.com',
        isGuest: true,
        xp: 0,
        level: 1,
        achievements: 0,
        completedMissions: 0,
        totalMissions: 3,
        hasStartedJourney: false,
        unlockedPlanets: [],
        perfectMissions: 0,
        fastCompletions: 0,
        questionsCorrect: {},
      };
      
      setUser(newGuest);
      localStorage.setItem('guestUser', JSON.stringify(newGuest));
      localStorage.setItem('guestAchievements', JSON.stringify([]));
    }
    
    setLoading(false);
  };

  const logout = async () => {
    if (!user?.isGuest) {
      await supabase.auth.signOut();
      setAccessToken(null);
    } else {
      localStorage.removeItem('guestUser');
      localStorage.removeItem('guestAchievements');
    }
    setUser(null);
    setUserAchievements([]);
  };

  const updateUserProgress = async (xp: number, completedMissions: number) => {
    if (!user) return;

    const updatedUser = { ...user, xp, completedMissions };
    setUser(updatedUser);

    if (!user.isGuest && accessToken) {
      try {
        await fetch(`${API_URL}/update-progress`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ xp, completedMissions }),
        });
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    } else if (user.isGuest) {
      localStorage.setItem('guestUser', JSON.stringify(updatedUser));
    }

    // Check for new achievements
    await checkAchievements();
  };

  const unlockPlanet = (planetId: number) => {
    if (!user) return;

    const updatedPlanets = user.unlockedPlanets.includes(planetId)
      ? user.unlockedPlanets
      : [...user.unlockedPlanets, planetId];

    const updatedUser = { ...user, unlockedPlanets: updatedPlanets };
    setUser(updatedUser);

    if (!user.isGuest && accessToken) {
      fetch(`${API_URL}/unlock-planet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ planetId }),
      }).catch(error => console.error('Error unlocking planet:', error));
    } else if (user.isGuest) {
      localStorage.setItem('guestUser', JSON.stringify(updatedUser));
    }

    // Check for new achievements
    checkAchievements();
  };

  const completeMission = async (missionXP: number, stats?: MissionStats) => {
    if (!user) return;

    const newXP = user.xp + missionXP;
    const newLevel = Math.floor(newXP / 1000) + 1;
    const newCompletedMissions = user.completedMissions + 1;

    const updatedUser = {
      ...user,
      xp: newXP,
      level: newLevel,
      completedMissions: newCompletedMissions,
      hasStartedJourney: true,
    };

    setUser(updatedUser);

    if (!user.isGuest && accessToken) {
      try {
        // Update mission completion
        await fetch(`${API_URL}/complete-mission`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ missionXP }),
        });

        // Update mission stats if provided
        if (stats) {
          const response = await fetch(`${API_URL}/update-mission-stats`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(stats),
          });

          const data = await response.json();
          if (data.success) {
            setUser(prev => prev ? { ...prev, ...data.user } : null);
          }
        }
      } catch (error) {
        console.error('Error completing mission:', error);
      }
    } else if (user.isGuest) {
      // Update guest stats
      const guestUpdated = {
        ...updatedUser,
        perfectMissions: stats?.isPerfect ? (user.perfectMissions || 0) + 1 : user.perfectMissions,
        fastCompletions: stats?.isFast ? (user.fastCompletions || 0) + 1 : user.fastCompletions,
        questionsCorrect: {
          ...(user.questionsCorrect || {}),
          ...(stats?.questionsCorrect || {})
        }
      };
      setUser(guestUpdated);
      localStorage.setItem('guestUser', JSON.stringify(guestUpdated));
    }

    // Check for new achievements
    await checkAchievements();
  };

  const updateUserName = (name: string) => {
    if (!user) return;

    const updatedUser = { ...user, name };
    setUser(updatedUser);

    if (!user.isGuest && accessToken) {
      fetch(`${API_URL}/update-name`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name }),
      }).catch(error => console.error('Error updating name:', error));
    } else if (user.isGuest) {
      localStorage.setItem('guestUser', JSON.stringify(updatedUser));
    }
  };

  const updateUserAvatar = (avatarId: string) => {
    if (!user) return;

    const updatedUser = { ...user, avatar: avatarId };
    setUser(updatedUser);

    if (!user.isGuest && accessToken) {
      fetch(`${API_URL}/update-avatar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ avatarId }),
      }).catch(error => console.error('Error updating avatar:', error));
    } else if (user.isGuest) {
      localStorage.setItem('guestUser', JSON.stringify(updatedUser));
    }
  };

  const isAchievementUnlocked = (achievementId: string): boolean => {
    return userAchievements.some(a => a.achievementId === achievementId);
  };

  const unlockAchievement = async (achievementId: string): Promise<boolean> => {
    if (!user) return false;

    // Check if already unlocked
    if (isAchievementUnlocked(achievementId)) {
      return false;
    }

    const newAchievement: UserAchievement = {
      achievementId,
      unlockedDate: new Date().toISOString(),
    };

    const updatedAchievements = [...userAchievements, newAchievement];
    setUserAchievements(updatedAchievements);

    // Update achievement count
    const updatedUser = { ...user, achievements: updatedAchievements.length };
    setUser(updatedUser);

    if (!user.isGuest && accessToken) {
      try {
        const response = await fetch(`${API_URL}/unlock-achievement`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ achievementId }),
        });

        const data = await response.json();
        return data.success && data.isNew;
      } catch (error) {
        console.error('Error unlocking achievement:', error);
        return false;
      }
    } else if (user.isGuest) {
      localStorage.setItem('guestAchievements', JSON.stringify(updatedAchievements));
      localStorage.setItem('guestUser', JSON.stringify(updatedUser));
      return true;
    }

    return false;
  };

  const checkAchievements = async (): Promise<string[]> => {
    if (!user) return [];

    const newlyUnlocked: string[] = [];

    for (const achievement of achievements) {
      // Skip if already unlocked
      if (isAchievementUnlocked(achievement.id)) {
        continue;
      }

      // Calculate progress
      const { isUnlocked } = calculateAchievementProgress(achievement, {
        completedMissions: user.completedMissions,
        totalMissions: user.totalMissions,
        unlockedPlanets: user.unlockedPlanets,
        xp: user.xp,
        level: user.level,
        perfectMissions: user.perfectMissions,
        fastCompletions: user.fastCompletions,
        questionsCorrect: user.questionsCorrect,
      });

      // Unlock if condition met
      if (isUnlocked) {
        const wasUnlocked = await unlockAchievement(achievement.id);
        if (wasUnlocked) {
          newlyUnlocked.push(achievement.id);
        }
      }
    }

    return newlyUnlocked;
  };

  const value: UserContextType = {
    user,
    userAchievements,
    loading,
    login,
    register,
    loginAsGuest,
    logout,
    updateUserProgress,
    unlockPlanet,
    completeMission,
    updateUserName,
    updateUserAvatar,
    unlockAchievement,
    checkAchievements,
    isAchievementUnlocked,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}