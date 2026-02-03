import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // API call simulation
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 grid-pattern opacity-10"></div>
      </div>

      {/* Logo in top-left */}
      <Link to="/" className="absolute top-8 left-8 z-50 group">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-violet-600 to-purple-600 p-2 rounded-xl shadow-lg">
              <Music className="w-6 h-6 text-white" />
            </div>
          </div>
          <span className="text-2xl font-black gradient-text">YNOT</span>
        </div>
      </Link>

      {/* Main Content */}
      <div className="w-full max-w-6xl relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8 animate-fadeIn">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect">
              <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
              <span className="text-sm font-semibold text-slate-300">
                Plateforme Premium
              </span>
            </div>

            <h1 className="text-6xl font-black text-display">
              <span className="block text-white mb-2">Bienvenue sur</span>
              <span className="block gradient-text">YNOT Music</span>
            </h1>

            <p className="text-xl text-slate-400 leading-relaxed max-w-md">
              Accédez à des milliers de concerts, réservez vos places et vivez des expériences musicales inoubliables.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {[
              { icon: Shield, text: 'Connexion 100% sécurisée' },
              { icon: Sparkles, text: 'Accès illimité aux événements' },
              { icon: Music, text: 'Recommandations personnalisées' },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 glass-effect rounded-xl animate-fadeIn"
                  style={{ animationDelay: `${200 + index * 100}ms` }}
                >
                  <div className="p-2 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-semibold">{feature.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="glass-card rounded-3xl p-8 md:p-12 shadow-2xl animate-fadeInScale">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-black text-white mb-2 text-display">
              Connexion
            </h2>
            <p className="text-slate-400">
              Entrez vos identifiants pour continuer
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-slate-300">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@exemple.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-slate-300">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded bg-white/5 border border-white/10 checked:bg-violet-600 checked:border-violet-600 transition-all"
                />
                <span className="text-sm text-slate-400 group-hover:text-white transition-colors">
                  Se souvenir de moi
                </span>
              </label>
              <a href="#" className="text-sm text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                Mot de passe oublié ?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="spinner w-5 h-5 border-2"></div>
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <>
                  <span className="font-bold">Se connecter</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-900 text-slate-500 font-semibold">
                Ou continuer avec
              </span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/50 text-white font-semibold transition-all duration-300 group">
              <Chrome className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Google</span>
            </button>
            <button className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/50 text-white font-semibold transition-all duration-300 group">
              <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>GitHub</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-slate-400">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-violet-400 hover:text-violet-300 font-bold transition-colors">
              S'inscrire gratuitement
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
