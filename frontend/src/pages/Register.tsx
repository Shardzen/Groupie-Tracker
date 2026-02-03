import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Music, ArrowRight, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulation d'inscription
    setTimeout(() => {
      setIsLoading(false);
      navigate('/login'); // Redirige vers le login après inscription
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Image */}
<div className="absolute inset-0 z-0">
<div className="absolute inset-0 flex items-center justify-center z-0">
  <img 
    src="/img/background.png" 
    alt="Background" 
    className="w-[100%] h-[100%] object-contain opacity-40" 
  />
</div>
  {/* Le dégradé par-dessus pour le style "sombre" */}
 
</div>
      <Link to="/" className="absolute top-8 left-8 z-50 flex items-center gap-3">
        <div className="bg-white p-2 rounded-xl"><Music className="w-6 h-6 text-black" /></div>
        <span className="text-2xl font-ultra-heavy text-white">YNOT</span>
      </Link>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-10">
           <h2 className="text-5xl font-display italic text-white mb-2">S'INSCRIRE</h2>
            <p className="text-slate-500 font-sans text-xs uppercase tracking-[0.2em]">Bienvenue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-1">
              <label className="text-[10px] font-ultra-heavy text-slate-400 uppercase ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  required
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:border-white/30 outline-none transition-all"
                  placeholder="nom "
                />
              </div>
            </div>
            

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-ultra-heavy text-slate-400 uppercase ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  required
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:border-white/30 outline-none transition-all"
                  placeholder="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-ultra-heavy text-slate-400 uppercase ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-4 text-white focus:border-white/30 outline-none transition-all"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black font-ultra-heavy py-5 rounded-xl flex items-center justify-center gap-3 hover:bg-violet-600 hover:text-white transition-all"
            >
              {isLoading ? "CREATION..." : "CREER LE COMPTE"}
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link to="/login" className="text-[10px] font-ultra-heavy text-slate-500 hover:text-white transition-colors uppercase tracking-widest">
              Déjà un compte ? Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
