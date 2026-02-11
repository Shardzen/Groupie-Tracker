import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Music, ArrowRight, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  // 1. Mise à jour de l'état pour inclure Prénom et Nom
  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    password: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // 2. On envoie les clés exactes que ta table SQL attend désormais
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l’inscription');
      }

     console.log("✅ Utilisateur créé !", data);
navigate('/email-sent'); 
    } catch (error: any) {
      console.error("❌ Erreur API :", error.message);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="min-h-screen bg-slate-950 relative overflow-hidden flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 z-0">
        <img 
          src="/img/background.png" 
          alt="Background" 
          className="w-full h-full object-cover opacity-100" 
        />
      </div>

      <div className="absolute inset-0 bg-black/60 backdrop-blur-[4px] z-0" />

      <Link to="/" className="absolute top-8 left-8 z-50 group">
  <div className="flex items-center gap-3">
    <div className="relative">
      <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-xl group-hover:bg-violet-500/40 transition-all" />
      </div>

    <span className="text-2xl font-black text-white tracking-tighter hidden md:block">
    </span>
  </div>
</Link>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-white mb-3 font-display">Inscription</h2>
            <p className="text-slate-500 font-sans text-xs uppercase tracking-[0.2em]">Bienvenue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-ultra-heavy text-slate-400 uppercase ml-1">Prénom</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-white/30 outline-none text-sm transition-all"
                    placeholder="prénom"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-ultra-heavy text-slate-400 uppercase ml-1">Nom</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-white/30 outline-none text-sm transition-all"
                    placeholder="Nom"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-ultra-heavy text-slate-400 uppercase ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  required
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:border-white/30 outline-none transition-all"
                  placeholder="email@exemple.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-ultra-heavy text-slate-400 uppercase ml-1">Mot de passe</label>
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
              className="w-full bg-white text-black font-ultra-heavy py-5 rounded-xl flex items-center justify-center gap-3 hover:bg-violet-600 hover:text-white transition-all shadow-lg shadow-white/5"
            >
              {isLoading ? "CRÉATION..." : "CRÉER LE COMPTE"}
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
    </motion.div>
  );
}