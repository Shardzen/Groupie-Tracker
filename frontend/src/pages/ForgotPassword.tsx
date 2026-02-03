import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Plus tard, on appellera ton API Go ici
    setIsSent(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="glass-card rounded-3xl p-8 md:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white mb-3 font-display">
              MOT DE PASSE OUBLIÉ ?
            </h2>
            <p className="text-slate-400 text-sm">
              Pas de panique ! Entre ton email et on t'envoie un lien magique.
            </p>
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
                    placeholder="ton@email.com"
                  />
                </div>
              </div>

              <button type="submit" className="w-full btn-primary py-4 flex items-center justify-center gap-2 group">
                <span className="font-bold">ENVOYER LE LIEN</span>
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-4"
            >
              <div className="bg-green-500/10 text-green-400 p-4 rounded-xl mb-6 text-sm border border-green-500/20">
                Check tes mails ! Le lien est en route. 🚀
              </div>
            </motion.div>
          )}

          <Link to="/login" className="flex items-center justify-center gap-2 mt-8 text-slate-500 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Retour à la connexion
          </Link>
        </div>
      </div>
    </motion.div>
  );
}