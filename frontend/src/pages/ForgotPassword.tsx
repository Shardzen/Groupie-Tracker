import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Ajout de AnimatePresence
import { Mail, ArrowLeft, Send, Loader2, CheckCircle2 } from 'lucide-react'; // Ajout de CheckCircle2
import { api } from '../lib/api';
import { toast } from 'sonner';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setIsSent(true);
      toast.success("Demande envoyée !");
    } catch (err) {
      toast.error("Erreur : l'email est introuvable ou le serveur est coupé.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-slate-950">
      <div className="absolute inset-0 z-0">
        <img src="/img/background.png" alt="Background" className="w-full h-full object-cover opacity-100" />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[4px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
          
          {/* TITRE TOUJOURS VISIBLE */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-black text-white mb-3 tracking-tighter uppercase">
              Récupération
            </h2>
          </div>

          <AnimatePresence mode="wait">
            {!isSent ? (
              /* --- LE FORMULAIRE --- */
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit} 
                className="space-y-6"
              >
                <p className="text-slate-400 text-sm text-center">
                  Entre ton email pour recevoir ton lien magique.
                </p>
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:border-white/30 outline-none"
                      placeholder="ton-email@exemple.com"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-white text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-all disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "ENVOYER LE LIEN"}
                </button>
              </motion.form>
            ) : (
              /* --- LE TRUC VERT (Indicateur de succès) --- */
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 px-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-emerald-400 font-black uppercase text-lg">Email envoyé !</h3>
                    <p className="text-emerald-400/70 text-sm mt-1">
                      Veuillez regarder votre boîte mail pour continuer.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Link 
            to="/login" 
            className="flex items-center justify-center gap-2 mt-8 text-slate-500 hover:text-white transition-colors text-xs font-black uppercase"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la connexion
          </Link>
        </div>
      </motion.div>
    </div>
  );
}