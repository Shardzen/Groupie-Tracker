import { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, Chrome, Github, ArrowRight } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api, APIError } from '../lib/api';
import { useAuthStore } from '../stores/useAuthStore';
import { toast } from 'sonner';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuthStore();

  // States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ LOGIQUE DE CAPTURE DU TOKEN GOOGLE
  useEffect(() => {
    const token = searchParams.get('token');
    const userJson = searchParams.get('user');

    if (token && userJson) {
      try {
        const userData = JSON.parse(decodeURIComponent(userJson));
        login(token, userData);
        toast.success('Ravi de vous revoir via Google !');
        navigate('/');
      } catch (err) {
        console.error("Erreur parsing Google User:", err);
        toast.error("Erreur lors de la connexion Google");
      }
    }
  }, [searchParams, login, navigate]);

  // Connexion Classique (Email/Password)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await api.post<{ token: string; user: any }>('/auth/login', { email, password });
      login(response.token, response.user);
      toast.success('Ravi de vous revoir !');
      navigate('/'); 
    } catch (err) {
      const message = err instanceof APIError ? err.message : 'Identifiants invalides';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ LOGIQUE DU BOUTON GOOGLE
  const handleGoogleLogin = () => {
    const isDev = import.meta.env.DEV;
    let googleAuthUrl: string;

    if (isDev) {
      googleAuthUrl = `/api/auth/google`;
    } else {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      googleAuthUrl = baseUrl ? `${baseUrl}/api/auth/google` : `/api/auth/google`;
    }
    window.location.href = googleAuthUrl;
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src="/img/background.png" alt="Background" className="w-full h-full object-cover opacity-100" />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[4px] z-0" />
      </div>

      <div className="w-full max-w-6xl relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="hidden lg:block space-y-8">
          <h1 className="text-6xl font-black tracking-tighter text-white">
            Bienvenue sur <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">YNOT Music</span>
          </h1>
          <p className="text-xl text-slate-400">Accédez à vos concerts préférés en un clic.</p>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
          <h2 className="text-4xl font-black text-white mb-8 uppercase text-center">Connexion</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white outline-none focus:border-violet-500 transition-colors" 
                  placeholder="email@exemple.com" 
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-4 text-white outline-none focus:border-violet-500 transition-colors" 
                  placeholder="••••••••" 
                  required 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded bg-white/10 border-white/20" />
                <span className="text-xs text-slate-400 font-bold uppercase">Se souvenir</span>
              </label>
              <Link to="/forgot-password" size="sm" className="text-xs text-slate-400 hover:text-white font-bold uppercase transition-colors">Oublié ?</Link>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-white text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-violet-500 hover:text-white transition-all">
              {isLoading ? "CHARGEMENT..." : "SE CONNECTER"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="relative my-8 text-center">
            <span className="px-4 bg-transparent text-[10px] uppercase font-black text-slate-500">Ou continuer avec</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button"
              onClick={handleGoogleLogin} 
              className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
            >
              <Chrome size={18} />
              <span className="text-xs font-black uppercase">Google</span>
            </button>
            <button disabled className="opacity-30 cursor-not-allowed flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white">
              <Github size={18} />
              <span className="text-xs font-black uppercase">GitHub</span>
            </button>
          </div>

          <p className="mt-8 text-center text-slate-500 text-xs font-bold uppercase">
            Nouveau ? <Link to="/register" className="text-violet-400 hover:underline ml-1">Créer un compte</Link>
          </p>
        </div>
      </div>
    </div>
  );
}