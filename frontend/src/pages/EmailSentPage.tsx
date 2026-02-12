import { Mail, ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmailSentPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl text-center shadow-2xl">
        <div className="w-20 h-20 bg-violet-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-violet-500/30">
          <Mail className="text-violet-400 w-10 h-10 animate-bounce" />
        </div>
        
        <h1 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">
          Vérifie tes mails !
        </h1>
        
        <p className="text-slate-400 mb-8 leading-relaxed">
          Nous venons d'envoyer un lien de confirmation à ton adresse. 
          Clique dessus pour activer ton compte **YNOT**.
        </p>

        <div className="space-y-4">
   <a 
       href="https://mail.google.com" 
       target="_blank" 
       rel="noopener noreferrer"  // <-- Ajoute cette ligne
       className="w-full bg-white text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
   >
          
            Ouvrir ma boîte mail <ExternalLink size={18} />
          </a>
          
          <Link 
            to="/login" 
            className="flex items-center justify-center gap-2 text-slate-500 hover:text-white text-xs font-bold uppercase transition-colors"
          >
            <ArrowLeft size={14} /> Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}