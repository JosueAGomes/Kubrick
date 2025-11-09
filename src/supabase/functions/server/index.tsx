import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Helper function to get user data
async function getUserData(userId: string) {
  const userData = await kv.get(`user:${userId}`);
  if (!userData) {
    // Initialize new user data
    const newUserData = {
      id: userId,
      xp: 0,
      level: 1,
      achievements: 0,
      completedMissions: 0,
      totalMissions: 3,
      unlockedPlanets: [],
      hasStartedJourney: false,
      perfectMissions: 0,
      fastCompletions: 0,
      questionsCorrect: {},
      createdAt: new Date().toISOString()
    };
    await kv.set(`user:${userId}`, newUserData);
    return newUserData;
  }
  // Ensure all fields exist for existing users
  if (!userData.unlockedPlanets) {
    userData.unlockedPlanets = [];
  }
  if (userData.hasStartedJourney === undefined) {
    userData.hasStartedJourney = false;
  }
  if (!userData.perfectMissions) {
    userData.perfectMissions = 0;
  }
  if (!userData.fastCompletions) {
    userData.fastCompletions = 0;
  }
  if (!userData.questionsCorrect) {
    userData.questionsCorrect = {};
  }
  return userData;
}

// Sign up route
app.post('/make-server-0eaab711/signup', async (c) => {
  try {
    console.log('=== SIGNUP REQUEST RECEIVED ===');
    console.log('Time:', new Date().toISOString());
    
    // Check environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    console.log('Environment check:');
    console.log('- SUPABASE_URL exists:', !!supabaseUrl);
    console.log('- SUPABASE_URL value:', supabaseUrl);
    console.log('- SERVICE_ROLE_KEY exists:', !!serviceRoleKey);
    console.log('- SERVICE_ROLE_KEY length:', serviceRoleKey?.length || 0);
    console.log('- SERVICE_ROLE_KEY prefix:', serviceRoleKey?.substring(0, 30) + '...');
    
    if (!supabaseUrl || !serviceRoleKey) {
      console.log('❌ ERROR: Missing environment variables');
      return c.json({ 
        success: false, 
        message: 'Configuração do servidor incompleta. Use o modo convidado para experimentar o jogo.' 
      }, 500);
    }
    
    const { username, email, password } = await c.req.json();
    console.log('📧 Signup request for:');
    console.log('- Email:', email);
    console.log('- Username:', username);
    console.log('- Password length:', password?.length || 0);

    if (!username || !email || !password) {
      console.log('Missing fields - username:', !!username, 'email:', !!email, 'password:', !!password);
      return c.json({ success: false, message: 'Todos os campos são obrigatórios' }, 400);
    }

    if (password.length < 6) {
      console.log('Password too short:', password.length);
      return c.json({ success: false, message: 'A senha deve ter pelo menos 6 caracteres' }, 400);
    }

    console.log('Creating admin client with service role key...');
    
    // Create a new admin client specifically for this request
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    console.log('Admin client created, calling createUser...');
    
    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      user_metadata: { username },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Signup error from Supabase Auth API:`, JSON.stringify(error));
      
      // Provide user-friendly error messages
      let userMessage = error.message;
      if (error.message.includes('already registered') || error.message.includes('already exists')) {
        userMessage = 'Este email já está cadastrado. Tente fazer login ou use outro email.';
      } else if (error.message.includes('invalid email')) {
        userMessage = 'Email inválido. Por favor, verifique o email digitado.';
      } else if (error.message.includes('authorization')) {
        userMessage = 'Erro de autenticação no servidor. Use o modo convidado para experimentar o jogo.';
      }
      
      return c.json({ success: false, message: userMessage }, 400);
    }

    console.log('User created successfully with ID:', data.user.id);

    // Initialize user data in KV store
    const userData = {
      id: data.user.id,
      username,
      email,
      xp: 0,
      level: 1,
      achievements: 0,
      completedMissions: 0,
      totalMissions: 3,
      unlockedPlanets: [],
      hasStartedJourney: false,
      perfectMissions: 0,
      fastCompletions: 0,
      questionsCorrect: {},
      createdAt: new Date().toISOString()
    };

    console.log('Saving user data to KV store...');
    await kv.set(`user:${data.user.id}`, userData);
    console.log('User data saved successfully');

    return c.json({ 
      success: true, 
      message: 'Conta criada com sucesso!',
      user: {
        id: data.user.id,
        name: username,
        email,
        xp: 0,
        level: 1,
        achievements: 0,
        completedMissions: 0,
        totalMissions: 3,
        unlockedPlanets: [],
        hasStartedJourney: false
      }
    });
  } catch (err) {
    console.log(`Signup error (catch block): ${err}`);
    console.log(`Error stack: ${err.stack}`);
    return c.json({ 
      success: false, 
      message: 'Erro ao criar conta. Tente novamente ou entre como convidado.' 
    }, 500);
  }
});

// Initialize user after signup (called from frontend after Supabase signup)
app.post('/make-server-0eaab711/initialize-user', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ success: false, message: 'Token não fornecido' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.log(`Authorization error while initializing user: ${error?.message}`);
      return c.json({ success: false, message: 'Não autorizado' }, 401);
    }

    const { username } = await c.req.json();

    console.log('Initializing user:', user.id, 'with username:', username);

    // Check if user data already exists
    const existingData = await kv.get(`user:${user.id}`);
    
    if (!existingData) {
      // Initialize user data in KV store
      const userData = {
        id: user.id,
        username: username || user.email?.split('@')[0] || 'Usuário',
        email: user.email,
        xp: 0,
        level: 1,
        achievements: 0,
        completedMissions: 0,
        totalMissions: 3,
        unlockedPlanets: [],
        hasStartedJourney: false,
        perfectMissions: 0,
        fastCompletions: 0,
        questionsCorrect: {},
        createdAt: new Date().toISOString()
      };

      await kv.set(`user:${user.id}`, userData);
      console.log('User data initialized successfully');

      return c.json({ success: true, user: userData });
    }

    console.log('User data already exists');
    return c.json({ success: true, user: existingData });
  } catch (err) {
    console.log(`Initialize user error: ${err}`);
    return c.json({ success: false, message: 'Erro ao inicializar usuário' }, 500);
  }
});

// Get user profile
app.get('/make-server-0eaab711/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ success: false, message: 'Token não fornecido' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.log(`Authorization error while getting user profile: ${error?.message}`);
      return c.json({ success: false, message: 'Não autorizado' }, 401);
    }

    const userData = await getUserData(user.id);

    return c.json({
      success: true,
      user: {
        id: user.id,
        name: user.user_metadata?.username || user.email?.split('@')[0] || 'Usuário',
        email: user.email,
        ...userData
      }
    });
  } catch (err) {
    console.log(`Profile fetch error: ${err}`);
    return c.json({ success: false, message: 'Erro ao buscar perfil' }, 500);
  }
});

// Update user progress
app.post('/make-server-0eaab711/update-progress', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ success: false, message: 'Token não fornecido' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.log(`Authorization error while updating progress: ${error?.message}`);
      return c.json({ success: false, message: 'Não autorizado' }, 401);
    }

    const { xp, completedMissions } = await c.req.json();

    const userData = await getUserData(user.id);
    
    // Calculate new level based on XP
    const newLevel = Math.floor(xp / 1000) + 1;
    
    const updatedData = {
      ...userData,
      xp,
      level: newLevel,
      completedMissions,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`user:${user.id}`, updatedData);

    return c.json({ success: true, user: updatedData });
  } catch (err) {
    console.log(`Progress update error: ${err}`);
    return c.json({ success: false, message: 'Erro ao atualizar progresso' }, 500);
  }
});

// Complete mission
app.post('/make-server-0eaab711/complete-mission', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ success: false, message: 'Token não fornecido' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.log(`Authorization error while completing mission: ${error?.message}`);
      return c.json({ success: false, message: 'Não autorizado' }, 401);
    }

    const { missionXP } = await c.req.json();

    const userData = await getUserData(user.id);
    
    // Calculate new XP and level
    const newXP = userData.xp + missionXP;
    const newLevel = Math.floor(newXP / 1000) + 1;
    
    const updatedData = {
      ...userData,
      xp: newXP,
      level: newLevel,
      completedMissions: userData.completedMissions + 1,
      hasStartedJourney: true,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`user:${user.id}`, updatedData);

    return c.json({ success: true, user: updatedData });
  } catch (err) {
    console.log(`Mission completion error: ${err}`);
    return c.json({ success: false, message: 'Erro ao completar missão' }, 500);
  }
});

// Unlock planet
app.post('/make-server-0eaab711/unlock-planet', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ success: false, message: 'Token não fornecido' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.log(`Authorization error while unlocking planet: ${error?.message}`);
      return c.json({ success: false, message: 'Não autorizado' }, 401);
    }

    const { planetId } = await c.req.json();

    const userData = await getUserData(user.id);
    
    // Check if planet is already unlocked
    if (!userData.unlockedPlanets.includes(planetId)) {
      const updatedData = {
        ...userData,
        unlockedPlanets: [...userData.unlockedPlanets, planetId],
        updatedAt: new Date().toISOString()
      };

      await kv.set(`user:${user.id}`, updatedData);

      return c.json({ success: true, user: updatedData });
    }

    return c.json({ success: true, user: userData });
  } catch (err) {
    console.log(`Planet unlock error: ${err}`);
    return c.json({ success: false, message: 'Erro ao desbloquear planeta' }, 500);
  }
});

// Update user name
app.post('/make-server-0eaab711/update-name', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ success: false, message: 'Token não fornecido' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.log(`Authorization error while updating name: ${error?.message}`);
      return c.json({ success: false, message: 'Não autorizado' }, 401);
    }

    const { name } = await c.req.json();

    if (!name || name.trim() === '') {
      return c.json({ success: false, message: 'Nome inválido' }, 400);
    }

    const userData = await getUserData(user.id);
    
    const updatedData = {
      ...userData,
      name: name.trim(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(`user:${user.id}`, updatedData);

    return c.json({ success: true, user: updatedData });
  } catch (err) {
    console.log(`Name update error: ${err}`);
    return c.json({ success: false, message: 'Erro ao atualizar nome' }, 500);
  }
});

// Update user avatar
app.post('/make-server-0eaab711/update-avatar', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ success: false, message: 'Token não fornecido' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.log(`Authorization error while updating avatar: ${error?.message}`);
      return c.json({ success: false, message: 'Não autorizado' }, 401);
    }

    const { avatarId } = await c.req.json();

    if (!avatarId || avatarId.trim() === '') {
      return c.json({ success: false, message: 'Avatar inválido' }, 400);
    }

    const userData = await getUserData(user.id);
    
    const updatedData = {
      ...userData,
      avatar: avatarId.trim(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(`user:${user.id}`, updatedData);

    return c.json({ success: true, user: updatedData });
  } catch (err) {
    console.log(`Avatar update error: ${err}`);
    return c.json({ success: false, message: 'Erro ao atualizar avatar' }, 500);
  }
});

// Get user achievements
app.get('/make-server-0eaab711/achievements', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ success: false, message: 'Token não fornecido' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.log(`Authorization error while getting achievements: ${error?.message}`);
      return c.json({ success: false, message: 'Não autorizado' }, 401);
    }

    const userAchievements = await kv.get(`user:${user.id}:achievements`) || [];

    return c.json({ success: true, achievements: userAchievements });
  } catch (err) {
    console.log(`Get achievements error: ${err}`);
    return c.json({ success: false, message: 'Erro ao buscar conquistas' }, 500);
  }
});

// Unlock achievement
app.post('/make-server-0eaab711/unlock-achievement', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ success: false, message: 'Token não fornecido' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.log(`Authorization error while unlocking achievement: ${error?.message}`);
      return c.json({ success: false, message: 'Não autorizado' }, 401);
    }

    const { achievementId } = await c.req.json();

    if (!achievementId) {
      return c.json({ success: false, message: 'Achievement ID não fornecido' }, 400);
    }

    // Get existing achievements
    const userAchievements = await kv.get(`user:${user.id}:achievements`) || [];
    
    // Check if already unlocked
    const alreadyUnlocked = userAchievements.some((a: any) => a.achievementId === achievementId);
    
    if (!alreadyUnlocked) {
      const newAchievement = {
        achievementId,
        unlockedDate: new Date().toISOString()
      };
      
      const updatedAchievements = [...userAchievements, newAchievement];
      await kv.set(`user:${user.id}:achievements`, updatedAchievements);

      // Update user achievement count
      const userData = await getUserData(user.id);
      const updatedUserData = {
        ...userData,
        achievements: updatedAchievements.length,
        updatedAt: new Date().toISOString()
      };
      await kv.set(`user:${user.id}`, updatedUserData);

      return c.json({ 
        success: true, 
        achievements: updatedAchievements,
        isNew: true 
      });
    }

    return c.json({ 
      success: true, 
      achievements: userAchievements,
      isNew: false 
    });
  } catch (err) {
    console.log(`Unlock achievement error: ${err}`);
    return c.json({ success: false, message: 'Erro ao desbloquear conquista' }, 500);
  }
});

// Update mission stats (for achievement tracking)
app.post('/make-server-0eaab711/update-mission-stats', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ success: false, message: 'Token não fornecido' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.log(`Authorization error while updating mission stats: ${error?.message}`);
      return c.json({ success: false, message: 'Não autorizado' }, 401);
    }

    const { isPerfect, isFast, questionsCorrect } = await c.req.json();

    const userData = await getUserData(user.id);
    
    const updatedData = {
      ...userData,
      perfectMissions: isPerfect ? (userData.perfectMissions || 0) + 1 : userData.perfectMissions,
      fastCompletions: isFast ? (userData.fastCompletions || 0) + 1 : userData.fastCompletions,
      questionsCorrect: {
        ...userData.questionsCorrect,
        ...questionsCorrect
      },
      updatedAt: new Date().toISOString()
    };

    await kv.set(`user:${user.id}`, updatedData);

    return c.json({ success: true, user: updatedData });
  } catch (err) {
    console.log(`Update mission stats error: ${err}`);
    return c.json({ success: false, message: 'Erro ao atualizar estatísticas' }, 500);
  }
});

// Health check
app.get('/make-server-0eaab711/health', (c) => {
  return c.json({ status: 'ok', message: 'Kubrick API is running' });
});

Deno.serve(app.fetch);