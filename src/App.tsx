import { useState } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Alert, AlertDescription } from './components/ui/alert';
import { Loader2, Star, Rocket, Users } from 'lucide-react';
import { motion } from 'motion/react';
import Dashboard from './components/Dashboard';
import { UserProvider, useUser } from './contexts/UserContext';

function AuthPage() {
  const { login, register, loginAsGuest } = useUser();
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setError('');

    const result = await login(loginForm.email, loginForm.password);
    
    if (!result.success) {
      setError(result.message || 'Erro ao fazer login');
    }
    
    setLoginLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterLoading(true);
    setError('');

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('As senhas não coincidem');
      setRegisterLoading(false);
      return;
    }

    if (registerForm.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setRegisterLoading(false);
      return;
    }

    const result = await register(registerForm.username, registerForm.email, registerForm.password);
    
    if (!result.success) {
      setError(result.message || 'Erro ao criar conta');
    }
    
    setRegisterLoading(false);
  };

  const handleGuestLogin = async () => {
    setGuestLoading(true);
    setError('');

    loginAsGuest();
    
    setGuestLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Game Info */}
        <motion.div 
          className="text-center lg:text-left space-y-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center">
              <Star className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white">Kubrick</h1>
              <p className="text-purple-300">Reino da Geometria</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-white">
              Embarque em uma Jornada Espacial de Aprendizado!
            </h2>
            <p className="text-gray-300 leading-relaxed">
              No ano de 3500, o astronauta Alex precisa da sua ajuda para salvar o planeta Euklidia. 
              Domine os segredos da geometria e derrote o vilão Olugan Kryvo!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Rocket className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-white">Missões Interativas</h3>
              <p className="text-sm text-gray-300">Aprenda geometria através de desafios espaciais</p>
            </motion.div>

            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <h3 className="text-white">Sistema de XP</h3>
              <p className="text-sm text-gray-300">Ganhe pontos e suba de nível</p>
            </motion.div>

            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h3 className="text-white">Para 7º Ano</h3>
              <p className="text-sm text-gray-300">Conteúdo alinhado com a BNCC</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Auth Forms */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="text-center">
              <CardTitle className="text-white">Bem-vindo ao Kubrick</CardTitle>
              <CardDescription className="text-gray-300">
                Entre ou crie sua conta para começar a aventura
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {error && (
                <Alert className="mb-4 bg-red-500/20 border-red-500/50">
                  <AlertDescription className="text-red-100">
                    <div className="space-y-2">
                      <p className="font-medium">{error}</p>
                      {error.includes('convidado') && (
                        <p className="text-sm text-red-200">
                          👇 Use o botão abaixo para experimentar o jogo sem criar conta
                        </p>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <Tabs defaultValue="login" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 bg-white/10">
                  <TabsTrigger value="login" className="text-white data-[state=active]:bg-white/20" onClick={() => setError('')}>
                    Entrar
                  </TabsTrigger>
                  <TabsTrigger value="register" className="text-white data-[state=active]:bg-white/20" onClick={() => setError('')}>
                    Registrar
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Input
                        type="email"
                        placeholder="Email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <Input
                        type="password"
                        placeholder="Senha"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      disabled={loginLoading}
                    >
                      {loginLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Entrando...
                        </>
                      ) : (
                        'Entrar'
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <Input
                        type="text"
                        placeholder="Nome de usuário"
                        value={registerForm.username}
                        onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <Input
                        type="email"
                        placeholder="Email"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <Input
                        type="password"
                        placeholder="Senha (mín. 6 caracteres)"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <Input
                        type="password"
                        placeholder="Confirmar senha"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                      disabled={registerLoading}
                    >
                      {registerLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Criando conta...
                        </>
                      ) : (
                        'Criar Conta'
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-6 text-center">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-transparent text-gray-400">ou</span>
                  </div>
                </div>
                
                <Button
                  onClick={handleGuestLogin}
                  variant="outline"
                  className="w-full mt-4 bg-white/5 border-white/20 text-white hover:bg-white/10"
                  disabled={guestLoading}
                >
                  {guestLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    'Entrar como Convidado'
                  )}
                </Button>
                
                <p className="text-xs text-gray-400 mt-2">
                  Experimente o jogo sem criar uma conta
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function AppContent() {
  const { user, loading } = useUser();

  // Show loading while checking session
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white">Carregando...</p>
        </div>
      </div>
    );
  }

  // Show Dashboard if logged in
  if (user) {
    return <Dashboard />;
  }

  return <AuthPage />;
}

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}