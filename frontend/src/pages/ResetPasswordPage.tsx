import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import { toast } from 'sonner';
import { motion } from 'framer-motion'; // Pour l'animation d'entrée

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!token) return toast.error("Le lien est invalide");

  setIsLoading(true);
  try {

    await api.post('/auth/reset-password', { token, new_password: newPassword });
    

    toast.success("Mot de passe mis à jour ! Redirection...");

    setTimeout(() => {
      navigate('/login');
    }, 2000);

  } catch (err) {
    const message = err instanceof APIError ? err.message : "Le lien a expiré ou est déjà utilisé.";
    toast.error(message);
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      

      <div className="absolute inset-0 z-0">
        <img 
          src="/img/background.png" 
          alt="Background" 
          className="w-full h-full object-cover opacity-100" 
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[4px]" />
      </div>

      {/* --- CARTE AVEC ANIMATION --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-violet-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-violet-500/30">
              <ShieldCheck className="w-8 h-8 text-violet-400" />
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
              Nouveau mot de passe
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Sécurise ton compte avec un nouveau secret.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase ml-1">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-4 text-white outline-none focus:border-white/30"
                  placeholder="••••••••"
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full bg-white text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-all shadow-xl shadow-white/5 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "VALIDER LE CHANGEMENT"
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}