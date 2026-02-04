import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Music,
  Chrome,
  Github,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { api, APIError } from '../lib/api';
import { useAuthStore } from '../stores/useAuthStore';
import { toast } from 'sonner';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post<{ token: string; user: any }>('/auth/login', {
        email,
        password,
      });

      login(response.token, response.user);
      toast.success('Connexion réussie !');
      navigate('/');
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message);
        toast.error(err.message);
      } else {
        setError('Une erreur est survenue.');
        toast.error('Erreur de connexion');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await api.get<{ url: string }>('/auth/google');
      window.location.href = response.url;
    } catch (err) {
      toast.error('Erreur Google Login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0">
        <img 
          src="/img/background.png"
          alt="Background" 
          className="w-full h-full object-cover opacity-100" 
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[4px] z-0" />
      </div> 

      <Link to="/" className="absolute top-8 left-8 z-50 group">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-500 to-white rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-2 rounded-xl shadow-lg">
              <Music className="w-6 h-6 text-white" />
            </div>
          </div>
          <span className="text-2xl font-black text-white">YNOT</span>
        </div>
      </Link>

      <div className="w-full max-w-6xl relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="hidden lg:block space-y-8 animate-fadeIn">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect">
              <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
              <span className="text-sm font-semibold text-slate-300">Plateforme Premium</span>
            </div>

            <h1 className="text-6xl font-black font-display tracking-tighter">
              <span className="block text-white mb-2">Bienvenue sur</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">YNOT Music</span>
            </h1>

            <p className="text-xl text-slate-400 leading-relaxed max-w-md">
              Accédez à des milliers de concerts, réservez vos places et vivez des expériences musicales inoubliables.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: Shield, text: 'Connexion 100% sécurisée' },
              { icon: Sparkles, text: 'Accès illimité aux événements' },
              { icon: Music, text: 'Recommandations personnalisées' },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-center gap-4 p-4 glass-effect rounded-xl">
                  <div className="p-2 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-semibold">{feature.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-black text-white mb-3 font-display uppercase">Connexion</h2>
            <p className="text-slate-400">Entrez vos identifiants pour continuer</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">Adresse email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:border-violet-500/50 outline-none transition-all"
                  placeholder="votre.email@exemple.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-4 text-white focus:border-violet-500/50 outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded bg-white/5 border-white/10 checked:bg-violet-600" />
                <span className="text-sm text-slate-400 group-hover:text-white transition-colors">Se souvenir de moi</span>
              </label>
              <Link to="/forgot-password" size="sm" className="text-sm text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                Oublié ?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-violet-600 hover:text-white transition-all"
            >
              {isLoading ? "CHARGEMENT..." : "SE CONNECTER"}
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-4 bg-slate-950 text-slate-500 font-semibold">Ou continuer avec</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button onClick={handleGoogleLogin} className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:border-violet-500/50 transition-all">
              <Chrome size={20} />
              <span className="text-sm font-bold">Google</span>
            </button>
            <button disabled className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-600 cursor-not-allowed opacity-50">
              <Github size={20} />
              <span className="text-sm font-bold">GitHub</span>
            </button>
          </div>

          <p className="mt-8 text-center text-slate-400">
            Nouveau ici ? <Link to="/register" className="text-violet-400 hover:text-violet-300 font-bold transition-colors">S'inscrire gratuitement</Link>
          </p>
        </div>
      </div>
    </div>
  );
}