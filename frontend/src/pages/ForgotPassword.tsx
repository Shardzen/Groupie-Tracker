import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send, Loader2 } from 'lucide-react'; // Ajout de Loader2
import { api } from '../lib/api'; // Import de ton instance API
import { toast } from 'sonner';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // État pour le chargement

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // On lance le chargement

    try {
      // ON APPELLE LE BACKEND ICI
      await api.post('/auth/forgot-password', { email });
      
      // Si ça réussit, on affiche le message de succès
      setIsSent(true);
      toast.success("Demande traitée !");
    } catch (err) {
      // Si ça rate (ex: serveur éteint ou 404)
      toast.error("Impossible de joindre le serveur.");
      console.error(err);
    } finally {
      setIsLoading(false); // On arrête le chargement quoi qu'il arrive
    }
  };

  return (
    <motion.div 
      // ... (tes animations et style restent les mêmes)
    >
      {/* ... (ton background et ta structure restent les mêmes) */}

      <div className="w-full max-w-md relative z-10">
        <div className="glass-card rounded-3xl p-8 md:p-10 shadow-6xl bg-white/5 backdrop-blur-xl border border-white/10">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-black text-white mb-3 font-display">MOT DE PASSE OUBLIÉ ?</h2>
            <p className="text-slate-400 text-sm">calma calma ! Entre ton email et on t'envoie un lien magique.</p>
          </div>

          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-display text-slate-400 uppercase ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:border-violet-500/50 outline-none transition-all"
                    placeholder="ton-email@exemple.com"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-white text-black font-black py-4 flex items-center justify-center gap-2 group hover:bg-slate-200 transition-all rounded-xl disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>ENVOYER LE LIEN</span>
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-4">
              <div className="bg-green-500/10 text-green-400 p-4 rounded-xl mb-6 text-sm border border-green-500/20">
                Check tes mails ! Le lien est en route. 🚀
              </div>
            </motion.div>
          )}

          <Link to="/login" className="flex items-center justify-center gap-2 mt-8 text-slate-500 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Retour à la connexion
          </Link>
        </div>
      </div>
    </motion.div>
  );
}